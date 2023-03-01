import { Core } from './libs/core.js';
import lottieWeb from 'lottie-web';

window.addEventListener('load', () => {
  /* ブレイクポイント指定：タブレット,スマホ */
  appLotties.initialize(1024,767);
  
});

class AppLotties extends Core {
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
    const lottiesSample = document.getElementById('lottiesSample'); //アニメーションを格納するDOM要素 
    
    lottieWeb.loadAnimation({
      container: lottiesSample,// アニメーションを格納するDOM要素 
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: 'lotties-sample.json' // JSONファイルのパス
    });
  }
};

window.appLotties = window.appLotties || new AppLotties;
