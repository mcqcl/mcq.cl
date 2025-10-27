(() => {
  const hdr    = document.getElementById('cqhdr');
  const burger = document.getElementById('cqhdr-burger');
  const drawer = document.getElementById('cqhdr-mob');
  const pill   = burger?.querySelector('.cqhdr-pill');

  // Social: mover entre header ↔ menú móvil, sin clonar
  const social  = hdr?.querySelector('.cqhdr-social');
  const mobList = drawer?.querySelector('.cqhdr-mob-list');

  if (!hdr || !burger || !drawer || !social || !mobList) return;

  const originalParent = social.parentElement;
  const originalNext   = social.nextSibling;
  const placeholder    = document.createComment('cqhdr-social-placeholder');

  const atTop    = () => window.scrollY <= 0;
  const isMobile = () => window.matchMedia('(max-width:768px)').matches;

  function applyBodyOffset(){
    const h = hdr.offsetHeight;
    document.documentElement.style.setProperty('--cqhdr-hdr-offset', h + 'px');
  }

  function measurePillWidth(){
    if (!pill) return;
    const content = pill.scrollWidth;
    const root  = getComputedStyle(document.documentElement);
    const padx  = parseInt(root.getPropertyValue('--cqhdr-padx')) || 16;
    const maxV  = parseInt(root.getPropertyValue('--cqhdr-pill-max')) || 700;
    const target = Math.min(content + 16, Math.min(maxV, window.innerWidth - (padx * 2)));
    burger.style.setProperty('--cqhdr-pill-target', target + 'px');
  }

  // Header density
  const setDense = dense => {
    hdr.classList.toggle('cqhdr-is-dense', dense);
    applyBodyOffset();
  };
  addEventListener('scroll', () => {
    if (atTop()) { setDense(false); return; }
    setDense(true);
  }, { passive:true });

  // Toggle menú
  function openDesktop(){
    burger.classList.add('cqhdr-open');
    const bars = burger.querySelectorAll('.cqhdr-bars span');
    if (bars[0]) bars[0].style.transform = 'translateY(8px) rotate(45deg)';
    if (bars[1]) bars[1].style.opacity   = '0';
    if (bars[2]) bars[2].style.transform = 'translateY(-8px) rotate(-45deg)';
    measurePillWidth();
  }
  function closeDesktop(){
    burger.classList.remove('cqhdr-open');
    burger.style.removeProperty('--cqhdr-pill-target');
    burger.querySelectorAll('.cqhdr-bars span').forEach(b => { b.style.transform=''; b.style.opacity=''; });
  }
  function openMobile(){ drawer.classList.add('cqhdr-open'); }
  function closeMobile(){ drawer.classList.remove('cqhdr-open'); }

  function toggleMenu(e){
    e.stopPropagation();
    if (isMobile()){
      drawer.classList.contains('cqhdr-open') ? closeMobile() : openMobile();
    } else {
      burger.classList.contains('cqhdr-open') ? closeDesktop() : openDesktop();
    }
  }
  burger.addEventListener('click', toggleMenu);

  // Cierre por click fuera / ESC
  document.addEventListener('click', (e)=>{
    if (!hdr.contains(e.target) && !drawer.contains(e.target)) { closeDesktop(); closeMobile(); }
  });
  document.addEventListener('keydown', (e)=>{ if (e.key === 'Escape') { closeDesktop(); closeMobile(); } });

  // RRSS: mover según viewport (sin clonar)
  let mobWrapper = null;

  function ensureMobWrapper(){
    if (!mobWrapper){
      mobWrapper = document.createElement('div');
      mobWrapper.setAttribute('data-cqhdr-social-wrapper','');
      mobWrapper.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:.8rem;margin:12px 0;';
    }
    if (!mobWrapper.isConnected) mobList.appendChild(mobWrapper);
  }

  function moveSocialToMobile(){
    if (!placeholder.parentNode) originalParent.insertBefore(placeholder, originalNext);
    ensureMobWrapper();
    social.classList.add('in-drawer');           // fuerza visibilidad en CSS
    mobWrapper.appendChild(social);
  }

  function moveSocialToDesktop(){
    social.classList.remove('in-drawer');
    if (placeholder.parentNode){
      placeholder.parentNode.insertBefore(social, placeholder);
      placeholder.remove();
    } else {
      originalParent.appendChild(social);
    }
    if (mobWrapper && !mobWrapper.querySelector('.cqhdr-social') && mobWrapper.parentNode){
      mobWrapper.parentNode.removeChild(mobWrapper);
      mobWrapper = null;
    }
  }

  function placeSocialForViewport(){
    if (isMobile()){
      if (!mobWrapper || social.parentElement !== mobWrapper) moveSocialToMobile();
    } else {
      if (social.parentElement !== originalParent) moveSocialToDesktop();
    }
  }

  // Resize/orientation
  const onResize = () => {
    placeSocialForViewport();
    applyBodyOffset();
    if (burger.classList.contains('cqhdr-open') && !isMobile()) measurePillWidth();
  };

  window.addEventListener('load', () => { placeSocialForViewport(); applyBodyOffset(); });
  window.addEventListener('resize', onResize, { passive:true });
  window.addEventListener('orientationchange', () => setTimeout(onResize, 160));
})();