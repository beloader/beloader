/**
*  @file beloader.js
*  @author Liqueur de Toile <contact@liqueurdetoile.com>
*  @licence AGPL-3.0 {@link https://github.com/liqueurdetoile/beloader/blob/master/LICENSE}
*/

import 'core/publicpath';
import 'es6-promise/auto';
import ObjectArray from 'dot-object-array';
import uniqid from 'uniqid';
import AbstractEventManager from 'core/AbstractEventManager';
import AbstractPlugin from 'core/AbstractPlugin';
import QueueItem from 'queueitem';

/**
*  Highly customizable and lightweight assets loader
*
*  You can create as many loaders instance as needed. Inside one instance, you can access
*  specific loaders or functionnalities and order loading sequence with the use
*  of defer or awaiting options, see {@link Beloader#fetch}.
*
*  @version 1.0.0
*  @since 1.0.0
*  @author Liqueur de Toile <contact@liqueurdetoile.com>
*  @extends {AbstractEventManager}
*
*  @example
*  var loader = new Beloader();
*
*  // Display a text only when font is ready to avoit FOUT
*  // It relies on webfontloader
*  loader.fetch('font', {
*    webfont: {
*      google: {
*        families: ['Droid Sans', 'Droid Serif']
*      }
*    }
*  }).then(function() {
*    document.body.innerHTML += '<div style="font-family:\'Droid Sans\'">Fixture</div>';
*  });
*
*  // ********************
*  // Load external libraries and only run custom script when they're loaded
*  // *********************
*
*  // Example with defer
*  // Not the best use case because the two external libraries don't depend on each other
*  // Lodash loading will not resolve until elementify resolved
*  loader.fetch('script', {
*    url: 'https://cdn.jsdelivr.net/npm/elementify@latest',
*    defer: true;
*  });
*
*  loader.fetch('script', {
*    url: 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.5/lodash.min.js',
*    defer: true;
*  });
*
*  loader.fetch('script', {
*   url: 'myscript',
*   defer: true
*  });
*
*  // Example with awaiting
*  // More suitable to optimize loading
*  loader.fetch('script', {
*   url: 'myscript',
*   awaiting: ['elementify', 'lodash']
*  });
*
*  loader.fetch('script', {
*    id: 'elementify',
*    url: 'https://cdn.jsdelivr.net/npm/elementify@latest'
*  });
*
*  loader.fetch('script', {
*    id: 'lodash',
*    url: 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.5/lodash.min.js'
*  });
*
*/
export default class Beloader extends AbstractEventManager {
  /**
  *  Beloader constructor
  *
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @param {BeloaderOptions}  options Global options for Beloader instance
  *  @returns {Beloader} Beloader instance
  */
  constructor(options = {}) {

    super(options.on);
    delete options.on;

    /**
    *  List of queued items in Beloader instance
    *
    *  @since 1.0.0
    *  @type {Array}
    *
    */
    this._items = [];

    /**
    *  List of named queued items in Beloader instance
    *
    *  @since 1.0.0
    *  @type {Object}
    */
    this._awaitables = {};

    /**
    *  Active Plugins list
    *
    *  @since 1.0.0
    *  @type {DotObjectArray}
    */
    this._plugins = new ObjectArray();

    // Import plugins set in options
    if (options.plugins) {
      let plugins = {};

      if (typeof options.plugins === 'string') options.plugins = [options.plugins];

      if (options.plugins instanceof Array) {
        options.plugins.forEach(plugin => {
          if (typeof plugin === 'string') {
            plugins[plugin] = {
              type: 'plugin',
              name: plugin
            };
          } else {
            if (plugin.name) {
              plugins[plugin.name] = {
                type: 'plugin',
                name: plugin.name,
                url: plugin.url
              };
            } else {
              plugins[Object.keys(plugin)[0]] = {
                type: 'plugin',
                name: Object.keys(plugin)[0],
                url: Object.values(plugin)[0]
              };
            }
          }
        });

        this.ready = this.fetchAll(plugins);
      } else throw new TypeError('Beloader: Plugins list must be an array');
    }

    /**
    *  Options for the Beloader instance. See {@link Beloader#constructor}
    *
    *  @since 1.0.0
    *  @type {DotObjectArray}
    */
    this.options = new ObjectArray(options);
    this.options.define('autoprocess', true);
    this.options.define('async', true);
    this.options.define('defer', false);
    this.options.define('cache', true);
    this.options.define('fallbackSync', true);

    /**
    *  Progress statistics for the Beloader instance.
    *
    *  @since 1.0.0
    *  @type {BeloaderProgress}
    */
    this.progress = new ObjectArray({
      items: {
        total: 0,
        waiting: 0,
        pending: 0,
        processed: 0,
        loaded: 0,
        error: 0,
        abort: 0,
        timeout: 0,
        ready: 0
      },
      loading: {
        complete: 0,
        elapsed: 0,
        loaded: 0,
        rate: 0
      }
    });
  }

