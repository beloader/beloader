import {check} from 'core/publicpath';

describe('URI checker for CDN', function () {
  it('should set wpp', function () {
    check('http://cdn.io/beloader').should.equal('http://cdn.io/beloader/dist/');
  });

  it('should set wpp', function () {
    check('http://cdn.io/beloader@latest').should.equal('http://cdn.io/beloader@latest/dist/');
  });

  it('should set wpp', function () {
    check('http://cdn.io/beloader@1.2.3').should.equal('http://cdn.io/beloader@1.2.3/dist/');
  });

  it('should set wpp', function () {
    check('http://cdn.io/beloader@latest/dist/beloader.min.js').should.equal('http://cdn.io/beloader@latest/dist/');
  });

  it('should return false', function () {
    check('http://cdn.io/beloader-animations@latest').should.be.false;
  });

  it('should return false', function () {
    check('file://beloader.js').should.be.false;
  });
});
