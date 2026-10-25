(() => {
  'use strict';
  const sections = ['mcq-hero','mcq-about','mcq-stats','mcq-services','mcq-portfolio','mcq-publications','mcq-faq','mcq-contact'];
  const known = new Set(sections);

  // Delegación: enlaces accesibles mediante mouse o teclado, sin fragmentos en la URL.
  document.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    const id = decodeURIComponent(link.getAttribute('href').slice(1));
    if (!known.has(id)) return;
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
    if (location.hash) history.replaceState(history.state,'',location.pathname+location.search);
  });

  // Marca la sección activa únicamente en las dos listas de navegación.
  const navs = [...document.querySelectorAll('#mcqhdr-panel .mcqhdr-links a, #mcq-footer .mcqfoot-navigation a')];
  const updateActive = () => {
    const threshold = window.innerHeight * .36;
    let active = sections[0];
    for (const id of sections) {
      const node=document.getElementById(id);
      if (node && node.getBoundingClientRect().top <= threshold) active=id;
    }
    for (const link of navs) {
      const current = link.getAttribute('href') === '#' + active;
      link.classList.toggle('mcqnav-active', current);
      if (current) link.setAttribute('aria-current','location');
      else link.removeAttribute('aria-current');
    }
  };
  let queued=false;
  addEventListener('scroll', () => {
    if (queued) return;
    queued=true;
    requestAnimationFrame(()=>{queued=false;updateActive();});
  }, {passive:true});
  addEventListener('resize',updateActive,{passive:true});
  updateActive();
})();
