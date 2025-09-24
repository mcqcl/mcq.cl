function upsertViewportFitCover() {
  // Asegura viewport-fit=cover (safe areas iOS)
  let meta = document.querySelector('meta[name="viewport"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1, viewport-fit=cover';
    document.head.appendChild(meta);
  } else if (!/viewport-fit=cover/.test(meta.content)) {
    meta.content = meta.content.replace(/\s+$/,'') + ', viewport-fit=cover';
  }
}

function injectCSS() {
  const style = document.createElement('style');
  style.innerHTML = `
    :root { --glow-duration:1.5s; }

    /* TRUCO ANTI-FUGAS: oculta TODO menos el loader mientras carga */
    body.mcq-loading > *:not(#loadermcq) { visibility: hidden !important; }

    body::before{
      content:"";
      position:fixed; inset:0;
      background:linear-gradient(270deg, rgba(40,40,40,1), rgba(0,0,0,1));
      z-index: 99; display:block;
    }
    body.preloaded::before{ display:none; }

    body{ margin:0; position:relative; min-height:100vh; font-family:Arial, sans-serif; }

    .loadermcq{
      position: fixed;
      left: 0; top: 0; right: 0; /* height se setea por JS con VisualViewport */
      display:flex; flex-direction:column; justify-content:center; align-items:center;
      z-index: 2147483647;  /* MÁS ALTO QUE TODO */
      opacity:1; transition:opacity .5s ease;
      padding: env(safe-area-inset-top,0) env(safe-area-inset-right,0)
               env(safe-area-inset-bottom,0) env(safe-area-inset-left,0);
      will-change: height, top;
      background: transparent;
      transform: translateZ(0);
    }

    /* Mover el gradiente animado a un pseudo-elemento pegado al tamaño real */
    .loadermcq::before{
      content:"";
      position:absolute; inset:0;
      background: linear-gradient(270deg, rgba(40,40,40,1), rgba(0,0,0,1));
      background-size: 600% 600%;
      animation: backgroundAnimation 9s linear infinite;
      z-index: -1;
      will-change: transform;
    }

    .imgloader{
      width:30vw; height:auto; max-width:250px;
      filter: drop-shadow(0 0 2px #ffffff);
      animation: glow var(--glow-duration) ease-in-out infinite;
    }
    .imgloader.scale-in{ animation: scaleIn .4s ease forwards; }

    @keyframes backgroundAnimation{
      0%{background-position:0% 50%}
      50%{background-position:100% 50%}
      100%{background-position:0% 50%}
    }
    @keyframes glow{
      0%,100%{ filter: drop-shadow(0 0 1px #ffffff) }
      50%{ filter: drop-shadow(0 0 5px #3A3938) }
    }
    @keyframes scaleIn{ 0%{transform:scale(1)} 100%{transform:scale(1.2)} }

    @media (max-width:768px){ .imgloader{ width:30vw } }
    @media (max-width:576px){ .imgloader{ width:40vw } }

    html.mcq-lock, body.mcq-lock{
      overflow:hidden !important;
      touch-action:none !important;
      overscroll-behavior:contain !important;
    }
  `;
  document.head.appendChild(style);
}

/* Ajuste exacto con VisualViewport (iOS 26) */
function applyViewportSizing(el) {
  const vv = window.visualViewport;
  const update = () => {
    if (vv) {
      const h = Math.ceil(vv.height);
      const top = Math.ceil(vv.offsetTop);
      el.style.height = (h > 0 ? h : Math.max(window.innerHeight, document.documentElement.clientHeight)) + 'px';
      el.style.top = (h > 0 ? top : 0) + 'px';
      el.style.right = '0';
      el.style.left  = '0';
    } else {
      el.style.height = Math.max(window.innerHeight, document.documentElement.clientHeight) + 'px';
      el.style.top = '0px';
      el.style.right = '0';
      el.style.left  = '0';
    }
  };
  update();
  if (vv) {
    vv.addEventListener('resize', update);
    vv.addEventListener('scroll', update);
  }
  window.addEventListener('orientationchange', update);
  window.addEventListener('resize', update);
}

function showPreloader() {
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  const svgUrl = isMobile
    ? "https://cdn.mcq.cl/logo/canales-iso-white.svg"
    : "https://cdn.mcq.cl/logo/canales-white.svg";

  const preloaderHtml = `
    <div class="loadermcq" id="loadermcq" aria-busy="true" aria-label="Cargando">
      <div class="imgloader" id="imgloader">
        <object id="svg-object" type="image/svg+xml" data="${svgUrl}" style="width:100%;height:auto;"></object>
      </div>
    </div>
  `;

  if (!document.getElementById("loadermcq")) {
    document.body.insertAdjacentHTML('afterbegin', preloaderHtml);
  }

  // Bloqueos y ocultación total del resto
  document.documentElement.classList.add('mcq-lock');
  document.body.classList.add('mcq-lock', 'mcq-loading');

  const preloader = document.getElementById("loadermcq");
  const imgWrapper = document.getElementById("imgloader");

  // Forzar cobertura exacta
  applyViewportSizing(preloader);

  // Evita scroll bajo overlay en iOS
  preloader.addEventListener('touchmove', (e)=>e.preventDefault(), { passive:false });

  window.addEventListener("load", () => {
    setTimeout(() => {
      imgWrapper.classList.add('scale-in');
      setTimeout(() => {
        preloader.style.opacity = "0";
        setTimeout(() => {
          preloader.remove();
          document.body.classList.add("preloaded");
          // Restaurar
          document.documentElement.classList.remove('mcq-lock');
          document.body.classList.remove('mcq-lock', 'mcq-loading');
        }, 500);
      }, 400);
    }, 4000); // tu tiempo visible
  });
}

// Boot
document.addEventListener("DOMContentLoaded", () => {
  upsertViewportFitCover();
  injectCSS();
  showPreloader();
});
