/**
*  The `loadstart` event is fired :
*  - In sync and async loading mode
*  - Just after insertion of the requesting inline tag for sync loading
*  - After XMLHttpRequest instance initialization but before sending request for async loading
*
*
*  If you want to tweak XHR instance without providing a full one, you can use this callback. The
*  XHR instance will be available as a loader property (see example).
*
*  @typedef {BeloaderEvent} loadstart
*  @property {Loader} target Loader instance
*
*  @example
*  var loader = new Beloader() ;
*
*  loader.fetch('json', {
*   url: 'http://jsonserverwithbadheaders.com/api',
*   on: {
*     loadstart: function(event) {
*       // loader is available in event.target
*       // Override the default json responseType value to prevent errors
*       event.target.xhr.responseType = "text"
*     }
*   }
*  }).then((item) => var myGoodJson = strangeStringProcess(item.loader.xhr.response));
*/

/**
*  The `loadstarted` event is fired :
*  - Only in async mode
*  - Just after sending the request
*
*  @typedef {BeloaderEvent} loadstarted
*  @property {Loader} target Loader instance
*/

/**
*  @external {ProgressEvent} https://developer.mozilla.org/en-US/docs/Web/API/ProgressEvent
*/

/**
*  The `progress` event is fired :
*  - Always in async mode
*  - If available in sync mode
*
*  @typedef {BeloaderEvent} progress
*  @property {Loader} target Loader instance
*  @property {ProgressEvent} data Native `progress` event
*/

/**
*  The `progress` event is fired only in async mode
*
*  @typedef {BeloaderEvent} readystatechange
*  @property {Loader} target Loader instance
*  @property {XMLHttpRequest} data Loader xhr instance
*/

/**
*  The `load` event is fired :
*  - Only if loading is succesful
*  - Only if loader complete all its task (rendering fonts for instance)
*
*  @typedef {BeloaderEvent} load
*  @property {QueueItem} target QueueItem instance
*/

/**
*  The `error` event is fired if loading is not completed. It will be fired
*  in case of error, abort or timeout
*
*  @typedef {BeloaderEvent} error
*  @property {QueueItem} target QueueItem instance
*  @property {mixed}  data  Additionnal informations or native event
*/

/**
*  The `timeout` event is fired in case of timeout
*
*  @typedef {BeloaderEvent} timeout
*  @property {Loader} target Loader instance
*  @property {Event} data Native `timeout` event
*/

/**
*  The `abort` event is fired in case of abort
*
*  @typedef {BeloaderEvent} abort
*  @property {Loader} target Loader instance
*  @property {Event} data Native `abort` event
*/

/**
*  The `loadend event` is emitted at the very end
*  of the loading request. It will occur whenever
*  the loading succeeds or fails
*
*  @typedef {BeloaderEvent} loadend
*  @property {QueueItem} target QueueItem instance
*/

/**
*  The`ready` event is fired at the very end of the
*  item initialization
*
*  @typedef {BeloaderEvent} ready
*  @property {QueueItem} target QueueItem instance
*/

/**
*  The `beforeprocess` event is fired once at the
*  very beginning of the loading queue process
*
*  @typedef {BeloaderEvent} beforeprocess
*  @property {Beloader} target  Beloader instance
*/

/**
*  The `afterprocess` event is fired once at the
*  very end of the loading queue process
*
*  @typedef {BeloaderEvent} afterprocess
*  @property {Beloader} target  Beloader instance
*/
