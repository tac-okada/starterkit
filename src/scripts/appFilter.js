import { Core } from './libs/core.js';

window.addEventListener('load', () => {
  /* ブレイクポイント指定：タブレット,スマホ */
  appFilter.initialize(1024,767);
  
});

class AppFilter extends Core {
/*
  使用可能な定数・変数一覧  -----------------------------------------------
  ● UAなど：this.USER
  ● 画面サイズなど：this.win
  ● メディアクエリ：this.mql（指定したブレイクポイントに基づく現在のデバイスを返す：pc/tb/sp）
  ● transitionEndイベント：this.transitionEnd
  ● animationEndイベント：this.animationEnd
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

    $('.loader').addClass('fo').on(this.animationEnd, () => {
      $('.loader').addClass('hdn').off(this.animationEnd);

      /* ここでスクロールとブラウザイベントを有効にする */
      this.enableScroll();

      const _random = (min, max) => {
        return Math.random() * (max - min) + min;
      }

      /*

        rgbFlicker ---------------------------------------------

      */
      const rgbDom = document.querySelector('.unko > li:nth-child(1) img');
      const rgb = document.querySelectorAll('#rgbFlicker > feOffset');

      let rgbTl = gsap.timeline().pause().add('scene1');

      gsap.utils.toArray(rgb).forEach( (_this) => {
        rgbTl.to(_this, {
          repeat: -1,
          duration: .2,
          onUpdate: () => {
            _this.setAttribute('dx', Math.floor(gsap.utils.random(-5,5)))
            _this.setAttribute('dy', Math.floor(gsap.utils.random(-5,5)))
          }
        }, 'scene1');
      });

      rgbDom.addEventListener('mouseover', (_this) => {
        rgbTl.play();
      });

      rgbDom.addEventListener('mouseout', (_this) => {
        rgbTl.pause();
        gsap.utils.toArray(rgb).forEach( (_this) => {
          gsap.set(_this, {
            onComplete: () => {
              _this.setAttribute('dx', 0)
              _this.setAttribute('dy', 0)
            }
          });
        });
      });


      /*

        noise ---------------------------------------------

      */
      const noiseDom = document.querySelector('.unko > li:nth-child(2) img');
      const turbulence = document.querySelector('#noise > feTurbulence');
      const displacementMap = document.querySelector('#noise > feDisplacementMap');

      let _scale = {
        value: null
      };
      let _baseFrequency = {
        value: null
      };

      let noiseTl = gsap.timeline().pause()
        .add('scene1')
        .fromTo(_scale, {
          value: 0
        }, {
          value: 140,
          duration: .3,
          ease: 'Power4.easeOut',
          onUpdate: () => {
            displacementMap.setAttribute('scale', _scale.value)
          }
        },'scene1')
  
        .fromTo(_baseFrequency, {
          value: 1
        }, {
          value: 1.4,
          duration: .3,
          ease: 'Power4.easeIn',
          onUpdate: () => {
            //console.info(_baseFrequency.value)
            turbulence.setAttribute('baseFrequency', _baseFrequency.value)
          },
          onComplete: () => {
            noiseTl2.play();
          }
        },'scene1')

      let noiseTl2 = gsap.timeline().pause()
        .add('scene1')
        .to(_baseFrequency, {
          repeat: -1,
          duration: .3,
          ease: 'Power4.easeIn',
          onUpdate: function () {
            turbulence.setAttribute('baseFrequency', gsap.utils.random(1.1,1.5).toFixed(1))
          }
        },'scene1')
      

      noiseDom.addEventListener('mouseover', (_this) => {
        noiseTl.play();
        //noiseTl2.play();
      });

      noiseDom.addEventListener('mouseout', (_this) => {
        noiseTl2.pause();
        noiseTl.reverse();
      });


      /*

        toneChange ---------------------------------------------

      */
      const toneChangeDom = document.querySelector('.unko > li:nth-child(3) img');
      const feFunc = document.querySelectorAll('#duotone .feFunc');
      let color = {
        r: '0 1',
        g: '0 1',
        b: '0 1'
      };

      let toneChangeTl = gsap.timeline();

      const toneChangeGo = () => {
        toneChangeTl
        .add('scene1')
        .fromTo('#duotone feFuncR', {
          attr: {
            tableValues: () => {
              return color.r;
            }
          }
        },
        {
          attr: {
            tableValues: () => {
              color.r = gsap.utils.random(0,1).toFixed(1)  + ' ' + gsap.utils.random(.8,1).toFixed(1);
              return color.r;
            }
          },
          duration: 1,
        }, 'scene1')
        .fromTo('#duotone feFuncB', {
          attr: {
            tableValues: () => {
              return color.b;
            }
          }
        },
        {
          attr: {
            tableValues: () => {
              color.b = gsap.utils.random(0,1).toFixed(1)  + ' ' + gsap.utils.random(.8,1).toFixed(1);
              return color.b;
            }
          },
          duration: 1,
        }, 'scene1')
        .fromTo('#duotone feFuncG', {
          attr: {
            tableValues: () => {
              return color.g;
            }
          }
        },
        {
          attr: {
            tableValues: () => {
              color.g = gsap.utils.random(0,1).toFixed(1)  + ' ' + gsap.utils.random(.8,1).toFixed(1);
              return color.g;
            }
          },
          duration: 1,
          onComplete: () => {
            toneChangeGo();
          },
        }, 'scene1').play();
      };
      

      toneChangeDom.addEventListener('mouseover', (_this) => {
        toneChangeGo();
      });

