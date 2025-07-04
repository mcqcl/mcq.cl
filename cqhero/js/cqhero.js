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
  const duracion = 5000;

  contenedor.innerHTML = `
    <div id="${carouselId}" class="cq-carousel-wrapper">
      <div class="cq-carousel-slides">
        ${activos.map((item, index) => `
          <div class="cq-slide ${index === 0 ? "active" : ""}" style="background-image: url('${baseFondo}${item.fondo}')">
            <div class="cq-overlay"></div>
            <div class="cq-carousel-container">
              <div class="cq-carousel-content">
                <img src="${baseLogo}${item.logo}" alt="${item.titulo}" style="max-width: 100%; margin-bottom: 20px;">
                <p>${item.descripcion}</p>
                <a href="${baseEnlace}${item.slug}" class="cq-btn-get-started">
                  <i class="bi bi-arrow-up-right-circle"></i> ${item.titulo}
                </a>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
      ${activos.length > 1 ? `
        <div class="cq-carousel-indicators">
          ${activos.map((_, i) => `
            <div class="cq-indicator" data-slide="${i}">
              <div class="cq-progress"></div>
            </div>
          `).join('')}
        </div>
        <button class="cq-prev">&#10094;</button>
        <button class="cq-next">&#10095;</button>
      ` : ""}
    </div>
  `;

  // Inyectar estilos necesarios
  const style = document.createElement("style");
  style.innerHTML = `
    .cq-carousel-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
    }
    .cq-carousel-slides {
      position: relative;
      width: 100%;
      height: 100%;
    }
    .cq-slide {
      position: absolute !important;
      top: 0; left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      transition: opacity 1s ease !important;
      z-index: 0;
      background-size: cover !important;
      background-position: center !important;
    }
    .cq-slide.active {
      opacity: 1 !important;
      z-index: 1;
    }
    .cq-overlay {
      content: "";
      background-color: rgba(13, 30, 45, 0.6) !important;
      position: absolute !important;
      height: 100%;
      width: 100%;
      top: 0;
      left: 0;
      z-index: 1;
    }
    .cq-carousel-container {
      position: relative;
      z-index: 2;
    }
    .cq-carousel-indicators {
      display: flex;
      justify-content: center;
      position: absolute;
      bottom: 30px;
      left: 50%;
      transform: translateX(-50%);
      gap: 6px;
      z-index: 10;
    }
    .cq-indicator {
      width: 40px;
      height: 4px;
      background: rgba(255,255,255,0.3);
      overflow: hidden;
      border-radius: 2px;
      position: relative;
    }
    .cq-progress {
      width: 0%;
      height: 100%;
      background: white !important;
      transition: width ${duracion}ms linear !important;
    }
    .cq-prev, .cq-next {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      z-index: 10;
      background: transparent;
      border: none;
      font-size: 30px;
      color: white;
      cursor: pointer;
      user-select: none;
    }
    .cq-prev { left: 16px; }
    .cq-next { right: 16px; }
  `;
  document.head.appendChild(style);

  const slides = contenedor.querySelectorAll(".cq-slide");
  const indicators = contenedor.querySelectorAll(".cq-indicator");
  const progressBars = contenedor.querySelectorAll(".cq-progress");
  let currentIndex = 0;
  let interval;

  function goToSlide(index) {
    slides.forEach((s, i) => {
      s.classList.toggle("active", i === index);
    });
    progressBars.forEach((bar, i) => {
      bar.style.transition = "none";
      bar.style.width = "0%";
      setTimeout(() => {
        bar.style.transition = `width ${duracion}ms linear !important`;
        bar.style.width = i === index ? "100%" : "0%";
      }, 50);
    });
    currentIndex = index;
  }

  function nextSlide() {
    goToSlide((currentIndex + 1) % slides.length);
  }

  function startCarousel() {
    interval = setInterval(nextSlide, duracion);
  }

  function stopCarousel() {
    clearInterval(interval);
  }

  if (slides.length > 1) {
    startCarousel();

    contenedor.querySelector(".cq-prev").addEventListener("click", () => {
      stopCarousel();
      goToSlide((currentIndex - 1 + slides.length) % slides.length);
      startCarousel();
    });

    contenedor.querySelector(".cq-next").addEventListener("click", () => {
      stopCarousel();
      nextSlide();
      startCarousel();
    });

    indicators.forEach(ind => {
      ind.addEventListener("click", () => {
        stopCarousel();
        goToSlide(parseInt(ind.dataset.slide));
        startCarousel();
      });
    });
  }

  goToSlide(0); // Inicial
});
