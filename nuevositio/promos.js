/* V50: one unique promotion of each network, randomly assigned to two fixed slots. */
(() => {
  'use strict';
  const first=document.getElementById('mcq-promo-slot-1');
  const second=document.getElementById('mcq-promo-slot-2');
  if (!first || !second || !first.firstElementChild || !second.firstElementChild) return;
  const random = window.crypto && window.crypto.getRandomValues
    ? window.crypto.getRandomValues(new Uint32Array(1))[0]/4294967296
    : Math.random();
  if (random < .5) {
    const node=first.firstElementChild;
    first.appendChild(second.firstElementChild);
    second.appendChild(node);
  }
})();
