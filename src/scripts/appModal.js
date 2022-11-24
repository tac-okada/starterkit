import { Core } from './libs/core.js';
import { Modal } from './libs/modal.js';

class AppModal extends Core {
/*
  使用可能な定数・変数一覧  -----------------------------------------------
  ● UAなど：this.USER
  ● 画面サイズなど：this.win
  ● メディアクエリ：this.mql（現在のデバイス：pc/tb/sp）
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

    /* ここでブラウザイベントを有効にする */
    this.enableScroll();
    this.win.response = true;

    /* モーダルJS実行 */
    let modal = new Modal;
    modal.initialize(this);

    /* domのyoutubeへの置換 */
    $('#movie01').on('click', function(e){
      e.preventDefault();
      youtubeAPI.youtubeData.push({
        num: $(this).attr('data-ytnum'),
        youtubeId: 't1rFmJMFdKw',
        embedArea: $(this).attr('id'),
        playerReady: false
      });
      //console.info(youtubeData,youtubeData.length)
      youtubeAPI.playerNum = $(this).attr('data-ytnum') - 1;
      youtubeAPI.setYoutube();
    });
  }
};

window.appModal = window.appModal || new AppModal;
/* ブレイクポイント指定：タブレット,スマホ */
appModal.initialize(1024,767);