/*
  ie対応consolelog/setConsoleIe/  -----------------------------------------------
  consoleを仕込むとIEでエラーが出るのを回避
*/
const setConsoleIe = () => {
  if( ! ( 'console' in window ) ){
    window.console = {};
    window.console.info = function ( str ) {
      return str;
    };
    window.console.log = function ( str ) {
      return str;
    };
  };
};


/*
  ポップアップ制御/setPopupWin/  -----------------------------------------------
  ポップアップ時のサイズなどの制御
  スマホ・タブレット時はtarget='_blank'に置換する
*/
const setPopupWin = core => {
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


/*
  スムーススクロール設定/setScroll/  -----------------------------------------------
  aタグのhref属性冒頭に「#」が付く場合、アニメーションして指定位置までスクロールする
  URLに「#」が付く場合も、ディレイ後にアニメーションして指定位置までスクロールする
*/
const setScrollTo = core => {
  const trigger = document.querySelectorAll('a[href*="#"],area[href*="#"]');
  const scrollSpeed = .5;// スクロール速度
  let targetOffset;

  const scroll = hash => {
    const targetName = hash.replace('#', '');

    if ( targetName.length ) {
      const target = document.getElementById(targetName);
      const targetRect = target.getBoundingClientRect();
      targetOffset = targetRect.top + core.win.scrollTop;
      //console.info(targetOffset)
    } else {
      targetOffset = 0;
    }
    gsap.to(window, {duration: scrollSpeed, scrollTo: targetOffset});
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


/*
  アコーディオン/setAccordion/  -----------------------------------------------
*/
const setAccordion = () => {
  let toggleButton = document.querySelectorAll('.js-accorBtn');
  for (let i = 0; i < toggleButton.length; i++) {
    toggleButton[i].addEventListener('click', function(){
      let target = this.nextElementSibling;
      const result = target.classList.contains('open');
      if (result) {
        /* 閉じる */
        this.classList.remove('open');
        target.classList.remove('open');
        gsap.to(target, {
          height: 0,
          duration: 0.2,
        });
      }else{
        /* 開く */
        this.classList.add('open');
        gsap.to(target,{
          height: 'auto',
          duration: 0.2,
          onComplete(){
            target.classList.add('open');
          }
        });
      }
    })
  }
};


/*
  SP時にTELリンク/setTelCall/  -----------------------------------------------
  head内に設置：<meta name="format-detection" content="telephone=yes">
  リンクさせる：<p class="js-telCall" x-ms-format-detection="none">0120-00-0000</p>
  リンクさせない：<p class="disableTel" x-ms-format-detection="none">0120-00-0000</p>
  core.USER.isMobileでUA判定し「sp」or「tb」のみ実行
*/
const setTelCall = core => {
  let telCall = document.querySelectorAll('.js-telCall'),
  txt, num;
  //console.info(core.USER)
  if ( core.USER.isMobile ){
    for (let i = 0; i < telCall.length; i++) {
      //console.info(telCall[i])
      txt = telCall[i].textContent;
      num = txt.replace(/-/g, '');
      //console.info(txt,num);
      telCall[i].innerHTML = '<a href="tel:' + num + '" >' + txt + '</a>';
    };
  };
};


/*
  マウス追従/setCrsl/  -----------------------------------------------
*/
const setCrsl = core => {

  const crsl = document.createElement('div');
  crsl.id = 'crsl';
  document.body.appendChild(crsl);
  const crslArea = document.querySelectorAll('.js-crslArea');

  //console.info(core.USER.isMobile)

  if( !core.USER.isMobile ){
    document.addEventListener('mousemove', (e) => {
      crsl.style.transform = 'translate(' + e.clientX + 'px, ' + e.clientY + 'px)';
    });

    for (let i = 0; i < crslArea.length; i++) {
      console.info(i,crslArea)
      crslArea[i].addEventListener('mouseover', () => {
        crsl.classList.add('over');
      });
      crslArea[i].addEventListener('mouseout', () => {
        crsl.classList.remove('over');
      });
    }
  }
};


export { setConsoleIe, setPopupWin, setScrollTo, setAccordion, setTelCall, setCrsl }
