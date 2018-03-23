import anime from 'animejs';
import {Q} from 'elementify';
import AbstractAnimation from 'core/AbstractAnimation';

export default class ThreeDotsBouncing extends AbstractAnimation {
  constructor(options = {}) {
    super(options);

    this.options.define('duration', 3000);
    this.options.define('offset', 1000);
    this.options.define('dots.width', 30);
    this.options.define('dots.height', 30);
    this.options.define('dots.color', '#fff');
    this.build();
  }

  build() {
    let dd = [
      this.options.pull('duration') + this.options.pull('offset'),
      this.options.pull('duration') / 2,
      this.options.pull('duration') - this.options.pull('offset')
    ];
    let ddr = dd.reverse();

    this.block = Q('+div', {
      id: this.id,
      class: 'tbd',
      style: {
        margin: '0 auto'
      }
    });

    dd.forEach((d, i) => {
      let line = Q('+div', {
        class: 'tbd-line',
        style: 'margin: 1em 0'
      });

      line.append(Q('+div', {
        class: 'tbd-dot',
        style: {
          width: this.options.pull('dots.width'),
          height: this.options.pull('dots.height'),
          backgroundColor: this.options.pull('dots.color')
        },
        data: {
          duration: d,
          'duration-rev': ddr[i]
        }
      }));

      this.block.append(line);
    });
  }

  start() {
    let timeline = anime.timeline({
      loop: true,
      autoplay: true
    });

    timeline.add({
      targets: `#${this.id} .tbd-dot`,
      translateX: Q(`#${this.id}`).width - this.options.pull('dots.width'),
      rotate: 180,
      duration: function (target) {
        return target.getAttribute('data-duration');
      },
      delay: function (target, index) {
        return index * 100;
      },
      elasticity: function (target, index, totalTargets) {
        return 200 + ((totalTargets - index) * 200);
      }
    });

    timeline.add({
      targets: `#${this.id} .tbd-dot`,
      translateX: 0,
      rotate: 0,
      duration: function (target) {
        return target.getAttribute('data-duration-rev');
      },
      delay: function (target, index, totalTargets) {
        return 100 + ((totalTargets - index) * 100);
      },
      elasticity: function (target, index, totalTargets) {
        return 200 + ((index - totalTargets) * 200);
      }
    });

    this.animation = timeline;
  }
}