      toneChangeDom.addEventListener('mouseout', (_this) => {
        toneChangeTl.pause();
      });


      /*

        handWriting ---------------------------------------------

      */
      const handWritingDom = document.querySelector('.unko > li:nth-child(4) img');
      const turbulence2 = document.querySelector('#handWriting > feTurbulence');
      const displacementMap2 = document.querySelector('#handWriting > feDisplacementMap');

      let _scale2 = {
        value: null
      };
      let _baseFrequency2 = {
        value: null
      };
      let _numOctaves = {
        value: null
      };

      let handWritingTl = gsap.timeline().pause()
        .add('scene1')
        .to(displacementMap2, {
          duration: 1,
          repeat: -1,
/*
          yoyo: true,
          attr: {
            scale: () => {
              _scale2.value = Math.floor(gsap.utils.random(0,10));
              return _scale2.value;
            }
          },
          onRepeat: () => {
            displacementMap2.setAttribute('scale', Math.floor(gsap.utils.random(0,10)));
          }
*/
          onUpdate: () => {
            displacementMap2.setAttribute('scale', Math.floor(gsap.utils.random(3,8)))
          }
        },'scene1')
        .to(turbulence2, {
          duration: 1,
          repeat: -1,
/*
          attr: {
            baseFrequency: () => {
              _baseFrequency.value = gsap.utils.random(1,10).toFixed(2);
              return _baseFrequency.value;
            }
          },
*/
          onUpdate: () => {
            turbulence2.setAttribute('baseFrequency', gsap.utils.random(0.1,0.2).toFixed(2));
          },
          onRepeat: () => {
            turbulence2.setAttribute('numOctaves', Math.floor(gsap.utils.random(1,10)));
          }
        },'scene1')

      handWritingDom.addEventListener('mouseover', (_this) => {
        handWritingTl.play();
      });

      handWritingDom.addEventListener('mouseout', (_this) => {
        handWritingTl.pause();
      });


      /*

        nega ---------------------------------------------

      */
      const negaDom = document.querySelector('.unko > li:nth-child(5) img');
      const negaRgb = document.querySelectorAll('#nega .feFunc');

      let negaTl = gsap.timeline().pause();

      negaTl
      .add('scene1')
      .to(negaRgb, {
        duration: .2,
        attr: {
          slope: () => {
            return '-1';
          },
          intercept: () => {
            return '1';
          },
        }
      }, 'scene1')

      negaDom.addEventListener('mouseover', (_this) => {
        negaTl.play();
      });

      negaDom.addEventListener('mouseout', (_this) => {
        negaTl.reverse();
      });


      /*

        morphology ---------------------------------------------

      */
      const morphoDom = document.querySelector('.unko > li:nth-child(6) img');
      const morphology = document.querySelector('#morphology feMorphology');
      const gaussianBlur = document.querySelector('#morphology feGaussianBlur');

      let morphoTl = gsap.timeline().pause();

      morphoTl
      .add('scene1')
      .to(morphology, {
        duration: .6,
        ease: 'Elastic.easeOut',
        attr: {
          radius: () => {
            return '8';
          }
        }
      }, 'scene1')
      .to(gaussianBlur, {
        duration: .6,
        ease: 'Elastic.easeOut',
        attr: {
          stdDeviation: () => {
            return '1 20';
          }
        }
      }, 'scene1')

      morphoDom.addEventListener('mouseover', (_this) => {
        morphoTl.play();
      });

      morphoDom.addEventListener('mouseout', (_this) => {
        morphoTl.reverse();
      });


      /*

        distantLight ---------------------------------------------

      */
      const distantLightDom = document.querySelector('.unko > li:nth-child(7) img');
      const distantLight = document.querySelector('#distantLight feDistantLight');

      let distantLightTl = gsap.timeline().pause();

      distantLightTl
      .add('scene1')
      .to(distantLight, {
        duration: .5,
        yoyo: true,
        ease: 'SlowMo.ease',
        attr: {
          azimuth: () => {
            return '-30';
          }
        }
      }, 'scene1')
    
      .to(distantLight, {
        duration: .25,
        ease: 'Power4.easeOut',
        attr: {
          elevation: () => {
            return '50';
          }
        }
      }, 'scene1')
      .to(distantLight, {
        duration: .25,
        ease: 'Power4.easeIn',
        attr: {
          elevation: () => {
            return '30';
          }
        }
      }, 'scene1+=.25')

      distantLightDom.addEventListener('mouseover', (_this) => {
        distantLightTl.play();
      });

      distantLightDom.addEventListener('mouseout', (_this) => {
        distantLightTl.reverse();
      });


      /*

        offset ---------------------------------------------

      */
      const offsetDom = document.querySelector('.unko > li:nth-child(8) img');
      const offset1 = document.querySelector('#offset .offset1');
      const offset2 = document.querySelector('#offset .offset2');

      let offsetTl = gsap.timeline().pause();

      offsetTl
      .add('scene1')
      .to(offset1, {
        duration: .5,
        ease: 'Elastic.easeOut',
        attr: {
          dx: () => {
            return '-40';
          }
        },
      }, 'scene1')

      .to(offset2, {
        duration: .5,
        ease: 'Elastic.easeOut',
        attr: {
          dx: () => {
            return '40';
          }
        }
      }, 'scene1')

      offsetDom.addEventListener('mouseover', (_this) => {
        offsetTl.play();
      });

      offsetDom.addEventListener('mouseout', (_this) => {
        offsetTl.reverse();
      });

    });
  }
};

window.appFilter = window.appFilter || new AppFilter;
