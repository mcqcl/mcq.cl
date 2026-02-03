(() => {
  // ===== Config =====
  const APP_ID = 'app';

  // Si NO quieres GTM, ponlo en null:
  const GTM_ID = 'GTM-5CHVZHH';

  const ICONS_CSS = 'https://cdn.mcq.cl/assets/vendor/bootstrap-icons-2/bootstrap-icons.css';
  const FONTS_CSS = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap';

  // CSS encapsulado (externo)
  const CORE_CSS_URL = 'https://cdn.mcq.cl/sitio/canales.css';

  // ===== Helpers =====
  const $id = (id) => document.getElementById(id);

  function safeJson(){
    try{
      const raw = document.getElementById('pageData')?.textContent || '{}';
      return JSON.parse(raw);
    }catch(e){
      return {};
    }
  }

  function fmtDate(iso){
    const m = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
    const d = iso ? new Date(iso + "T12:00:00") : new Date();
    const dd = String(d.getDate()).padStart(2,'0');
    return `${dd} ${m[d.getMonth()]} ${d.getFullYear()}`;
  }

  function resolveHero(data){
    const hero = (data.heroImage || "").trim();
    if (!hero) return "";
    if (/^https?:\/\//i.test(hero)) return hero;

    const base = (data.heroBase || "").trim();
    return base
      ? (base.replace(/\/+$/,'') + "/" + hero.replace(/^\/+/,''))
      : hero;
  }

  function addLink(rel, href, extra={}){
    if (!href) return;
    const exists = document.head.querySelector(`link[rel="${rel}"][href="${href}"]`);
    if (exists) return;
    const node = document.createElement('link');
    node.rel = rel;
    node.href = href;
    for (const [k,v] of Object.entries(extra)) node.setAttribute(k, v);
    document.head.appendChild(node);
  }

  function setMeta(attr, key, content){
    let m = document.head.querySelector(`meta[${attr}="${key}"]`);
    if (!m){
      m = document.createElement('meta');
      m.setAttribute(attr, key);
      document.head.appendChild(m);
    }
    m.setAttribute('content', content || '');
  }

  function setCanonical(url){
    let l = document.head.querySelector('link[rel="canonical"]');
    if (!l){
      l = document.createElement('link');
      l.rel = 'canonical';
      document.head.appendChild(l);
    }
    l.href = url;
  }

  function injectGTM(){
    if (!GTM_ID) return;

    if (!document.getElementById('gtm-script')){
      const s = document.createElement('script');
      s.id = 'gtm-script';
      s.text = `
        (function(w,d,s,l,i){
          w[l]=w[l]||[];
          w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
          var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),
              dl=l!='dataLayer'?'&l='+l:'';
          j.async=true;
          j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
          f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${GTM_ID}');
      `;
      document.head.appendChild(s);
    }

    if (!document.getElementById('gtm-noscript')){
      const ns = document.createElement('noscript');
      ns.id = 'gtm-noscript';
      ns.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}"
        height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
      document.body.prepend(ns);
    }
  }

  function injectAssets(){
    addLink('stylesheet', ICONS_CSS);
    addLink('stylesheet', FONTS_CSS);
    addLink('stylesheet', CORE_CSS_URL);
  }

  // ===== UI / Toast =====
  function showToast(msg){
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg || 'Listo ✅';
    t.style.display = 'block';
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => { t.style.display = 'none'; }, 1400);
  }

  function openPopup(url){
    const w = 720, h = 720;
    const y = (window.outerHeight / 2) + window.screenY - (h / 2);
    const x = (window.outerWidth / 2) + window.screenX - (w / 2);
    const win = window.open(url, "_blank", `noopener,noreferrer,width=${w},height=${h},left=${x},top=${y}`);
    if (!win) window.open(url, "_blank", "noopener,noreferrer");
  }

  async function copyText(text){
    try{
      if (navigator.clipboard && window.isSecureContext){
        await navigator.clipboard.writeText(text);
        return true;
      }
    }catch(e){}
    try{
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly','');
      ta.style.position='fixed';
      ta.style.top='-9999px';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      ta.remove();
      return ok;
    }catch(e){
      return false;
    }
  }

  // ===== Layout =====
  function mountLayout(){
    const app = document.getElementById(APP_ID);
    if (!app) throw new Error('No existe #app');

    app.innerHTML = `
      <header>
        <div class="container">
          <div class="header-inner">
            <a href="/" aria-label="CANALES">
              <img class="logo" src="https://cdn.mcq.cl/logo/canales-white.svg" alt="CANALES" />
            </a>

            <a class="btn btn-primary header-follow"
              href="https://canales.pe" target="_blank" rel="noopener noreferrer">
              Ir a <strong>CANALES.PE</strong>
            </a>
          </div>
        </div>
      </header>

      <main class="container">
        <div class="portal-grid">

          <section class="card hero">
            <div class="pad pad-lg">
              <div class="kicker" id="pageKicker">Página</div>
              <h1 class="h1" id="title">Cargando…</h1>

              <div class="meta-line">
                <span><i class="bi bi-calendar3"></i> <strong id="date">—</strong></span>
                <span><i class="bi bi-clock"></i> <span id="readTime">—</span></span>
                <span><i class="bi bi-geo-alt"></i> <span id="place">—</span></span>
              </div>
            </div>
          </section>

          <section class="card side">
            <div class="pad">
              <div class="side-stack">

                <div class="panel">
                  <div class="panel-title">
                    <strong><i class="bi bi-person-badge"></i> Ficha</strong>
                    <span class="badge" id="docBadge">Oficial</span>
                  </div>

                  <div class="kv">
                    <div class="kv-row">
                      <span>Autor</span>
                      <strong id="author">—</strong>
                    </div>
                    <div class="kv-row">
                      <span>Publicado</span>
                      <strong id="published">—</strong>
                    </div>
                  </div>
                </div>

                <div class="panel">
                  <div class="panel-title">
                    <strong><i class="bi bi-share-fill"></i> Compartir</strong>
                    <span class="badge">Rápido</span>
                  </div>

                  <div class="btn-grid">
                    <a class="btn btn-ghost btn-sm" id="shareX" href="#"><i class="bi bi-twitter-x"></i> X</a>
                    <a class="btn btn-ghost btn-sm" id="shareWA" href="#"><i class="bi bi-whatsapp"></i> WA</a>
                    <a class="btn btn-ghost btn-sm" id="shareFB" href="#"><i class="bi bi-facebook"></i> FB</a>
                    <button class="btn btn-primary btn-sm" id="copyLinkBtn" type="button"><i class="bi bi-link-45deg"></i> Link</button>
                  </div>
                </div>

              </div>
            </div>
          </section>

          <section class="card article">
            <div class="pad">
              <div class="kicker">Contenido</div>
              <div class="divider"></div>
              <div class="prose" id="content"></div>
            </div>
          </section>

        </div>

        <section id="footer" class="card">
          <div class="pad">
            <div class="footer-bar">
              <div class="footer-left">
                <a href="https://www.canales.pe" target="_blank" rel="noopener noreferrer" aria-label="Ir a canales.pe">
                  <img class="footer-logo-canales" src="https://cdn.mcq.cl/logo/canales-white.svg" alt="CANALES" loading="lazy" />
                </a>
              </div>

              <div class="footer-center">
                <div class="footer-copyright">
                  © <span id="y"></span> | Todos los derechos reservados | <strong>CANALES</strong> <span style="font-weight:900;opacity:.95;">®</span>
                </div>
                <div class="footer-note">
                  <strong>CANALES</strong> <span style="font-weight:900;opacity:.95;">®</span> es una marca registrada de Manuel Canales Q.
                </div>
                <div class="footer-underline" aria-hidden="true"></div>
              </div>

              <div class="footer-right">
                <img class="footer-hecho" src="https://cdn.mcq.cl/assets/img/hecho-en-lima.png" alt="Hecho en Lima" loading="lazy" />
              </div>
            </div>
          </div>
        </section>
      </main>

      <div class="toast" id="toast" aria-live="polite">Listo ✅</div>
    `;
  }

  // ===== Render =====
  function render(data){
    const title = (data.title || 'CANALES').trim();
    const desc  = (data.description || '').trim();
    const author = data.author || '—';
    const place  = data.place || 'Lima, Perú';
    const pubISO = (data.published || '').trim();
    const pubStr = fmtDate(pubISO);
    const hero   = resolveHero(data);
    const ogImg  = data.ogImage || 'https://cdn.mcq.cl/assets/img/generico.png';

    // UI
    document.title = `${title} | CANALES`;
    const headTitle = document.querySelector('head > title');
    if (headTitle) headTitle.textContent = document.title;

    $id('pageKicker').textContent = data.kicker || 'Página';
    $id('title').textContent = title;

    $id('place').textContent = place;
    $id('author').textContent = author;

    const d = pubISO ? pubStr : fmtDate();
    $id('date').textContent = d;
    $id('published').textContent = d;

    if (hero){
      document.documentElement.style.setProperty('--hero-img', `url("${hero}")`);
    }

    $id('content').innerHTML = data.bodyHtml || '<p>—</p>';

    // Read time
    const words = ($id('content').textContent || '').trim().split(/\s+/).filter(Boolean).length;
    const mins = Math.max(1, Math.round(words / 200));
    $id('readTime').textContent = `${mins} min`;

    // Footer year
    $id('y').textContent = new Date().getFullYear();

    // Metas (para navegación; previews pueden ignorar JS)
    setMeta('name','description', desc);
    setMeta('name','author', author);
    setMeta('property','og:type', 'website');
    setMeta('property','og:site_name', 'CANALES');
    setMeta('property','og:title', title);
    setMeta('property','og:description', desc);
    setMeta('property','og:url', window.location.href);
    setMeta('property','og:image', ogImg);
    setMeta('name','twitter:card', 'summary_large_image');
    setMeta('name','twitter:site', '@manuelcanales');
    setMeta('name','twitter:creator', '@manuelcanales');
    setMeta('name','twitter:title', title);
    setMeta('name','twitter:description', desc);
    setMeta('name','twitter:image', ogImg);
    setCanonical(window.location.href);

    // Share
    const pageUrl = window.location.href;

    $id('copyLinkBtn')?.addEventListener('click', async () => {
      const ok = await copyText(pageUrl);
      showToast(ok ? 'Link copiado ✅' : 'No se pudo copiar ❌');
    });

    $id('shareX')?.addEventListener('click', (e) => {
      e.preventDefault();
      const u = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(title) +
                "&url=" + encodeURIComponent(pageUrl) +
                "&via=" + encodeURIComponent("manuelcanales");
      openPopup(u);
    });

    $id('shareWA')?.addEventListener('click', (e) => {
      e.preventDefault();
      const u = "https://wa.me/?text=" + encodeURIComponent(title + " " + pageUrl);
      openPopup(u);
    });

    $id('shareFB')?.addEventListener('click', (e) => {
      e.preventDefault();
      const isPublicHttps = /^https:\/\//i.test(pageUrl) && !/localhost|127\.0\.0\.1/i.test(pageUrl);
      if (!isPublicHttps){
        showToast("Facebook requiere URL pública en https ✅");
        return;
      }
      const u = "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(pageUrl);
      openPopup(u);
    });
  }

  // ===== Boot =====
  function boot(){
    injectAssets();
    injectGTM();
    mountLayout();
    render(safeJson());
  }

  boot();
})();
(() => {
  // ===== Config =====
  const APP_ID = 'app';

  // Si NO quieres GTM, ponlo en null:
  const GTM_ID = 'GTM-5CHVZHH';

  const ICONS_CSS = 'https://cdn.mcq.cl/assets/vendor/bootstrap-icons-2/bootstrap-icons.css';
  const FONTS_CSS = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap';

  // CSS encapsulado (externo)
  const CORE_CSS_URL = 'https://cdn.mcq.cl/sitio/canales.css';

  // ===== Helpers =====
  const $id = (id) => document.getElementById(id);

  function safeJson(){
    try{
      const raw = document.getElementById('pageData')?.textContent || '{}';
      return JSON.parse(raw);
    }catch(e){
      return {};
    }
  }

  function fmtDate(iso){
    const m = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
    const d = iso ? new Date(iso + "T12:00:00") : new Date();
    const dd = String(d.getDate()).padStart(2,'0');
    return `${dd} ${m[d.getMonth()]} ${d.getFullYear()}`;
  }

  function resolveHero(data){
    const hero = (data.heroImage || "").trim();
    if (!hero) return "";
    if (/^https?:\/\//i.test(hero)) return hero;

    const base = (data.heroBase || "").trim();
    return base
      ? (base.replace(/\/+$/,'') + "/" + hero.replace(/^\/+/,''))
      : hero;
  }

  function addLink(rel, href, extra={}){
    if (!href) return;
    const exists = document.head.querySelector(`link[rel="${rel}"][href="${href}"]`);
    if (exists) return;
    const node = document.createElement('link');
    node.rel = rel;
    node.href = href;
    for (const [k,v] of Object.entries(extra)) node.setAttribute(k, v);
    document.head.appendChild(node);
  }

  function setMeta(attr, key, content){
    let m = document.head.querySelector(`meta[${attr}="${key}"]`);
    if (!m){
      m = document.createElement('meta');
      m.setAttribute(attr, key);
      document.head.appendChild(m);
    }
    m.setAttribute('content', content || '');
  }

  function setCanonical(url){
    let l = document.head.querySelector('link[rel="canonical"]');
    if (!l){
      l = document.createElement('link');
      l.rel = 'canonical';
      document.head.appendChild(l);
    }
    l.href = url;
  }

  function injectGTM(){
    if (!GTM_ID) return;

    if (!document.getElementById('gtm-script')){
      const s = document.createElement('script');
      s.id = 'gtm-script';
      s.text = `
        (function(w,d,s,l,i){
          w[l]=w[l]||[];
          w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
          var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),
              dl=l!='dataLayer'?'&l='+l:'';
          j.async=true;
          j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
          f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${GTM_ID}');
      `;
      document.head.appendChild(s);
    }

    if (!document.getElementById('gtm-noscript')){
      const ns = document.createElement('noscript');
      ns.id = 'gtm-noscript';
      ns.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}"
        height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
      document.body.prepend(ns);
    }
  }

  function injectAssets(){
    addLink('stylesheet', ICONS_CSS);
    addLink('stylesheet', FONTS_CSS);
    addLink('stylesheet', CORE_CSS_URL);
  }

  // ===== UI / Toast =====
  function showToast(msg){
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg || 'Listo ✅';
    t.style.display = 'block';
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => { t.style.display = 'none'; }, 1400);
  }

  function openPopup(url){
    const w = 720, h = 720;
    const y = (window.outerHeight / 2) + window.screenY - (h / 2);
    const x = (window.outerWidth / 2) + window.screenX - (w / 2);
    const win = window.open(url, "_blank", `noopener,noreferrer,width=${w},height=${h},left=${x},top=${y}`);
    if (!win) window.open(url, "_blank", "noopener,noreferrer");
  }

  async function copyText(text){
    try{
      if (navigator.clipboard && window.isSecureContext){
        await navigator.clipboard.writeText(text);
        return true;
      }
    }catch(e){}
    try{
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly','');
      ta.style.position='fixed';
      ta.style.top='-9999px';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      ta.remove();
      return ok;
    }catch(e){
      return false;
    }
  }

  // ===== Layout =====
  function mountLayout(){
    const app = document.getElementById(APP_ID);
    if (!app) throw new Error('No existe #app');

    app.innerHTML = `
      <header>
        <div class="container">
          <div class="header-inner">
            <a href="/" aria-label="CANALES">
              <img class="logo" src="https://cdn.mcq.cl/logo/canales-white.svg" alt="CANALES" />
            </a>

            <a class="btn btn-primary header-follow"
              href="https://canales.pe" target="_blank" rel="noopener noreferrer">
              Ir a <strong>CANALES.PE</strong>
            </a>
          </div>
        </div>
      </header>

      <main class="container">
        <div class="portal-grid">

          <section class="card hero">
            <div class="pad pad-lg">
              <div class="kicker" id="pageKicker">Página</div>
              <h1 class="h1" id="title">Cargando…</h1>

              <div class="meta-line">
                <span><i class="bi bi-calendar3"></i> <strong id="date">—</strong></span>
                <span><i class="bi bi-clock"></i> <span id="readTime">—</span></span>
                <span><i class="bi bi-geo-alt"></i> <span id="place">—</span></span>
              </div>
            </div>
          </section>

          <section class="card side">
            <div class="pad">
              <div class="side-stack">

                <div class="panel">
                  <div class="panel-title">
                    <strong><i class="bi bi-person-badge"></i> Ficha</strong>
                    <span class="badge" id="docBadge">Oficial</span>
                  </div>

                  <div class="kv">
                    <div class="kv-row">
                      <span>Autor</span>
                      <strong id="author">—</strong>
                    </div>
                    <div class="kv-row">
                      <span>Publicado</span>
                      <strong id="published">—</strong>
                    </div>
                  </div>
                </div>

                <div class="panel">
                  <div class="panel-title">
                    <strong><i class="bi bi-share-fill"></i> Compartir</strong>
                    <span class="badge">Rápido</span>
                  </div>

                  <div class="btn-grid">
                    <a class="btn btn-ghost btn-sm" id="shareX" href="#"><i class="bi bi-twitter-x"></i> X</a>
                    <a class="btn btn-ghost btn-sm" id="shareWA" href="#"><i class="bi bi-whatsapp"></i> WA</a>
                    <a class="btn btn-ghost btn-sm" id="shareFB" href="#"><i class="bi bi-facebook"></i> FB</a>
                    <button class="btn btn-primary btn-sm" id="copyLinkBtn" type="button"><i class="bi bi-link-45deg"></i> Link</button>
                  </div>
                </div>

              </div>
            </div>
          </section>

          <section class="card article">
            <div class="pad">
              <div class="kicker">Contenido</div>
              <div class="divider"></div>
              <div class="prose" id="content"></div>
            </div>
          </section>

        </div>

        <section id="footer" class="card">
          <div class="pad">
            <div class="footer-bar">
              <div class="footer-left">
                <a href="https://www.canales.pe" target="_blank" rel="noopener noreferrer" aria-label="Ir a canales.pe">
                  <img class="footer-logo-canales" src="https://cdn.mcq.cl/logo/canales-white.svg" alt="CANALES" loading="lazy" />
                </a>
              </div>

              <div class="footer-center">
                <div class="footer-copyright">
                  © <span id="y"></span> | Todos los derechos reservados | <strong>CANALES</strong> <span style="font-weight:900;opacity:.95;">®</span>
                </div>
                <div class="footer-note">
                  <strong>CANALES</strong> <span style="font-weight:900;opacity:.95;">®</span> es una marca registrada de Manuel Canales Q.
                </div>
                <div class="footer-underline" aria-hidden="true"></div>
              </div>

              <div class="footer-right">
                <img class="footer-hecho" src="https://cdn.mcq.cl/assets/img/hecho-en-lima.png" alt="Hecho en Lima" loading="lazy" />
              </div>
            </div>
          </div>
        </section>
      </main>

      <div class="toast" id="toast" aria-live="polite">Listo ✅</div>
    `;
  }

  // ===== Render =====
  function render(data){
    const title = (data.title || 'CANALES').trim();
    const desc  = (data.description || '').trim();
    const author = data.author || '—';
    const place  = data.place || 'Lima, Perú';
    const pubISO = (data.published || '').trim();
    const pubStr = fmtDate(pubISO);
    const hero   = resolveHero(data);
    const ogImg  = data.ogImage || 'https://cdn.mcq.cl/assets/img/generico.png';

    // UI
    document.title = `${title} | CANALES`;
    const headTitle = document.querySelector('head > title');
    if (headTitle) headTitle.textContent = document.title;

    $id('pageKicker').textContent = data.kicker || 'Página';
    $id('title').textContent = title;

    $id('place').textContent = place;
    $id('author').textContent = author;

    const d = pubISO ? pubStr : fmtDate();
    $id('date').textContent = d;
    $id('published').textContent = d;

    if (hero){
      document.documentElement.style.setProperty('--hero-img', `url("${hero}")`);
    }

    $id('content').innerHTML = data.bodyHtml || '<p>—</p>';

    // Read time
    const words = ($id('content').textContent || '').trim().split(/\s+/).filter(Boolean).length;
    const mins = Math.max(1, Math.round(words / 200));
    $id('readTime').textContent = `${mins} min`;

    // Footer year
    $id('y').textContent = new Date().getFullYear();

    // Metas (para navegación; previews pueden ignorar JS)
    setMeta('name','description', desc);
    setMeta('name','author', author);
    setMeta('property','og:type', 'website');
    setMeta('property','og:site_name', 'CANALES');
    setMeta('property','og:title', title);
    setMeta('property','og:description', desc);
    setMeta('property','og:url', window.location.href);
    setMeta('property','og:image', ogImg);
    setMeta('name','twitter:card', 'summary_large_image');
    setMeta('name','twitter:site', '@manuelcanales');
    setMeta('name','twitter:creator', '@manuelcanales');
    setMeta('name','twitter:title', title);
    setMeta('name','twitter:description', desc);
    setMeta('name','twitter:image', ogImg);
    setCanonical(window.location.href);

    // Share
    const pageUrl = window.location.href;

    $id('copyLinkBtn')?.addEventListener('click', async () => {
      const ok = await copyText(pageUrl);
      showToast(ok ? 'Link copiado ✅' : 'No se pudo copiar ❌');
    });

    $id('shareX')?.addEventListener('click', (e) => {
      e.preventDefault();
      const u = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(title) +
                "&url=" + encodeURIComponent(pageUrl) +
                "&via=" + encodeURIComponent("manuelcanales");
      openPopup(u);
    });

    $id('shareWA')?.addEventListener('click', (e) => {
      e.preventDefault();
      const u = "https://wa.me/?text=" + encodeURIComponent(title + " " + pageUrl);
      openPopup(u);
    });

    $id('shareFB')?.addEventListener('click', (e) => {
      e.preventDefault();
      const isPublicHttps = /^https:\/\//i.test(pageUrl) && !/localhost|127\.0\.0\.1/i.test(pageUrl);
      if (!isPublicHttps){
        showToast("Facebook requiere URL pública en https ✅");
        return;
      }
      const u = "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(pageUrl);
      openPopup(u);
    });
  }

  // ===== Boot =====
  function boot(){
    injectAssets();
    injectGTM();
    mountLayout();
    render(safeJson());
  }

  boot();
})();
