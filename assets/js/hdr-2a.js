(() => {
  const hdr = document.getElementById('mcqhdr');
  const burger = document.getElementById('mcqhdr-burger');
  const drawer = document.getElementById('mcqhdr-mob');
  const sheet = drawer.querySelector('.mcqhdr-mob-sheet');
  const backdrop = drawer.querySelector('.mcqhdr-mob-backdrop');
  const closeBtn = document.getElementById('mcqhdr-close');
  const pill = burger?.querySelector('.mcqhdr-pill');
  const social = hdr?.querySelector('.mcqhdr-social');
  const mobList = drawer?.querySelector('.mcqhdr-mob-list');
  const mobSocialWrap = drawer?.querySelector('[data-mcqhdr-social-wrapper]');
  if (!hdr || !burger || !drawer || !sheet || !backdrop || !closeBtn || !social || !mobList || !mobSocialWrap) return;

  const isMobile = () => matchMedia('(max-width:768px)').matches;
  const atTop = () => scrollY <= 0;
  const setOffset = () => document.documentElement.style.setProperty('--hdr-offset', hdr.offsetHeight + 'px');
  const setDense = d => { hdr.classList.toggle('mcqhdr-is-dense', d); setOffset(); };

  /* Limpieza de estilos del sheet/backdrop (fix reopen) */
  function resetSheetStyles(){
    sheet.style.transform = '';
    sheet.style.opacity = '';
    sheet.style.transition = '';
    backdrop.style.opacity = '';
    backdrop.style.transition = '';
  }

  /* Densidad header */
  requestAnimationFrame(()=>{ setDense(!atTop()); setOffset(); });
  addEventListener('scroll', ()=> setDense(!atTop()), { passive:true });

  /* Desktop pill */
  function openDesktop(){
    burger.classList.add('mcqhdr-open');
    const bars = burger.querySelectorAll('.mcqhdr-bars span');
    if (bars[0]) bars[0].style.transform = 'translateY(8px) rotate(45deg)';
    if (bars[1]) bars[1].style.opacity   = '0';
    if (bars[2]) bars[2].style.transform = 'translateY(-8px) rotate(-45deg)';
    if (pill){
      const content = pill.scrollWidth;
      const maxV = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--pill-max')) || 700;
      burger.style.setProperty('--pill-max', Math.min(content+16, maxV)+'px');
    }
  }
  function closeDesktop(){
    burger.classList.remove('mcqhdr-open');
    burger.querySelectorAll('.mcqhdr-bars span').forEach(b => { b.style.transform=''; b.style.opacity=''; });
  }

  /* Drawer móvil */
  let lastFocused = null;
  function lockScroll(on){ document.body.classList.toggle('_lock', on); }
  function focusTrap(){
    const focusables = sheet.querySelectorAll('a,button,input,select,textarea,[tabindex]:not([tabindex="-1"])');
    const first = focusables[0], last = focusables[focusables.length-1];
    function loop(e){
      if (e.key !== 'Tab') return;
      if (e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
    }
    sheet.addEventListener('keydown', loop);
    return () => sheet.removeEventListener('keydown', loop);
  }
  let removeTrap = null;

  function openMobile(){
    lastFocused = document.activeElement;
    resetSheetStyles(); // fix
    drawer.classList.add('mcqhdr-open');
    lockScroll(true);
    if (social && mobSocialWrap && !mobSocialWrap.contains(social)) {
      mobSocialWrap.appendChild(social);
    }
    removeTrap = focusTrap();
    closeBtn.focus({preventScroll:true});
  }

  function closeMobile(){
    drawer.classList.remove('mcqhdr-open');
    lockScroll(false);
    const hdrBar = hdr.querySelector('.mcqhdr-bar');
    if (hdrBar && !hdrBar.contains(social)) hdrBar.appendChild(social);
    if (removeTrap) removeTrap();
    if (lastFocused) lastFocused.focus({preventScroll:true});
    resetSheetStyles(); // fix
  }

  burger.addEventListener('click', e=>{
    e.stopPropagation();
    if (isMobile()){
      drawer.classList.contains('mcqhdr-open') ? closeMobile() : openMobile();
    } else {
      burger.classList.contains('mcqhdr-open') ? closeDesktop() : openDesktop();
    }
  });
  closeBtn.addEventListener('click', closeMobile);
  backdrop.addEventListener('click', closeMobile);
  document.addEventListener('keydown', e=>{
    if (e.key === 'Escape') { closeDesktop(); closeMobile(); }
  });
  document.addEventListener('click', e=>{
    if (!hdr.contains(e.target) && !drawer.contains(e.target)) { closeDesktop(); }
  });

  /* Swipe-down con animación y cleanup */
  let startY=0, currentY=0, dragging=false;
  const THRESH=80, MAX_PULL=140;

  sheet.addEventListener('touchstart', (e)=>{
    if (!isMobile() || !drawer.classList.contains('mcqhdr-open')) return;
    dragging=true; startY=e.touches[0].clientY; currentY=startY;
    sheet.style.transition='none';
  }, {passive:true});

  sheet.addEventListener('touchmove', (e)=>{
    if (!dragging) return;
    currentY=e.touches[0].clientY;
    const dy=Math.max(0,Math.min(MAX_PULL,currentY-startY));
    sheet.style.transform=`translateY(${dy}px)`;
    sheet.style.opacity=`${Math.max(0.86,1-dy/300)}`;
    backdrop.style.opacity=`${Math.max(.25,1-dy/220)}`;
  }, {passive:true});

  function endDrag(){
    if(!dragging) return;
    dragging=false;

    const dy=Math.max(0,Math.min(MAX_PULL,currentY-startY));
    sheet.style.transition='transform 260ms var(--spring), opacity 200ms var(--ease-in-out)';
    backdrop.style.transition='opacity 200ms var(--ease-in-out)';

    if(dy > THRESH){
      requestAnimationFrame(()=>{
        sheet.style.transform='translateY(-12px)';
        sheet.style.opacity='0';
        backdrop.style.opacity='0';
        setTimeout(()=>{ closeMobile(); }, 260);
      });
    } else {
      sheet.style.transform='translateY(0)';
      sheet.style.opacity='1';
      backdrop.style.opacity='1';
    }
  }
  sheet.addEventListener('touchend', endDrag, {passive:true});
  sheet.addEventListener('touchcancel', endDrag, {passive:true});

  /* Píldoras sociales (ancho) */
  function setOpenWidths(){
    const supportsHover = matchMedia('(hover:hover) and (pointer:fine)').matches && innerWidth>=769;
    hdr.querySelectorAll('.mcqhdr-social a').forEach(a=>{
      const label = a.querySelector('.label'); if(!label) return;
      if(!supportsHover){
        a.style.setProperty('--open-w', getComputedStyle(a).getPropertyValue('--closed-w') || '34px');
        return;
      }
      const open = Math.ceil(label.getBoundingClientRect().width + 16 + 10 + 20);
      a.style.setProperty('--open-w', open + 'px');
    });
  }

  /* Primer layout sin saltos */
  requestAnimationFrame(()=>{
    (document.fonts?.ready || Promise.resolve()).then(()=>{
      requestAnimationFrame(()=>{
        setOpenWidths();
        document.documentElement.classList.remove('preload');
      });
    });
  });

  /* Contenido de prueba */
  const cards = document.getElementById('cards');
  if (cards){
    const html = Array.from({length:18}).map((_,i)=>`
      <article style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:18px;min-height:${170+Math.round(Math.random()*70)}px;backdrop-filter:blur(4px)">
        <h3 style="margin:0 0 6px;font-size:var(--step-2);font-variation-settings:'wght' 640;letter-spacing:var(--track-tight)">Tarjeta ${i+1}</h3>
        <p style="opacity:.75">Contenido de prueba para verificar scroll, glass, hover y menú móvil.</p>
      </article>
    `).join('');
    cards.innerHTML = html;
  }
})();