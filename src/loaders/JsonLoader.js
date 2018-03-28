/**
*  @file JsonLoader.js
*  @author Liqueur de Toile <contact@liqueurdetoile.com>
*  @licence AGPL-3.0 {@link https://github.com/liqueurdetoile/beloader/blob/master/LICENSE}
*/

import AbstractLoader from 'core/AbstractLoader';

/**
*  Load and parse JSON data
*
*  JsonLoader only performs asynchronously. If succeeded, returned data
*  will be available in QueueItem#response property.
*
*  @version 1.0.0
*  @since 1.0.0
*  @author Liqueur de Toile <contact@liqueurdetoile.com>
*
*  @example
*  var loader = new Beloader();
*
*  loader
*   .fetch('json', 'https://reqres.in/api/users')
*   .then(function(item) {
*     var data = item.response; // JSON data
*   });
*
*/
export default class JsonLoader extends AbstractLoader {
  /**
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @param {QueueItem} parent QueueItem calling parent
  *  @param {DotObjectArray} options Options for loader
  */
  constructor(parent, options) {
    if (!options.has('url')) throw new TypeError('Beloader : Asset JSON url must be defined');
    super(parent, options);
    this.options.push('fallbackSync', false); // No sync fallback allowed
  }

  /**
  *  Always throw an error because method is not allowed
  *
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @override
  *  @throws {TypeError} Always thrown if method requested
  */
  sync() {
    throw new TypeError('BeLoader : JsonLoader only works in async mode');
  }

  /**
  *  Event hook to add specific JSON request headers to
  *  XMLHttpRequest instance
  *
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  */
  _loadstart() {
    this.xhr.setRequestHeader('Accept', 'application/json');
    this.xhr.responseType = 'json';
  }

  /**
  *  Async loader for JSON data
  *
  *  The loader will first try to fetch parsed JSON, then try to parse
  *  response itself and finally try to parse responseText for IE.
  *
  *  If none of parsing succeeds, promise is rejected.
  *
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @returns {Promise}
  */
  async() {
    const _this = this;

    return new Promise((resolve, reject) => {
      super.async().then(
        response => {
          let rejected = false;
          let err = 'Beloader : Malformed JSON or non-JSON';

          // IE Hack or null response
          if (typeof response === 'undefined' || response === null) {
            try {
              response = this.xhr.responseText;
            } catch (e) {
              rejected = true;
            }
          }

          //
          /* istanbul ignore next */
          if (typeof response === 'string') {
            try {
              response = JSON.parse(response);
            } catch (error) {
              rejected = true;
              err = error;
            }
          }

          if (rejected) {
            reject(err);
          } else {
            _this.parent.response = response;
            resolve();
          }
        },
        error => {
          reject(error);
        }
      );
    });
  }
}
