import Beloader from 'beloader';

describe('Custom loader callback', function () {

  it('should run a custom loader callback that resolve', function () {
    var loader = new Beloader();
    var l = function () {
      return new Promise((resolve, reject) => {
        resolve();
      });
    };

    return loader.fetch('custom', {loader: l})
      .promise.then(item => item.state.ready.should.be.true);
  });

  it('should run a custom loader callback that reject', function () {
    var loader = new Beloader({autoprocess: false});
    var l = function () {
      return new Promise((resolve, reject) => {
        reject();
      });
    };

    var item = loader.fetch('custom', {loader: l});

    return item.process().promise['catch'](item => {
      item.state.error.should.be.true;
    });
  });

  it('should throw an exception if loader not a Function', function () {
    var loader = new Beloader({autoprocess: false});
    var l = 'wrong';

    var item = loader.fetch('custom', {loader: l});

    return item.process().promise['catch'](item => {
      item.should.be.instanceof(TypeError);
    });
  });

  it('should override sync loader', function () {
    var spy = sinon.spy();
    var sync = function () {
      return new Promise((resolve, reject) => {
        spy();
        resolve();
      });
    };
    var loader = new Beloader({
      loader: {
        sync: sync
      }
    });

    return loader.fetch('script', {
      url: 'https://cdn.jsdelivr.net/npm/elementify@latest',
      async: false
    }).promise.then(item => {
      spy.called.should.be.true;
    });
  });

  it('should override async loader', function () {
    var spy = sinon.spy();
    var async = function () {
      return new Promise((resolve, reject) => {
        spy();
        resolve();
      });
    };
    var loader = new Beloader({
      loader: {
        async: async
      }
    });

    return loader.fetch('script', 'https://cdn.jsdelivr.net/npm/elementify@latest')
      .promise.then(item => {
        spy.called.should.be.true;
      });
  });
});
