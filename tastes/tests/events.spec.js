import Beloader from 'beloader';

describe('Beloader events', function () {
  it('should fire regular events', function () {
    var spyItemadded = sinon.spy();
    var spyBeforeprocess = sinon.spy();
    var spyLoadstart = sinon.spy();
    var spyLoadstarted = sinon.spy();
    var spyLoad = sinon.spy();
    var spyLoadend = sinon.spy();
    var spyReady = sinon.spy();
    var spyReady2 = sinon.spy();
    var spyAfterprocess = sinon.spy();

    var loader = new Beloader({
      on: {
        itemadded: spyItemadded,
        beforeprocess: spyBeforeprocess,
        afterprocess: spyAfterprocess
      }
    });

    this.timeout(5000);

    return loader
      .fetch('json', {
        url: 'https://reqres.in/api/users/2',
        on: {
          loadstart: spyLoadstart,
          loadstarted: spyLoadstarted,
          load: spyLoad,
          loadend: spyLoadend,
          ready: [spyReady, spyReady2]
        }
      })
      .promise
      .then(function (item) {
        spyItemadded.called.should.be.true;
        spyBeforeprocess.called.should.be.true;
        spyLoadstart.called.should.be.true;
        spyLoadstarted.called.should.be.true;
        spyLoad.called.should.be.true;
        spyLoadend.called.should.be.true;
        spyReady.called.should.be.true;
        spyReady2.called.should.be.true;
        spyAfterprocess.called.should.be.true;
      });
  });

  it('should prevent default', function () {
    var loader = new Beloader({
      on: {
        load: function pre(ev) {
          ev.preventDefault();
        }
      }
    });

    return loader
      .fetch('json', 'https://reqres.in/api/users/2?4155s')
      .promise.then((item) => {
        expect(loader.progress.data.items.loaded).to.equal(0);
      });
  });

  it('should stop propagation', function () {
    var spy = sinon.spy();
    var loader = new Beloader({
      on: {
        load: spy
      }
    });

    return loader
      .fetch('json', {
        url: 'https://reqres.in/api/users/2',
        on: {
          load: (event) => event.stopPropagation()
        }
      }).promise.then(() => {
        spy.called.should.be.false;
      });
  });

  it('should stop immediate propagation post', function () {
    var spy = sinon.spy();
    var loader = new Beloader();

    return loader
      .fetch('json', {
        url: 'https://reqres.in/api/users/2',
        on: {
          load: [
            event => event.stopImmediatePropagation(),
            event => spy()
          ]
        }
      }).promise.then(() => {
        spy.called.should.be.false;
      });
  });

  it('should stop immediate propagation pre/post', function () {
    var spy = sinon.spy();
    var loader = new Beloader();

    return loader
      .fetch('json', {
        url: 'https://reqres.in/api/users/2',
        on: {
          ready: [
            function pre(event) { event.stopImmediatePropagation(); },
            event => spy()
          ]
        }
      }).promise.then(() => {
        spy.called.should.be.false;
      });
  });

  it('should stop immediate propagation pre', function () {
    var spy = sinon.spy();
    var loader = new Beloader();

    return loader
      .fetch('json', {
        url: 'https://reqres.in/api/users/2',
        on: {
          ready: [
            function pre(event) { event.stopImmediatePropagation(); },
            function pre(event) { spy(); }
          ]
        }
      }).promise.then(() => {
        spy.called.should.be.false;
      });
  });
});
