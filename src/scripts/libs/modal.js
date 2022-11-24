import { youtubeAPI } from './youtubeAPI.js';
youtubeAPI.initialize();

export class Modal {

  constructor () {
    this.$window = $(window),
    this.$html = $('html'),
    this.$btn = $('.js-modalOpen'),
    this.$contents = $('.modal_contents'),
    this.$body = $('body'),
    this.iframepath = '',
    this.autoPlay = false,/* Youtube autoPlay */
    this.$close = '',
    this.$bg = '',
    this.$close_btn = '',
    this.$iframe = '',
    this.state = {
      response: false,
      width: 0,
      height: 0,
      scrollPos: 0,
    },
    this.proto = {
      contents: [],/* cts_txt */
      setdom: [],
      bg: '<div id="modal_bg" class="js-modalClose hdn"></div>',/* bg_txt */
      close: '<div id="modal_close" class="js-modalClose hdn"></div>',/* close_txt */
      num: [],/* modal_num */
      playerNum: 0,/* player_num */
      $obj: ''/* target */
    }
  }

  initialize () {
    this.setTrigger();
    this.state.response = true;
    let _timer;
    let that = this;

    this.$window.on({
      'resize' : function(){
        if ( _timer !== false ) {
          clearTimeout( _timer );
        }
        _timer = setTimeout( function() {
          that.resizeEvent();
        }, 10);
      }
    });
  }

  setHtml ( _obj ) {
    let _html = '';

    /* for Youtube */
    if( _obj.type === 'yt' ){
      _html = '<div id="player' + _obj.player_num + '"></div>';

    /* for singleImage */
    } else if ( _obj.type === 'img' ){
      _html = '<img src="' + _obj.src + '" alt="" />';

    /* for iframe */
    } else if ( _obj.type === 'iframe' ){
      _html = '<iframe src="' + this.iframepath + _obj.src + '" frameborder="no"></iframe>';

    /* for freeContents */
    } else if ( _obj.type === 'dom' ){
      _html = $('.js-modal_dom').html();
      $('.js-modal_dom').remove();
    }

    //console.info(_html)
    return _html;
  }

  setPlayer ( _obj ) {
    //console.info( _obj.event, _obj.player )
    if ( _obj.event === 'play' ) {
      _obj.player.playVideo();
    } else if ( _obj.event === 'stop' ) {
      /* ステータス / -1:未開始 / 0:終了 / 1:再生中 / 2:一時停止 / 3:バッファリング中 / 4:頭出し済み */
      if( _obj.player.getPlayerState() === ( 0 || 1 || 2 || 3 ) ){
        _obj.player.pauseVideo();
        _obj.player.seekTo(0);
      }
    }
  }

  setBody = {
    fixed (that) {
      //console.info(that);
      /* for andrid ver4.4 under */
      if( app.USER.os === 'android' && app.USER.osVersion < 4.4 ){
        that.$body.addClass('absolute').css({
          'position': 'absolute',
          'width': '100%'
        });
      } else {
        that.$body.addClass('fixed').css({
          'width': '100%',
          'top': -1 * that.state.scrollPos
        });
      }
    },
    relative (that) {
      /* body position & scroll */
      that.$body.removeClass('fixed').css({
        'top': 'auto'
      });
      $( 'html, body' ).scrollTop(that.state.scrollPos);
    }
  }

  openEvent ( obj ) {
    //console.info(_obj)
    /* for clickEvent */
    if( obj.event === 'click' ){
      this.proto.$obj = $('.modal_' + obj.num);
      obj.target = this.proto.$obj;
      
    /* for otherEvent */
    } else if ( obj.event === 'ready' ) {
      this.proto.$obj = obj.target;
    }

    /* for Youtube setAutoPlay */
    if ( this.autoPlay ) {
      this.setPlayer({
        player : youtubeAPI.ytPlayer[ _obj.player_num - 1 ],
        event : 'play'
      });
    }

    if( !this.$body.hasClass('fixed') ){
      this.setBody.fixed(this);
    }

    /* for iOS iframeScroll */
    if ( this.proto.$obj.hasClass('modal_iframe') ) {
      if( app.USER.os === 'ios' ){
        this.proto.$obj.css({
          'overflow-y': 'auto',
          '-webkit-overflow-scrolling': 'touch'
        });
      } else {
        this.proto.$obj.css({
          'overflow-y': 'hidden',
          '-webkit-overflow-scrolling': 'auto'
        });
      }
    }

    /* for firstOnly & not：modal_bg */
    if( !$('#modal_bg')[0] ){
      this.$body.append( this.proto.bg ).prepend( this.proto.close );
      this.$bg = $('#modal_bg');
      this.$close_btn = $('#modal_close');

      if( app.USER.device === 'ipad' || app.USER.device === 'androidtablet' || app.USER.device === 'kindle' ){// タブレット時のみ位置調整
        this.$close_btn.addClass('tb');
      }
    }

    this.proto.$obj.addClass('active');
    this.animationEvents.open( this, obj );
  }

