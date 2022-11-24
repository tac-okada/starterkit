import imagesLoaded from 'imagesloaded';
import { Modal } from './libs/modal.js';

/*

app.modal.js  -----------------------------------------------

*/
app.modal = (() => {

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

    /* モーダルJS実行 */
    let modal = new Modal;
    modal.initialize();

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

  };

  return {
    resizeHandler,
    scrollHandler,
    initialize
  };
})();