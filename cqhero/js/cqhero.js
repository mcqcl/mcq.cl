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

  let currentIndex = 0;
  let interval = 5000;
  let timer;

  contenedor.innerHTML = `
    <div class="cq-carousel-wrapper">
      ${activos.map((item, index) => `
        <div class="cq-slide" data-index="${index}" style="background-image: url('${baseFondo}${item.fondo}'); display: ${index === 0 ? "block" : "none"};">
          <div class="cq-overlay"></div>
          <div class="cq-carousel-container">
            <div class="cq-carousel-content">
              <img src="${baseLogo}${item.logo}" alt="${item.titulo}" style="max-width: 100%; margin-bottom: 20px;">
              <p>${item.descripcion}</p>
              <a href="${baseEnlace}${item.slug}" class="cq-btn-get-started"><i class="bi bi-arrow-up-right-circle"></i> ${item.titulo}</a>
            </div>
          </div>
        </div>
      `).join("")}
      <div class="cq-carousel-arrows">
        <button class="cq-prev">&#10094;</button>
        <button class="cq-next">&#10095;</button>
      </div>
      <div class="cq-carousel-indicators">
        ${activos.map((_, index) => `
          <div class="cq-indicator" data-index="${index}">
            <div class="cq-progress-bar"></div>
          </div>
        `).join("")}
      </div>
    </div>
  `;

  const slides = contenedor.querySelectorAll(".cq-slide");
  const indicators = contenedor.querySelectorAll(".cq-indicator");
  const progressBars = contenedor.querySelectorAll(".cq-progress-bar");

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.style.display = i === index ? "block" : "none";
      slide.style.opacity = i === index ? "1" : "0";
    });

    progressBars.forEach((bar, i) => {
      bar.style.width = "0%";
      bar.style.transition = "none";
    });

    setTimeout(() => {
      progressBars[index].style.transition = `width ${interval}ms linear`;
      progressBars[index].style.width = "100%";
    }, 50);

    currentIndex = index;
  }

  function nextSlide() {
    let next = (currentIndex + 1) % slides.length;
    showSlide(next);
  }

  function prevSlide() {
    let prev = (currentIndex - 1 + slides.length) % slides.length;
    showSlide(prev);
  }

  contenedor.querySelector(".cq-next").addEventListener("click", () => {
    nextSlide();
    resetTimer();
  });

  contenedor.querySelector(".cq-prev").addEventListener("click", () => {
    prevSlide();
    resetTimer();
  });

  indicators.forEach(ind => {
    ind.addEventListener("click", () => {
      const i = parseInt(ind.dataset.index);
      showSlide(i);
      resetTimer();
    });
  });

  function startTimer() {
    timer = setInterval(nextSlide, interval);
    showSlide(currentIndex);
  }

  function resetTimer() {
    clearInterval(timer);
    startTimer();
  }

  // Inyectar estilos desde el JS (con !important)
  const style = document.createElement("style");
  style.textContent = `
    #cq-hero .cq-slide {
      width: 100% !important;
      height: calc(100vh - 110px) !important;
      background-size: cover !important;
      background-position: center center !important;
      background-repeat: no-repeat !important;
      position: relative !important;
      overflow: hidden !important;
      opacity: 0 !important;
      transition: opacity 0.8s ease !important;
    }
    #cq-hero .cq-overlay {
      position: absolute !important;
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      bottom: 0 !important;
      background-color: rgba(13, 30, 45, 0.6) !important;
      z-index: 1 !important;
    }
    #cq-hero .cq-carousel-container {
      position: relative !important;
      z-index: 2 !important;
      height: 100% !important;
      display: flex !important;
      align-items: center !important;
    }
    #cq-hero .cq-carousel-arrows {
      position: absolute !important;
      top: 50% !important;
      width: 100% !important;
      display: flex !important;
      justify-content: space-between !important;
      transform: translateY(-50%) !important;
      z-index: 10 !important;
      pointer-events: none !important;
    }
    #cq-hero .cq-carousel-arrows button {
      background: rgba(0,0,0,0.4) !important;
      border: none !important;
      pointer-events: auto !important;
      padding: 8px 12px !important;
      font-size: 24px !important;
      color: white !important;
      border-radius: 50% !important;
      cursor: pointer !important;
    }
    #cq-hero .cq-carousel-indicators {
      position: absolute !important;
      bottom: 20px !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      display: flex !important;
      gap: 8px !important;
      z-index: 10 !important;
    }
    #cq-hero .cq-indicator {
      width: 40px !important;
      height: 4px !important;
      background: rgba(255,255,255,0.3) !important;
      overflow: hidden !important;
      border-radius: 2px !important;
    }
    #cq-hero .cq-progress-bar {
      height: 100% !important;
      width: 0% !important;
      background: #fff !important;
      transition: none !important;
    }
  `;
  document.head.appendChild(style);

  startTimer();
});
