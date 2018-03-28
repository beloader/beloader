# Plugins
Plugins are very easy to implements in order to extends Beloader functionnalities and/or behaviours.

## Load plugins

### Fetch plugins
You can directly use the plugin loader to fetch plugins. As soon as they will be loaded, they will be available
in Beloader, QueueItem, Loader and other Plugin instances.

If you provide only the name of the plugin, Beloader will assume that it must fetch
it in official repo and will try to fetch the `beloader-pluginName` script.

```javascript
var loader = new Beloader({
  defer: true // will load plugins in the same order
});

loader.fetch('plugin', {
  name: 'plugin' // will look for beloader-plugin in official repo
});

loader.fetch('plugin', {
  name: 'myplugin',
  url: 'myURLforThisplugin'
});

// OK, we can go thanks to defer
loader.fetch('none').promise.then(item => {
  plugin.doSomething();
  myplugin.doSomething();
});
```

You can use `awaiting` mode for more exotic loading patterns or fetchAll to concatenate calls to plugins.

### Fetch plugins at Beloader instance creation
Beloader lets you define your plugins when creation an instance. In that case, you must use
the `ready` promise property to ensure plugins have loaded before or set global `defer` option to `true`

```javascript
var loader = new Beloader({
  plugins: [
    'plugin',
    {myplugin: 'myURLforThisplugin'}
  ]
});

loader.ready.then(() => {
  fetch('none').promise.then(item => {
    plugin.doSomething();
    myplugin.doSomething();
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
