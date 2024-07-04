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
    let target;

    if ( targetName.length ) {
      target = document.getElementById(targetName);
      const targetRect = target.getBoundingClientRect();
      targetOffset = targetRect.top + core.win.scrollTop;
      //console.info(targetOffset)
    } else {
      target = document.body;
      targetOffset = 0;
    }
    gsap.to(window,
    {
      duration: scrollSpeed,
      scrollTo: targetOffset,
      onComplete: () => {
        //console.info(focus)
        target.setAttribute('tabindex', '-1');
        target.focus();
      }
    }
    );
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
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !expanded);

      if (!expanded) {
        /* 開く */
        this.classList.add('open');
        target.removeAttribute('hidden');
        gsap.to(target,{
          height: 'auto',
          duration: 0.2,
          onComplete(){
            target.classList.add('open');
            target.focus();
          }
        });
      }else{
        /* 閉じる */
        this.classList.remove('open');
        target.classList.remove('open');
        gsap.to(target, {
          height: 0,
          duration: 0.2,
          onComplete: () => {
            //target.classList.add('hdn'); 
            target.setAttribute('hidden', '');
          }
        });
      }
    })
  }
};


/*
  タブUI/setTab/  -----------------------------------------------
*/
const setTab = () => {
  let tabBtn = document.querySelectorAll('.js-tabBtn');
  let tabs = document.querySelector('[role="tablist"]');
  //console.info(tabs)

  for (let i = 0; i < tabBtn.length; i++) {
    tabBtn[i].addEventListener('click', function(){
      //console.info(this.closest('ul').nextElementSibling.children);
      let tabArea = this.closest('ul').nextElementSibling.children;
      let target = this.closest('ul').nextElementSibling.children[i];
      const hdn = target.getAttribute('hidden') === '';

      if(hdn){
        for (let x = 0; x < tabArea.length; x++) {
          let tab = this.closest('ul').children[x].querySelector('.js-tabBtn');
          tab.classList.remove('active');
          tab.setAttribute('aria-selected', false);
          tabArea[x].setAttribute('hidden', '');
          //console.info(x,tabArea.length)
          if( x + 1 === tabArea.length ){
            this.classList.add('active');
            this.setAttribute('aria-selected', true);
            target.removeAttribute('hidden');
          }
        }
      }
    })
  }

  // tabListの中で表示されているタブを指定するようの定数。
  let tabFocus = 0;

  if( tabs !== null ){
    tabs.addEventListener("keydown", e => {
      //console.info(tabBtn, tabFocus, tabBtn.length - 1)
      //← →を押したら
      if (e.keyCode === 37 || e.keyCode === 39) {
        tabBtn[tabFocus].setAttribute("tabindex", -1);
  
        if (e.keyCode === 37) {
          // ← を押したら
          tabFocus--;
          // 最初にいる場合は、最後に移動します
          if (tabFocus < 0) {
            tabFocus = tabBtn.length - 1;
          }
        } else if (e.keyCode === 39) {
          // → を押したら
          tabFocus++;
          //console.info(tabFocus, tabBtn.length)
          // 最後にいる場合は、最初に移動します
          if (tabFocus >= tabBtn.length) {
            tabFocus = 0;
          }
        }
        tabBtn[tabFocus].setAttribute("tabindex", 0);
        tabBtn[tabFocus].focus();
      }
    });
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
  enterキー無効/setNoEnterkey/  -----------------------------------------------
*/
const setNoEnterkey = () => {
  if( document.querySelector('form') != null ){
    const input = document.querySelector('form');
    input.onkeypress = e => {
      //console.info(e);
      const key = e.keyCode || e.charCode || 0;
      if (key === 13) {
        e.preventDefault();
      }
    };
  }
};


/*
  チェックボックス・ラジオボタン切り替え/setLabelChanger/  -----------------------------------------------
*/
const setLabelChanger = () => {
  if( document.querySelector('.js-labelchange') != null ){
    const btn = document.querySelectorAll('.js-labelchange');

    const checker = () => {
      for (let i = 0; i < btn.length; i++) {
        if( btn[i].checked ){
          btn[i].parentNode.classList.add('checked');
          btn[i].setAttribute('checked','');
        }else{
          btn[i].parentNode.classList.remove('checked');
          btn[i].removeAttribute('checked');
        }
      };
    };

    for (let i = 0; i < btn.length; i++) {
      btn[i].addEventListener('change', () => {
        checker();
      });
    };

    checker();
  }
};


/*
  テキストエリアの文字数チェック/lengthChecker/  -----------------------------------------------
*/
const setLengthChecker = () => {
  if( document.querySelector('.js-textarea') != null ){
    let strLength = 1000;
    const textarea = document.querySelector('.js-textarea'),
      msgDefault = document.querySelector('.js-default'),
      msgNum = document.querySelector('.js-default .num'),
      msgOver = document.querySelector('.js-over');
  
    const checker = target => {
      //console.info(e.target.value.length)
      if( target.value.length <= strLength ){
        if( textarea.classList.contains('error') ){
          textarea.classList.remove('error');
        }
        if( msgDefault.classList.contains('hdn') ){
          msgDefault.classList.remove('hdn');
        }
        if( !msgOver.classList.contains('hdn') ){
          msgOver.classList.add('hdn');
        }
        msgNum.textContent = target.value.length;
      } else {
        if( !textarea.classList.contains('error') ){
          textarea.classList.add('error');
        }
        if( !msgDefault.classList.contains('hdn') ){
          msgDefault.classList.add('hdn');
        }
        if( msgOver.classList.contains('hdn') ){
          msgOver.classList.remove('hdn');
        }
      }
    };

    textarea.addEventListener('input', e => {
      checker(e.target);
    });
  
    textarea.addEventListener('change', e => {
      checker(e.target);
    });

    checker(textarea);
  }
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

/*
  lineブラウザ or liff 外部リンク/setLine/  -----------------------------------------------
*/
const setLine = core => {
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

const setCopy = () => {
  const copy = document.querySelector('.js-copy');
  const target = document.querySelector('.js-copyTarget');
  const comp = document.querySelector('.js-copyComp');

  const compTl = gsap.timeline().pause()
    .fromTo(comp, {
      y: '5px',
      autoAlpha: 0
    }, {
      y: 0,
      autoAlpha: 1,
      ease: 'Power4.easeOut',
      duration: .5
    })
    .to(comp, {
      y: '-5px',
      autoAlpha: 0,
      ease: 'Power4.easeOut',
      duration: .5
    })

  function copyTxt (e) {
    e.preventDefault();
    navigator.clipboard.writeText( target.textContent )
      .then(
        (success) => {
          // コピー成功時の処理
          compTl.restart()
        },
        (error) => {
          // エラー時の処理（document.execCommandを使用する）
          const input = document.createElement('input');
          input.classList.add('copyInput');
          input.value = target.textContent;
          document.body.appendChild(input);
          input.select();
          const result = document.execCommand('copy');
          document.body.removeChild(input);
          compTl.restart()
        }
      )
  }

  if( copy ){
    copy.addEventListener('click', copyTxt);
  }
}

export const functions = { setConsoleIe, setPopupWin, setScrollTo, setAccordion, setTab, setTelCall, setNoEnterkey, setLabelChanger, setLengthChecker, setCrsl, setLine, setCopy }
