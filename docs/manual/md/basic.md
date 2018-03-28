# Basic usage

## Assets loading
In most case a simple instance with no options will be enough and you can then fetch assets :

```javascript
var loader = new Beloader();

loader.fetch('script', 'https://code.jquery.com/jquery-3.3.1.js');
loader.fetch('font', {
  webfont: {
    google: {
      families: ['Droid Sans', 'Droid Serif']
    }
  }
});
```

With this, we're not doing far better than directly embedding a script and a link in
HTML code, except loading is asynchronous.

## Using promises to perform actions when assets are loaded

If you want to perform things when assets are loaded, you can use the exposed `promise` property of an item :

```javascript
var loader = new Beloader();

loader.fetch('script', 'https://cdn.jsdelivr.net/npm/elementify@latest')
  .promise.then(function() {
    console.log('Elementify loaded !');
  });

loader.fetch('font', {
  webfont: {
    google: {
      families: ['Droid Sans', 'Droid Serif']
    }
  }
}).then(function() {
  var div = document.createElement('div');
  
  div.innerHTML = '<span style="font-family:\'Droid Sans\'">Hello, world</span>';
  document.body.appendChild(div);
});
```

You may notice that it will be way better to use [Elementify](https://liqueurdetoile.github.io/Elementify/)
to perform the body insertion when
font has loaded. But, we have to make sure that Elementify has loaded __*before*__ font.

The first idea may be to nest fetching and it will work but at the cost of losing
parallels ajax loadings. Anyway, there is better solutions.

### Defering assets loading
Beloader can resolve loadings in the same order that they have been added to the queue.

```javascript
var loader = new Beloader({
  defer: true // Change is here
});

loader.fetch('script', 'https://cdn.jsdelivr.net/npm/elementify@latest')
  .promise.then(function() {
    Elementify.load();
  });

loader.fetch('font', webfont: {
  google: {
    families: ['Droid Sans', 'Droid Serif']
  }
}).then(function() {
  Q('body').append('<div style="font-family:\'Droid Sans\'">Hello, world</div>');
});
```

In that case, Beloader will take care of waiting for Elementify request to resolve before resolving font.
It is possible to use the defer behaviour only on a subset of fetched items
by providing defer as an option to the `fetch` instead of as a global trigger.

### Awaiting dependencies
In some cases, multiple dependencies can't be simply resolved with defer. Beloader
offers an awaiting option to deal with complex patterns.

```javascript
var loader = new Beloader();

loader.fetch('script', {
  id: 'elementify', // Change is here
  url: 'https://cdn.jsdelivr.net/npm/elementify@latest'
})
  .promise.then(function() {
    Elementify.load();
  });

loader.fetch('script', {
   id: 'lodash',
  url: 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.5/lodash.min.js'
})
  .promise.then(function() {
    Elementify.load();
  });
  
loader.fetch('font', {
  awaiting: ['elementify','lodash'] // Change is here
  webfont: {
    google: {
      families: ['Droid Sans', 'Droid Serif']
    }
  }
}).then(function() {
  Q('body').append('<div style="font-family:\'Droid Sans\'">Hello, world</div>');
});
```

## Bulk assets loading
You can provide multiple assets request in a single call. Just set
an id to each asset and swap type as an option value.

```javascript
var loader = new Beloader();
var items = {
  elementify: {
    type: 'script',
    url: 'https://cdn.jsdelivr.net/npm/elementify@latest'
  },
  lodash: {
    type: 'script',
    url: 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.5/lodash.min.js'
  },
  font: {
    type: 'font',
    webfont: {
      google: {
        families: ['Droid Sans', 'Droid Serif']
      }
    }
  }
};

loader.fetchAll(items).promise.then(items => {
  Elementify.load();
  Q('body').append('<div style="font-family:\'Droid Sans\'">Hello, world</div>');
});
```
Each item is available in an array indexed in the same order that they have been declared.
The `fetchAll` promise only resolves when all assets are loaded. If one asset is in error,
the promise will be rejected.


## Delaying queue process
As a default, Beloader will automatically process all fetch requests. In some cases,
you may want to delay the process.

```javascript
var loader = new Beloader({
  autoprocess: false // Add this options
});

loader.fetch('script', {
  id: 'elementify',
  url: 'https://cdn.jsdelivr.net/npm/elementify@latest'
})
  .promise.then(function() {
    Elementify.load();
  });

loader.fetch('script', {
  id: 'lodash',
  url: 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.5/lodash.min.js'
})
  .promise.then(function() {
    Elementify.load();
  });
  
loader.fetch('font', {
  awaiting: ['elementify','lodash']
  webfont: {
    google: {
      families: ['Droid Sans', 'Droid Serif']
    }
  }
}).then(function() {
  Q('body').append('<div style="font-family:\'Droid Sans\'">Hello, world</div>');
});

// Do things that take time and must be done before processing

loader.process(); // Order Beloader to process the loading queue
```


