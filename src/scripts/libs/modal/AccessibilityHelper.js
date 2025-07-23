export default class AccessibilityHelper {
  constructor() {
    this.focusedElementBeforeModal = null;
    this.body = document.body;
  }

  hideBackground() {
    [...this.body.children].forEach((child) => {
      if (child.id !== 'modal') {
        child.setAttribute('aria-hidden', 'true');
      }
    });
    const modal = document.getElementById('modal');
    if (modal) {
      modal.removeAttribute('aria-hidden');  // モーダルは見える状態に
    }
  }

  showBackground() {
    [...this.body.children].forEach((child) => {
      if (child.id !== 'modal') {
        child.removeAttribute('aria-hidden');
      }
    });
    const modal = document.getElementById('modal');
    if (modal) {
      modal.setAttribute('aria-hidden', 'true');  // モーダルは非表示扱いに
    }
  }

  trapFocus() {
    this.focusedElementBeforeModal = document.activeElement;
    const modal = document.getElementById('modal');
    if (!modal) return;

    const focusableElementsString = [
      'a[href]',
      'area[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'button:not([disabled])',
      'iframe',
      'object',
      'embed',
      '[contenteditable]',
      '[tabindex]:not([tabindex^="-"])',
    ].join(',');

    const focusableElements = Array.from(modal.querySelectorAll(focusableElementsString));
    if (focusableElements.length === 0) return;

    focusableElements[0].focus();

    // キーボードでTab押下時のループ制御
    modal.addEventListener('keydown', this._trapListener = (e) => {
      if (e.key === 'Tab') {
        const firstElem = focusableElements[0];
        const lastElem = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElem) {
            e.preventDefault();
            lastElem.focus();
          }
        } else {
          if (document.activeElement === lastElem) {
            e.preventDefault();
            firstElem.focus();
          }
        }
      }
    });
  }

  releaseFocus() {
    const modal = document.getElementById('modal');
    if (modal && this._trapListener) {
      modal.removeEventListener('keydown', this._trapListener);
    }
    if (this.focusedElementBeforeModal) {
      this.focusedElementBeforeModal.focus();
    }
  }
}