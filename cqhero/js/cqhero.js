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

  // Inyectar CSS para las barras de progreso
  const style = document.createElement("style");
  style.textContent = `
    .cq-progress-bar-container {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 4px;
      background-color: rgba(255, 255, 255, 0.2);
      z-index: 10;
    }
    .cq-progress-bar {
      height: 100%;
      width: 0%;
      background-color: #fff;
      transition: width 5s linear;
    }
  `;
  document.head.appendChild(style);

  contenedor.innerHTML = `
    <div id="${carouselId}" class="carousel slide carousel-fade" data-bs-ride="carousel" data-bs-touch="true">
      <div class="carousel-inner">
        ${activos
          .map(
            (item, index) => `
          <div class="carousel-item cq-carousel-item ${index === 0 ? "active" : ""}" style="background-image: url('${baseFondo}${item.fondo}')">
            <div class="cq-carousel-container">
              <div class="cq-carousel-content">
                <img src="${baseLogo}${item.logo}" alt="${item.titulo}" style="max-width: 100%; margin-bottom: 20px;">
                <p>${item.descripcion}</p>
                <a href="${baseEnlace}${item.slug}" class="cq-btn-get-started"><i class="bi bi-arrow-up-right-circle"></i> ${item.titulo}</a>
              </div>
            </div>
            <div class="cq-progress-bar-container"><div class="cq-progress-bar"></div></div>
          </div>`
          )
          .join("")}
      </div>
      ${
        activos.length > 1
          ? `
        <button class="carousel-control-prev" type="button" data-bs-target="#${carouselId}" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Anterior</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#${carouselId}" data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Siguiente</span>
        </button>
        <div class="carousel-indicators">
          ${activos
            .map(
              (_, i) => `
            <button type="button" data-bs-target="#${carouselId}" data-bs-slide-to="${i}" ${
                i === 0 ? "class='active'" : ""
              } aria-label="Slide ${i + 1}"></button>
          `
            )
            .join("")}
        </div>
      `
          : ""
      }
    </div>
  `;

  // Activar carrusel y animación de barra
  setTimeout(() => {
    const myCarousel = document.querySelector(`#${carouselId}`);
    if (!myCarousel) return;

    const carouselInstance = new bootstrap.Carousel(myCarousel, {
      interval: 5000,
      ride: 'carousel',
      pause: false
    });

    const animateProgress = () => {
      const allSlides = myCarousel.querySelectorAll(".carousel-item");
      allSlides.forEach(slide => {
        const bar = slide.querySelector(".cq-progress-bar");
        if (bar) {
          bar.style.transition = "none";
          bar.style.width = "0%";
        }
      });

      const activeSlide = myCarousel.querySelector(".carousel-item.active");
      if (activeSlide) {
        const bar = activeSlide.querySelector(".cq-progress-bar");
        if (bar) {
          void bar.offsetWidth; // Reflow
          bar.style.transition = "width 5s linear";
          bar.style.width = "100%";
        }
      }
    };

    animateProgress(); // Primera vez
    myCarousel.addEventListener("slide.bs.carousel", () => {
      animateProgress();
    });
  }, 100);
});
