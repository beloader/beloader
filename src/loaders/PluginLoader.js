/**
*  @file ScriptLoader.js
*  @author Liqueur de Toile <contact@liqueurdetoile.com>
*  @licence AGPL-3.0 {@link https://github.com/liqueurdetoile/beloader/blob/master/LICENSE}
*/

import AbstractLoader from 'core/AbstractLoader';

/**
*  Loads a beloader plugin
*
*  @version 1.0.0
*  @since 1.0.0
*  @author Liqueur de Toile <contact@liqueurdetoile.com>
*  @extends {AbstractLoader}
*/
export default class PluginLoader extends AbstractLoader {
  /**
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @param {QueueItem} parent Calling QueueItem
  *  @param {DotObjectArray} options Options for the loader
  *  @throw {TypeError} If plugin name is missing
  */
  constructor(parent, options) {
    if (!options.has('name')) throw new TypeError('Beloader : Plugin must have a name');
    if (!options.has('url')) {
      options.data.url = 'https://cdn.jsdelivr.net/gh/beloader/beloader-' + options.data.name + '@latest';
    }
    super(parent, options);

    /**
    *  Underlying node for insertion
    *  @type {HTMLElement}
    */
    this._node = undefined;
  }

  /**
  *  Getter that generates HTMLElement to contain script (sync or async)
  *
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *  @type {HTMLElement} HTMLElement <script></script>
  */
  get node() {
    if (typeof this._node === 'undefined') {
      this._node = document.createElement('script');
      this._node.setAttribute('type', 'text/javascript');
      if (!this.options.data.async) {
        this._node.setAttribute('src', this.options.data.url);
      }
    }
    return this._node;
  }

  /**
  *  Insert plugin code in <script> tag with src for sync loading
  *  and import in plugins when finished
  *
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @returns {Promise} Loading promise
  */
  sync() {
    document.querySelector('head').appendChild(this.node);
    return this._load(super.sync());

  }

  /**
  *  Load plugin script, insert response in a <script> tag
  *  and import in plugins when finished
  *
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @returns {Promise} Loading promise
  */
  async() {
    return this._load(super.async());
  }

  /**
  *  Description for _load
  *
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @param {$type} p Description for p
  *  @returns {type} Return description
  */
  _load(p) {
    const _this = this;

    return new Promise((resolve, reject) => {
      p.then((response) => {
        let beloader = _this.parent.parent;

        if (response) {
          _this.node.innerHTML = response;
          document.querySelector('head').appendChild(_this.node);
        }

        try {
          beloader.pluginize(_this.options.name, window[_this.options.name], _this.options);
          resolve();
        } catch (e) {
          reject('Unable to load plugin : ' + _this.options.name + ' [' + e + ']');
        }
      });
    });
  }
}
