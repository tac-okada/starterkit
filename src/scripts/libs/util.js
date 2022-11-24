/*

  UserAgent  -----------------------------------------------

*/
export class UserAgent {

  constructor () {
    this.USER = {
      agent : window.navigator.userAgent.toLowerCase(),
      device : null,
      os : null,
      osVersion : null,
      osCodeName : null,
      browser : null,
      browserVersion : null,
      engine : null,
      isLegacy : false,
      isSupported : true,
      isTouch : false,
      isHighResolution : false
    }
  }

  initialize () {
    /* Device  ---------------- */
    if (this.USER.agent.indexOf('ipad') != -1) this.USER.device = 'ipad';
    else if (this.USER.agent.indexOf('ipod') != -1) this.USER.device = 'ipod';
    else if (this.USER.agent.indexOf('iphone') != -1) this.USER.device = 'iphone';
    else if (this.USER.agent.indexOf('windows') != -1 && this.USER.agent.indexOf('touch') != -1 && this.USER.agent.indexOf('tablet pc') == -1) this.USER.device = 'windowstablet';
    else if (this.USER.agent.indexOf('windows') != -1 && this.USER.agent.indexOf('phone') != -1) this.USER.device = 'windowsphone';
    else if (this.USER.agent.indexOf('android') != -1 && this.USER.agent.indexOf('mobile') != -1) this.USER.device = 'androidphone';
    else if (this.USER.agent.indexOf('android') != -1 && this.USER.agent.indexOf('mobile') == -1) this.USER.device = 'androidtablet';
    else if (this.USER.agent.indexOf('kindle') != -1) this.USER.device = 'kindle';
    else this.USER.device = 'desktop';

    /* Resolution  ---------------- */
    if (window.devicePixelRatio > 1) this.USER.isHighResolution = true;
    if (window.matchMedia && window.matchMedia('(-webkit-min-device-pixel-ratio: 1.5),(min--moz-device-pixel-ratio: 1.5),(-o-min-device-pixel-ratio: 3/2),(min-resolution: 1.5dppx)').matches) this.USER.isHighResolution = true;


    /* OS  ---------------- */
    if (this.USER.agent.indexOf('windows') != -1) {
      this.USER.os = 'windows';
      if (this.USER.agent.match(/win(dows )?nt 10\.0/)) this.USER.osVersion = 'windows10';
      else if (this.USER.agent.match(/win(dows )?nt 6\.3/)) this.USER.osVersion = 'windows8';
      else if (this.USER.agent.match(/win(dows )?nt 6\.2/)) this.USER.osVersion = 'windows8';
      else if (this.USER.agent.match(/win(dows )?nt 6\.1/)) this.USER.osVersion = 'windows7';
      else if (this.USER.agent.match(/win(dows )?nt 6\.0/)) this.USER.osVersion = 'windowsVista';
    } else if (this.USER.agent.indexOf('macintosh') != -1) {
      this.USER.os = 'mac';
    } else if (this.USER.agent.indexOf('android') != -1) {
      this.USER.os = 'android';
      this.USER.osVersion = parseFloat(this.USER.agent.slice(this.USER.agent.indexOf('android') + 8));
      if (this.USER.osVersion > 4 && this.USER.osVersion < 4.4) this.USER.osCodeName = 'jellybean';
      else if (this.USER.osVersion >= 4.4 && this.USER.osVersion < 5) this.USER.osCodeName = 'kitkat';
      else if (this.USER.osVersion >= 5 && this.USER.osVersion < 6) this.USER.osCodeName = 'lollipop';
      else if (this.USER.osVersion >= 6 && this.USER.osVersion < 7) this.USER.osCodeName = 'marshmallow';
      else if (this.USER.osVersion >= 7 && this.USER.osVersion < 8) this.USER.osCodeName = 'nougat';
      else if (this.USER.osVersion >= 8 && this.USER.osVersion < 9) this.USER.osCodeName = 'oreo';
      else if (this.USER.osVersion >= 9 && this.USER.osVersion < 10) this.USER.osCodeName = 'pie';
      else if (this.USER.osVersion >= 10 && this.USER.osVersion < 11) this.USER.osCodeName = 'Q';
      else if (this.USER.osVersion >= 11 && this.USER.osVersion < 12) this.USER.osCodeName = 'R';
      else if (this.USER.osVersion >= 12 && this.USER.osVersion < 13) this.USER.osCodeName = 'S';
    } else if (this.USER.agent.indexOf('ipad') != -1 || this.USER.agent.indexOf('ipod') != -1 || this.USER.agent.indexOf('iphone') != -1) {
      this.USER.os = 'ios';
      this.USER.ios = window.navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);
      this.USER.osVersion = [parseInt(this.USER.ios[1], 10), parseInt(this.USER.ios[2], 10), parseInt(this.USER.ios[3] || 0, 10)];
      this.USER.osVersion = this.USER.osVersion[0];
    }


