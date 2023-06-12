import { Core } from './libs/core.js';
import imagesLoaded from 'imagesloaded';

window.addEventListener('load', () => {
  /* ブレイクポイント指定：タブレット,スマホ */
  appIndex.initialize(1024,767);
  
});

class AppIndex extends Core {
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
    //console.info(this)

    let $loader = $('#loader');
    let $loadingText = $loader.children('div.block-loader').children('p.txt-loader').children('span.txt-number');
    let $loadingBar = $loader.children('div.block-loader').children('p.bar-loader').children('span.bar');
    let percentage = 0;
    let imgCount = 0;
    let imgLoad = imagesLoaded('body');
    $('body').addClass('loading');
    imgLoad.on('progress', ( instance, image ) => {
      imgCount++;
/*
      var result = image.isLoaded ? 'loaded' : 'broken';
      console.log( 'image is ' + result + ' for ' + image.img.src, imgLoad.images.length );
*/
      percentage = parseInt( ( 100/imgLoad.images.length ) * imgCount );
      //console.info(imgCount,imgLoad.images.length,percentage);
      $loadingBar.stop().css('width', percentage +'%');
      $loadingText.stop().text(percentage);
    });
    imgLoad.on('always', ( instance, image ) => {
      //console.info(imgCount,imgLoad.images.length,percentage);
      $loadingBar.stop().css('width', '100%').on(this.transitionEnd, () => {
        $(this).off(this.transitionEnd);
        $loadingText.stop().text(100);
        /* 念の為再度this.setupEvents実行（現在のwindowサイズなどを取得のため） */
        this.setupEvents();

        //$('body').toggleClass('loading active');
        //$('html').addClass('active');
        $loader.on(this.animationEnd, () => {
          $(this).off(this.animationEnd).remove();
          /* ここでスクロールとブラウザイベントを有効にする */
          this.enableScroll();
        });
      });
    });
  }
};

window.appIndex = window.appIndex || new AppIndex;
