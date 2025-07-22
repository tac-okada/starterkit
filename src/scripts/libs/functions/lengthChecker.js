/*
  テキストエリアの文字数チェック/lengthChecker/  -----------------------------------------------
*/
export const setLengthChecker = () => {
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