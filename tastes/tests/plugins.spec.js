const {Beloader} = require('beloader');

describe('Plugins', function () {
  it('should pluginize a function and call init', function () {
    var loader = new Beloader();
    var spy = sinon.spy();

    var plugin = function () {
      this.fixture = 'fixture';
      this.init = function () {
        spy();
      };
    };

    loader.pluginize('plugin', plugin);
    loader.plugin.fixture.should.equal('fixture');
    spy.called.should.be.true;
  });

  it('should pluginize a singleton and call init', function () {
    var loader = new Beloader();
    var spy = sinon.spy();

    var plugin = {
      fixture: 'fixture',
      init: function () {
        spy();
      }
    };

    loader.pluginize('plugin', plugin);
    loader.plugin.fixture.should.equal('fixture');
    spy.called.should.be.true;
  });

  it('should fail on pluginize with error', function () {
    var loader = new Beloader();

    var plugin = {
      fixture: 'fixture',
      init: function () {
        spy(); // eslint-disable-line
      }
    };

    expect(loader.pluginize.bind(loader, 'plugin', plugin)).to.throw(Error);
  });

  it('should throw an exception if name is missing', function () {
    var loader = new Beloader();

    return loader.fetch('plugin').promise['catch'](error => {
      expect(error).to.be.instanceof(TypeError);
    });
  });

  it('should propagate a plugin to item and loader', function () {
    var loader = new Beloader();

    var plugin = {
      fixture: 'fixture'
    };

    loader.pluginize('plugin', plugin);

    return loader.fetch('script', 'https://cdn.jsdelivr.net/npm/elementify@latest')
      .promise.then(item => {
        item.plugin.fixture.should.equal('fixture');
        item.loader.plugin.fixture.should.equal('fixture');
      });
  });

  it('should load plugin from Beloader options with full description', function () {
    var loader = new Beloader({
      plugins: {
        name: 'animations',
        url: 'https://rawgit.com/beloader/beloader-animations/master/dist/beloader-animations.min.js',
        alias: 'ani'
      }
    });

    return loader.ready.then(() => {
      loader.ani.should.be.an('object');
    });
  });

  it('should load plugin from Beloader options with short call', function () {
    var loader = new Beloader({
      plugins: [
        { animations: 'https://rawgit.com/beloader/beloader-animations/master/dist/beloader-animations.min.js' }
      ]
    });

    return loader.ready.then(() => {
      loader.animations.should.be.an('object');
    });
  });

  it('should load plugin sync from Beloader options with short call', function () {
    var loader = new Beloader({
      async: false,
      plugins: [
        { animations: 'https://rawgit.com/beloader/beloader-animations/master/dist/beloader-animations.min.js' }
      ]
    });

    return loader.ready.then(() => {
      loader.animations.should.be.an('object');
    });
  });

  it('should wait for plugin ready promise', function () {
    var p = {
      init: function () {
        this.promise = new Promise((resolve, reject) => {
          setTimeout(resolve, 1000);
        });
      }
    };
    var loader = new Beloader();

    loader.pluginize('p', p);

    return loader.p.promise.then(() => {
      loader.p.should.be.an('object');
    });
  });
});
