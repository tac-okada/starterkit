import { Core } from '/src/scripts/libs/core.js';
import lottieWeb from 'lottie-web';
import '@lottiefiles/lottie-player';
//import { create } from '@lottiefiles/lottie-interactivity';
import { ScrollTrigger } from 'gsap/ScrollTrigger.js';

window.addEventListener('load', () => {
  /* ブレイクポイント指定：タブレット,スマホ */
  appMap.initialize(1024,767);
  
});

class AppMap extends Core {
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
    super.loadHandler();
  }

  /* ローディング完了後に実行 */
  loaded () {
    super.loaded();
    this.setLottie();
  }

  setLottie () {
    loader.classList.add('hdn');

    /* ここでスクロールとブラウザイベントを有効にする */
    this.obj.enableScroll();

    let lottieSample = document.querySelector("lottie-player"); //アニメーションを格納するDOM要素
    let totalFrames;
    let flames = 0;
    let scroll = 0;
    let prevScroll = 0;
    
/*
    usagi = lottieWeb.loadAnimation({
      container: lottieSample,// アニメーションを格納するDOM要素 
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: 'lotties-sample.json' // JSONファイルのパス
    });
*/

    // ここでjsonを読み込むことでコントロール可能になる
    lottieSample.load('lottie-sample.json');

    lottieSample.addEventListener('ready', () => {
      totalFrames = lottieSample.getLottie().totalFrames;
      //lottieSample.getLottie().loop = true;
      console.info(lottieSample.getLottie())
    });

/*
    window.addEventListener('click', () => {
      lottieSampleControl();
    })
*/

    const lottieSampleControl = () => {
      //console.info(flames)
      if( flames < totalFrames ){
        flames++;
      } else {
        flames = 0;
      }
      lottieSample.seek(flames);
    }

/*
    // これだとscrollTriggerと共存できない
    // scrollTriggerのonUpdateでseekする
    const lottieSampleControl = () => {
      create({
        player: lottieSample,
        mode: 'scroll',
        actions: [
          {
            visibility: [0, 1],
            type: 'seek',
            frames: [0, 20],
          },
        ]
      });
    }
*/
    gsap.set('.lottieSample',{
      autoAlpha: 0
    })
    gsap.timeline({
      scrollTrigger: {
        trigger: '.bg',
        start: 'center center',
        end: 'bottom top-=5000',// ここの数値で演出時間が決まる（スクロール距離=時間）
        scrub: .5,
        pin: true,
        //markers: true,
        onEnter: () => {
          gsap.to('.lottieSample',{
            autoAlpha: 1
          })
        },
        onEnterBack: () => {
          gsap.to('.lottieSample',{
            autoAlpha: 1
          })
        },
        onLeave: () => {
          gsap.to('.lottieSample',{
            autoAlpha: 0,
/*
            onComplete: () => {
              gsap.set('.lottieSample',{
                scaleX: -1
              })
            }
*/
          })

        },
        onLeaveBack: () => {
          gsap.to('.lottieSample',{
            autoAlpha: 0,
/*
            onComplete: () => {
              gsap.set('.lottieSample',{
                scaleX: 1
              })
            }
*/
          })
        },
        onUpdate: () => {
          //console.info(window.pageYOffset)

          // 左右反転
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
        }
      }
    })
    .add('scene1')
    .to('.bg_img img:nth-child(2)', {
      x: '-30vw'
    }, 'scene1')
    .to('.bg_img img:nth-child(1)', {
      x: '-40vw'
    }, 'scene1')

    .add('scene2')
    .to('.bg_img img:nth-child(2)', {
      x: '-60vw'
    }, 'scene2')
    .to('.bg_img img:nth-child(1)', {
      x: '-80vw'
    }, 'scene2')
    .to('.lottieSample', {
      y: '-5vw'
    }, 'scene2')

    .add('scene3')
    .to('.bg_img img:nth-child(2)', {
      x: '-90vw'
    }, 'scene3')
    .to('.bg_img img:nth-child(1)', {
      x: '-120vw'
    }, 'scene3')
    .to('.lottieSample', {
      y: '-5vw'
    }, 'scene3')

    .add('scene4')
    .to('.bg_img img:nth-child(2)', {
      x: '-120vw'
    }, 'scene4')
    .to('.bg_img img:nth-child(1)', {
      x: '-160vw'
    }, 'scene4')
    .to('.lottieSample', {
      y: '-5vw'
    }, 'scene4')

    .add('scene5')
    .to('.bg_img img:nth-child(2)', {
      x: '-150vw'
    }, 'scene5')
    .to('.bg_img img:nth-child(1)', {
      x: '-200vw'
    }, 'scene5')
    .to('.lottieSample', {
      y: '0vw'
    }, 'scene5')

    .add('scene6')
    .to('.bg_img img:nth-child(2)', {
      x: '-180vw'
    }, 'scene6')
    .to('.bg_img img:nth-child(1)', {
      x: '-240vw'
    }, 'scene6')
    .to('.lottieSample', {
      y: '-3vw'
    }, 'scene6')

    .add('scene7')
    .to('.bg_img img:nth-child(2)', {
      x: '-210vw'
    }, 'scene7')
    .to('.bg_img img:nth-child(1)', {
      x: '-280vw'
    }, 'scene7')
    .to('.lottieSample', {
      y: '-3vw'
    }, 'scene7')

    .add('scene8')
    .to('.bg_img img:nth-child(2)', {
      x: '-240vw'
    }, 'scene8')
    .to('.bg_img img:nth-child(1)', {
      x: '-320vw'
    }, 'scene8')
    .to('.lottieSample', {
      y: '3vw'
    }, 'scene8')

    .add('scene9')
    .to('.bg_img img:nth-child(2)', {
      x: '-270vw'
    }, 'scene9')
    .to('.bg_img img:nth-child(1)', {
      x: '-360vw'
    }, 'scene9')
    .to('.lottieSample', {
      y: '0vw'
    }, 'scene9')

    .add('scene10')
    .to('.bg_img img:nth-child(2)', {
      x: '-300vw'
    }, 'scene10')
    .to('.bg_img img:nth-child(1)', {
      x: '-400vw'
    }, 'scene10')
    .to('.lottieSample', {
      y: '5vw'
    }, 'scene10')

    .add('scene11')
    .to('.bg_img img:nth-child(2)', {
      x: '-330vw'
    }, 'scene11')
    .to('.bg_img img:nth-child(1)', {
      x: '-440vw'
    }, 'scene11')
    .to('.lottieSample', {
      y: '0vw'
    }, 'scene11')
  };

};

window.appMap = window.appMap || new AppMap;
