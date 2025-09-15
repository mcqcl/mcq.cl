(() => {
  const GRID = document.getElementById('mcqmad-grid');
  const IMG_BASE = "https://cdn.mcq.cl/madrid/"; // MAD001 -> MAD001.png

  // Modal refs
  const LB  = document.querySelector('.mcqmad-lb');
  const LB_IMG = document.getElementById('mcqmad-lb-img');
  const LB_TITLE = document.getElementById('mcqmad-lb-title');
  const LB_AUTHOR = document.getElementById('mcqmad-lb-author');
  const LB_LOCATION = document.getElementById('mcqmad-lb-location');
  const LB_DESC = document.getElementById('mcqmad-lb-desc');
  const LB_PAL = document.getElementById('mcqmad-lb-pal');

  // --- NUEVO: intenta leer del <script id="mcqmad-data" type="application/json">, si no hay, hace fetch ---
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

      // Fallback a fetch (p. ej. cuando no incrustas el JSON)
      const res = await fetch('https://canales.pe/coloresdemadrid/postcards.json', { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const items = Array.isArray(data) ? data : (data.postcards || data.items || []);
      if (!Array.isArray(items) || !items.length) throw new Error('Respuesta remota sin items.');
      render(items);

    } catch (err) {
      console.error('Error cargando datos:', err);
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

    // Datos para modal
    card.dataset.title = item.title || '';
    card.dataset.location = item.district || '';
    card.dataset.author = item.author || '';
    card.dataset.description = item.description || '';

    const idStr = String(item.id || '');
    const imgUrl = IMG_BASE + (idStr.endsWith('.png') ? idStr : idStr + '.png');
    card.dataset.imageFull = imgUrl;

    // Foto (aspect y posY por item)
    const aspect = item.aspect || 'var(--mcqmad-ar)';   // ej. "1000/744"
    const posY   = item.posY   || 'var(--mcqmad-pos-y)';

    const safeAlt = (item.title || idStr || '').toString().replace(/"/g,'&quot;');

    card.innerHTML = `
      <figure class="mcqmad-photo" style="aspect-ratio:${aspect}">
        <img src="${imgUrl}" alt="${safeAlt}" loading="lazy"
             style="object-position: 50% ${posY}">
        <button class="mcqmad-hover-btn" type="button" aria-label="Ver más información">+ info</button>
      </figure>

      <ul class="mcqmad-palette" aria-label="Paleta de colores">
        ${(item.palette||[]).map(h=>`<li style="--sw:${h}" title="${h}"></li>`).join('')}
      </ul>

      <div class="mcqmad-tags">
        <span class="mcqmad-tag">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M9.5 4h5l1 2H19a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3h3.5l1-2Zm2.5 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"/>
          </svg>
          ${item.author||''}
        </span>
        <span class="mcqmad-tag">
          <img src="https://upload.wikimedia.org/wikipedia/commons/9/9c/Flag_of_the_Community_of_Madrid.svg" alt="Bandera de Madrid">
          ${item.district||''}
        </span>
      </div>

      <div class="mcqmad-foot">
        <span class="mcqmad-spacer"></span>
        <button class="mcqmad-more" type="button">Más información</button>
      </div>
    `;
    return card;
  }

  function render(items){
    GRID.innerHTML = '';
    items.forEach(item => GRID.appendChild(buildCard(item)));
  }

  /* ------------ Modal ------------ */
  function openFrom(card){
    LB_IMG.src = card.dataset.imageFull || card.querySelector('img')?.src || '';
    LB_IMG.alt = card.querySelector('img')?.alt || '';
    LB_TITLE.textContent = card.dataset.title || '';
    LB_AUTHOR.textContent = card.dataset.author || '';
    LB_LOCATION.textContent = card.dataset.location || '';
    LB_DESC.textContent = card.dataset.description || '';

    LB_PAL.innerHTML = '';
    card.querySelectorAll('.mcqmad-palette li').forEach(li=>{
      const sw = document.createElement('li');
      sw.style.setProperty('--sw', getComputedStyle(li).getPropertyValue('--sw'));
      sw.title = li.title || '';
      LB_PAL.appendChild(sw);
    });

    LB.hidden = false;
    document.body.style.overflow = 'hidden';
    LB.querySelector('.mcqmad-lb-close').focus();
  }
  function closeLB(){
    LB.hidden = true;
    document.body.style.overflow = '';
    LB_IMG.src = '';
  }

  document.addEventListener('click', (e)=>{
    const btn = e.target.closest('.mcqmad-more, .mcqmad-hover-btn');
    if (btn){
      const card = btn.closest('.mcqmad-card');
      if (card) openFrom(card);
    }
    if (e.target.matches('[data-mcqmad-close]')) closeLB();
  });
  window.addEventListener('keydown', (e)=>{ if (!LB.hidden && e.key === 'Escape') closeLB() });

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
    const sw = e.target.closest('.mcqmad-lb-pal li');
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

  // go!
  loadData();
})();
