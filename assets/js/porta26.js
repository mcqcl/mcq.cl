(() => {
  const grid=document.querySelector('#cqpfolio .cqp-grid'); if(!grid)return;
  const cards=Array.from(grid.children);
  // Orden aleatorio
  for(let i=cards.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[cards[i],cards[j]]=[cards[j],cards[i]];}
  cards.forEach(c=>grid.appendChild(c));
  // Entrada escalonada
  const io=new IntersectionObserver((entries)=>{entries.forEach((e,idx)=>{if(e.isIntersecting){const el=e.target;el.classList.add('cqp-ready');el.style.animationDelay=(idx*60)+'ms';io.unobserve(el);}});},{threshold:.12});
  cards.forEach(c=>io.observe(c));
  // Tilt y spotlight
  const MAX_TILT=10, IMG_SHIFT=10;
  const spot=(c)=>c.querySelector('.cqp-spot'); const img=(c)=>c.querySelector('img');
  function move(e){const c=e.currentTarget,r=c.getBoundingClientRect();const x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;const rx=(MAX_TILT/2-y*MAX_TILT).toFixed(2),ry=(x*MAX_TILT-MAX_TILT/2).toFixed(2);c.style.transform=`rotateX(${rx}deg) rotateY(${ry}deg)`;img(c).style.transform=`translate(${((x-.5)*2*IMG_SHIFT).toFixed(2)}px,${((y-.5)*2*IMG_SHIFT).toFixed(2)}px) scale(1.08)`;const s=spot(c);s.style.setProperty('--mx',(x*100)+'%');s.style.setProperty('--my',(y*100)+'%');}
  function enter(e){spot(e.currentTarget).style.opacity='1';}
  function leave(e){const c=e.currentTarget;c.style.transform='rotateX(0) rotateY(0)';img(c).style.transform='translate(0,0) scale(1)';spot(c).style.opacity='.42';}
  cards.forEach(c=>{c.addEventListener('pointermove',move);c.addEventListener('pointerenter',enter);c.addEventListener('pointerleave',leave);});
})();