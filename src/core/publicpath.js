/**
*  @file publicpath.js
*  @author Liqueur de Toile <contact@liqueurdetoile.com>
*  @licence AGPL-3.0 {@link https://github.com/liqueurdetoile/beloader/blob/master/LICENSE}
*/

/**
*  This script initialize webpack public path for CDN usage compatibility
*
*  @version 1.0.0
*  @since 1.0.0
*  @author Liqueur de Toile <contact@liqueurdetoile.com>
*/

let scripts = document.getElementsByTagName('script');
/** @ignore */
let r = new RegExp('^(?:[a-z]+:)?//', 'i');

for (let i = 0; i < scripts.length; i++) {
  let script = scripts[i];
  let tmp = script.src.match(/(.+)beloader/);

  // Only set public path if beloader path is absolute
  if (tmp && tmp[1] && r.test(tmp[1])) __webpack_public_path__ = tmp[1]; // eslint-disable-line  
}