  /**
  *  Add an item to the loading queue and return a promise
  *
  *  An item is resolved (or failed) under several conditions :
  *  - Item have been loaded
  *  - Item is ready (webfontloader for instance)
  *  - If deferred, all previously defferred items in the queue are resolved
  *  - If awaiting items, all required items are resolved
  *
  *  Supported types relies on loaders that may accept/require specific options :
  *  - `font`, `webfont` : {@link FontLoader} - Async only
  *  - `css`, `style`, `styles`, `stylesheet` : {@link StylesheetLoader}
  *  - `js`, `script`, `javascript`, `ecmascript` : {@link ScriptLoader}
  *  - `json` : {@link JsonLoader} - Async only
  *  - `img`, `image` : {@link ImageLoader}
  *  - `plugin` : {@link PluginLoader}
  *  - `none` : Beloader will simulate
  *  a loading sequence that is ever successfull. It can be used
  *  with awaiting to create side-effect and trigger callback
  *
  *  Any other value will throw an error, except if a custom loader callback
  *  is provided in `options.loader`.
  *
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @param {!String} type  Type of item to load (see above)
  *  @param {String|QueueItemOptions} [options]
  *  If a string is provided, Beloader will use it as a value
  *  for the `url` option.
  */
  fetch(type, options = {}) {
    let item;

    if (typeof options === 'string') options = {url: options};
    options = new ObjectArray(options);
    options.define('autoprocess', this.options.pull('autoprocess'));
    options.define('async', this.options.pull('async'));
    options.define('defer', this.options.pull('defer'));
    options.define('cache', this.options.pull('cache'));
    options.define('fallbackSync', this.options.pull('fallbackSync'));
    options.define('xhr', this.options.pull('xhr'));
    options.define('loader', this.options.pull('loader'));
    // Append a unique hash to url if cache set to false
    if (options.data.url && !options.data.cache) {
      if (options.data.url.indexOf('?') > 0) options.data.url += '&' + uniqid();
      else options.data.url += '?' + uniqid();
    }

    item = new QueueItem(type, this, options);
    this._items.push(item);
    if (options.data.id) this._awaitables[options.data.id] = false;
    this.fire('itemadded', this, item);

    this.progress.push('items.total', this._items.length);
    this.progress.push('items.waiting', this.progress.pull('items.waiting') + 1);

    return item;
  }

  /**
  *  Convenient method for bulk loading
  *
  *  provided object must have id as keys and provide the type
  *  parameter as an option value.
  *
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @param {Object} items Items to load
  *  @returns {QueueItem[]} Items loaded
  *  The array expose a promise property that is resolved
  *  with Promise.all
  *  @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all
  *  @example
  *  var loader = new Beloader({
  *   defer: true // load in same order than declared
  *  });
  *
  *  loader.fetchAll({
  *   elementify: {
  *     type: 'js',
  *     url: 'https://cdn.jsdelivr.net/npm/elementify@latest'
  *   },
  *   Droid: {
  *     type: 'font',
  *     webfont: {
  *       google: {
  *         families: ['Droid Sans', 'Droid Serif']
  *       }
  *     }
  *   }).promise.then((...items) => start());
  *
  */
  fetchAll(items) {
    let queuedItems = [];
    let promises = [];

    items = new ObjectArray(items);
    items.forEach(function (options, id) {
      let item, type = options.type;

      delete options.type;
      options.id = id;
      item = this.fetch(type, options);
      queuedItems.push(item);
      promises.push(item.promise);
    }.bind(this));

    queuedItems.promise = Promise.all(promises);
    return queuedItems;
  }

  /**
  *  Process all items in the queue that are waiting.
  *  Obviously, it must be used with `autoprocess` set to `false`
  *
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  */
  process() {
    this._items.forEach(item => {
      /* istanbul ignore else */
      if (item.state.waiting) item.process();
    });
  }

