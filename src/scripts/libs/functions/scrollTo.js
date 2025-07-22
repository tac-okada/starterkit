/*
  スムーススクロール設定/setScroll/  -----------------------------------------------
  aタグのhref属性冒頭に「#」が付く場合、アニメーションして指定位置までスクロールする
  URLに「#」が付く場合も、ディレイ後にアニメーションして指定位置までスクロールする
*/
export const setScrollTo = core => {
  const trigger = document.querySelectorAll('a[href^="#"],area[href^="#"]');
  const scrollSpeed = .5;// スクロール速度
  let targetOffset, scrollFlg;

  const scroll = hash => {
    const targetName = hash.replace('#', '');
    let target;

    if ( targetName.length ) {
      target = document.getElementById(targetName);
      if( target !== null ){// 指定IDが存在する場合スクロールする
        scrollFlg = true;
        const targetRect = target.getBoundingClientRect();
        targetOffset = targetRect.top + core.win.scrollTop;
      } else {// 指定IDが存在しない場合スクロールしない
        scrollFlg = false;
      }
      //console.info(targetOffset)
    } else {// ページTOP「#」の場合スクロールする
      //console.info('aaa')
      scrollFlg = true;
      targetOffset = 0;
    }

    if( scrollFlg ){
      gsap.to(window,
      {
        duration: scrollSpeed,
        scrollTo: targetOffset,
        onComplete: () => {
          if( target !== null ){
            target.setAttribute('tabindex', '-1');
            target.focus();
          }
        }
      }
      );
    }

    return false;
  }

  for (let i = 0; i < trigger.length; i++) {
    trigger[i].addEventListener('click', function(e){
      e.preventDefault();
      if ( location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'')
      && location.hostname == this.hostname ) {
        scroll(this.hash);
      }
    })
  }

  /* URLにハッシュが含まれる場合 */
  if( location.hash ){
    setTimeout(function(){
      scroll(location.hash);
    }, 100)
  }
};