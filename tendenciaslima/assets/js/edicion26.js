 // Ondas SOLO en hover del isotipo
    const nosotros = document.getElementById('nosotros');
    const iso = document.getElementById('isoHit');

    function setWaveCenter() {
      if (!nosotros || !iso) return;
      const s = nosotros.getBoundingClientRect();
      const i = iso.getBoundingClientRect();
      const cx = (i.left - s.left) + (i.width / 2);
      const cy = (i.top  - s.top ) + (i.height / 2);
      nosotros.style.setProperty('--cx', cx.toFixed(1) + 'px');
      nosotros.style.setProperty('--cy', cy.toFixed(1) + 'px');
    }

    function waveOn(){ nosotros?.classList.add('wave-on'); }
    function waveOff(){ nosotros?.classList.remove('wave-on'); }

    iso?.addEventListener('mouseenter', () => {
      requestAnimationFrame(() => requestAnimationFrame(() => {
        setWaveCenter();
        waveOn();
      }));
    });
    iso?.addEventListener('mouseleave', waveOff);

    window.addEventListener('resize', () => requestAnimationFrame(setWaveCenter), { passive:true });
    window.addEventListener('load', () => requestAnimationFrame(setWaveCenter), { passive:true });

    // ===== Contadores (animación) =====
    (function initCounters(){
      const metricas = document.getElementById('metricas');
      if (!metricas) return;

      const counters = metricas.querySelectorAll('.counter[data-target]');
      if (!counters.length) return;

      const formatValue = (value, fmt) => {
        const v = Math.max(0, value);

        if (fmt === 'year') return String(Math.round(v));

        const abs = Math.round(v);
        if (abs >= 1_000_000_000) return (abs/1_000_000_000).toFixed(1).replace('.0','') + 'B';
        if (abs >= 1_000_000)     return (abs/1_000_000).toFixed(1).replace('.0','') + 'M';
        if (abs >= 1_000)         return (abs/1_000).toFixed(1).replace('.0','') + 'K';

        return abs.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      };

      const animate = (el) => {
        const target = Number(el.dataset.target || 0);
        const fmt = el.dataset.format || 'compact';
        const duration = Number(el.dataset.duration || 1100);

        const start = performance.now();
        const from = 0;

        const tick = (now) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          const current = from + (target - from) * eased;
          el.textContent = formatValue(current, fmt);
          if (t < 1) requestAnimationFrame(tick);
          else el.textContent = formatValue(target, fmt);
        };

        requestAnimationFrame(tick);
      };

      let played = false;
      const io = new IntersectionObserver((entries) => {
        if (played) return;
        if (!entries.some(e => e.isIntersecting)) return;

        played = true;
        counters.forEach(animate);
        io.disconnect();
      }, { threshold: 0.35 });

      io.observe(metricas);
    })();v