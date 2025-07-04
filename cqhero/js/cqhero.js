document.addEventListener("DOMContentLoaded", function () {
  const json = document.getElementById("cq-data");
  if (!json) return;

  const data = JSON.parse(json.textContent);
  const activos = data.filter(item => item.activo == 1);
  if (activos.length === 0) return;

  // Mezcla aleatoria
  activos.sort(() => Math.random() - 0.5);

  const contenedor = document.getElementById("cq-hero");
  if (!contenedor) return;

  const baseLogo = "https://cdn.mcq.cl/cqhero/logo/";
  const baseFondo = "https://cdn.mcq.cl/cqhero/fondo/";
  const baseEnlace = "https://www.canales.pe/";
  const carouselId = "cqCarouselDynamic";
  const intervalo = 5000; // ms

  // Generar HTML
  contenedor.innerHTML = `
    <div id="${carouselId}" class="carousel slide carousel-fade" data-bs-touch="true">
      <div class="carousel-inner">
        ${activos.map((item, index) => `
          <div class="carousel-item cq-carousel-item ${index === 0 ? "active" : ""}" style="background-image: url('${baseFondo}${item.fondo}')">
            <div class="cq-carousel-container">
              <div class="cq-carousel-content">
                <img src="${baseLogo}${item.logo}" alt="${item.titulo}" style="max-width: 100%; margin-bottom: 20px;">
                <p>${item.descripcion}</p>
                <a href="${baseEnlace}${item.slug}" class="cq-btn-get-started"><i class="bi bi-arrow-up-right-circle"></i> ${item.titulo}</a>
              </div>
            </div>
          </div>`).join("")}
      </div>
      ${activos.length > 1 ? `
        <button class="carousel-control-prev" type="button" data-bs-target="#${carouselId}" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Anterior</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#${carouselId}" data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Siguiente</span>
        </button>
        <div class="carousel-indicators cq-indicators">
          ${activos.map((_, i) => `
            <div class="cq-indicator-wrapper">
              <button type="button" data-bs-target="#${carouselId}" data-bs-slide-to="${i}" ${i === 0 ? "class='active'" : ""} aria-label="Slide ${i + 1}"></button>
              <div class="cq-indicator-progress"></div>
            </div>`).join("")}
        </div>` : ""}
    </div>
  `;

  // Inyectar estilos para el progress bar (evita colisión con otras clases)
  const style = document.createElement("style");
  style.textContent = `
    .cq-indicators {
      position: absolute;
      bottom: 30px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 6px;
      z-index: 3;
    }

    .cq-indicator-wrapper {
      position: relative;
      width: 40px;
      height: 4px;
      overflow: hidden;
      background-color: rgba(255, 255, 255, 0.3);
      border-radius: 2px;
    }

    .cq-indicator-wrapper button {
      position: absolute;
      inset: 0;
      z-index: 2;
      border: none;
      background: none;
      cursor: pointer;
    }

    .cq-indicator-progress {
      position: absolute;
      inset: 0;
      background-color: #fff;
      transform: scaleX(0);
      transform-origin: left;
      transition: transform ${intervalo}ms linear;
      z-index: 1;
    }
  `;
  document.head.appendChild(style);

  // Activar el carrusel y animar progress
  const myCarousel = new bootstrap.Carousel(`#${carouselId}`, {
    interval: false,
    ride: false,
    pause: false
  });

  let currentIndex = 0;
  const totalSlides = activos.length;
  const indicators = document.querySelectorAll(".cq-indicator-progress");

  function avanzarSlide() {
    // Reiniciar todos los indicadores
    indicators.forEach(ind => {
      ind.style.transition = "none";
      ind.style.transform = "scaleX(0)";
    });

    // Activar animación del actual
    const actual = indicators[currentIndex];
    setTimeout(() => {
      actual.style.transition = `transform ${intervalo}ms linear`;
      actual.style.transform = "scaleX(1)";
    }, 50);

    // Mover al siguiente slide
    setTimeout(() => {
      currentIndex = (currentIndex + 1) % totalSlides;
      myCarousel.to(currentIndex);
      avanzarSlide();
    }, intervalo);
  }

  avanzarSlide(); // Iniciar
});