    /* Browser  ---------------- */
    if (this.USER.agent.indexOf('edge') != -1) this.USER.browser = 'edge';
    else if (this.USER.agent.indexOf('ybrowser') != -1) this.USER.browser = 'ybrowser';
    else if (this.USER.agent.indexOf('chrome') != -1 && this.USER.agent.indexOf('opr') == -1) {
      if (this.USER.agent.indexOf('version') != -1) {
        this.USER.browser = 'androidbrowser';
      } else {
        this.USER.browser = 'chrome';
        this.USER.chrome = /chrome\/([\d\.]+)/.exec(this.USER.agent);
        this.USER.browserVersion = parseInt((this.USER.chrome) ? this.USER.chrome[1] : '');
      }
    } else if (this.USER.agent.indexOf('opera') != -1 || this.USER.agent.indexOf('opr') != -1) {
      this.USER.browser = 'opera';
    } else if (this.USER.agent.indexOf('safari') != -1 && this.USER.os != 'android') {
      this.USER.browser = 'safari';
    } else if (this.USER.agent.indexOf('firefox') != -1) {
      this.USER.browser = 'firefox';
    } else if (this.USER.agent.indexOf('msie') != -1) {
      this.USER.browser = 'ie';
      this.USER.ie = window.navigator.appVersion.toLowerCase();
      if (this.USER.ie.indexOf('msie 6.') != -1) this.USER.browserVersion = 6;
      else if (this.USER.ie.indexOf('msie 7.') != -1) this.USER.browserVersion = 7;
      else if (this.USER.ie.indexOf('msie 8.') != -1) this.USER.browserVersion = 8;
      else if (this.USER.ie.indexOf('msie 9.') != -1) this.USER.browserVersion = 9;
      else if (this.USER.ie.indexOf('msie 10.') != -1) this.USER.browserVersion = 10;
    } else if (this.USER.agent.indexOf('trident') != -1 || this.USER.agent.indexOf('trident/7') != -1) {
      this.USER.browser = 'ie';
      this.USER.browserVersion = 11;
    } else if (this.USER.os == 'android') {
      this.USER.browser = 'androidbrowser';
    }


    /* Engine  ---------------- */
    if (this.USER.agent.indexOf('applewebkit') != -1) this.USER.engine = 'webkit';
    else if (this.USER.agent.indexOf('gecko') != -1) this.USER.engine = 'gecko';
    else if (this.USER.agent.indexOf('trident') != -1) this.USER.engine = 'trident';
    else if (this.USER.agent.indexOf('presto') != -1) this.USER.engine = 'presto';


    /* Touch  ---------------- */
    if (this.USER.device != 'desktop') this.USER.isTouch = true;
    else {
      if(window.navigator.msPointerEnabled) this.USER.isTouch = true;
      if ('ontouchstart' in window) this.USER.isTouch = true;
    }

    /* Pixel Ratio  ---------------- */
    this.USER.pixelRatio = window.devicePixelRatio;


    /* Scroll  ---------------- */
    let scrollEvents = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
    if (this.USER.device != 'desktop') scrollEvents = 'touchmove';


    /* CSS  ---------------- */
    this.USER.css = [this.USER.device, this.USER.os, this.USER.browser, this.USER.engine];
    if (this.USER.isTouch) this.USER.css.push('touch');
    if (this.USER.browser == 'ie') this.USER.css.push(this.USER.osVersion +' ie'+ this.USER.browserVersion);
    if (this.USER.browser == 'ie' && this.USER.browserVersion < 9) this.USER.isSupported = false;
    if (this.USER.browser == 'ie' && this.USER.browserVersion == 9) this.USER.isLegacy = true;
    if (this.USER.os == 'android' && this.USER.osVersion < 4.4 && this.USER.browser == 'androidbrowser') this.USER.isLegacy = true;
    if (this.USER.os == 'android') this.USER.css.push('android'+ parseInt(this.USER.osVersion));
    if (this.USER.os == 'android') this.USER.css.push(this.USER.osCodeName);
    if (this.USER.os == 'ios' && this.USER.osVersion < 9) this.USER.css.push('ios' + this.USER.osVersion);
    if (this.USER.isLegacy) this.USER.css.push('legacy');


    /* Font  ---------------- */
/*
    if (this.USER.os != 'ios' && this.USER.os != 'android') {
      let $link = document.createElement('link');
      $link.rel = 'stylesheet';
      $link.type = 'text/css';
      $link.media = 'all';
      $link.href = '/assets/css/font.css';
      document.getElementsByTagName('head')[0].appendChild($link);
    }
*/
    return this.USER;
  }
}


/*

  MediaQueries  -----------------------------------------------

*/
export class MediaQueries {

  constructor ( tb, sp ) {
    //this.device = '';
    this.mqlTb ='';
    this.mqlSp = '';
  }

  initialize ( tb, sp ) {
    let that = this;
    if( typeof tb !== 'undefined' ){
      this.mqlTb = tb;
    } else {
      this.mqlTb = 960;
    }
    if( typeof sp !== 'undefined' ){
      this.mqlSp = sp;
    } else {
      this.mqlSp = 767;
    }
    window.matchMedia('screen and (max-width:' + this.mqlTb + 'px)').addListener( function() { that.responsive(); });
    window.matchMedia('screen and (max-width:' + this.mqlSp + 'px)').addListener( function() { that.responsive(); });
    this.responsive();
  }

  responsive () {
    if( window.matchMedia('screen and (max-width:' + this.mqlTb + 'px)').matches ){
      if( window.matchMedia('screen and (max-width:' + this.mqlSp + 'px)').matches ) {
        app.mql = 'sp';
        return false;
      }
      app.mql = 'tb';
      return false;
    } else {
      app.mql = 'pc';
      return false;
    }
  }
};