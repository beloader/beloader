import anime from 'animejs';
import {Q} from 'elementify';
import AbstractAnimation from 'core/AbstractAnimation';

export default class BackgroundColor extends AbstractAnimation {
  constructor(options = {}) {
    super(options);

    this.checkOpts(['targets', 'from', 'to']);
    this.options.define('duration', 3000);
    this.options.define('easing', 'easeInOutQuad');
    this.options.define('direction', 'alternate');
    this.options.define('loop', true);

    if (!this.options.has('targets')) throw new TypeError('No target defined for backgroundColor fx');
    if (!this.options.has('from')) throw new TypeError('No start color defined for backgroundColor fx');
    if (!this.options.has('to')) throw new TypeError('No end color defined for backgroundColor fx');
  }

  start() {
    // Setting start color
    Q(this.options.pull('targets')).style('backgroundColor', this.options.pull('from'));

    this.animation = anime({
      targets: this.options.pull('targets'),
      backgroundColor: this.options.pull('to'),
      direction: this.options.pull('direction'),
      loop: this.options.pull('loop'),
      easing: this.options.pull('easing'),
      duration: this.options.pull('duration')
    });
  }
}
