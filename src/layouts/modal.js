import {Q} from 'elementify';

export default class Splash {
  constructor(options = {}) {
    this.container = Q('+div', {
      id: options.id || 'splash-loader',
      style: {
        position: options.position || 'fixed',
        top: options.top || 0,
        left: options.left || 0,
        width: options.width || '100%',
        height: options.height || '100%',
        zIndex: options.zIndex || 1000,
        display: options.display || 'flex',
        flexDirection: options.flexDirection || 'column',
        background: options.background || '#000'
      }
    });
  }

  open() {
    Q('body').append(this.container);
    return this;
  }

  close() {
    this.container.remove();
    return this;
  }

  fadeIn(options = {}) {
    this.container.opacity = 0;
    this.open();
    return this.container.fadeIn(options);
  }

  fadeOut(options = {}) {
    let p = this.container.fadeOut(options);

    this.close();
    return p;
  }

  append(content) {
    this.container.append(content);
    return this;
  }

  prepend(content) {
    this.container.prepend(content);
    return this;
  }

  insert(n, content) {
    if (this.container.child(n).length) {
      this.container.child(n).before(content);
      return this;
    }
    return this.append(content);
  }
}
