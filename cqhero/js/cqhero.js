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
  const interval = 5000;

  let indicators = "";
  let items = "";

  activos.forEach((item, index) => {
    items += `
      <div class="cq-slide${index === 0 ? ' active' : ''}" style="background-image: url('${baseFondo}${item.fondo}') !important;">
        <div class="cq-carousel-container">
          <div class="cq-carousel-content">
            <img src="${baseLogo}${item.logo}" alt="${item.titulo}" style="max-width: 100%; margin-bottom: 20px;">
            <p>${item.descripcion}</p>
            <a href="${baseEnlace}${item.slug}" class="cq-btn-get-started">
              <i class="bi bi-arrow-up-right-circle"></i> ${item.titulo}
            </a>
          </div>
        </div>
      </div>`;

    indicators += `
      <div class="cq-indicator-wrapper">
        <div class="cq-indicator-bar" data-index="${index}"></div>
      </div>`;
  });

  contenedor.innerHTML = `
    <div id="${carouselId}" class="cq-carousel-custom">
      ${items}
      <div class="cq-controls">
        <div class="cq-prev">&#10094;</div>
        <div class="cq-next">&#10095;</div>
      </div>
      <div class="cq-indicators">
        ${indicators}
      </div>
    </div>`;

  // Inyectar CSS necesario directamente desde JS con !important
  const style = document.createElement("style");
  style.textContent = `
    .cq-carousel-custom .cq-slide {
      position: absolute !important;
      top: 0 !important;
      left: 0 !important;
      width: 100% !important;
      height: 100% !important;
      background-size: cover !important;
      background-position: center !important;
      opacity: 0 !important;
      transition: opacity 1s ease-in-out !important;
      z-index: 0 !important;
    }
    .cq-carousel-custom .cq-slide.active {
      opacity: 1 !important;
      z-index: 1 !important;
    }
    .cq-controls {
      position: absolute !important;
      width: 100% !important;
      top: 50% !important;
      transform: translateY(-50%) !important;
      display: flex !important;
      justify-content: space-between !important;
      z-index: 5 !important;
      padding: 0 20px !important;
    }
    .cq-prev, .cq-next {
      background: rgba(0,0,0,0.3) !important;
      padding: 10px !important;
      cursor: pointer !important;
      border-radius: 50% !important;
      user-select: none !important;
    }
    .cq-indicators {
      position: absolute !important;
      bottom: 20px !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      display: flex !important;
      gap: 8px !important;
      z-index: 4 !important;
    }
    .cq-indicator-wrapper {
      width: 40px !important;
      height: 4px !important;
      background: rgba(255, 255, 255, 0.3) !important;
      overflow: hidden !important;
      border-radius: 2px !important;
    }
    .cq-indicator-bar {
      height: 100% !important;
      width: 0% !important;
      background: #fff !important;
      transition: none !important;
    }
  `;
  document.head.appendChild(style);

  const slides = document.querySelectorAll(".cq-slide");
  const indicatorsBars = document.querySelectorAll(".cq-indicator-bar");
  const nextBtn = document.querySelector(".cq-next");
  const prevBtn = document.querySelector(".cq-prev");

  let current = 0;
  let timer;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.remove("active");
      indicatorsBars[i].style.width = "0%";
    });
    slides[index].classList.add("active");
  }

  function animateIndicator(index) {
    indicatorsBars.forEach((bar, i) => {
      bar.style.transition = "none";
      bar.style.width = "0%";
    });
    const activeBar = indicatorsBars[index];
    setTimeout(() => {
      activeBar.style.transition = `width ${interval}ms linear`;
      activeBar.style.width = "100%";
    }, 50);
  }

  function nextSlide() {
    current = (current + 1) % slides.length;
    showSlide(current);
    animateIndicator(current);
  }

  function prevSlide() {
    current = (current - 1 + slides.length) % slides.length;
    showSlide(current);
    animateIndicator(current);
  }

  function startAutoSlide() {
    timer = setInterval(nextSlide, interval);
    animateIndicator(current);
  }

  function resetAutoSlide() {
    clearInterval(timer);
    startAutoSlide();
  }

  nextBtn.addEventListener("click", () => {
    nextSlide();
    resetAutoSlide();
  });

  prevBtn.addEventListener("click", () => {
    prevSlide();
    resetAutoSlide();
  });

  showSlide(current);
  startAutoSlide();
});
