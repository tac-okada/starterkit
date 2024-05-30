import { FocusTrap, Escapekey } from './util.js';
import { youtubeAPI } from './youtubeAPI.js';
youtubeAPI.initialize();

export class Modal {

  constructor () {
    this.core = {},
    this.focustrap = new FocusTrap,
    this.escapekey = new Escapekey,
    this.btn = '',
    this.eventListeners = [],
    this.body = document.body,
    this.iframepath = '',
    this.autoPlay = false,/* Youtube autoPlay */
    this.modal = '',
    this.other = '',
    this.otherList = [],
    this.trigger = '',
    this.bg = '',
    this.closeBtn = '',
    this.iframe = [],
    this.dom = [],
    this.firstClick = true,
    this.state = {
      response: false,
      width: 0,
      height: 0,
      scrollPos: 0,
    },
    this.proto = {
      contents: [],/* cts_txt */
      setdom: [],
      bg: undefined,
      closeBtn: undefined,
      num: [],/* modal_num */
      playerNum: 0,/* player_num */
      obj: '',/* target */
      exist: false
    }
  }

  initialize ( core ) {
    this.core = core;
    this.btn = document.querySelectorAll('.js-modalOpen');
    this.setTrigger();
    this.state.response = true;
    let _timer;
    let that = this;
    //console.info('initialize',this.btn.length)

    that.proto.bg = that.setHtml({ type: 'bg'});
    that.proto.closeBtn = that.setHtml({ type: 'close'});
    //console.info(that.proto.bg)

    window.addEventListener('resize', () => {
      if ( _timer !== false ) {
        clearTimeout( _timer );
      }
      _timer = setTimeout( function() {
        that.resizeEvent();
      }, 10);
    });
  }

  // トリガーの数が変更になる場合に使用（スライダーのリサイズイベントなど）
  reset ( core ) {
    // 古いイベントリスナーを削除する
    //console.info(this.btn.length,document.querySelectorAll('.js-modalOpen').length)
    if( this.btn.length != document.querySelectorAll('.js-modalOpen').length ){
      //this.btn = document.querySelectorAll('.js-modalOpen');
      //console.info('reset',this.btn.length)
      for( let i = 0; i < this.btn.length; i++ ){
        this.btn[i].removeEventListener('click', this.eventListeners[i]);
        //console.info(this.btn[i])
        if( this.btn.length - 1 === i ){
          this.initialize( core );
        }
      }
    }
  }

  setHtml ( _obj ) {
    let _html = '';

    /* for Youtube */
    if( _obj.type === 'yt' ){
      _html = document.createElement('div');
      _html.id = 'player' + _obj.player_num;
      //_html = '<div id="player' + _obj.player_num + '"></div>';

    /* for singleImage */
    } else if ( _obj.type === 'img' ){
      _html = document.createElement('img');
      _html.src = _obj.param;
      _html.setAttribute('alt', '');
      //_html = '<img src="' + _obj.param + '" alt="" />';

    /* for iframe */
    } else if ( _obj.type === 'iframe' ){
      _html = document.createElement('iframe');
      _html.src = this.iframepath + _obj.param;
      _html.setAttribute('frameborder', 'no');
      //_html = '<iframe src="' + this.iframepath + _obj.param + '" frameborder="no"></iframe>';

    /* for freeContents */
    } else if ( _obj.type === 'dom' ){
      _html = document.querySelector('.' + _obj.param).children;
      _html = _html[0];
      document.querySelector('.' + _obj.param).remove();

    /* bg */
    } else if ( _obj.type === 'bg' ){
      _html = document.createElement('div');
      _html.id = 'modal_bg';
      _html.className = 'js-modalClose hdn';

    /* close_btn */
    } else if ( _obj.type === 'close' ){
      _html = document.createElement('button');
      _html.id = 'modal_close';
      _html.className = 'js-modalClose hdn';
    }

    //console.info(_html)
    return _html;
  }

