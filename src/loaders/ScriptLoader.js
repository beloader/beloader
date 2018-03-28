/**
*  @file ScriptLoader.js
*  @author Liqueur de Toile <contact@liqueurdetoile.com>
*  @licence AGPL-3.0 {@link https://github.com/liqueurdetoile/beloader/blob/master/LICENSE}
*/

import AbstractLoader from 'core/AbstractLoader';

/**
*  Loads external javascript
*
*  @version 1.0.0
*  @since 1.0.0
*  @author Liqueur de Toile <contact@liqueurdetoile.com>
*  @extends {AbstractLoader}
*/
export default class ScriptLoader extends AbstractLoader {
  /**
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @param {QueueItem} parent Calling QueueItem
  *  @param {DotObjectArray} options Options for the loader
  *  @throw {TypeError} If script url is missing
  */
  constructor(parent, options) {
    super(parent, options);
    if (!options.has('url')) throw new TypeError('Beloader : Script url must be defined');
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
  *  Insert <script> tag with src for sync loading
  *
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @returns {Promise} Loading promise
  */
  sync() {
    document.querySelector('head').appendChild(this.node);
    return super.sync();
  }

  /**
  *  Load script and insert response in a <script> tag
  *
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @returns {Promise} Loading promise
  */
  async() {
    const _this = this;
    let p = super.async();

    p.then(response => {
      if (response) {
        _this.node.innerHTML = response;
        document.querySelector('head').appendChild(_this.node);
      }
    });

    return p;
  }
}
