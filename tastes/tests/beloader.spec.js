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
});

/**
*  @test {Beloader#fetch}
*/
describe('Fetching an item', function () {
  it('should fetch css', function () {
    var loader = new Beloader();
    var item = loader.fetch('css', {url: 'https://fonts.googleapis.com/css?family=Poppins:900'});

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
      i.should.be.instanceof(QueueItem);
      i.state.resolved.should.be.true;
      i.state.loaded.should.be.false;
      i.state.ready.should.be.false;
      i.state.error.should.be.true;
    });
  });

  it('should fetch a script and fail loading with fallback to sync', function () {
    var loader = new Beloader();
    var item = loader.fetch('script', {
      url: 'https://code.jquery.com/jquery-3.3.5.js'
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

describe('Fetching and defer items', function () {
  it('should defer loading', function () {
    var spy1 = sinon.spy();
    var spy2 = sinon.spy();
    var spy3 = sinon.spy();
    var loader = new Beloader();

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
});

describe('Fetching and awaiting dependencies', function () {
  it('should await dependencies', function () {
    var spy1 = sinon.spy();
    var spy2 = sinon.spy();
    var spy3 = sinon.spy();
    var loader = new Beloader();

    loader.fetch('font', {
      id: 'font',
      awaiting: 'jquery',
      webfont: {
        google: {
          families: ['Droid Sans', 'Droid Serif']
        }
      },
      on: {
        loadend: () => console.log('loadend : font')
      }
    }).promise.then(() => {
      console.log('ready: font');
      spy2();
    });

    loader.fetch('script', {
      id: 'jquery',
      url: 'https://code.jquery.com/jquery-3.3.1.js',
      on: {
        loadend: () => console.log('loadend : jquery')
      }
    }).promise.then(() => {
      console.log('ready: jquery');
      spy1();
    });

    return loader.fetch('stylesheet', {
      url: 'https://fonts.googleapis.com/css?family=Poppins:900',
      awaiting: ['jquery', 'font'],
      on: {
        loadend: () => console.log('loadend : css')
      }
    }).promise.then(() => {
      console.log('ready: css');
      spy3();
    }).then(() => {
      spy1.calledBefore(spy2).should.be.true;
      spy2.calledBefore(spy3).should.be.true;
    });
  });
});
