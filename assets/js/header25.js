// 1) Marcado + estilos del header (sin <script> adentro)
    const headerMarkup = `
      <div id="rtmb-header" class="rtmb-header">
        <div class="rtmb-inner">
          <a class="rtmb-brand" href="https://canales.pe" aria-label="Inicio">
            <img src="https://cdn.mcq.cl/logo/canales.svg" alt="CANALES" height="48" loading="eager" />
          </a>
        </div>

        <style>
          #rtmb-header{
            --h:110px; --h-shrink:70px; --blur:14px; --radius:18px;
            --border:rgba(0,0,0,.08); --shadow:0 8px 20px rgba(0,0,0,.08);
            position:fixed; top:0; left:0; right:0; z-index:1040;
            height:var(--h); display:grid; place-items:center;
            background:#fff; /* Fase 1: blanco sólido */
            border-bottom:1px solid var(--border);
            transition:height .35s ease, background .35s ease, box-shadow .35s ease, border-color .35s ease;
            isolation:isolate; backface-visibility:hidden; transform:translateZ(0);
          }
          #rtmb-header.rtmb-shrink{
            height:var(--h-shrink);
            background:rgb(0 0 0 / 15%); /* Fase 2: glass */
            backdrop-filter:blur(var(--blur)) saturate(160%);
            -webkit-backdrop-filter:blur(var(--blur)) saturate(160%);
            box-shadow:var(--shadow);
            border-bottom-color:rgba(0,0,0,.15);
          }
          #rtmb-header .rtmb-inner{
            width:100%; max-width:1200px; margin-inline:auto; padding-inline:16px;
            display:flex; align-items:center; justify-content:center;
          }
          #rtmb-header .rtmb-brand{
            display:grid; place-items:center; width:220px; height:78px;
            border-radius:var(--radius); overflow:hidden;
            transition:width .35s ease, height .35s ease;
          }
          #rtmb-header .rtmb-brand img{
            width:100%; height:100%; object-fit:contain;
            filter:brightness(0); transition:filter .25s ease; /* logo negro en Fase 1 */
          }
          #rtmb-header.rtmb-shrink .rtmb-brand{ width:160px; height:48px; }
          #rtmb-header.rtmb-shrink .rtmb-brand img{ filter:invert(1) brightness(1.05); } /* logo blanco en Fase 2 */
        </style>
      </div>
    `;

    // 2) Inyectar el header
    const mount = document.getElementById('header-container');
    mount.innerHTML = headerMarkup;

    // 3) Inicializar comportamiento (las "fases")
    function initRtmbHeader(root = document) {
      const header = root.getElementById('rtmb-header');
      if (!header) return;
      let isShrunk = false;
      const ADD_AT = 80;    // activa Fase 2
      const REMOVE_AT = 40; // vuelve a Fase 1

      const onScroll = () => {
        const y = window.scrollY || document.documentElement.scrollTop;
        if (!isShrunk && y > ADD_AT) {
          header.classList.add('rtmb-shrink');
          isShrunk = true;
        } else if (isShrunk && y < REMOVE_AT) {
          header.classList.remove('rtmb-shrink');
          isShrunk = false;
        }
      };

      let ticking = false;
      window.addEventListener('scroll', () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            onScroll();
            ticking = false;
          });
          ticking = true;
        }
      }, { passive: true });

      onScroll(); // evaluar estado inicial
    }

    // 4) Llamar a la init después de inyectar
    initRtmbHeader(document);