(()=>{'use strict';
  const root=document.querySelector('[data-glass-app]');if(!root)return;
  const byId=(id)=>document.getElementById(id);
  const controls={transparency:byId('gls-transparency'),blur:byId('gls-blur'),outline:byId('gls-outline'),radius:byId('gls-radius'),saturation:byId('gls-saturation'),color:byId('gls-color')};
  const outputs={transparency:byId('gls-transparency-output'),blur:byId('gls-blur-output'),outline:byId('gls-outline-output'),radius:byId('gls-radius-output'),saturation:byId('gls-saturation-output')};
  const code=byId('gls-code'),glass=byId('gls-preview'),stage=byId('gls-stage'),hexInput=byId('gls-hex'),toast=byId('gls-toast');
  const defaults={transparency:20,blur:15,outline:30,radius:24,saturation:140,color:'#ffffff'};
  const presets={subtle:{transparency:11,blur:6,outline:22,radius:18,saturation:130,color:'#ffffff'},frosted:{transparency:23,blur:18,outline:36,radius:24,saturation:150,color:'#ffffff'},strong:{transparency:48,blur:24,outline:55,radius:32,saturation:165,color:'#ffffff'},dark:{transparency:35,blur:16,outline:28,radius:22,saturation:135,color:'#171e2a'}};
  let state={...defaults},toastTimer;
  function rgbFromHex(hex){return [1,3,5].map(n=>parseInt(hex.slice(n,n+2),16))}
  function css(){const [r,g,b]=rgbFromHex(state.color);const fill=(state.transparency/100).toFixed(2),border=(state.outline/100).toFixed(2);return `.glass {\n  background: rgba(${r}, ${g}, ${b}, ${fill});\n  border: 1px solid rgba(${r}, ${g}, ${b}, ${border});\n  border-radius: ${state.radius}px;\n  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.16);\n  -webkit-backdrop-filter: blur(${state.blur}px) saturate(${state.saturation}%);\n  backdrop-filter: blur(${state.blur}px) saturate(${state.saturation}%);\n}`}
  function rgbaText(v){const [r,g,b]=rgbFromHex(state.color);return `rgba(${r},${g},${b},${(v/100).toFixed(2)})`}
  function draw(){
    glass.style.background=rgbaText(state.transparency);glass.style.border=`1px solid ${rgbaText(state.outline)}`;glass.style.borderRadius=state.radius+'px';
    const [red,green,blue]=rgbFromHex(state.color);const isDark=(red*.299+green*.587+blue*.114<105 && state.transparency>=25);
    glass.style.setProperty('--gls-preview-ink',isDark?'#ffffff':'#151515');glass.style.setProperty('--gls-preview-subink',isDark?'#ffffffcb':'#232323b8');
    glass.style.webkitBackdropFilter=`blur(${state.blur}px) saturate(${state.saturation}%)`;glass.style.backdropFilter=`blur(${state.blur}px) saturate(${state.saturation}%)`;glass.style.boxShadow='0 8px 32px rgba(0,0,0,.16)';
    for(const [k,el] of Object.entries(controls)){
      el.value=state[k];if(el.type==='range'){
        const mn=Number(el.min),mx=Number(el.max);el.style.setProperty('--pct',`${(state[k]-mn)/(mx-mn)*100}%`);
      }
    }
    hexInput.value=state.color.toUpperCase();
    outputs.transparency.textContent=state.transparency+'%';outputs.blur.textContent=state.blur+' px';outputs.outline.textContent=state.outline+'%';outputs.radius.textContent=state.radius+' px';outputs.saturation.textContent=state.saturation+'%';
    code.textContent=css();
    document.querySelectorAll('[data-preset]').forEach(el=>{let p=presets[el.dataset.preset];el.setAttribute('aria-pressed',String(!!p&&Object.keys(p).every(k=>p[k]===state[k])))});
    const previewLabel=byId('gls-preview-label');if(previewLabel)previewLabel.textContent=state.transparency>=40?'Cristal denso.':'Una nueva textura.';
  }
  for(const [k,el] of Object.entries(controls))el.addEventListener('input',()=>{state[k]=el.type==='range'?Number(el.value):el.value;draw()});
  hexInput.addEventListener('change',()=>{let candidate=hexInput.value.trim();if(/^#[0-9a-f]{6}$/i.test(candidate)){state.color=candidate.toLowerCase();draw()}else{hexInput.value=state.color.toUpperCase();notify('Usa un color HEX de seis dígitos')}});
  hexInput.addEventListener('keydown',e=>{if(e.key==='Enter')hexInput.blur()});
  document.querySelectorAll('[data-preset]').forEach(el=>el.addEventListener('click',()=>{state={...presets[el.dataset.preset]};draw()}));
  document.querySelectorAll('[data-scene]').forEach(el=>el.addEventListener('click',()=>{stage.dataset.scene=el.dataset.scene;document.querySelectorAll('[data-scene]').forEach(b=>b.setAttribute('aria-pressed',String(b===el)))}));
  byId('gls-reset').addEventListener('click',()=>{state={...defaults};draw();notify('Valores restablecidos')});
  function notify(msg){toast.textContent=msg;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),1900)}
  async function copy(){const txt=css();try{if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(txt)}else{const ta=document.createElement('textarea');ta.value=txt;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();const ok=document.execCommand('copy');ta.remove();if(!ok)throw new Error('copy not supported')}notify('CSS copiado al portapapeles')}catch(e){notify('Selecciona el código y cópialo');const sel=window.getSelection();const range=document.createRange();range.selectNodeContents(code);sel.removeAllRanges();sel.addRange(range)}}
  document.querySelectorAll('[data-copy]').forEach(b=>b.addEventListener('click',copy));
  const brand=byId('gls-brand'),logo=byId('gls-logo');if(logo){logo.addEventListener('load',()=>brand.classList.add('has-logo'));logo.addEventListener('error',()=>brand.classList.remove('has-logo'));if(logo.complete&&logo.naturalWidth>0)brand.classList.add('has-logo')}
  draw();
})();
