(() => {
  const HASH_OK = '#semaforo';
  const CONSENT_KEY = 'mcq_cookie_consent_session';
  if (window.location.hash !== HASH_OK) return;

  const ANIM = { modal: 260 };
  let closeTimer = null;
  const qs = (id) => document.getElementById(id);

  function injectStyles() {
    if (qs('mcq-semaforo-styles')) return;
    const style = document.createElement('style');
    style.id = 'mcq-semaforo-styles';
    style.textContent = `
      :root{ --mcq-semaforo-ease:cubic-bezier(.22,.61,.36,1); }

      #mcq-semaforo-fab{
        position:fixed; right:14px; bottom:14px; z-index:2147483644;
        width:50px; height:50px; border:1px solid rgba(255,255,255,.14); border-radius:50%;
        background:linear-gradient(180deg, rgba(255,255,255,.12), rgba(255,255,255,.05));
        color:#fff; display:flex; align-items:center; justify-content:center;
        box-shadow:0 10px 24px rgba(0,0,0,.26), inset 0 1px 0 rgba(255,255,255,.14);
        backdrop-filter:blur(18px) saturate(130%); -webkit-backdrop-filter:blur(18px) saturate(130%);
        cursor:pointer; transition:transform .22s var(--mcq-semaforo-ease), border-color .22s ease, box-shadow .22s ease;
      }
      #mcq-semaforo-fab:hover{ transform:translateY(-2px); border-color:rgba(255,255,255,.22); box-shadow:0 12px 26px rgba(0,0,0,.30), inset 0 1px 0 rgba(255,255,255,.14); }
      #mcq-semaforo-fab i{ font-size:18px; line-height:1; }

      #mcq-semaforo-modal{
        position:fixed; inset:0; z-index:2147483647; display:flex; align-items:center; justify-content:center; padding:12px;
        background:rgba(0,0,0,.58); backdrop-filter:blur(10px); -webkit-backdrop-filter:blur(10px);
        opacity:0; visibility:hidden; pointer-events:none; transition:opacity .26s var(--mcq-semaforo-ease), visibility .26s linear;
      }
      #mcq-semaforo-modal[hidden]{ display:none !important; }
      #mcq-semaforo-modal.is-open{ opacity:1; visibility:visible; pointer-events:auto; }

      .mcq-semaforo-dialog{
        position:relative; width:min(600px, calc(100vw - 40px)); border-radius:20px; background:rgba(247,247,247,.92); color:#111;
        box-shadow:0 18px 48px rgba(0,0,0,.26); border:1px solid rgba(255,255,255,.55);
        transform:translateY(12px) scale(.985); opacity:.86; transition:transform .26s var(--mcq-semaforo-ease), opacity .26s var(--mcq-semaforo-ease);
      }
      #mcq-semaforo-modal.is-open .mcq-semaforo-dialog{ transform:translateY(0) scale(1); opacity:1; }

      .mcq-semaforo-close{
        position:absolute; top:10px; right:10px; width:32px; height:32px; border:0; border-radius:50%; background:#000; color:#fff;
        display:inline-flex; align-items:center; justify-content:center; cursor:pointer; z-index:2;
        transition:transform .22s var(--mcq-semaforo-ease), opacity .22s ease;
      }
      .mcq-semaforo-close:hover{ transform:scale(1.04); opacity:.92; }
      .mcq-semaforo-close i{ font-size:13px; }

      .mcq-semaforo-head{ padding:14px 16px 5px; }
      .mcq-semaforo-brand{ display:grid; grid-template-columns:40px 1fr; gap:9px; align-items:start; padding-right:28px; }
      .mcq-semaforo-isoWrap{ width:40px; height:40px; display:flex; align-items:center; justify-content:center; }
      .mcq-semaforo-iso{ width:28px; height:28px; display:block; object-fit:contain; }
      .mcq-semaforo-brandtext h3{ margin:0 0 2px; font-size:18px; line-height:1.1; letter-spacing:-.03em; color:#000; }
      .mcq-semaforo-brandtext p{ margin:0; font-size:11px; line-height:1.42; color:rgba(0,0,0,.62); }

      .mcq-semaforo-body{ padding:3px 16px 10px; }
      .mcq-semaforo-intro{ margin:0 0 8px; font-size:11px; line-height:1.42; color:rgba(0,0,0,.70); }

      .mcq-semaforo-gridCards{ display:grid; grid-template-columns:repeat(2, minmax(0, 1fr)); gap:6px; }
      .mcq-semaforo-card{
        position:relative; border:1px solid rgba(0,0,0,.08); border-radius:12px; background:rgba(255,255,255,.60);
        box-shadow:0 6px 14px rgba(0,0,0,.04); padding:8px; overflow:hidden;
        transition:transform .22s var(--mcq-semaforo-ease), box-shadow .22s ease;
      }
      .mcq-semaforo-card:hover{ transform:translateY(-1px); box-shadow:0 8px 18px rgba(0,0,0,.06); }
      .mcq-semaforo-card::before{
        content:""; position:absolute; inset:0; pointer-events:none; background:linear-gradient(180deg, rgba(255,255,255,.18), rgba(255,255,255,0));
      }

      .mcq-semaforo-cardHead{ position:relative; z-index:1; display:grid; grid-template-columns:1fr auto; gap:6px; align-items:start; margin-bottom:6px; }
      .mcq-semaforo-cardTitle{ margin:0 0 2px; font-size:13px; line-height:1.2; font-weight:800; color:#111; }
      .mcq-semaforo-cardSub{ margin:0; font-size:10px; line-height:1.32; color:rgba(0,0,0,.56); }

      .mcq-semaforo-badge{
        display:inline-flex; align-items:center; gap:5px; padding:4px 7px; border-radius:999px; background:rgba(0,0,0,.05); border:1px solid rgba(0,0,0,.06);
        font-size:9.5px; font-weight:800; letter-spacing:.02em; white-space:nowrap; transition:transform .22s var(--mcq-semaforo-ease);
      }
      .mcq-semaforo-card:hover .mcq-semaforo-badge{ transform:translateY(-1px); }

      .mcq-semaforo-dot{ width:8px; height:8px; border-radius:50%; background:#666; box-shadow:0 0 0 2px rgba(0,0,0,.06); }
      .mcq-semaforo-dot.green{ background:#22c55e; }
      .mcq-semaforo-dot.yellow{ background:#f59e0b; }
      .mcq-semaforo-dot.red{ background:#ff3b30; }

      .mcq-semaforo-cardBody{ position:relative; z-index:1; display:grid; gap:4px; }
      .mcq-semaforo-row{
        display:grid; grid-template-columns:1fr auto; gap:6px; align-items:center; padding:5px 7px; border-radius:8px; background:rgba(255,255,255,.52); border:1px solid rgba(0,0,0,.04);
        transition:background-color .2s ease;
      }
      .mcq-semaforo-card:hover .mcq-semaforo-row{ background:rgba(255,255,255,.68); }
      .mcq-semaforo-label{ color:rgba(0,0,0,.68); font-size:10px; }
      .mcq-semaforo-value{ font-weight:800; font-size:10px; }
      .mcq-semaforo-value.ok{ color:#16a34a; }
      .mcq-semaforo-value.warn{ color:#d97706; }
      .mcq-semaforo-value.bad{ color:#dc2626; }

      .mcq-semaforo-actions{ display:grid; grid-template-columns:repeat(2, minmax(0, 1fr)); gap:7px; padding:0 16px 14px; }
      .mcq-semaforo-btn{
        appearance:none; border:none; cursor:pointer; border-radius:12px; padding:9px 14px; font-size:11.5px; font-weight:700; letter-spacing:.3px; line-height:1.2;
        transition:transform .22s var(--mcq-semaforo-ease), box-shadow .22s ease, background-color .22s ease, color .22s ease, border-color .22s ease;
      }
      .mcq-semaforo-btn:hover{ transform:translateY(-1px); }
      .mcq-semaforo-btn--primary{ background:#000; color:#fff; box-shadow:0 4px 10px rgba(0,0,0,.22); }
      .mcq-semaforo-btn--secondary{ background:rgba(255,255,255,.08); color:#000; border:1px solid rgb(0 0 0 / 100%); }

      @media (max-width: 640px){
        #mcq-semaforo-fab{ right:12px; bottom:12px; width:46px; height:46px; }
        #mcq-semaforo-fab i{ font-size:16px; }
        #mcq-semaforo-modal{ align-items:flex-end; padding:8px; }
        .mcq-semaforo-dialog{ width:100%; max-width:100%; border-radius:16px; transform:translateY(16px) scale(.992); }
        .mcq-semaforo-head{ padding:14px 12px 5px; }
        .mcq-semaforo-brand{ grid-template-columns:30px 1fr; gap:8px; padding-right:22px; }
        .mcq-semaforo-isoWrap{ width:30px; height:30px; }
        .mcq-semaforo-iso{ width:22px; height:22px; }
        .mcq-semaforo-brandtext h3{ font-size:16px; }
        .mcq-semaforo-brandtext p{ font-size:10.5px; line-height:1.32; }
        .mcq-semaforo-body{ padding:3px 12px 10px; }
        .mcq-semaforo-intro{ font-size:10.5px; line-height:1.32; }
        .mcq-semaforo-gridCards{ grid-template-columns:1fr; gap:6px; }
        .mcq-semaforo-card{ padding:9px; }
        .mcq-semaforo-cardTitle{ font-size:12.5px; }
        .mcq-semaforo-cardSub{ font-size:9.8px; line-height:1.25; }
        .mcq-semaforo-actions{ gap:6px; padding:0 12px 12px; }
        .mcq-semaforo-btn{ width:100%; min-width:0; padding:9px 10px; font-size:11px; }
        .mcq-semaforo-close{ top:8px; right:8px; width:28px; height:28px; }
        .mcq-semaforo-close i{ font-size:11px; }
      }

      @media (max-width: 420px){
        .mcq-semaforo-actions{ grid-template-columns:1fr; }
      }
    `;
    document.head.appendChild(style);
  }

  function createFab() {
    if (qs('mcq-semaforo-fab')) return;
    const btn = document.createElement('button');
    btn.id = 'mcq-semaforo-fab';
    btn.className = 'mcq-semaforo-fab';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Abrir semáforo');
    btn.innerHTML = `<i class="bi bi-activity"></i>`;
    document.body.appendChild(btn);
  }

  function createModal() {
    if (qs('mcq-semaforo-modal')) return;
    const modal = document.createElement('div');
    modal.id = 'mcq-semaforo-modal';
    modal.className = 'mcq-semaforo-modal';
    modal.hidden = true;
    modal.innerHTML = `
      <div class="mcq-semaforo-dialog" role="dialog" aria-modal="true" aria-labelledby="mcq-semaforo-title">
        <button class="mcq-semaforo-close" id="mcq-semaforo-close" aria-label="Cerrar"><i class="bi bi-x-lg"></i></button>
        <div class="mcq-semaforo-head">
          <div class="mcq-semaforo-brand">
            <div class="mcq-semaforo-isoWrap">
              <img class="mcq-semaforo-iso" src="https://cdn.mcq.cl/logo/canales-iso-black.svg" alt="CANALES">
            </div>
            <div class="mcq-semaforo-brandtext">
              <h3 id="mcq-semaforo-title">Semáforo de trackers</h3>
              <p>Valida por servicio si la data parece estarse compartiendo según carga, objeto global y tráfico observado.</p>
            </div>
          </div>
        </div>
        <div class="mcq-semaforo-body">
          <p class="mcq-semaforo-intro">Este panel solo aparece con <strong>#semaforo</strong>. Cada tracker tiene su propio estado independiente.</p>
          <div class="mcq-semaforo-gridCards" id="mcq-semaforo-list"></div>
        </div>
        <div class="mcq-semaforo-actions">
          <button class="mcq-semaforo-btn mcq-semaforo-btn--secondary" id="mcq-semaforo-refresh">Refrescar</button>
          <button class="mcq-semaforo-btn mcq-semaforo-btn--primary" id="mcq-semaforo-close-2">Cerrar</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  function openModal() {
    const modal = qs('mcq-semaforo-modal');
    if (!modal) return;
    if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
    modal.hidden = false;
    requestAnimationFrame(() => modal.classList.add('is-open'));
    renderList();
  }

  function closeModal(immediate = false) {
    const modal = qs('mcq-semaforo-modal');
    if (!modal) return;
    if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
    if (immediate) {
      modal.classList.remove('is-open');
      modal.hidden = true;
      return;
    }
    modal.classList.remove('is-open');
    closeTimer = setTimeout(() => {
      modal.hidden = true;
      closeTimer = null;
    }, ANIM.modal);
  }

  function getConsent() {
    try {
      const raw = sessionStorage.getItem(CONSENT_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function getResourceUrls() {
    try {
      return performance.getEntriesByType('resource').map(r => r.name || '');
    } catch {
      return [];
    }
  }

  function hasResourceMatch(matchers) {
    const urls = getResourceUrls();
    return urls.some(url => matchers.some(m => url.includes(m)));
  }

  function trackerState({ expected, scriptOk, globalOk, networkOk }) {
    if (!expected) return { color: 'yellow', text: 'N/A' };
    if (scriptOk && (globalOk || networkOk)) return { color: 'green', text: 'OK' };
    if (scriptOk || globalOk || networkOk) return { color: 'yellow', text: 'PARCIAL' };
    return { color: 'red', text: 'ERROR' };
  }

  function buildChecks() {
    const consent = getConsent();
    const analyticsExpected = !!(consent && consent.analytics);
    const marketingExpected = !!(consent && consent.marketing);
    return {
      consent,
      trackers: [
        { name: 'Google Analytics', sub: 'Medición y eventos', expected: analyticsExpected, scriptOk: !!qs('mcq-ga-src') && !!qs('mcq-ga-inline'), globalOk: typeof window.gtag === 'function', networkOk: hasResourceMatch(['googletagmanager.com/gtag/js','google-analytics.com/g/collect','analytics.google.com/g/collect']) },
        { name: 'Google Tag Manager', sub: 'Contenedor y tags', expected: marketingExpected, scriptOk: !!qs('mcq-gtm-inline'), globalOk: Array.isArray(window.dataLayer), networkOk: hasResourceMatch(['googletagmanager.com/gtm.js']) },
        { name: 'Meta Pixel', sub: 'Eventos y remarketing', expected: marketingExpected, scriptOk: !!qs('mcq-meta-pixel'), globalOk: typeof window.fbq === 'function', networkOk: hasResourceMatch(['connect.facebook.net','facebook.com/tr']) },
        { name: 'AdSense', sub: 'Publicidad', expected: marketingExpected, scriptOk: !!qs('mcq-adsense'), globalOk: false, networkOk: hasResourceMatch(['pagead2.googlesyndication.com/pagead/js/adsbygoogle.js','googlesyndication.com']) },
        { name: 'Cloudflare', sub: 'Analítica web', expected: analyticsExpected, scriptOk: !!qs('mcq-cloudflare'), globalOk: false, networkOk: hasResourceMatch(['static.cloudflareinsights.com/beacon.min.js','cloudflareinsights.com']) }
      ]
    };
  }

  function renderCard(item) {
    const state = trackerState(item);
    const rows = [
      ['Esperado', item.expected ? 'Sí' : 'No', item.expected ? 'ok' : 'warn'],
      ['Script', item.scriptOk ? 'Sí' : 'No', item.scriptOk ? 'ok' : 'bad'],
      ['Global', item.globalOk ? 'Sí' : 'No', item.globalOk ? 'ok' : 'warn'],
      ['Red', item.networkOk ? 'Sí' : 'No', item.networkOk ? 'ok' : 'bad']
    ];
    return `
      <article class="mcq-semaforo-card">
        <div class="mcq-semaforo-cardHead">
          <div class="mcq-semaforo-cardTitleWrap">
            <h4 class="mcq-semaforo-cardTitle">${item.name}</h4>
            <p class="mcq-semaforo-cardSub">${item.sub}</p>
          </div>
          <span class="mcq-semaforo-badge">
            <span class="mcq-semaforo-dot ${state.color}"></span>
            <span>${state.text}</span>
          </span>
        </div>
        <div class="mcq-semaforo-cardBody">
          ${rows.map(([label, value, cls]) => `
            <div class="mcq-semaforo-row">
              <span class="mcq-semaforo-label">${label}</span>
              <span class="mcq-semaforo-value ${cls}">${value}</span>
            </div>
          `).join('')}
        </div>
      </article>
    `;
  }

  function renderList() {
    const list = qs('mcq-semaforo-list');
    if (!list) return;
    const { consent, trackers } = buildChecks();

    if (!consent) {
      list.innerHTML = `
        <article class="mcq-semaforo-card">
          <div class="mcq-semaforo-cardHead">
            <div class="mcq-semaforo-cardTitleWrap">
              <h4 class="mcq-semaforo-cardTitle">Consentimiento</h4>
              <p class="mcq-semaforo-cardSub">No hay sesión activa</p>
            </div>
            <span class="mcq-semaforo-badge">
              <span class="mcq-semaforo-dot red"></span>
              <span>ERROR</span>
            </span>
          </div>
          <div class="mcq-semaforo-cardBody">
            <div class="mcq-semaforo-row">
              <span class="mcq-semaforo-label">Estado</span>
              <span class="mcq-semaforo-value bad">No hay consentimiento en sesión</span>
            </div>
          </div>
        </article>
      `;
      return;
    }

    list.innerHTML = trackers.map(renderCard).join('');
  }

  function bindEvents() {
    qs('mcq-semaforo-fab')?.addEventListener('click', openModal);
    qs('mcq-semaforo-close')?.addEventListener('click', () => closeModal());
    qs('mcq-semaforo-close-2')?.addEventListener('click', () => closeModal());
    qs('mcq-semaforo-refresh')?.addEventListener('click', renderList);
    qs('mcq-semaforo-modal')?.addEventListener('click', (e) => {
      if (e.target?.id === 'mcq-semaforo-modal') closeModal();
    });
  }

  function init() {
    injectStyles();
    createFab();
    createModal();
    bindEvents();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();