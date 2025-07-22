/*
  lineブラウザ or liff 外部リンク/setLine/  -----------------------------------------------
*/
export const setLine = core => {
  const lineLink = document.querySelectorAll('.js-lineLink');
  const liffLink = document.querySelectorAll('.js-liffLink');
  const liffClose = document.querySelectorAll('.js-liffClose');
  let _url;

  // LINEブラウザの場合のみ → https://○○○○?openExternalBrowser=1
  if( core.USER.webView === 'line' ){
    for (let i = 0; i < lineLink.length; i++) {
      lineLink[i].addEventListener('click', (e) => {
        e.preventDefault();
        _url = lineLink[i].getAttribute('href') + '?openExternalBrowser=1';
        window.open(_url, '_blank');
      });
    }
  }

  if( liff.isInClient() ){
    // LIFFの場合のみ「liff.openWindow」で開く
    for (let i = 0; i < liffLink.length; i++) {
      liffLink[i].addEventListener('click', (e) => {
        e.preventDefault();
        _url = liffLink[i].getAttribute('href');
  
        liff.openWindow({
          url: _url,
          external: true
        });
      })
    }

    // LIFFの場合のみ「liff.closeWindow」で閉じる
    for (let i = 0; i < liffClose.length; i++) {
      liffClose[i].addEventListener('click', (e) => {
        e.preventDefault();
        liff.closeWindow();
      });
    }
  }
};