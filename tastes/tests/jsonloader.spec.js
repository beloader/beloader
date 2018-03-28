import Beloader from 'beloader';

/**
*  @test {JsonLoader}
*/
describe('JsonLoader tests', function () {
  it('should load JSON', function () {
    var loader = new Beloader();

    return loader
      .fetch('json', 'https://reqres.in/api/users/2')
      .promise
      .then(function (item) {
        item.response.should.eql({
          data: {
            'id': 2,
            'first_name': 'Janet',
            'last_name': 'Weaver',
            'avatar': 'https://s3.amazonaws.com/uifaces/faces/twitter/josephstein/128.jpg'
          }
        });
      },
      function (item) {
        console.log('error');
      });
  });

  describe('JsonLoader errors', function () {

    it('should throw a type error if no URL provided', function () {
      var loader = new Beloader();

      return loader.fetch('json').promise['catch'](error => {
        error.should.be.instanceof(TypeError);
      });
    });

    it('should throw a type error if sync method called', function () {
      var loader = new Beloader();

      return loader.fetch('json', 'https://reqres.in/api/users/2').promise.then(item => {
        expect(item.loader.sync.bind(item.loader)).to.throw(TypeError);
      });
    });

    it('should report a 404 error', function () {
      var loader = new Beloader();

      return loader.fetch('json', '/api/unknown/23').promise['catch'](item => {
        item.error.should.be.equal(404);
      });
    });

    it('should report a JSON syntax error', function () {
      var loader = new Beloader();

      return loader.fetch('json', 'https://cdn.jsdelivr.net/npm/elementify@latest').promise['catch'](item => {
        item.state.error.should.be.true;
      });
    });
  });
});
