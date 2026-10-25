
(() => {
  const header = document.getElementById('mcq-header');
  const menu = header.querySelector('.mcqhdr-menu');
  const logo = header.querySelector('.mcqhdr-brand');
  const panel = header.querySelector('.mcqhdr-panel');
  let open = false;
  const refresh = () => header.classList.toggle('mcqhdr-compact', window.scrollY > 90 && !open);
  function toggle(value) {
    open = value;
    header.classList.toggle('mcqhdr-open', open);
    document.body.classList.toggle('mcqhdr-locked', open);
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    menu.querySelector('i').className = open ? 'bi bi-x-lg' : 'bi bi-list';
    panel.inert = !open;
    refresh();
    if (open) header.classList.remove('mcqhdr-compact');
  }
  menu.addEventListener('click', () => toggle(!open));
  logo.addEventListener('click', e => {
    if (open || header.classList.contains('mcqhdr-compact')) {
      e.preventDefault(); toggle(!open);
    }
  });
  panel.querySelectorAll('.mcqhdr-links a').forEach(a => a.addEventListener('click', () => toggle(false)));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && open) { toggle(false); menu.focus(); }
  });
  window.addEventListener('scroll', refresh, { passive:true });
  refresh();
})();
