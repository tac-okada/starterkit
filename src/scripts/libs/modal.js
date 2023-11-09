import { youtubeAPI } from './youtubeAPI.js';
youtubeAPI.initialize();

export class Modal {

  constructor () {
    this.core = {},
    this.btn = '',
    this.eventListeners = [],
    this.body = document.body,
    this.iframepath = '',
    this.autoPlay = false,/* Youtube autoPlay */
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
      _html = document.createElement('div');
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
    //console.info(_obj)
    /* for clickEvent */
    if( obj.event === 'click' ){
      this.proto.obj = document.querySelector('.modal_' + obj.num);
      //console.info(this.proto.obj)
      obj.target = this.proto.obj;
      
    /* for otherEvent */
    } else if ( obj.event === 'ready' ) {
      this.proto.obj = obj.target;
    }

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
    if ( this.proto.obj.classList.contains('modal_iframe') ) {
      if( this.core.USER.os === 'ios' ){
        this.proto.obj.classList.add('-ios');
      }
    }

    /* for firstOnly & not：modal_bg */
    if( document.getElementById('modal_bg') === null ){
      this.body.append( this.proto.bg );
      this.body.prepend( this.proto.closeBtn );
      this.bg = document.getElementById('modal_bg');
      this.closeBtn = document.getElementById('modal_close');
      if( this.core.mql === 'tb' ){// タブレット時のみ位置調整
        this.closeBtn.classList.add('tb');
      }
      //console.info(this.proto.obj)
    } else {
      this.firstClick = false;
    }

    this.proto.obj.classList.add('active');
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

      function openEventBg(event){
        //console.timeEnd('open');
        //console.info(event)
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
        that.proto.obj.addEventListener('animationend', openEventObj, {once: true});

        that.setCloseBtn.initialize( that, obj );
        /* resizeEvent */
        that.resizeEvent();
      }

      function openEventObj(event){
        that.state.response = true;
      }

      that.bg.classList.remove('hdn', 'out');
      that.bg.classList.add('active', 'in');
      //console.time('open');
      that.bg.addEventListener('animationend', openEventBg, {once: true});
    },

    close ( that/* , _obj */ ) {
      function closeEvent(event){
        //console.timeEnd('close');
        event.target.classList.remove('active', 'out');
        //console.info('aaa',event.target.id)
        //console.info(event.target.classList.contains('modal_contents'));
        if( event.target.classList.contains('modal_contents') ){
          event.target.classList.add('hdn');
          event.target.removeAttribute('style');
          that.state.response = true;
          //console.info(that.state.response);
        } else if ( event.target.id === 'modal_close' || event.target.id === 'modal_bg' ){
          event.target.classList.add('hdn');
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

      function clickEvent(event){
        //console.info(_num)
        event.preventDefault();
        that.state.scrollPos = window.pageYOffset;
  
        //console.info(event,that.btn[i].getAttribute('data-modal').split( '__' )[0],that.proto.contents[Number(that.btn[i].getAttribute('data-modal').split( '__' )[0]) - 1])
        if( !that.proto.setdom[Number(that.btn[i].getAttribute('data-modal').split( '__' )[0]) - 1] ){
          that.body.prepend(that.proto.contents[Number(that.btn[i].getAttribute('data-modal').split( '__' )[0]) - 1]);
          that.proto.setdom[Number(that.btn[i].getAttribute('data-modal').split( '__' )[0]) - 1] = true;
  
          if ( _type === 'yt' ){
            youtubeAPI.playerNum = that.btn[i].getAttribute('data-ytnum') - 1;
            //console.info(youtubeAPI.playerNum,_player_num)
            //console.info(youtubeAPI.youtubeData[playerNum].playerReady)
            youtubeAPI.setYoutube(that.autoPlay);
          }
        }

        //console.info(that.btn[i].getAttribute('data-noClose'))
        // data-noClose属性が存在する場合、bg_clickをOFFにする
        if( that.btn[i].getAttribute('data-noClose') ){
          _bg_click = false;
        }

        if( that.state.response ){
          //console.info(i,that.proto.contents[Number(that.btn[i].getAttribute('data-modal').split( '__' )[0]) - 1])
          //console.info(that.btn[i],_player_num,youtubeAPI.ytPlayer)
          that.openEvent({
            target : that.btn[i],
            event : 'click',
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
    closeBtnListeners: [],
    that: null,
    obj: null,

    initialize ( that, obj ) {
      this.that = that;
      this.obj = obj;
      //console.info(this)

      //let closeBtnListeners = [];

      const addEvent = closeBtn => {
        //console.info(closeBtn.getAttribute('id'))

        // #modal_closeと#modal_bgのみ関数を配列に格納、removeできるようにする
        if( closeBtn.getAttribute('id') === 'modal_close' ){
          //console.info('AddBtn')
          this.closeBtnListeners[0] = e => that.setCloseBtn.setupEvent(e);
          closeBtn.addEventListener('click', this.closeBtnListeners[0]);
        }
        if( closeBtn.getAttribute('id') === 'modal_bg' ){
          //console.info('AddBg')
          this.closeBtnListeners[1] = e => that.setCloseBtn.setupEvent(e);
          closeBtn.addEventListener('click', this.closeBtnListeners[1]);
        }
      }

      const removeEvent = closeBtn => {
        if( closeBtn.getAttribute('id') === 'modal_close' ){
          //console.info('RemoveBtn')
          closeBtn.removeEventListener('click', this.closeBtnListeners[0]);
        }
        if( closeBtn.getAttribute('id') === 'modal_bg' ){
          //console.info('RemoveBg')
          closeBtn.removeEventListener('click', this.closeBtnListeners[1]);
          this.closeBtnListeners = [];
        }
        //console.info(this.closeBtnListeners)
      }

      const addEventOther = target => {
        const closeBtn = target.querySelectorAll('.js-modalClose');
        for( let i = 0; i < closeBtn.length; i++ ){
          //console.info(closeBtn[i])
          closeBtn[i].addEventListener('click', { that: that, obj: obj, handleEvent: that.setCloseBtn.setupEvent});
        }
      }

      /* パラメータ「bg_click」がfalseの場合 */
      if( obj.bg_click ){
        if( this.closeBtnListeners.length === 0 ){
          addEvent(document.getElementById('modal_close'));
          addEvent(document.getElementById('modal_bg'));
        }
      } else {
        //console.info( this.closeBtnListeners.length !== 0,this.closeBtnListeners )
        if( this.closeBtnListeners.length !== 0 ){
          removeEvent(document.getElementById('modal_close'));
          removeEvent(document.getElementById('modal_bg'));
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
        //console.info(this.obj.target)

        // Youtube stop
        if ( this.obj.type === 'yt' ) {
          that.setPlayer({
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
      event : obj.event,
      num : obj.num,
      type : obj.type,
      player_num : obj.player_num,
      bg_click : obj.bgClick
    });
  };

};