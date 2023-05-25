import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin.js';
gsap.registerPlugin(ScrollToPlugin);
import $ from 'jquery';

import { UserAgent, MediaQueries } from './util.js';
import { setConsoleIe, setPopupWin, setScrollTo, setAccordion, setTelCall } from './functions.js';

/*

  Core  -----------------------------------------------

*/
export class Core {

  constructor () {
    this.setGlobal(),
    this.scroll = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll',
    this.ua = new UserAgent,
    this.USER = {},
    this.mediaQueries = new MediaQueries(),
    this.transitionEnd = 'webkitTransitionEnd mozTransitionEnd oTransitionEnd transitionend',
    this.animationEnd = 'webkitAnimationEnd mozAnimationEnd oAnimationEnd animationend',
    this.mql = '',
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

  async initialize ( tb, sp ) {

    /* 基本情報セット */
    this.USER = await this.ua.initialize();
    this.mediaQueries.initialize(tb,sp,this);
    //alert(this.USER.css)
    //console.info(this.USER);

    /* browser情報をhtmlへ */
    document.documentElement.classList.add(...this.USER.css);

    /* 初期状態スクロールオフ */
    this.disableScroll();
    this.setupEvents();

    /* windowイベント */
    window.addEventListener('scroll', () => { this.scrollEvents(this) }, false);
    window.addEventListener('resize', () => { this.resetEvents(this) }, false);

    this.loadEvents();
  }

  setGlobal () {
    /*
    
      グローバル変数  -----------------------------------------------
    
    */

    /* GSAP */
    window.gsap = gsap;
    
    /* jQuery */
    window.$ = $;
    window.jQuery = $;
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
    if ( ! this.win.response ) return false; 
    this.win.scrollTop = window.pageYOffset;
    this.win.scrollBottom = this.win.scrollTop + this.win.height;
    this.win.isScrolling = true;

    if ( this.win.timer !== false ) clearTimeout(this.win.timer);
    this.win.timer = setTimeout(() => {
      this.win.isScrolling = false;

      /* 個別JSハンドラ */
      if ( typeof( this.scrollHandler ) !== 'undefined' ){
        this.scrollHandler();
      }
    }, 10);
  }

  resetEvents () {
    //console.info(this,that)
    if ( this.USER.isMobile && this.win.width == window.innerWidth ) return false;
    //this.win.timer = setTimeout(() => {
      this.setupEvents();
      //console.info(this.win)

      /* 個別JSハンドラ */
      if ( typeof( this.resetHandler ) !== 'undefined' ){
        this.resetHandler();
      }
    //}, 1);
  }

  loadEvents () {
    //console.info(this)
    /* よく使う関数ここで実行 */
    setConsoleIe();
    setPopupWin(this)
    setScrollTo(this);
    setAccordion();
    setTelCall(this);

    /* 個別JSハンドラ */
    if ( typeof( this.loadHandler ) !== 'undefined' ){
      this.loadHandler();
    } else {
      /* 個別JS無い場合ここでブラウザイベントを有効にする */
      this.enableScroll();
    }
  }

  disableEvents (e) {
    e.preventDefault();
  }

  // スクロールオフ
  disableScroll () {
    window.addEventListener(this.scroll, this.disableEvents, { passive: false });
  }

  // スクロールオン
  enableScroll () {
    this.win.response = true;
    window.removeEventListener(this.scroll, this.disableEvents, { passive: false });
  }
}