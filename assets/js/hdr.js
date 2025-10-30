

(() => {
  const hdr = document.getElementById('cqhdr');
  const burger = document.getElementById('cqhdr-burger');
  const drawer = document.getElementById('cqhdr-mob');
  const sheet = drawer.querySelector('.cqhdr-mob-sheet');
  const backdrop = drawer.querySelector('.cqhdr-mob-backdrop');
  const closeBtn = document.getElementById('cqhdr-close');
  const pill = burger?.querySelector('.cqhdr-pill');
  const social = hdr?.querySelector('.cqhdr-social');
  const mobList = drawer?.querySelector('.cqhdr-mob-list');
  const mobSocialWrap = drawer?.querySelector('[data-cqhdr-social-wrapper]');
  if (!hdr || !burger || !drawer || !sheet || !backdrop || !closeBtn || !social || !mobList || !mobSocialWrap) return;

  const isMobile = () => matchMedia('(max-width:768px)').matches;
  const atTop = () => scrollY <= 0;
  const setOffset = () => document.documentElement.style.setProperty('--hdr-offset', hdr.offsetHeight + 'px');
  const setDense = d => { hdr.classList.toggle('cqhdr-is-dense', d); setOffset(); };

  /* ===== Util: limpiar estilos del sheet/backdrop (fix reopen) ===== */
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
    burger.classList.add('cqhdr-open');
    const bars = burger.querySelectorAll('.cqhdr-bars span');
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
    burger.classList.remove('cqhdr-open');
    burger.querySelectorAll('.cqhdr-bars span').forEach(b => { b.style.transform=''; b.style.opacity=''; });
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

    // Limpia cualquier estilo residual (fix)
    resetSheetStyles();

    drawer.classList.add('cqhdr-open');
    lockScroll(true);

    // mover RRSS al sheet
    if (social && mobSocialWrap && !mobSocialWrap.contains(social)) {
      mobSocialWrap.appendChild(social);
    }

    // focus trap
    removeTrap = focusTrap();
    closeBtn.focus({preventScroll:true});
  }

  function closeMobile(){
    drawer.classList.remove('cqhdr-open');
    lockScroll(false);

    // devolver RRSS al header
    const hdrBar = hdr.querySelector('.cqhdr-bar');
    if (hdrBar && !hdrBar.contains(social)) hdrBar.appendChild(social);

    if (removeTrap) removeTrap();
    if (lastFocused) lastFocused.focus({preventScroll:true});

    // Limpia estilos inline tras cerrar (fix)
    resetSheetStyles();
  }

  burger.addEventListener('click', e=>{
    e.stopPropagation();
    if (isMobile()){
      drawer.classList.contains('cqhdr-open') ? closeMobile() : openMobile();
    } else {
      burger.classList.contains('cqhdr-open') ? closeDesktop() : openDesktop();
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

  /* ===== Swipe-down con animación y cleanup ===== */
  let startY=0, currentY=0, dragging=false;
  const THRESH=80, MAX_PULL=140;

  sheet.addEventListener('touchstart', (e)=>{
    if (!isMobile() || !drawer.classList.contains('cqhdr-open')) return;
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

    // Restaura transiciones para resolver el gesto
    sheet.style.transition='transform 260ms var(--spring), opacity 200ms var(--ease-in-out)';
    backdrop.style.transition='opacity 200ms var(--ease-in-out)';

    if(dy > THRESH){
      // Animar salida y cerrar al final (closeMobile hace resetSheetStyles)
      requestAnimationFrame(()=>{
        sheet.style.transform='translateY(-12px)';
        sheet.style.opacity='0';
        backdrop.style.opacity='0';
        setTimeout(()=>{ closeMobile(); }, 260);
      });
    } else {
      // Volver a posición original
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
    hdr.querySelectorAll('.cqhdr-social a').forEach(a=>{
      const label = a.querySelector('.label'); if(!label) return;
      if(!supportsHover){
        a.style.setProperty('--open-w', getComputedStyle(a).getPropertyValue('--closed-w') || '32px');
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


/*  */



(() => {
  if (CSS.supports?.('selector(:has(*))')) return;
  if (!(matchMedia('(hover:hover) and (pointer:fine)').matches && innerWidth>=769)) return;
  const hdr = document.getElementById('cqhdr');
  const nav = hdr?.querySelector('.cqhdr-social');
  if (!hdr || !nav) return;
  const style = document.createElement('style');
  style.textContent = `
    .cqhdr-bar::after,.cqhdr-bar::before{opacity:0}
    #cqhdr._tint .cqhdr-bar::after,#cqhdr._tint .cqhdr-bar::before{opacity:.9}
    #cqhdr._fb .cqhdr-bar{--tint-1:var(--tint-fb-1);--tint-2:var(--tint-fb-2)}
    #cqhdr._ig .cqhdr-bar{--tint-1:var(--tint-ig-1);--tint-2:var(--tint-ig-2)}
    #cqhdr._x  .cqhdr-bar{--tint-1:var(--tint-x-1); --tint-2:var(--tint-x-2)}
    #cqhdr._tt .cqhdr-bar{--tint-1:var(--tint-tt-1);--tint-2:var(--tint-tt-2)}
    #cqhdr._th .cqhdr-bar{--tint-1:var(--tint-th-1);--tint-2:var(--tint-th-2)}
  `;
  document.head.appendChild(style);
  function clear(){ hdr.classList.remove('_tint','_fb','_ig','_x','_tt','_th'); }
  nav.addEventListener('mouseenter', ()=> hdr.classList.add('_tint'), true);
  nav.addEventListener('mouseleave', clear, true);
  nav.querySelectorAll('a[data-net]').forEach(a=>{
    a.addEventListener('mouseenter', ()=>{ clear(); hdr.classList.add('_tint','_'+a.dataset.net); });
    a.addEventListener('focus',     ()=>{ clear(); hdr.classList.add('_tint','_'+a.dataset.net); });
    a.addEventListener('blur', clear);
  });
})();