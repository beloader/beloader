# Use Beloader as a module
Beloader is based on dynamic imports for its own loaders. Therefore, the BeLoader modules
won't be automatically resolved in bundle when using webpack as modules for your
own bundle.

For using Beloader as a module, you need to explicitly import then in your bundle.

You can either import them statically like this :
```javascript
import Beloader from 'beloader';
import 'beloader/dist/modules/FontLoader.min.js'; //will bundle the font loader into the main bundle

const loader = new Beloader();

loader.fetch('font', { webfont: [..] });
```

Or if you want to keep the lazy loading behaviour :
```javascript
import Beloader from 'beloader';

const loader = new Beloader();

import('beloader/dist/modules/FontLoader.min.js').then(() => {
  loader.fetch('font', { webfont: [..] });
});
```
