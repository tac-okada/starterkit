/*
  マウス追従/setCrsl/  -----------------------------------------------
*/
export const setCrsl = core => {

  const crsl = document.createElement('div');
  crsl.id = 'crsl';
  document.body.appendChild(crsl);
  const crslArea = document.querySelectorAll('.js-crslArea');

  //console.info(core.USER.isMobile)

  if( !core.USER.isMobile ){
    document.addEventListener('mousemove', (e) => {
      crsl.style.transform = 'translate(' + e.clientX + 'px, ' + e.clientY + 'px)';
    });

    for (let i = 0; i < crslArea.length; i++) {
      console.info(i,crslArea)
      crslArea[i].addEventListener('mouseover', () => {
        crsl.classList.add('over');
      });
      crslArea[i].addEventListener('mouseout', () => {
        crsl.classList.remove('over');
      });
    }
  }
};