  setPlayer ( _obj ) {
    //console.info( _obj.player )
    if ( _obj.event === 'play' ) {
      if( _obj.player ){
        _obj.player.playVideo();
      }
    } else if ( _obj.event === 'stop' ) {
      /* ステータス / -1:未開始 / 0:終了 / 1:再生中 / 2:一時停止 / 3:バッファリング中 / 4:頭出し済み */
      //console.info(_obj.player)
      if( _obj.player.getPlayerState() === ( 0 || 1 || 2 || 3 ) ){
        _obj.player.pauseVideo();
        _obj.player.seekTo(0);
      }
    }
  }

  setBody = {
    fixed (that) {
      /* for andrid ver4.4 under */
      if( that.core.USER.os === 'android' && that.core.USER.osVersion < 4.4 ){
        that.body.classList.add('absolute');
      } else {
        that.body.classList.add('fixed');
        //console.info(that.state.scrollPos)
        that.body.style.top = -1 * that.state.scrollPos + 'px';
      }
    },
    relative (that) {
      /* body position & scroll */
      that.body.classList.remove('fixed');
      that.body.style.top = 'auto';
      window.scrollTo(0, that.state.scrollPos);
    }
  }

  openEvent ( obj ) {
    this.state.scrollPos = window.pageYOffset;

    // モーダルdomを追加
    if( !this.proto.setdom[ obj.num - 1] ){

      // モーダルが存在しない場合（ボタンから開く場合）
      if( document.querySelector(obj.target) === null ){
        obj.target = this.proto.contents[obj.num - 1];
        this.modal.prepend(obj.target);

      // モーダルが存在する場合（onloadイベントなどで開く場合）
      } else {
        obj.target = document.querySelector(obj.target);
        this.modal.prepend(obj.target);
        this.proto.contents[obj.num - 1] = obj.target;
      }

      if ( obj.type === 'yt' ){
        youtubeAPI.playerNum = obj.player_num - 1;
        //console.info(youtubeAPI.playerNum,_player_num)
        //console.info(youtubeAPI.youtubeData[playerNum].playerReady)
        youtubeAPI.setYoutube(this.autoPlay);
      }
    // 2回目に開く場合
    } else {
      obj.target = document.querySelector(obj.target);
    }

    this.proto.obj = obj.target;

    /* for Youtube setAutoPlay */
    if ( this.autoPlay ) {
      //console.info(this.core.USER.isMobile)
      if( !this.core.USER.isMobile ){
        this.setPlayer({
          player : youtubeAPI.ytPlayer[ obj.player_num - 1 ],
          event : 'play'
        });
      }
    }

    if( !this.body.classList.contains('fixed') ){
      this.setBody.fixed(this);
    }

    //console.info('bbb',this)
    /* for iOS iframeScroll */
    if ( obj.target.classList.contains('modal_iframe') ) {
      if( this.core.USER.os === 'ios' ){
        obj.target.classList.add('-ios');
      }
    }

    /* for firstOnly & not：modal_bg */
    if( document.getElementById('modal_bg') === null ){
      document.getElementById('modal').append( this.proto.closeBtn );
      document.getElementById('modal').append( this.proto.bg );
      this.closeBtn = document.getElementById('modal_close');
      //this.closeBtn.setAttribute('aria-label', 'モーダルウィンドウを閉じる')
      this.bg = document.getElementById('modal_bg');
      if( this.core.mql === 'tb' ){// タブレット時のみ位置調整
        this.closeBtn.classList.add('tb');
      }
      //console.info(this.proto.obj)
    } else {
      this.firstClick = false;
    }

    obj.target.classList.add('active');
    this.animationEvents.open( this, obj );
  }

