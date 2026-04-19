
(function () {
  const data = window.SMF_DATA || { tracks: [], acts: [] };

  function isAppleDevice() {
    const ua = navigator.userAgent || '';
    const platform = navigator.platform || '';
    const maxTouchPoints = navigator.maxTouchPoints || 0;
    const isIOS = /iPhone|iPad|iPod/i.test(ua) || (/Mac/i.test(platform) && maxTouchPoints > 1);
    const isMac = /Mac/i.test(platform) || /Macintosh/i.test(ua);
    return isIOS || isMac;
  }
  function getDefaultProvider() {
    const saved = localStorage.getItem('smf_music_provider');
    if (saved === 'apple' || saved === 'spotify') return saved;
    return isAppleDevice() ? 'apple' : 'spotify';
  }
  function setProvider(provider) {
    document.querySelectorAll('[data-provider-frame]').forEach(frame => {
      frame.classList.toggle('is-active', frame.dataset.providerFrame === provider);
    });
    document.querySelectorAll('[data-check]').forEach(check => {
      check.classList.toggle('d-none', check.dataset.check !== provider);
    });
    localStorage.setItem('smf_music_provider', provider);
  }
  function reviewForTrack(track) {
    if (track.act.includes('Encanto')) return `${track.song} entra con brillo, deseo y esa fascinación inmediata que abre la historia con fuerza.`;
    if (track.act.includes('Tentación')) return `${track.song} empuja la narrativa hacia una zona más impulsiva: más noche, más riesgo y una energía inevitable.`;
    if (track.act.includes('Vínculo')) return `${track.song} hace que el relato pese más: aquí la emoción deja de ser juego y empieza a dejar marca.`;
    if (track.act.includes('Herida')) return `${track.song} cae del lado de la ruptura: memoria, desorden y un golpe emocional que ya no se esconde.`;
    return `${track.song} cierra dejando huella: dolor, elegancia y algo que sigue brillando incluso al final.`;
  }

  document.querySelectorAll('[data-provider]').forEach(btn => {
    btn.addEventListener('click', function () {
      setProvider(this.dataset.provider);
      const trigger = document.getElementById('smfProviderDropdown');
      bootstrap.Dropdown.getOrCreateInstance(trigger).hide();
    });
  });

  const byAct = document.getElementById('tracksByAct');
  data.acts.forEach(act => {
    const tracks = data.tracks.filter(t => t.act_key === act.key);
    const cards = tracks.map(track => `
      <article class="smf-track-row reveal">
        <div class="smf-track-row-top">
          <div class="smf-track-num">Track ${track.n}</div>
          <div class="smf-track-chip">${act.title}</div>
        </div>
        <h4 class="smf-track-title">${track.song}</h4>
        <div class="smf-track-artist">${track.artist}</div>
        <div class="smf-track-review">${reviewForTrack(track)}</div>
      </article>
    `).join('');

    byAct.insertAdjacentHTML('beforeend', `
      <section class="smf-act-block reveal">
        <div class="smf-act-head">
          <h3>${act.title}</h3>
          <p>${act.text}</p>
        </div>
        <div class="smf-act-grid">${cards}</div>
      </section>
    `);
  });

  setProvider(getDefaultProvider());

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('is-visible');
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();
