/**
*  @file CustomLoader.js
*  @author Liqueur de Toile <contact@liqueurdetoile.com>
*  @licence AGPL-3.0 {@link https://github.com/liqueurdetoile/beloader/blob/master/LICENSE}
*/

import AbstractLoader from 'core/AbstractLoader';

/**
*  Custom loader let user provide a custom callback
*  as a loader instance
*
*  The callback must be provided through `options.loader` and
*  must return a promise. It can also throw events if needed.
*
*  It will always be called whenever `options.async` is set to `true`
*  or `false`. Only calling QueueItem will be exposed in the
*  latter promise. For bringing back data, you can use event or
*  add a custom property to the QueueItem. You can access item via the
*  `parent` property of the loader.
*
*  @version 1.0.0
*  @since 1.0.0
*  @author Liqueur de Toile <contact@liqueurdetoile.com>
*  @extends {AbstractLoader}
*
*  @example
*  var loader = new Beloader();
*  var myLoader = function() {
*   return new Promise(function(resolve, reject) {
*     // Do things
*     this.parent.response = things;
*     if(OK) resolve();
*     else reject('error on things'); // Will be available in item.error
*   }.bind(this));
*  }
*
*  loader.fetch('custom', {loader: myLoader})
*   .promise
*   .then(
*     function(item) { item.response // yields "things" value },
*     function(item) { console.log(item.error) // display "error on things" }
*   );
*/
export default class CustomLoader extends AbstractLoader {
  /**
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @param {QueueItem} parent Calling QueueItem
  *  @param {DotObjectArray} options Loader options
  *  @throw {TypeError} If provided callback is not a Function
  */
  constructor(parent, options) {
    if (!(options.data.loader instanceof Function)) {
      throw new TypeError('Beloader : Custom loader must be a valid callback');
    }
    super(parent, options);
  }

  /**
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @type {Promise} Custom callback promise
  */
  get promise() {
    return this.options.data.loader.call(this);
  }
}
