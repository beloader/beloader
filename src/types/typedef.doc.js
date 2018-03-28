/**
*  @external {DotObjectArray} https://liqueurdetoile.github.io/DotObjectArray/
*/
/**
*  @external {timestamp} https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Date/now
*/
/**
*  @external {HTMLElement} https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement
*/
/**
*  @external {XMLHttpRequest} https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
*/

/**
*  A loader instance which vary upon the type of asset requested
*  @typedef {Loader} Loader instance
*  @property {QueueItem}  parent  Calling QueueItem
*/

/**
*  A Plugin instance
*  @typedef {Plugin} Plugin instance
*  @property {Beloader}  parent  Calling QueueItem
*/

/**
*  Exception for event callbacks, most of the global options are
*  designed to set defaults values for {@link QueueItem) instance
*  and associated {@link Loader} instances
*
*  @typedef {Object}  BeloaderOptions
*  @property {Object} [on]
*  Events callbacks
*  
*  When defined at Beloader level, the callback will execute as
*  many times as the event is received. For instance, a `load` callback
*  wille triggered each time an item is loaded.
*  @property {boolean}  [autoprocess=true]  {@link QueueItemOptions}
*  @property {boolean}  [async=true]  {@link QueueItemOptions}
*  @property {boolean}  [cache=true]  {@link QueueItemOptions}
*  @property {boolean}  [defer=false]  {@link QueueItemOptions}
*  @property {boolean}  [fallbackSync=true]  {@link QueueItemOptions}
*  @property {Object}  [xhr]  {@link QueueItemOptions}
*  @property {Object|Promise}  [loader]  {@link QueueItemOptions}
*  
*  @example
*  var loader = new Beloader({
*    defer: true // load in same order than declared
*    on: {
*      afterprocess: () => { app.start() }
*    }
*  });
*/

/**
*  Options for QueueItem are mostly for the underlying loader.
*  Some loaders are requiring specific informations and will
*  usually throw an error if not provided
*  
*
*  @typedef {Object}  QueueItemOptions
*  @property {Object} [on]
*  Events callbacks
*  
*  When defined at QueueItem level, the callback will execute if
*  triggered by itself or its loader. For instance, a `load` callback
*  wille be triggered once when the item will be loaded.
*  @property {boolean}  [autoprocess=true]
*  if set to `false`, each item must be processed by calling its `process` method
*  or Beloader instance `process` method for a bulk run
*  @property {boolean}  [async=true]
*  If `true`, QueueItem will first try to process request asynchronously
*  @property {boolean}  [cache=true]
*  If `false`, QueueItem will append a unique hash as query string to the request url
*  to disable browser's built-in cache
*  @property {boolean}  [defer=false]
*  If `true`, QueueItem will not resolve until all previous requested items
*  which have also `defer` option set to true is resolved
*  @property {boolean}  [fallbackSync=true]
*  If `true`, QueueItem will try to perform a sync request as fallback. It can
*  be a workaround for CORS issues.
*  @property {string}  [id]
*  Set the ID for the QueueItem. its main use is in conjunction with `awaiting` option
*  @property {string|string[]} [awaiting]
*  Define the dependency(ies) ID that must be resolved before resolving current QueueItem.
*  @property {object} [xhr] __XHR specific properties for async loading__
*  @property {string} [xhr.method='GET']
*  XHR method to perform request
*  @property {mixed}  [xhr.data]
*  Data to send in the request body. _Note: No data processing is done
*  within the core basic XHR instance_
*  @property {Promise|Object} [loader]
*  __Custom loaders__
*  
*  If provided as a promise callback, the loader will be used for `custom` type
*  requests.
*  Alternatively, you can provide loader replacements for known types (see below)
*  @property {Promise}  [loader.sync]
*  Custom loader for sync requests
*  
*  See {@link AbstractLoader#sync}
*  @property {Promise}  [loader.async]
*  Custom loader for async requests
*  
*  See {@link AbstractLoader#async}
*  
*  
*  @example
*  var loader = new Beloader();
*  
*  loader.fetch('script', {
*    url: 'https://cdn.jsdelivr.net/npm/elementify@latest',
*    async: false
*  }); 
*/

/**
*  Stores a BeLoader instance real time progress
*  
*  Statistics can be accessed using DotObjectArray methods.
*  
*  @example
*  var loader = new Beloader({
*    defer: true // load in same order than declared
*    on: {
*      afterprocess: () => { app.start() }
*    }
*  });
*  
*  loader.fetchAll({
*    'js': 'https://cdn.jsdelivr.net/npm/elementify@latest',
*    'font': {
*      webfont: {
*        google: {
*          families: ['Droid Sans', 'Droid Serif']
*        }
*      }
*    },
*    'js': 'https://myserver.com/myapp.js'
*  });
*  
*  loader.progress.data.items.total; // returns 2
*  loader.progress.pull('items.total'); // returns 2
*
*  @typedef {DotObjectArray}  BeloaderProgress
*  
*  @property {Object} items
*  __Items count container__
*  @property {number} items.total
*  Total items in Beloader instance
*  @property {number} items.waiting
*  Total items that are waiting to be processed
*  @property {number} items.pending
*  Total items that are currently processed
*  @property {number} items.processed
*  Total items that have been processed
*  @property {number} items.loaded
*  Total items that have been sucessfully loaded
*  @property {number} items.error
*  Total items which load have failed on error
*  @property {number} items.abort
*  Total items which load have been aborted
*  @property {number} items.timeout
*  Total items wich load have failed on timeout
*  @property {number} items.ready
*  Total items that have been loaded and post-process finished
*  
*  @property {Object} loading
*  __Loading statistics__
*  @property {timestamp} loading.start
*  Process start timestamp
*  @property {timestamp} loading.end
*  Process end timestamp
*  @property {number} loading.elapsed
*  Duration of the process (ms)
*  @property {number} loading.loaded
*  Weight of loaded data. It might not be accurate
*  because relying on {@link src/events/typedef.doc.js~progress} event
*  @property {number} loading.rate
*  Transfer bandwidth. It might not be accurate
*  because relying on {@link progress} event
*  @property {number} loading.complete
*  Loading percentage completed. It might not be accurate
*  because relying on {@link progress} QueueItem event
*  @property {number} loading.total
*  Weight of data to load. It might not be accurate
*  because relying on {@link progress} QueueItem event and
*  server's providing a `content-length` header.
*/
