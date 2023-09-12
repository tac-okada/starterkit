import { Core } from '/src/scripts/libs/core.js';
import imagesLoaded from 'imagesloaded';

window.addEventListener('load', () => {
  /* ブレイクポイント指定：タブレット,スマホ */
  appImagesLoaded.initialize(1024,767);
  
});

class AppImagesLoaded extends Core {
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
  }

  /* ページ読み込み時に実行 */
  loadHandler () {
    //console.info(this)

    let loader = document.getElementById('loader');
    
    let loadingText = loader.querySelector('.txt-number');
    let loadingBar = loader.querySelector('.bar');
    let percentage = 0;
    let imgCount = 0;
    let imgLoad = imagesLoaded('body');
    document.body.classList.add('loading');

    function transitionEnd(){
      loadingText.textContent = '100';
      /* 念の為再度this.setupEvents実行（現在のwindowサイズなどを取得のため） */
      this.obj.setupEvents();

      document.body.classList.toggle('loading','active');
      document.documentElement.classList.add('active');

      loader.addEventListener('animationend', {obj: this.obj, handleEvent: animationEnd}, {once: true});
    }

    function animationEnd(){
      /* ここでスクロールとブラウザイベントを有効にする */
      this.obj.enableScroll();
    }

    imgLoad.on('progress', ( instance, image ) => {
      imgCount++;
/*
      var result = image.isLoaded ? 'loaded' : 'broken';
      console.log( 'image is ' + result + ' for ' + image.img.src, imgLoad.images.length );
*/
      percentage = parseInt( ( 100/imgLoad.images.length ) * imgCount );
      //console.info(imgCount,imgLoad.images.length,percentage);
      loadingBar.style.width = percentage + '%';
      loadingText.textContent = percentage;
    });
    imgLoad.on('always', ( instance, image ) => {
      //console.info(imgCount,imgLoad.images.length,percentage);
      loadingBar.style.width = '100%';
      loadingBar.addEventListener('transitionend', {obj: this, handleEvent: transitionEnd}, {once: true});
    });
  }
};

window.appImagesLoaded = window.appImagesLoaded || new AppImagesLoaded;
