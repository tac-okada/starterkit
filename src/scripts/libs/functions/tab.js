/*
  タブUI/setTab/  -----------------------------------------------
*/
export const setTab = () => {
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