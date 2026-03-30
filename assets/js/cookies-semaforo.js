(() => {
  const HASH_OK = '#semaforo';
  const CONSENT_KEY = 'mcq_cookie_consent_session';

  if (window.location.hash !== HASH_OK) return;

  function qs(id) {
    return document.getElementById(id);
  }

  function getConsent() {
    try {
      const raw = sessionStorage.getItem(CONSENT_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function injectStyles() {
    if (qs('mcq-semaforo-styles')) return;

    const style = document.createElement('style');
    style.id = 'mcq-semaforo-styles';
    style.textContent = `
      .mcq-semaforo-fab{
        position: fixed;
        right: 16px;
        bottom: 16px;
        z-index: 2147483644;
        width: 56px;
        height: 56px;
        border: 1px solid rgba(255,255,255,.14);
        border-radius: 50%;
        background: linear-gradient(180deg, rgba(255,255,255,.12), rgba(255,255,255,.05));
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 12px 30px rgba(0,0,0,.32), inset 0 1px 0 rgba(255,255,255,.14);
        backdrop-filter: blur(18px) saturate(130%);
        -webkit-backdrop-filter: blur(18px) saturate(130%);
        cursor: pointer;
        transition: transform .2s ease, border-color .2s ease;
      }

      .mcq-semaforo-fab:hover{
        transform: translateY(-2px);
        border-color: rgba(255,255,255,.22);
      }

      .mcq-semaforo-fab i{
        font-size: 20px;
        line-height: 1;
      }

      .mcq-semaforo-modal{
        position: fixed;
        inset: 0;
        z-index: 2147483647;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 18px;
        background: rgba(0,0,0,.58);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
      }

      .mcq-semaforo-modal[hidden]{
        display: none !important;
      }

      .mcq-semaforo-dialog{
        position: relative;
        width: min(760px, calc(100vw - 36px));
        border-radius: 28px;
        background: rgba(247,247,247,.92);
        color: #111;
        box-shadow: 0 24px 70px rgba(0,0,0,.34);
        border: 1px solid rgba(255,255,255,.55);
      }

      .mcq-semaforo-close{
        position: absolute;
        top: 16px;
        right: 16px;
        width: 38px;
        height: 38px;
        border: 0;
        border-radius: 50%;
        background: #000;
        color: #fff;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 2;
        transition: transform .2s ease, opacity .2s ease;
      }

      .mcq-semaforo-close:hover{
        transform: scale(1.06);
        opacity: .9;
      }

      .mcq-semaforo-head{
        padding: 22px 24px 10px;
      }

      .mcq-semaforo-brand{
        display: flex;
        align-items: center;
        gap: 16px;
        padding-right: 44px;
      }

      .mcq-semaforo-isoWrap{
        width: 58px;
        height: 58px;
        flex: 0 0 auto;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .mcq-semaforo-iso{
        width: 44px;
        height: 44px;
        display: block;
        object-fit: contain;
      }

      .mcq-semaforo-sep{
        width: 1px;
        align-self: stretch;
        background: linear-gradient(to bottom, transparent, rgba(0,0,0,.18), transparent);
        flex: 0 0 auto;
      }

      .mcq-semaforo-brandtext{
        min-width: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      .mcq-semaforo-brandtext h3{
        margin: 0 0 4px;
        font-size: 24px;
        line-height: 1.12;
        letter-spacing: -.03em;
        font-family: 'Archivo Black', sans-serif;
        color: #000;
      }

      .mcq-semaforo-brandtext p{
        margin: 0;
        font-size: 14px;
        line-height: 1.55;
        color: rgba(0,0,0,.62);
      }

      .mcq-semaforo-body{
        padding: 6px 24px 18px;
      }

      .mcq-semaforo-intro{
        margin: 0 0 14px;
        font-size: 14px;
        line-height: 1.55;
        color: rgba(0,0,0,.70);
      }

      .mcq-semaforo-list{
        display: grid;
        gap: 10px;
      }

      .mcq-semaforo-item{
        border: 1px solid rgba(0,0,0,.08);
        border-radius: 20px;
        background: rgba(255,255,255,.52);
        box-shadow: 0 8px 20px rgba(0,0,0,.04);
        padding: 14px 16px;
      }

      .mcq-semaforo-top{
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 10px;
      }

      .mcq-semaforo-name{
        font-size: 16px;
        line-height: 1.2;
        font-weight: 800;
        color: #111;
      }

      .mcq-semaforo-light{
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font-weight: 700;
      }

      .mcq-semaforo-dot{
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: #666;
        box-shadow: 0 0 0 2px rgba(0,0,0,.06);
      }

      .mcq-semaforo-dot.green{ background:#22c55e; }
      .mcq-semaforo-dot.yellow{ background:#f59e0b; }
      .mcq-semaforo-dot.red{ background:#ff3b30; }

      .mcq-semaforo-grid{
        display: grid;
        gap: 6px;
      }

      .mcq-semaforo-row{
        display: flex;
        justify-content: space-between;
        gap: 10px;
        align-items: center;
      }

      .mcq-semaforo-label{
        color: rgba(0,0,0,.68);
        font-size: 13px;
      }

      .mcq-semaforo-value{
        font-weight: 700;
        font-size: 12px;
      }

      .mcq-semaforo-value.ok{ color:#16a34a; }
      .mcq-semaforo-value.warn{ color:#d97706; }
      .mcq-semaforo-value.bad{ color:#dc2626; }

      .mcq-semaforo-actions{
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        justify-content: flex-end;
        padding: 0 24px 22px;
      }

      .mcq-semaforo-btn{
        appearance: none;
        border: none;
        cursor: pointer;
        border-radius: 20px;
        padding: 12px 24px;
        font-size: 14px;
        font-weight: 700;
        letter-spacing: 1px;
        transition: .3s ease, transform .2s ease;
      }

      .mcq-semaforo-btn:hover{
        transform: scale(1.04) translateY(-1px);
      }

      .mcq-semaforo-btn--primary{
        font-family: 'Archivo Black', sans-serif;
        background: #000;
        color: #fff;
        box-shadow: 0 4px 12px rgba(0,0,0,.3);
      }

      .mcq-semaforo-btn--secondary{
        background: rgba(255,255,255,.08);
        color: #000;
        border: 1px solid rgb(0 0 0 / 100%);
      }

      @media (max-width: 640px){
        .mcq-semaforo-dialog{
          width: min(760px, calc(100vw - 20px));
          border-radius: 24px;
        }

        .mcq-semaforo-head{
          padding: 20px 18px 8px;
        }

        .mcq-semaforo-body{
          padding: 6px 18px 16px;
        }

        .mcq-semaforo-actions{
          padding: 0 18px 18px;
          flex-direction: column;
        }

        .mcq-semaforo-btn{
          width: 100%;
        }

        .mcq-semaforo-brand{
          gap: 12px;
        }

        .mcq-semaforo-isoWrap{
          width: 46px;
          height: 46px;
        }

        .mcq-semaforo-iso{
          width: 36px;
          height: 36px;
        }

        .mcq-semaforo-brandtext h3{
          font-size: 21px;
        }

        .mcq-semaforo-close{
          top: 12px;
          right: 12px;
        }
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
        <button class="mcq-semaforo-close" id="mcq-semaforo-close" aria-label="Cerrar">
          <i class="bi bi-x-lg"></i>
        </button>

        <div class="mcq-semaforo-head">
          <div class="mcq-semaforo-brand">
            <div class="mcq-semaforo-isoWrap">
              <img class="mcq-semaforo-iso" src="https://cdn.mcq.cl/logo/canales-iso-black.svg" alt="CANALES">
            </div>
            <div class="mcq-semaforo-sep"></div>
            <div class="mcq-semaforo-brandtext">
              <h3 id="mcq-semaforo-title">Semáforo de trackers</h3>
              <p>Valida por servicio si la data parece estarse compartiendo según carga, objeto global y tráfico observado.</p>
            </div>
          </div>
        </div>

        <div class="mcq-semaforo-body">
          <p class="mcq-semaforo-intro">
            Este panel solo aparece con <strong>#semaforo</strong>. Cada tracker tiene su propio estado independiente.
          </p>
          <div class="mcq-semaforo-list" id="mcq-semaforo-list"></div>
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
    if (modal) modal.hidden = false;
    renderList();
  }

  function closeModal() {
    const modal = qs('mcq-semaforo-modal');
    if (modal) modal.hidden = true;
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
    if (!expected) {
      return { color: 'yellow', text: 'N/A' };
    }

    if (scriptOk && (globalOk || networkOk)) {
      return { color: 'green', text: 'OK' };
    }

    if (scriptOk || globalOk || networkOk) {
      return { color: 'yellow', text: 'PARCIAL' };
    }

    return { color: 'red', text: 'ERROR' };
  }

  function buildChecks() {
    const consent = getConsent();

    const analyticsExpected = !!(consent && consent.analytics);
    const marketingExpected = !!(consent && consent.marketing);

    return {
      consent,
      trackers: [
        {
          name: 'Google Analytics',
          expected: analyticsExpected,
          scriptOk: !!qs('mcq-ga-src') && !!qs('mcq-ga-inline'),
          globalOk: typeof window.gtag === 'function',
          networkOk: hasResourceMatch([
            'googletagmanager.com/gtag/js',
            'google-analytics.com/g/collect',
            'analytics.google.com/g/collect'
          ])
        },
        {
          name: 'Google Tag Manager',
          expected: marketingExpected,
          scriptOk: !!qs('mcq-gtm-inline'),
          globalOk: Array.isArray(window.dataLayer),
          networkOk: hasResourceMatch([
            'googletagmanager.com/gtm.js'
          ])
        },
        {
          name: 'Meta Pixel',
          expected: marketingExpected,
          scriptOk: !!qs('mcq-meta-pixel'),
          globalOk: typeof window.fbq === 'function',
          networkOk: hasResourceMatch([
            'connect.facebook.net',
            'facebook.com/tr'
          ])
        },
        {
          name: 'AdSense',
          expected: marketingExpected,
          scriptOk: !!qs('mcq-adsense'),
          globalOk: false,
          networkOk: hasResourceMatch([
            'pagead2.googlesyndication.com/pagead/js/adsbygoogle.js',
            'googlesyndication.com'
          ])
        },
        {
          name: 'Cloudflare',
          expected: analyticsExpected,
          scriptOk: !!qs('mcq-cloudflare'),
          globalOk: false,
          networkOk: hasResourceMatch([
            'static.cloudflareinsights.com/beacon.min.js',
            'cloudflareinsights.com'
          ])
        }
      ]
    };
  }

  function renderItem(item) {
    const state = trackerState(item);

    const rows = [
      ['Esperado', item.expected ? 'Sí' : 'No', item.expected ? 'ok' : 'warn'],
      ['Script', item.scriptOk ? 'Sí' : 'No', item.scriptOk ? 'ok' : 'bad'],
      ['Global', item.globalOk ? 'Sí' : 'No', item.globalOk ? 'ok' : 'warn'],
      ['Red', item.networkOk ? 'Sí' : 'No', item.networkOk ? 'ok' : 'bad']
    ];

    return `
      <div class="mcq-semaforo-item">
        <div class="mcq-semaforo-top">
          <span class="mcq-semaforo-name">${item.name}</span>
          <span class="mcq-semaforo-light">
            <span class="mcq-semaforo-dot ${state.color}"></span>
            <span>${state.text}</span>
          </span>
        </div>
        <div class="mcq-semaforo-grid">
          ${rows.map(([label, value, cls]) => `
            <div class="mcq-semaforo-row">
              <span class="mcq-semaforo-label">${label}</span>
              <span class="mcq-semaforo-value ${cls}">${value}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function renderList() {
    const list = qs('mcq-semaforo-list');
    if (!list) return;

    const { consent, trackers } = buildChecks();

    if (!consent) {
      list.innerHTML = `
        <div class="mcq-semaforo-item">
          <div class="mcq-semaforo-top">
            <span class="mcq-semaforo-name">Consentimiento</span>
            <span class="mcq-semaforo-light">
              <span class="mcq-semaforo-dot red"></span>
              <span>NO</span>
            </span>
          </div>
          <div class="mcq-semaforo-grid">
            <div class="mcq-semaforo-row">
              <span class="mcq-semaforo-label">Estado</span>
              <span class="mcq-semaforo-value bad">No hay sesión activa de consentimiento</span>
            </div>
          </div>
        </div>
      `;
      return;
    }

    list.innerHTML = trackers.map(renderItem).join('');
  }

  function bindEvents() {
    qs('mcq-semaforo-fab')?.addEventListener('click', openModal);
    qs('mcq-semaforo-close')?.addEventListener('click', closeModal);
    qs('mcq-semaforo-close-2')?.addEventListener('click', closeModal);
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