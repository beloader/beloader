/**
*  @file BeloaderEvent.js
*  @author Liqueur de Toile <contact@liqueurdetoile.com>
*  @licence AGPL-3.0 {@link https://github.com/liqueurdetoile/beloader/blob/master/LICENSE}
*/

/**
*  An event is generated and provided to each callback function
*  attached to this event.
*
*  The Beloader event mimics the native Event methods to override
*  default execution and propagation.
*
*  You can force the callback to execute __before__ the built-in
*  behaviour by naming the function `pre`. Any closure or other named
*  functions will be called __after__ the built-in callbacks.
*
*  @example
*  var loader = new Beloader();
*
*  loader.on('afterprocess', (event) => {
*    // called after the 'afterprocess' built-in callbacks
*    event.preventDefault(); // will do nothing
*  });
*
*  loader.on('afterprocess', function pre(event) {
*    // called before the 'afterprocess' built-in callbacks
*    event.preventDefault(); // will stop built-in triggering
*  });
*
*  @version 1.0.0
*  @since 1.0.0
*  @author Liqueur de Toile <contact@liqueurdetoile.com>
*  @see {@link AbstractEventManager}
*
*/
export default class BeloaderEvent {
  /**
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @param {string} name Name of the event
  *  @param {Beloader|QueueItem|Loader|Plugin} target Target of the event
  *  @param {object|Array|number|string} data Data if available
  */
  constructor(name, target, data = null) {
    /**
    *  Name of the event
    *  @since 1.0.0
    *  @type {string}
    */
    this.name = name;

    /**
    *  Target of the event
    *  @since 1.0.0
    *  @type {Beloader|QueueItem|Loader|Plugin}
    */
    this.target = target;

    /**
    *  Data of the event if available
    *  @since 1.0.0
    *  @type {object|number|string}
    */
    this.data = data;

    /**
    *  Timestamp of Event creation
    *  @since 1.0.0
    *  @type {timestamp}
    */
    this.timestamp = +new Date();

    /**
    *  Prevent default behaviour trigger
    *  @since 1.0.0
    *  @type {boolean}
    */
    this._defaultPrevented = false;

    /**
    *  Prevent default bubbling trigger
    */
    this._propagationStopped = false;

    /**
    *  Prevent callbacks processing trigger
    *  @since 1.0.0
    *  @type {boolean}
    */
    this._immediatePropagationStopped = false;
  }

  /**
  *  Prevent the default built-in behaviour to trigger
  *  It only works if called within a callback function named `pre`
  *
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @returns {this} Chainable
  *  @see https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault
  */
  preventDefault() {
    this._defaultPrevented = true;
    return this;
  }

  /**
  *  Prevent the bubbling of the Event to parent
  *
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @returns {this} Chainable
  *  @see https://developer.mozilla.org/en-US/docs/Web/API/Event/stopPropagation
  */
  stopPropagation() {
    this._propagationStopped = true;
    return this;
  }

  /**
  *  Prevent any further callbacks to be called and stop propagation
  *  The callbacks are called in the same order that they have been registered
  *
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @returns {this} Chainable
  *  @see https://developer.mozilla.org/en-US/docs/Web/API/Event/stopImmediatePropagation
  */
  stopImmediatePropagation() {
    this._immediatePropagationStopped = true;
    return this.stopPropagation();
  }
}
