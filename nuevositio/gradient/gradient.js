/* CANALES Gradient Lab — original, standalone editor. No external libraries. */
(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const defaults = [
    {id:1,pos:0,hex:'#2A7B9B',alpha:100},
    {id:2,pos:50,hex:'#57C785',alpha:100},
    {id:3,pos:100,hex:'#EDDD53',alpha:100}
  ];
  const presets = [
    {name:'Espectro', colors:['#2A7B9B','#57C785','#EDDD53'], angle:90},
    {name:'Atardecer',colors:['#EB3963','#EF8652','#F8CD86'],angle:125},
    {name:'Órbita',colors:['#18264D','#6255C8','#D5AEF5'],angle:135},
    {name:'Bosque',colors:['#043A30','#2E9969','#D0EB9D'],angle:105},
    {name:'Monocromo',colors:['#101010','#606060','#F0F0F0'],angle:90},
    {name:'Eléctrico',colors:['#3F19AA','#199DF5','#3DF0D0'],angle:110}
  ];
  const state={type:'linear',angle:90,origin:'center',stops:defaults.map(s=>({...s})),active:1,nextId:4};
  const clamp=(n,a,b)=>Math.min(b,Math.max(a,n));
  const sorted=()=>[...state.stops].sort((a,b)=>a.pos-b.pos||a.id-b.id);
  const active=()=>state.stops.find(s=>s.id===state.active)||state.stops[0];
  const hexToRgb=(hex)=>[1,3,5].map(i=>parseInt(hex.substring(i,i+2),16));
  const rgbToHex=(r,g,b)=>'#'+[r,g,b].map(x=>Math.round(clamp(x,0,255)).toString(16).padStart(2,'0')).join('').toUpperCase();
  const normalizeHex=(raw)=>{let h=String(raw||'').trim().replace(/^#/,'');if(/^[0-9a-f]{3}$/i.test(h))h=h.split('').map(x=>x+x).join('');return /^[0-9a-f]{6}$/i.test(h)?'#'+h.toUpperCase():null};
  const rgba=(s)=>{const [r,g,b]=hexToRgb(s.hex);return `rgba(${r}, ${g}, ${b}, ${(s.alpha/100).toFixed(2)})`};
  const gradient=()=>{
    const stops=sorted().map(s=>`${rgba(s)} ${s.pos}%`).join(', ');
    return state.type==='linear'?`linear-gradient(${state.angle}deg, ${stops})`:`radial-gradient(circle at ${state.origin}, ${stops})`;
  };
  const cssCode=()=>{
    const first=sorted()[0];
    return `.gradient {\n  background-color: ${first.hex};\n  background-image: ${gradient()};\n}`;
  };
  const rgbToHsv=(r,g,b)=>{r/=255;g/=255;b/=255;let max=Math.max(r,g,b),min=Math.min(r,g,b),d=max-min,h=0,s=max?d/max:0;
    if(d){switch(max){case r:h=((g-b)/d)%6;break;case g:h=(b-r)/d+2;break;default:h=(r-g)/d+4;}h*=60;if(h<0)h+=360;}
    return {h,s:s*100,v:max*100};};
  const hsvToRgb=(h,s,v)=>{s=clamp(s,0,100)/100;v=clamp(v,0,100)/100;let c=v*s,x=c*(1-Math.abs((h/60)%2-1)),m=v-c,r=0,g=0,b=0;
    if(h<60){r=c;g=x}else if(h<120){r=x;g=c}else if(h<180){g=c;b=x}else if(h<240){g=x;b=c}else if(h<300){r=x;b=c}else{r=c;b=x}
    return [r,g,b].map(n=>Math.round((n+m)*255));};
  const hsvOf=(s)=>rgbToHsv(...hexToRgb(s.hex));
  const cssSafe=(s)=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const timeline=$('cgl-handles'), stopList=$('cgl-stop-list'), picker=$('cgl-picker'),cursor=$('cgl-picker-cursor'),track=$('cgl-track');
  let toastTimer;
  const savedHue=new Map();
  function toast(text){$('cgl-toast').textContent=text;$('cgl-toast').classList.add('is-visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('cgl-toast').classList.remove('is-visible'),2100)}
  function renderPreview(){
    const g=gradient();$('cgl-hero-preview').style.setProperty('--cgl-gradient',g);$('cgl-track-fill').style.backgroundImage=g;
    $('cgl-code').textContent=cssCode();
    $('cgl-stop-count').textContent=`${state.stops.length} ${state.stops.length===1?'PARADA':'PARADAS'}`;
  }
  function renderControls(){
    const s=active(); const [r,g,b]=hexToRgb(s.hex);const hsv=rgbToHsv(r,g,b);
    if(hsv.s<.1)hsv.h=savedHue.get(s.id)??hsv.h;else savedHue.set(s.id,hsv.h);
    $('cgl-active-swatch').style.backgroundColor=s.hex;$('cgl-active-hex').textContent=s.hex;
    const brightness=(r*.299+g*.587+b*.114)/255;
    $('cgl-active-swatch').style.color=brightness>.65?'#141414':'#ffffff';
    $('cgl-hex').value=s.hex;$('cgl-red').value=r;$('cgl-green').value=g;$('cgl-blue').value=b;$('cgl-opacity').value=s.alpha;
    $('cgl-hue').value=Math.round(hsv.h);$('cgl-hue-output').textContent=`${Math.round(hsv.h)}°`;
    $('cgl-alpha').value=s.alpha;$('cgl-alpha-output').textContent=`${s.alpha}%`;
    $('cgl-alpha').style.setProperty('--slider-alpha-color',s.hex);
    picker.style.setProperty('--picker-hue',`hsl(${hsv.h.toFixed(1)} 100% 50%)`);
    cursor.style.left=`${hsv.s}%`;cursor.style.top=`${100-hsv.v}%`;
    picker.setAttribute('aria-valuenow',String(Math.round(hsv.s)));
    picker.setAttribute('aria-valuetext',`Saturación ${Math.round(hsv.s)}%, brillo ${Math.round(hsv.v)}%`);
  }
  function renderStops(){
    timeline.replaceChildren();stopList.replaceChildren();
    const stops=sorted();
    for(const s of stops){
      const handle=document.createElement('button');handle.type='button';handle.className='cgl-stop-handle'+(s.id===state.active?' is-active':'');
      handle.style.left=`${s.pos}%`;handle.style.setProperty('--stop-color',s.hex);handle.dataset.id=s.id;handle.setAttribute('aria-label',`Punto ${s.hex}, ${s.pos}%. Arrastrar o usar flechas`);
      handle.setAttribute('aria-pressed',String(s.id===state.active));
      handle.addEventListener('click',e=>{e.stopPropagation();select(s.id)});
      handle.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End','Delete'].includes(e.key))return;e.preventDefault();e.stopPropagation();
        if(e.key==='Delete'){removeStop(s.id);return}
        if(e.key==='Home')s.pos=0;else if(e.key==='End')s.pos=100;else s.pos=clamp(s.pos+(e.key==='ArrowLeft'?-1:1)*(e.shiftKey?10:1),0,100);
        state.active=s.id;renderAll();const focused=timeline.querySelector(`[data-id="${s.id}"]`);focused?.focus({preventScroll:true});});
      handle.addEventListener('pointerdown',e=>{
        if(e.button!==0&&e.pointerType==='mouse')return;e.preventDefault();e.stopPropagation();state.active=s.id;handle.setPointerCapture(e.pointerId);
        const update=(x)=>{const rect=track.getBoundingClientRect();s.pos=Math.round(clamp((x-rect.left)/rect.width,0,1)*100);handle.style.left=`${s.pos}%`;handle.setAttribute('aria-label',`Punto ${s.hex}, ${s.pos}%`);renderPreview();const row=stopList.querySelector(`[data-row="${s.id}"]`);if(row){row.querySelector('[data-field="position"]').value=s.pos;}};
        update(e.clientX);renderControls();
        const onMove=ev=>{if(ev.pointerId===e.pointerId)update(ev.clientX)};
        const onEnd=ev=>{if(ev.pointerId!==e.pointerId)return;handle.removeEventListener('pointermove',onMove);handle.removeEventListener('pointerup',onEnd);handle.removeEventListener('pointercancel',onEnd);renderAll();};
        handle.addEventListener('pointermove',onMove);handle.addEventListener('pointerup',onEnd);handle.addEventListener('pointercancel',onEnd);
      });
      timeline.append(handle);
      const row=document.createElement('div');row.className='cgl-stop-row'+(s.id===state.active?' is-active':'');row.dataset.row=s.id;
      const safeHex=cssSafe(s.hex);
      row.innerHTML=`<button type="button" class="cgl-row-swatch" data-select="1" style="background:${safeHex}" aria-label="Seleccionar punto ${safeHex}"></button><input class="cgl-stop-hex" data-field="hex" aria-label="Hexadecimal del punto" value="${safeHex}" maxlength="7" spellcheck="false"><input class="cgl-stop-position" data-field="position" type="number" aria-label="Posición porcentual" min="0" max="100" value="${s.pos}"><button class="cgl-stop-remove" type="button" data-remove="1" aria-label="Quitar punto" ${state.stops.length<=2?'disabled':''}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg></button>`;
      row.querySelector('[data-select]').addEventListener('click',()=>select(s.id));
      row.querySelector('[data-field="hex"]').addEventListener('change',ev=>{const h=normalizeHex(ev.target.value);if(h){s.hex=h;state.active=s.id;renderAll()}else{ev.target.value=s.hex;toast('Introduce un color HEX válido')}});
      row.querySelector('[data-field="position"]').addEventListener('change',ev=>{const v=Number(ev.target.value);s.pos=Number.isFinite(v)?Math.round(clamp(v,0,100)):s.pos;state.active=s.id;renderAll()});
      row.querySelector('[data-remove]').addEventListener('click',()=>removeStop(s.id));
      stopList.append(row);
    }
    $('cgl-add').disabled=state.stops.length>=8;$('cgl-add-secondary').disabled=state.stops.length>=8;
  }
  function renderAll(){renderPreview();renderStops();renderControls()}
  function select(id){state.active=id;renderAll()}
  function interpolateColor(at){const st=sorted();if(at<=st[0].pos)return {hex:st[0].hex,alpha:st[0].alpha};if(at>=st[st.length-1].pos)return {hex:st[st.length-1].hex,alpha:st[st.length-1].alpha};
    let a=st[0],b=st[1];for(let i=0;i<st.length-1;i++)if(at>=st[i].pos&&at<=st[i+1].pos){a=st[i];b=st[i+1];break}
    const t=(at-a.pos)/Math.max(1,b.pos-a.pos),ra=hexToRgb(a.hex),rb=hexToRgb(b.hex);
    return {hex:rgbToHex(...ra.map((x,i)=>x+(rb[i]-x)*t)),alpha:Math.round(a.alpha+(b.alpha-a.alpha)*t)};
  }
  function addStop(position){if(state.stops.length>=8){toast('Máximo de 8 puntos');return}
    const pos=position===undefined?Math.round((sorted()[0].pos+sorted()[sorted().length-1].pos)/2):Math.round(clamp(position,0,100));
    const color=interpolateColor(pos);const s={id:state.nextId++,pos,...color};state.stops.push(s);state.active=s.id;renderAll()}
  function removeStop(id){if(state.stops.length<=2){toast('Se necesitan al menos dos puntos');return}state.stops=state.stops.filter(s=>s.id!==id);if(state.active===id)state.active=sorted()[0].id;renderAll()}
  track.addEventListener('click',e=>{if(e.target.closest('.cgl-stop-handle'))return;const r=track.getBoundingClientRect();addStop((e.clientX-r.left)/r.width*100)});
  $('cgl-add').addEventListener('click',()=>addStop());$('cgl-add-secondary').addEventListener('click',()=>addStop());
  for(const b of document.querySelectorAll('[data-type]'))b.addEventListener('click',()=>{state.type=b.dataset.type;document.querySelectorAll('[data-type]').forEach(x=>{x.classList.toggle('is-active',x===b);x.setAttribute('aria-pressed',String(x===b))});$('cgl-angle-wrap').hidden=state.type!=='linear';$('cgl-origin-wrap').hidden=state.type!=='radial';renderPreview()});
  $('cgl-angle').addEventListener('input',e=>{const n=Number(e.target.value);if(Number.isFinite(n)){state.angle=((Math.round(n)%360)+360)%360;renderPreview()}});
  $('cgl-angle').addEventListener('change',e=>{e.target.value=state.angle});
  $('cgl-origin').addEventListener('change',e=>{state.origin=e.target.value;renderPreview()});
  function applyHex(raw){const hex=normalizeHex(raw);if(!hex){$('cgl-hex').value=active().hex;toast('Introduce un color HEX válido');return}active().hex=hex;renderAll()}
  $('cgl-hex').addEventListener('change',e=>applyHex(e.target.value));
  const rgbaInputIds=['cgl-red','cgl-green','cgl-blue'];
  rgbaInputIds.forEach((id)=>$(id).addEventListener('change',()=>{const vals=rgbaInputIds.map(k=>clamp(Number($(k).value)||0,0,255));active().hex=rgbToHex(...vals);renderAll()}));
  $('cgl-opacity').addEventListener('change',e=>{active().alpha=Math.round(clamp(Number(e.target.value)||0,0,100));renderAll()});
  $('cgl-hue').addEventListener('input',e=>{const s=active(),hsv=hsvOf(s),h=Number(e.target.value);savedHue.set(s.id,h);s.hex=rgbToHex(...hsvToRgb(h,hsv.s,hsv.v));renderAll()});
  $('cgl-alpha').addEventListener('input',e=>{active().alpha=Number(e.target.value);renderAll()});
  function updatePicker(e){const rect=picker.getBoundingClientRect(),h=savedHue.get(active().id)??hsvOf(active()).h,s=clamp((e.clientX-rect.left)/rect.width*100,0,100),v=100-clamp((e.clientY-rect.top)/rect.height*100,0,100);active().hex=rgbToHex(...hsvToRgb(h,s,v));renderAll()}
  picker.addEventListener('pointerdown',e=>{e.preventDefault();picker.setPointerCapture(e.pointerId);updatePicker(e)});
  picker.addEventListener('pointermove',e=>{if(e.buttons||e.pointerType==='touch'&&picker.hasPointerCapture(e.pointerId))updatePicker(e)});
  picker.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();let hsv=hsvOf(active()),step=e.shiftKey?10:2;hsv.h=savedHue.get(active().id)??hsv.h; if(e.key==='ArrowLeft')hsv.s-=step;if(e.key==='ArrowRight')hsv.s+=step;if(e.key==='ArrowUp')hsv.v+=step;if(e.key==='ArrowDown')hsv.v-=step;active().hex=rgbToHex(...hsvToRgb(hsv.h,clamp(hsv.s,0,100),clamp(hsv.v,0,100)));renderAll()});
  const palettes=$('cgl-presets');for(const [i,p] of presets.entries()){
    const b=document.createElement('button');b.className='cgl-preset';b.type='button';b.innerHTML=`<span class="cgl-preset-swatch" style="background:linear-gradient(${p.angle}deg,${p.colors.join(',')})"></span><span class="cgl-preset-name">${p.name}</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>`;
    b.addEventListener('click',()=>{applyPalette(p);toast(`Paleta ${p.name} aplicada`)});palettes.append(b);
  }
  function applyPalette(p){state.type='linear';state.angle=p.angle;state.stops=p.colors.map((hex,i)=>({id:++state.nextId,pos:Math.round(i/(p.colors.length-1)*100),hex,alpha:100}));state.active=state.stops[0].id;$('cgl-angle').value=state.angle;$('cgl-angle-wrap').hidden=false;$('cgl-origin-wrap').hidden=true;document.querySelectorAll('[data-type]').forEach(b=>{const yes=b.dataset.type==='linear';b.classList.toggle('is-active',yes);b.setAttribute('aria-pressed',String(yes))});renderAll()}
  $('cgl-random').addEventListener('click',()=>{const h=Math.floor(Math.random()*360),cols=[h,(h+65)%360,(h+155)%360].map((x,i)=>rgbToHex(...hsvToRgb(x,64+i*8,90)));applyPalette({colors:cols,angle:Math.floor(Math.random()*360)});toast('Nueva combinación creada')});
  $('cgl-reset').addEventListener('click',()=>{state.stops=defaults.map(s=>({...s}));state.active=1;state.nextId=4;state.type='linear';state.angle=90;state.origin='center';$('cgl-angle').value=90;$('cgl-origin').value='center';$('cgl-angle-wrap').hidden=false;$('cgl-origin-wrap').hidden=true;document.querySelectorAll('[data-type]').forEach(b=>{const yes=b.dataset.type==='linear';b.classList.toggle('is-active',yes);b.setAttribute('aria-pressed',String(yes))});renderAll();toast('Valores restablecidos')});
  async function copyText(value){try{if(navigator.clipboard&&window.isSecureContext)await navigator.clipboard.writeText(value);else{let ta=document.createElement('textarea');ta.value=value;ta.style.position='fixed';ta.style.opacity=0;document.body.append(ta);ta.select();if(!document.execCommand('copy'))throw new Error('copy');ta.remove()}toast('Copiado al portapapeles')}catch(e){toast('Selecciona el texto y cópialo');const sel=window.getSelection(),range=document.createRange();range.selectNodeContents($('cgl-code'));sel.removeAllRanges();sel.addRange(range)}}
  $('cgl-copy-css').addEventListener('click',()=>copyText(cssCode()));$('cgl-copy-hex').addEventListener('click',()=>copyText(active().hex));
  $('cgl-year').textContent=new Date().getFullYear();
  const logo=document.querySelector('.cgl-brand img');logo?.addEventListener('error',()=>logo.hidden=true);
  renderAll();
})();
