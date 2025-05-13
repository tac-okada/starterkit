import { Core } from '/src/scripts/libs/core.js';
import { Modal } from '/src/scripts/libs/modal.js';
import Swiper, { Navigation, Pagination, Keyboard, A11y, Autoplay } from 'swiper';

window.addEventListener('load', () => {
  /* ブレイクポイント指定：タブレット,スマホ */
  appSwiper.initialize(1024,767);
});

class AppSwiper extends Core {
/*
  使用可能な定数・変数一覧  -----------------------------------------------
  ● UAなど：this.USER
  ● 画面サイズなど：this.win
  ● メディアクエリ：this.mql（指定したブレイクポイントに基づく現在のデバイスを返す：pc/tb/sp）
*/

  /* スクロール時に実行 */
  scrollHandler () {
    //console.info(this.win.scrollTop,this.win.scrollBottom);
  }

  /* 画面リサイズ時に実行 */
  resetHandler () {
    //console.info(this.win.width,this.mql);
    //this.setSwiper();
  }

  /* ページ読み込み時に実行 */
  loadHandler () {
    this.setSwiper();
  }

  swiper
  swiperBtn

  swiperController () {
    //console.info(this.obj.swiper.autoplay.paused)
    if( !this.obj.swiperBtn.classList.contains('-paused') ){
      this.obj.swiperBtn.classList.add('-paused');
      this.obj.swiper.autoplay.start();
    } else {
      this.obj.swiperBtn.classList.remove('-paused');
      this.obj.swiper.autoplay.stop();
    }
    //this.obj.swiperController.changeBtn(this.obj);
  }

  setSwiper () {
    //let modal = new Modal;
    //console.info(this.swiper)

    Swiper.use([Navigation, Pagination, Keyboard, A11y, Autoplay]);
    this.swiper = new Swiper('.swiper', {
      loop: true,
      autoplay: {
        delay: 3000,
        //pauseOnMouseEnter: true
      },
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
        clickable: true
      },
      breakpoints: {// レスポンシブ：スマホファースト
        1000: {// 1000px以上
          slidesPerView: 2.2
        }
      },
      keyboard: {
        enabled: true,
      },
      a11y: {
        containerMessage: 'カルーセルの説明を入れる',
        prevSlideMessage: '前のスライドへ',
        nextSlideMessage: '次のスライドへ',
        slideLabelMessage:'{{index}}枚目のスライド',
        paginationBulletMessage: '{{index}}枚目のスライドを表示',
      },
      //init: false,
      on: {// イベント
        init: () => {// スライド初期化
          /* モーダルJS実行 */
          //modal.initialize(this);
          this.swiperBtn = document.querySelector('.swiper-play');
          this.swiperBtn.addEventListener('click', { obj: this, handleEvent: this.swiperController});
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
          //console.info(swiper.activeIndex,swiper.realIndex,swiper.isBeginning)
        },
        slideChangeTransitionStart: () => {// 切り替わりアニメーション開始
          //console.info('slideChangeTransitionStart')
        },
        slideChangeTransitionEnd: () => {// 切り替わりアニメーション終了
          //console.info('slideChangeTransitionEnd')
        },
        imagesReady: () => {// スライドの画像の読み込みが完了したとき(※スライド内にimgタグがある場合のみ)
          // 任意の処理を実行
        },
        resize: () => {
          /* モーダルJS実行 */
          //modal.reset(this);
        }
      }
    });

    // 自動再生しない場合はここでstop
    //this.swiper.autoplay.stop();
    // 自動再生する場合はここでクラス付与
    this.swiperBtn.classList.add('-paused')
  }
};

window.appSwiper = window.appSwiper || new AppSwiper;
