(() => {
  'use strict';
  const footer=document.getElementById('mcq-footer');
  const canvas=footer?.querySelector('.mcqfoot-cross-field');
  const ctx=canvas?.getContext?.('2d',{alpha:true});
  if(!ctx||!footer)return;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  const CELL=30;
  let crosses=[],w=0,h=0,visible=false,raf=0,last=0,resizeFrame=0;
  const random=(min,max)=>min+Math.random()*(max-min);
  function rebuild(){
    const bounds=footer.getBoundingClientRect();
    w=Math.max(1,Math.ceil(bounds.width)); h=Math.max(1,Math.ceil(bounds.height));
    const dpr=Math.min(devicePixelRatio||1,2);
    canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);
    canvas.style.width=w+'px';canvas.style.height=h+'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
    crosses=[];
    for(let y=15;y<h+CELL;y+=CELL){for(let x=15;x<w+CELL;x+=CELL){
      crosses.push({x,y,phase:random(0,Math.PI*2),period:random(2000,6500),
        boost:Math.random()<.19?random(.07,.15):random(0,.045),
        rest:random(.025,.09),alpha:.16,target:.16,change:random(0,1000)});
    }}
    draw(0);
  }
  function draw(t){
    ctx.clearRect(0,0,w,h);
    ctx.lineWidth=2.5;ctx.lineCap='square';
    const spotX=w*(.5+.37*Math.sin(t/4300));
    const spotY=h*(.5+.35*Math.cos(t/5600));
    for(const p of crosses){
      // Suave pulso individual y halo viajero: no secuencias repetitivas ni flashes.
      const pulse=(1+Math.sin(t*2*Math.PI/p.period+p.phase))*.5;
      const distance=Math.hypot((p.x-spotX)/200,(p.y-spotY)/160);
      const wave=Math.max(0,1-distance)*.035;
      const level=reduce.matches?.25:Math.min(.98,p.rest+p.boost*pulse+wave);
      // Fondo de cruces original #272727, con cruces activas más luminosas.
      const gray=Math.round(39+18*level);
      ctx.strokeStyle=`rgba(${gray},${gray},${gray},${.45+level*.35})`;
      ctx.beginPath();ctx.moveTo(p.x-5.5,p.y);ctx.lineTo(p.x+5.5,p.y);
      ctx.moveTo(p.x,p.y-5.5);ctx.lineTo(p.x,p.y+5.5);ctx.stroke();
    }
  }
  function render(t){
    if(!visible||document.hidden||reduce.matches){raf=0;return}
    if(t-last>=34){draw(t);last=t}
    raf=requestAnimationFrame(render);
  }
  function synchronize(){
    if(raf){cancelAnimationFrame(raf);raf=0}
    last=0;
    if(visible&&!document.hidden&&!reduce.matches)raf=requestAnimationFrame(render);
    else draw(0);
  }
  rebuild();
  const ro=new ResizeObserver(()=>{
    cancelAnimationFrame(resizeFrame);
    resizeFrame=requestAnimationFrame(()=>{const r=footer.getBoundingClientRect();if(Math.ceil(r.width)!==w||Math.ceil(r.height)!==h){rebuild();synchronize()}});
  });
  ro.observe(footer);
  const io=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;synchronize()},{rootMargin:'100px'});
  io.observe(footer);
  document.addEventListener('visibilitychange',synchronize);
  reduce.addEventListener?.('change',synchronize);
})();