  resizeEvent () {
    const active = document.querySelector('.modal_contents.active');
    //console.info('aaa',active)

    /* iOS15用：ここから */
    let activeHeightDiff;
    //alert(window.navigator.userAgent.toLowerCase())
    if( this.core.USER.os === 'ios' ){
      activeHeightDiff = 100;
    } else {
      activeHeightDiff = 70;
    }
    /* iOS15用：ここまで */

    //console.info(active != null)
    // for modalActive
    if( active != null ){
      this.state.width = active.offsetWidth;
      this.state.height = active.offsetHeight;

      if ( active.classList.contains('modal_yt') ) {
        //console.info(this.core.mql)
        if ( this.core.mql === 'pc' ) {
          /* PC時横幅固定 */
          this.state.width = Math.round( 960 );
        } else {
          this.state.width = this.core.win.width;
        }
        this.state.height = Math.round( this.state.width * 0.5625 );

        if ( this.state.height >= this.core.win.height ) {
          this.state.height = this.core.win.height;
          this.state.width = this.core.win.height * 1.777777;
        }
        active.style.height = this.state.height + 'px';
        active.style.width = this.state.width + 'px';
        active.style.left = ( ( this.core.win.width - this.state.width ) / 2 ) + 'px';
        active.style.top = ( ( this.core.win.height - this.state.height ) / 2 ) + 'px';

      } else if ( active.classList.contains('modal_iframe') ) {
        let iframeH = active.querySelector('iframe').contentDocument.body.clientHeight;
        //console.info(iframeH,this.core.win.height - activeHeightDiff)
        if( iframeH < this.core.win.height - activeHeightDiff * 1.5 ){
          active.style.height = iframeH + 'px';
          active.style.top = ( ( this.core.win.height - iframeH ) / 2 ) + 'px';
        } else {
          active.style.height = this.core.win.height - activeHeightDiff + 'px';
          active.style.top = '60px';
        }
        active.style.left = ( ( this.core.win.width - this.state.width ) / 2 ) + 'px';
      } else {
        active.style.left = ( ( this.core.win.width - this.state.width ) / 2 ) + 'px';
        active.style.top = ( ( this.core.win.height - this.state.height ) / 2 ) + 'px';
      }
    }
  }

