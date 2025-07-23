export const youtubeAPI = {
  flgYtTag: false,
  ytPlayer: [],
  youtubeData: [],

  initialize() {
    window.onYouTubeIframeAPIReady = () => {
      this.youtubeData.forEach((data, index) => {
        if (!data.playerReady) {
          this.embedYoutube(index);
        }
      });
    };

    window.youtubeAPI = this;
  },

  setYoutube() {
    if (this.flgYtTag) {
      if (window.YT && window.YT.Player && typeof window.onYouTubeIframeAPIReady === 'function') {
        window.onYouTubeIframeAPIReady();
      }
    } else {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      this.flgYtTag = true;
    }
  },

  embedYoutube(index) {
    if (!window.YT || !window.YT.Player) {
      console.warn('YouTube API not ready');
      return;
    }

    const data = this.youtubeData[index];
    if (!data) {
      console.warn(`youtubeData[${index}] undefined`);
      return;
    }

    this.ytPlayer[index] = new YT.Player(data.embedArea, {
      videoId: data.youtubeId,
      playerVars: {
        rel: 0,
        autoplay: data.autoPlay ? 1 : 0,
        mute: data.autoPlay ? 1 : 0,
        showinfo: 0,
        loop: 0,
        controls: 1
      },
      events: {
        onReady: (event) => this.onPlayerReady(event, index),
      }
    });
  },

  onPlayerReady(event, index) {
    this.youtubeData[index].playerReady = true;
    console.info(this.youtubeData[index])
    // ここで自動再生判定して再生
    if (this.youtubeData[index].autoPlay) {
      console.info('再生')
      event.target.playVideo();
    }
  },

  stopPlayer(index) {
    if (this.ytPlayer[index]) {
      this.ytPlayer[index].stopVideo();
    }
  },

  destroyPlayer(index) {
    if (this.ytPlayer[index]) {
      this.ytPlayer[index].destroy();
      delete this.ytPlayer[index];
      if (this.youtubeData[index]) {
        this.youtubeData[index].playerReady = false;
      }
    }
  }
};