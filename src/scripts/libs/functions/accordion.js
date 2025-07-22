/*
  アコーディオン/setAccordion/  -----------------------------------------------
*/
export const setAccordion = () => {
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