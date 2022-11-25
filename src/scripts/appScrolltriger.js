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
    this.win.response = true;

    console.info(gsap,ScrollTrigger)
    const scenes = gsap.utils.toArray('.sec');
    ScrollTrigger.create({
      trigger: '.-sec2',
      snap: {
        snapTo: 1 / (scenes.length - 1),
        duration: { min: 0.2, max: 1 },
        delay: 0.1
      },
      scrub: true,
      pin: true,
      markers: true,
    });
  }
};

window.appScrolltriger = window.appScrolltriger || new AppScrolltriger;