  resizeEvent () {
    const $active = $('.modal_contents.active');
    const $active_yt = $('.modal_contents.active.modal_yt');
    this.state.width = $active.outerWidth();
    this.state.height = $active.outerHeight();

    /* iOS15用：ここから */
    let activeHeightDiff;
    //alert(window.navigator.userAgent.toLowerCase())
    if( app.USER.os === 'ios' ){
      activeHeightDiff = 100;
    } else {
      activeHeightDiff = 70;
    }
    /* iOS15用：ここまで */

    // for modalActive
    if( $active[0] ){
      if ( $active.hasClass('modal_yt') ) {
        //console.info(app.mql)
        if ( app.mql === 'pc' ) {
          /* PC時横幅固定 */
          this.state.width = Math.round( 960 );
        } else {
          this.state.width = app.win.width;
        }
        this.state.height = Math.round( this.state.width * 0.5625 );

        if ( this.state.height >= app.win.height ) {
          this.state.height = app.win.height;
          this.state.width = app.win.height * 1.777777;
        }
        $active.css({
          'height' : this.state.height,
          'width' : this.state.width,
          'left' : ( ( app.win.width - this.state.width ) / 2 ) + 'px',
          'top' : ( ( app.win.height - this.state.height ) / 2 ) + 'px'
        });
      } else if( $active.hasClass('modal_iframe') ) {
        $active.css({ 
          'height' : app.win.height - activeHeightDiff,
          'top' : '60px',
          'left' : ( ( app.win.width - this.state.width ) / 2 ) + 'px'
        });
      } else {
        $active.css({
          'left' : ( ( app.win.width - this.state.width ) / 2 ) + 'px',
          'top' : ( ( app.win.height - this.state.height ) / 2 ) + 'px'
        });
      }
    }
  }

  animationEvents = {

    open ( that, obj ) {
      that.state.response = false;
      //console.info(that.proto.$obj,that.state.next)
      that.$bg.removeClass('hdn out').addClass('active in').on(app.animationEnd, () => {
        that.$bg.off(app.animationEnd);
        if( obj.bg_click ){/* パラメータ「bg_click」がtrueの場合 */
          that.$close_btn.removeClass('hdn out').addClass('active in').on(app.transitionEnd, () => {
            that.$close_btn.off(app.transitionEnd);
          });
        } else { /* パラメータ「bg_click」がfalseの場合 */
        }
        if( that.proto.$obj.hasClass('modal_iframe') ){
          /* iframeのスクロール位置をTOPに */
          that.proto.$obj.children('iframe').contents().find('html,body').scrollTop(0);
        }
        that.proto.$obj.removeClass('hdn out').addClass('in').on(app.animationEnd, () => {
          that.proto.$obj.off(app.animationEnd);
          that.state.response = true;
        });

        that.setCloseBtn.initialize( that, obj );
        /* resizeEvent */
        that.resizeEvent();
      });
    },

    close ( that, _obj ) {
      //console.info(_obj)
      that.state.response = false;

      /* iOSでfixed要素のバグ（チラツキ）のためここに移動 */
      that.setBody.relative( that );

      that.$bg.removeClass('in').addClass('out').on(app.animationEnd, function() {
        that.$bg.off(app.animationEnd).removeClass('active out').addClass('hdn');
      });
      that.$close_btn.removeClass('in').addClass('out').on(app.transitionEnd, function() {
        that.$close_btn.off(app.transitionEnd).removeClass('active out').addClass('hdn');
      });
      _obj.target.removeClass('in').addClass('out').on(app.animationEnd, function() {
        _obj.target.off(app.animationEnd).removeClass('active out').removeAttr('style');
        that.state.response = true;
      });
    }
  }


