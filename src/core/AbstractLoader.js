/**
*  @file AbstractLoader.js
*  @author Liqueur de Toile <contact@liqueurdetoile.com>
*  @licence AGPL-3.0-only {@link https://spdx.org/licenses/AGPL-3.0-only.html}
*/

export default class AbstractLoader {
  constructor(item, options) {
    this.item = item;
    this.options = options;
  }

  get promise() {
    if (this.options.data.async) return this.async();
    return this.sync();
  }

  sync() {
    const _this = this;

    // Sync loader override
    if (this.options.pull('loader.sync') instanceof Function) return this.options.pull('loader.sync')(this);

    return new Promise((resolve, reject) => {
      _this.item.fire.call(_this.item, 'loadstart');
      _this.node.onprogress = (ev) => _this.item.fire.call(_this.item, 'progress', ev);
      _this.node.onload = (ev) => {
        _this.item.fire.call(_this.item, 'load', ev);
        resolve(200);
      };
      _this.node.onerror = (ev) => {
        _this.item.fire.call(_this.item, 'error', ev);
        reject('Loading error');
      };
      _this.node.onabort = (ev) => {
        _this.item.fire.call(_this.item, 'abort', ev);
        reject('Loading aborted');
      };
      _this.node.ontimeout = (ev) => {
        _this.item.fire.call(_this.item, 'timeout', ev);
        reject('Loading timeout');
      };
    });
  }

  async() {
    const _this = this;

    // Async loader override
    if (this.options.pull('loader.async') instanceof Function) return this.options.pull('loader.async')(this);

    return new Promise((resolve, reject) => {
      // XHR object override
      _this.xhr = _this.options.pull('xhr.instance') || new XMLHttpRequest();

      // Configure basic XHR instance for request
      if (!_this.options.has('xhr.instance')) {
        _this.options.define('xhr.method', 'GET');

        // Events
        _this.xhr.onprogress = (ev) => _this.item.fire.call(_this.item, 'progress', ev);
        _this.xhr.onerror = (ev) => {
          _this.item.fire.call(_this.item, 'error', ev);
          reject('Loading error');
        };
        _this.xhr.onabort = (ev) => {
          _this.item.fire.call(_this.item, 'abort', ev);
          reject('Loading aborted');
        };
        _this.xhr.ontimeout = (ev) => {
          _this.item.fire.call(_this.item, 'timeout', ev);
          reject('Loading timeout');
        };

        _this.xhr.open(_this.options.pull('xhr.method'), _this.options.data.url, true);

        _this.xhr.onreadystatechange = () => {
          _this.item.fire.call(_this.item, 'readystatechange', _this.xhr.readyState);

          if (_this.xhr.readyState === 4) {
            if (_this.xhr.status === 200) {
              _this.item.fire.call(_this.item, 'load');
              resolve(_this.xhr.response);
            } else {
              if (_this.options.data.fallbackSync) {
                _this.options.data.async = false;
                delete _this._node; // reset node
                _this.sync().then(
                  success => {
                    resolve(false);
                  },
                  error => {
                    reject(error);
                  }
                );
              } else {
                _this.item.fire.call(_this.item, 'error');
                reject(_this.xhr.status);
              }
            }
          }
        };
      }

      _this.item.fire.call(_this.item, 'loadstart');
      _this.xhr.send(_this.options.data.xhrData);
    });
  }
}
