import AbstractLoader from 'core/AbstractLoader';

export default class StylesheetLoader extends AbstractLoader {
  constructor(item, options) {
    super(item, options);
    if (!options.has('url')) throw new TypeError('Beloader : stylesheet url must be defined');
  }

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
    }
    return this._node;
  }

  sync() {
    document.querySelector('head').appendChild(this.node);
    return super.sync();
  }

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
