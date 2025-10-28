(() => {
  const nums = document.querySelectorAll('#cqx .cqx-num');
  const motionReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const DURATION = motionReduced ? 0 : 900;
  const ease = t => 1 - Math.pow(1 - t, 3);

  const fmt = (n) => {
    const s = String(n);
    if (n < 1000) return s;
    if (n < 1_000_000) return s.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return s.replace(/^(\d{1,3})(\d{3})(\d{3})$/, "$1'$2,$3");
  };

  const animate = (el, target, suffix) => {
    if (DURATION === 0) { el.textContent = fmt(target) + (suffix || ""); return; }
    const start = performance.now();
    const tick = now => {
      const k = Math.min((now - start) / DURATION, 1);
      el.textContent = fmt(Math.floor(target * ease(k))) + (suffix || "");
      if (k < 1) requestAnimationFrame(tick);
      else el.classList.add('cqx-pop');
    };
    requestAnimationFrame(tick);
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const n = entry.target;
      if (n.dataset.done) return;
      const target = +n.dataset.target || 0;
      const suffix = n.dataset.suffix || "";
      animate(n, target, suffix);
      n.dataset.done = "1";
    });
  }, { threshold: 0.5 });

  nums.forEach(n => io.observe(n));
})();