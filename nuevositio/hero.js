(() => {
  const hero = document.getElementById('mcq-hero');
  const dataEl = document.getElementById('mcq-data');
  if (!hero || !dataEl) return;
  let parsed;
  try { parsed = JSON.parse(dataEl.textContent); } catch(e) { console.error('JSON del hero inválido',e); return; }
  const slides = Array.isArray(parsed) ? parsed.filter(x => x && x.activo == 1) : [];
  if (!slides.length) return;
  const logoBase='https://cdn.mcq.cl/cqhero/logo/';
  const fondoBase='https://cdn.mcq.cl/cqhero/fondo/';
  const urlBase='https://www.canales.pe/';
  const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safeFile=x=>encodeURIComponent(String(x??'').split('/').pop());
  const safeSlug=x=>String(x??'').split('/').filter(Boolean).map(encodeURIComponent).join('/');
  const stage=document.createElement('div');stage.className='mcqhero-stage';
  slides.forEach((s,i)=>{
    const el=document.createElement('article');el.className='mcqhero-slide'+(i===0?' mcqhero-active':'');
    // Imagen real en una capa independiente: el recorte responsive se controla con object-position.
    const bg=document.createElement('img');bg.className='mcqhero-bg';
    bg.src=fondoBase+safeFile(s.fondo);bg.alt='';bg.decoding='async';
    bg.loading=i===0?'eager':'lazy';
    if(i===0)bg.fetchPriority='high';
    el.setAttribute('aria-hidden',String(i!==0));
    const layout=document.createElement('div');layout.className='mcqhero-layout';
    const copy=document.createElement('div');copy.className='mcqhero-copy';
    const eyebrow=document.createElement('p');eyebrow.className='mcqhero-eyebrow';eyebrow.textContent=`PROYECTO DESTACADO  /  ${String(i+1).padStart(2,'0')}`;
    const logo=document.createElement('img');logo.className='mcqhero-project-logo';logo.src=logoBase+safeFile(s.logo);logo.alt=s.slug?String(s.slug).replace(/[-_]/g,' '):'Logotipo del proyecto';logo.loading=i===0?'eager':'lazy';
    const description=document.createElement('p');description.className='mcqhero-description';
    // Conservar únicamente el énfasis <b> que usa actualmente el JSON; no interpretar otro HTML.
    const pieces=String(s.descripcion??'').split(/(<\/?b>)/ig);let bold=false;
    for(const part of pieces){if(/^<b>$/i.test(part)){bold=true;continue;}if(/^<\/b>$/i.test(part)){bold=false;continue;}if(!part)continue;const node=bold?document.createElement('b'):document.createTextNode(part);if(bold)node.textContent=part;description.append(node);}
    const cta=document.createElement('a');cta.className='mcqhero-cta';cta.href=urlBase+safeSlug(s.slug);const ctaText=document.createElement('span');ctaText.className='mcqhero-cta-label';ctaText.textContent=String(s.titulo||'Ver proyecto');const ctaIcon=document.createElement('i');ctaIcon.className='bi bi-arrow-up-right mcqhero-cta-icon mcq-vector-icon';ctaIcon.setAttribute('aria-hidden','true');ctaIcon.innerHTML="<svg class=\"mcq-icon-svg\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\" fill=\"currentColor\" focusable=\"false\" aria-hidden=\"true\"><path fill-rule=\"evenodd\" d=\"M14 2a1 1 0 0 1 1 1v10a1 1 0 1 1-2 0V5.414l-9.293 9.293a1 1 0 0 1-1.414-1.414L11.586 4H4a1 1 0 1 1 0-2z\"/></svg>";cta.append(ctaText,ctaIcon);
    copy.append(eyebrow,logo,description,cta);layout.append(copy);el.append(bg,layout);stage.append(el);
  });
  const bottom=document.createElement('div');bottom.className='mcqhero-bottom';
  const dots=document.createElement('div');dots.className='mcqhero-pagination';dots.setAttribute('aria-label','Seleccionar proyecto');
  slides.forEach((s,i)=>{const btn=document.createElement('button');btn.className='mcqhero-dot';btn.type='button';btn.setAttribute('aria-label',`Mostrar proyecto ${i+1}`);btn.setAttribute('aria-current',String(i===0));btn.innerHTML='<span class="mcqhero-progress"></span>';btn.addEventListener('click',()=>go(i));dots.append(btn);});
  const count=document.createElement('span');count.className='mcqhero-counter';
  const nav=document.createElement('div');nav.className='mcqhero-nav';
  const button=(label,icon,klass)=>{const b=document.createElement('button');b.type='button';b.className=klass;b.setAttribute('aria-label',label);const vectors={"arrow-left":"<svg class=\"mcq-icon-svg\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\" fill=\"currentColor\" focusable=\"false\" aria-hidden=\"true\"><path fill-rule=\"evenodd\" d=\"M15 8a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 0 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 7.5H14.5A.5.5 0 0 1 15 8z\"/></svg>","arrow-right":"<svg class=\"mcq-icon-svg\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\" fill=\"currentColor\" focusable=\"false\" aria-hidden=\"true\"><path fill-rule=\"evenodd\" d=\"M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z\"/></svg>","pause-fill":"<svg class=\"mcq-icon-svg\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\" fill=\"currentColor\" focusable=\"false\" aria-hidden=\"true\"><path d=\"M5.5 3.5A.5.5 0 0 1 6 4v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5m5 0a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5\"/></svg>","play-fill":"<svg class=\"mcq-icon-svg\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\" fill=\"currentColor\" focusable=\"false\" aria-hidden=\"true\"><path d=\"m11.596 8.697-6.363 3.692A.8.8 0 0 1 4 11.692V4.308a.8.8 0 0 1 1.233-.697l6.363 3.692a.8.8 0 0 1 0 1.394\"/></svg>"};b.innerHTML=`<i class="bi bi-${icon} mcq-vector-icon" aria-hidden="true">${vectors[icon]||''}</i>`;return b;};
  const prev=button('Proyecto anterior','arrow-left','mcqhero-arrow'),next=button('Proyecto siguiente','arrow-right','mcqhero-arrow'),pause=button('Pausar reproducción','pause-fill','mcqhero-pause');pause.setAttribute('aria-pressed','false');
  nav.append(prev,next,pause);bottom.append(dots,count,nav);hero.append(stage,bottom);
  const cards=[...stage.children],buttons=[...dots.children];
  const duration=5000;let index=0,timer=null,paused=false,progressStart=0,remaining=duration;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const runBar=()=>{buttons.forEach((b,i)=>{const bar=b.firstChild;bar.style.transition='none';bar.style.width=i<index?'100%':'0%';});if(paused||document.hidden||reduced)return;const bar=buttons[index].firstChild;requestAnimationFrame(()=>requestAnimationFrame(()=>{bar.style.transition=`width ${remaining}ms linear`;bar.style.width='100%';}));};
  function stop(){clearTimeout(timer);timer=null;const bar=buttons[index].firstChild;const w=bar.getBoundingClientRect().width,whole=buttons[index].getBoundingClientRect().width;remaining=Math.max(0,duration*(1-Math.min(1,w/Math.max(1,whole))));bar.style.transition='none';bar.style.width=(100*(1-remaining/duration))+'%';}
  function schedule(){clearTimeout(timer);runBar();if(paused||document.hidden||reduced||slides.length===1)return;progressStart=performance.now();timer=setTimeout(()=>go((index+1)%slides.length),remaining);}
  function go(i){clearTimeout(timer);index=(i+slides.length)%slides.length;remaining=duration;cards.forEach((c,n)=>{c.classList.toggle('mcqhero-active',n===index);c.setAttribute('aria-hidden',String(n!==index));c.inert=n!==index;});buttons.forEach((b,n)=>b.setAttribute('aria-current',String(n===index)));count.textContent=`${String(index+1).padStart(2,'0')} / ${String(slides.length).padStart(2,'0')}`;const nextImage=new Image();nextImage.src=fondoBase+safeFile(slides[(index+1)%slides.length].fondo);schedule();}
  prev.addEventListener('click',()=>go(index-1));next.addEventListener('click',()=>go(index+1));
  pause.addEventListener('click',()=>{if(!paused)stop();paused=!paused;pause.setAttribute('aria-label',paused?'Reanudar reproducción':'Pausar reproducción');pause.setAttribute('aria-pressed',String(paused));pause.firstChild.className=paused?'bi bi-play-fill mcq-vector-icon':'bi bi-pause-fill mcq-vector-icon';pause.firstChild.innerHTML=paused?"<svg class=\"mcq-icon-svg\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\" fill=\"currentColor\" focusable=\"false\" aria-hidden=\"true\"><path d=\"m11.596 8.697-6.363 3.692A.8.8 0 0 1 4 11.692V4.308a.8.8 0 0 1 1.233-.697l6.363 3.692a.8.8 0 0 1 0 1.394\"/></svg>":"<svg class=\"mcq-icon-svg\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\" fill=\"currentColor\" focusable=\"false\" aria-hidden=\"true\"><path d=\"M5.5 3.5A.5.5 0 0 1 6 4v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5m5 0a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5\"/></svg>";if(!paused)schedule();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else if(!paused)schedule();});
  let touchStart=null;
  hero.addEventListener('touchstart',e=>{
    if(e.touches.length!==1||e.target.closest('a,button')){touchStart=null;return;}
    touchStart={x:e.touches[0].clientX,y:e.touches[0].clientY};
  },{passive:true});
  hero.addEventListener('touchcancel',()=>{touchStart=null;},{passive:true});
  hero.addEventListener('touchend',e=>{
    if(!touchStart||!e.changedTouches.length)return;
    const dx=e.changedTouches[0].clientX-touchStart.x;
    const dy=e.changedTouches[0].clientY-touchStart.y;
    touchStart=null;
    if(Math.abs(dx)>=60&&Math.abs(dx)>Math.abs(dy)*1.4)go(index+(dx<0?1:-1));
  },{passive:true});
  go(0);
})();
