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
          end: 'top top-=99999',
          //scrub: false,
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
      onLeave: batch => gsap.set(batch, {
        y: '100px',
        autoAlpha: 0
      }),
      onEnterBack: batch => gsap.set(batch, {
        y: '0',
        autoAlpha: 1
      }),
      onLeaveBack: batch => gsap.to(batch, {
        y: '100px',
        autoAlpha: 0,
        stagger: 0.15
      }),
      start: 'top center+=100',
      //end: 'center top-=99999',
      markers: true,
    });

// if(  )
    const scenes = gsap.utils.toArray('.js-sec');
    //console.info(1 / (scenes.length - 1))
    ScrollTrigger.create({
      trigger: '.-sec7',
      snap: {
        snapTo: 0.1,
        duration: { min: 0.2, max: 1 },
        delay: 0.1
      },
      animation: gsap.to('.-sec7 div', {
        rotation: 720,
        x: '-50vw',
        y: '40vh'
      }),
      scrub: 1,
      pin: true,
      markers: true,
      start: 'top center',
      end: 'bottom center',
    });

    ScrollTrigger.create({
      trigger: '.-sec8',
      snap: {
        snapTo: 1 / (scenes.length - 1),
        duration: { min: 0.2, max: 1 },
        delay: 0.1
      },
      animation: gsap.to('.-sec8 div', {
        rotation: 1800,
        x: '90vw',
      }),
      scrub: 1,
      pin: true,
      markers: true,
      start: 'top center',
      end: 'bottom center',
    });
  }
};

window.appScrolltriger = window.appScrolltriger || new AppScrolltriger;
