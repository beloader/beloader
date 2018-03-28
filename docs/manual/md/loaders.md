# Loaders

## Built-in loaders

### Using built-in loaders
Loaders are automatically selected given the `type` parameter value
provided to `fetch` or option provided to `fetchAll`.

See [API](../class/src/beloader.js~Beloader.html#instance-method-fetch) for the list of loaders.

Each QueueItem instance exposes a `loader` property where the given loader instance is accessible.

### Script loader
This loader is designed to load scripts sync or async (default).
It is triggered when requested `type` value is set to `js`, `script`, `javascript` or `ecmascript`.

When loaded async, the script is not evaluated programmatically but inserted in a <SCRIPT> tag.

### Stylesheet loader
This loader is designed to load stylesheets sync or async (default).
It is triggered when requested `type` value is set to `css`, `style`, `styles` or `stylesheet`.

### Font loader
This loader is designed to load fonts sync (default).
It is triggered when requested `type` value is set to `font` or `webfont`.

The font loader relies on webfontloader api to manager font loading. It takes two steps :
- Loading the stylesheet which describes the font
- Loading the font file itself

A font loader instance will only resolve at the very end of the process to guarantee that
font is ready to be used without FOUT.

For more informations about webfontloader configuration, please visit [their website](https://github.com/typekit/webfontloader).

### Image loader
This loader is designed to load images sync or async (default).
It is triggered when requested `type` value is set to `img` or `image`.

The image node will be exposed as `image` property of the requested item. It has to
be managed programmatically or with a plugin.

```javascript
var loader = new Beloader({
  cache: false
});

loader.fetch('img', {
  url: 'https://upload.wikimedia.org/wikipedia/commons/d/d9/Test.png'
}).promise.then(item => {
  document.body.appendChild(item.image);
}).catch(item => {
  console.log(item.error);
});
```

### JSON loader
This loader is designed to load JSON data async (only).
It is triggered when requested `type` value is set to `json`.

JSON data is exposed as `response` property of the requested item.

### None loader
This is a special loader only designed to produce side-effect.
It's especially useful when you want to perform action at a given
step of the loading queue while using the `awaiting` mode.

```javascript
var loader = new Beloader();

loader.fetch('none', {
  awaiting: ['asset1', 'asset2', 'asset5', 'asset6']
}).then(item => {
  // Do things when asset1, asset2, asset5 and asset6 are loaded
  // Plugins will be available
});

loader.fetchAll({
  'asset1' => {
    type: 'script',
    url: 'http://server.com/asset1'
  },
  'asset2' => {
    type: 'script',
    url: 'http://server.com/asset2'
  },
  'asset3' => {
    type: 'css',
    url: 'http://server.com/asset3'
  },
  'asset4' => {
    type: 'css',
    url: 'http://server.com/asset4'
  },
  'asset5' => {
    type: 'script',
    url: 'http://server.com/asset5'
  },
  'asset6' => {
    type: 'json',
    url: 'http://server.com/asset6'
  },
}).then(items => {
  // Only resolved when all assets are resolved  
});
```

### Plugin loader
Another special loader designed to load Beloader plugins asynchronously from url or official repo.

See [plugins](plugins.html) section of the manual for more informations.

## Custom loaders

### Tweaking XMLHttpRequest instance
In async mode, Beloader relies on a very simple XHR instance with nearly zero-configuration.

You can provide `xhr.method` to options for changing the request method option and `xhr.data` to
provide some data to send in the request body. In the latter case, data pre-processing is up to you as
Beloader will output raw `xhr.data` content to the request body.

If you need more fine-grained control over the XHR instance, you can do it with `loadstart` event
callback (see [Events](events.html) section).

```javascript
var loader = new Beloader();

loader.fetch({
  'type': 'image',
  'url': 'http://server.com/script.js',
  'on': {
    'loadstart': function(event) {
      var xhr = event.target.xhr; // Target is Loader
      // or
      var xhr = this.loader.xhr: // Context is QueueItem
      
      xhr.setRequestHeader('Accept', 'weird/mimetype');
    }
  }
});
```

### Replacing sync and async loading engines for built-in loaders
If needed, Beloader let you replace loading engines for built-in loader.

It can be useful if you wish to use a third party ajax query engine for instance like
jQuery or Request. In that case, you must take care of firing intermediate events as needed.

Simply provide a new callback that returns a promise and resolve or reject it at will.

The engines can be overriden for a whole Beloader instance and/or per item added.

```javascript
var sync = function() {
  return new Promise((resolve, reject) => {
    reject();
  });
}

var async = function() {
  return new Promise((resolve, reject) => {
    resolve();
  });
}

var loader = new Beloader({
  loader: {
    sync: sync // Will override all sync loader
  }
});

loader.fetch('script', {
  url: 'https://cdn.jsdelivr.net/npm/elementify@latest',
  loader: {
    async: async // Will override only async loader of this item
  }
});

```
The custom loader will not override data post-process for given type.

### Creating custom type and loader
At last, Beloader let's you create your own loader for unsupported types. The callback
must return and resolve or reject a promise. The callback is called within the Loader context.

```javascript
var myLoader = function() {
  return new Promise((resolve, reject) => {
    // You can access QueueItem instance with this.parent
    // You can access Beloader instance with this.parent.parent
    // You can access plugins with this.pluginName
    // Do things
    if(good) resolve();
    else reject();
  });
}

var loader = new Beloader();

loader.fetch('custom', {
  url: 'https://server.com',
  loader: myLoader
}).then(item => console.log('Hurrah!'));

```