import { Core } from './libs/core.js';

window.app = window.app || new Core;

/* ブレイクポイント指定：タブレット,スマホ */
app.initialize(1024,767);