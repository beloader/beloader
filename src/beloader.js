/**
*  @file beloader.js
*  @author Liqueur de Toile <contact@liqueurdetoile.com>
*  @licence AGPL-3.0-only {@link https://spdx.org/licenses/AGPL-3.0-only.html}
*/

/**
*  @external {DotObjectArray} https://liqueurdetoile.github.io/DotObjectArray/
*/

/**
*  Stores a BeLoader instance real time progress
*
*  @typedef {DotObjectArray}  BeloaderProgress
*/

import 'es6-promise/auto';
import ObjectArray from 'dot-object-array';
import QueueItem from 'queueitem';

/**
*  Highly customizable and lightweight assets loader based on
*  dynamic imports with splash screen, animated blocks and more
*
*  You can create as many loaders instance as needed. Between one instance, you can access
*  specific loaders or functionnalities and order loading sequence with the use
*  of defer or awaiting options, see {@link Beloader#add}.
*
*  @version 1.0.0
*  @since 1.0.0
*  @author Liqueur de Toile <contact@liqueurdetoile.com>
*  @license AGPL-3.0-only
*
*  @example
*  var loader = new Beloader();
*
*  // Display a text only when font is ready to avoit FOUT
*  // It relies on webfontloader
*  loader.fetch('font', {
*    webfont: {
*      google: {
*        families: ['Droid Sans', 'Droid Serif']
*      }
*    }
*  }).then(function() {
*    document.body.innerHTML += '<div style="font-family:\'Droid Sans\'">Fixture</div>';
*  });
*
*  // ********************
*  // Load external libraries and only run custom script when they're loaded
*  // *********************
*
*  // Example with defer
*  // Not the best use case because the two external libraries don't depend on each other
*  // Lodash loading will not resolve until elementify resolved
*  loader.fetch('script', {
*    url: 'https://cdn.jsdelivr.net/npm/elementify@latest',
*    defer: true;
*  });
*
*  loader.fetch('script', {
*    url: 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.5/lodash.min.js',
*    defer: true;
*  });
*
*  loader.fetch('script', {
*   url: 'myscript',
*   defer: true
*  });
*
*  // Example with await
*  // More suitable to optimize loading
*  loader.fetch('script', {
*   url: 'myscript',
*   awaiting: ['elementify', 'lodash']
*  });
*
*  loader.fetch('script', {
*    id: 'elementify',
*    url: 'https://cdn.jsdelivr.net/npm/elementify@latest'
*  });
*
*  loader.fetch('script', {
*    id: 'lodash',
*    url: 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.5/lodash.min.js'
*  });
*
*/
export class Beloader {
  /**
  *  Beloader constructor
  *
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @returns {Beloader} Beloader instance
  */
  constructor(options = {}) {
    /**
    *  List of queued items in Beloader instance
    *
    *  @since 1.0.0
    *  @type {Array}
    *
    */
    this._items = [];

    /**
    *  List of named queued items in Beloader instance
    *
    *  @since 1.0.0
    *  @type {Object}
    */
    this._awaitables = {};

    /**
    *  Options for the Beloader instance. See {@link Beloader#constructor}
    *
    *  @since 1.0.0
    *  @type {DotObjectArray}
    */
    this.options = new ObjectArray(options);

    /**
    *  Progress statistics for the Beloader instance.
    *
    *  @since 1.0.0
    *  @type {BeloaderProgress}
    */
    this.progress = new ObjectArray({
      items: {
        total: 0,
        waiting: 0,
        pending: 0,
        processed: 0,
        loaded: 0,
        error: 0,
        abort: 0,
        timeout: 0,
        ready: 0
      },
      loading: {
        complete: 0,
        elapsed: 0,
        loaded: 0,
        rate: 0
      }
    });
  }

