
(() => {
  const CONFIG = {
    consentKey: 'mcq_cookie_consent_session',
    hostId: 'mcq-cookie-host-shadow',
    logoUrl: 'https://cdn.mcq.cl/logo/canales-white.svg',
    logoIsoUrl: 'https://cdn.mcq.cl/logo/canales-iso-black.svg',
    brandName: 'CANALES',
    iconsCss: 'https://cdn.mcq.cl/assets/vendor/bootstrap-icons-2/bootstrap-icons.css',
    gaId: 'G-515MMDKBW8',
    gtmId: 'GTM-5CHVZHH',
    metaPixelId: '280258540586226',
    adsenseClient: 'ca-pub-8419333429480900',
    cloudflareToken: '52b9cbbe4c2342f1a780904e87ef10f7'
  };

  const state = {
    shadow: null,
    timers: new Map(),
    injected: new Set()
  };

  const ANIM = { modal: 260, banner: 220 };

  function getConsent() {
    try {
      const raw = sessionStorage.getItem(CONFIG.consentKey);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function saveConsent(data) {
    sessionStorage.setItem(CONFIG.consentKey, JSON.stringify(data));
  }

  function qs(id) {
    return state.shadow ? state.shadow.getElementById(id) : null;
  }

  function clearTimer(key) {
    const t = state.timers.get(key);
    if (t) {
      clearTimeout(t);
      state.timers.delete(key);
    }
  }

  function setTimer(key, fn, ms) {
    clearTimer(key);
    const t = setTimeout(() => {
      state.timers.delete(key);
      fn();
    }, ms);
    state.timers.set(key, t);
  }

  function injectScript({ id, src, inline, async = true, defer = false, attrs = {} }) {
    if (id && document.getElementById(id)) return;
    if (id && state.injected.has(id)) return;
    const s = document.createElement('script');
    if (id) s.id = id;
    if (src) {
      s.src = src;
      s.async = async;
      if (defer) s.defer = true;
    }
    Object.entries(attrs).forEach(([k, v]) => s.setAttribute(k, v));
    if (inline) s.text = inline;
    document.head.appendChild(s);
    if (id) state.injected.add(id);
  }

  function injectHiddenImage({ id, src }) {
    if (document.getElementById(id)) return;
    if (state.injected.has(id)) return;
    const img = document.createElement('img');
    img.id = id;
    img.src = src;
    img.width = 1;
    img.height = 1;
    img.alt = '';
    img.style.display = 'none';
    document.body.appendChild(img);
    state.injected.add(id);
  }

  function injectHiddenIframe({ id, src }) {
    if (document.getElementById(id)) return;
    if (state.injected.has(id)) return;
    const iframe = document.createElement('iframe');
    iframe.id = id;
    iframe.src = src;
    iframe.height = '0';
    iframe.width = '0';
    iframe.style.display = 'none';
    iframe.style.visibility = 'hidden';
    document.body.appendChild(iframe);
    state.injected.add(id);
  }

  function applyConsent(consent) {
    if (consent.analytics) {
      injectScript({ id: 'mcq-ga-src', src: `https://www.googletagmanager.com/gtag/js?id=${CONFIG.gaId}` });
      injectScript({
        id: 'mcq-ga-inline',
        inline: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${CONFIG.gaId}');
        `
      });
      injectScript({
        id: 'mcq-cloudflare',
        src: 'https://static.cloudflareinsights.com/beacon.min.js',
        async: false,
        defer: true,
        attrs: { 'data-cf-beacon': JSON.stringify({ token: CONFIG.cloudflareToken }) }
      });
    }

    if (consent.marketing) {
      injectScript({
        id: 'mcq-gtm-inline',
        inline: `
          window.dataLayer = window.dataLayer || [];
          (function(w,d,s,l,i){
            w[l]=w[l]||[];
            w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
            var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),
                dl=l!='dataLayer' ? '&l='+l : '';
            j.async=true;
            j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
            f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${CONFIG.gtmId}');
        `
      });
      injectHiddenIframe({ id: 'mcq-gtm-noscript-frame', src: `https://www.googletagmanager.com/ns.html?id=${CONFIG.gtmId}` });
      injectScript({
        id: 'mcq-meta-pixel',
        inline: `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${CONFIG.metaPixelId}');
          fbq('track', 'PageView');
        `
      });
      injectHiddenImage({ id: 'mcq-meta-pixel-noscript', src: `https://www.facebook.com/tr?id=${CONFIG.metaPixelId}&ev=PageView&noscript=1` });
      injectScript({
        id: 'mcq-adsense',
        src: `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CONFIG.adsenseClient}`,
        attrs: { crossorigin: 'anonymous' }
      });
    }
  }

  function ensureShadow() {
    if (state.shadow) return;
    let host = document.getElementById(CONFIG.hostId);
    if (!host) {
      host = document.createElement('div');
      host.id = CONFIG.hostId;
      host.style.position = 'fixed';
      host.style.inset = '0';
      host.style.zIndex = '2147483647';
      host.style.pointerEvents = 'none';
      document.body.appendChild(host);
    }
    state.shadow = host.shadowRoot || host.attachShadow({ mode: 'open' });
  }

  function render() {
    ensureShadow();
    state.shadow.innerHTML = `
      <link rel="stylesheet" href="${CONFIG.iconsCss}">
      <style>
        :host{
          all: initial;
          color-scheme: light;
          --mcq-text:#111;
          --mcq-shadow:0 18px 48px rgba(0,0,0,.26);
          --mcq-green:#22c55e;
          --mcq-disabled:rgba(130,130,130,.55);
          --mcq-ease:cubic-bezier(.22,.61,.36,1);
          font-family:Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
        *,*::before,*::after{ box-sizing:border-box; }
        button,input{ font:inherit; }
        .layer{ position:fixed; inset:0; pointer-events:none; z-index:2147483647; }

        .fab{
          position:fixed; left:14px; bottom:14px; width:50px; height:50px; border:1px solid rgba(255,255,255,.14); border-radius:50%;
          background:linear-gradient(180deg, rgba(255,255,255,.12), rgba(255,255,255,.05));
          color:#fff; display:flex; align-items:center; justify-content:center;
          box-shadow:0 10px 24px rgba(0,0,0,.26), inset 0 1px 0 rgba(255,255,255,.14);
          backdrop-filter:blur(18px) saturate(130%); -webkit-backdrop-filter:blur(18px) saturate(130%);
          cursor:pointer; pointer-events:auto;
          transition:transform .22s var(--mcq-ease), border-color .22s ease, opacity .22s ease, box-shadow .22s ease;
        }
        .fab:hover{ transform:translateY(-2px); border-color:rgba(255,255,255,.22); }
        .fab i{ font-size:18px; }
        .fab.is-accepted{ opacity:.5; }
        .fab.has-alert::after{
          content:""; position:absolute; top:4px; right:4px; width:10px; height:10px; border-radius:50%;
          background:#ff3b30; border:2px solid rgba(20,20,20,.95);
        }

        .banner{
          position:fixed; left:0; right:0; bottom:0; color:#fff;
          background:linear-gradient(180deg, rgba(255,255,255,.11), rgba(255,255,255,.05));
          backdrop-filter:blur(22px) saturate(140%); -webkit-backdrop-filter:blur(22px) saturate(140%);
          box-shadow:0 -8px 30px rgba(0,0,0,.20), inset 0 1px 0 rgba(255,255,255,.10);
          border-top:1px solid rgba(255,255,255,.12);
          opacity:0; transform:translateY(18px); visibility:hidden; pointer-events:none;
          transition:opacity .22s var(--mcq-ease), transform .22s var(--mcq-ease), visibility .22s linear;
        }
        .banner.is-visible{ opacity:1; transform:translateY(0); visibility:visible; pointer-events:auto; }
        .banner-inner{ position:relative; padding:13px 16px 12px; }
        .banner-inner::before{
          content:""; position:absolute; inset:0; pointer-events:none;
          background:radial-gradient(circle at top left, rgba(5,114,205,.18), transparent 24%), linear-gradient(180deg, rgba(255,255,255,.04), transparent);
        }
        .brand{ position:relative; z-index:1; margin-bottom:6px; }
        .brand-logo{ width:104px; display:block; object-fit:contain; }
        .title{ position:relative; z-index:1; margin:0 0 5px; font-size:17px; line-height:1.15; color:#fff; }
        .text{ position:relative; z-index:1; margin:0; max-width:960px; font-size:12.5px; line-height:1.5; color:rgba(255,255,255,.80); }
        .actions{ position:relative; z-index:1; display:flex; gap:8px; flex-wrap:wrap; margin-top:10px; }

        .btn{
          appearance:none; border:none; cursor:pointer; border-radius:12px; padding:9px 14px; font-size:11.5px; font-weight:700; letter-spacing:.3px; line-height:1.2;
          transition:transform .22s var(--mcq-ease), box-shadow .22s ease, background-color .22s ease, color .22s ease, border-color .22s ease;
        }
        .btn:hover{ transform:translateY(-1px); }
        .btn-primary{ background:#000; color:#fff; box-shadow:0 4px 10px rgba(0,0,0,.22); }
        .btn-primary:hover{ background:#fff; color:#000; }
        .btn-secondary{ background:rgba(255,255,255,.08); color:#000; border:1px solid rgb(0 0 0 / 100%); }
        .btn-secondary2{ background:rgba(255,255,255,.08); color:#fff; border:1px solid rgba(255,255,255,.12); }
        .btn-ghost{ background:rgba(255,255,255,.08); color:#000; border:1px solid rgb(0 0 0 / 100%); }
        .btn-ghost2{ background:rgba(255,255,255,.03); color:rgba(255,255,255,.86); border:1px solid rgba(255,255,255,.12); }

        .close{
          position:absolute; top:10px; right:10px; width:32px; height:32px; border:0; border-radius:50%; background:#000; color:#fff;
          display:flex; align-items:center; justify-content:center; cursor:pointer; z-index:2; pointer-events:auto;
          transition:transform .22s var(--mcq-ease), opacity .22s ease;
        }
        .close:hover{ transform:scale(1.04); opacity:.92; }

        .modal{
          position:fixed; inset:0; display:flex; align-items:center; justify-content:center; padding:12px;
          background:rgba(0,0,0,.58); backdrop-filter:blur(10px); -webkit-backdrop-filter:blur(10px);
          opacity:0; visibility:hidden; pointer-events:none;
          transition:opacity .26s var(--mcq-ease), visibility .26s linear;
        }
        .modal.is-open{ opacity:1; visibility:visible; pointer-events:auto; }
        .dialog{
          position:relative; width:min(540px, calc(100vw - 40px)); border-radius:20px; background:rgba(247,247,247,.92); color:var(--mcq-text);
          box-shadow:var(--mcq-shadow); border:1px solid rgba(255,255,255,.55);
          transform:translateY(12px) scale(.985); opacity:.86;
          transition:transform .26s var(--mcq-ease), opacity .26s var(--mcq-ease);
        }
        .modal.is-open .dialog{ transform:translateY(0) scale(1); opacity:1; }

        .dialog-head{ padding:14px 16px 5px; }
        .modal-brand{ display:grid; grid-template-columns:40px 1fr; gap:9px; align-items:start; padding-right:28px; }
        .modal-isoWrap{ width:40px; height:40px; display:flex; align-items:center; justify-content:center; }
        .modal-iso{ width:28px; height:28px; object-fit:contain; }
        .modal-brandtext h3{ margin:0 0 2px; font-size:18px; line-height:1.1; color:#000; }
        .modal-brandtext p{ margin:0; font-size:11px; line-height:1.42; color:rgba(0,0,0,.62); }
        .dialog-body{ padding:3px 16px 10px; }
        .intro{ margin:0 0 8px; font-size:11px; line-height:1.42; color:rgba(0,0,0,.70); }

        .accordion{ display:grid; gap:8px; }
        .item{ border:1px solid rgba(0,0,0,.08); border-radius:12px; background:rgba(255,255,255,.52); overflow:hidden; }
        .item-head{
          width:100%; display:grid; grid-template-columns:1fr auto auto; align-items:center; gap:8px; padding:9px 10px; background:transparent; border:0; cursor:pointer; text-align:left;
        }
        .item-title{ margin:0 0 2px; font-size:13px; line-height:1.2; font-weight:800; color:#111; }
        .item-sub{ margin:0; font-size:10px; line-height:1.32; color:rgba(0,0,0,.60); }
        .item-chevron{
          width:22px; height:22px; border-radius:50%; display:flex; align-items:center; justify-content:center;
          color:rgba(0,0,0,.66); background:rgba(0,0,0,.05); transition:transform .22s var(--mcq-ease);
        }
        .item.is-open .item-chevron{ transform:rotate(180deg); }
        .item-body{
          max-height:0; opacity:0; overflow:hidden; padding:0 10px; color:rgba(0,0,0,.72); font-size:10.5px; line-height:1.38;
          transition:max-height .22s var(--mcq-ease), opacity .18s ease, padding .22s var(--mcq-ease);
        }
        .item.is-open .item-body{ opacity:1; padding:0 10px 9px; }
        .item-body p{ margin:0; }

        .switch{ position:relative; width:40px; height:22px; }
        .switch input{ position:absolute; inset:0; opacity:0; cursor:pointer; margin:0; z-index:2; }
        .switch-ui{ width:100%; height:100%; display:block; border-radius:999px; background:rgba(0,0,0,.16); position:relative; transition:background .24s ease; }
        .switch-ui::after{
          content:""; position:absolute; top:3px; left:3px; width:16px; height:16px; border-radius:50%; background:#fff; box-shadow:0 2px 8px rgba(0,0,0,.15);
          transition:transform .24s ease;
        }
        .switch input:checked + .switch-ui{ background:var(--mcq-green); }
        .switch input:checked + .switch-ui::after{ transform:translateX(17px); }
        .switch.is-disabled{ opacity:.55; pointer-events:none; }

        .dialog-actions{ display:grid; grid-template-columns:repeat(3, minmax(0, 1fr)); gap:7px; padding:0 16px 14px; }

        @media (max-width:640px){
          .fab{ left:12px; bottom:12px; width:46px; height:46px; }
          .fab i{ font-size:16px; }
          .banner-inner{ padding:11px 12px calc(11px + env(safe-area-inset-bottom, 0px)); }
          .brand-logo{ width:94px; }
          .title{ font-size:15px; }
          .text{ font-size:11.5px; line-height:1.42; }
          .actions{ display:grid; grid-template-columns:repeat(3, minmax(0, 1fr)); gap:6px; }
          .btn{ width:100%; min-width:0; padding:9px 10px; font-size:11px; }
          .modal{ align-items:flex-end; padding:8px; }
          .dialog{ width:100%; max-width:100%; border-radius:16px; transform:translateY(16px) scale(.992); }
          .dialog-head{ padding:14px 12px 5px; }
          .modal-brand{ grid-template-columns:30px 1fr; gap:8px; padding-right:22px; }
          .modal-isoWrap{ width:30px; height:30px; }
          .modal-iso{ width:22px; height:22px; }
          .modal-brandtext h3{ font-size:16px; }
          .modal-brandtext p{ font-size:10.5px; line-height:1.32; }
          .dialog-body{ padding:3px 12px 10px; }
          .intro{ font-size:10.5px; line-height:1.32; }
          .accordion{ gap:6px; }
          .item-title{ font-size:12.5px; }
          .item-sub{ font-size:9.8px; line-height:1.25; }
          .item-body{ font-size:10px; line-height:1.3; }
          .switch{ width:38px; }
          .switch input:checked + .switch-ui::after{ transform:translateX(16px); }
          .dialog-actions{ grid-template-columns:repeat(3, minmax(0, 1fr)); gap:6px; padding:0 12px 12px; }
          .close{ top:8px; right:8px; width:28px; height:28px; }
        }

        @media (max-width:420px){
          .actions,.dialog-actions{ grid-template-columns:1fr; }
          .item-head{ grid-template-columns:1fr auto; grid-template-areas:"title switch" "title chevron"; }
          .item-titleWrap{ grid-area:title; }
          .switch{ grid-area:switch; justify-self:end; }
          .item-chevron{ grid-area:chevron; justify-self:end; }
        }
      </style>

      <div class="layer">
        <button class="fab" id="fab" type="button" aria-label="Preferencias de cookies"><i class="bi bi-cookie"></i></button>

        <div class="banner" id="banner">
          <div class="banner-inner">
            <button class="close" id="close-banner" aria-label="Cerrar aviso"><i class="bi bi-x-lg"></i></button>
            <div class="brand"><img class="brand-logo" src="${CONFIG.logoUrl}" alt="${CONFIG.brandName}"></div>
            <h2 class="title">Usamos cookies y tecnologías similares</h2>
            <p class="text">Usamos cookies esenciales para que el sitio funcione y, con tu permiso, tecnologías de analítica y marketing para medir tráfico, mejorar la experiencia y conectar ciertas interacciones con plataformas externas.</p>
            <div class="actions">
              <button class="btn btn-primary" id="accept-all">Aceptar</button>
              <button class="btn btn-secondary2" id="reject-all">Rechazar</button>
              <button class="btn btn-ghost2" id="open-prefs">Personalizar</button>
            </div>
          </div>
        </div>

        <div class="modal" id="modal">
          <div class="dialog" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <button class="close" id="close-modal" aria-label="Cerrar"><i class="bi bi-x-lg"></i></button>
            <div class="dialog-head">
              <div class="modal-brand">
                <div class="modal-isoWrap"><img class="modal-iso" src="${CONFIG.logoIsoUrl}" alt="${CONFIG.brandName}"></div>
                <div class="modal-brandtext">
                  <h3 id="modal-title">Preferencias de cookies</h3>
                  <p>Controla qué datos quieres compartir para mejorar tu experiencia en CANALES.</p>
                </div>
              </div>
            </div>

            <div class="dialog-body">
              <p class="intro">Puedes mantener solo las cookies necesarias o activar categorías opcionales según el nivel de personalización y medición que prefieras. Cada opción incluye una explicación más detallada.</p>

              <div class="accordion">
                <section class="item is-open" data-item="essential">
                  <button type="button" class="item-head" data-accordion-toggle="essential" id="head-essential" aria-expanded="true">
                    <div class="item-titleWrap">
                      <h4 class="item-title">Esenciales</h4>
                      <p class="item-sub">Necesarias para el funcionamiento básico del sitio.</p>
                    </div>
                    <label class="switch is-disabled" aria-label="Esenciales siempre activas">
                      <input type="checkbox" checked disabled><span class="switch-ui"></span>
                    </label>
                    <span class="item-chevron" aria-hidden="true"><i class="bi bi-chevron-down"></i></span>
                  </button>
                  <div class="item-body" id="panel-essential">
                    <p>Estas cookies permiten funciones mínimas e indispensables para que la web opere de manera estable, segura y coherente. Ayudan a conservar configuraciones técnicas básicas, mejorar la seguridad y asegurar que ciertas interacciones esenciales funcionen correctamente. Por su naturaleza, permanecen siempre activas.</p>
                  </div>
                </section>

                <section class="item" data-item="analytics">
                  <button type="button" class="item-head" data-accordion-toggle="analytics" id="head-analytics" aria-expanded="false">
                    <div class="item-titleWrap">
                      <h4 class="item-title">Analítica</h4>
                      <p class="item-sub">Medición, rendimiento y mejora de la experiencia.</p>
                    </div>
                    <label class="switch" aria-label="Activar analítica">
                      <input type="checkbox" id="consent-analytics"><span class="switch-ui"></span>
                    </label>
                    <span class="item-chevron" aria-hidden="true"><i class="bi bi-chevron-down"></i></span>
                  </button>
                  <div class="item-body" id="panel-analytics">
                    <p>Estas tecnologías nos ayudan a entender cómo navegan los visitantes por el sitio: qué secciones funcionan mejor, cuánto tiempo permanecen en ellas, qué contenidos generan más interés y dónde conviene optimizar la experiencia. No son indispensables para que la web funcione, pero sí muy útiles para mejorar su desempeño y usabilidad con el tiempo.</p>
                  </div>
                </section>

                <section class="item" data-item="marketing">
                  <button type="button" class="item-head" data-accordion-toggle="marketing" id="head-marketing" aria-expanded="false">
                    <div class="item-titleWrap">
                      <h4 class="item-title">Marketing</h4>
                      <p class="item-sub">Campañas, seguimiento y conexión con plataformas externas.</p>
                    </div>
                    <label class="switch" aria-label="Activar marketing">
                      <input type="checkbox" id="consent-marketing"><span class="switch-ui"></span>
                    </label>
                    <span class="item-chevron" aria-hidden="true"><i class="bi bi-chevron-down"></i></span>
                  </button>
                  <div class="item-body" id="panel-marketing">
                    <p>Estas tecnologías permiten medir el rendimiento de campañas, relacionar interacciones del sitio con servicios externos como Meta o Google y facilitar acciones publicitarias o de seguimiento. No son necesarias para el funcionamiento del sitio y puedes desactivarlas sin afectar la navegación principal.</p>
                  </div>
                </section>
              </div>
            </div>

            <div class="dialog-actions">
              <button class="btn btn-secondary" id="reject-optional">Rechazar opcionales</button>
              <button class="btn btn-ghost" id="save-prefs">Guardar preferencias</button>
              <button class="btn btn-primary" id="accept-all-modal">Aceptar todo</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function setAccordion(name, open) {
    const item = state.shadow.querySelector(`.item[data-item="${name}"]`);
    const panel = qs(`panel-${name}`);
    const head = qs(`head-${name}`);
    if (!item || !panel || !head) return;
    item.classList.toggle('is-open', open);
    head.setAttribute('aria-expanded', String(open));
    panel.style.maxHeight = open ? `${panel.scrollHeight + 20}px` : '0px';
  }

  function toggleAccordion(name) {
    const item = state.shadow.querySelector(`.item[data-item="${name}"]`);
    const willOpen = item ? !item.classList.contains('is-open') : false;
    ['essential', 'analytics', 'marketing'].forEach((n) => setAccordion(n, n === name ? willOpen : false));
  }

  function showBanner() {
    const banner = qs('banner');
    if (!banner) return;
    clearTimer('banner');
    requestAnimationFrame(() => banner.classList.add('is-visible'));
  }

  function hideBanner(immediate = false) {
    const banner = qs('banner');
    if (!banner) return;
    clearTimer('banner');
    if (immediate) {
      banner.classList.remove('is-visible');
      return;
    }
    banner.classList.remove('is-visible');
  }

  function openModal() {
    const consent = getConsent() || { analytics: false, marketing: false };
    const analytics = qs('consent-analytics');
    const marketing = qs('consent-marketing');
    if (analytics) analytics.checked = !!consent.analytics;
    if (marketing) marketing.checked = !!consent.marketing;
    const modal = qs('modal');
    if (!modal) return;
    clearTimer('modal');
    requestAnimationFrame(() => modal.classList.add('is-open'));
  }

  function closeModal(immediate = false) {
    const modal = qs('modal');
    if (!modal) return;
    clearTimer('modal');
    if (immediate) {
      modal.classList.remove('is-open');
      return;
    }
    modal.classList.remove('is-open');
  }

  function setFabState(mode) {
    const fab = qs('fab');
    if (!fab) return;
    fab.classList.remove('is-accepted', 'has-alert');
    if (mode === 'accepted') fab.classList.add('is-accepted');
    if (mode === 'alert') fab.classList.add('has-alert');
  }

  function syncFabStateFromConsent() {
    const consent = getConsent();
    if (!consent) return setFabState(null);
    if (consent.uiState === 'accepted') return setFabState('accepted');
    if (consent.uiState === 'alert') return setFabState('alert');
    setFabState(null);
  }

  function acceptAll() {
    const consent = { essential: true, analytics: true, marketing: true, uiState: 'accepted', dismissed: true, updatedAt: new Date().toISOString() };
    saveConsent(consent);
    applyConsent(consent);
    hideBanner();
    closeModal();
    setFabState('accepted');
  }

  function rejectOptional() {
    const consent = { essential: true, analytics: false, marketing: false, uiState: 'alert', dismissed: true, updatedAt: new Date().toISOString() };
    saveConsent(consent);
    hideBanner();
    closeModal();
    setFabState('alert');
  }

  function savePreferences() {
    const analytics = qs('consent-analytics')?.checked || false;
    const marketing = qs('consent-marketing')?.checked || false;
    const consent = { essential: true, analytics, marketing, uiState: analytics && marketing ? 'accepted' : 'alert', dismissed: true, updatedAt: new Date().toISOString() };
    saveConsent(consent);
    applyConsent(consent);
    hideBanner();
    closeModal();
    setFabState(analytics && marketing ? 'accepted' : 'alert');
  }

  function bind() {
    qs('fab')?.addEventListener('click', openModal);
    qs('open-prefs')?.addEventListener('click', openModal);
    qs('close-modal')?.addEventListener('click', () => closeModal());
    qs('close-banner')?.addEventListener('click', rejectOptional);
    qs('accept-all')?.addEventListener('click', acceptAll);
    qs('accept-all-modal')?.addEventListener('click', acceptAll);
    qs('reject-all')?.addEventListener('click', rejectOptional);
    qs('reject-optional')?.addEventListener('click', rejectOptional);
    qs('save-prefs')?.addEventListener('click', savePreferences);
    qs('modal')?.addEventListener('click', (e) => {
      if (e.target === qs('modal')) closeModal();
    });
    state.shadow.querySelectorAll('[data-accordion-toggle]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        if (e.target.closest('.switch')) return;
        const name = btn.getAttribute('data-accordion-toggle');
        if (name) toggleAccordion(name);
      });
    });
  }

  function init() {
    render();
    bind();
    setAccordion('essential', true);
    setAccordion('analytics', false);
    setAccordion('marketing', false);

    const consent = getConsent();
    if (!consent) {
      showBanner();
      setFabState(null);
      return;
    }
    hideBanner(true);
    applyConsent(consent);
    syncFabStateFromConsent();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
