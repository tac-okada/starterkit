import { Core } from '/src/scripts/libs/core.js';
import { ScrollTrigger } from 'gsap/ScrollTrigger.js';

window.addEventListener('load', () => {
  /* ブレイクポイント指定：タブレット,スマホ */
  appVideo.initialize(1024,767);
  
});

class AppVideo extends Core {
/*
  使用可能な定数・変数一覧  -----------------------------------------------
  ● UAなど：this.USER
  ● 画面サイズなど：this.win
  ● メディアクエリ：this.mql（指定したブレイクポイントに基づく現在のデバイスを返す：pc/tb/sp）
*/

  /* スクロール時に実行 */
  scrollHandler () {
    //console.info(this.win.scrollTop,this.win.scrollBottom);
  }

  /* 画面リサイズ時に実行 */
  resetHandler () {
    //console.info(this.win.width,this.mql);
  }

  /* ページ読み込み時に実行 */
  loadHandler () {
    gsap.registerPlugin(ScrollTrigger);

    const mov = document.getElementById('mov');
    const movCol = document.querySelector('.movCol');
    let areaH;
    let beforeH;
    let per;
    let nowTime = 0;
    mov.setAttribute('src', 'video/pixta_76524957.mp4');

    mov.addEventListener('loadeddata', (e) => {
      console.info(e)
      console.info(mov.duration)

      const loader = document.querySelector('.loader');
  
      loader.classList.add('fo');
      loader.addEventListener('animationend', {obj: this, handleEvent: setVideo}, { once: true });
  
      function setVideo(){
        loader.classList.add('hdn');

        /* ここでスクロールとブラウザイベントを有効にする */
        this.obj.enableScroll();
      }
    })

    console.info(movCol.getBoundingClientRect().top + window.pageYOffset,movCol.parentNode.offsetHeight)

    gsap.timeline({
      scrollTrigger: {
        trigger: '.movCol',
        start: 'center center',
        end: 'bottom top',// ここの数値で演出時間が決まる（スクロール距離=時間）
        scrub: 1,
        pin: true,
        //markers: true,
        onEnter: () => {
          areaH = ScrollTrigger.maxScroll(window) /* - (movCol.getBoundingClientRect().top + window.pageYOffset) */;
          beforeH = window.pageYOffset+movCol.offsetHeight/2;
          console.info(areaH,movCol.getBoundingClientRect().top)
        },
        onEnterBack: () => {
        },
        onLeave: () => {
        },
        onLeaveBack: () => {
        },
        onUpdate: () => {

          per = ( window.pageYOffset+movCol.offsetHeight / 2 - beforeH ) / ( areaH - beforeH );
          per = Number(per.toFixed(2));
          nowTime = per*mov.duration;
          nowTime = nowTime < 0 ? 0 : nowTime;
          nowTime = Number(nowTime.toFixed(2));
          setTimeout(function(){
            mov.currentTime = nowTime;
          }, 0)
          
          
          console.info(per, nowTime)
          //console.info((window.pageYOffset+movCol.offsetHeight/2)/movCol.parentNode.offsetHeight)
          //areaH = mov.parentNode.offsetHeight;
          //console.info(areaH,window.pageYOffset)
  
          // 左右反転
/*
          scroll = window.pageYOffset;
          if( scroll > prevScroll ){
            gsap.set('.lottieSample',{
              scaleX: 1
            })
          } else {
            gsap.set('.lottieSample',{
              scaleX: -1
            })
          }
          prevScroll = scroll;
  
          lottieSampleControl()
*/
        }
      }
    })

  }
};

window.appVideo = window.appVideo || new AppVideo;
