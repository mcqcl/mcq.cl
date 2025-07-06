document.addEventListener("DOMContentLoaded", function () {
  const dataEl = document.getElementById("cq-data");
  if (!dataEl) return;

  const data = JSON.parse(dataEl.textContent);
  const activos = data.filter((item) => item.activo == 1);
  if (activos.length === 0) return;

  let currentIndex = 0;
  const intervalo = 5000;
  let autoTimer;
  let startX = 0;
  let endX = 0;

  const contenedor = document.getElementById("cq-hero");
  const baseLogo = "https://cdn.mcq.cl/cqhero/logo/";
  const baseFondo = "https://cdn.mcq.cl/cqhero/fondo/";
  const baseEnlace = "https://www.canales.pe/";

  // Precargar imágenes de fondo
  activos.forEach((item) => {
    const preload = new Image();
    preload.src = baseFondo + item.fondo;
  });

  // Crear estructura HTML
  const slidesHTML = activos
    .map(
      (item, i) => `
      <div class="cq-carousel-item${i === 0 ? " active" : ""}" style="background-image: url('${baseFondo + item.fondo}')">
        <div class="cq-carousel-container">
          <div class="cq-carousel-content cq-fade-in">
            <img src="${baseLogo + item.logo}" alt="${item.slug}" style="max-width: 220px; margin-bottom: 20px" />
            <p>${item.descripcion}</p>
            <a href="${baseEnlace + item.slug}" class="cq-btn-get-started"><i class="bi bi-arrow-up-right-circle"></i> ${item.titulo}</a>
          </div>
        </div>
      </div>`
    )
    .join("");

  const indicatorsHTML = activos
    .map(
      (_, i) =>
        `<button class="${i === 0 ? "active" : ""}"><span class="progress-bar"></span></button>`
    )
    .join("");

  contenedor.innerHTML = `
    <div class="cq-carousel-wrapper">
      ${slidesHTML}
      <div class="cq-carousel-arrow prev" aria-label="Anterior"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 16L7 10l6-6"/></svg></div>
      <div class="cq-carousel-arrow next" aria-label="Siguiente"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M7 4l6 6-6 6"/></svg></div>
      <div class="cq-carousel-indicators">${indicatorsHTML}</div>
    </div>
  `;

  function cambiarSlide(index) {
    const items = document.querySelectorAll("#cq-hero .cq-carousel-item");
    const indicators = document.querySelectorAll("#cq-hero .cq-carousel-indicators button");

    items.forEach((item, i) => {
      item.classList.toggle("active", i === index);
    });

    indicators.forEach((btn, i) => {
      btn.classList.toggle("active", i === index);
    });

    currentIndex = index;
    avanzarSlide();
  }

  function resetProgressBars() {
    const bars = document.querySelectorAll('#cq-hero .cq-carousel-indicators .progress-bar');
    bars.forEach(bar => {
      bar.style.transition = 'none';
      bar.style.width = '0%';
      void bar.offsetWidth;
      bar.style.transition = `width ${intervalo}ms linear`;
    });
  }

  function startProgressBar(index) {
    const bars = document.querySelectorAll('#cq-hero .cq-carousel-indicators .progress-bar');
    if (bars[index]) {
      bars[index].style.width = '100%';
    }
  }

  function avanzarSlide() {
    clearTimeout(autoTimer);
    resetProgressBars();
    startProgressBar(currentIndex);
    autoTimer = setTimeout(() => {
      currentIndex = (currentIndex + 1) % activos.length;
      cambiarSlide(currentIndex);
    }, intervalo);
  }

  // Eventos de flechas
  contenedor.querySelector(".cq-carousel-arrow.next").addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % activos.length;
    cambiarSlide(currentIndex);
  });

  contenedor.querySelector(".cq-carousel-arrow.prev").addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + activos.length) % activos.length;
    cambiarSlide(currentIndex);
  });

  // Eventos de indicadores
  const indicadores = contenedor.querySelectorAll(".cq-carousel-indicators button");
  indicadores.forEach((btn, i) => {
    btn.addEventListener("click", () => cambiarSlide(i));
  });

  // Gestos móviles
  contenedor.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  });

  contenedor.addEventListener("touchend", (e) => {
    endX = e.changedTouches[0].clientX;
    const deltaX = endX - startX;
    if (Math.abs(deltaX) > 50) {
      if (deltaX < 0) {
        currentIndex = (currentIndex + 1) % activos.length;
      } else {
        currentIndex = (currentIndex - 1 + activos.length) % activos.length;
      }
      cambiarSlide(currentIndex);
    }
  });

  avanzarSlide();
});
