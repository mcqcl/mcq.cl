document.addEventListener("DOMContentLoaded", function () {
  const json = document.getElementById("cq-data");
  if (!json) return;

  const data = JSON.parse(json.textContent);
  const activos = data.filter(item => item.activo == 1);
  if (activos.length === 0) return;

  activos.sort(() => Math.random() - 0.5);

  const contenedor = document.getElementById("cq-hero");
  if (!contenedor) return;

  const baseLogo = "https://cdn.mcq.cl/cqhero/logo/";
  const baseFondo = "https://cdn.mcq.cl/cqhero/fondo/";
  const baseEnlace = "https://www.canales.pe/";
  const carouselId = "cqCarouselDynamic";
  const intervalo = 5000; // ms

  contenedor.innerHTML = `
    <div id="${carouselId}" class="cq-carousel-container">
      <div class="cq-carousel-inner">
        ${activos.map((item, index) => `
          <div class="cq-slide ${index === 0 ? "cq-active" : ""}" style="background-image: url('${baseFondo}${item.fondo}')">
            <div class="cq-carousel-content">
              <img src="${baseLogo}${item.logo}" alt="${item.titulo}" style="max-width: 100%; margin-bottom: 20px;">
              <p>${item.descripcion}</p>
              <a href="${baseEnlace}${item.slug}" class="cq-btn-get-started"><i class="bi bi-arrow-up-right-circle"></i> ${item.titulo}</a>
            </div>
          </div>`).join("")}
      </div>
      ${activos.length > 1 ? `
        <button class="cq-carousel-prev">&#10094;</button>
        <button class="cq-carousel-next">&#10095;</button>
        <div class="cq-indicators">
          ${activos.map((_, i) => `
            <div class="cq-indicator-wrapper">
              <button data-cq-slide="${i}" ${i === 0 ? "class='active'" : ""}></button>
              <div class="cq-indicator-progress"></div>
            </div>`).join("")}
        </div>` : ""}
    </div>
  `;

  const style = document.createElement("style");
  style.textContent = `
    .cq-carousel-container {
      position: relative !important;
      width: 100% !important;
      height: 100% !important;
      overflow: hidden !important;
    }

    .cq-carousel-inner {
      position: relative !important;
      width: 100% !important;
      height: 100% !important;
    }

    .cq-slide {
      position: absolute !important;
      top: 0 !important;
      left: 0 !important;
      width: 100% !important;
      height: 100% !important;
      background-size: cover !important;
      background-position: center !important;
      background-repeat: no-repeat !important;
      opacity: 0 !important;
      transition: opacity 1s ease-in-out !important;
      z-index: 0 !important;
    }

    .cq-slide.cq-active {
      opacity: 1 !important;
      z-index: 1 !important;
    }

    .cq-carousel-prev, .cq-carousel-next {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(0,0,0,0.3);
      color: #fff;
      border: none;
      font-size: 2rem;
      padding: 0 10px;
      cursor: pointer;
      z-index: 4;
    }

    .cq-carousel-prev { left: 10px; }
    .cq-carousel-next { right: 10px; }

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

  let currentIndex = 0;
  let progresoTimer;
  const slides = document.querySelectorAll(".cq-slide");
  const indicators = document.querySelectorAll(".cq-indicator-progress");
  const botones = document.querySelectorAll("[data-cq-slide]");

  function cambiarSlide(nuevoIndex) {
    slides.forEach(s => s.classList.remove("cq-active"));
    indicators.forEach(i => {
      i.style.transition = "none";
      i.style.transform = "scaleX(0)";
    });
    document.querySelectorAll(".cq-indicator-wrapper button").forEach(b => b.classList.remove("active"));

    slides[nuevoIndex].classList.add("cq-active");
    document.querySelector(`[data-cq-slide="${nuevoIndex}"]`).classList.add("active");

    setTimeout(() => {
      indicators[nuevoIndex].style.transition = `transform ${intervalo}ms linear`;
      indicators[nuevoIndex].style.transform = "scaleX(1)";
    }, 50);

    currentIndex = nuevoIndex;
  }

  function avanzarSlide() {
    const nextIndex = (currentIndex + 1) % slides.length;
    cambiarSlide(nextIndex);
    progresoTimer = setTimeout(avanzarSlide, intervalo);
  }

  if (slides.length > 1) {
    avanzarSlide();

    document.querySelector(".cq-carousel-prev").addEventListener("click", () => {
      clearTimeout(progresoTimer);
      const prev = (currentIndex - 1 + slides.length) % slides.length;
      cambiarSlide(prev);
      avanzarSlide();
    });

    document.querySelector(".cq-carousel-next").addEventListener("click", () => {
      clearTimeout(progresoTimer);
      const next = (currentIndex + 1) % slides.length;
      cambiarSlide(next);
      avanzarSlide();
    });

    botones.forEach(btn => {
      btn.addEventListener("click", () => {
        clearTimeout(progresoTimer);
        const index = parseInt(btn.getAttribute("data-cq-slide"));
        cambiarSlide(index);
        avanzarSlide();
      });
    });
  }
});
