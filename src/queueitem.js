/**
*  @file queueitem.js
*  @author Liqueur de Toile <contact@liqueurdetoile.com>
*  @licence AGPL-3.0-only {@link https://spdx.org/licenses/AGPL-3.0-only.html}
*/

import ObjectArray from 'dot-object-array';

export default class QueueItem {
  constructor(type, beloader, options) {
    const _this = this;
    let loader;

    this.beloader = beloader;
    options = new ObjectArray(options);
    this.progress = new ObjectArray();
    this.state = {
      waiting: true,
      pending: false,
      loaded: false,
      error: false,
      abort: false,
      timeout: false,
      processed: false,
      resolved: false,
      ready: false
    };

    this.id = options.data.id;
    this.async = options.data.async;
    this.defer = options.data.defer;
    if (typeof options.data.awaiting !== 'undefined') {
      if (options.data.awaiting instanceof Array) this.awaiting = options.data.awaiting;
      else this.awaiting = [options.data.awaiting];
    }

    // Set promise property
    this.promise = new Promise((resolve, reject) => {
      _this._resolve = resolve;
      _this._reject = reject;
    });

    // Import loader
    switch (type) {
      case 'webfont':
      case 'font':
        loader = 'FontLoader';
        break;
      case 'js':
      case 'script':
      case 'javascript':
        loader = 'ScriptLoader';
        break;
      case 'style':
      case 'styles':
      case 'stylesheet':
      case 'css':
        loader = 'StylesheetLoader';
        break;
      default:
        // Custom type loader
        // Must expose a promise property
        if (options.data.loader instanceof Function) {
          options.data.loader(this, options).then(
            function () {},
            function (error) {
              _this.error = error;
            }
          ).then(() => _this.fire.call(_this, 'loadend'));;
        } else if (options.data.loader) throw new TypeError('BeLoader : Custom type loader is not a callback');
        else throw new TypeError('BeLoader : No loader for assets with type ' + type);
    }

    if (loader) {
      import(
        /* webpackChunkName: "[request]" */
        'loaders/' + loader
      ).then(function (Loader) {
        _this.loader = new Loader.default(_this, options); // eslint-disable-line

        _this.loader.promise.then(
          function () {},
          function (error) {
            _this.error = error;
          }
        ).then(() => _this.fire.call(_this, 'loadend'));
      });
    }
  }

  fire(eventName, event = null) {
    let cb, eventCallbackName = 'on' + eventName;

    // Fire at item level
    if (this[eventCallbackName] instanceof Function) this[eventCallbackName](this, event);
    if ((cb = this.loader.options.pull('on.' + eventName)) instanceof Function) cb(this, event);

    // Bubbles down to loader level in loader context
    if (this.loader[eventCallbackName] instanceof Function) {
      this.loader[eventCallbackName].call(this.loader, this, event);
    }

    // Bubbles up to beloader level in beloader context
    this.beloader.fire.call(this.beloader, eventName, this, event);
  }

  onloadstart(item) {
    let start = +new Date();

    // Update state
    item.state.waiting = false;
    item.state.pending = true;

    // Initialize loading statistics
    item.progress.push('start', start);
    item.progress.push('details', [{
      timestamp: start,
      duration: 0,
      chunked: 0,
      chunkrate: 0,
      elapsed: 0,
      loaded: 0,
      rate: 0,
      complete: 0
    }]);
    item.progress.push('loaded', 0);
  }

  onload(item) {
    // Update state
    item.state.loaded = true;
    // Update data loading progress
    item.progress.data.complete = 100;
  }

  onerror(item) {
    item.state.error = true;
  }

  onabort(item) {
    item.state.abort = true;
  }

  ontimeout(item) {
    item.state.timeout = true;
  }

  onloadend(item) {
    // Update state
    item.state.pending = false;
    item.state.processed = true;

    item.progress.push('end', +new Date());
    item.progress.push('elapsed', item.progress.data.end - item.progress.data.start);
  }

  onready(item) {
    if (item.id) {
      // Update awaitables
      item.beloader._awaitables[item.id] = true;
      // Relaunch onloadend on beloader to trigger waiting dependents
      item.beloader.onloadend();
    }
  }

  onprogress(item, ev) {
    let t = +new Date();
    let pt = item.progress.data.details[item.progress.data.details.length - 1];
    let details;

    // Update total
    if (ev.lengthComputable) item.progress.push('total', ev.total);

    // Store step detail
    details = {
      timestamp: t,
      duration: t - pt.timestamp, // milliseconds
      chunked: ev.loaded - pt.loaded, // Bytes
      chunkrate: (ev.loaded - pt.loaded) / ((t - pt.timestamp) / 1000), // Bytes/s
      elapsed: t - item.progress.data.start, // milliseconds
      loaded: ev.loaded, // Bytes
      rate: ev.loaded / ((t - item.progress.data.start) / 1000), // Bytes/s
      complete: (item.progress.data.total ? (ev.loaded / item.progress.data.total) * 100 : 0) // Percent
    };

    item.progress.data.details.push(details);

    // Update globals instant state
    item.progress.push('elapsed', details.elapsed);
    item.progress.push('loaded', details.loaded);
    item.progress.push('rate', details.rate);
    item.progress.push('complete', details.complete);
  }
}
