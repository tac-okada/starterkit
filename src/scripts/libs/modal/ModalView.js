import { youtubeAPI } from './../youtubeAPI.js';

export default class ModalView {
  constructor() {
    this.modalContainer = null;
  }

  createModalContainer() {
    if (!this.modalContainer) {
      this.modalContainer = document.createElement('div');
      this.modalContainer.id = 'modal';
      this.modalContainer.role = 'dialog';

      const closeBtn = document.createElement('button');
      closeBtn.id = 'modal_close';
      closeBtn.className = 'js-modalClose';
      closeBtn.setAttribute('aria-label', 'モーダルを閉じる');
      closeBtn.textContent = '×';
      this.modalContainer.appendChild(closeBtn);

      document.body.prepend(this.modalContainer);
    }
  }

  createContent({ num, type, param, ytNum }) {
    const outer = document.createElement('div');
    outer.className = `modal_contents modal_${num} modal_${type}`;
    outer.dataset.ytNum = ytNum ?? '';

    let inner;
    switch (type) {
      case 'img':
        inner = document.createElement('img');
        inner.src = param;
        inner.alt = '';
        break;
      case 'iframe':
        inner = document.createElement('iframe');
        inner.src = param;
        inner.frameBorder = '0';
        break;
      case 'dom':
        const source = document.querySelector(`.${param}`);
        if (source) {
          inner = document.createElement('div');
          Array.from(source.children).forEach(child => {
            inner.appendChild(child.cloneNode(true));
          });
        } else {
          inner = document.createElement('div');
          inner.textContent = 'Content not found';
        }
        break;
      case 'yt':
        inner = document.createElement('div');
        inner.id = `player${ytNum}`;
        break;
      default:
        inner = document.createElement('div');
        inner.textContent = 'Unknown modal type';
    }

    outer.appendChild(inner);
    return outer;
  }

  createBg(noClose = false) {
    const bg = document.createElement('div');
    bg.id = 'modal_bg';
    bg.className = 'js-modalClose';
    if (noClose) {
      bg.dataset.noClose = 'true';
    }
    return bg;
  }

  open({ num, type, param, noClose = false, ytNum, autoPlay }, onOpened) {
    this.createModalContainer();

    let content = this.modalContainer.querySelector(`.modal_${num}`);
    if (!content) {
      content = this.createContent({ num, type, param, ytNum });
      this.modalContainer.appendChild(content);
    }

    // noCloseをデータ属性にセット
    content.dataset.noClose = noClose ? 'true' : 'false';

    let bg = this.modalContainer.querySelector('#modal_bg');
    if (!bg) {
      bg = this.createBg(noClose);
      this.modalContainer.appendChild(bg);
    }

    const closeBtn = this.modalContainer.querySelector('#modal_close');

    if (type === 'yt') {
      const _autoPlay = autoPlay ?? trigger?.hasAttribute('data-autoplay');

      youtubeAPI.initialize();

      if (youtubeAPI.ytPlayer[ytNum-1]) {
        youtubeAPI.ytPlayer[ytNum-1].destroy();
      }

      youtubeAPI.youtubeData[ytNum - 1] = {
        youtubeId: param,
        embedArea: `player${ytNum}`,
        playerReady: false,
        autoPlay: _autoPlay
      };
      youtubeAPI.setYoutube();
    }

    requestAnimationFrame(() => {
      this.modalContainer.classList.add('active');
      content.classList.add('active', 'in');
      bg.classList.add('active', 'in');

      if (noClose) {
        closeBtn.classList.remove('active', 'in');
      } else {
        closeBtn.classList.add('active', 'in');
      }

      content.addEventListener('animationend', () => onOpened?.(), { once: true });
    });
  }

  close(onClosed) {
    if (!this.modalContainer) return;

    const content = this.modalContainer.querySelector('.modal_contents.active');
    const bg = this.modalContainer.querySelector('#modal_bg');
    const closeBtn = this.modalContainer.querySelector('#modal_close');

    if (!content || !bg) return;

    if (content.classList.contains('modal_yt')) {
      const ytNum = parseInt(content.dataset.ytNum, 10);
      const player = youtubeAPI.ytPlayer[ytNum-1];
      if (player?.stopVideo) player.stopVideo();
      console.info(ytNum)
    }

    content.classList.remove('in');
    content.classList.add('out');

    bg.classList.remove('in');
    bg.classList.add('out');

    closeBtn.classList.remove('in');
    closeBtn.classList.add('out');

    const onAnimationEnd = () => {
      content.classList.remove('active', 'out');
      bg.classList.remove('active', 'out');
      closeBtn.classList.remove('active', 'out');
      this.modalContainer.classList.remove('active');

      content.removeEventListener('animationend', onAnimationEnd);
      onClosed?.();
    };

    content.addEventListener('animationend', onAnimationEnd);
  }

  setCloseEvents(onCloseCallback) {
    if (!this.modalContainer) return;
  
    const content = this.modalContainer.querySelector('.modal_contents.active');
    if (!content) return;

    // モーダル内の.js-modalClose
    const closables = this.modalContainer.querySelectorAll('.js-modalClose');
  
    closables.forEach(el => {
      el.onclick = (e) => {
        if (el.id === 'modal_bg' && content.dataset.noClose === 'true') return;
        onCloseCallback?.();
      };
    });
  
    // iframe内の.js-modalCloseも（クロスオリジンなら無視）
    const iframes = this.modalContainer.querySelectorAll('iframe');
    iframes.forEach(iframe => {
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        if (iframeDoc) {
          const iframeClosables = iframeDoc.querySelectorAll('.js-modalClose');
          iframeClosables.forEach(el => {
            el.onclick = (e) => {
              onCloseCallback?.();
            };
          });
        }
      } catch (err) {
        // クロスオリジンのiframeは無視
      }
    });
  }
}