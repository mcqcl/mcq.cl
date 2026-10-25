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
    const cta=document.createElement('a');cta.className='mcqhero-cta';cta.href=urlBase+safeSlug(s.slug);cta.innerHTML='<i class="bi bi-arrow-up-right" aria-hidden="true"></i> ';cta.append(document.createTextNode(String(s.titulo||'Ver proyecto')));
    copy.append(eyebrow,logo,description,cta);layout.append(copy);el.append(bg,layout);stage.append(el);
  });
  const bottom=document.createElement('div');bottom.className='mcqhero-bottom';
  const dots=document.createElement('div');dots.className='mcqhero-pagination';dots.setAttribute('aria-label','Seleccionar proyecto');
  slides.forEach((s,i)=>{const btn=document.createElement('button');btn.className='mcqhero-dot';btn.type='button';btn.setAttribute('aria-label',`Mostrar proyecto ${i+1}`);btn.setAttribute('aria-current',String(i===0));btn.innerHTML='<span class="mcqhero-progress"></span>';btn.addEventListener('click',()=>go(i));dots.append(btn);});
  const count=document.createElement('span');count.className='mcqhero-counter';
  const nav=document.createElement('div');nav.className='mcqhero-nav';
  const button=(label,icon,klass)=>{const b=document.createElement('button');b.type='button';b.className=klass;b.setAttribute('aria-label',label);b.innerHTML=`<i class="bi bi-${icon}" aria-hidden="true"></i>`;return b;};
  const prev=button('Proyecto anterior','arrow-left','mcqhero-arrow'),next=button('Proyecto siguiente','arrow-right','mcqhero-arrow'),pause=button('Pausar reproducción','pause-fill','mcqhero-pause');
  nav.append(prev,next,pause);bottom.append(dots,count,nav);hero.append(stage,bottom);
  const cards=[...stage.children],buttons=[...dots.children];
  const duration=5000;let index=0,timer=null,paused=false,progressStart=0,remaining=duration;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const runBar=()=>{buttons.forEach((b,i)=>{const bar=b.firstChild;bar.style.transition='none';bar.style.width=i<index?'100%':'0%';});if(paused||document.hidden||reduced)return;const bar=buttons[index].firstChild;requestAnimationFrame(()=>requestAnimationFrame(()=>{bar.style.transition=`width ${remaining}ms linear`;bar.style.width='100%';}));};
  function stop(){clearTimeout(timer);timer=null;const bar=buttons[index].firstChild;const w=bar.getBoundingClientRect().width,whole=buttons[index].getBoundingClientRect().width;remaining=Math.max(0,duration*(1-Math.min(1,w/Math.max(1,whole))));bar.style.transition='none';bar.style.width=(100*(1-remaining/duration))+'%';}
  function schedule(){clearTimeout(timer);runBar();if(paused||document.hidden||reduced||slides.length===1)return;progressStart=performance.now();timer=setTimeout(()=>go((index+1)%slides.length),remaining);}
  function go(i){clearTimeout(timer);index=(i+slides.length)%slides.length;remaining=duration;cards.forEach((c,n)=>{c.classList.toggle('mcqhero-active',n===index);c.setAttribute('aria-hidden',String(n!==index));c.inert=n!==index;});buttons.forEach((b,n)=>b.setAttribute('aria-current',String(n===index)));count.textContent=`${String(index+1).padStart(2,'0')} / ${String(slides.length).padStart(2,'0')}`;const nextImage=new Image();nextImage.src=fondoBase+safeFile(slides[(index+1)%slides.length].fondo);schedule();}
  prev.addEventListener('click',()=>go(index-1));next.addEventListener('click',()=>go(index+1));
  pause.addEventListener('click',()=>{if(!paused)stop();paused=!paused;pause.setAttribute('aria-label',paused?'Reanudar reproducción':'Pausar reproducción');pause.firstChild.className=paused?'bi bi-play-fill':'bi bi-pause-fill';if(!paused)schedule();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else if(!paused)schedule();});
  let sx=null;hero.addEventListener('touchstart',e=>{sx=e.touches[0]?.clientX??null},{passive:true});hero.addEventListener('touchend',e=>{if(sx===null)return;const d=e.changedTouches[0].clientX-sx;sx=null;if(Math.abs(d)>55)go(index+(d<0?1:-1));},{passive:true});
  go(0);
})();
