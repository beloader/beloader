# Plugins
Plugins are very easy to implements in order to extends Beloader functionnalities and/or behaviours.

## Load plugins

### Name, URL and alias
You can provide up to three options when requiring a plugin :
- name : name of the plugin that must match the name of the variable
exposed in global scope for this given plugin
- url : URL to load plugin from. If not provided, Beloader will assume that it must fetch
plugin in official repo and will try to fetch the `beloader-pluginName` script ('_beloader-_' is
automatically prependend to plugin name) from
jsDelivr CDN : `https://cdn.jsdelivr.net/gh/beloader/beloader-pluginName@latest`
- alias: Name of the variable that will be exposed in Beloader, QueueItem, Loader and Plugin instances
to access plugin properties and methods. If not provided, the `name` will be used.

Only the plugin name is mandatory. Plugin architecture is designed to avoid using `eval`.
Therefore, plugin are always loaded and evaluated in global namespace that may cause
some conflicts for short plugins name.

### Fetch plugins
You can directly use the plugin loader to fetch plugins. As soon as they will be loaded, they will be available
in Beloader, QueueItem, Loader and other Plugin instances.

In case of long name, you can provide an alias that will be used as var name when using plugin

```javascript
var loader = new Beloader({
  defer: true // will load plugins in the same order
});

loader.fetch('plugin', {
  name: 'plugin', // will look for beloader-plugin in official repo
  alias: 'p'
});

loader.fetch('plugin', {
  name: 'myplugin',
  url: 'myURLforThisplugin'
});

// We can use them safely thanks to defer
loader.fetch('none').promise.then(item => {
  p.doSomething(); // use alias
  myplugin.doSomething();
});
```

You can use `awaiting` mode for more exotic loading patterns or fetchAll to concatenate calls to plugins.

### Fetch plugins at Beloader instance creation
Beloader lets you define an array of plugins requires when creating an instance.

In that case, you must use the `ready` promise property to ensure
plugins are resolved firts or set global `defer` option to `true`.

```javascript
var loader = new Beloader({
  plugins: [
    'plugin', // only the name
    {myplugin: 'myURLforThisplugin'}, // shortcut for name + url
    {
      name: 'myLongPluginName', // Full import format
      url: 'http://url',
      alias: 'mlp'
    }
  ]
});

loader.ready.then(() => {
  fetch('none').promise.then(item => {
    plugin.doSomething();
    myplugin.doSomething();
    mlp.doSomething();
  });
});
```

## Custom instant plugins
You can easily add your own plugins to a Beloader instance with the `pluginize` method. Beloader
will wrap your code inside an `AbstractPlugin` instance so all other plugins and events methods will be available.

Beloader will also always calls the `init` function of a plugin when loaded/pluginized.
If the custom plugin is a function, Beloader will create an instance rather than adding raw prototype. It lets
you use the init function as a constructor. The third argument of `pluginize` will be passed
as argument to init function _(and also available under `this.options` anyway)_.

`init` is also a good place to register callbacks for events if needed.

```javascript
var myPlugin1 = {
  mystuff: function() {
    console.log('Yuups');
  }
};

var myPluginClass = function() {
  this.init = function(options) {
    this.index = options.index;
  };

  this.mystuff = function() {
    console.log('Yuups' + this.index);
  };
};

var loader = new Beloader();

loader.pluginize('p1', myPlugin1);
loader.pluginize('p2', myPluginClass, {index: 2});
loader.pluginize('p3', myPluginClass, {index: 3});

loader.ready.then(() => {
  fetch('none').promise.then(item => {
    p1.mystuff(); // echo 'Yuups'
    p2.mystuff(); // echo 'Yuups2'
    p3.mystuff(); // echo 'Yuups3'
  });
});
```

## Async Plugins
A plugin can expose a `promise` property to be treated asynchronously.
PluginLoader will wait for this promise to be resolved for considering
that plugin is ready. It can be useful if plugin have to require some dependencies to be loaded
before being usable.
