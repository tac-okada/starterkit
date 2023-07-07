import { Core } from './libs/core.js';
import { ScrollTrigger } from 'gsap/ScrollTrigger.js';

window.addEventListener('load', () => {
  /* ブレイクポイント指定：タブレット,スマホ */
  appScrolltriger.initialize(1024,767);
});

class AppScrolltriger extends Core {
/*
  使用可能な定数・変数一覧  -----------------------------------------------
  ● UAなど：this.USER
  ● 画面サイズなど：this.win
  ● メディアクエリ：this.mql（指定したブレイクポイントに基づく現在のデバイスを返す：pc/tb/sp）
  ● transitionEndイベント：this.transitionEnd
  ● animationEndイベント：this.animationEnd
*/

  /* スクロール時に実行 */
  scrollHandler () {
    //console.info(this.win.scrollTop,this.win.scrollBottom);
  }

  /* 画面リサイズ時に実行 */
  resetHandler () {
    //console.info(this.win.width,this.mql);
  }

  /* ページ読み込み時に実行 */
  loadHandler () {
    gsap.registerPlugin(ScrollTrigger);

    /* ここでスクロールとブラウザイベントを有効にする */
    this.enableScroll();

    gsap.utils.toArray('.js-trigger').forEach( (_this) => {
      gsap.fromTo(_this, {
        y: '60px',
        autoAlpha: 0,
      },{
        y: '0',
        autoAlpha: 1,

        scrollTrigger: {
          trigger: _this,
          start: 'top center+=300',
          markers: true,
        }
      })
    });

    gsap.utils.toArray('.js-trigger-reverse').forEach( (_this) => {
      gsap.fromTo(_this, {
        y: '60px',
        autoAlpha: 0,
      },{
        y: '0',
        autoAlpha: 1,

        scrollTrigger: {
          trigger: _this,
          start: 'top center+=300',
          end: 'top top-=99999',
          markers: true,
          toggleActions: 'play pause resume reverse'
        }
      })
    });

    gsap.utils.toArray('.js-trigger-scrub').forEach( (_this) => {
      gsap.fromTo(_this, {
        y: '60px',
        autoAlpha: 0,
      },{
        y: '0',
        autoAlpha: 1,

        scrollTrigger: {
          trigger: _this,
          start: 'top center+=300',
          end: 'top center-=100',
          scrub: true,
          markers: true,
          toggleActions: 'play pause resume reverse'
        }
      })
    });

    gsap.utils.toArray('.js-trigger-bg').forEach( (_this) => {
      gsap.fromTo(_this, {
        y: '250px',
      },{
        y: '-250px',

        scrollTrigger: {
          trigger: _this,
          start: 'ceneter+=250px bottom',
          end: 'top+=250px top',
          scrub: 1,
          markers: true,
          toggleActions: 'play pause resume reverse'
        }
      })
    });

    gsap.set('.js-trigger-batch div', {
      y: '100px',
      autoAlpha: 0
    });
    ScrollTrigger.batch('.js-trigger-batch div', {
      batchMax: 3,
      onEnter: batch => gsap.to(batch, {
        y: '0',
        autoAlpha: 1,
        stagger: 0.15,
      }),
/*
      onLeave: batch => gsap.set(batch, {
        y: '100px',
        autoAlpha: 0
      }),
*/
/*
      onEnterBack: batch => gsap.set(batch, {
        y: '0',
        autoAlpha: 1
      }),
*/
      onLeaveBack: batch => gsap.to(batch, {
        y: '100px',
        autoAlpha: 0,
        stagger: 0.15
      }),
      start: 'top center+=100',
      //end: 'center top-=99999',
      markers: true,
    });


    gsap.utils.toArray('.js-trigger-pin').forEach( (_this) => {
      console.info($(_this.querySelector('.obj')))
      let _x = window.innerWidth - _this.querySelector('.obj').clientWidth;
      if( _this.classList.contains('-sec7') || _this.classList.contains('-sec9') ){
        _x = - _x
      }
      gsap.to(_this.querySelector('.obj'), {
        x: _x,

        scrollTrigger: {
          trigger: _this,
          start: 'top center',
          end: 'bottom center',
          scrub: 1,
          pin: true,
          markers: true,
          toggleActions: 'play pause reverse pause'
        }
      })
    });
  }
};

window.appScrolltriger = window.appScrolltriger || new AppScrolltriger;
