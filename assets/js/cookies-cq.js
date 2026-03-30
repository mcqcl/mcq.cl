(() => {
  const CookieConsentUI = (() => {
    const CONFIG = {
      consentKey: 'mcq_cookie_consent_session',
      logoUrl: 'https://cdn.mcq.cl/logo/canales-white.svg',
      logoIsoUrl: 'https://cdn.mcq.cl/logo/canales-iso-black.svg',
      brandName: 'CANALES',
      iconsCss: 'https://cdn.mcq.cl/assets/vendor/bootstrap-icons-2/bootstrap-icons.css',
      fontCss: 'https://fonts.googleapis.com/css2?family=Archivo+Black&display=swap',

      gaId: 'G-515MMDKBW8',
      gtmId: 'GTM-5CHVZHH',
      metaPixelId: '280258540586226',
      adsenseClient: 'ca-pub-8419333429480900',
      cloudflareToken: '52b9cbbe4c2342f1a780904e87ef10f7'
    };

    const state = {
      injected: new Set()
    };

    function qs(id) {
      return document.getElementById(id);
    }

    function injectExternalCss(href, marker) {
      if (document.querySelector(`link[${marker}="1"]`)) return;

      const exists = [...document.querySelectorAll('link[rel="stylesheet"]')]
        .some(link => (link.href || '') === href || (link.href || '').includes(href));

      if (exists) return;

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.setAttribute(marker, '1');
      document.head.appendChild(link);
    }

    function injectAssets() {
      injectExternalCss(CONFIG.iconsCss, 'data-mcq-cookie-icons');
      injectExternalCss(CONFIG.fontCss, 'data-mcq-cookie-font');
    }

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

    function removeConsent() {
      sessionStorage.removeItem(CONFIG.consentKey);
    }

    function injectStyles() {
      if (qs('mcq-cookie-styles')) return;

      const style = document.createElement('style');
      style.id = 'mcq-cookie-styles';
      style.textContent = `
        :root{
          --mcq-cookie-text: #111;
          --mcq-cookie-shadow: 0 20px 56px rgba(0,0,0,.28);
          --mcq-cookie-green: #22c55e;
          --mcq-cookie-disabled: rgba(130,130,130,.55);
        }

        .mcq-cookie-fab{
          position: fixed;
          left: 14px;
          bottom: 14px;
          z-index: 2147483645;
          width: 52px;
          height: 52px;
          border: 1px solid rgba(255,255,255,.14);
          border-radius: 50%;
          background: linear-gradient(180deg, rgba(255,255,255,.12), rgba(255,255,255,.05));
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 26px rgba(0,0,0,.28), inset 0 1px 0 rgba(255,255,255,.14);
          backdrop-filter: blur(18px) saturate(130%);
          -webkit-backdrop-filter: blur(18px) saturate(130%);
          cursor: pointer;
          transition: transform .2s ease, border-color .2s ease, opacity .2s ease;
        }

        .mcq-cookie-fab:hover{
          transform: translateY(-2px);
          border-color: rgba(255,255,255,.22);
        }

        .mcq-cookie-fab i{
          font-size: 18px;
          line-height: 1;
        }

        .mcq-cookie-fab.is-accepted{
          opacity: .5;
        }

        .mcq-cookie-fab.has-alert::after{
          content: "";
          position: absolute;
          top: 4px;
          right: 4px;
          width: 11px;
          height: 11px;
          border-radius: 50%;
          background: #ff3b30;
          border: 2px solid rgba(20,20,20,.95);
          box-shadow: 0 0 0 1px rgba(255,255,255,.08);
        }

        .mcq-cookie-banner{
          position: fixed;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          max-width: none;
          margin: 0;
          z-index: 2147483646;
          border-top: 1px solid rgba(255,255,255,.12);
          border-left: 0;
          border-right: 0;
          border-bottom: 0;
          border-radius: 0;
          overflow: hidden;
          color: #fff;
          background: linear-gradient(180deg, rgba(255,255,255,.11), rgba(255,255,255,.05));
          backdrop-filter: blur(22px) saturate(140%);
          -webkit-backdrop-filter: blur(22px) saturate(140%);
          box-shadow: 0 -8px 30px rgba(0,0,0,.20), inset 0 1px 0 rgba(255,255,255,.10);
        }

        .mcq-cookie-banner-inner{
          position: relative;
          padding: 14px 18px 13px;
        }

        .mcq-cookie-banner-inner::before{
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            radial-gradient(circle at top left, rgba(5,114,205,.18), transparent 24%),
            linear-gradient(180deg, rgba(255,255,255,.04), transparent);
        }

        .mcq-cookie-brand{
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
        }

        .mcq-cookie-brand-logo{
          width: 110px;
          height: auto;
          display: block;
          object-fit: contain;
        }

        .mcq-cookie-title{
          position: relative;
          z-index: 1;
          margin: 0 0 6px;
          font-size: 18px;
          line-height: 1.18;
          letter-spacing: -.02em;
        }

        .mcq-cookie-text{
          position: relative;
          z-index: 1;
          margin: 0;
          max-width: 960px;
          font-size: 13px;
          line-height: 1.55;
          color: rgba(255,255,255,.80);
        }

        .mcq-cookie-actions{
          position: relative;
          z-index: 1;
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-top: 12px;
        }

        .mcq-cookie-btn{
          appearance: none;
          border: none;
          cursor: pointer;
          border-radius: 16px;
          padding: 10px 20px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: .4px;
          line-height: 1.2;
          transition: 0.35s ease, transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease, color 0.25s ease;
        }

        .mcq-cookie-btn:hover{
          transform: scale(1.03) translateY(-1px);
        }

        .mcq-cookie-btn--primary{
          font-family: 'Archivo Black', sans-serif;
          background: #000;
          color: #fff;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.24);
        }

        .mcq-cookie-btn--primary:hover{
          background: #ffffff;
          color: #000000;
        }

        .mcq-cookie-btn--secondary{
          background: rgba(255,255,255,.08);
          color: #000;
          border: 1px solid rgb(0 0 0 / 100%);
        }

        .mcq-cookie-btn--secondary2{
          background: rgba(255,255,255,.08);
          color: #fff;
          border: 1px solid rgba(255,255,255,.12);
          box-shadow: 0 4px 10px rgba(0,0,0,.16);
        }

        .mcq-cookie-btn--ghost{
          background: rgba(255,255,255,.08);
          color: #000;
          border: 1px solid rgb(0 0 0 / 100%);
        }

        .mcq-cookie-btn--ghost2{
          background: rgba(255,255,255,.03);
          color: rgba(255,255,255,.86);
          border: 1px solid rgba(255,255,255,.12);
          box-shadow: 0 4px 10px rgba(0,0,0,.12);
        }

        .mcq-cookie-dialog-close{
          position: absolute;
          top: 12px;
          right: 12px;
          width: 34px;
          height: 34px;
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

        .mcq-cookie-dialog-close:hover{
          transform: scale(1.05);
          opacity: .9;
        }

        .mcq-cookie-dialog-close i{
          font-size: 14px;
        }

        .mcq-cookie-modal{
          position: fixed;
          inset: 0;
          z-index: 2147483647;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 14px;
          background: rgba(0,0,0,.58);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        .mcq-cookie-modal[hidden]{
          display: none !important;
        }

        .mcq-cookie-dialog{
          position: relative;
          width: min(680px, calc(100vw - 28px));
          max-height: min(86vh, 760px);
          overflow: auto;
          border-radius: 22px;
          background: rgba(247,247,247,.92);
          color: var(--mcq-cookie-text);
          box-shadow: var(--mcq-cookie-shadow);
          border: 1px solid rgba(255,255,255,.55);
        }

        .mcq-cookie-dialog-head{
          padding: 18px 20px 8px;
        }

        .mcq-cookie-modal-brand{
          display: flex;
          align-items: center;
          gap: 14px;
          padding-right: 34px;
        }

        .mcq-cookie-modal-isoWrap{
          width: 50px;
          height: 50px;
          flex: 0 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mcq-cookie-modal-iso{
          width: 38px;
          height: 38px;
          display: block;
          object-fit: contain;
        }

        .mcq-cookie-modal-sep{
          width: 1px;
          align-self: stretch;
          background: linear-gradient(to bottom, transparent, rgba(0,0,0,.18), transparent);
          flex: 0 0 auto;
        }

        .mcq-cookie-modal-brandtext{
          min-width: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .mcq-cookie-modal-brandtext h3{
          margin: 0 0 4px;
          font-size: 22px;
          line-height: 1.12;
          letter-spacing: -.03em;
          font-family: 'Archivo Black', sans-serif;
          color: #000;
        }

        .mcq-cookie-modal-brandtext p{
          margin: 0;
          font-size: 13px;
          line-height: 1.5;
          color: rgba(0,0,0,.62);
        }

        .mcq-cookie-dialog-body{
          padding: 4px 20px 14px;
        }

        .mcq-cookie-intro{
          margin: 0 0 12px;
          font-size: 13px;
          line-height: 1.5;
          color: rgba(0,0,0,.70);
        }

        .mcq-cookie-accordion{
          display: grid;
          gap: 8px;
        }

        .mcq-cookie-item{
          border: 1px solid rgba(0,0,0,.08);
          border-radius: 16px;
          background: rgba(255,255,255,.52);
          overflow: hidden;
          box-shadow: 0 6px 16px rgba(0,0,0,.04);
        }

        .mcq-cookie-item-head{
          width: 100%;
          display: grid;
          grid-template-columns: 1fr auto auto;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          background: transparent;
          border: 0;
          cursor: pointer;
          text-align: left;
        }

        .mcq-cookie-item-titleWrap{
          min-width: 0;
        }

        .mcq-cookie-item-title{
          margin: 0 0 4px;
          font-size: 15px;
          line-height: 1.2;
          font-weight: 800;
          color: #111;
        }

        .mcq-cookie-item-sub{
          margin: 0;
          font-size: 12px;
          line-height: 1.4;
          color: rgba(0,0,0,.60);
        }

        .mcq-cookie-item-chevron{
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: rgba(0,0,0,.66);
          background: rgba(0,0,0,.05);
          transition: transform .25s ease;
          flex: 0 0 auto;
        }

        .mcq-cookie-item.is-open .mcq-cookie-item-chevron{
          transform: rotate(180deg);
        }

        .mcq-cookie-item-body{
          padding: 0 14px 12px;
          color: rgba(0,0,0,.72);
          font-size: 12.5px;
          line-height: 1.5;
        }

        .mcq-cookie-item-body[hidden]{
          display: none !important;
        }

        .mcq-cookie-item-body p{
          margin: 0;
        }

        .mcq-switch{
          position: relative;
          width: 48px;
          height: 28px;
          flex: 0 0 auto;
        }

        .mcq-switch input{
          position: absolute;
          inset: 0;
          opacity: 0;
          cursor: pointer;
          margin: 0;
          z-index: 2;
        }

        .mcq-switch-ui{
          width: 100%;
          height: 100%;
          display: block;
          border-radius: 999px;
          background: rgba(0,0,0,.16);
          position: relative;
          transition: background .24s ease, opacity .24s ease;
        }

        .mcq-switch-ui::after{
          content: "";
          position: absolute;
          top: 4px;
          left: 4px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #fff;
          box-shadow: 0 2px 8px rgba(0,0,0,.15);
          transition: transform .24s ease;
        }

        .mcq-switch input:checked + .mcq-switch-ui{
          background: var(--mcq-cookie-green);
        }

        .mcq-switch input:checked + .mcq-switch-ui::after{
          transform: translateX(20px);
        }

        .mcq-switch.is-disabled{
          opacity: .55;
          pointer-events: none;
        }

        .mcq-switch.is-disabled .mcq-switch-ui{
          background: var(--mcq-cookie-disabled);
        }

        .mcq-switch.is-disabled .mcq-switch-ui::after{
          background: rgba(255,255,255,.95);
        }

        .mcq-cookie-dialog-actions{
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          justify-content: flex-end;
          padding: 0 20px 18px;
        }

        @media (max-width: 720px){
          .mcq-cookie-item-head{
            grid-template-columns: 1fr auto;
            grid-template-areas:
              "title switch"
              "title chevron";
            align-items: center;
          }

          .mcq-cookie-item-titleWrap{
            grid-area: title;
          }

          .mcq-switch{
            grid-area: switch;
            justify-self: end;
          }

          .mcq-cookie-item-chevron{
            grid-area: chevron;
            justify-self: end;
          }
        }

        @media (max-width: 640px){
          .mcq-cookie-fab{
            left: 12px;
            bottom: 12px;
            width: 48px;
            height: 48px;
          }

          .mcq-cookie-fab i{
            font-size: 17px;
          }

          .mcq-cookie-banner-inner{
            padding: 12px 12px calc(12px + env(safe-area-inset-bottom, 0px));
          }

          .mcq-cookie-brand{
            margin-bottom: 6px;
          }

          .mcq-cookie-brand-logo{
            width: 96px;
          }

          .mcq-cookie-title{
            font-size: 16px;
            margin-bottom: 5px;
          }

          .mcq-cookie-text{
            font-size: 12px;
            line-height: 1.45;
          }

          .mcq-cookie-actions,
          .mcq-cookie-dialog-actions{
            flex-direction: column;
          }

          .mcq-cookie-actions{
            margin-top: 10px;
            gap: 7px;
          }

          .mcq-cookie-btn{
            width: 100%;
            padding: 10px 14px;
            font-size: 12.5px;
            border-radius: 14px;
          }

          .mcq-cookie-dialog{
            width: min(680px, calc(100vw - 16px));
            max-height: min(88vh, 760px);
            border-radius: 18px;
          }

          .mcq-cookie-dialog-head{
            padding: 16px 14px 6px;
          }

          .mcq-cookie-dialog-body{
            padding: 4px 14px 12px;
          }

          .mcq-cookie-dialog-actions{
            padding: 0 14px 14px;
          }

          .mcq-cookie-modal-brand{
            gap: 10px;
            padding-right: 28px;
            align-items: flex-start;
          }

          .mcq-cookie-modal-isoWrap{
            width: 40px;
            height: 40px;
          }

          .mcq-cookie-modal-iso{
            width: 30px;
            height: 30px;
          }

          .mcq-cookie-modal-brandtext h3{
            font-size: 18px;
          }

          .mcq-cookie-modal-brandtext p{
            font-size: 12px;
            line-height: 1.42;
          }

          .mcq-cookie-intro{
            font-size: 12px;
            line-height: 1.45;
            margin-bottom: 10px;
          }

          .mcq-cookie-item{
            border-radius: 14px;
          }

          .mcq-cookie-item-head{
            gap: 10px;
            padding: 10px 11px;
          }

          .mcq-cookie-item-title{
            font-size: 14px;
          }

          .mcq-cookie-item-sub{
            font-size: 11px;
            line-height: 1.35;
          }

          .mcq-cookie-item-body{
            padding: 0 11px 10px;
            font-size: 11.5px;
            line-height: 1.45;
          }

          .mcq-switch{
            width: 44px;
            height: 26px;
          }

          .mcq-switch-ui::after{
            width: 18px;
            height: 18px;
          }

          .mcq-switch input:checked + .mcq-switch-ui::after{
            transform: translateX(18px);
          }

          .mcq-cookie-item-chevron{
            width: 26px;
            height: 26px;
          }

          .mcq-cookie-dialog-close{
            top: 10px;
            right: 10px;
            width: 30px;
            height: 30px;
          }

          .mcq-cookie-dialog-close i{
            font-size: 12px;
          }
        }

        @media (min-width: 1024px){
          .mcq-cookie-banner-inner{
            padding: 12px 18px;
          }

          .mcq-cookie-actions{
            margin-top: 10px;
          }

          .mcq-cookie-dialog{
            width: min(640px, calc(100vw - 40px));
          }
        }
      `;
      document.head.appendChild(style);
    }

    function createFab() {
      if (qs('mcq-cookie-fab')) return;

      const btn = document.createElement('button');
      btn.id = 'mcq-cookie-fab';
      btn.className = 'mcq-cookie-fab';
      btn.type = 'button';
      btn.setAttribute('aria-label', 'Preferencias de cookies');
      btn.innerHTML = `<i class="bi bi-cookie"></i>`;
      document.body.appendChild(btn);
    }

    function createBanner() {
      if (qs('mcq-cookie-banner')) return;

      const banner = document.createElement('div');
      banner.id = 'mcq-cookie-banner';
      banner.className = 'mcq-cookie-banner';
      banner.innerHTML = `
        <div class="mcq-cookie-banner-inner">
          <button class="mcq-cookie-dialog-close" id="mcq-cookie-close-banner" aria-label="Cerrar aviso">
            <i class="bi bi-x-lg"></i>
          </button>

          <div class="mcq-cookie-brand">
            <img class="mcq-cookie-brand-logo" src="${CONFIG.logoUrl}" alt="${CONFIG.brandName}">
          </div>

          <h2 class="mcq-cookie-title">Usamos cookies y tecnologías similares</h2>
          <p class="mcq-cookie-text">
            Usamos cookies esenciales para que el sitio funcione y, con tu permiso, tecnologías de analítica y marketing para medir tráfico, mejorar la experiencia y conectar ciertas interacciones con plataformas externas.
          </p>

          <div class="mcq-cookie-actions">
            <button class="mcq-cookie-btn mcq-cookie-btn--primary" id="mcq-cookie-accept-all">Aceptar</button>
            <button class="mcq-cookie-btn mcq-cookie-btn--secondary2" id="mcq-cookie-reject-all">Rechazar</button>
            <button class="mcq-cookie-btn mcq-cookie-btn--ghost2" id="mcq-cookie-open-prefs">Personalizar</button>
          </div>
        </div>
      `;
      document.body.appendChild(banner);
    }

    function createModal() {
      if (qs('mcq-cookie-modal')) return;

      const modal = document.createElement('div');
      modal.id = 'mcq-cookie-modal';
      modal.className = 'mcq-cookie-modal';
      modal.hidden = true;
      modal.innerHTML = `
        <div class="mcq-cookie-dialog" role="dialog" aria-modal="true" aria-labelledby="mcq-cookie-modal-title">
          <button class="mcq-cookie-dialog-close" id="mcq-cookie-close-modal" aria-label="Cerrar">
            <i class="bi bi-x-lg"></i>
          </button>

          <div class="mcq-cookie-dialog-head">
            <div class="mcq-cookie-modal-brand">
              <div class="mcq-cookie-modal-isoWrap">
                <img class="mcq-cookie-modal-iso" src="${CONFIG.logoIsoUrl}" alt="${CONFIG.brandName}">
              </div>

              <div class="mcq-cookie-modal-sep"></div>

              <div class="mcq-cookie-modal-brandtext">
                <h3 id="mcq-cookie-modal-title">Preferencias de cookies</h3>
                <p>Controla qué datos quieres compartir para mejorar tu experiencia en CANALES.</p>
              </div>
            </div>
          </div>

          <div class="mcq-cookie-dialog-body">
            <p class="mcq-cookie-intro">
              Puedes mantener solo las cookies necesarias o activar categorías opcionales según el nivel de personalización y medición que prefieras. Cada opción incluye una explicación más detallada.
            </p>

            <div class="mcq-cookie-accordion">
              <section class="mcq-cookie-item is-open" data-item="essential">
                <button type="button" class="mcq-cookie-item-head" data-accordion-toggle="essential">
                  <div class="mcq-cookie-item-titleWrap">
                    <h4 class="mcq-cookie-item-title">Esenciales</h4>
                    <p class="mcq-cookie-item-sub">Necesarias para el funcionamiento básico del sitio.</p>
                  </div>

                  <label class="mcq-switch is-disabled" aria-label="Esenciales siempre activas">
                    <input type="checkbox" checked disabled>
                    <span class="mcq-switch-ui"></span>
                  </label>

                  <span class="mcq-cookie-item-chevron" aria-hidden="true">
                    <i class="bi bi-chevron-down"></i>
                  </span>
                </button>

                <div class="mcq-cookie-item-body" id="mcq-cookie-panel-essential">
                  <p>
                    Estas cookies permiten funciones mínimas e indispensables para que la web opere de manera estable, segura y coherente. Ayudan a conservar configuraciones técnicas básicas, mejorar la seguridad y asegurar que ciertas interacciones esenciales funcionen correctamente. Por su naturaleza, permanecen siempre activas.
                  </p>
                </div>
              </section>

              <section class="mcq-cookie-item" data-item="analytics">
                <button type="button" class="mcq-cookie-item-head" data-accordion-toggle="analytics">
                  <div class="mcq-cookie-item-titleWrap">
                    <h4 class="mcq-cookie-item-title">Analítica</h4>
                    <p class="mcq-cookie-item-sub">Medición, rendimiento y mejora de la experiencia.</p>
                  </div>

                  <label class="mcq-switch" aria-label="Activar analítica">
                    <input type="checkbox" id="mcq-consent-analytics">
                    <span class="mcq-switch-ui"></span>
                  </label>

                  <span class="mcq-cookie-item-chevron" aria-hidden="true">
                    <i class="bi bi-chevron-down"></i>
                  </span>
                </button>

                <div class="mcq-cookie-item-body" id="mcq-cookie-panel-analytics" hidden>
                  <p>
                    Estas tecnologías nos ayudan a entender cómo navegan los visitantes por el sitio: qué secciones funcionan mejor, cuánto tiempo permanecen en ellas, qué contenidos generan más interés y dónde conviene optimizar la experiencia. No son indispensables para que la web funcione, pero sí muy útiles para mejorar su desempeño y usabilidad con el tiempo.
                  </p>
                </div>
              </section>

              <section class="mcq-cookie-item" data-item="marketing">
                <button type="button" class="mcq-cookie-item-head" data-accordion-toggle="marketing">
                  <div class="mcq-cookie-item-titleWrap">
                    <h4 class="mcq-cookie-item-title">Marketing</h4>
                    <p class="mcq-cookie-item-sub">Campañas, seguimiento y conexión con plataformas externas.</p>
                  </div>

                  <label class="mcq-switch" aria-label="Activar marketing">
                    <input type="checkbox" id="mcq-consent-marketing">
                    <span class="mcq-switch-ui"></span>
                  </label>

                  <span class="mcq-cookie-item-chevron" aria-hidden="true">
                    <i class="bi bi-chevron-down"></i>
                  </span>
                </button>

                <div class="mcq-cookie-item-body" id="mcq-cookie-panel-marketing" hidden>
                  <p>
                    Estas tecnologías permiten medir el rendimiento de campañas, relacionar interacciones del sitio con servicios externos como Meta o Google y facilitar acciones publicitarias o de seguimiento. No son necesarias para el funcionamiento del sitio y puedes desactivarlas sin afectar la navegación principal.
                  </p>
                </div>
              </section>
            </div>
          </div>

          <div class="mcq-cookie-dialog-actions">
            <button class="mcq-cookie-btn mcq-cookie-btn--secondary" id="mcq-cookie-reject-optional">Rechazar opcionales</button>
            <button class="mcq-cookie-btn mcq-cookie-btn--ghost" id="mcq-cookie-save-prefs">Guardar preferencias</button>
            <button class="mcq-cookie-btn mcq-cookie-btn--primary" id="mcq-cookie-accept-all-modal">Aceptar todo</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    function setAccordionState(name, isOpen) {
      const item = document.querySelector(`.mcq-cookie-item[data-item="${name}"]`);
      const body = qs(`mcq-cookie-panel-${name}`);
      if (!item || !body) return;

      item.classList.toggle('is-open', isOpen);
      body.hidden = !isOpen;
    }

    function toggleAccordion(name) {
      const current = document.querySelector(`.mcq-cookie-item[data-item="${name}"]`);
      const willOpen = current ? !current.classList.contains('is-open') : false;

      ['essential', 'analytics', 'marketing'].forEach(itemName => {
        setAccordionState(itemName, itemName === name ? willOpen : false);
      });
    }

    function hideBanner() {
      const el = qs('mcq-cookie-banner');
      if (el) el.style.display = 'none';
    }

    function showBanner() {
      const el = qs('mcq-cookie-banner');
      if (el) el.style.display = '';
    }

    function openModal() {
      const consent = getConsent() || { analytics: false, marketing: false };
      const analytics = qs('mcq-consent-analytics');
      const marketing = qs('mcq-consent-marketing');

      if (analytics) analytics.checked = !!consent.analytics;
      if (marketing) marketing.checked = !!consent.marketing;

      const modal = qs('mcq-cookie-modal');
      if (modal) modal.hidden = false;
    }

    function closeModal() {
      const modal = qs('mcq-cookie-modal');
      if (modal) modal.hidden = true;
    }

    function setFabState(mode) {
      const fab = qs('mcq-cookie-fab');
      if (!fab) return;

      fab.classList.remove('is-accepted', 'has-alert');

      if (mode === 'accepted') fab.classList.add('is-accepted');
      if (mode === 'alert') fab.classList.add('has-alert');
    }

    function syncFabStateFromConsent() {
      const consent = getConsent();

      if (!consent) {
        setFabState(null);
        return;
      }

      if (consent.uiState === 'accepted') {
        setFabState('accepted');
        return;
      }

      if (consent.uiState === 'alert') {
        setFabState('alert');
        return;
      }

      setFabState(null);
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
        injectScript({
          id: 'mcq-ga-src',
          src: `https://www.googletagmanager.com/gtag/js?id=${CONFIG.gaId}`
        });

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
          attrs: {
            'data-cf-beacon': JSON.stringify({ token: CONFIG.cloudflareToken })
          }
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

        injectHiddenIframe({
          id: 'mcq-gtm-noscript-frame',
          src: `https://www.googletagmanager.com/ns.html?id=${CONFIG.gtmId}`
        });

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

        injectHiddenImage({
          id: 'mcq-meta-pixel-noscript',
          src: `https://www.facebook.com/tr?id=${CONFIG.metaPixelId}&ev=PageView&noscript=1`
        });

        injectScript({
          id: 'mcq-adsense',
          src: `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CONFIG.adsenseClient}`,
          attrs: {
            crossorigin: 'anonymous'
          }
        });
      }
    }

    function acceptAll() {
      const consent = {
        essential: true,
        analytics: true,
        marketing: true,
        uiState: 'accepted',
        dismissed: true,
        updatedAt: new Date().toISOString()
      };

      saveConsent(consent);
      applyConsent(consent);
      hideBanner();
      closeModal();
      setFabState('accepted');
    }

    function rejectOptional() {
      const consent = {
        essential: true,
        analytics: false,
        marketing: false,
        uiState: 'alert',
        dismissed: true,
        updatedAt: new Date().toISOString()
      };

      saveConsent(consent);
      hideBanner();
      closeModal();
      setFabState('alert');
    }

    function dismissBannerWithAlert() {
      const consent = {
        essential: true,
        analytics: false,
        marketing: false,
        uiState: 'alert',
        dismissed: true,
        updatedAt: new Date().toISOString()
      };

      saveConsent(consent);
      hideBanner();
      closeModal();
      setFabState('alert');
    }

    function savePreferences() {
      const analytics = qs('mcq-consent-analytics')?.checked || false;
      const marketing = qs('mcq-consent-marketing')?.checked || false;

      const allOptionalAccepted = analytics && marketing;

      const consent = {
        essential: true,
        analytics,
        marketing,
        uiState: allOptionalAccepted ? 'accepted' : 'alert',
        dismissed: true,
        updatedAt: new Date().toISOString()
      };

      saveConsent(consent);
      applyConsent(consent);
      hideBanner();
      closeModal();
      setFabState(allOptionalAccepted ? 'accepted' : 'alert');
    }

    function bindEvents() {
      qs('mcq-cookie-fab')?.addEventListener('click', openModal);
      qs('mcq-cookie-open-prefs')?.addEventListener('click', openModal);
      qs('mcq-cookie-close-modal')?.addEventListener('click', closeModal);
      qs('mcq-cookie-close-banner')?.addEventListener('click', dismissBannerWithAlert);

      qs('mcq-cookie-accept-all')?.addEventListener('click', acceptAll);
      qs('mcq-cookie-accept-all-modal')?.addEventListener('click', acceptAll);

      qs('mcq-cookie-reject-all')?.addEventListener('click', rejectOptional);
      qs('mcq-cookie-reject-optional')?.addEventListener('click', rejectOptional);

      qs('mcq-cookie-save-prefs')?.addEventListener('click', savePreferences);

      qs('mcq-cookie-modal')?.addEventListener('click', (e) => {
        if (e.target?.id === 'mcq-cookie-modal') closeModal();
      });

      document.querySelectorAll('[data-accordion-toggle]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const switchClicked = e.target.closest('.mcq-switch');
          if (switchClicked) return;

          const name = btn.getAttribute('data-accordion-toggle');
          if (name) toggleAccordion(name);
        });
      });
    }

    function init() {
      injectAssets();
      injectStyles();
      createFab();
      createBanner();
      createModal();
      bindEvents();

      const consent = getConsent();

      if (!consent) {
        showBanner();
        setFabState(null);
        return;
      }

      hideBanner();
      applyConsent(consent);
      syncFabStateFromConsent();
    }

    return { init, reset: removeConsent };
  })();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', CookieConsentUI.init);
  } else {
    CookieConsentUI.init();
  }
})();