import AbstractLoader from 'core/AbstractLoader';
import webfont from 'webfontloader';

/**
*  FontLoader is solely porting webfontloader as a loader
*
*  The main goal of this loader is to trigger a ready state
*  only when the font(s) are ready to be parsed to avoid
*  FOUT artifacts
*
*  @version 1.0.0
*  @since 1.0.0
*  @author Liqueur de Toile <contact@liqueurdetoile.com>
*
*  @see https://github.com/typekit/webfontloader
*/
export default class FontLoader extends AbstractLoader {
  /**
  *  Always throw an error because method is not allowed
  *
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @returns {void}
  *  @override
  *  @throws {TypeError} Always thrown if method requested
  */
  sync() {
    throw new TypeError('BeLoader : webfont only works in async mode');
  }

  /**
  *  Load a font using webfontloader
  *
  *  This loader expect a webfont configuration object to be provided with the options
  *  as `options.webfont`. For available webfont options, please check
  *  webfontloader website.
  *
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @returns {Promise} Promise resolved or rejected at load end
  *  @override
  *  @emits {loadstart} CSS Font requesting begins
  *  @emits {load} Font is active and available
  *  @emits {error} Loading or font parsing fails
  *  @throws {TypeError} If webfont configuration object is not provided in options
  *  @see https://github.com/typekit/webfontloader
  */
  async() {
    const _this = this;
    let p = new Promise((resolve, reject) => {
      _this._resolve = resolve;
      _this._reject = reject;
    });

    this.options.push('fallbackSync', false); // No sync fallback allowed
    if (!this.options.has('webfont')) throw new TypeError('BeLoader : webfont configuration required for loader');

    this.options.push('webfont.active', function () {
      this.item.fire.call(this.item, 'load');
      this._resolve();
    }.bind(this));
    this.options.push('webfont.inactive', function () {
      this.item.fire.call(this.item, 'error');
      this._error();
    }.bind(this));

    this.item.fire.call(this.item, 'loadstart');
    webfont.load(this.options.data.webfont);

    return p;
  }
}
