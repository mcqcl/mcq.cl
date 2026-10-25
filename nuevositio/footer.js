(() => {
  'use strict';
  const footer = document.getElementById('mcq-footer');
  if (!footer) return;
  const year = footer.querySelector('#mcqfoot-year');
  if (year) year.textContent = String(new Date().getFullYear());

  const button = footer.querySelector('.mcqfoot-heart-button');
  const layer = footer.querySelector('.mcqfoot-heart-layer');
  if (!button || !layer) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let lastBurst = 0;
  button.addEventListener('animationend', () => button.classList.remove('mcqfoot-heart-pop'));
  button.addEventListener('click', () => {
    if (reduced.matches) return;
    const time = Date.now();
    if (time - lastBurst < 550) return;
    lastBurst = time;
    button.classList.remove('mcqfoot-heart-pop');
    void button.offsetWidth;
    button.classList.add('mcqfoot-heart-pop');

    const btn = button.getBoundingClientRect();
    const bounds = layer.getBoundingClientRect();
    const origin = (btn.left + btn.width / 2 - bounds.left) / bounds.width * 100;
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < 12; i++) {
      const heart = document.createElement('span');
      heart.className = 'mcqfoot-flying-heart ' + (i % 2 ? 'mcqfoot-flying-heart--peru' : 'mcqfoot-flying-heart--lima');
      heart.textContent = '♥';
      heart.style.setProperty('--mcqfoot-x', `${origin + (Math.random() - .5) * 13}%`);
      heart.style.setProperty('--mcqfoot-size', `${13 + Math.random() * 14}px`);
      heart.style.setProperty('--mcqfoot-drift', `${(Math.random() - .5) * 230}px`);
      heart.style.setProperty('--mcqfoot-rotate', `${(Math.random() - .5) * 80}deg`);
      heart.style.setProperty('--mcqfoot-duration', `${950 + Math.random() * 520}ms`);
      heart.addEventListener('animationend', () => heart.remove(), { once:true });
      fragment.append(heart);
    }
    layer.append(fragment);
  });
})();
