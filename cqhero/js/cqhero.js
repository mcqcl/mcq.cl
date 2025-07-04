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
      bar.style.width = i === index ? "0%" : "0%";
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

  // Inyecta CSS desde JS
  const style = document.createElement("style");
  style.textContent = `
    #cq-hero .cq-indicator {
      width: 40px;
      height: 4px;
      border-radius: 2px;
      background: rgba(255,255,255,0.2) !important;
      overflow: hidden;
    }
    #cq-hero .cq-progress-bar {
      height: 100%;
      width: 0%;
      background: #fff !important;
    }
    #cq-hero .cq-carousel-arrows {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      justify-content: space-between;
      z-index: 10;
      pointer-events: none;
    }
    #cq-hero .cq-carousel-arrows button {
      background: rgba(0,0,0,0.3) !important;
      border: none;
      color: #fff !important;
      font-size: 28px;
      padding: 10px;
      cursor: pointer;
      pointer-events: auto;
      border-radius: 50%;
      transition: background 0.3s ease;
    }
    #cq-hero .cq-carousel-arrows button:hover {
      background: rgba(0,0,0,0.6) !important;
    }
    #cq-hero .cq-carousel-indicators {
      position: absolute;
      bottom: 30px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 6px;
      z-index: 5;
    }
    #cq-hero .cq-slide {
      transition: opacity 1s ease !important;
    }
    #cq-hero .cq-overlay {
      content: "";
      background-color: rgba(13, 30, 45, 0.6) !important;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 1;
    }
    #cq-hero .cq-carousel-container {
      position: relative;
      z-index: 2;
    }
  `;
  document.head.appendChild(style);

  startTimer();
});