  /**
  *  Add an item to the loading queue and return a promise
  *
  *  An item is resolved (or failed) under several conditions :
  *  - Item have been loaded
  *  - Item is ready (webfontloader for instance)
  *  - If deferred, all previously defferred items in the queue are resolved
  *  - If awaiting items, all required items are resolved
  *
  *  Supported types relies on loaders that may accept/require specific options :
  *  - `font`, `webfont` : {@link FontLoader}
  *  - `css`, `style`, `styles`, `stylesheet` : {@link StylesheetLoader}
  *  - `js`, `javascript` : {@link ScriptLoader}
  *
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @param {!String} type  Type of item to load (see above)
  *
  *  @param {Object|DotObjectArray} [options] Options (see below)
  *
  *  @param {Boolean} [options.async=true]
  *  __Async / Sync mode__
  *
  *  If set to `true`, Beloader will try to load asset asynchronously.
  *
  *  @param {Boolean}  [options.fallbackSync=true]
  *  __Fallback when async loading fails__
  *
  *  If async loading failed, Beloader will try
  *  to load asset synchronously if this mode is available in the used loader.
  *
  *  It can be useful when dealing with CORS issues.
  *
  *
  *  @param {String} [options.id]
  *  __ID for naming the item__
  *
  *  It can then be used with the awaiting option (see below).
  *
  *  @param {String|Array} [options.awaiting]
  *  __Dependency ID or array of dependencies IDs__
  *
  *  This loading mode forces Beloader to resolve items only
  *
  *  The item will not be resolved until each declared dependency is previously resolved.
  *
  *  _You must take care of avoiding any circular dependency that may lead to
  *  a never resolved item. Beloader doesn't check ID's validity. A typo error may also
  *  lead to a never resolved item._
  *
  *  @param {Boolean} [options.defer=false]
  *  __Defer loading mode__
  *
  *  This mode forces Beloader to resolve deferred items in the same order that they have
  *  been added to the queue. It is possible to mix loading modes in a same queue.
  *
  *  If `true`, Beloader will resolve the item only when previous
  *  declared items with `defer` option set to true are resolved
  *
  *  @param {Object}  [options.xhr]
  *  __XHR options__
  *
  *  See {@link AbstractLoader#async}
  *
  *  @param {Function|Object} [options.loader]
  *  __Custom loader or loader(s) override__
  *
  *  When using this option with a custom type, Beloader will run the provided
  *  callback and pass the QueueItem and options as parameters (see {@link QueueItem#constructor}).
  *
  *  When using this option with a registered type, Beloader will look for a callback in
  *  `options.loader.async` to override async loader
  *  (see {@link AbstractLoader#async}) and/or `options.loader.sync` to override
  *  sync loader (see {@link AbstractLoader#sync}).
  *
  *  Provided callbacks must return a Promise and, optionnaly, trigger events at item level
  *
  *  @return {QueueItem} Item queued
  */
  fetch(type, options = {}) {
    let item;

    options = new ObjectArray(options);
    options.define('async', true);
    options.define('defer', false);
    options.define('fallbackSync', true);

    item = new QueueItem(type, this, options);
    this._items.push(item);
    if (options.data.id) this._awaitables[options.data.id] = false;
    this.fire('itemAdded', item);

    this.progress.push('items.total', this._items.length);
    this.progress.push('items.waiting', this.progress.pull('items.waiting') + 1);

    return item;
  }

  fetchAll(items) {
    let queuedItems = [];
    let promises = [];

    items = new ObjectArray(items);
    items.forEach(function (options, type) {
      let item = this.fetch(type, options);

      queuedItems.push(item);
      promises.push(item.promise);
    }.bind(this));

    queuedItems.promise = Promise.all(promises);
    return queuedItems;
  }

  fire(eventName, item, event = null) {
    let cb, eventCallbackName = 'on' + eventName;

    item = item || this;
    // Private callbacks
    if (this[eventCallbackName] instanceof Function) this[eventCallbackName].call(this, item, event);
    // User-defined callbacks
    if ((cb = this.options.pull('on.' + eventName)) instanceof Function) cb.call(this, item, event);
    // Plugins bubbling (plugin context)
    if (this.options.has('plugins')) {
      this.options.forEach(function (plugin) {
        plugin.fire.call(plugin, eventName, item, event);
      });
    }
  }

  onloadstart(item) {
    if (!this.progress.has('loading.start')) {
      this.fire('beforeprocess', this);
      this.progress.push('loading.start', +new Date());
    }
    this.progress.data.items.waiting -= 1;
    this.progress.data.items.pending += 1;
  }

  onprogress(item) {
    this._updateProgress();
  }

  onload() {
    this.progress.data.items.loaded += 1;
  }

  onerror(item) {
    this.progress.data.items.error += 1;
  }

  onabort(item) {
    this.progress.data.items.abort += 1;
  }

  ontimeout(item) {
    this.progress.data.items.timeout += 1;
  }

  onloadend() {
    let previousDeferResolved = true;

    // Resolve item or defer resolving
    this._items.forEach(item => {
      // Resolvable except if deferred and previous deffered not solved
      let resolvable = item.defer ? previousDeferResolved : true;

      // Check dependencies and update resolvable if dependencies not loaded
      if (item.awaiting) {
        item.awaiting.forEach(function (dependency) {
          if (!this._awaitables[dependency]) resolvable = false;
        }.bind(this));
      }

      // Resolve item
      if (item.state.processed && !item.state.resolved && resolvable) {
        // Update progress
        this.progress.data.items.pending -= 1;
        this.progress.data.items.processed += 1;
        this._updateProgress();
        item.state.resolved = true;
        if (item.state.loaded) {
          item._resolve(item);
          item.fire.call(item, 'ready');
          item.state.ready = true;
          this.progress.data.items.ready += 1;
        } else {
          item._reject(item);
        }
      }

      // Update previous defer
      if (item.defer && !item.state.processed) previousDeferResolved = false;
    });

    // After event
    if (this.progress.data.items.processed === this.progress.data.items.total) {
      this.fire('afterprocess', this);
      this.progress.push('loading.end', +new Date());
    }
  }

  _updateProgress() {
    let loaded = 0, total = 0, elapsed;

    this.progress.push('loading.end', +new Date());
    elapsed = this.progress.data.loading.end - this.progress.data.loading.start;
    this._items.forEach(function (item) {
      loaded += item.progress.data.loaded;
      total += item.progress.data.total;
    });

    this.progress.push('loading.elapsed', elapsed); // milliseconds
    this.progress.push('loading.loaded', loaded); // Bytes
    this.progress.push('loading.rate', loaded / elapsed * 1000); // Bytes/s
    if (total) {
      this.progress.push('loading.total', total); // Bytes
      this.progress.push('loading.complete', loaded / total * 100); // Bytes
    }
  }
}

export default Beloader;
