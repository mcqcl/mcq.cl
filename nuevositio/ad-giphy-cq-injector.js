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
/* V57 — GIPHY component: single coherent responsive stylesheet (no stacked overrides). */
#${MOUNT_ID}{--cq-green:#00ff99;--cq-blue:#00ccff;--cq-purple:#9013fe;--cq-red:#ff6666;--cq-yellow:#fff35c;position:relative;isolation:isolate;display:block;width:100%;max-width:100%;min-width:0;overflow:hidden;color:#fff;background:radial-gradient(ellipse at 15% 40%,#00ff991b,transparent 45%),radial-gradient(ellipse at 85% 30%,#9013fe30,transparent 48%),linear-gradient(125deg,#10131a,#06070a);font-family:'DM Sans',Arial,sans-serif}
#${MOUNT_ID} *,#${MOUNT_ID} *::before,#${MOUNT_ID} *::after{box-sizing:border-box}
#${MOUNT_ID} .ad-giphy-cq__shine,#${MOUNT_ID} .ad-giphy-cq__shadow,#${MOUNT_ID} .ad-giphy-cq__bg{position:absolute;inset:0;pointer-events:none;overflow:hidden}
#${MOUNT_ID} .ad-giphy-cq__shine{z-index:0;opacity:.6;background:linear-gradient(110deg,#ffffff0b,transparent 32%,#ffffff05 70%,transparent)}
#${MOUNT_ID} .ad-giphy-cq__shadow{z-index:0;box-shadow:inset 0 1px #ffffff12,inset 0 -1px #ffffff12}
#${MOUNT_ID} .ad-giphy-cq__bg{z-index:0}
#${MOUNT_ID} .ad-giphy-cq__orb{position:absolute;border-radius:50%;filter:blur(68px);opacity:.2;transform:translate3d(0,0,0);pointer-events:none}
#${MOUNT_ID} .ad-giphy-cq__center{position:relative;z-index:1;width:100%;max-width:1180px;min-width:0;margin-inline:auto}
#${MOUNT_ID} .ad-giphy-cq__inner{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,.85fr) auto;align-items:center;gap:clamp(18px,2.6vw,38px);width:100%;min-width:0;padding:clamp(28px,3.5vw,46px) clamp(20px,3vw,36px)}
#${MOUNT_ID} .ad-giphy-cq__col{display:flex;flex-direction:column;align-items:flex-start;justify-content:center;min-width:0;max-width:100%;min-height:0;gap:12px;position:relative}
#${MOUNT_ID} .ad-giphy-cq__hero{gap:15px}
#${MOUNT_ID} .ad-giphy-cq__title{display:flex;align-items:center;gap:10px;flex-wrap:wrap;max-width:100%;min-width:0;white-space:normal}
#${MOUNT_ID} .ad-giphy-cq__title-top{font-family:'Space Grotesk',Arial,sans-serif;font-size:clamp(17px,2.1vw,27px);font-weight:700;letter-spacing:-.05em;line-height:1.1;white-space:normal}
#${MOUNT_ID} .ad-giphy-cq__title-logo{display:block;width:auto;height:clamp(34px,3.5vw,48px);max-width:min(100%,180px);object-fit:contain;flex:0 1 auto}
#${MOUNT_ID} .ad-giphy-cq__meta{display:flex;align-items:center;min-width:0;max-width:100%;gap:10px;flex-wrap:nowrap;color:#fff}
#${MOUNT_ID} .ad-giphy-cq__handle{min-width:0;font-family:'Space Grotesk',Arial,sans-serif;font-size:clamp(34px,4vw,56px);font-weight:700;letter-spacing:-.07em;line-height:1.05;white-space:nowrap}
#${MOUNT_ID} .ad-giphy-cq__verified{display:inline-flex;align-items:center;justify-content:center;flex:none;color:#00d1ff}
#${MOUNT_ID} .ad-giphy-cq__text{max-width:34ch;margin:0;color:#ffffffe0;font-family:'DM Sans',Arial,sans-serif;font-weight:400;font-size:clamp(14px,1.3vw,16px);line-height:1.55;overflow-wrap:anywhere}
#${MOUNT_ID} .ad-giphy-cq__cta{align-items:flex-end}
#${MOUNT_ID} a.ad-giphy-cq__btn{position:relative;isolation:isolate;display:inline-flex;justify-content:center;align-items:center;flex:none;min-width:155px;min-height:52px;padding:13px 24px;border:1px solid #ffffff45;border-radius:999px;color:#fff!important;text-transform:uppercase;white-space:nowrap;text-decoration:none!important;letter-spacing:.055em;font-family:'Space Grotesk',Arial,sans-serif;font-size:13px;font-weight:700;overflow:hidden;background:linear-gradient(100deg,#00bd78,#008fce,#731bd5,#e34d7e,#d3a419,#00bd78);background-size:300% 300%;box-shadow:0 10px 25px #0004;animation:cq-giphy-flow 9s linear infinite;transition:transform .26s ease,filter .26s ease,box-shadow .26s ease}
#${MOUNT_ID} a.ad-giphy-cq__btn::after{content:'↗';font-size:17px;margin-left:10px;font-weight:400}
#${MOUNT_ID} a.ad-giphy-cq__btn:hover{transform:translateY(-3px);filter:brightness(1.13) saturate(1.2);box-shadow:0 14px 30px #0006,0 0 24px #9013fe40}
#${MOUNT_ID} a.ad-giphy-cq__btn:focus-visible{outline:3px solid #fff;outline-offset:4px}
@keyframes cq-giphy-flow{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
@media(max-width:1100px){
 #${MOUNT_ID} .ad-giphy-cq__inner{grid-template-columns:minmax(0,1fr) auto;row-gap:16px}
 #${MOUNT_ID} .ad-giphy-cq__hero{grid-column:1/-1}
 #${MOUNT_ID} .ad-giphy-cq__copy{grid-column:1;grid-row:2}
 #${MOUNT_ID} .ad-giphy-cq__cta{grid-column:2;grid-row:2}
 #${MOUNT_ID} .ad-giphy-cq__handle{font-size:clamp(39px,5.5vw,64px)}
}
@media(max-width:700px){
 #${MOUNT_ID} .ad-giphy-cq__inner{display:flex;flex-direction:column;align-items:center;gap:16px;padding:29px 18px 32px}
 #${MOUNT_ID} .ad-giphy-cq__col{align-items:center;text-align:center;width:100%;gap:12px}
 #${MOUNT_ID} .ad-giphy-cq__title{justify-content:center}
 #${MOUNT_ID} .ad-giphy-cq__meta{justify-content:center}
 #${MOUNT_ID} .ad-giphy-cq__handle{font-size:clamp(36px,10vw,56px)}
 #${MOUNT_ID} .ad-giphy-cq__text{max-width:38ch;text-align:center;font-size:15px}
 #${MOUNT_ID} a.ad-giphy-cq__btn{width:min(100%,300px);min-height:54px}
}
@media(max-width:360px){#${MOUNT_ID} .ad-giphy-cq__inner{padding-inline:12px}#${MOUNT_ID} .ad-giphy-cq__title-top{font-size:18px}#${MOUNT_ID} .ad-giphy-cq__title-logo{height:36px}#${MOUNT_ID} .ad-giphy-cq__handle{font-size:34px}}
@media(prefers-reduced-motion:reduce){#${MOUNT_ID} a.ad-giphy-cq__btn{animation:none;transition:none}#${MOUNT_ID} .ad-giphy-cq__orb{display:none}}
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
