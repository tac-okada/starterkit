/*
  SP時にTELリンク/setTelCall/  -----------------------------------------------
  head内に設置：<meta name="format-detection" content="telephone=yes">
  リンクさせる：<p class="js-telCall" x-ms-format-detection="none">0120-00-0000</p>
  リンクさせない：<p class="disableTel" x-ms-format-detection="none">0120-00-0000</p>
  core.USER.isMobileでUA判定し「sp」or「tb」のみ実行
*/
export const setTelCall = core => {
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