  animationEvents = {

    open ( that, obj ) {
      that.state.response = false;
      //console.info(that.proto.obj,that.state.next)
      //console.info(that.bg.classList,that.core.animationEnd)

      function openEventObj(event){
        if( obj.bg_click ){/* パラメータ「bg_click」がtrueの場合 */
          that.closeBtn.classList.remove('hdn', 'out');
          that.closeBtn.classList.add('active', 'in');

        } else { /* パラメータ「bg_click」がfalseの場合 */
        }
        if( that.proto.obj.classList.contains('modal_iframe') ){
          /* iframeのスクロール位置をTOPに */
          //console.info(that.proto.obj.querySelector('iframe').contentWindow)
          that.proto.obj.querySelector('iframe').contentWindow.scrollTo(0, 0);
        }
        //console.info(that.proto.obj)
        that.proto.obj.classList.remove('hdn', 'out');
        that.proto.obj.classList.add('in');
        that.proto.obj.addEventListener('animationend', setResponse, {once: true});

        /* resizeEvent */
        that.resizeEvent();
      }

      function setResponse(event){
        that.state.response = true;

        that.setCloseBtn.initialize( that, obj );
        /* offLoading */
        that.bg.classList.add('-offLoading');

        // アクセシビリティ対応 //////////////////////////////////////////////
        that.modal.setAttribute('aria-modal', true);
        that.modal.setAttribute('aria-hidden', false);
        that.modal.setAttribute('tabindex', '-1');
        that.modal.focus();
        //console.info(obj.target,that.btn)
        // トリガーのtabindexを全て削除
        for( let y = 0; y < that.btn.length; y++ ){
          that.btn[y].removeAttribute('tabindex');
        }
        that.proto.obj.setAttribute('aria-hidden', false);
        that.focustrap.addEvent(that.modal, 0)
        that.escapekey.addEvent(that, that.animationEvents, 0)
        //console.info(that.body.querySelectorAll(':scope > :not(#modal, script)'))
        // モーダル以外のエリアを読み取りから除外
        that.other = that.body.querySelectorAll(':scope > :not(#modal, script)');
        for( let i = 0; i < that.other.length; i++ ){
          //console.info(that.other[i],that.otherList)
          that.otherList.push(that.other[i])
          that.otherList[i].setAttribute('aria-hidden', true);
        }
        // アクセシビリティ対応 //////////////////////////////////////////////
      }

      that.bg.classList.remove('hdn', 'out');
      that.bg.classList.add('active', 'in');

      if( !that.proto.setdom[obj.num - 1] ){
        // iframe初回読み込み時のみonloadイベントを入れる
        if( obj.target.classList.contains('modal_iframe') ){
          //console.time('onload')
          obj.target.firstElementChild.onload = function () {
            //console.timeEnd('onload')
            openEventObj();
          }
        } else {
          openEventObj();
        }
        // setdomここで
        that.proto.setdom[obj.num - 1] = true;
      } else {
        openEventObj();
      }
    },

    close ( that /*, obj */ ) {
      function closeEvent(event){
        //console.timeEnd('close');
        event.target.classList.remove('active', 'out');
        //console.info('aaa',event.target.id)
        //console.info(event.target.classList.contains('modal_contents'));
        if( event.target.classList.contains('modal_contents') ){
          event.target.classList.add('hdn');
          event.target.removeAttribute('style');
          that.state.response = true;

          // アクセシビリティ対応 //////////////////////////////////////////////
          //console.info(that.trigger)
          that.modal.setAttribute('aria-modal', false);
          that.modal.setAttribute('aria-hidden', true);
          that.modal.removeAttribute('tabindex');
          //console.info(that.trigger === '')
          if( that.trigger !== '' ){
            that.trigger.setAttribute('tabindex', '-1');
            that.trigger.focus();
          }
          that.proto.obj.setAttribute('aria-hidden', true);
          that.closeBtn.removeAttribute('aria-label');
          that.bg.removeAttribute('aria-label');
          that.focustrap.removeEvent(that.modal, 0);
          that.escapekey.removeEvent(that, 0);
          for( let i = 0; i < that.otherList.length; i++ ){
            that.otherList[i].setAttribute('aria-hidden', false);
          }
          // アクセシビリティ対応 //////////////////////////////////////////////

          //console.info(that.state.response);
        } else if ( event.target.id === 'modal_close' || event.target.id === 'modal_bg' ){
          event.target.classList.add('hdn');
          if ( event.target.id === 'modal_bg' ){
            event.target.classList.remove('-offLoading');
          }
        }
      }

      //console.info(that, _obj)
      that.state.response = false;

      /* iOSでfixed要素のバグ（チラツキ）のためここに移動 */
      that.setBody.relative( that );

      const setupEvent = target => {
        //console.info(target.id)
        target.classList.remove('in');
        target.classList.add('active', 'out');
        target.addEventListener('animationend', closeEvent, {once: true});
      }

      setupEvent( that.bg );
      setupEvent( that.closeBtn );
      setupEvent( document.querySelector('.modal_contents.active')/* _obj.target */ );
    }
  }


