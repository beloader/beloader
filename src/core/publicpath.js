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
let wpp;

export function check(uri) {
  // Dot not forget to change target string beloader
  let tmp = uri.match(/((http.+)beloader(?:[@\.\w]+|$))/);

  // Only set public path if beloader path is absolute
  if (tmp && tmp[1] && r.test(tmp[1])) {
    if (tmp[1].indexOf('dist') >= 0) return tmp[2];
    return tmp[1] + '/dist/';
  }
  return false;
}

for (let i = 0; i < scripts.length; i++) {
  wpp = check(scripts[i].src);

  if (wpp) {
    __webpack_public_path__ = wpp; // eslint-disable-line
    break;
  }
}
