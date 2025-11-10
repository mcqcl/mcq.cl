window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset;
    const scrolled = window.scrollY;

    // Efecto de rotaciÃƒÂ³n
    /* const rotation = scrollTop % 360;
    const rotatingDiv = document.querySelector('.rotating-elemento');
    if (rotatingDiv) {
      rotatingDiv.style.transform = `translate(0%, 0%) rotate(${rotation}deg)`;
    } */

    // Efecto de rotaciÃƒÂ³n (mÃƒÂ¡s lento)
const rotation = (scrollTop / 5) % 360;
const rotatingDiv = document.querySelector('.rotating-elemento');
if (rotatingDiv) {
  rotatingDiv.style.transform = `translate(0%,calc(0% + ${scrolled * 0.25}px)) rotate(${rotation}deg)`;
}


    // Efecto de parallax
    const parallaxImageA = document.querySelector('.parallax-a');
    if (parallaxImageA) {
      parallaxImageA.style.transform = `translate(0%, calc(0% + ${scrolled * 0.25}px))`;
    }

    // Efecto de parallax
    const parallaxImageB = document.querySelector('.parallax-b');
    if (parallaxImageB) {
      parallaxImageB.style.transform = `translate(0%, calc(0% + ${scrolled * 0.35}px))`;
    }

    // Efecto de parallax
    const parallaxImageC = document.querySelector('.parallax-c');
    if (parallaxImageC) {
      parallaxImageC.style.transform = `translate(0%, calc(0% + ${scrolled * 0.4}px))`;
    }

    // Efecto de parallax
    const parallaxImageD = document.querySelector('.parallax-d');
    if (parallaxImageD) {
      parallaxImageD.style.transform = `translate(0%, calc(0% + ${scrolled * 0.25}px))`;
    }

    // Efecto de parallax
    const parallaxImageE = document.querySelector('.parallax-artista');
    if (parallaxImageE) {
      parallaxImageE.style.transform = `translate(0%, calc(0% + ${scrolled * 0.25}px))`;
    }

    // Efecto de parallax
    const parallaxImageF = document.querySelector('.parallax-f');
    if (parallaxImageF) {
      parallaxImageF.style.transform = `translate(0%, calc(0% + ${scrolled * 0.1}px))`;
    }


  });