export const youtubeAPI = {

  initialize () {
    /* youtubeAPI用グローバル関数 */
    window.onYouTubeIframeAPIReady = () => {
      if( !this.youtubeData[this.playerNum].playerReady ){
        this.embedYoutube(this.playerNum);
      }
    };

    //console.info(this)
    window.youtubeAPI = this;
  },

  /* Youtubeのscriptタグを設置済か否かの判定フラグ */
  flgYtTag : false,
  
  /* YouTubeプレーヤーを格納する配列 */
  ytPlayer : [],
  
  playerNum : 0,

  /*
  
    youtubeData  -----------------------------------------------
  
  */
  youtubeData : [
    /*{
      youtubeId: 'QOVglXRdo0Y',
      embedArea: 'player1',
      playerReady: false
    }*/
  ],

  /*
  
    setYoutube  -----------------------------------------------
  
  */
  setYoutube ( flg ) {
    if( flg ){
      this.autoPlay = 1;
    }
    if( this.flgYtTag ){
      onYouTubeIframeAPIReady();
    } else {
      let tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      let firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      this.flgYtTag = true;
    }
  },

  /*
  
    embedYoutube  -----------------------------------------------
  
  */
  embedYoutube ( _num ) {
    this.ytPlayer[_num] = new YT.Player(
      this.youtubeData[_num].embedArea,
  
      // width：プレーヤーの幅、height：プレーヤーの高さ、YouTubeのID
      {
        // width: 640,
        // height: 480,
        videoId: this.youtubeData[_num].youtubeId,
        playerVars: {
        // wmode：プレーヤーを背面に表示する
        // rel：再生終了後に関連動画を表示するかどうか設定
        // autoplay：自動再生するかどうか設定
        // showinfo：動画再生前にタイトルなどを表示するかどうか設定
        // loop：ループの設定
        // controls：コントロールバー表示設定 0:非表示、1:表示、2:動画再生後に表示
        // wmode: transparent,
        rel: 0,
        autoplay: this.autoPlay,// autoPlayはiOSで機能しないので、onPlayerReadyでかつsetTimeoutでやる
        mute: this.autoPlay,// iOSで自動再生時必須。setVolume(0)だと自動再生しない
        showinfo: 0,
        loop: 0,
        controls: 1
        },
        events: {
          // onReady：プレーヤーの準備ができたときに実行
          // onStateChange：プレーヤーの状態が変化したときに実行
          onReady: this.onPlayerReady( _num )
          // onStateChange: onPlayerStateChange
        }
      }
    );
  },

  /*
  
    onPlayerReady  -----------------------------------------------
  
  */
  onPlayerReady ( _num ) {
    this.youtubeData[_num].playerReady = true;
  },

  /*
  
    onPlayerStateChange  -----------------------------------------------
  
  */
  onPlayerStateChange ( e ) {
    //console.info(e)
  }
};