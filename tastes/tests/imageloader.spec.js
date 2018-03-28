import Beloader from 'beloader';

describe('Image loader', function () {
  it('should initialize image container', function () {
    var loader = new Beloader();
    var img = loader.fetch('image', 'https://upload.wikimedia.org/wikipedia/commons/d/d9/Test.png');

    return img.loaderReady.then(item => {
      item.image.nodeName.should.equal('IMG');
    });
  });

  it('should load image sync with attributes', function () {
    var loader = new Beloader();
    var img = loader.fetch('image', {
      url: 'https://upload.wikimedia.org/wikipedia/commons/d/d9/Test.png',
      async: false,
      attributes: {
        alt: 'fixture'
      }
    });

    return img.promise.then(item => {
      item.image.src.should.equal('https://upload.wikimedia.org/wikipedia/commons/d/d9/Test.png');
      item.image.alt.should.equal('fixture');
    });
  });

  it('should load image async as blob', function () {
    var loader = new Beloader();

    return loader.fetch('img', 'https://upload.wikimedia.org/wikipedia/commons/d/d9/Test.png')
      .promise.then(item => {
        item.image.src.split('blob:').length.should.equal(2);
      });
  });

  it('should load image async as base64', function () {
    var loader = new Beloader();

    return loader.fetch('img', {
      url: 'https://upload.wikimedia.org/wikipedia/commons/d/d9/Test.png',
      base64: true
    })
      .promise.then(item => {
        item.image.src.split('base64,').length.should.equal(2);
      });
  });

  it('should throw an error', function () {
    var loader = new Beloader();

    expect(loader.fetch.bind('loader', 'img')).to.throw(TypeError);
  });
});
