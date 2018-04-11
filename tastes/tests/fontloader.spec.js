import {Beloader} from 'beloader';

describe('Font loader tests', function () {
  it('should throw an exception if no webfont object provided', function () {
    var loader = new Beloader();

    return loader.fetch('font').promise['catch'](err => {
      err.should.be.instanceof(TypeError);
    });
  });

  it('should throw an exception if async option is false', function () {
    var loader = new Beloader();
    var p = loader.fetch('font', {
      async: false,
      webfont: {
        google: {
          families: ['Droid Sans', 'Droid Serif']
        }
      }
    }).promise;

    return p['catch'](item => {
      item.error.should.be.instanceof(TypeError);
    });
  });

  it('should fail loading', function () {
    var loader = new Beloader();
    var p = loader.fetch('font', {
      webfont: {
        timeout: 1000,
        google: {
          families: ['Blap']
        }
      }
    }).promise;

    return p['catch'](item => {
      item.state.error.should.be.true;
    });
  });

  it('should run callbacks for webfont', function () {
    var loader = new Beloader();
    var spy1 = sinon.spy(function spy1() {});
    var spy2 = sinon.spy(function spy2() {});
    var spy3 = sinon.spy(function spy3() {});
    var p = loader.fetch('font', {
      webfont: {
        google: {
          families: ['Droid Sans', 'Droid Serif']
        },
        loading: spy1,
        active: spy2,
        inactive: spy3
      }
    }).promise;

    return p.then(item => {
      spy1.called.should.be.true;
      spy2.called.should.be.true;
      spy3.called.should.be.false;
    });
  });

  it('should fail loading and run callbacks for webfont', function () {
    var loader = new Beloader();
    var spy1 = sinon.spy(function spy1() {});
    var spy2 = sinon.spy(function spy2() {});
    var spy3 = sinon.spy(function spy3() {});
    var p = loader.fetch('font', {
      webfont: {
        google: {
          families: ['Blap']
        },
        timeout: 1000,
        loading: spy1,
        active: spy2,
        inactive: spy3
      }
    }).promise;

    return p['catch'](item => {
      spy1.called.should.be.true;
      spy2.called.should.be.false;
      spy3.called.should.be.true;
    });
  });
});
