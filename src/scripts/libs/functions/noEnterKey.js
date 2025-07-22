/*
  enterキー無効/setNoEnterkey/  -----------------------------------------------
*/
export const setNoEnterkey = () => {
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