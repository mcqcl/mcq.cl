
(() => {
  const HASH_OK = '#semaforo';
  const HOST_ID = 'mcq-semaforo-host-shadow';
  if (window.location.hash !== HASH_OK) return;

  let shadow = null;

  function qs(id) {
    return shadow ? shadow.getElementById(id) : null;
  }

  function getConsent() {
    try {
      const raw = sessionStorage.getItem('mcq_cookie_consent_session');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function ensureShadow() {
    if (shadow) return;
    let host = document.getElementById(HOST_ID);
    if (!host) {
      host = document.createElement('div');
      host.id = HOST_ID;
      host.style.position = 'fixed';
      host.style.inset = '0';
      host.style.zIndex = '2147483647';
      host.style.pointerEvents = 'none';
      document.body.appendChild(host);
    }
    shadow = host.shadowRoot || host.attachShadow({ mode: 'open' });
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
        { name: 'Google Analytics', sub: 'Medición y eventos', expected: analyticsExpected, scriptOk: !!document.getElementById('mcq-ga-src') && !!document.getElementById('mcq-ga-inline'), globalOk: typeof window.gtag === 'function', networkOk: hasResourceMatch(['googletagmanager.com/gtag/js','google-analytics.com/g/collect','analytics.google.com/g/collect']) },
        { name: 'Google Tag Manager', sub: 'Contenedor y tags', expected: marketingExpected, scriptOk: !!document.getElementById('mcq-gtm-inline'), globalOk: Array.isArray(window.dataLayer), networkOk: hasResourceMatch(['googletagmanager.com/gtm.js']) },
        { name: 'Meta Pixel', sub: 'Eventos y remarketing', expected: marketingExpected, scriptOk: !!document.getElementById('mcq-meta-pixel'), globalOk: typeof window.fbq === 'function', networkOk: hasResourceMatch(['connect.facebook.net','facebook.com/tr']) },
        { name: 'AdSense', sub: 'Publicidad', expected: marketingExpected, scriptOk: !!document.getElementById('mcq-adsense'), globalOk: false, networkOk: hasResourceMatch(['pagead2.googlesyndication.com/pagead/js/adsbygoogle.js','googlesyndication.com']) },
        { name: 'Cloudflare', sub: 'Analítica web', expected: analyticsExpected, scriptOk: !!document.getElementById('mcq-cloudflare'), globalOk: false, networkOk: hasResourceMatch(['static.cloudflareinsights.com/beacon.min.js','cloudflareinsights.com']) }
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
      <article class="card">
        <div class="card-head">
          <div class="card-titleWrap">
            <h4 class="card-title">${item.name}</h4>
            <p class="card-sub">${item.sub}</p>
          </div>
          <span class="badge">
            <span class="dot ${state.color}"></span>
            <span>${state.text}</span>
          </span>
        </div>
        <div class="card-body">
          ${rows.map(([label, value, cls]) => `
            <div class="row">
              <span class="label">${label}</span>
              <span class="value ${cls}">${value}</span>
            </div>
          `).join('')}
        </div>
      </article>
    `;
  }

  function render() {
    ensureShadow();
    shadow.innerHTML = `
      <link rel="stylesheet" href="https://cdn.mcq.cl/assets/vendor/bootstrap-icons-2/bootstrap-icons.css">
      <style>
        :host{
          all: initial;
          color-scheme: light;
          font-family:Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          --ease:cubic-bezier(.22,.61,.36,1);
        }
        *,*::before,*::after{ box-sizing:border-box; }
        button{ font:inherit; }
        .layer{ position:fixed; inset:0; pointer-events:none; z-index:2147483647; }

        .fab{
          position:fixed; right:14px; bottom:14px; width:50px; height:50px; border:1px solid rgba(255,255,255,.14); border-radius:50%;
          background:linear-gradient(180deg, rgba(255,255,255,.12), rgba(255,255,255,.05));
          color:#fff; display:flex; align-items:center; justify-content:center; pointer-events:auto; cursor:pointer;
          box-shadow:0 10px 24px rgba(0,0,0,.26), inset 0 1px 0 rgba(255,255,255,.14);
          backdrop-filter:blur(18px) saturate(130%); -webkit-backdrop-filter:blur(18px) saturate(130%);
          transition:transform .22s var(--ease), border-color .22s ease;
        }
        .fab:hover{ transform:translateY(-2px); border-color:rgba(255,255,255,.22); }

        .modal{
          position:fixed; inset:0; display:flex; align-items:center; justify-content:center; padding:12px;
          background:rgba(0,0,0,.58); backdrop-filter:blur(10px); -webkit-backdrop-filter:blur(10px);
          opacity:0; visibility:hidden; pointer-events:none; transition:opacity .26s var(--ease), visibility .26s linear;
        }
        .modal.is-open{ opacity:1; visibility:visible; pointer-events:auto; }

        .dialog{
          position:relative; width:min(600px, calc(100vw - 40px)); border-radius:20px; background:rgba(247,247,247,.92); color:#111;
          box-shadow:0 18px 48px rgba(0,0,0,.26); border:1px solid rgba(255,255,255,.55);
          transform:translateY(12px) scale(.985); opacity:.86; transition:transform .26s var(--ease), opacity .26s var(--ease);
        }
        .modal.is-open .dialog{ transform:translateY(0) scale(1); opacity:1; }

        .close{
          position:absolute; top:10px; right:10px; width:32px; height:32px; border:0; border-radius:50%; background:#000; color:#fff;
          display:flex; align-items:center; justify-content:center; cursor:pointer; pointer-events:auto;
        }
        .head{ padding:14px 16px 5px; }
        .brand{ display:grid; grid-template-columns:40px 1fr; gap:9px; align-items:start; padding-right:28px; }
        .isoWrap{ width:40px; height:40px; display:flex; align-items:center; justify-content:center; }
        .iso{ width:28px; height:28px; object-fit:contain; }
        .brandtext h3{ margin:0 0 2px; font-size:18px; line-height:1.1; color:#000; }
        .brandtext p{ margin:0; font-size:11px; line-height:1.42; color:rgba(0,0,0,.62); }

        .body{ padding:3px 16px 10px; }
        .intro{ margin:0 0 8px; font-size:11px; line-height:1.42; color:rgba(0,0,0,.70); }

        .grid{ display:grid; grid-template-columns:repeat(2, minmax(0, 1fr)); gap:6px; }
        .card{
          border:1px solid rgba(0,0,0,.08); border-radius:12px; background:rgba(255,255,255,.60);
          box-shadow:0 6px 14px rgba(0,0,0,.04); padding:8px; transition:transform .22s var(--ease), box-shadow .22s ease;
        }
        .card:hover{ transform:translateY(-1px); box-shadow:0 8px 18px rgba(0,0,0,.06); }
        .card-head{ display:grid; grid-template-columns:1fr auto; gap:6px; align-items:start; margin-bottom:6px; }
        .card-title{ margin:0 0 2px; font-size:13px; line-height:1.2; font-weight:800; color:#111; }
        .card-sub{ margin:0; font-size:10px; line-height:1.32; color:rgba(0,0,0,.56); }

        .badge{
          display:inline-flex; align-items:center; gap:5px; padding:4px 7px; border-radius:999px; background:rgba(0,0,0,.05); border:1px solid rgba(0,0,0,.06);
          font-size:9.5px; font-weight:800; letter-spacing:.02em; white-space:nowrap;
        }
        .dot{ width:8px; height:8px; border-radius:50%; background:#666; box-shadow:0 0 0 2px rgba(0,0,0,.06); }
        .dot.green{ background:#22c55e; }
        .dot.yellow{ background:#f59e0b; }
        .dot.red{ background:#ff3b30; }

        .card-body{ display:grid; gap:4px; }
        .row{
          display:grid; grid-template-columns:1fr auto; gap:6px; align-items:center; padding:5px 7px; border-radius:8px; background:rgba(255,255,255,.52); border:1px solid rgba(0,0,0,.04);
        }
        .label{ color:rgba(0,0,0,.68); font-size:10px; }
        .value{ font-weight:800; font-size:10px; }
        .value.ok{ color:#16a34a; }
        .value.warn{ color:#d97706; }
        .value.bad{ color:#dc2626; }

        .actions{ display:grid; grid-template-columns:repeat(2, minmax(0, 1fr)); gap:7px; padding:0 16px 14px; }
        .btn{
          appearance:none; border:none; cursor:pointer; border-radius:12px; padding:9px 14px; font-size:11.5px; font-weight:700; letter-spacing:.3px; line-height:1.2;
        }
        .btn-primary{ background:#000; color:#fff; }
        .btn-secondary{ background:rgba(255,255,255,.08); color:#000; border:1px solid rgb(0 0 0 / 100%); }

        @media (max-width:640px){
          .fab{ right:12px; bottom:12px; width:46px; height:46px; }
          .modal{ align-items:flex-end; padding:8px; }
          .dialog{ width:100%; max-width:100%; border-radius:16px; transform:translateY(16px) scale(.992); }
          .head{ padding:14px 12px 5px; }
          .brand{ grid-template-columns:30px 1fr; gap:8px; padding-right:22px; }
          .isoWrap{ width:30px; height:30px; }
          .iso{ width:22px; height:22px; }
          .brandtext h3{ font-size:16px; }
          .brandtext p{ font-size:10.5px; line-height:1.32; }
          .body{ padding:3px 12px 10px; }
          .intro{ font-size:10.5px; line-height:1.32; }
          .grid{ grid-template-columns:1fr; gap:6px; }
          .card{ padding:9px; }
          .actions{ gap:6px; padding:0 12px 12px; }
          .btn{ width:100%; min-width:0; padding:9px 10px; font-size:11px; }
          .close{ top:8px; right:8px; width:28px; height:28px; }
        }

        @media (max-width:420px){
          .actions{ grid-template-columns:1fr; }
        }
      </style>

      <div class="layer">
        <button class="fab" id="fab" type="button" aria-label="Abrir semáforo"><i class="bi bi-activity"></i></button>

        <div class="modal" id="modal">
          <div class="dialog" role="dialog" aria-modal="true" aria-labelledby="title">
            <button class="close" id="close" aria-label="Cerrar"><i class="bi bi-x-lg"></i></button>

            <div class="head">
              <div class="brand">
                <div class="isoWrap"><img class="iso" src="https://cdn.mcq.cl/logo/canales-iso-black.svg" alt="CANALES"></div>
                <div class="brandtext">
                  <h3 id="title">Semáforo de trackers</h3>
                  <p>Valida por servicio si la data parece estarse compartiendo según carga, objeto global y tráfico observado.</p>
                </div>
              </div>
            </div>

            <div class="body">
              <p class="intro">Este panel solo aparece con <strong>#semaforo</strong>. Cada tracker tiene su propio estado independiente.</p>
              <div class="grid" id="list"></div>
            </div>

            <div class="actions">
              <button class="btn btn-secondary" id="refresh">Refrescar</button>
              <button class="btn btn-primary" id="close2">Cerrar</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderList() {
    const list = qs('list');
    if (!list) return;
    const { consent, trackers } = buildChecks();
    if (!consent) {
      list.innerHTML = `
        <article class="card">
          <div class="card-head">
            <div class="card-titleWrap">
              <h4 class="card-title">Consentimiento</h4>
              <p class="card-sub">No hay sesión activa</p>
            </div>
            <span class="badge"><span class="dot red"></span><span>ERROR</span></span>
          </div>
          <div class="card-body">
            <div class="row">
              <span class="label">Estado</span>
              <span class="value bad">No hay consentimiento en sesión</span>
            </div>
          </div>
        </article>
      `;
      return;
    }
    list.innerHTML = trackers.map(renderCard).join('');
  }

  function openModal() {
    const modal = qs('modal');
    if (!modal) return;
    requestAnimationFrame(() => modal.classList.add('is-open'));
    renderList();
  }

  function closeModal() {
    const modal = qs('modal');
    if (!modal) return;
    modal.classList.remove('is-open');
  }

  function bind() {
    qs('fab')?.addEventListener('click', openModal);
    qs('close')?.addEventListener('click', closeModal);
    qs('close2')?.addEventListener('click', closeModal);
    qs('refresh')?.addEventListener('click', renderList);
    qs('modal')?.addEventListener('click', (e) => {
      if (e.target === qs('modal')) closeModal();
    });
  }

  function init() {
    render();
    bind();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
