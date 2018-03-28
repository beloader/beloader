/**
*  @file queueitem.js
*  @author Liqueur de Toile <contact@liqueurdetoile.com>
*  @licence AGPL-3.0 {@link https://github.com/liqueurdetoile/beloader/blob/master/LICENSE}
*/

import ObjectArray from 'dot-object-array';
import AbstractEventManager from 'core/AbstractEventManager';
import NoneLoader from 'loaders/NoneLoader';

/**
*  QueueItem handles all item behaviours in the loading queue.
*  Given its type and options, it will load the appropriate loader
*  and process request.
*
*  @version 1.0.0
*  @since 1.0.0
*  @author Liqueur de Toile <contact@liqueurdetoile.com>
*  @extends {AbstractEventManager}
*/
export default class QueueItem extends AbstractEventManager {
  /**
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @param {string} type Type of item. See {@link Beloader#fetch}
  *  @param {Beloader} parent Beloader calling instance
  *  @param {DotObjectArray} options Options for QueueItem and underlying loader
  */
  constructor(type, parent, options) {
    super(options.data.on);

    const _this = this;
    let loader;

    /**
    *  Requesting parent item
    *  @since 1.0.0
    *  @type {Beloader}
    */
    this.parent = parent;

    /**
    *  Map plugins
    *  @since 1.0.0
    *  @type {DotObjectArray}
    */
    this._plugins = parent._plugins;
    this._plugins.forEach((plugin, name) => {
      /** @ignore */
      _this[name] = plugin;
    });

    /**
    *  Stores item progress
    *  @since 1.0.0
    *  @type {DotObjectArray}
    */
    this.progress = new ObjectArray();

    /**
    *  Stores the state of the item
    *  @since 1.0.0
    *  @type {Object} state
    *  @property {boolean}  state.waiting `true` if item is waiting to be processed
    *  @property {boolean}  state.pending `true` if item's loading is in progress
    *  @property {boolean}  state.loaded `true` if item's loading is completed and successfull
    *  @property {boolean}  state.error `true` if item's loading is in error, aborted or timed out
    *  @property {boolean}  state.abort `true` if item's loading is aborted
    *  @property {boolean}  state.timeout `true` if item's loading is in timeout
    *  @property {boolean}  state.processed `true` if item's process is over (loading + initialization)
    *  @property {boolean}  state.resolved `true` if item's promise have been resolved
    *  @property {boolean}  state.ready `true` if item is ready to be used
    */
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

    /**
    *  Id of the item
    *  @type {string}
    *  @see {Beloader#fetch}
    */
    this.id = options.data.id;

    /**
    *  Autoprocess trigger
    *  @type {boolean}
    *  @see {Beloader#fetch}
    */
    this.autoprocess = options.data.autoprocess;

    /**
    *  Async mode trigger
    *  @type {boolean}
    *  @see {Beloader#fetch}
    */
    this.async = options.data.async;

    /**
    *  Defer mode trigger
    *  @type {boolean}
    *  @see {Beloader#fetch}
    */
    this.defer = options.data.defer;

    /**
    *  Awaiting mode, dependencies listing
    *  @type {Array} awaiting
    *  @see {Beloader#fetch}
    */
    this.awaiting = [];
    if (typeof options.data.awaiting !== 'undefined') {
      if (options.data.awaiting instanceof Array) this.awaiting = options.data.awaiting;
      else this.awaiting = [options.data.awaiting];
    }

    /**
    *  Loader ready promise
    *  @since 1.0.0
    *  @type {Promise}
    */
    this.loaderReady = new Promise((resolve, reject) => {
      _this._loaderOK = resolve;
      _this._loaderKO = reject;
    });

    /**
    *  Item process promise
    *  @since 1.0.0
    *  @type {Promise}
    */
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
      case 'ecmascript':
        loader = 'ScriptLoader';
        break;
      case 'style':
      case 'styles':
      case 'stylesheet':
      case 'css':
        loader = 'StylesheetLoader';
        break;
      case 'json':
        loader = 'JsonLoader';
        break;
      case 'image':
      case 'img':
        loader = 'ImageLoader';
        break;
      case 'none':
        /**
        *  Loader instance
        *  @since 1.0.0
        *  @type {Loader}
        */
        this.loader = new NoneLoader(this, options);
        if (this.autoprocess) this.process();
        this._loaderOK(this);
        break;
      default:
        // Custom type loader
        if (options.data.loader) loader = 'CustomLoader';
        else throw new TypeError('BeLoader : No loader for assets with type ' + type);
    }

