/**
*  @file AbstractPlugin.js
*  @author Liqueur de Toile <contact@liqueurdetoile.com>
*  @licence AGPL-3.0-only {@link https://spdx.org/licenses/AGPL-3.0-only.html}
*/

import ObjectArray from 'dot-object-array';

export default class AbstractPlugin {
  constructor(options = {}) {
    this.options = new ObjectArray(options);
  }
  
  fire(eventName, item, event) {
    // Private callbacks
    if (this[eventCallbackName] instanceof Function) this[eventCallbackName].call(this, item, event);
    // User-defined callbacks
    if ((cb = this.options.pull('on.' + eventName)) instanceof Function) cb.call(this, item, event);
  }
}