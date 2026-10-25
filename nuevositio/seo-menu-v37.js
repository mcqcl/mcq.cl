(() => {
  'use strict';
  // Ajustes de presentación de metadatos al cambiar el idioma, sin prometer
  // indexación separada: la URL y el contenido inicial siguen siendo españoles.
  const meta={
    es:{title:"CANALES® | Diseño gráfico, branding y portafolio — Manuel Canales",
      description:"Conoce CANALES, el portafolio de Manuel Canales en Lima, Perú: branding, diseño gráfico, diseño editorial, desarrollo web y piezas animadas."},
    en:{title:"CANALES® | Graphic Design, Branding & Portfolio — Manuel Canales",
      description:"Explore CANALES by Manuel Canales in Lima, Peru: branding, graphic design, editorial design, web development and motion graphics."},
    pt:{title:"CANALES® | Design Gráfico, Branding e Portfólio — Manuel Canales",
      description:"Conheça CANALES, portfólio de Manuel Canales em Lima, Peru: branding, design gráfico, design editorial, desenvolvimento web e animação."}
  };
  const setMeta=(selector,text)=>{const el=document.querySelector(selector);if(el)el.setAttribute('content',text)};
  const change=(lang)=>{
    const m=meta[lang]||meta.es;
    document.title=m.title;
    setMeta('meta[name="description"]',m.description);
    setMeta('meta[property="og:title"]',m.title);
    setMeta('meta[property="og:description"]',m.description);
    setMeta('meta[name="twitter:title"]',m.title);
    setMeta('meta[name="twitter:description"]',m.description);
  };
  function current(){
    const l=document.documentElement.lang.toLowerCase();
    return l.startsWith('pt')?'pt':l.startsWith('en')?'en':'es';
  }
  document.querySelectorAll('[data-mcq-lang]').forEach(b=>b.addEventListener('click',()=>change(b.dataset.mcqLang)));
  change(current());
})();