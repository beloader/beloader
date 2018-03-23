import AbstractLoader from 'core/AbstractLoader';

export default class ScriptLoader extends AbstractLoader {
  constructor(item, options) {
    super(item, options);
    if (!options.has('url')) throw new TypeError('Beloader : Asset url must be defined');
  }

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
