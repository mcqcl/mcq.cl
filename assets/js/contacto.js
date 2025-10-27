(() => {
  const hub = document.getElementById('cq-hub');
  if(!hub) return;

  /* Estado + reloj (America/Lima) */
  const box = hub.querySelector('.cq-hub-status');
  const txt = hub.querySelector('.cq-hub-status-text');
  function tick(){
    try{
      const tz='America/Lima';
      const now = new Date(new Date().toLocaleString('en-US',{timeZone:tz}));
      const h  = now.getHours();
      const hh = String(h).padStart(2,'0');
      const mm = String(now.getMinutes()).padStart(2,'0');
      const ss = String(now.getSeconds()).padStart(2,'0');
      let state='off', label='Fuera de horario';
      if(h>=9 && h<20){ state='ok'; label='Disponible ahora'; }
      else if(h>=20 && h<22){ state='later'; label='Respondo más tarde'; }
      box.classList.remove('ok','later','off'); box.classList.add(state);
      txt.textContent = `${label} · ${hh}:${mm}:${ss}`;
    }catch(e){}
  }
  tick(); setInterval(tick, 1000);

  /* Copiar (correo) */
  hub.addEventListener('click', async (ev)=>{
    const hit = ev.target.closest('[data-copy]'); if(!hit) return;
    const val = hit.getAttribute('data-copy');
    try{ await navigator.clipboard.writeText(val); toast(hit.getAttribute('data-toast') || ('Copiado: ' + val)); }
    catch{ toast('Copiado'); }
  });

  /* ALT+click en enlaces = copiar valor visible (sin abrir) */
  hub.addEventListener('click', async (ev)=>{
    const a = ev.target.closest('.cq-card a.cq-card-hit'); if(!a || !ev.altKey) return;
    ev.preventDefault();
    const value = a.parentElement.querySelector('.cq-val')?.textContent?.trim() || a.href;
    try{ await navigator.clipboard.writeText(value); toast('Copiado: ' + value); }
    catch{ toast('Copiado'); }
  });

  /* Ripple suave */
  hub.addEventListener('click', (ev)=>{
    const el = ev.target.closest('[data-ripple]'); if(!el) return;
    const r = el.getBoundingClientRect(), s = Math.max(r.width, r.height);
    const x = ev.clientX - r.left - s/2, y = ev.clientY - r.top - s/2;
    const span = document.createElement('span');
    span.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:${s}px;height:${s}px;border-radius:50%;background:currentColor;opacity:.18;transform:scale(0);pointer-events:none;transition:transform .6s ease,opacity .6s ease;`;
    el.style.position='relative'; el.style.overflow='hidden';
    el.appendChild(span);
    requestAnimationFrame(()=>{ span.style.transform='scale(14)'; span.style.opacity='0'; });
    setTimeout(()=> span.remove(), 650);
  });

  function toast(msg){
    const el = hub.querySelector('.cq-toast'); if(!el) return;
    el.textContent = msg;
    el.classList.add('is-show');
    clearTimeout(toast._t);
    toast._t = setTimeout(()=> el.classList.remove('is-show'), 1700);
  }
})();