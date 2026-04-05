/*!
 * ad-giphy-cq-injector.js
 * Uso:
 *   1) Deja un solo div en tu HTML:
 *      <div id="ad-giphy-cq-mount"
 *           data-giphy-url="https://giphy.com/canales"
 *           data-giphy-handle="@canales"
 *           data-giphy-description="Usa el contenido oficial de CANALES® en historias, mensajes y publicaciones."></div>
 *
 *   2) Carga este JS al final del body o con defer.
 */

(function () {
  var MOUNT_ID = "ad-giphy-cq-mount";
  var STYLE_ID = "ad-giphy-cq-injected-styles";

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;

    var style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      #${MOUNT_ID}{
        --ad-giphy-cq-bg:#06070a;
        --ad-giphy-cq-bg-2:#0b0d12;
        --ad-giphy-cq-bg-3:#10131a;
        --ad-giphy-cq-text:#ffffff;
        --ad-giphy-cq-soft:rgba(255,255,255,.86);
        --ad-giphy-cq-muted:rgba(255,255,255,.72);
        --ad-giphy-cq-green:#00FF99;
        --ad-giphy-cq-cyan:#00CCFF;
        --ad-giphy-cq-purple:#9013FE;
        --ad-giphy-cq-red:#FF6666;
        --ad-giphy-cq-yellow:#FFF35C;
        --ad-giphy-cq-border-size:2px;
        --ad-giphy-cq-content-max:1180px;
        --ad-giphy-cq-font:Inter, "Segoe UI", Arial, sans-serif;

        position:relative;
        display:block;
        width:100%;
        min-height:138px;
        overflow:hidden;
        isolation:isolate;
        font-family:var(--ad-giphy-cq-font);
        border:0;
        background:
          radial-gradient(circle at 16% 50%, rgba(0,255,153,.14), transparent 24%),
          radial-gradient(circle at 34% 22%, rgba(0,204,255,.16), transparent 26%),
          radial-gradient(circle at 66% 28%, rgba(144,19,254,.18), transparent 28%),
          radial-gradient(circle at 86% 62%, rgba(255,102,102,.14), transparent 26%),
          radial-gradient(circle at 58% 82%, rgba(255,243,92,.09), transparent 24%),
          linear-gradient(135deg, rgba(255,255,255,.035), rgba(255,255,255,0) 34%),
          linear-gradient(180deg, var(--ad-giphy-cq-bg-3) 0%, var(--ad-giphy-cq-bg-2) 46%, var(--ad-giphy-cq-bg) 100%);
        box-shadow:
          inset 0 1px 0 rgba(255,255,255,.06),
          inset 0 -1px 0 rgba(255,255,255,.025),
          0 18px 40px rgba(0,0,0,.18);
      }

      #${MOUNT_ID} *,
      #${MOUNT_ID} *::before,
      #${MOUNT_ID} *::after{
        box-sizing:border-box;
      }

      #${MOUNT_ID} .ad-giphy-cq__shine{
        position:absolute;
        inset:0;
        pointer-events:none;
        z-index:0;
        background:
          radial-gradient(circle at 18% 18%, rgba(255,255,255,.10), transparent 18%),
          radial-gradient(circle at 76% 20%, rgba(255,255,255,.07), transparent 16%),
          linear-gradient(115deg, rgba(255,255,255,.08), rgba(255,255,255,0) 32%);
        mix-blend-mode:screen;
        opacity:.58;
      }

      #${MOUNT_ID} .ad-giphy-cq__shadow{
        position:absolute;
        inset:0;
        pointer-events:none;
        z-index:0;
        background:
          linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,0) 24%),
          linear-gradient(0deg, rgba(0,0,0,.22), rgba(0,0,0,0) 26%);
        opacity:.9;
      }

      #${MOUNT_ID} .ad-giphy-cq__bg{
        position:absolute;
        inset:0;
        z-index:1;
        pointer-events:none;
        overflow:hidden;
      }

      #${MOUNT_ID} .ad-giphy-cq__orb{
        position:absolute;
        border-radius:50%;
        filter:blur(72px);
        opacity:.18;
        will-change:transform;
        transform:translate3d(0,0,0);
        mix-blend-mode:screen;
      }

      #${MOUNT_ID} .ad-giphy-cq__center{
        position:relative;
        z-index:2;
        width:min(100%, var(--ad-giphy-cq-content-max));
        margin:0 auto;
        backdrop-filter:blur(10px);
        -webkit-backdrop-filter:blur(10px);
      }

      #${MOUNT_ID} .ad-giphy-cq__inner{
        min-height:138px;
        padding:16px 24px;
        display:grid;
        grid-template-columns:440px minmax(220px,1fr) 170px;
        gap:20px;
        align-items:center;
      }

      #${MOUNT_ID} .ad-giphy-cq__col{
        min-width:0;
        min-height:82px;
        display:flex;
        flex-direction:column;
        justify-content:center;
        position:relative;
      }

      #${MOUNT_ID} .ad-giphy-cq__col:not(:last-child)::after{
        content:"";
        position:absolute;
        top:12px;
        right:-10px;
        width:1px;
        height:calc(100% - 24px);
        background:linear-gradient(
          180deg,
          transparent 0%,
          rgba(255,255,255,.08) 18%,
          rgba(255,255,255,.08) 82%,
          transparent 100%
        );
      }

      #${MOUNT_ID} .ad-giphy-cq__hero{
        gap:8px;
        align-items:flex-start;
      }

      #${MOUNT_ID} .ad-giphy-cq__title{
        display:flex;
        align-items:center;
        gap:10px;
        width:max-content;
        max-width:100%;
        color:var(--ad-giphy-cq-text);
        white-space:nowrap;
        flex-wrap:nowrap;
      }

      #${MOUNT_ID} .ad-giphy-cq__title-top{
        display:block;
        font-size:26px;
        line-height:1;
        letter-spacing:-0.06em;
        font-weight:900;
        white-space:nowrap;
        flex:0 0 auto;
        transform:translateY(1px);
      }

      #${MOUNT_ID} .ad-giphy-cq__title-logo{
        display:block;
        height:54px;
        width:auto;
        flex:0 0 auto;
        object-fit:contain;
        max-width:none;
      }

      #${MOUNT_ID} .ad-giphy-cq__meta{
        display:inline-flex;
        align-items:center;
        gap:8px;
        flex-wrap:wrap;
        color:var(--ad-giphy-cq-muted);
        font-size:15px;
        font-weight:800;
        line-height:1;
        letter-spacing:-0.02em;
      }

      #${MOUNT_ID} .ad-giphy-cq__handle{
        white-space:nowrap;
      }

      #${MOUNT_ID} .ad-giphy-cq__verified{
        display:inline-flex;
        align-items:center;
        justify-content:center;
        color:#00D1FF;
        line-height:1;
        flex:0 0 auto;
      }

      #${MOUNT_ID} .ad-giphy-cq__copy{
        align-items:flex-start;
        justify-content:center;
      }

      #${MOUNT_ID} .ad-giphy-cq__text{
        margin:0;
        max-width:24ch;
        font-size:16px;
        line-height:1.45;
        color:var(--ad-giphy-cq-soft);
      }

      #${MOUNT_ID} .ad-giphy-cq__cta{
        align-items:center;
        justify-content:center;
      }

      #${MOUNT_ID} .ad-giphy-cq__btn{
        display:inline-flex;
        align-items:center;
        justify-content:center;
        min-height:42px;
        padding:0 20px;
        border-radius:999px;
        text-decoration:none;
        font-size:12px;
        line-height:1;
        letter-spacing:.08em;
        text-transform:uppercase;
        font-weight:900;
        color:#fff;
        border:var(--ad-giphy-cq-border-size) solid transparent;
        background:
          linear-gradient(180deg, rgba(10,10,10,.96), rgba(20,20,20,.96)) padding-box,
          linear-gradient(
            90deg,
            var(--ad-giphy-cq-green) 0%,
            var(--ad-giphy-cq-cyan) 14%,
            var(--ad-giphy-cq-purple) 28%,
            var(--ad-giphy-cq-red) 42%,
            var(--ad-giphy-cq-yellow) 56%,
            var(--ad-giphy-cq-green) 70%,
            var(--ad-giphy-cq-cyan) 84%,
            var(--ad-giphy-cq-purple) 100%
          ) border-box;
        background-size:100% 100%, 320% 100%;
        background-repeat:no-repeat;
        animation:ad-giphy-cq-border-flow 8s linear infinite;
        box-shadow:
          inset 0 0 0 1px rgba(255,255,255,.045),
          0 0 0 1px rgba(255,255,255,.02),
          0 0 14px rgba(144,19,254,.12);
        transition:transform .24s ease, filter .24s ease, box-shadow .24s ease;
        white-space:nowrap;
      }

      #${MOUNT_ID} .ad-giphy-cq__btn:hover{
        transform:translateY(-1px);
        filter:brightness(1.08);
        box-shadow:
          inset 0 0 0 1px rgba(255,255,255,.05),
          0 0 18px rgba(144,19,254,.18),
          0 10px 20px rgba(144,19,254,.12);
      }

      @keyframes ad-giphy-cq-border-flow{
        0%{ background-position:0% 0, 0% 0, 0% 50%; }
        100%{ background-position:0% 0, 0% 0, 300% 50%; }
      }

      @media (max-width: 980px){
        #${MOUNT_ID}{
          min-height:auto;
        }

        #${MOUNT_ID} .ad-giphy-cq__inner{
          min-height:auto;
          grid-template-columns:1fr 1fr;
          gap:14px;
          padding:16px 20px;
        }

        #${MOUNT_ID} .ad-giphy-cq__col{
          min-height:auto;
        }

        #${MOUNT_ID} .ad-giphy-cq__hero{
          grid-column:1 / -1;
        }

        #${MOUNT_ID} .ad-giphy-cq__cta{
          align-items:flex-start;
        }

        #${MOUNT_ID} .ad-giphy-cq__col:nth-child(2)::after{
          display:none;
        }
      }

      @media (max-width: 680px){
        #${MOUNT_ID} .ad-giphy-cq__center{
          width:min(100%, 1000px);
        }

        #${MOUNT_ID} .ad-giphy-cq__inner{
          padding:14px 16px;
          grid-template-columns:1fr;
          gap:12px;
        }

        #${MOUNT_ID} .ad-giphy-cq__col{
          align-items:center;
          text-align:center;
        }

        #${MOUNT_ID} .ad-giphy-cq__col::after{
          display:none !important;
        }

        #${MOUNT_ID} .ad-giphy-cq__hero{
          align-items:center;
        }

        #${MOUNT_ID} .ad-giphy-cq__title{
          margin:0 auto;
        }

        #${MOUNT_ID} .ad-giphy-cq__meta{
          justify-content:center;
          font-size:14px;
        }

        #${MOUNT_ID} .ad-giphy-cq__copy{
          align-items:center;
        }

        #${MOUNT_ID} .ad-giphy-cq__title-top{
          font-size:22px;
        }

        #${MOUNT_ID} .ad-giphy-cq__title-logo{
          height:40px;
        }

        #${MOUNT_ID} .ad-giphy-cq__text{
          max-width:30ch;
          font-size:15px;
          text-align:center;
        }

        #${MOUNT_ID} .ad-giphy-cq__cta{
          align-items:center;
        }

        #${MOUNT_ID} .ad-giphy-cq__btn{
          width:100%;
          max-width:260px;
          justify-content:center;
        }
      }

      @media (prefers-reduced-motion: reduce){
        #${MOUNT_ID} .ad-giphy-cq__btn{
          animation:none !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function normalizeHandle(value) {
    var clean = String(value || "").trim().replace(/^@+/, "");
    return clean ? "@" + clean : "@canales";
  }

  function createMarkup(handle, description, url) {
    return (
      '<div class="ad-giphy-cq__shine" aria-hidden="true"></div>' +
      '<div class="ad-giphy-cq__shadow" aria-hidden="true"></div>' +
      '<div class="ad-giphy-cq__center">' +
        '<div class="ad-giphy-cq__inner">' +
          '<div class="ad-giphy-cq__col ad-giphy-cq__hero">' +
            '<div class="ad-giphy-cq__title" aria-label="Estamos en GIPHY">' +
              '<span class="ad-giphy-cq__title-top">Estamos en</span>' +
              '<img src="https://giphy.com/static/img/giphy-logo.webp" alt="GIPHY" class="ad-giphy-cq__title-logo">' +
            '</div>' +
            '<div class="ad-giphy-cq__meta">' +
              '<span class="ad-giphy-cq__handle">' + handle + '</span>' +
              '<span class="ad-giphy-cq__verified" title="Cuenta verificada" aria-label="Cuenta verificada">' +
                '<svg viewBox="0 0 21 20" width="17" height="17" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">' +
                  '<path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M13.7447 0L15.9028 2.55331L18.9947 3.81966L19.2419 7.15562L21 10L19.2419 12.8444L18.9947 16.1803L15.9028 17.4467L13.7447 20L10.5 19.2046L7.25532 20L5.09719 17.4467L2.00532 16.1803L1.75806 12.8444L0 10L1.75806 7.15562L2.00532 3.81966L5.09719 2.55331L7.25532 0L10.5 0.795382L13.7447 0ZM9.44644 15.2103L17.0434 7.52136L14.7399 5.19002L9.42133 10.5719L7.1186 8.24091L4.83951 10.5476L9.44644 15.2103Z"></path>' +
                '</svg>' +
              '</span>' +
            '</div>' +
          '</div>' +
          '<div class="ad-giphy-cq__col ad-giphy-cq__copy">' +
            '<p class="ad-giphy-cq__text">' + description + '</p>' +
          '</div>' +
          '<div class="ad-giphy-cq__col ad-giphy-cq__cta">' +
            '<a href="' + url + '" target="_blank" rel="noopener noreferrer" class="ad-giphy-cq__btn">Descubrir</a>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }

  function injectBackground(mount) {
    var bg = document.createElement("div");
    bg.className = "ad-giphy-cq__bg";
    bg.setAttribute("aria-hidden", "true");

    var orbConfigs = [
      { color:'rgba(0,255,153,.48)', width:180, height:180, left:'-36px', top:'4px', dx:8, dy:6, duration:14 },
      { color:'rgba(0,204,255,.45)', width:170, height:170, left:'26%', top:'-34px', dx:7, dy:8, duration:16 },
      { color:'rgba(144,19,254,.52)', width:220, height:220, right:'-48px', top:'-26px', dx:-8, dy:7, duration:18 },
      { color:'rgba(255,102,102,.34)', width:170, height:170, right:'16%', bottom:'-40px', dx:-6, dy:-7, duration:20 },
      { color:'rgba(255,243,92,.20)', width:130, height:130, left:'56%', bottom:'-28px', dx:5, dy:-6, duration:15 }
    ];

    orbConfigs.forEach(function (cfg, index) {
      var orb = document.createElement("div");
      orb.className = "ad-giphy-cq__orb";
      orb.style.background = cfg.color;
      orb.style.width = cfg.width + "px";
      orb.style.height = cfg.height + "px";
      if (cfg.left !== undefined) orb.style.left = cfg.left;
      if (cfg.right !== undefined) orb.style.right = cfg.right;
      if (cfg.top !== undefined) orb.style.top = cfg.top;
      if (cfg.bottom !== undefined) orb.style.bottom = cfg.bottom;
      orb.dataset.dx = String(cfg.dx);
      orb.dataset.dy = String(cfg.dy);
      orb.dataset.duration = String(cfg.duration);
      orb.dataset.phase = String(index * 0.9);
      bg.appendChild(orb);
    });

    mount.appendChild(bg);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    var orbs = Array.prototype.slice.call(bg.querySelectorAll(".ad-giphy-cq__orb"));
    var start = null;

    function animate(ts) {
      if (!start) start = ts;
      var elapsed = (ts - start) / 1000;

      orbs.forEach(function (orb) {
        var dx = parseFloat(orb.dataset.dx || "0");
        var dy = parseFloat(orb.dataset.dy || "0");
        var duration = parseFloat(orb.dataset.duration || "10");
        var phase = parseFloat(orb.dataset.phase || "0");

        var progress = (elapsed / duration) + phase;
        var x = Math.sin(progress) * dx;
        var y = Math.cos(progress * 1.15) * dy;

        orb.style.transform = "translate3d(" + x.toFixed(2) + "px," + y.toFixed(2) + "px,0)";
      });

      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }

  function init() {
    var mount = document.getElementById(MOUNT_ID);
    if (!mount) return;

    injectStyles();

    var handle = normalizeHandle(mount.getAttribute("data-giphy-handle") || "@canales");
    var description = mount.getAttribute("data-giphy-description") || "Usa el contenido oficial de CANALES® en historias, mensajes y publicaciones.";
    var url = mount.getAttribute("data-giphy-url") || "https://giphy.com/canales";

    mount.innerHTML = createMarkup(handle, description, url);
    injectBackground(mount);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
