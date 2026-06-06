const DATA = window.CONSTITUCION_DATA || { metadata: {}, items: [] };
const state = {
  query: '',
  filter: 'todos',
  activeId: null,
  items: DATA.items || []
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const normalize = (value = '') => value
  .toString()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase();

const escapeHtml = (value = '') => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

function highlight(text, query) {
  const safe = escapeHtml(text || '');
  const terms = normalize(query).split(/\s+/).filter(Boolean).filter(t => t.length > 1);
  if (!terms.length) return safe;

  // Accent-insensitive exact reconstruction is complex; this practical version highlights direct variants.
  let output = safe;
  const uniqueTerms = [...new Set(terms)].sort((a, b) => b.length - a.length);
  uniqueTerms.forEach(term => {
    const rx = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    output = output.replace(rx, '<mark>$1</mark>');
  });
  return output;
}

function searchable(item) {
  return normalize([
    item.label,
    item.numero,
    item.tipo,
    item.titulo,
    item.capitulo,
    item.texto,
    `articulo ${item.numero}`,
    `artículo ${item.numero}`
  ].join(' '));
}

function scoreItem(item, query) {
  const q = normalize(query).trim();
  if (!q) return 1;
  const hay = searchable(item);
  const terms = q.split(/\s+/).filter(Boolean);
  let score = 0;
  for (const term of terms) {
    if (hay.includes(term)) score += 1;
    if (normalize(item.label).includes(term)) score += 3;
    if (normalize(item.numero) === term.replace('articulo', '').replace('artículo', '').trim()) score += 5;
  }
  return score;
}

function getFilteredItems() {
  const q = state.query.trim();
  return state.items
    .filter(item => state.filter === 'todos' || item.tipo === state.filter)
    .map(item => ({ item, score: scoreItem(item, q) }))
    .filter(row => !q || row.score > 0)
    .sort((a, b) => {
      if (q && b.score !== a.score) return b.score - a.score;
      const an = parseInt(a.item.numero, 10) || 0;
      const bn = parseInt(b.item.numero, 10) || 0;
      return an - bn;
    })
    .map(row => row.item);
}

function itemContext(item) {
  const bits = [];
  if (item.titulo) bits.push(item.titulo);
  if (item.capitulo) bits.push(item.capitulo);
  if (item.pagina_inicio) {
    const page = item.pagina_inicio === item.pagina_fin ? `p. ${item.pagina_inicio}` : `pp. ${item.pagina_inicio}-${item.pagina_fin}`;
    bits.push(page);
  }
  return bits.join(' · ');
}

function renderIndex() {
  const list = $('#indexList');
  const articles = state.items.filter(item => item.tipo === 'articulo');
  $('#articleCount').textContent = `${articles.length} artículos`;
  list.innerHTML = articles.map(item => `
    <button class="index-item ${state.activeId === item.id ? 'active' : ''}" type="button" data-id="${item.id}">
      <strong>${escapeHtml(item.label)}</strong>
      <small>${escapeHtml((item.texto || '').slice(0, 90))}...</small>
    </button>
  `).join('');
}

function renderResults(items = getFilteredItems()) {
  $('#totalItems').textContent = state.items.length;
  $('#totalArticles').textContent = state.items.filter(item => item.tipo === 'articulo').length;
  $('#resultCount').textContent = items.length;

  const title = state.query ? `Resultados para “${state.query}”` : 'Contenido completo';
  $('#resultsTitle').textContent = title;
  $('#resultsSubtitle').textContent = state.query
    ? 'Se muestran las entradas que contienen uno o más términos buscados.'
    : 'Escribe un término o elige un artículo del índice.';

  const results = $('#results');
  if (!items.length) {
    results.innerHTML = `<div class="empty-state"><strong>No encontré coincidencias.</strong><br>Prueba con otro término o limpia los filtros.</div>`;
    return;
  }

  results.innerHTML = items.map(item => `
    <article class="result-card" id="${item.id}" data-id="${item.id}">
      <div class="result-meta">
        <span class="pill">${escapeHtml(item.tipo)}</span>
        ${item.pagina_inicio ? `<span class="pill">Página ${item.pagina_inicio}${item.pagina_fin !== item.pagina_inicio ? `-${item.pagina_fin}` : ''}</span>` : ''}
      </div>
      <h3>${escapeHtml(item.label)}</h3>
      <div class="context">${escapeHtml(itemContext(item))}</div>
      <div class="legal-text">${highlight(item.texto || '', state.query)}</div>
      <div class="card-actions">
        <button type="button" data-action="speak" data-id="${item.id}"><i class="bi bi-volume-up-fill"></i> Escuchar</button>
        <button class="light-action" type="button" data-action="stop"><i class="bi bi-stop-circle"></i> Detener</button>
        <button class="light-action" type="button" data-action="copy" data-id="${item.id}"><i class="bi bi-copy"></i> Copiar</button>
        <button class="light-action" type="button" data-action="link" data-id="${item.id}"><i class="bi bi-link-45deg"></i> Enlace</button>
      </div>
    </article>
  `).join('');
}

function setActive(id, scroll = true) {
  state.activeId = id;
  renderIndex();
  const item = state.items.find(row => row.id === id);
  if (!item) return;
  state.query = '';
  $('#searchInput').value = '';
  renderResults([item]);
  if (scroll) {
    requestAnimationFrame(() => $('#results')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  }
}

function toast(message) {
  const box = $('#toast');
  box.textContent = message;
  box.classList.add('show');
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => box.classList.remove('show'), 2200);
}

function speakItem(id) {
  const item = state.items.find(row => row.id === id);
  if (!item) return;
  stopSpeech();
  if (!('speechSynthesis' in window)) {
    toast('Tu navegador no soporta texto a voz.');
    return;
  }
  const utterance = new SpeechSynthesisUtterance(`${item.label}. ${item.texto}`);
  utterance.lang = 'es-PE';
  utterance.rate = 0.96;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
  toast(`Leyendo ${item.label}`);
}

function stopSpeech() {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
}

async function copyItem(id) {
  const item = state.items.find(row => row.id === id);
  if (!item) return;
  const text = `${item.label}\n${itemContext(item)}\n\n${item.texto}`.trim();
  try {
    await navigator.clipboard.writeText(text);
    toast('Copiado al portapapeles.');
  } catch (err) {
    toast('No se pudo copiar automáticamente.');
  }
}

async function copyLink(id) {
  const url = `${location.origin}${location.pathname}#${id}`;
  try {
    await navigator.clipboard.writeText(url);
    toast('Enlace copiado.');
  } catch (err) {
    location.hash = id;
  }
}

function bindEvents() {
  $('#searchForm').addEventListener('submit', (event) => {
    event.preventDefault();
    state.query = $('#searchInput').value.trim();
    state.activeId = null;
    renderIndex();
    renderResults();
  });

  $('#searchInput').addEventListener('input', (event) => {
    state.query = event.target.value.trim();
    renderResults();
  });

  $('#clearSearch').addEventListener('click', () => {
    state.query = '';
    state.filter = 'todos';
    state.activeId = null;
    $('#searchInput').value = '';
    $$('.filter-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.filter === 'todos'));
    renderIndex();
    renderResults();
  });

  $$('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.filter = btn.dataset.filter;
      $$('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderResults();
    });
  });

  $('#articleJump').addEventListener('input', (event) => {
    const q = normalize(event.target.value).replace(/articulo|artículo/g, '').trim();
    const buttons = $$('.index-item');
    buttons.forEach(button => {
      const item = state.items.find(row => row.id === button.dataset.id);
      const visible = !q || normalize(`${item.numero} ${item.label} ${item.texto}`).includes(q);
      button.style.display = visible ? 'block' : 'none';
    });
  });

  $('#indexList').addEventListener('click', (event) => {
    const btn = event.target.closest('[data-id]');
    if (btn) setActive(btn.dataset.id);
  });

  $('#results').addEventListener('click', (event) => {
    const btn = event.target.closest('[data-action]');
    if (!btn) return;
    const { action, id } = btn.dataset;
    if (action === 'speak') speakItem(id);
    if (action === 'stop') stopSpeech();
    if (action === 'copy') copyItem(id);
    if (action === 'link') copyLink(id);
  });

  $('#stopSpeechTop').addEventListener('click', stopSpeech);
  $('#themeToggle').addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('constitucion-theme', isDark ? 'dark' : 'light');
    $('#themeToggle').textContent = isDark ? 'Modo claro' : 'Modo oscuro';
  });
}

function initTheme() {
  const saved = localStorage.getItem('constitucion-theme');
  if (saved === 'dark') document.body.classList.add('dark');
  $('#themeToggle').textContent = document.body.classList.contains('dark') ? 'Modo claro' : 'Modo oscuro';
}

function initFromHash() {
  const id = location.hash.replace('#', '').trim();
  if (id && state.items.some(item => item.id === id)) setActive(id, false);
}

initTheme();
bindEvents();
renderIndex();
renderResults(state.items.slice(0, 20));
initFromHash();
