(() => {
  const root = document.getElementById('mcq-contact');
  if (!root) return;
  const status = root.querySelector('.mcqcontact-status');
  const label = root.querySelector('.mcqcontact-status-text');
  const clock = root.querySelector('#mcqcontact-clock');
  const tz = 'America/Lima';
  const clockFormat = new Intl.DateTimeFormat('en-US', {
    timeZone: tz, hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true
  });
  const hourFormat = new Intl.DateTimeFormat('en-GB', {
    timeZone: tz, hour: '2-digit', hourCycle: 'h23'
  });
  let lastState = '';
  function update() {
    const now = new Date();
    const hour = Number(hourFormat.format(now));
    const state = hour >= 9 && hour < 20 ? 'ok' : hour >= 20 && hour < 22 ? 'later' : 'off';
    const text = state === 'ok' ? 'Disponible ahora' : state === 'later' ? 'Respondo más tarde' : 'Fuera de horario';
    status.dataset.state = state;
    // Actualizar el texto solo cuando cambia el estado: evita anuncios cada segundo.
    if (state !== lastState) { label.textContent = text; lastState = state; }
    const parts = clockFormat.formatToParts(now);
    const take = type => parts.find(p => p.type === type)?.value || '';
    const period = take('dayPeriod').toLowerCase() === 'am' ? 'a. m.' : 'p. m.';
    clock.innerHTML = `${take('hour')}:${take('minute')}:${take('second')} <small>${period}</small>`;
    clock.dateTime = now.toISOString();
  }
  update();
  const timer = setInterval(() => { if (!document.hidden) update(); }, 1000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) update(); });
})();
