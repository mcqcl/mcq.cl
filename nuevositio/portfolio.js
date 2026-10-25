// Portafolio CANALES: orden aleatorio en cada carga de página.
(() => {
  const root = document.getElementById('mcq-portfolio');
  if (!root) return;
  const grid = root.querySelector('.mcqport-grid');
  if (!grid) return;
  const items = Array.from(grid.querySelectorAll(':scope > .mcqport-card'));
  if (items.length < 2) return;
  // Fisher-Yates: cada permutación tiene la misma probabilidad.
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  items.forEach((item, index) => {
    const ordinal = item.querySelector('.mcqport-card-meta span:last-child');
    if (ordinal) ordinal.textContent = `${String(index + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')}`;
    grid.appendChild(item);
  });
})();
