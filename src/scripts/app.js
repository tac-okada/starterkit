import gsap from 'gsap';
import $ from 'jquery';
import jqueryMigrate from 'jquery-migrate';
import { Core } from './libs/core.js';


/*

  グローバル変数  -----------------------------------------------

*/

/* GSAP */
window.gsap = gsap;

/* jQuery */
window.$ = $;
window.jQuery = $;

/* 初期化：メディアクエリサイズ指定（タブレット,スマホ） */
$(() => { app.initialize(1024,767); }); 

/*

  app.js  -----------------------------------------------
  サイト全体で使用する

*/
window.app = window.app || {};

app = ( () => {

  let core = new Core();

  /*
    サイト全体で使用する基本情報  -----------------------------------------------
  */

  /* UAなど：app.USER */
  let USER = {};

  /* 画面サイズなど：app.win */
  let win = {};

  /* メディアクエリ：app.mql */
  let mql = '';

  /* transitionEndイベント：app.transitionEnd */
  const transitionEnd = 'webkitTransitionEnd mozTransitionEnd oTransitionEnd transitionend';

  /* animationEndイベント：app.animationEnd */
  const animationEnd = 'webkitAnimationEnd mozAnimationEnd oAnimationEnd animationend';

  /*
    初期化  -----------------------------------------------
  */
  const initialize = (tb,sp) => {
    core.initialize(tb,sp);
//     console.info(this.methodes)
  };

  return{
    core,
    USER,
    win,
    mql,
    transitionEnd,
    animationEnd,
    initialize
  };
})();
