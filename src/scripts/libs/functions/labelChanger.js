/*
  チェックボックス・ラジオボタン切り替え/setLabelChanger/  -----------------------------------------------
*/
export const setLabelChanger = () => {
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