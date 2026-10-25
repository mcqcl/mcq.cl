/* Contadores: se animan una sola vez al entrar en pantalla. */
(()=>{
  const section=document.getElementById('mcq-stats');
  if(!section)return;
  const nodes=[...section.querySelectorAll('[data-mcqstats-target]')];
  const numberFormatter=new Intl.NumberFormat('es-PE');
  const format=n=>numberFormatter.format(n);
  const setFinal=()=>nodes.forEach(el=>el.textContent=format(Number(el.dataset.mcqstatsTarget)));
  if(!('IntersectionObserver' in window)||window.matchMedia('(prefers-reduced-motion: reduce)').matches){setFinal();return;}
  let done=false;
  const observer=new IntersectionObserver(entries=>{
    if(done||!entries.some(e=>e.isIntersecting))return;
    done=true;observer.disconnect();
    const targets=nodes.map(el=>Number(el.dataset.mcqstatsTarget));
    const duration=1350;let start;
    function tick(timestamp){
      if(start===undefined)start=timestamp;
      const t=Math.min(1,(timestamp-start)/duration);
      const eased=1-Math.pow(1-t,3);
      nodes.forEach((el,i)=>el.textContent=format(Math.round(targets[i]*eased)));
      if(t<1)requestAnimationFrame(tick);else setFinal();
    }
    requestAnimationFrame(tick);
  },{threshold:0.18});
  observer.observe(section);
})();
