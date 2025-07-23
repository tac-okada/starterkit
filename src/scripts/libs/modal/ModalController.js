import ModalView from './ModalView.js';
import ModalTrigger from './ModalTrigger.js';
import BodyScrollManager from './BodyScrollManager.js';
import AccessibilityHelper from './AccessibilityHelper.js';

export default class ModalController {
  constructor() {
    this.view = new ModalView();
    this.bodyScroll = new BodyScrollManager();
    this.accessibility = new AccessibilityHelper();
    this.trigger = new ModalTrigger(this);

    this._onKeyDown = this._onKeyDown.bind(this);
  }

  init() {
    this.trigger.bindTriggers();

    // ESC キー対応を追加
    document.addEventListener('keydown', this._onKeyDown);
  }

  onTriggerClick(modalData) {
    this.bodyScroll.fixBody();
    this.accessibility.hideBackground();

    this.view.open(modalData, () => {
      this.accessibility.trapFocus();

      this.view.setCloseEvents(() => {
        this.closeModal();
      });
    });
  }

  closeModal() {
    this.view.close(() => {
      this.accessibility.releaseFocus();
      this.accessibility.showBackground();
      this.bodyScroll.releaseBody();
    });
  }

  _onKeyDown(e) {
    if (e.key === 'Escape') {
      const activeContent = document.querySelector('.modal_contents.active');
      if (!activeContent) return;

      const noClose = activeContent.dataset.noClose === 'true';
      if (!noClose) {
        this.closeModal();
      }
    }
  }
}
