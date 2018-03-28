/**
*  @file AbstractPlugin.js
*  @author Liqueur de Toile <contact@liqueurdetoile.com>
*  @licence AGPL-3.0 {@link https://github.com/liqueurdetoile/beloader/blob/master/LICENSE}
*/

import ObjectArray from 'dot-object-array';
import AbstractEventManager from 'core/AbstractEventManager';

/**
*  AbstractPlugin provides the core functionnalities of a plugin
*
*  @version 1.0.0
*  @since 1.0.0
*  @author Liqueur de Toile <contact@liqueurdetoile.com>
*/
export default class AbstractPlugin extends AbstractEventManager {
  /**
  *  Constructor
  *
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @param {Beloader|QueueItem|Loader} Parent instance for plugin
  *  @param {Object|DotObjectArray} options Options for the plugin
  */
  constructor(parent, options = {}) {
    super();
    /**
    *  Parent
    *  @type {Beloader} Beloader instance
    *  @since 1.0.0
    */
    this.parent = parent;

    /**
    *  Map plugins
    *  @since 1.0.0
    *  @type {DotObjectArray}
    */
    this._plugins = parent._plugins;
    this._plugins.forEach(function (plugin, name) {
      /** @ignore */
      this[name] = plugin;
    }.bind(this));

    /**
    *  Stores the plugin options
    *  @type {DotObjectArray}
    *  @since 1.0.0
    */
    this.options = new ObjectArray(options);
  }
}
