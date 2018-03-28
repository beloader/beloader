/**
*  @file NoneLoader.js
*  @author Liqueur de Toile <contact@liqueurdetoile.com>
*  @licence AGPL-3.0 {@link https://github.com/liqueurdetoile/beloader/blob/master/LICENSE}
*/

import AbstractEventManager from 'core/AbstractEventManager';

/**
*  NoneLoader is a special loader that loads nothing.
*
*  Its prupose is to produce side-effect with
*  an ever resolved and loaded item.
*
*  @version 1.0.0
*  @since 1.0.0
*  @author Liqueur de Toile <contact@liqueurdetoile.com>
*  @extends {AbstractEventManager}
*/
export default class AbstractLoader extends AbstractEventManager {
  /**
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @param {QueueItem} item Requesting item
  *  @param {DotObjectArray} options Options for the loader
  */
  constructor(parent, options) {
    super();

    /**
    *  Requesting parent item
    *  @since 1.0.0
    *  @type {QueueItem}
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
    *  Loader options
    *
    *  @since 1.0.0
    *  @type {DotObjectArray}
    */
    this.options = options;
  }

  /**
  *  Loader promise
  *
  *  @version 1.0.0
  *  @since 1.0.0
  *  @type {Promise}
  */
  get promise() {
    return this.parent.loaderReady;
  }
}
