# Installation

Beloader is built on UMD architecture and can be embedded as a module or standalone as browser script.

## As a module
```
npm install beloader
```

or
```
yarn add beloader
```

Then simply require/import it :
```javascript
import Beloader from 'beloader';
const {Beloader} = require('beloader');
const Beloader = require('beloader').default;
const Beloader = require('beloader').Beloader;
```

Beloader have been built on a ECMA6 class pattern and transpiled.

## In browser
Beloader is available as CDN external library or can easily be installed locally. Beloader is using dynamic imports
with modules. You must require the full path, otherwise Beloader won't be able to resolve modules URL.

### Bundle
```html
<script type="text/javascript" src="https://bundle.run/beloader@latest/dist/beloader.min.js"></script>
```
Bundle generate a beloader object that hoist Beloader constructor. So, you must call it like this :
```javascript
var loader = new beloader.Beloader();
```

### JsDelivr
```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/beloader@latest/dist/beloader.min.js"></script>
```

### Unpkg
```html
<script type="text/javascript" src="https://unpkg.com/beloader@latest/dist/beloader.min.js"></script>
```

### Local install
For browser install, you can simply fetch folder `dist` in [this repo](https://github.com/liqueurdetoile/beloader) (or clone it) and load the script :
```html
<script type="text/javascript" src="myJsFolder/beloader/dist/beloader.min.js"></script>
```

## Using Beloader in browser
There is two ways to embed Beloader in browser to be sure it will be available at runtime :

__Calling it synchronously (in <HEAD> or <BODY> but before subsequent calls)__

```html
<script type="text/javascript" src="beloader.min.js"></script>
```

__Add a callback when loading asynchronously__

```html
<script type="text/javascript" src="beloader.min.js" onload="start()" async></script>
<!-- or -->
<script type="text/javascript" src="beloader.min.js" onload="start()" defer></script>

<script>
  function start() { //stuff here }
</script>
```

## Browser compatibility
Beloader should work with no tweaks in all modern browsers and IE >= 10.