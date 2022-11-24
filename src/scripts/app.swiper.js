import Swiper from 'swiper';

/*

app.swiper.js  -----------------------------------------------

*/
app.swiper = (() => {

  const setSwiper = () => {
    const swiper = new Swiper('.swiper', {
      //loop: true,
      centeredSlides: true,
      slidesPerView: 1.2,
      spaceBetween: 10,// 余白px
      effect: 'slide',// 演出："slide", "fade"(フェード), "cube"(キューブ回転), "coverflow"(カバーフロー) または "flip"(平面回転)
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
      },
      breakpoints: {// レスポンシブ：スマホファースト
        1000: {// 1000px以上
          slidesPerView: 2.2
        }
      },
      on: {// イベント
        init: () => {// スライド初期化
          console.info('init')
        },
        slideChange: () => {// スライドが切り替わったとき※loop時は注意
          // loop時はパラメーター「swiper.activeIndex」「swiper.realIndex」など使用するとエラー出る
        },
        realIndexChange: () => {// スライドが切り替わったとき
          // パラメーター
          // swiper.isBeginning：最初のスライド時「true」※loop時は常にfalse
          // swiper.isEnd：最後のスライド時「true」※loop時は常にfalse
          // swiper.activeIndex：現在アクティブなスライドのインデックス番号「number」※loop時は実際と異なる番号になる
          // swiper.realIndex：ループを考慮した実際のスライドのインデックス番号「number」
          console.info(swiper.activeIndex,swiper.realIndex,swiper.isBeginning)
        },
        slideChangeTransitionStart: () => {// 切り替わりアニメーション開始
          //console.info('slideChangeTransitionStart')
        },
        slideChangeTransitionEnd: () => {// 切り替わりアニメーション終了
          //console.info('slideChangeTransitionEnd')
        },
        imagesReady: () => {// スライドの画像の読み込みが完了したとき(※スライド内にimgタグがある場合のみ)
          // 任意の処理を実行
        }
      }
    });
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
    //console.info(app.USER,app.mql,app.win)
    /* ここでブラウザイベントを有効にする */
    app.core.enableScroll();
    app.win.response = true;
    setSwiper();
  };

  return {
    resizeHandler,
    scrollHandler,
    initialize
  };
})();