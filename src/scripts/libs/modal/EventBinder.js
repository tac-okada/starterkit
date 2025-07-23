export default class EventBinder {
  constructor() {
    document.addEventListener('modal:close', () => {
      this.close?.();
    });
  }

  bindClose(callback) {
    this.close = callback;
  }
}