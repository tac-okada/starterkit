export default class BodyScrollManager {
  constructor() {
    this.scrollTop = 0;
  }

  fixBody() {
    this.scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${this.scrollTop}px`;
    document.body.style.width = '100%';
  }

  releaseBody() {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo(0, this.scrollTop);
  }
}