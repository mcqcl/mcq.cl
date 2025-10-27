(() => {
  const body = document.body;
  const cards = document.querySelectorAll('.env-card');
  const modals = document.querySelectorAll('.env-modal');

  let lastFocus = null;

  function openModal(modal, trigger){
    lastFocus = trigger;
    modal.hidden = false;
    requestAnimationFrame(()=> modal.classList.add('open'));
    body.style.overflow = 'hidden';
    // foco al botón cerrar
    modal.querySelector('.env-close').focus();
    trapFocus(modal);
  }

  function closeModal(modal){
    modal.classList.remove('open');
    body.style.overflow = '';
    setTimeout(()=> { modal.hidden = true; }, 220);
    if (lastFocus) lastFocus.focus();
  }

  // abrir desde tarjetas
  cards.forEach(card=>{
    const trigger = card.querySelector('.env-plus');
    const target = document.querySelector(card.dataset.modal);
    trigger.addEventListener('click', ()=> openModal(target, trigger));
  });

  // cerrar (X / backdrop / ESC)
  modals.forEach(m=>{
    m.querySelector('.env-close').addEventListener('click', ()=> closeModal(m));
    m.addEventListener('click', (e)=> { if (e.target.classList.contains('env-backdrop')) closeModal(m); });
  });
  window.addEventListener('keydown', (e)=>{
    if (e.key === 'Escape') {
      document.querySelectorAll('.env-modal.open').forEach(m=> closeModal(m));
    }
  });

  // focus trap simple
  function trapFocus(root){
    const selectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const f = [...root.querySelectorAll(selectors)].filter(el=> !el.hasAttribute('disabled'));
    if (!f.length) return;
    const first = f[0], last = f[f.length-1];
    root.addEventListener('keydown', (e)=>{
      if (e.key !== 'Tab') return;
      if (e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
    }, { once:false });
  }
})();