    /* istanbul ignore else */
    if (loader) {
      import(
        /* webpackChunkName: "[request]" */
        'loaders/' + loader
      ).then(function (Loader) {
        try {
          _this.loader = new Loader.default(_this, options); // eslint-disable-line
          if (_this.autoprocess) _this.process.call(_this);
          _this._loaderOK(_this);
        } catch (e) {
          _this._loaderKO(_this);
          _this._reject(e);
        }
      });
    }
  }

  /**
  *  Process the request for the QueueItem
  *
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @emits {load}
  *  @emits {error}
  *  @emits {loadend}
  */
  process() {
    const _this = this;

    this.loaderReady.then(function () {
      _this.loader.promise.then(
        function () {
          _this.loader.fire('load', _this.loader);
        },
        function (error) {
          _this.error = error; // Store error string/object
          _this.loader.fire('error', _this.loader);
        }
      ).then(() => _this.fire('loadend', _this));
    });

    return this;
  }

  /**
  *  loadstart built-in callback
  *
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  */
  _loadstart() {
    let start = +new Date();

    // Update state
    this.state.waiting = false;
    this.state.pending = true;

    // Initialize loading statistics
    this.progress.push('start', start);
    this.progress.push('details', [{
      timestamp: start,
      duration: 0,
      chunked: 0,
      chunkrate: 0,
      elapsed: 0,
      loaded: 0,
      rate: 0,
      complete: 0
    }]);
    this.progress.push('loaded', 0);
  }

  /**
  *  load built-in callback
  *
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  */
  _load() {
    // Update state
    this.state.loaded = true;
    // Update data loading progress
    this.progress.data.complete = 100;
  }

  /**
  *  error built-in callback
  *
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  */
  _error() {
    this.state.error = true;
  }

  /**
  *  abort built-in callback
  *
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  */
  _abort() {
    this.state.abort = true;
  }

  /**
  *  timeout built-in callback
  *
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  */
  _timeout() {
    this.state.timeout = true;
  }

  /**
  *  loadend built-in callback
  *
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  */
  _loadend() {
    // Update state
    this.state.pending = false;
    this.state.processed = true;

    this.progress.push('end', +new Date());
    this.progress.push('elapsed', this.progress.data.end - this.progress.data.start);
  }

  /**
  *  ready built-in callback
  *
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  */
  _ready() {
    if (this.id) {
      // Update awaitables
      this.parent._awaitables[this.id] = true;
      // Relaunch onloadend on beloader instance to trigger awaiting dependents
      this.parent._loadend();
    }
  }

  /**
  *  progress built-in callback
  *
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  */
  _progress(event) {
    const ev = event.data;
    let t = +new Date();
    let pt = this.progress.data.details[this.progress.data.details.length - 1];
    let details;

    // Update total
    if (ev.lengthComputable) this.progress.push('total', ev.total);

    // Store step detail
    details = {
      timestamp: t,
      duration: t - pt.timestamp, // milliseconds
      chunked: ev.loaded - pt.loaded, // Bytes
      chunkrate: (ev.loaded - pt.loaded) / ((t - pt.timestamp) / 1000), // Bytes/s
      elapsed: t - this.progress.data.start, // milliseconds
      loaded: ev.loaded, // Bytes
      rate: ev.loaded / ((t - this.progress.data.start) / 1000), // Bytes/s
      complete: (this.progress.data.total ? (ev.loaded / this.progress.data.total) * 100 : 0) // Percent
    };

    this.progress.data.details.push(details);

    // Update globals instant state
    this.progress.push('elapsed', details.elapsed);
    this.progress.push('loaded', details.loaded);
    this.progress.push('rate', details.rate);
    this.progress.push('complete', details.complete);
  }
}