  /*

    setTrigger  -----------------------------------------------

  */
  setTrigger () {
    const $btn = $('.js-modalOpen');
    let that = this;
    $btn.each( function(i) {
      let _num = Number($(this).attr('data-modal').split( '__' )[1]),
        _type = $(this).attr('data-modal').split( '__' )[2],
        _src = $(this).attr('data-modal').split( '__' )[3],
        _player_num = 0,
        _yt_id = '',
        _cts_txt_in = '',
        _flg_exist = false;

      //console.info(that)
      /* すでにモーダル作成済の場合dom生成しない */
      for( let x = 0; x < that.proto.num.length; x++ ){
        if( that.proto.num[x] === _num ){
          _flg_exist = true;
          break;
        }
      }

      /* モーダル未作成の場合のみdom生成 */
      if( !_flg_exist ){
        that.proto.num.push(_num);
        //console.info(modal_num)
        if ( _type === 'yt' ){
          _yt_id = $(this).attr('data-modal').split( '__' )[3];	
          _player_num = $(this).attr('data-ytnum');
          youtubeAPI.youtubeData.push({
            num: Number(_player_num),
            youtubeId: _yt_id,
            embedArea: 'player'+_player_num,
            playerReady: false
          });
        }

        _cts_txt_in = that.setHtml({
          num : _num,
          type : _type,
          src : _src,
          player_num : _player_num,
          yt_id : _yt_id
        });

        /* iframe個別埋め込みに変更 */
        that.proto.contents[_num - 1] = String()
        + '<div class="modal_contents modal_' + _num + ' modal_' + _type + '">'
          + _cts_txt_in
        + '</div>';
        that.proto.setdom[_num - 1] = false;
      //console.info(that.proto.contents[i])
      }
      //console.info(that.proto.setdom[_num - 1],i,_num)
      $(this).off().on({
        'click' : function (event) {
          //console.info(_num)
          event.preventDefault();
          that.state.scrollPos = window.pageYOffset;

          /* dom埋め込みここで */
          if( !that.proto.setdom[_num - 1] ){
            that.$body.prepend(that.proto.contents[_num - 1]);
            that.proto.setdom[_num - 1] = true;
          }

          /* youtube埋め込み */
          if ( _type === 'yt' ){
            youtubeAPI.playerNum = $(this).attr('data-ytnum') - 1;
            //console.info(youtubeAPI.playerNum,_player_num)
            //console.info(youtubeAPI.youtubeData[playerNum].playerReady)
            youtubeAPI.setYoutube();
          }

          if( that.state.response ){
            that.openEvent({
              target : $(this),
              event : 'click',
              num : _num,
              type : _type,
              player_num : _player_num,
              bg_click : true
            });
          }
        }
      });

      /* 最後に配列「youtubeData」を「num」順に並べ替え */
      if( i+1 === $btn.length ){
        youtubeAPI.youtubeData.sort(function (a, b) {
          return a.num - b.num;
        });
      }

    });
  }


  /*

    setCloseBtn  -----------------------------------------------

  */
  setCloseBtn = {
    initialize ( that, obj ) {
      //console.info(_obj)
      /* パラメータ「bg_click」がfalseの場合 */
      if( !obj.bg_click ){
        $('#modal_bg, #modal_close').removeClass('js-modalClose');
      }

      that.$close = $('.js-modalClose');

      /* iframe内閉じるボタン */
      if( obj.target.hasClass('modal_iframe') ){
        that.$iframe = obj.target.children('iframe');
        that.$close = $('.js-modalClose').add('.js-modalClose', that.$iframe[0].contentWindow.document);
        //console.info($iframe,$close)
      }

      that.$close.off('click').on({ 
        'click' : function(e){
          e.preventDefault();
          //console.info(this.state.response)
          if( that.state.response ){
            that.setCloseBtn.setupEvent( that, obj );
          }
        }
      });
    },
    setupEvent ( that, obj ) {
      //console.info(_obj)
      let _grp = false;
      if ( obj.grp_num !== 0 ) {
        _grp = true;
      }
      //console.info(_grp)
      that.animationEvents.close( that, obj );

      // Youtube stop
      if ( obj.type === 'yt' ) {
        that.setPlayer({
          player : youtubeAPI.ytPlayer[ obj.player_num - 1 ],
          event : 'stop'
        });
        //console.info(youtubeAPI.ytPlayer)
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