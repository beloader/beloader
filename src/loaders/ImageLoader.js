/**
*  @file ImageLoader.js
*  @author Liqueur de Toile <contact@liqueurdetoile.com>
*  @licence AGPL-3.0 {@link https://github.com/liqueurdetoile/beloader/blob/master/LICENSE}
*/

import AbstractLoader from 'core/AbstractLoader';

/**
*  If loaded async, the response will be added as a blob reference in src unless
*  an option `base64` set to `true` is provided. In that case, the image will
*  be parsed as a DataURI.
*
*  Image loader also accepts a `attributes` option to customize
*  resulting HtmlElement.
*
*  The resulting HtmlElement will not be inserted in DOM but provided
*  as a `image` property of the parent QueueItem. The property will be available
*  as soon as loader will be available to permit DOM insertion at
*  creation. It can be retrieved with the `loaderReady` promise exposed
*  by QueueItem.
*
*  @version 1.0.0
*  @since 1.0.0
*  @author Liqueur de Toile <contact@liqueurdetoile.com>
*  @extends {AbstractLoader}
*
*  @example
*  var loader = new Beloader();
*
*  // Sync mode with display only when loaded
*  var img = loader.fetch('img', {
*    url: 'http://myserver.com/image.jpg',
*    async: false,
*    attributes : {
*      alt: 'My image',
*      width: '100px',
*      height: '100px'
*    }
*  }).then(item => {
*    document.body.appendChild(item.image);
*  });
*
*  // Async mode with display only when loaded (as a blob object)
*  var img = loader.fetch('img', {
*    url: 'http://myserver.com/image.jpg',
*    attributes : {
*      alt: 'My image',
*      width: '100px',
*      height: '100px'
*    }
*  }).then(item => {
*    document.body.appendChild(item.image);
*  });
*
*  // Async mode with display only when loaded (as a DataURI string)
*  var img = loader.fetch('img', {
*    url: 'http://myserver.com/image.jpg',
*    base64: true,
*    attributes : {
*      alt: 'My image',
*      width: '100px',
*      height: '100px'
*    }
*  }).then(item => {
*    document.body.appendChild(item.image);
*  });
*/

export default class ImageLoader extends AbstractLoader {
  /**
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @param {QueueItem} parent Calling QueueItem
  *  @param {DotObjectArray} options Options for the loader
  *  @throws {TypeError}  if `options.url` is not defined
  */
  constructor(parent, options) {
    super(parent, options);
    if (!options.has('url')) throw new TypeError('Beloader : image url must be defined');
    options.define('base64', false);
    this.options.define('attributes', {});
    /**
    *  Underlying node for insertion
    *  @type {HTMLElement}
    */
    this._node = this.node;
    this.parent.image = this.node;
  }

  /**
  *  Getter that generates HTMLElement to contain image (sync or async)
  *
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *  @type {HTMLElement} HTMLElement
  */
  get node() {
    if (typeof this._node === 'undefined') {
      this._node = document.createElement('img');
      this.options.forEach(function (val, attr) {
        this._node.setAttribute(attr, val);
      }.bind(this), 'attributes');
    }

    return this._node;
  }

  /**
  *  Load image
  *
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @returns {Promise} Loading promise
  */
  sync() {
    this.node.src = this.options.data.url;
    return super.sync();
  }

  /**
  *  Event hook to add specific Blob request headers to
  *  XMLHttpRequest instance
  *
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  */
  _loadstart() {
    if (this.xhr) this.xhr.responseType = 'blob';
  }

  /**
  *  Load image binary (blob) or dataUri (base64) and update src attribute
  *
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @returns {Promise} Loading promise
  */
  async() {
    const _this = this;

    return new Promise((resolve, reject) => {
      super.async().then(response => {
        if (_this.options.data.base64) {
          // Decode binary as base64
          let reader = new window.FileReader();

          reader.readAsDataURL(response);
          reader.onload = () => {
            _this.node.src = reader.result;
            resolve();
          };
          reader.onerror = () => {
            reject(reader.error);
          };
        } else { // Decode as binary blob
          let url = window.URL || window.webkitURL;

          try {
            _this.node.src = url.createObjectURL(response);
            resolve();
          } catch (e) {
            reject(e);
          }
        }
      });
    });
  }
}
