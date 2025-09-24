(() => {
  /* ========= LEE CÓDIGOS DESDE EL CONFIG ========= */
  const VALID_CODES = Array.isArray(window.SOFTLOCK_CODES) ? window.SOFTLOCK_CODES : [];
  if (!VALID_CODES.length) {
    console.warn("[softlock] No se definieron códigos en window.SOFTLOCK_CODES.");
  }

  /* ======== AJUSTES INTERNOS (puedes dejarlos así) ======== */
  const PARAM_NAME  = "code";           // pase directo: ?code=tuCodigo
  const REMEMBER_MODE = "session";      // "session" | "local"
  const TTL_MINUTES = 0;                // 0 = sin vencimiento
  const SCOPE_SELECTOR = null;          // ej. "#app" para cubrir solo un contenedor
  const BLUR_STRENGTH = 22;             // px del glass blur
  const GLASS_OPACITY = 0.35;           // opacidad del overlay

  // Error visible un rato y luego fade suave
  const ERROR_VISIBLE_MS       = 1500;  // 1.5s visible (cámbialo si quieres minutos)
  const ERROR_FADE_DURATION_MS = 1600;  // duración del fade-out

  // Logo
  const LOGO_SVG = `<img src="https://cdn.mcq.cl/logo/canales-white.svg" alt="Logo CANALES" width="160" height="32" style="opacity:.95;">`;

  /* ===================== UTIL ===================== */
  const KEY = "softlock_state_ui_v1";
  const now = () => Date.now();
  const ms  = m => m*60*1000;
  const remember = REMEMBER_MODE === "local" ? localStorage : sessionStorage;
  const loadState = () => { try { return JSON.parse(remember.getItem(KEY)||"null"); } catch { return null; } };
  const saveState = (ok) => remember.setItem(KEY, JSON.stringify({ ok: !!ok, exp: TTL_MINUTES? now()+ms(TTL_MINUTES): null }));
  const isValidState = (st) => !!(st && st.ok && (!st.exp || st.exp > now()));
  const checkCode = (v) => VALID_CODES.includes((v||"").trim());

  /* ===================== CSS ===================== */
  const css = `
  html.softlock-lock, body.softlock-lock { overflow:hidden; }
  .softlock-wrap { position:relative; }
  .softlock-wrap.softlock-blurred > *:not(.softlock-overlay){
    filter: blur(${BLUR_STRENGTH}px) saturate(1.2);
    transform: translateZ(0);
  }

  /* Overlay glass */
  .softlock-overlay{
    position:fixed; inset:0; z-index:99999; display:grid; place-items:center;
    background: rgba(10,10,10,${GLASS_OPACITY});
    -webkit-backdrop-filter: blur(${BLUR_STRENGTH}px) saturate(140%);
    backdrop-filter: blur(${BLUR_STRENGTH}px) saturate(140%);
    padding: 24px;
  }
  /* Flash rojo/verde */
  .softlock-overlay::after{
    content:""; position:absolute; inset:-10%; opacity:0; pointer-events:none;
    background: radial-gradient(1200px 600px at 50% 50%, transparent 0%, transparent 60%, transparent 100%);
    filter: blur(24px);
    transition: opacity .25s ease;
  }
  .softlock-overlay.flash-red::after{
    background: radial-gradient(1200px 600px at 50% 50%, rgba(255,0,60,.35) 0%, rgba(255,0,60,.22) 45%, transparent 80%);
    opacity: 1; animation: softlock-flash .8s ease forwards;
  }
  .softlock-overlay.flash-green::after{
    background: radial-gradient(1200px 600px at 50% 50%, rgba(0,220,120,.33) 0%, rgba(0,220,120,.20) 45%, transparent 80%);
    opacity: 1; animation: softlock-flash .6s ease forwards;
  }
  @keyframes softlock-flash { 0%{opacity:0} 10%{opacity:1} 60%{opacity:.9} 100%{opacity:0} }

  /* ===== Tarjeta (contenedor) con shimmer enmascarado ===== */
  .softlock-card{
    position:relative; overflow:hidden;
    width:min(440px, 92vw);
    background: rgba(255,255,255,.04);
    border: 1px solid rgba(255,255,255,.20);
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0,0,0,.4), inset 0 1px 0 rgba(255,255,255,.06);
    padding: 22px 20px;
    color: #fff;
    font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
    -webkit-backdrop-filter: blur(12px) saturate(140%);
    backdrop-filter: blur(12px) saturate(140%);
  }
  .softlock-card::after{
    content:""; position:absolute; top:0; left:-100%; width:80%; height:100%;
    background: linear-gradient(120deg,
      rgba(255,255,255,0) 0%,
      rgba(255,255,255,0.05) 35%,
      rgba(255,255,255,0.18) 50%,
      rgba(255,255,255,0.05) 65%,
      rgba(255,255,255,0) 100%);
    transform: skewX(-18deg); mix-blend-mode: screen;
    filter: blur(12px); border-radius: inherit; pointer-events:none;
    animation: softlock-sheen 8s ease-in-out infinite; animation-delay: 3s;
  }
  @keyframes softlock-sheen {
    0% { left:-100%; opacity:0; }
    10%{ opacity:.6; }
    40%{ left:130%; opacity:.4; }
    60%{ opacity:0; }
    100%{ left:130%; opacity:0; }
  }

  .softlock-logo{ display:flex; justify-content:center; margin-bottom:10px; opacity:.95; }
  .softlock-title{ margin:0 0 6px; font-size:18px; font-weight:700; text-align:center; opacity:.95; }
  .softlock-sub{ margin:0 0 16px; font-size:13px; text-align:center; opacity:.7; }

  /* Input + partículas tipo spoiler (siempre visibles) */
  .softlock-field{ position:relative; display:grid; gap:10px; }
  .softlock-input{
    background: transparent; color: #fff;
    border: 1px solid rgba(255,255,255,.35);
    border-radius: 12px;
    padding: 12px 14px; font-size: 15px; outline: none;
    transition: border-color .2s ease, background .2s ease;
  }
  .softlock-input::placeholder{ color:#fff; opacity:.45; }
  .softlock-input:focus{ border-color: rgba(255,255,255,.7); background: rgba(255,255,255,.06); }

  .softlock-particles{
    position:absolute; inset:0; pointer-events:none; opacity:.9;
    border-radius:12px; overflow:hidden;
  }
  .softlock-particles canvas{ width:100%; height:100%; display:block; filter: blur(1.2px); }

  .softlock-actions{ display:flex; justify-content:center; margin-top:12px; }
  .softlock-btn{
    appearance:none; background: transparent; color:#fff;
    border:1px solid rgba(255,255,255,.35);
    border-radius: 12px; padding: 10px 14px; font-weight:600; cursor:pointer;
    transition: background .2s ease, border-color .2s ease, transform .05s ease;
  }
  .softlock-btn:hover{ background: rgba(255,255,255,.06); border-color: rgba(255,255,255,.7); }
  .softlock-btn:active{ transform: scale(.98); }

  /* Error con fade suave al desaparecer */
  .softlock-error{
    color:#fff; font-size:13px; min-height:16px; opacity:0;
    transition: opacity .25s ease;
  }
  .softlock-error.show { opacity:.9; }
  .softlock-error.fade { transition: opacity ${ERROR_FADE_DURATION_MS}ms ease; opacity:0; }
  `;

  /* ===================== Partículas (canvas) ===================== */
  function createParticlesLayer(host){
    const wrap = document.createElement("div");
    wrap.className = "softlock-particles";
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    wrap.appendChild(canvas);
    host.appendChild(wrap);

    let raf = null, W = 0, H = 0, t0 = performance.now();
    const DPR = Math.min(2, window.devicePixelRatio || 1);

    const N = 100;
    const parts = Array.from({length: N}, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.6 + Math.random()*1.6,
      vx: (Math.random()*0.4 - 0.2) * 0.15,
      vy: (Math.random()*0.4 - 0.2) * 0.04,
      phase: Math.random()*Math.PI*2,
      hue: Math.random() < 0.2 ? (Math.random()<0.5? 195:330) : 0
    }));

    function resize(){
      const rect = wrap.getBoundingClientRect();
      const w = Math.max(1, Math.round(rect.width * DPR));
      const h = Math.max(1, Math.round(rect.height * DPR));
      if (w !== W || h !== H){ W = w; H = h; canvas.width = W; canvas.height = H; }
    }
    resize();
    new ResizeObserver(resize).observe(wrap);

    function draw(now){
      const dt = Math.min(32, now - t0); t0 = now;
      ctx.clearRect(0,0,W,H);
      ctx.globalCompositeOperation = "lighter";

      for (let p of parts){
        p.x += p.vx * dt/16 / 100;
        p.y += p.vy * dt/16 / 100;
        if (p.x < -0.05) p.x = 1.05;
        if (p.x >  1.05) p.x = -0.05;
        if (p.y < -0.05) p.y = 1.05;
        if (p.y >  1.05) p.y = -0.05;

        p.phase += dt/900;
        const tw = 0.35 + 0.65 * (0.5 + 0.5*Math.sin(p.phase));

        const x = p.x * W, y = p.y * H;
        const r = p.r * DPR * (0.8 + 0.4*Math.sin(p.phase*1.3));

        ctx.shadowColor = p.hue ? `hsla(${p.hue}, 90%, 70%, ${0.12*tw})` : `rgba(255,255,255,${0.12*tw})`;
        ctx.shadowBlur = 6 * DPR;

        ctx.fillStyle  = p.hue ? `hsla(${p.hue}, 90%, 80%, ${0.14+0.26*tw})` : `rgba(255,255,255,${0.16+0.28*tw})`;
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI*2); ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    }

    if (!raf) raf = requestAnimationFrame(draw);
    return { destroy(){ if (raf){ cancelAnimationFrame(raf); raf = null; } wrap.remove(); } };
  }

  /* ===================== DOM / UI ===================== */
  function buildOverlay(onSubmit){
    const ov = document.createElement("div");
    ov.className = "softlock-overlay";
    const card = document.createElement("div");
    card.className = "softlock-card";

    const logo = document.createElement("div");
    logo.className = "softlock-logo";
    if (LOGO_SVG && LOGO_SVG.trim()) logo.innerHTML = LOGO_SVG;

    const h = document.createElement("h2");
    h.className = "softlock-title";
    h.textContent = "Acceso con código";

    const sub = document.createElement("div");
    sub.className = "softlock-sub";
    sub.textContent = "Ingresa tu código para ver el contenido.";

    const field = document.createElement("div");
    field.className = "softlock-field";

    const input = document.createElement("input");
    input.className = "softlock-input";
    input.type = "password";
    input.placeholder = "Código…";
    input.autocomplete = "off";

    // Partículas siempre visibles enmascaradas al input
    createParticlesLayer(field);

    const err = document.createElement("div");
    err.className = "softlock-error";
    err.setAttribute("aria-live", "polite");

    const actions = document.createElement("div");
    actions.className = "softlock-actions";
    const ok = document.createElement("button");
    ok.className = "softlock-btn ok";
    ok.type = "button";
    ok.textContent = "Entrar";

    actions.appendChild(ok);

    field.appendChild(input);
    card.appendChild(logo);
    card.appendChild(h);
    card.appendChild(sub);
    card.appendChild(field);
    card.appendChild(err);
    card.appendChild(actions);
    ov.appendChild(card);

    // flash helper
    function flash(kind){
      ov.classList.remove("flash-red","flash-green");
      void ov.offsetWidth;
      ov.classList.add(kind === "red" ? "flash-red" : "flash-green");
      setTimeout(()=> ov.classList.remove("flash-red","flash-green"), 900);
    }

    // Error con autodesvanecimiento
    let errorTimer = null;
    function showError(t){
      err.textContent = t || "";
      err.classList.add("show");
      err.classList.remove("fade");
      clearTimeout(errorTimer);
      errorTimer = setTimeout(() => {
        err.classList.add("fade");
        setTimeout(() => { err.classList.remove("show","fade"); err.textContent = ""; }, ERROR_FADE_DURATION_MS);
      }, ERROR_VISIBLE_MS);
    }

    ok.addEventListener("click", async () => {
      const val = input.value;
      const oked = await onSubmit(val, { flash, showError });
      if (!oked){
        flash("red");
        input.select(); input.focus();
      }
    });
    input.addEventListener("keydown", (e)=>{
      if (e.key === "Enter") ok.click();
    });

    requestAnimationFrame(()=> input.focus());
    return { overlay: ov, input, flash, showError };
  }

  /* ===================== INIT ===================== */
  const st = loadState();
  if (isValidState(st)) return;

  // Inyecta CSS
  const s = document.createElement("style"); s.textContent = css; document.head.appendChild(s);

  // Envolver contenido para blur
  const scope = SCOPE_SELECTOR ? document.querySelector(SCOPE_SELECTOR) : document.body;
  const wrap = document.createElement("div"); wrap.className = "softlock-wrap softlock-blurred";
  if (SCOPE_SELECTOR){
    while (scope.firstChild) wrap.appendChild(scope.firstChild);
    scope.appendChild(wrap);
  } else {
    while (document.body.firstChild) { wrap.appendChild(document.body.firstChild); }
    document.body.appendChild(wrap);
  }
  document.documentElement.classList.add("softlock-lock");
  document.body.classList.add("softlock-lock");

  const unlock = () => {
    wrap.classList.remove("softlock-blurred");
    document.documentElement.classList.remove("softlock-lock");
    document.body.classList.remove("softlock-lock");
    const ov = document.querySelector(".softlock-overlay");
    if (ov) ov.remove();
  };

  // Pase directo con ?code=
  try {
    const qs = new URLSearchParams(location.search);
    const qv = (qs.get(PARAM_NAME)||"").trim();
    if (qv && checkCode(qv)){
      saveState(true);
      const temp = document.createElement("div");
      temp.className = "softlock-overlay flash-green";
      document.body.appendChild(temp);
      setTimeout(()=>{ temp.remove(); unlock(); }, 450);
      return;
    }
  } catch {}

  // Construye overlay
  const { overlay } = buildOverlay(
    async (val, ui) => {
      if (!checkCode(val)) { ui.showError?.("Código incorrecto"); return false; }
      ui.flash("green"); saveState(true); setTimeout(unlock, 420); return true;
    }
  );
  wrap.appendChild(overlay);
})();