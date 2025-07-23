// モダンな Modal クラス完全版
// 元の仕様を維持しつつ、モーダル本体も自動生成します。
// youtubeAPI は外部モジュールとして別途用意が必要。

import { FocusTrap, Escapekey } from './util.js';
import { youtubeAPI } from './youtubeAPI.js';

export class Modal {
  constructor(core) {
    this.core = core;
    this.body = document.body;
    this.state = { response: true, scrollPos: 0 };
    this.btns = Array.from(document.querySelectorAll('.js-modalOpen'));
    this.listeners = [];

    this.otherEls = [];
    this.focusTrap = new FocusTrap();
    this.escapeKey = new Escapekey();

    this.modal = null;
    this.modalContent = null;
    this.modalBg = null;
    this.modalClose = null;
    this.currentTarget = null;
    this.currentNum = null;

    this._createModalElements();
    this._bindTriggers();
  }

  _createModalElements() {
    this.modal = document.createElement('div');
    this.modal.id = 'modal';
    this.modal.setAttribute('role', 'dialog');
    this.modal.setAttribute('aria-hidden', 'true');
    this.modal.style.display = 'none';

    this.modalBg = document.createElement('div');
    this.modalBg.id = 'modal_bg';
    this.modalBg.className = 'js-modalClose';
    this.modalBg.setAttribute('aria-label', '閉じる');

    this.modalClose = document.createElement('button');
    this.modalClose.id = 'modal_close';
    this.modalClose.className = 'js-modalClose';
    this.modalClose.textContent = '×';

    this.modalContent = document.createElement('div');
    this.modalContent.id = 'modal_content';

    this.modal.append(this.modalBg, this.modalClose, this.modalContent);
    this.body.prepend(this.modal);

    this.modalBg.addEventListener('click', () => this.close());
    this.modalClose.addEventListener('click', () => this.close());
  }

  _bindTriggers() {
    this.btns.forEach(btn => {
      const listener = e => {
        e.preventDefault();
        const [num, type, param] = btn.dataset.modal.split('__');
        const ytNum = btn.dataset.ytnum || null;
        const noClose = btn.hasAttribute('data-noClose');

        this.open({ num, type, param, ytNum, noClose, trigger: btn });
      };
      btn.addEventListener('click', listener);
      this.listeners.push({ btn, listener });
    });
  }

  open({ num, type, param, ytNum, noClose, trigger }) {
    if (!this.state.response) return;

    this.state.response = false;
    this.state.scrollPos = window.scrollY;
    this.currentTarget = trigger;
    this.currentNum = num;

    this._lockBody();

    this.modalContent.innerHTML = '';

    const targetEl = this._createContent({ type, param, ytNum });

    if (!targetEl) {
      console.error('モーダルコンテンツの生成に失敗しました');
      this.state.response = true;
      this._unlockBody();
      return;
    }

    this.modalContent.appendChild(targetEl);
    this.modal.style.display = 'block';
    this.modal.setAttribute('aria-hidden', 'false');

    if (!noClose) {
      this.modalBg.style.display = 'block';
      this.modalClose.style.display = 'block';
    } else {
      this.modalBg.style.display = 'none';
      this.modalClose.style.display = 'none';
    }

    this.focusTrap.addEvent(this.modal);
    this.escapeKey.addEvent(this, this.close.bind(this));

    this._hideOthers();

    this.state.response = true;
  }

  _createContent({ type, param, ytNum }) {
    if (type === 'img') {
      const img = document.createElement('img');
      img.src = param;
      img.alt = '';
      return img;
    }

    if (type === 'dom') {
      const domEl = document.getElementById(param);
      if (!domEl) return null;
      return domEl.cloneNode(true);
    }

    if (type === 'iframe') {
      const iframe = document.createElement('iframe');
      iframe.src = param;
      iframe.frameBorder = '0';
      iframe.width = '100%';
      iframe.height = '500';
      return iframe;
    }

    if (type === 'yt') {
      youtubeAPI.playerNum = ytNum - 1;
      youtubeAPI.setYoutube(true);
      const ytDiv = document.createElement('div');
      ytDiv.id = `player${ytNum}`;
      return ytDiv;
    }

    return null;
  }

  close() {
    if (!this.state.response) return;

    this.state.response = false;

    this.modal.style.display = 'none';
    this.modalContent.innerHTML = '';
    this.modal.setAttribute('aria-hidden', 'true');

    this._unlockBody();

    this.focusTrap.removeEvent(this.modal);
    this.escapeKey.removeEvent(this);

    this._showOthers();

    this.state.response = true;
  }

  _lockBody() {
    this.body.style.top = `-${this.state.scrollPos}px`;
    this.body.classList.add('fixed');
  }

  _unlockBody() {
    this.body.classList.remove('fixed');
    this.body.style.top = '';
    window.scrollTo(0, this.state.scrollPos);
  }

  _hideOthers() {
    this.otherEls = Array.from(this.body.children).filter(el => !['SCRIPT', 'STYLE'].includes(el.tagName) && el !== this.modal);
    this.otherEls.forEach(el => el.setAttribute('aria-hidden', 'true'));
  }

  _showOthers() {
    this.otherEls.forEach(el => el.setAttribute('aria-hidden', 'false'));
  }

  destroy() {
    this.listeners.forEach(({ btn, listener }) => btn.removeEventListener('click', listener));
    this.focusTrap.removeEvent(this.modal);
    this.escapeKey.removeEvent(this);
    if (this.modal) this.modal.remove();
  }
}

// 使い方：
// import { Modal } from './Modal.js';
// const modal = new Modal({ USER: { os: 'ios', osVersion: '17', isMobile: true }, mql: 'pc' });
