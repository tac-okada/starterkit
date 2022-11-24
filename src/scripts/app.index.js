import imagesLoaded from 'imagesloaded';

/*

app.index.js  -----------------------------------------------

*/
app.index = (() => {

  const loadEvents = () => {

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
      $loadingBar.stop().css('width', '100%').on(app.transitionEnd, () => {
        $(this).off(app.transitionEnd);
        $loadingText.stop().text(100);
        /* 念の為再度app.core.setupEvents実行（現在のwindowサイズなどを取得のため） */
        app.core.setupEvents();

        $('body').toggleClass('loading active');
        $('html').addClass('active');
        $loader.on(app.animationEnd, () => {
          $(this).off(app.animationEnd).remove();
          /* ここでブラウザイベントを有効にする */
          app.core.enableScroll();
          app.win.response = true;
        });
      });
    });
  };

  /* 画面リサイズ時に実行 */
  const resizeHandler = () => {
    console.info(app.win.width,app.mql);
  };

  /* スクロール時に実行 */
  const scrollHandler = () => {
    //console.info(app.win.scrollTop,app.win.scrollBottom);
  };

  /* ページ読み込み時に実行 */
  const initialize = () => {
    console.info(app.USER,app.mql,app.win)
    loadEvents(this);
  };

  return {
    resizeHandler,
    scrollHandler,
    initialize
  };
})();