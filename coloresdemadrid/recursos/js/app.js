(() => {
  /* ===================== 0) CONFIG ===================== */
  const IMG_BASE = "https://cdn.mcq.cl/madrid/"; // MAD001 -> MAD001.png

  /* ===================== 1) CSS (no toca .mcqmad-card) ===================== */
  function injectCSS() {
    const css = `
      /* Overlay (solo al modal) */
      .mcqmad-lb[hidden]{ display:none !important; }
      .mcqmad-lb{
        position: fixed; inset: 0; z-index: 9999;
        background: rgba(18,18,18,0.92); /* negro elegante */
        display: grid; place-items: center;
        padding: 16px;
        overflow: auto;
        overscroll-behavior: contain;
        -webkit-overflow-scrolling: touch;
        backdrop-filter: blur(4px);
      }
      /* Panel interno del modal (si existe) */
      .mcqmad-lb .mcqmad-lb-dialog{
        width: min(900px, 100%);
        max-height: calc(100dvh - 32px);
        background: #121212;
        color: #F5F5F7;
        border-radius: 16px;
        border: 1px solid rgba(255,255,255,0.08);
        box-shadow: 0 10px 30px rgba(0,0,0,.35);
        display: grid; grid-template-rows: auto 1fr;
        overflow: hidden;
      }
      /* Cuerpo scrollable si existe */
      .mcqmad-lb .mcqmad-lb-body{
        overflow: auto; -webkit-overflow-scrolling: touch;
        padding: 16px;
      }
      /* Tipografía dentro del modal (sólo modal) */
      .mcqmad-lb h1,.mcqmad-lb h2,.mcqmad-lb h3,
      .mcqmad-lb p,.mcqmad-lb span,.mcqmad-lb li,
      .mcqmad-lb .mcqmad-meta{ color:#F5F5F7; }

      /* Grid: 1/2/3 columnas — NO tocamos estilos de la card */
      #mcqmad-grid{
        display: grid;
        grid-template-columns: 1fr;       /* móvil */
        gap: 16px;
        align-content: start;
        justify-content: stretch;
        margin: 0 auto;
        max-width: 1320px;
        padding: 12px;
      }
      @media (min-width: 600px){
        #mcqmad-grid{ grid-template-columns: repeat(2, minmax(0,1fr)); } /* tablet */
      }
      @media (min-width: 992px){
        #mcqmad-grid{ grid-template-columns: repeat(3, minmax(0,1fr)); } /* desktop */
      }

      /* Toast */
      .mcqmad-toast{
        position: fixed; left:50%; bottom:18px; transform:translateX(-50%) translateY(8px);
        background:#111; color:#fff; padding:10px 14px; border-radius:10px;
        opacity:0; pointer-events:none; transition:opacity .25s, transform .25s;
        z-index:10000; font:600 14px/1.2 system-ui, -apple-system, Segoe UI, Roboto, Arial;
      }
      .mcqmad-toast.mcqmad-toast--show{ opacity:1; transform:translateX(-50%) translateY(0); }
    `.trim();

    let style = document.getElementById('mcqmad-style');
    if (!style) {
      style = document.createElement('style');
      style.id = 'mcqmad-style';
      document.head.appendChild(style);
    }
    style.textContent = css;
  }

  /* ===================== 2) BODY LOCK ===================== */
  let __scrollY = 0;
  function lockBody(){
    __scrollY = window.scrollY || document.documentElement.scrollTop || 0;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${__scrollY}px`;
    document.body.style.width = '100%';
  }
  function unlockBody(){
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo(0, __scrollY);
  }

  /* ===================== 3) MODAL: elegir UNO y referenciar ===================== */
  let LB, LB_IMG, LB_TITLE, LB_AUTHOR, LB_LOCATION, LB_DESC, LB_PAL;

  // Elige el mejor modal (el que tenga más elementos requeridos) y elimina el resto
  function pickSingleModal(){
    const modals = Array.from(document.querySelectorAll('.mcqmad-lb'));
    if (!modals.length) return null;

    function scoreModal(el){
      let s = 0;
      if (el.querySelector('#mcqmad-lb-img')) s++;
      if (el.querySelector('#mcqmad-lb-title')) s++;
      if (el.querySelector('#mcqmad-lb-author')) s++;
      if (el.querySelector('#mcqmad-lb-location')) s++;
      if (el.querySelector('#mcqmad-lb-desc')) s++;
      if (el.querySelector('#mcqmad-lb-pal')) s++;
      return s;
    }

    // Selecciona el de mayor score (si empata, el primero)
    let best = modals[0], bestScore = scoreModal(best);
    for (let i = 1; i < modals.length; i++) {
      const sc = scoreModal(modals[i]);
      if (sc > bestScore) { best = modals[i]; bestScore = sc; }
    }
    // Elimina los demás para evitar "modal doble"
    modals.forEach(m => { if (m !== best) m.remove(); });

    return best;
  }

  function refreshModalRefs(){
    LB  = document.querySelector('.mcqmad-lb') || null;
    if (!LB) return;
    // Referencias **dentro** del modal elegido
    LB_IMG      = LB.querySelector('#mcqmad-lb-img') || null;
    LB_TITLE    = LB.querySelector('#mcqmad-lb-title') || null;
    LB_AUTHOR   = LB.querySelector('#mcqmad-lb-author') || null;
    LB_LOCATION = LB.querySelector('#mcqmad-lb-location') || null;
    LB_DESC     = LB.querySelector('#mcqmad-lb-desc') || null;
    LB_PAL      = LB.querySelector('#mcqmad-lb-pal') || null;
  }

  /* ===================== 4) DATA + RENDER (NO tocamos estilos de la card) ===================== */
  const GRID = document.getElementById('mcqmad-grid');

  async function loadData() {
    try {
      const emb = document.getElementById('mcqmad-data');
      if (emb && emb.textContent.trim().length) {
        const parsed = JSON.parse(emb.textContent);
        const items = Array.isArray(parsed) ? parsed : (parsed.postcards || []);
        if (!Array.isArray(items) || !items.length) throw new Error('JSON embebido sin items.');
        render(items); return;
      }
      const res = await fetch('https://canales.pe/coloresdemadrid/postcards.json', { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const items = Array.isArray(data) ? data : (data.postcards || data.items || []);
      if (!Array.isArray(items) || !items.length) throw new Error('Respuesta remota sin items.');
      render(items);
    } catch (err) {
      console.error('Error cargando datos:', err);
      if(!GRID) return;
      GRID.innerHTML = `
        <div style="padding:12px;border:1px solid #e5ebf2;border-radius:12px;background:#fff;color:#c00;font-weight:700">
          No se pudieron cargar los datos (${String(err).replace(/[<>&]/g,'')}).<br>
          Sugerencia: incrusta el JSON en el HTML con
          <code>&lt;script id="mcqmad-data" type="application/json"&gt;...&lt;/script&gt;</code>
          o sirve el JSON desde el mismo origen.
        </div>`;
    }
  }

  // NO cambiamos estructura/estilos internos de la card; solo generamos su HTML
  function buildCard(item){
    const card = document.createElement('article');
    card.className = 'mcqmad-card';
    card.dataset.id = item.id;

    // Datos para el modal (OJO: NO guardamos distrito en dataset para no mostrarlo en modal)
    card.dataset.title = item.title || '';
    card.dataset.author = item.author || '';
    card.dataset.description = item.description || '';

    const idStr = String(item.id || '');
    const imgUrl = IMG_BASE + (idStr.endsWith('.png') ? idStr : idStr + '.png');
    card.dataset.imageFull = imgUrl;

    const aspect = item.aspect || 'var(--mcqmad-ar)';
    const posY   = item.posY   || 'var(--mcqmad-pos-y)';
    const safeAlt = (item.title || idStr || '').toString().replace(/"/g,'&quot;');

    const district = item.district || ''; // se muestra en la card, no en modal

    card.innerHTML = `
      <figure class="mcqmad-photo" style="aspect-ratio:${aspect}">
        <img src="${imgUrl}" alt="${safeAlt}" loading="lazy" style="object-position:50% ${posY}">
        <button class="mcqmad-hover-btn" type="button" aria-label="Ver más información">+ info</button>
      </figure>

      <ul class="mcqmad-palette" aria-label="Paleta de colores">
        ${(item.palette||[]).map(h=>`<li style="--sw:${h}" title="${h}"></li>`).join('')}
      </ul>

      <div class="mcqmad-tags">
        <span class="mcqmad-tag">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="16" height="16">
            <path d="M9.5 4h5l1 2H19a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3h3.5l1-2Zm2.5 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"/>
          </svg>
          ${item.author||''}
        </span>
        ${district ? `
        <span class="mcqmad-tag">
          <img src="https://upload.wikimedia.org/wikipedia/commons/9/9c/Flag_of_the_Community_of_Madrid.svg" alt="Bandera de Madrid" width="16" height="12" style="vertical-align:middle">
          ${district}
        </span>` : ``}
      </div>

      <div class="mcqmad-foot">
        <span class="mcqmad-spacer"></span>
        <button class="mcqmad-more" type="button">Más información</button>
      </div>
    `;
    return card;
  }

  function render(items){
    if(!GRID) return;
    GRID.innerHTML = '';
    items.forEach(item => GRID.appendChild(buildCard(item)));
  }

  /* ===================== 5) MODAL: abrir/cerrar ===================== */
  function openFrom(card){
    if(!LB) return;

    // Si por alguna razón aparece otro modal (AJAX, SPA, etc.), volvemos a elegir el "mejor"
    if (document.querySelectorAll('.mcqmad-lb').length > 1) {
      LB = pickSingleModal();
      refreshModalRefs();
      if(!LB) return;
    }

    // Setear contenido (sin distrito)
    if (LB_IMG){
      LB_IMG.src = card.dataset.imageFull || card.querySelector('img')?.src || '';
      LB_IMG.alt = card.querySelector('img')?.alt || '';
    }
    if (LB_TITLE)   LB_TITLE.textContent   = card.dataset.title || '';
    if (LB_AUTHOR)  LB_AUTHOR.textContent  = card.dataset.author || '';
    if (LB_DESC)    LB_DESC.textContent    = card.dataset.description || '';

    // Ocultar campo de distrito en modal
    if (LB_LOCATION){
      LB_LOCATION.textContent = '';
      LB_LOCATION.style.display = 'none';
    }

    // Paleta
    if (LB_PAL){
      LB_PAL.innerHTML = '';
      card.querySelectorAll('.mcqmad-palette li').forEach(li=>{
        const sw = document.createElement('li');
        sw.style.setProperty('--sw', getComputedStyle(li).getPropertyValue('--sw'));
        sw.title = li.title || '';
        LB_PAL.appendChild(sw);
      });
    }

    LB.hidden = false;
    lockBody();
    LB.querySelector('.mcqmad-lb-close')?.focus();
  }

  function closeLB(){
    if(!LB) return;
    LB.hidden = true;
    unlockBody();
    if (LB_IMG) LB_IMG.src = '';
  }

  /* ===================== 6) Eventos ===================== */
  document.addEventListener('click', (e)=>{
    const btn = e.target.closest('.mcqmad-more, .mcqmad-hover-btn');
    if (btn){
      const card = btn.closest('.mcqmad-card');
      if (card) openFrom(card);
    }
    if (e.target.matches('[data-mcqmad-close]')) closeLB();
  });
  window.addEventListener('keydown', (e)=>{ if (!LB?.hidden && e.key === 'Escape') closeLB() });

  /* ===================== 7) Copiar HEX ===================== */
  function rgbToHex(rgb){
    const m = rgb.match(/\d+/g); if(!m) return '';
    const [r,g,b] = m.map(Number);
    const toHex = v => v.toString(16).padStart(2,'0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
  }
  let toastEl;
  function toast(msg, ms=1600){
    if(!toastEl){ toastEl = document.createElement('div'); toastEl.className='mcqmad-toast'; document.body.appendChild(toastEl); }
    toastEl.textContent = msg;
    toastEl.classList.add('mcqmad-toast--show');
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(()=>toastEl.classList.remove('mcqmad-toast--show'), ms);
  }
  document.addEventListener('click', async (e)=>{
    const sw = e.target.closest('#mcqmad-lb-pal li, .mcqmad-lb-pal li');
    if(!sw) return;
    const cs = getComputedStyle(sw);
    let hex = cs.getPropertyValue('--sw').trim();
    if(!/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(hex)){
      hex = rgbToHex(cs.backgroundColor);
    }
    try{ await navigator.clipboard.writeText(hex); toast(`Código HEX copiado: ${hex}`); }
    catch{
      const ta=document.createElement('textarea'); ta.value=hex; document.body.appendChild(ta);
      ta.select(); document.execCommand('copy'); ta.remove();
      toast(`Código HEX copiado: ${hex}`);
    }
  });

  /* ===================== 8) go! ===================== */
  injectCSS();

  // Elegimos y fijamos un solo modal
  LB = pickSingleModal();
  refreshModalRefs();

  // Carga de datos
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadData, { once:true });
  } else {
    loadData();
  }
})();
