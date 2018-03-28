# Events
Beloader provides a full internal event system.

For list of the available built-in events, please check
[API](../identifiers.html#events).

## Registering callbacks to be run after of before built-in callback
Beloader let you define if your callback must be run _before_ or _after_ the
matching built-in event.

If you provide a function named `pre`, the callback will be run _before_. If you
provide any other named function or a closure, it will be run _after_.

```javascript
var cbBefore = function pre(event) {
  // will be run before the built-in hook
}

var cbAfter = function (event) {
  // will be run after the built-in hook
}
```

## Registering callbacks in options
You can register callbacks when providing options to a Beloader instance or
creating a QueueItem instance with `fetch`.

```javascript
var cbBefore = function pre(event) {
  // will be run before the built-in hook
}

var cbAfter = function (event) {
  // will be run after the built-in hook
}

var loader = new Beloader({
  on: {
    // Will be fired at each item loadstart event
    loadstarted: event => { console.log('Loading started for ' + event.target.parent.id) },
    afterprocess: cbBefore // Will run before the built-in hook
  }
});

fetch('script', {
  id: 'elementify',
  url: 'https://cdn.jsdelivr.net/npm/elementify@latest',
  on: {
    loadstarted: cbAfter // Will run after the built-in hook only for this item
  }
});

fetch('script', {
  id: 'lodash',
  url: 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.5/lodash.min.js'
});

```

## Registering callbacks externally
You can also register callbacks with the `on` method exposed by Beloader, QueueItem and each
Loader and Plugin.
```javascript
var loader = new Loader();

loader.on('afterprocess', event => console.log('Over'));
```
You can use this way with `autoprocess` option set to false to add event
to QueueItem instances.

## Custom events
Beloader, QueueItem and each Loader and Plugin instance exposes a `fire` method
to trigger events firing.
You can use it to override internal events firing or add your custom ones.

Events are only bubbling up like this :
- Loader -> QueueItem -> Beloader
- Plugin -> Beloader

An event fired at the Beloader level will only affect the Beloader instance.