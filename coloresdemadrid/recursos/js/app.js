(() => {
  /* ====== 1) CSS INYECTADO ====== */
  function injectCSS() {
    const css = `
      /* Ocultar por [hidden] */
      .mcqmad-lb[hidden]{ display:none !important; }

      /* Overlay: negro elegante + scroll propio */
      .mcqmad-lb{
        position: fixed; inset: 0; z-index: 9999;
        background: rgba(18,18,18,0.92) !important; /* negro elegante */
        display: grid; place-items: center;
        padding: 16px;
        overflow: auto;
        overscroll-behavior: contain;
        -webkit-overflow-scrolling: touch;
        backdrop-filter: blur(4px);
      }

      /* Dialog (si existe la clase) */
      .mcqmad-lb .mcqmad-lb-dialog{
        width: min(900px, 100%);
        max-height: calc(100dvh - 32px);
        background: #121212 !important;
        color: #F5F5F7 !important;
        border-radius: 16px;
        border: 1px solid rgba(255,255,255,0.08);
        box-shadow: 0 10px 30px rgba(0,0,0,.35);
        display: grid; grid-template-rows: auto 1fr;
        overflow: hidden;
      }

      /* Si NO existe .mcqmad-lb-dialog, estiliza primer hijo */
      .mcqmad-lb > :first-child{
        width: min(900px, 100%);
        max-height: calc(100dvh - 32px);
        background: #121212 !important;
        color: #F5F5F7 !important;
        border-radius: 16px;
        border: 1px solid rgba(255,255,255,0.08);
        box-shadow: 0 10px 30px rgba(0,0,0,.35);
        overflow: hidden;
      }

      /* Cuerpo desplazable */
      .mcqmad-lb .mcqmad-lb-body{
        overflow: auto; -webkit-overflow-scrolling: touch;
        padding: 16px;
      }
      .mcqmad-lb .mcqmad-lb-dialog > :last-child,
      .mcqmad-lb > :first-child > :last-child{
        overflow: auto; -webkit-overflow-scrolling: touch;
        padding: 16px;
      }

      /* Tipografía dentro del modal */
      .mcqmad-lb h1,.mcqmad-lb h2,.mcqmad-lb h3,
      .mcqmad-lb p,.mcqmad-lb span,.mcqmad-lb li,
      .mcqmad-lb .mcqmad-meta{ color:#F5F5F7 !important; }

      /* === GRID: 1 / 2 / 3 columnas por breakpoint === */
      #mcqmad-grid{
        display: grid;
        grid-template-columns: 1fr;              /* móvil: 1 col */
        gap: 16px;
        align-content: start;
        justify-content: stretch;                /* evita huecos raros */
        margin: 0 auto;
        max-width: 1320px;                       /* ancho contenedor */
        padding: 12px;
      }
      @media (min-width: 600px){
        #mcqmad-grid{ grid-template-columns: repeat(2, minmax(0,1fr)); }  /* tablet: 2 cols */
      }
      @media (min-width: 992px){
        #mcqmad-grid{ grid-template-columns: repeat(3, minmax(0,1fr)); }  /* desktop: 3 cols */
      }

      /* Tarjeta con colores fijos (igual en desktop y responsive) */
      .mcqmad-card{
        display:flex; flex-direction:column;
        background:#fff; color:#111;             /* colores fijos */
        border-radius:14px; overflow:hidden;
        box-shadow:0 2px 8px rgba(0,0,0,.08);
        min-width:0;                             /* evita overflow en grid */
      }
      .mcqmad-photo{ margin:0; }
      .mcqmad-photo img{ width:100%; height:100%; object-fit:cover; display:block; }

      /* Paleta */
      .mcqmad-palette{ display:flex; gap:6px; padding:10px 12px; margin:0; list-style:none; }
      .mcqmad-palette li{ width:18px; height:18px; border-radius:6px; background: var(--sw,#eee); cursor:pointer; }

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

    /* Override explícito por si hay CSS previo en caché que gane especificidad */
    const override = `
      @media (min-width: 992px){
        #mcqmad-grid{
          grid-template-columns: repeat(3, minmax(0,1fr)) !important;
          justify-content: stretch !important;
        }
      }
    `;
    let style2 = document.getElementById('mcqmad-override');
    if (!style2) {
      style2 = document.createElement('style');
      style2.id = 'mcqmad-override';
      document.head.appendChild(style2);
    }
    style2.textContent = override;
  }

  /* ====== 2) BODY LOCK ====== */
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

  /* ====== 3) Asegurar estructura del modal ====== */
  const LB  = document.querySelector('.mcqmad-lb');
  function ensureModalStructure(){
    if(!LB) return;
    const dlg = LB.firstElementChild;
    if (dlg && !dlg.classList.contains('mcqmad-lb-dialog')) {
      dlg.classList.add('mcqmad-lb-dialog');
    }
    const body = dlg?.querySelector('.mcqmad-lb-body') || dlg?.lastElementChild || dlg;
    if (body && !body.classList.contains('mcqmad-lb-body')) {
      body.classList.add('mcqmad-lb-body');
    }
  }

  /* ====== 4) LÓGICA ====== */
  const GRID = document.getElementById('mcqmad-grid');
  const IMG_BASE = "https://cdn.mcq.cl/madrid/";
  const LB_IMG = document.getElementById('mcqmad-lb-img');
  const LB_TITLE = document.getElementById('mcqmad-lb-title');
  const LB_AUTHOR = document.getElementById('mcqmad-lb-author');
  const LB_LOCATION = document.getElementById('mcqmad-lb-location');
  const LB_DESC = document.getElementById('mcqmad-lb-desc');
  const LB_PAL = document.getElementById('mcqmad-lb-pal');

  async function loadData() {
    try {
      const emb = document.getElementById('mcqmad-data');
      if (emb && emb.textContent.trim().length) {
        const parsed = JSON.parse(emb.textContent);
        const items = Array.isArray(parsed) ? parsed : (parsed.postcards || []);
        if (!Array.isArray(items) || !items.length) throw new Error('JSON embebido sin items.');
        render(items);
        return;
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

  function buildCard(item){
    const card = document.createElement('article');
    card.className = 'mcqmad-card';
    card.dataset.id = item.id;
    if (item.size) card.dataset.size = item.size;
    card.dataset.title = item.title || '';
    card.dataset.location = item.district || '';
    card.dataset.author = item.author || '';
    card.dataset.description = item.description || '';
    const idStr = String(item.id || '');
    const imgUrl = IMG_BASE + (idStr.endsWith('.png') ? idStr : idStr + '.png');
    card.dataset.imageFull = imgUrl;
    const aspect = item.aspect || 'var(--mcqmad-ar)';
    const posY   = item.posY   || 'var(--mcqmad-pos-y)';
    const safeAlt = (item.title || idStr || '').toString().replace(/"/g,'&quot;');
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
        <span class="mcqmad-tag">
          <img src="https://upload.wikimedia.org/wikipedia/commons/9/9c/Flag_of_the_Community_of_Madrid.svg" alt="Bandera de Madrid" width="16" height="12" style="vertical-align:middle">
          ${item.district||''}
        </span>
      </div>
      <div class="mcqmad-foot">
        <span class="mcqmad-spacer"></span>
        <button class="mcqmad-more" type="button">Más información</button>
      </div>`;
    return card;
  }

  function render(items){
    if(!GRID) return;
    GRID.innerHTML = '';
    items.forEach(item => GRID.appendChild(buildCard(item)));
  }

  /* ------------ Modal ------------ */
  function openFrom(card){
    if(!LB) return;
    ensureModalStructure(); // asegura clases internas
    if (LB_IMG){
      LB_IMG.src = card.dataset.imageFull || card.querySelector('img')?.src || '';
      LB_IMG.alt = card.querySelector('img')?.alt || '';
    }
    if (LB_TITLE)    LB_TITLE.textContent    = card.dataset.title || '';
    if (LB_AUTHOR)   LB_AUTHOR.textContent   = card.dataset.author || '';
    if (LB_LOCATION) LB_LOCATION.textContent = card.dataset.location || '';
    if (LB_DESC)     LB_DESC.textContent     = card.dataset.description || '';
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

  document.addEventListener('click', (e)=>{
    const btn = e.target.closest('.mcqmad-more, .mcqmad-hover-btn');
    if (btn){
      const card = btn.closest('.mcqmad-card');
      if (card) openFrom(card);
    }
    if (e.target.matches('[data-mcqmad-close]')) closeLB();
  });
  window.addEventListener('keydown', (e)=>{ if (!LB?.hidden && e.key === 'Escape') closeLB() });

  /* ------------ Copiar HEX ------------ */
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

  /* go! */
  injectCSS();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadData, { once:true });
  } else {
    loadData();
  }
})();
