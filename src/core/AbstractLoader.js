/**
*  @file AbstractLoader.js
*  @author Liqueur de Toile <contact@liqueurdetoile.com>
*  @licence AGPL-3.0-only {@link https://spdx.org/licenses/AGPL-3.0-only.html}
*/

import AbstractEventManager from 'core/AbstractEventManager';

/**
*  AbstractLoader provides the core functionnalities of a loader
*
*  @version 1.0.0
*  @since 1.0.0
*  @author Liqueur de Toile <contact@liqueurdetoile.com>
*  @extends {AbstractEventManager}
*/
export default class AbstractLoader extends AbstractEventManager {
  /**
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @param {QueueItem} item Requesting item
  *  @param {DotObjectArray} options Options for the loader
  */
  constructor(parent, options) {

    super();

    /**
    *  Requesting parent item
    *  @since 1.0.0
    *  @type {QueueItem}
    */
    this.parent = parent;

    /**
    *  Map plugins
    *  @since 1.0.0
    *  @type {DotObjectArray}
    */
    this._plugins = parent._plugins;
    this._plugins.forEach(function (plugin, name) {
      /** @ignore */
      this[name] = plugin;
    }.bind(this));

    /**
    *  Loader options
    *
    *  @since 1.0.0
    *  @type {DotObjectArray}
    */
    this.options = options;
  }

  /**
  *  Loader promise
  *
  *  @version 1.0.0
  *  @since 1.0.0
  *  @type {Promise}
  */
  get promise() {
    if (this.options.data.async) return this.async();
    return this.sync();
  }

  /**
  *  The sync method mostly relies on adding an HTMLElement to the DOM to load asset.
  *  When using this way of loading, the loader must expose a node property that provide
  *  the right HTMLElement to create.
  *
  *  It then tries to hook events callbacks but they won't be all supported by browser given
  *  the required HTMLElement (script, link, audio...). Usually only `load` and
  *  `error` callbacks will be functionals.
  *
  *  This basic behaviour can be override by providing a custom loader callback
  *  in `options.loader.sync` or by creating a specific loader that
  *  doesn't call `super.sync()`.
  *
  *  In that case, the custom loader must take care to return a promise and optionally fire _loadstart_ event
  *
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @abstract
  *  @returns {Promise} Loading promise
  *  @emits {loadstart} CSS Font requesting begins
  *  @emits {progress} If progress callback available
  *  @emits {abort} If abort callback available
  *  @emits {timeout} If timeout callback available
  */
  sync() {
    const _this = this;

    // Sync loader override
    if (this.options.pull('loader.sync') instanceof Function) return this.options.pull('loader.sync').call(this);

    return new Promise((resolve, reject) => {
      _this.fire('loadstart', _this);
      _this.node.onprogress = (ev) => _this.fire('progress', _this, ev);
      _this.node.onload = (ev) => resolve();
      _this.node.onerror = (ev) => reject(ev);
      _this.node.onabort = (ev) => {
        _this.fire('abort', _this, ev);
        reject(ev);
      };
      _this.node.ontimeout = (ev) => {
        _this.fire('timeout', _this, ev);
        reject(ev);
      };
    });
  }

  /**
  *  The async method relies on fetching content with an XHR request
  *  and inserting it inline in the document, wrapped in right
  *  HTML container if needed
  *
  *  It is possible to use the {@link loadstart} event to hook some
  *  additional initializations
  *
  *  At last, the xhr loader can be replaced by a custom loader
  *  ([npm request](https://www.npmjs.com/package/request) for instance) for
  *  advanced usage.
  *  In that case, the custom loader must return a promise and take care of firing
  *  events as needed (except {@link load}, {@link error} and {@link loadend}
  *  that will be triggered from the QueueItem parent instance).
  *
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @abstract
  *  @returns {Promise} Loading promise
  *  @emits {loadstart}
  *  @emits {loadstarted}
  *  @emits {readystatechange}
  *  @emits {progress}
  *  @emits {abort}
  *  @emits {timeout}
  */
  async() {
    const _this = this;
    let p1, p2 = new Promise((resolve, reject) => {
      _this._resolve = resolve;
      _this._reject = reject;
    });

    // Async loader override
    if (this.options.pull('loader.async') instanceof Function) return this.options.pull('loader.async')(this);

    // Async promise
    p1 = new Promise((resolve, reject) => {
      _this.xhr = new XMLHttpRequest();

      // Configure basic XHR instance for request
      if (!_this.options.has('xhr.instance')) {
        _this.options.define('xhr.method', 'GET');

        // Events
        _this.xhr.onprogress = (ev) => _this.fire('progress', _this, ev);
        _this.xhr.onerror = (ev) => reject('error');
        _this.xhr.onabort = (ev) => reject('abort');
        _this.xhr.ontimeout = (ev) => reject('timeout');

        _this.xhr.open(_this.options.pull('xhr.method'), _this.options.data.url, true);

        _this.xhr.onreadystatechange = () => {
          _this.fire('readystatechange', _this, _this.xhr);

          if (_this.xhr.readyState === 4) {
            if (_this.xhr.status >= 200 && _this.xhr.status < 400) {
              resolve(_this.xhr.response);
            } else reject('error');
          }
        };
      }

      _this.fire('loadstart', _this);
      _this.xhr.send(_this.options.pull('xhr.data'));
      _this.fire('loadstarted', _this);
    });

    p1.then(
      response => {
        _this._resolve(response);
      },
      error => {
        if (_this.options.data.fallbackSync) {
          _this.options.data.async = false;
          delete _this._node; // reset node
          _this.sync().then(
            success => {
              _this._resolve(false);
            },
            error => {
              _this._reject(error);
            }
          );
        } else {
          if (error !== 'error') _this.fire(error, _this, _this.xhr);
          _this._reject(_this.xhr.status);
        }
      }
    );

    return p2;
  }
}