  /*

    setTrigger  -----------------------------------------------

  */
  setTrigger () {
    let that = this;
    //console.info(that.btn,this.btn)

    for( let i = 0; i < that.btn.length; i++ ){
      //console.info(that.btn[i])

      let _type = that.btn[i].getAttribute('data-modal').split( '__' )[1],
        _param = that.btn[i].getAttribute('data-modal').split( '__' )[2],
        _player_num = that.btn[i].getAttribute('data-ytnum'),
        _yt_id = '',
        _modal,
        _modal_outer,
        _modal_inner,
        _bg_click = true;
        //_flg_exist = false;

      /* すでにモーダル作成済の場合dom生成しない */
      for( let x = 0; x < that.proto.num.length; x++ ){
        if( that.proto.num[x] === Number(that.btn[i].getAttribute('data-modal').split( '__' )[0]) ){
          //console.info('モーダル作成済')
          that.proto.exist = true;
          break;
        }
      }
      //console.info(that.proto.exist)

      /* モーダル未作成の場合のみdom生成 */
      if( !that.proto.exist ){
        //console.info('モーダル未作成')
        that.proto.num.push(Number(that.btn[i].getAttribute('data-modal').split( '__' )[0]));
        //console.info(that.proto)
        if ( _type === 'yt' ){
          _yt_id = that.btn[i].getAttribute('data-modal').split( '__' )[2];	
          youtubeAPI.youtubeData.push({
            num: Number(_player_num),
            youtubeId: _yt_id,
            embedArea: 'player'+_player_num,
            playerReady: false
          });
        }

        _modal_inner = that.setHtml({
          num : Number(that.btn[i].getAttribute('data-modal').split( '__' )[0]),
          type : _type,
          param : _param,
          player_num : _player_num,
          yt_id : _yt_id
        });

        /* iframe個別埋め込みに変更 */
        _modal_outer = document.createElement('div');
        _modal_outer.className = 'modal_contents modal_' + Number(that.btn[i].getAttribute('data-modal').split( '__' )[0]) + ' modal_' + _type;
         //console.info(i, Number(that.btn[i].getAttribute('data-modal').split( '__' )[0] - 1))
        _modal_outer.appendChild(_modal_inner);

        that.proto.contents[Number(that.btn[i].getAttribute('data-modal').split( '__' )[0]) - 1]  = _modal_outer;
        that.proto.setdom[Number(that.btn[i].getAttribute('data-modal').split( '__' )[0]) - 1] = false;
        //console.info(that.proto.contents[Number(that.btn[i].getAttribute('data-modal').split( '__' )[0]) - 1])
      }

      /* モーダルを一まとめにする要素「div#modal」追加 */
      if( document.getElementById('modal') === null ){
        _modal = document.createElement('div');
        _modal.id = 'modal';
        _modal.role = 'dialog';
        that.body.prepend(_modal);
        that.modal = _modal;
      }

      function clickEvent(event){
        event.preventDefault();

        // data-noClose属性が存在する場合、bg_clickをOFFにする
        if( that.btn[i].getAttribute('data-noClose') ){
          _bg_click = false;
        }

        if( that.state.response ){
          //console.info(i,that.proto.contents[Number(that.btn[i].getAttribute('data-modal').split( '__' )[0]) - 1])
          //console.info(that.btn[i],_player_num,youtubeAPI.ytPlayer)
          that.trigger = that.btn[i];

          that.openEvent({
            target : '.modal_' + Number(that.btn[i].getAttribute('data-modal').split( '__' )[0]),
            num : Number(that.btn[i].getAttribute('data-modal').split( '__' )[0]),
            type : _type,
            player_num : _player_num,
            bg_click : _bg_click
          });
        }
      }

      // clickEventをthat.eventListeners[i]に格納してremove可能にする
      that.btn[i].removeEventListener('click', that.eventListeners[i]);
      that.eventListeners[i] = e => clickEvent(e);
      that.btn[i].addEventListener('click', that.eventListeners[i]);

      /* 最後に配列「youtubeData」を「num」順に並べ替え */
      if( i+1 === that.btn.length ){
        youtubeAPI.youtubeData.sort( (a, b) => {
          return a.num - b.num;
        });
      }
    }
  }


