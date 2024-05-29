/*

  UserAgent  -----------------------------------------------

*/
export class UserAgent {

  constructor () {
    this.USER = {
      agent : window.navigator.userAgent.toLowerCase(),
      device : null,// いずれ使用しなくなる予定
      os : null,
      osVersion : null,
      browser : null,
      browserVersion : null,
      isLegacy : false,
      isTouch : false,
      isHighResolution : false,
      isMobile : true,
      model : null,
      webView : null
    }
  }

  initialize () {
    const _this = this;

    return new Promise( function(resolve, reject) {

      const setOther = () => {
        /* Resolution  ---------------- */
        if (window.devicePixelRatio > 1) _this.USER.isHighResolution = true;
        if (window.matchMedia && window.matchMedia('(-webkit-min-device-pixel-ratio: 1.5),(min--moz-device-pixel-ratio: 1.5),(-o-min-device-pixel-ratio: 3/2),(min-resolution: 1.5dppx)').matches) _this.USER.isHighResolution = true;

        /* Touch  ---------------- */
        if (_this.USER.isMobile) _this.USER.isTouch = true;
        else {
          if(window.navigator.msPointerEnabled) _this.USER.isTouch = true;
          if ('ontouchstart' in window) _this.USER.isTouch = true;
        }

        /* Pixel Ratio  ---------------- */
        _this.USER.pixelRatio = window.devicePixelRatio;

        /* CSS  ---------------- */
        let device = 'mobile';
        if ( !_this.USER.isMobile ){
          device = 'desktop';
        }
        _this.USER.css = [device, _this.USER.os, _this.USER.browser];
        if (_this.USER.isTouch) _this.USER.css.push('touch');
        if (_this.USER.browser == 'ie') _this.USER.css.push(_this.USER.osVersion +' ie'+ _this.USER.browserVersion);
        if (_this.USER.browser == 'ie' && _this.USER.browserVersion == 10) _this.USER.isLegacy = true;
        if (_this.USER.os == 'android' && _this.USER.osVersion < 4.4 && _this.USER.browser == 'androidbrowser') _this.USER.isLegacy = true;
        if (_this.USER.os == 'android') {
          if( _this.USER.osVersion ) _this.USER.css.push('android'+ parseInt(_this.USER.osVersion));
        }
        if (_this.USER.os == 'ios' && _this.USER.osVersion < 9) _this.USER.css.push('ios' + _this.USER.osVersion);
        if (_this.USER.isLegacy) _this.USER.css.push('legacy');

        /* WebView  ---------------- */
        if (_this.USER.agent.indexOf('line') != -1){
          _this.USER.webView = 'line';
          _this.USER.css.push('line');
        }
        resolve(_this.USER);
      };


      if( navigator.userAgentData ){
        const clientHintsList = {
          browser : ['chrome', 'edge', 'opera'],
          os: ['mac', 'windows', 'android']
        }
  
        const setUA = async () => {
          const uaData = navigator.userAgentData;
          // getHighEntropyValues()メソッドには取得したい情報を配列の引数で渡す
          const highEntropyValues = await uaData.getHighEntropyValues(
            [
              "platform",// os
              "platformVersion",// osVersion
              "model",// mobile model
              //"architecture",
              //"uaFullVersion"
            ]);
  
          //console.log(highEntropyValues);
  
          /* OS  ---------------- */
          for (let el of clientHintsList.os){
            if( highEntropyValues.platform.toLowerCase().indexOf(el) != -1 ){
              _this.USER.os = el;
            }
          }

          /* OSVersion  ---------------- */
          _this.USER.osVersion = highEntropyValues.platformVersion;

          /* isMobile  ---------------- */
          _this.USER.isMobile = highEntropyValues.mobile;

          /* Model  ---------------- */
          _this.USER.model = highEntropyValues.model;

          /* Browser  ---------------- */
          highEntropyValues.brands.find( ( item, i) => {
            for (let el of clientHintsList.browser){
              //let test = item.brand.indexOf(el != -1)
              //console.log(item.brand.toLowerCase().indexOf(el) != -1);
              if( item.brand.toLowerCase().indexOf(el) != -1 ){
                //console.info(highEntropyValues.brands[i].version)
                _this.USER.browser = el;
                _this.USER.browserVersion = highEntropyValues.brands[i].version;
              }
            }
          });

          setOther();
        };
        setUA();

      } else {
        /* Device  ---------------- */
        if (_this.USER.agent.indexOf('ipad') != -1) _this.USER.device = 'ipad';
        else if (_this.USER.agent.indexOf('ipod') != -1) _this.USER.device = 'ipod';
        else if (_this.USER.agent.indexOf('iphone') != -1) _this.USER.device = 'iphone';
        else if (_this.USER.agent.indexOf('windows') != -1 && _this.USER.agent.indexOf('touch') != -1 && _this.USER.agent.indexOf('tablet pc') == -1) _this.USER.device = 'windowstablet';
        else if (_this.USER.agent.indexOf('windows') != -1 && _this.USER.agent.indexOf('phone') != -1) _this.USER.device = 'windowsphone';
        else if (_this.USER.agent.indexOf('android') != -1 && _this.USER.agent.indexOf('mobile') != -1) _this.USER.device = 'androidphone';
        else if (_this.USER.agent.indexOf('android') != -1 && _this.USER.agent.indexOf('mobile') == -1) _this.USER.device = 'androidtablet';
        else if (_this.USER.agent.indexOf('kindle') != -1) _this.USER.device = 'kindle';
        else {
          _this.USER.device = 'desktop';
          _this.USER.isMobile = false;
        }


        /* OS  ---------------- */
        if (_this.USER.agent.indexOf('windows') != -1) {
          _this.USER.os = 'windows';
          if (_this.USER.agent.match(/win(dows )?nt 10\.0/)) _this.USER.osVersion = 'windows10';
          else if (_this.USER.agent.match(/win(dows )?nt 6\.3/)) _this.USER.osVersion = 'windows8';
          else if (_this.USER.agent.match(/win(dows )?nt 6\.2/)) _this.USER.osVersion = 'windows8';
          else if (_this.USER.agent.match(/win(dows )?nt 6\.1/)) _this.USER.osVersion = 'windows7';
          else if (_this.USER.agent.match(/win(dows )?nt 6\.0/)) _this.USER.osVersion = 'windowsVista';
        } else if (_this.USER.agent.indexOf('macintosh') != -1) {
          _this.USER.os = 'mac';
        } else if (_this.USER.agent.indexOf('android') != -1) {
          _this.USER.os = 'android';
          _this.USER.osVersion = parseFloat(_this.USER.agent.slice(_this.USER.agent.indexOf('android') + 8));
        } else if (_this.USER.agent.indexOf('ipad') != -1 || _this.USER.agent.indexOf('ipod') != -1 || _this.USER.agent.indexOf('iphone') != -1) {
          _this.USER.os = 'ios';
          _this.USER.ios = window.navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);
          _this.USER.osVersion = [parseInt(_this.USER.ios[1], 10), parseInt(_this.USER.ios[2], 10), parseInt(_this.USER.ios[3] || 0, 10)];
          _this.USER.osVersion = _this.USER.osVersion[0];
          delete _this.USER.ios;
        }


        /* Browser  ---------------- */
        if (_this.USER.agent.indexOf('edge') != -1) _this.USER.browser = 'edge';
        else if (_this.USER.agent.indexOf('ybrowser') != -1) _this.USER.browser = 'ybrowser';
        else if (_this.USER.agent.indexOf('chrome') != -1 && _this.USER.agent.indexOf('opr') == -1) {
          if (_this.USER.agent.indexOf('version') != -1) {
            _this.USER.browser = 'androidbrowser';
          } else if (_this.USER.agent.indexOf('edg') != -1) {
            _this.USER.browser = 'edge';
            _this.USER.edg = /edg\/([\d\.]+)/.exec(_this.USER.agent);
            _this.USER.browserVersion = parseInt((_this.USER.edg) ? _this.USER.edg[1] : '');
            delete _this.USER.edg;
          } else {
            _this.USER.browser = 'chrome';
            _this.USER.chrome = /chrome\/([\d\.]+)/.exec(_this.USER.agent);
            _this.USER.browserVersion = parseInt((_this.USER.chrome) ? _this.USER.chrome[1] : '');
            delete _this.USER.chrome;
          }
        } else if (_this.USER.agent.indexOf('opera') != -1 || _this.USER.agent.indexOf('opr') != -1) {
          _this.USER.browser = 'opera';
        } else if (_this.USER.agent.indexOf('safari') != -1 && _this.USER.os != 'android') {
          _this.USER.browser = 'safari';
        } else if (_this.USER.agent.indexOf('firefox') != -1) {
          _this.USER.browser = 'firefox';
        } else if (_this.USER.agent.indexOf('msie') != -1) {
          _this.USER.browser = 'ie';
          _this.USER.ie = window.navigator.appVersion.toLowerCase();
          if (_this.USER.ie.indexOf('msie 6.') != -1) _this.USER.browserVersion = 6;
          else if (_this.USER.ie.indexOf('msie 7.') != -1) _this.USER.browserVersion = 7;
          else if (_this.USER.ie.indexOf('msie 8.') != -1) _this.USER.browserVersion = 8;
          else if (_this.USER.ie.indexOf('msie 9.') != -1) _this.USER.browserVersion = 9;
          else if (_this.USER.ie.indexOf('msie 10.') != -1) _this.USER.browserVersion = 10;
        } else if (_this.USER.agent.indexOf('trident') != -1 || _this.USER.agent.indexOf('trident/7') != -1) {
          _this.USER.browser = 'ie';
          _this.USER.browserVersion = 11;
        } else if (_this.USER.os == 'android') {
          _this.USER.browser = 'androidbrowser';
        }
  
        setOther();
      }
    });
  }
}


