import { Core } from '/src/scripts/libs/core.js';
import { Modal } from '/src/scripts/libs/modal.js';

window.addEventListener('load', () => {
  /* ブレイクポイント指定：タブレット,スマホ */
  appModal.initialize(1024,767);
});

class AppModal extends Core {
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

    /* ここでスクロールとブラウザイベントを有効にする */
    this.enableScroll();

    /* モーダルJS実行 */
    let modal = new Modal;
    modal.initialize(this);

    /* domのyoutubeへの置換 */
    document.getElementById('movie01').addEventListener('click', function(e){
      e.preventDefault();
      //console.info(e.target.getAttribute('data-ytnum'),e.target.id)
      youtubeAPI.youtubeData.push({
        num: e.target.getAttribute('data-ytnum'),
        youtubeId: 't1rFmJMFdKw',
        embedArea: e.target.id,
        playerReady: false
      });
      //console.info(youtubeData,youtubeData.length)
      youtubeAPI.playerNum = e.target.getAttribute('data-ytnum') - 1;
      youtubeAPI.setYoutube();
    });
  }
};

window.appModal = window.appModal || new AppModal;
