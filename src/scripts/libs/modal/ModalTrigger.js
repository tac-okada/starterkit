export default class ModalTrigger {
  constructor(controller) {
    this.controller = controller;
    this.buttons = [];
  }

  bindTriggers() {
    this.buttons = document.querySelectorAll('.js-modalOpen');
    this.buttons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
  
        const data = btn.getAttribute('data-modal') || '';
        const parts = data.split('__');
        if (parts.length < 2) {
          console.warn('data-modal attribute format invalid');
          return;
        }
  
        const num = parts[0];
        const type = parts[1];
        const param = parts[2] || '';
        const noClose = btn.hasAttribute('data-no-close');
        const ytNum = btn.getAttribute('data-ytnum') || 0;
        // ここでdata-autoplayの有無をbool値で取得
        const autoPlay = btn.hasAttribute('data-autoplay');
  
        this.controller.onTriggerClick({ num, type, param, noClose, ytNum, trigger: btn, autoPlay });
      });
    });
  }
}
