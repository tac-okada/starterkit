import { Core } from './libs/core.js';

window.addEventListener('load', () => {
  /* ブレイクポイント指定：タブレット,スマホ */
  app.initialize(1024,767);
});

window.app = window.app || new Core;