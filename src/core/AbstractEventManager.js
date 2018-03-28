/**
*  @file AbstractEventManager.js
*  @author Liqueur de Toile <contact@liqueurdetoile.com>
*  @licence AGPL-3.0 {@link https://github.com/liqueurdetoile/beloader/blob/master/LICENSE}
*/

import ObjectArray from 'dot-object-array';
import BeloaderEvent from 'events/BeloaderEvent';

/**
*  AbstractEventManager provide the core functionnalities to register,
*  fire and dispatch event.
*
*  Beloader event system is purely internal, though easily pluggable into
*  external scripts
*
*  @version 1.0.0
*  @since 1.0.0
*  @author Liqueur de Toile <contact@liqueurdetoile.com>
*/
export default class AbstractEventManager {
  /**
  *  Constructor
  *
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @param {Object} events
  *  Events callback list provided to {@link Beloader} or
  *  {@link QueueItem} constructor options under `on`
  *  property of the `options` object
  *  @see {@link Beloader}
  *  @see {@link QueueItem}
  */
  constructor(events) {
    /**
    *  Callback's list by eventName
    *
    *  @since 1.0.0
    *  @type {DotObjectArray}
    */
    this._events = new ObjectArray();

    events = new ObjectArray(events);
    events.forEach(function (callbacks, eventName) {
      if (!(callbacks instanceof Array)) callbacks = [callbacks];
      callbacks.forEach(function (callback) {
        this.on(eventName, callback);
      }.bind(this));
    }.bind(this));
  }

  /**
  *  Register events callbacks after instance creation
  *
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @param {string} eventName Event name
  *  @param {Function} callback Even't callback
  */
  on(eventName, callback) {
    let when;

    if (callback.name === 'pre') when = 'pre';
    else when = 'post';

    this._events.define(eventName, [], when);
    this._events.data[when][eventName].push(callback);
  }

  /**
  *  Fire an event
  *
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @param {string} eventName Event name
  *  @param {Beloader|QueueItem|Loader|Plugin} target Event target
  *  @param {object|array|number|string} data Extra data
  */
  fire(eventName, target, data) {
    this._dispatch(new BeloaderEvent(eventName, target, data));
  }

  /**
  *  Dispatch an event
  *
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @param {BeloaderEvent} event Event instance
  */
  _dispatch(event) {
    const pre = this._events.pull(event.name, 'pre') || [];
    const post = this._events.pull(event.name, 'post') || [];

    // Dispatch in context
    pre.forEach(function (cb) {
      if (!event._immediatePropagationStopped) cb.call(this, event);
    }.bind(this));

    if (
      !event._immediatePropagationStopped &&
      !event._defaultPrevented &&
      this['_' + event.name] instanceof Function
    ) {
      this['_' + event.name].call(this, event);
    }

    if (!event._immediatePropagationStopped) {
      post.forEach(function (cb) {
        if (!event._immediatePropagationStopped) cb.call(this, event);
      }.bind(this));
    }

    // Bubbles up to parent if it exists and propagation not prevented
    if (!event._propagationStopped && this.parent) {
      this.parent._dispatch.call(this.parent, event);
    }
  }
}
