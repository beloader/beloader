/**
*  @file FontLoader.js
*  @author Liqueur de Toile <contact@liqueurdetoile.com>
*  @licence AGPL-3.0 {@link https://github.com/liqueurdetoile/beloader/blob/master/LICENSE}
*/

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
*  @extends {AbstractLoader}
*
*  @see https://github.com/typekit/webfontloader
*/
export default class FontLoader extends AbstractLoader {
  /**
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @param {QueueItem} parent Calling QueueItem
  *  @param {DotObjectArray} options Options for the loader
  *  @throws {TypeError}  if `options.webfont` not provided
  */
  constructor(parent, options) {
    if (!options.has('webfont')) throw new TypeError('BeLoader : webfont configuration required for loader');
    options.push('fallbackSync', false); // No sync fallback allowed
    super(parent, options);
  }

  /**
  *  Always throw an error because method is not allowed
  *
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
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
  *  @emits {loadstart} CSS Font requesting begins
  *  @emits {loadstarted} CSS Font requesting begins
  *  @throws {TypeError} If webfont configuration object is not provided in options
  *  @see https://github.com/typekit/webfontloader
  */
  async() {
    let p, cb, _resolve, _reject;

    p = new Promise(function (resolve, reject) {
      _resolve = resolve;
      _reject = reject;
    });

    cb = this.options.pull('webfont.loading');
    this.options.push('webfont.loading', function () {
      if (cb instanceof Function) cb();
    });

    cb = this.options.pull('webfont.active');
    this.options.push('webfont.active', function () {
      if (cb instanceof Function) cb();
      _resolve();
    });

    cb = this.options.pull('webfont.inactive');
    this.options.push('webfont.inactive', function () {
      if (cb instanceof Function) cb();
      _reject();
    });

    this.fire('loadstart', this);
    webfont.load(this.options.data.webfont);
    this.fire('loadstarted', this);

    return p;
  }
}
