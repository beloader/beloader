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
});
