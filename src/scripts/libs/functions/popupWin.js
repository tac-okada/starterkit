/*
  ポップアップ制御/setPopupWin/  -----------------------------------------------
  ポップアップ時のサイズなどの制御
  スマホ・タブレット時はtarget='_blank'に置換する
*/
export const setPopupWin = core => {
  const winName = 'popup_win';/* ウィンドウネーム */
  const winWidth = 700;// 横幅
  const winHeight = 800;// 高さ
  const popup = document.querySelectorAll('.js-popup');
  if( core.mql === 'pc' ){// PCのみ
    for (let i = 0; i < popup.length; i++) {
      popup[i].addEventListener('click', function(e){
        e.preventDefault();
        const w = window.open(this.href, winName, 'toolbar=0,location=0,status=0,menubar=0,scrollbars=yes,resizable=1,width=' + winWidth + ',height=' + winHeight );
        w.focus();
      })
    };
  }else{/* SP・Tabletは通常のtarget_blankで開く */
    for (let i = 0; i < popup.length; i++) {
      popup[i].classList.remove('js-popup');
      popup[i].setAttribute( 'target', '_blank' );
    }
  }
};