import { Core } from '/src/scripts/libs/core.js';
import { ScrollTrigger } from 'gsap/ScrollTrigger.js';

window.addEventListener('load', () => {
  /* ブレイクポイント指定：タブレット,スマホ */
  appClippath.initialize(1024,767);
});

class AppClippath extends Core {
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

    $('.loader').addClass('fo').on(this.animationEnd, () => {
      $('.loader').addClass('hdn').off(this.animationEnd);

      /* ここでスクロールとブラウザイベントを有効にする */
      this.enableScroll();

      gsap.timeline({
        scrollTrigger: {
          trigger: '.face',
          start: 'center center',
          end: 'bottom top-=1000',
          scrub: .5,
          pin: true,
          //markers: true
        }
      })
      .add('scene1')
/*
      .to('.face_svg', {
        scale: 1.2,
      } ,'scene1')
*/
      .to('#path1 polygon', {
        x: /* $('.face').innerWidth() * .82 */ 940
      } ,'scene1')
      .to('#path1 polyline', {
        x: - /* $('.face').innerWidth() * .82 */ 940
      } ,'scene1')
      .add('scene2')
/*
      .to('.face_svg', {
        scale: 1.4,
      } ,'scene2')
*/
      .to('#path2 polygon', {
        y: /* $('.face').innerWidth() * .5*/ 500
      } ,'scene2')
      .to('#path2 polyline', {
        y: - /*$('.face').innerWidth() * .5*/ 500
      } ,'scene2')
      //.call(scene3)
      .add('scene3')
/*
      .to('.face_svg', {
        scale: 1.6,
      } ,'scene3')
*/
      .to('#path3 rect', {
        rotation: -90,
        scale: 0,
        transformOrigin: 'center center',
        //transformOrigin: center,
        //duration: -0.5,
        stagger: {
          amount: .5,
          //each: .02,
          from: 'center',
          //grid: [0, 4],
          //axis: 'y',
        }
      } ,'scene3')
      .add('scene4')
      .to('.face .txt', {
        scale: 2,
        //opacity: 0
      } ,'scene4')

    });
  }
};

window.appClippath = window.appClippath || new AppClippath;
