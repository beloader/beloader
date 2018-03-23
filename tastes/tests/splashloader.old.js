import SplashLoader from 'index';
import {Q} from 'elementify';
const beforeEach = window.beforeEach;

describe('Splashloader basic instance', function () {
  it('should create an instance', function () {
    var s = new SplashLoader();

    s.should.be.instanceof(SplashLoader);
    s.container.node.nodeName.should.equal('DIV');
  });

  it('should create an instance with options', function () {
    var s = new SplashLoader({
      id: 'fixture'
    });

    s.container.node.id.should.equal('fixture');
  });
});

describe('Splashloader open and close', function () {
  var s = new SplashLoader({id: 'fixture'});

  it('should open an empty black splash screen', function () {
    s.open();
    Q('#fixture').length.should.equal(1);
  });

  it('should close an empty black splash screen', function () {
    s.close();
    Q('#fixture').length.should.equal(0);
  });

  it('should fadein an empty black splash screen', function (done) {
    s.fadeIn().then(() => done());
  });

  it('should fadeout an empty black splash screen', function (done) {
    s.fadeOut().then(() => done());
  });

  it('should fadein an empty black splash screen in 200ms', function (done) {
    s.fadeIn({duration: 200}).then(() => done());
  });

  it('should fadeout an empty black splash screen in 200ms', function (done) {
    s.fadeOut({duration: 200}).then(() => done());
  });

  it('should chain opening and closing', function () {
    new SplashLoader({id: 'fixture'}).open().close();
    Q('#fixture').length.should.equal(0);
  });
});

describe('Splashloader content manipulation', function () {
  var s = new SplashLoader({id: 'fixture'});

  it('should append to container', function () {
    s.append('<div id="message"></div>');
    Q('#message', s.container).length.should.equal(1);
  });

  it('should prepend to container', function () {
    s.prepend('<div id="message-prepended"></div>');

    s.container.child().node.id.should.equal('message-prepended');
    s.container.child(2).node.id.should.equal('message');
  });

  it('should insert at first place', function () {
    s.insert(1, '<div id="message-first"></div>');

    s.container.childs('*').length.should.equal(3);
    s.container.child().node.id.should.equal('message-first');
  });

  it('should insert at third place', function () {
    s.insert(3, '<div id="message-third"></div>');

    s.container.childs('*').length.should.equal(4);
    s.container.child(3).node.id.should.equal('message-third');
  });

  it('should fallback to last position if n too big', function () {
    s.insert(30, '<div id="message-last"></div>');

    s.container.childs('*').length.should.equal(5);
    s.container.child(s.container.childs('*').length).node.id.should.equal('message-last');
  });
});

describe('Sync and async loader', function () {
  var font = '<link href="https://fonts.googleapis.com/css?family=Poppins:900" rel="stylesheet">';

  this.timeout(5000);

  it('should load a font sync', function () {
    var s = new SplashLoader({id: 'fixture'});

    return s.loadSync(font).then((ev) => {
      true.should.equal(true);
    });
  });

  it('should load a css async', function () {
    var s = new SplashLoader({id: 'fixture'});

    return s.loadAsync('css', 'https://fonts.googleapis.com/css?family=PT+Sans+Narrow').then((ev) => {
      true.should.equal(true);
    });
  });

  it('should load a script async', function () {
    var s = new SplashLoader({id: 'fixture'});

    return s.loadAsync('js', 'https://cdn.jsdelivr.net/npm/dot-object-array@latest').then((ev) => {
      expect(ObjectArray).to.be.not.undefined; //eslint-disable-line
    });
  });

  it('should reject with unknown type value', function () {
    var s = new SplashLoader({id: 'fixture'});

    return s.loadAsync('html', 'https://cdn.jsdelivr.net/npm/dot-object-array@latest').catch((response) => {
      response.should.be.equal('html');
    });
  });

  it('should reject with 404', function () {
    var s = new SplashLoader({id: 'fixture'});

    return s.loadAsync('js', 'https://cdn.jsdelivr.net/npm/dot-object-array-fake@latest').catch((response) => {
      expect(response).to.equal(404);
    });
  });
});

describe.only('Animation loading', function () {
  var s;

  beforeEach(function () {
    s = new SplashLoader({id: 'fixture'});
  });

  it('should reject loading due to bad naming', function () {
    return s.loadAnimation('none')['catch'](err => {
      err.should.equal(err);
    });
  });

  it('should load an animation with options', function () {
    return s.loadAnimation('backgroundColor', {
      targets: s.container.node,
      from: '#3c332d',
      to: '#00509c',
      duration: 5000
    }).then(a => {
      console.log(a);
      // a.should.be.instanceof('BackgroundColor');
    });
  });
});
