document.addEventListener("DOMContentLoaded", function () {
  const json = document.getElementById("cq-data");
  if (!json) return;

  const data = JSON.parse(json.textContent);
  const activos = data.filter(item => item.activo == 1);
  activos.sort(() => Math.random() - 0.5);

  const contenedor = document.getElementById("cq-hero");
  if (!contenedor) return;

  const baseLogo = "https://cdn.mcq.cl/cqhero/logo/";
  const baseFondo = "https://cdn.mcq.cl/cqhero/fondo/";
  const baseEnlace = "https://www.canales.pe/";
  const carouselId = "cqCarouselDynamic";
  const intervalTiempo = 5000;

  // Generar carrusel
  contenedor.innerHTML = `
    <div id="${carouselId}" class="carousel slide" data-bs-touch="true">
      <div class="carousel-inner">
        ${activos.map((item, index) => `
          <div class="carousel-item cq-carousel-item ${index === 0 ? "active" : ""}" style="background-image: url('${baseFondo}${item.fondo}')">
            <div class="cq-carousel-container">
              <div class="cq-carousel-content">
                <img src="${baseLogo}${item.logo}" alt="${item.titulo}" style="max-width: 100%; margin-bottom: 20px;">
                <p>${item.descripcion}</p>
                <a href="${baseEnlace}${item.slug}" class="cq-btn-get-started">
                  <i class="bi bi-arrow-up-right-circle"></i> ${item.titulo}
                </a>
              </div>
            </div>
          </div>`).join("")}
      </div>
      <button class="carousel-control-prev" type="button" data-bs-target="#${carouselId}" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Anterior</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#${carouselId}" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Siguiente</span>
      </button>
      <div class="carousel-indicators">
        ${activos.map((_, i) => `
          <div class="cq-indicator-wrap">
            <div class="cq-indicator-bar" data-index="${i}"></div>
          </div>`).join("")}
      </div>
    </div>
  `;

  // Inyectar CSS para progress bar
  const style = document.createElement("style");
  style.textContent = `
    .cq-indicator-wrap {
      width: 40px;
      height: 4px;
      background: rgba(255,255,255,0.3);
      border-radius: 2px;
      overflow: hidden;
      position: relative;
    }
    .cq-indicator-bar {
      height: 100%;
      width: 0%;
      background-color: white;
      transition: width linear;
    }
    #${carouselId} .carousel-inner {
      transition: none !important;
    }
  `;
  document.head.appendChild(style);

  // Activar carrusel y progreso
  const carouselElement = document.querySelector(`#${carouselId}`);
  const bsCarousel = new bootstrap.Carousel(carouselElement, {
    interval: intervalTiempo,
    ride: true,
    pause: false,
    wrap: true
  });

  const bars = document.querySelectorAll(".cq-indicator-bar");
  let currentIndex = 0;
  let timer;

  function animateBar(index) {
    bars.forEach((bar, i) => {
      bar.style.transition = "none";
      bar.style.width = "0%";
      if (i === index) {
        setTimeout(() => {
          bar.style.transition = `width ${intervalTiempo}ms linear`;
          bar.style.width = "100%";
        }, 50);
      }
    });
  }

  animateBar(currentIndex);

  carouselElement.addEventListener("slide.bs.carousel", (e) => {
    currentIndex = e.to;
    animateBar(currentIndex);
  });
});
