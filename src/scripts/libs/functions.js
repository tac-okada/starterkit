// ie対応consolelog/setConsoleIe/開始
// consoleを仕込むとIEでエラーが出るのを回避
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
// ie対応consolelog/setConsoleIe/終了

// ポップアップ制御/setPopupWin/開始
// ポップアップ時のサイズなどの制御
// スマホ・タブレット時はtarget='_blank'に置換する
const setPopupWin = () => {
  const w_n = 'popup_win';// ウィンドウネーム
  const w_w = 700;// 横幅
  const w_h = 800;// 高さ
  const $popup = $( 'a.js-popup' );
  if( app.mql === 'pc' ){// PCのみ
    $popup.on({
      'click' : e => {
        const _this = e.currentTarget;
        const w = window.open(_this.href, w_n, 'toolbar=0,location=0,status=0,menubar=0,scrollbars=yes,resizable=1,width=' + w_w + ',height=' + w_h );
        w.focus();
        return false;
      }
    });
  }else{// SP・Tabletは通常のtarget_blankで開く
    $popup.each((idx, value) => {
      //const _this = e.currentTarget;
      //console.info(idx, value)
      $(value).removeClass( 'js-popup' );
      $(value).attr( 'target', '_blank' );
    });
  }
};
// ポップアップ制御/setPopupWin/終了

// スムーススクロール設定/setScroll/開始
// aタグのhref属性冒頭に「#」が付く場合、アニメーション
// して指定位置までスクロールする
const setScroll = () => {
  const $trigger = $( 'a[href*="#"],area[href*="#"]' );
  const $html = $( 'html,body' );
  const scrollSpeed = 500;// スクロール速度
  let $target, targetOffset;

  const scroll = _hash => {
    $target = $(_hash);
    if ( $target.length ) {
      targetOffset = $target.offset().top;
    } else {
      targetOffset = 0;
    }
    $html.animate( {scrollTop: targetOffset}, scrollSpeed );
    return false;
  }

  $trigger.on({
    'click' : function() {  
      if ( location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'')
      && location.hostname == this.hostname ) {
        scroll(this.hash);
      }
    }
  });

  // URLにハッシュが含まれる場合
  if( location.hash ){
    setTimeout(function(){
      scroll(location.hash);
    }, 100)
  }
};
// スムーススクロール設定/setScroll/終了

// アコーディオン/setToggle/開始
const setToggle = () => {
  let toggleButton = document.querySelectorAll('.js-toggleBtn');
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
// アコーディオン/setToggle/終了

// スクロール演出/setScTrigger/開始
const setScTrigger = ( _sc_top, _w_h ) => {
  const $target = $('.js-scTrigger');
  const speed = 1;
  let trigger, taget_offset;

  $target.each( function(){
    if( !$(this).hasClass('disp') ){
    $(this).css({'opacity':'0'});

    // 表示開始する位置を算出
    trigger = _sc_top + _w_h - 200;
    // ターゲットの位置を取得
    taget_offset = $(this).offset().top;

    if( taget_offset < trigger ){
      TweenMax.fromTo( $(this), speed,
        {
          opacity : 0,
          scale : 1.2
        },
        {
          opacity : 1,
          scale : 1,
          transformOrigin: origin,
          ease: Power2.easeIn
        }
      );
      $(this).addClass('disp');
    }
    //console.info($(this),taget_offset,trigger)
    }
  });
};
// スクロール演出/setScTrigger/終了

// SP時にTELリンク/setTelCall/開始
// head内に設置：<meta name="format-detection" content="telephone=yes">
// リンクさせる：<p class="js-telCall" x-ms-format-detection="none">0120-00-0000</p>
// リンクさせない：<p class="disableTel" x-ms-format-detection="none">0120-00-0000</p>
// app.USER.deviceでUA判定し「SP」or「TB」のみ以下実行
const setTelCall = () => {
  let telCall = document.querySelectorAll('.js-telCall'),
  txt, num;
  //console.info(app.USER)
  if ( app.USER.device !== 'desktop'){
    for (let i = 0; i < telCall.length; i++) {
      //console.info(telCall[i])
      txt = telCall[i].textContent;
      num = txt.replace(/-/g, '');
      //console.info(txt,num);
      telCall[i].innerHTML = '<a href="tel:' + num + '" >' + txt + '</a>';
    };
  };
};
// SP時にTELリンク/setTelCall/終了

export { setConsoleIe, setPopupWin, setScroll, setToggle, setScTrigger, setTelCall }
