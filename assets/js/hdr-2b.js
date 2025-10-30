(() => {
  if (CSS.supports?.('selector(:has(*))')) return;
  if (!(matchMedia('(hover:hover) and (pointer:fine)').matches && innerWidth>=769)) return;
  const hdr = document.getElementById('mcqhdr');
  const nav = hdr?.querySelector('.mcqhdr-social');
  if (!hdr || !nav) return;
  const style = document.createElement('style');
  style.textContent = `
    .mcqhdr-bar::after,.mcqhdr-bar::before{opacity:0}
    #mcqhdr._tint .mcqhdr-bar::after,#mcqhdr._tint .mcqhdr-bar::before{opacity:.9}
    #mcqhdr._fb .mcqhdr-bar{--tint-1:var(--tint-fb-1);--tint-2:var(--tint-fb-2)}
    #mcqhdr._ig .mcqhdr-bar{--tint-1:var(--tint-ig-1);--tint-2:var(--tint-ig-2)}
    #mcqhdr._x  .mcqhdr-bar{--tint-1:var(--tint-x-1); --tint-2:var(--tint-x-2)}
    #mcqhdr._tt .mcqhdr-bar{--tint-1:var(--tint-tt-1);--tint-2:var(--tint-tt-2)}
    #mcqhdr._th .mcqhdr-bar{--tint-1:var(--tint-th-1);--tint-2:var(--tint-th-2)}
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