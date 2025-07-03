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

  contenedor.innerHTML = `
    <div id="${carouselId}" class="carousel slide carousel-fade" data-bs-ride="carousel" data-bs-touch="true">
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
            <div style="width: 40px; height: 4px; border-radius: 2px; background: rgba(255,255,255,0.3); overflow: hidden;">
              <div class="progress-bar" id="progress-${i}" style="height: 100%; width: 0%; background: white; transition: width 5s linear;"></div>
            </div>`).join("")}
        </div>
      ` : ""}
    </div>
  `;

  const intervalTime = 5000;
  const myCarousel = new bootstrap.Carousel(`#${carouselId}`, {
    interval: intervalTime,
    ride: 'carousel',
    pause: false
  });

  function resetBars() {
    document.querySelectorAll('.progress-bar').forEach(el => {
      el.style.width = '0%';
    });
  }

  function animateProgress(index) {
    const bar = document.getElementById(`progress-${index}`);
    if (bar) {
      bar.style.width = '0%'; // Reset first to re-trigger transition
      void bar.offsetWidth;   // Trigger reflow
      bar.style.width = '100%';
    }
  }

  let current = 0;
  animateProgress(current);

  document.querySelector(`#${carouselId}`).addEventListener('slide.bs.carousel', function (e) {
    resetBars();
    const nextIndex = e.to;
    setTimeout(() => animateProgress(nextIndex), 50); // slight delay to allow DOM to reset
    current = nextIndex;
  });
});