/*

  MediaQueries  -----------------------------------------------

*/
export class MediaQueries {

  constructor ( tb, sp, core ) {
    //this.device = '',
    this.mqlTb ='',
    this.mqlSp = ''
  }

  initialize ( tb, sp, core ) {
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
    window.matchMedia('screen and (max-width:' + this.mqlTb + 'px)').addListener( function() { that.responsive(core); });
    window.matchMedia('screen and (max-width:' + this.mqlSp + 'px)').addListener( function() { that.responsive(core); });
    this.responsive(core);
  }

  responsive (core) {
    if( window.matchMedia('screen and (max-width:' + this.mqlTb + 'px)').matches ){
      if( window.matchMedia('screen and (max-width:' + this.mqlSp + 'px)').matches ) {
        core.mql = 'sp';
        return false;
      }
      core.mql = 'tb';
      return false;
    } else {
      core.mql = 'pc';
      return false;
    }
  }
};


/*

  FocusTrap  -----------------------------------------------

*/
export class FocusTrap {

  constructor () {
    this.ELEMENTS = [
      'a[href]',
      'area[href]',
      'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
      'select:not([disabled]):not([aria-hidden])',
      'textarea:not([disabled]):not([aria-hidden])',
      'button:not([disabled]):not([aria-hidden])',
      'iframe',
      'object',
      'embed',
      '[contenteditable]',
      '[tabindex]:not([tabindex="-1"])'
    ],
    this.elements
    this.eventListeners = []
  }

