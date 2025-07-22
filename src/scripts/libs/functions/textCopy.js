/*
  テキストコピー /setTextCopy/  -----------------------------------------------
*/
export const setTextCopy = () => {
  const copy = document.querySelector('.js-copy');
  const target = document.querySelector('.js-copyTarget');
  const comp = document.querySelector('.js-copyComp');

  const compTl = gsap.timeline().pause()
    .fromTo(comp, {
      y: '5px',
      autoAlpha: 0
    }, {
      y: 0,
      autoAlpha: 1,
      ease: 'Power4.easeOut',
      duration: .5
    })
    .to(comp, {
      y: '-5px',
      autoAlpha: 0,
      ease: 'Power4.easeOut',
      duration: .5
    })

  function copyTxt (e) {
    e.preventDefault();
    navigator.clipboard.writeText( target.textContent )
      .then(
        (success) => {
          // コピー成功時の処理
          compTl.restart()
        },
        (error) => {
          // エラー時の処理（document.execCommandを使用する）
          const input = document.createElement('input');
          input.classList.add('copyInput');
          input.value = target.textContent;
          document.body.appendChild(input);
          input.select();
          const result = document.execCommand('copy');
          document.body.removeChild(input);
          compTl.restart()
        }
      )
  }

  if( copy ){
    copy.addEventListener('click', copyTxt);
  }
}