/**
*  @file StylesheetLoader.js
*  @author Liqueur de Toile <contact@liqueurdetoile.com>
*  @licence AGPL-3.0 {@link https://github.com/liqueurdetoile/beloader/blob/master/LICENSE}
*/

import AbstractLoader from 'core/AbstractLoader';

/**
*  External stylesheet loader
*
*  If loaded sync, the stylesheet is embedded as a <link> tag. If
*  loaded async, the response will be embedded in an inline <style>
*  tag.
*
*  @version 1.0.0
*  @since 1.0.0
*  @author Liqueur de Toile <contact@liqueurdetoile.com>
*  @extends {AbstractLoader}
*/

export default class StylesheetLoader extends AbstractLoader {
  /**
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @param {QueueItem} parent Calling QueueItem
  *  @param {DotObjectArray} options Options for the loader
  *  @param {string} options.url  URL of the script
  *  @param {Object} [options.attributes] Attributes for the resulting HTML node
  *  @throw {TypeError} If script url is missing
  *  @throws {TypeError}  if `options.url` is not defined
  */
  constructor(parent, options) {
    super(parent, options);
    if (!options.has('url')) throw new TypeError('Beloader : stylesheet url must be defined');
    /**
    *  Underlying node for insertion
    *  @type {HTMLElement}
    */
    this._node = undefined;
  }

  /**
  *  Getter that generates HTMLElement to contain css (sync or async)
  *
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *  @type {HTMLElement} HTMLElement
  */
  get node() {
    if (typeof this._node === 'undefined') {
      if (this.options.data.async) {
        this._node = document.createElement('style');
        this._node.setAttribute('type', 'text/css');
      } else {
        this._node = document.createElement('link');
        this._node.setAttribute('rel', 'stylesheet');
        this._node.setAttribute('type', 'text/css');
        this._node.setAttribute('href', this.options.data.url);
      }
      this.options.forEach(function (val, attr) {
        this._node.setAttribute(attr, val);
      }.bind(this), 'attributes', null, false);
    }
    return this._node;
  }

  /**
  *  Insert <link> tag with href for sync loading
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
  *  Load script and insert response in a <style> tag
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
