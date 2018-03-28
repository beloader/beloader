import {Beloader} from 'beloader';
import QueueItem from 'queueitem';

/**
*  @test {Beloader#constructor}
*/
describe('Constructor', function () {
  it('should create an instance with no debug', function () {
    var loader = new Beloader();

    loader.should.be.instanceof(Beloader);
  });

  it('should throw an exception with unknown type and no custom loader', function () {
    var loader = new Beloader();

    expect(loader.fetch.bind(loader, 'unknown')).to.throw(TypeError);
  });
});

/**
*  @test {Beloader#fetch}
*/
describe('Fetching an item async', function () {
  this.timeout(5000);

  it('should fetch with none loader', function () {
    var loader = new Beloader();

    var t = loader.fetch('none').promise.then(item => {
      var spy = sinon.spy();

      spy();
      spy.called.should.be.true;
    });

    return t;
  });

  it('should fetch css', function () {
    var loader = new Beloader();
    var item = loader.fetch('css', 'https://fonts.googleapis.com/css?family=Poppins:900');

    item.promise.should.be.instanceof(Promise);
    item.state.processed.should.be.false;

    return item.promise.then(i => {
      i.should.be.instanceof(QueueItem);
      i.state.resolved.should.be.true;
      i.state.loaded.should.be.true;
      i.state.ready.should.be.true;
      i.state.error.should.be.false;
    });
  });

  it('should fetch a script and fail loading without fallback', function () {
    var loader = new Beloader();
    var item = loader.fetch('script', {
      url: 'https://code.jquery.com/jquery-3.3.5.js',
      fallbackSync: false
    });

    return item.promise['catch'](i => {
      i.state.resolved.should.be.true;
      i.state.loaded.should.be.false;
      i.state.ready.should.be.false;
      i.state.error.should.be.true;
    });
  });

  it('should fetch a script and fail loading with fallback to sync', function () {
    var loader = new Beloader();
    var item = loader.fetch('script', {
      url: 'https://code.jquery.com/jquery-3.3.1.js'
    });

    return item.promise['catch'](i => {
      i.should.be.instanceof(QueueItem);
      i.state.resolved.should.be.true;
      i.state.loaded.should.be.false;
      i.state.ready.should.be.false;
      i.state.error.should.be.true;
    });
  });
});

describe('Fetching an item sync', function () {
  it('should load sync', function () {
    var loader = new Beloader({async: false});

    return loader.fetch('script', 'https://cdn.jsdelivr.net/npm/elementify@latest')
      .promise
      .then(item => {
        item.state.ready.should.be.true;
      });
  });
});

describe('Fetching and defer items', function () {
  this.timeout(5000);

  it('should defer loading with per item setting', function () {
    var spy1 = sinon.spy();
    var spy2 = sinon.spy();
    var spy3 = sinon.spy();
    var loader = new Beloader({});

    loader.fetch('font', {
      webfont: {
        google: {
          families: ['Droid Sans', 'Droid Serif']
        }
      },
      defer: true
    }).promise.then(() => spy1());

    loader.fetch('script', {
      url: 'https://code.jquery.com/jquery-3.3.1.js',
      defer: true
    }).promise.then(() => spy2());

    return loader.fetch('style', {
      url: 'https://fonts.googleapis.com/css?family=Poppins:900',
      defer: true
    }).promise.then(() => spy3()).then(() => {
      spy1.calledBefore(spy2).should.be.true;
      spy2.calledBefore(spy3).should.be.true;
    });
  });

  it('should defer loading with global setting', function () {
    var spy1 = sinon.spy();
    var spy2 = sinon.spy();
    var spy3 = sinon.spy();
    var loader = new Beloader({defer: true});

    loader.fetch('font', {
      webfont: {
        google: {
          families: ['Droid Sans', 'Droid Serif']
        }
      }
    }).promise.then(() => spy1());

    loader.fetch('script', {
      url: 'https://code.jquery.com/jquery-3.3.1.js'
    }).promise.then(() => spy2());

    return loader.fetch('style', {
      url: 'https://fonts.googleapis.com/css?family=Poppins:900'
    }).promise.then(() => spy3()).then(() => {
      spy1.calledBefore(spy2).should.be.true;
      spy2.calledBefore(spy3).should.be.true;
    });
  });
});

describe('Fetching and await dependencies', function () {
  this.timeout(5000);

  it('should await dependencies', function () {
    var spy1 = sinon.spy();
    var spy2 = sinon.spy();
    var spy3 = sinon.spy();
    var loader = new Beloader();

    loader.fetch('font', {
      id: 'font',
      awaiting: 'jquery',
      cache: 'false',
      webfont: {
        google: {
          families: ['Droid Sans', 'Droid Serif']
        }
      },
      on: {
        load: () => console.log('loaded: font')
      }
    }).promise.then(() => {
      console.log('resolved: font');
      spy2();
    });

    loader.fetch('script', {
      id: 'jquery',
      url: 'https://code.jquery.com/jquery-3.3.1.js',
      cache: 'false',
      on: {
        load: () => console.log('loaded: jquery')
      }
    }).promise.then(() => {
      console.log('resolved: jquery');
      spy1();
    });

    return loader.fetch('stylesheet', {
      id: 'Poppins',
      url: 'https://fonts.googleapis.com/css?family=Poppins:900',
      cache: 'false',
      awaiting: ['jquery', 'font'],
      on: {
        load: () => console.log('loaded: Poppins')
      }
    }).promise.then(() => {
      spy3();
    }).then(() => {
      console.log('resolved: Poppins');
      spy1.calledBefore(spy2).should.be.true;
      spy2.calledBefore(spy3).should.be.true;
    });
  });
});

describe('fetchAll method', function () {
  it('should load and resolve', function () {
    var loader = new Beloader({
      defer: true // load in same order than declared
    });

    return loader.fetchAll({
      elementify: {
        type: 'js',
        url: 'https://cdn.jsdelivr.net/npm/elementify@latest'
      },
      Droid: {
        type: 'webfont',
        webfont: {
          google: {
            families: ['Droid Sans', 'Droid Serif']
          }
        }
      }
    }).promise.then(items => {
      items[0].id.should.equal('elementify');
      items[0].state.ready.should.true;
      items[1].id.should.equal('Droid');
      items[1].state.ready.should.true;
    });
  });
});

describe('Manual process', function () {
  it('should load and resolve', function () {
    var loader = new Beloader({
      autoprocess: false
    });

    var items = loader.fetchAll({
      elementify: {
        type: 'js',
        url: 'https://cdn.jsdelivr.net/npm/elementify@latest'
      },
      Droid: {
        type: 'webfont',
        webfont: {
          google: {
            families: ['Droid Sans', 'Droid Serif']
          }
        }
      }
    }).promise.then(items => {
      items[0].id.should.equal('elementify');
      items[0].state.ready.should.true;
      items[1].id.should.equal('Droid');
      items[1].state.ready.should.true;
    });

    loader._items.forEach(item => {
      item.state.waiting.should.be.true;
    });
    loader.process();

    return items;
  });
});

describe('Disable cache testing', function () {
  it('should fetch a script', function () {
    var loader = new Beloader({
      cache: false
    });

    return loader.fetch('script', 'https://cdn.jsdelivr.net/npm/elementify@latest')
      .promise.then(item => {
        item.state.ready.should.be.true;
      });
  });

  it('should fetch a script with a query string', function () {
    var loader = new Beloader({
      cache: false
    });

    return loader.fetch('script', 'https://cdn.jsdelivr.net/npm/elementify@latest?test=fixture')
      .promise.then(item => {
        item.state.ready.should.be.true;
      });
  });
});
