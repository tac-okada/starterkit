import { UserAgent, MediaQueries } from './util.js';
import { setConsoleIe, setScroll, setToggle, setTelCall } from './functions.js';

/*

  UserAgent  -----------------------------------------------

*/
export class Core {

  constructor () {
    this.appMethodes = ['core','USER','win','mql','transitionEnd','animationEnd','initialize'],
    this.pages = [],
    this.scroll = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll',
    this.ua = new UserAgent,
    //this.USER = this.ua.initialize(),
    this.mql = new MediaQueries(),
    //this.mql = '',
    this.win = {
      width : 0,
      height : 0,
      scrollTop : 0,
      scrollBottom : 0,
      isPortrait : false,
      isScrolling : false,
      response : false,
      timer : false
    }
  }

  setPages () {
    //console.info(app,Object.keys(app),app.methodes)
    let that = this;
    //this.pages = this.appMethodes.filter(i => Object.keys( app ).indexOf(i) == -1);
    //console.info(this.appMethodes,Object.keys(app),this.pages)

    Object.keys( app ).map( function (key) {
      console.info(app)
      /* appMethodesにあるメソッドは除外する */
      for( let i = 0, len = that.appMethodes.length; i <= len; i++ ){
        console.info(i, len, key,that.appMethodes[i]);
        if( key !== that.appMethodes[i] ){
          console.info(key,that.appMethodes[i],len,i)
          if( i >= len ){
            console.info(key)
            that.pages.push(key);
          }
        } else {
          return false;
        }
      }
    });
    //console.info(that.pages)
  }

  initialize ( tb, sp ) {

    /* 基本情報セット */
    app.USER = this.ua.initialize();
    this.mql.initialize(tb,sp);
    app.win = this.win;

    /* 個別ページを配列pagesに挿入 */
    this.setPages();

    /* browser情報をhtmlへ */
    document.documentElement.classList.add(this.ua.USER.css.join(','));

    /* 初期状態スクロールオフ */
    this.disableScroll();
    this.setupEvents();

    window.addEventListener('scroll', () => { this.scrollEvents(this) }, false);
    window.addEventListener('resize', () => { this.resetEvents(this) }, false);

    this.loadEvents();
  }

  setupEvents () {
    this.win.width = window.innerWidth;
    this.win.height = window.innerHeight;
    this.win.scrollTop = window.pageYOffset;
    this.win.scrollBottom = this.win.scrollTop + this.win.height;

    if ( this.win.width / this.win.height < 1 ){
      this.win.isPortrait = true;
    } else {
      this.win.isPortrait = false;
    }
  }

  scrollEvents () {
    //console.info(this,this)
    if ( ! this.win.response ) return false; 
    this.win.scrollTop = window.pageYOffset;
    this.win.scrollBottom = this.win.scrollTop + this.win.height;
    this.win.isScrolling = true;

    if ( this.win.timer !== false ) clearTimeout(this.win.timer);
    this.win.timer = setTimeout(() => {
      this.win.isScrolling = false;

      /* 個別JSハンドラ */
      for( let i = 0; i < this.pages.length; i++ ){
        if ( typeof( app[this.pages[i]] ) !== 'undefined' ){
          app[this.pages[i]].scrollHandler();
        }
      }
    }, 10);
  }

  resetEvents () {
    //console.info(this,that)
    if ( this.ua.USER.device != 'desktop' && this.win.width == window.innerWidth ) return false;
    if ( this.win.timer !== false ) clearTimeout(this.win.timer);
    //this.win.timer = setTimeout(() => {
      this.setupEvents();
      //console.info(this.win)

      /* 個別JSハンドラ */
      for( let i = 0; i < this.pages.length; i++ ){
        if ( typeof( app[this.pages[i]] ) !== 'undefined' ){
          app[this.pages[i]].resizeHandler();
        }
      }

    //}, 1);
  }

  loadEvents () {

    /* よく使う関数ここで実行 */
    setConsoleIe();
    setScroll();
    setToggle();
    setTelCall();

    /* 個別JSハンドラ */
    for( let i = 0; i < this.pages.length; i++ ){
      if ( typeof( app[this.pages[i]] ) !== 'undefined' ){
        app[this.pages[i]].initialize();
      } else {/* 個別JSが無い場合 */
        if( i === pages.length - 1 ){
          this.enableScroll();
          this.win.response = true;
        }
      }
    }
  }

  disableEvents () {
    e.preventDefault();
  }

  // スクロールオフ
  disableScroll () {
    window.addEventListener(this.scrollEvents, this.disableEvents, { passive: false });
  }

  // スクロールオン
  enableScroll () {
    window.removeEventListener(this.scrollEvents, this.disableEvents, { passive: false });
  }
}