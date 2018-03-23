import {Beloader} from 'beloader';
import QueueItem from 'queueitem';

describe('CSS Loader', function () {
  it('should create an instance of a css loader', function () {
    var loader = new Beloader();
    var item = loader.fetch('css', {
      url: 'https://fonts.googleapis.com/css?family=Poppins:900'
    });

    item.should.be.instanceof(QueueItem);
  });
});