  keydownEvents (e) {
    //console.info(this.elements)
    const focusableElementsFirst = this.elements[0];
    const focusableElementsLast = this.elements[this.elements.length - 1];
    if (e.code === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === focusableElementsFirst) {
          e.preventDefault();
          focusableElementsLast.focus();
        }
      } else {
        // Tab
        if (document.activeElement === focusableElementsLast) {
          e.preventDefault();
          focusableElementsFirst.focus();
        }
      }
    }
  }

  addEvent (target,i) {
    this.elements = [
      ...target.querySelectorAll(this.ELEMENTS.join(','))
    ];
    //console.info(target,i)
    this.eventListeners[i] = e => this.keydownEvents(e);
    target.addEventListener('keydown', this.eventListeners[i]);
    //target.addEventListener('keydown', { obj: this, handleEvent: this.keydownEvents });
  }

  removeEvent (target,i) {
    //console.info(target,this.eventListeners)
    target.removeEventListener('keydown', this.eventListeners[i]);
    //target.addEventListener('keydown', this.keydownEvents);
  }
}


/*

  Escapekey  -----------------------------------------------

*/
export class Escapekey {

  constructor () {
    this.eventListeners = [],
    this.event,
    this.obj
  }

  keydownEvents (e) {
    //console.info(e,this)
    if(e.code === 'Escape'){
      this.event.close(this.obj);
    }
  }

  addEvent (obj,event,i) {
    //console.info(event,i)
    this.event = event;
    this.obj = obj;
    this.eventListeners[i] = e => this.keydownEvents(e);
    obj.modal.addEventListener('keydown', this.eventListeners[i]);
    //target.addEventListener('keydown', { obj: this, handleEvent: this.keydownEvents });
  }

  removeEvent (obj,i) {
    obj.modal.removeEventListener('keydown', this.eventListeners[i]);
  }
}