  /*

    setCloseBtn  -----------------------------------------------

  */
  setCloseBtn = {
    // #modal_closeと#modal_bg用
    uiBtn: null,
    uiBtnListeners: [],
    that: null,
    obj: null,

    initialize ( that, obj ) {
      this.that = that;
      this.obj = obj;
      this.uiBtn = document.querySelectorAll('.js-modalClose#modal_close, .js-modalClose#modal_bg');
      //console.info(this.uiBtn)

      const addEventOther = target => {
        const closeBtn = target.querySelectorAll('.js-modalClose');
        for( let i = 0; i < closeBtn.length; i++ ){
          //console.info(closeBtn[i])
          //closeBtn[i].setAttribute('aria-label', 'モーダルウィンドウを閉じる');
          closeBtn[i].addEventListener('click', { that: that, obj: obj, handleEvent: that.setCloseBtn.setupEvent});
        }
      }

      /* UI 閉じるボタン（BGと右上x）イベント登録・削除 */
      if( obj.bg_click ){
        for( let i = 0; i < this.uiBtn.length; i++ ){
          this.uiBtn[i].setAttribute('aria-label', 'モーダルウィンドウを閉じる');
        }
        if( this.uiBtnListeners.length === 0 ){// リスナー未登録の場合のみ、リスナー登録
          for( let i = 0; i < this.uiBtn.length; i++ ){
            //this.uiBtn[i].setAttribute('aria-label', 'モーダルウィンドウを閉じる');
            this.uiBtnListeners[i] = e => that.setCloseBtn.setupEvent(e);
            this.uiBtn[i].addEventListener('click', this.uiBtnListeners[i]);
          }
        }
      } else {
        if( this.uiBtnListeners.length !== 0 ){// リスナー登録済の場合のみ、リスナー削除
          for( let i = 0; i < this.uiBtn.length; i++ ){
            //console.info(this.uiBtn[i])
            //this.uiBtn[i].removeAttribute('aria-label');
            this.uiBtn[i].removeEventListener('click', this.uiBtnListeners[i]);
            if( i === this.uiBtn.length - 1 ){
              this.uiBtnListeners = [];
            }
          }
        }
      }

      /* iframe内閉じるボタン */
      if( obj.target.classList.contains('modal_iframe') ){
        // 最初
        if( !that.iframe.length ){
          that.iframe.push({ 
            num: obj.num,
            content: obj.target.children[0]
          })
          addEventOther(obj.target.children[0].contentDocument)
        }

        // 2回目以降
        for( let i = 0; i < that.iframe.length; i++ ){
          //console.info( that.iframe[i].num, obj.num )
          if( that.iframe[i].num === obj.num ){
            return false;
          }
          if( that.iframe.length === i+1 ){
            that.iframe.push({ 
              num: obj.num,
              content: obj.target.children[0]
            });
            addEventOther(obj.target.children[0].contentDocument);
            //console.info( that.iframe )
          }
        }
      }

      /* dom内閉じるボタン */
      if( obj.target.classList.contains('modal_dom') ){
        // 最初
        if( !that.dom.length ){
          that.dom.push( obj.num );
          addEventOther(obj.target.children[0])
        }

        // 2回目以降
        for( let i = 0; i < that.dom.length; i++ ){
          if( that.dom[i] === obj.num ){
            return false;
          }
          if( that.dom.length === i+1 ){
            that.dom.push( obj.num );
            addEventOther(obj.target.children[0]);
          }
        }
      }

    },

    // 呼び出しによってthisが違うので注意
    setupEvent (e) {
      e.preventDefault();
      //console.info(e,this);
      // 年齢認証
/*
      if (e.target.classList.contains('js-agecheck')) {
        if (document.getElementById('ageCheck').checked) {
          document.cookie = 'AGE_CHECK = true; max-age = 31536000';
        }
      }
*/

      if( this.that.state.response ){
        //console.info(this.that)
        this.that.animationEvents.close(this.that);
        //console.info(this.obj)

        // Youtube stop
        if ( this.obj.type === 'yt' ) {
          this.that.setPlayer({
            player : youtubeAPI.ytPlayer[ this.obj.player_num - 1 ],
            event : 'stop'
          });
        }
        //that.setCloseBtn.setupEvent( this.that, this.obj );
      }
    }
  }

  open ( obj ) {
    this.openEvent({
      target : obj.target,
      num : obj.num,
      type : obj.type,
      player_num : obj.player_num,
      bg_click : obj.bgClick
    });
  };

};