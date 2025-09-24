function injectCSS() {
  const style = document.createElement('style');
  style.innerHTML = `
    :root{
      --glow-duration:1.5s;
      /* Fallback para iOS: se actualiza vía JS con window.innerHeight */
      --vh: 1vh;
    }

    /* Fondo base (puede quedarse) */
    body::before{
      content:"";
      position:fixed;
      inset:0;
      background:linear-gradient(270deg,rgba(40,40,40,1),rgba(0,0,0,1));
      z-index:99;
      display:block;
    }
    body.preloaded::before{ display:none; }

    body{
      margin:0;
      position:relative; /* ok */
      /* OJO: 100vh en iOS 26 puede causar salto, pero lo dejamos porque no afecta al overlay */
      min-height:100vh;
      font-family:Arial, sans-serif;
    }

    /* OVERLAY */
    .loadermcq{
      position:fixed;
      inset:0;                 /* top/right/bottom/left:0 */
      display:flex;
      flex-direction:column;
      justify-content:center;
      align-items:center;
      background:linear-gradient(270deg,rgba(40,40,40,1),rgba(0,0,0,1));
      background-size:600% 600%;
      animation:backgroundAnimation 9s ease infinite;
      z-index:2147483647;      /* bien arriba */
      opacity:1;
      transition:opacity .5s ease;

      /* >>> Cobertura total robusta <<< */
      width:100dvw; height:100dvh;        /* iOS 16+/26 */
    }
    @supports (height: 100svh){
      .loadermcq{ width:100svw; height:100svh; } /* safe viewport */
    }
    /* Fallback para Safari conflictivo: usa --vh que ponemos con JS */
    .loadermcq.use-vh-var{
      width:100vw; height:calc(var(--vh) * 100);
    }

    .imgloader{
      width:30vw; height:auto; max-width:250px;
      filter:drop-shadow(0 0 2px #fff);
      animation:glow var(--glow-duration) ease-in-out infinite;
      will-change:transform, filter;
    }
    .imgloader.scale-in{ animation:scaleIn .4s ease forwards; }

    @keyframes backgroundAnimation{
      0%{background-position:0% 50%}
      50%{background-position:100% 50%}
      100%{background-position:0% 50%}
    }
    @keyframes glow{
      0%,100%{ filter:drop-shadow(0 0 1px #fff) }
      50%{ filter:drop-shadow(0 0 5px #3A3938) }
    }
    @keyframes scaleIn{ 0%{transform:scale(1)} 100%{transform:scale(1.2)} }

    @media (max-width:768px){ .imgloader{ width:30vw } }
    @media (max-width:576px){ .imgloader{ width:40vw } }

    /* Bloqueo de scroll sólido (iOS) */
    html.mcq-lock, body.mcq-lock{
      overflow:hidden !important;
      touch-action:none !important;
      overscroll-behavior:contain !important;
    }
  `;
  document.head.appendChild(style);
}

/* Ajusta --vh para el fallback (iOS 26 barra dinámica) */
function setVHVar(){
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}
window.addEventListener('resize', setVHVar);
window.addEventListener('orientationchange', setVHVar);

function showPreloader(){
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

  if(!document.getElementById("loadermcq")){
    document.body.insertAdjacentHTML('afterbegin', preloaderHtml);
  }

  // Bloquea scroll de forma fiable
  document.documentElement.classList.add('mcq-lock');
  document.body.classList.add('mcq-lock');

  const preloader = document.getElementById("loadermcq");
  const imgWrapper = document.getElementById("imgloader");

  // Fallback: si dvh/svh no cubren, usa --vh
  requestAnimationFrame(() => {
    // setVHVar primero, para que exista el valor
    setVHVar();
    // Medimos y, si no cubre, aplicamos la clase de fallback
    const h = preloader.getBoundingClientRect().height;
    const target = Math.max(window.innerHeight, document.documentElement.clientHeight);
    if(h < target - 2) preloader.classList.add('use-vh-var');
  });

  // Evita scroll bajo el overlay en iOS
  preloader.addEventListener('touchmove', (e)=>e.preventDefault(), { passive:false });

  // Cuando cargue todo
  window.addEventListener("load", () => {
    setTimeout(() => {
      imgWrapper.classList.add('scale-in');
      setTimeout(() => {
        preloader.style.opacity = "0";
        setTimeout(() => {
          preloader.remove();
          document.body.classList.add("preloaded");
          document.documentElement.classList.remove('mcq-lock');
          document.body.classList.remove('mcq-lock');
        }, 500);
      }, 400); // duración scale
    }, 4000);   // tiempo visible
  });
}

// Ejecutar loader al cargar el DOM
document.addEventListener("DOMContentLoaded", () => {
  injectCSS();
  setVHVar();   // inicializa la variable de viewport
  showPreloader();
});