  /**
  *  Import plugin into Beloader instance and extends
  *  native method of Beloader, QueueItem and Loader
  *  instances with plugin instance.
  *
  *  The plugin will extends an {@link AbtractPlugin} instance and
  *  therefor will be able to throw events.
  *
  *  A plugin will only be available in QueueItem and Loader
  *  instances created __after__ plugin import.
  *
  *  The `init` method of a plugin is automatically
  *  called after plugin import.
  *
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @param {string} name Name for the plugin
  *  @param {Object|Function} Plugin Plugin constructor or singleton
  *  @param {Object} [options={}] Plugin's options passed to constructor
  *  @throws {Error}  If unable to load plugin
  */
  pluginize(name, Plugin, options = {}) {
    let plugin = AbstractPlugin;

    options = new ObjectArray(options);
    options.push('name', name);
    options.define('alias', options.data.name);

    try {
      if (Plugin instanceof AbstractPlugin) {
        plugin = new Plugin(this, options);
        this._plugins.push(name, plugin);
      } else {
        plugin = new AbstractPlugin(this, options);
        if (Plugin instanceof Function) Plugin = new Plugin();
        for (let p in Plugin) {
          /* istanbul ignore else */
          if (Plugin.hasOwnProperty(p)) plugin[p] = Plugin[p];
        }
        this._plugins.push(name, plugin);
      }
      /* istanbul ignore else */
      if (plugin.init instanceof Function) plugin.init(options);
      /** @ignore */
      /* istanbul ignore else */
      this[options.data.alias] = plugin;
    } catch (e) {
      throw new Error('Unable to pluginize : ' + name + ' [' + e + ']');
    }
  }

  /**
  *  loadstart built-in callback
  *
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *  @listens {loadstart}
  *  @emits {beforeprocess}
  */
  _loadstart() {
    if (!this.progress.has('loading.start')) {
      this.fire('beforeprocess', this);
      this.progress.push('loading.start', +new Date());
    }
    this.progress.data.items.waiting -= 1;
    this.progress.data.items.pending += 1;
  }

  /**
  *  progress built-in callback
  *
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *  @listens {progress}
  */
  _progress() {
    this._updateProgress();
  }

  /**
  *  load built-in callback
  *
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *  @listens {load}
  */
  _load() {
    this.progress.data.items.loaded += 1;
  }

  /**
  *  error built-in callback
  *
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *  @listens {error}
  */
  _error() {
    this.progress.data.items.error += 1;
  }

  /**
  *  abort built-in callback
  *
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *  @listens {abort}
  */
  _abort() {
    this.progress.data.items.abort += 1;
  }

  /**
  *  timeout built-in callback
  *
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *  @listens {timeout}
  */
  _timeout() {
    this.progress.data.items.timeout += 1;
  }

  /**
  *  loadend built-in callback
  *
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *  @listens {loadend}
  *  @emits {ready}
  *  @emits {afterprocess}
  */
  _loadend() {
    let previousDeferResolved = true;

    // Resolve item or defer resolving
    this._items.forEach(item => {
      // Resolvable except if deferred and previous deffered not solved
      let resolvable = item.defer ? previousDeferResolved : true;

      // Check dependencies and update resolvable if dependencies not loaded
      if (item.awaiting) {
        item.awaiting.forEach(function (dependency) {
          if (!this._awaitables[dependency]) resolvable = false;
        }.bind(this));
      }

      // Resolve item
      if (item.state.processed && !item.state.resolved && resolvable) {
        // Update progress
        this.progress.data.items.pending -= 1;
        this.progress.data.items.processed += 1;
        this._updateProgress();
        item.state.resolved = true;
        if (item.state.loaded) {
          item._resolve(item);
          item.state.ready = true;
          item.fire('ready', item);
          this.progress.data.items.ready += 1;
        } else {
          item._reject(item);
        }
      }

      // Update previous defer
      if (item.defer && !item.state.processed) previousDeferResolved = false;
    });

    // After event
    if (this.progress.data.items.processed === this.progress.data.items.total) {
      this.fire('afterprocess', this);
      this.progress.push('loading.complete', 100);
      this.progress.push('loading.end', +new Date());
      this.progress.push('loading.elapsed', this.progress.data.loading.end - this.progress.data.loading.start);
    }
  }

  /**
  *  Update loading progress statistics
  *
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  */
  _updateProgress() {
    let loaded = 0, total = 0, elapsed;

    elapsed = +new Date() - this.progress.data.loading.start;
    this._items.forEach(function (item) {
      loaded += item.progress.data.loaded;
      total += item.progress.data.total;
    });

    this.progress.push('loading.elapsed', elapsed); // milliseconds
    this.progress.push('loading.loaded', loaded); // Bytes
    this.progress.push('loading.rate', loaded / elapsed * 1000); // Bytes/s
    /* istanbul ignore else */
    if (total) {
      this.progress.push('loading.total', total); // Bytes
      this.progress.push('loading.complete', loaded / total * 100); // Bytes
    }
  }
}

export {Beloader};
