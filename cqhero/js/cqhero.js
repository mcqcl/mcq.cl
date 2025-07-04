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
  const tiempo = 5000;

  contenedor.innerHTML = `
    <div id="${carouselId}" class="carousel slide" data-bs-ride="carousel" data-bs-interval="${tiempo}" data-bs-touch="true">
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
          </div>
        `).join("")}
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
        <div class="carousel-indicators">
          ${activos.map((_, i) => `
            <button type="button" data-bs-target="#${carouselId}" data-bs-slide-to="${i}" ${i === 0 ? "class='active'" : ""} aria-label="Slide ${i + 1}">
              <span class="cq-indicator-progress"></span>
            </button>
          `).join("")}
        </div>
      ` : ""}
    </div>
  `;

  // Reinicio de animaciones en cada slide
  const updateProgressBars = () => {
    document.querySelectorAll(`#${carouselId} .carousel-indicators button`).forEach(btn => {
      btn.querySelector('.cq-indicator-progress').style.animation = 'none';
      btn.offsetHeight; // trigger reflow
      btn.querySelector('.cq-indicator-progress').style.animation = `cq-progress ${tiempo}ms linear forwards`;
    });
  };

  const myCarousel = new bootstrap.Carousel(`#${carouselId}`, {
    interval: tiempo,
    ride: 'carousel',
    pause: false
  });

  const carouselElement = document.getElementById(carouselId);
  carouselElement.addEventListener('slid.bs.carousel', updateProgressBars);

  updateProgressBars(); // Start first one

  // Inyectar estilo para evitar pantalla negra + barra de progreso
  const style = document.createElement("style");
  style.innerHTML = `
    #${carouselId} .carousel-item {
      transition: opacity 1s ease-in-out;
    }
    .cq-indicator-progress {
      display: block;
      height: 4px;
      width: 100%;
      background: rgba(255,255,255,0.4);
      overflow: hidden;
      position: relative;
    }
    .cq-indicator-progress::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 0%;
      background: white;
      animation: cq-progress ${tiempo}ms linear forwards;
    }
    @keyframes cq-progress {
      from { width: 0%; }
      to { width: 100%; }
    }
  `;
  document.head.appendChild(style);
});
