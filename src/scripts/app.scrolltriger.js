import { ScrollTrigger } from 'gsap/ScrollTrigger.js';
gsap.registerPlugin(ScrollTrigger);

app.scrolltriger = (() => {

  const setScrollAnimation = () => {
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

/*
    gsap.to('.-obj3', {
      x: 400,
      rotation: 360,
      scrollTrigger: {
        trigger: '.-obj3',
        start: 'top center',
        end: '+=100',
        scrub: true,
        //pin: true,
        markers: true,
      }
    });
*/
  };

  /* 画面リサイズ時に実行 */
  const resizeHandler = () => {
    //console.info(app.win.width,app.mql);
  };

  /* スクロール時に実行 */
  const scrollHandler = () => {
    //console.info(app.win.scrollTop,app.win.scrollBottom);
  };
  
  /* ページ読み込み時に実行 */
  const initialize = () => {
    /* ここでブラウザイベントを有効にする */
    app.core.enableScroll();
    app.win.response = true;

    setScrollAnimation();
  };
  // 初期設定/initModule/終了

  return {
    resizeHandler,
    scrollHandler,
    initialize
  };
  
})();