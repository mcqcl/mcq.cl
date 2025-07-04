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
  const carouselId = "cqCustomCarousel";

  const duration = 5000;

  contenedor.innerHTML = `
    <div id="${carouselId}" class="cq-carousel-wrapper">
      <div class="cq-carousel-inner">
        ${activos.map((item, index) => `
          <div class="cq-carousel-item" style="background-image: url('${baseFondo}${item.fondo}')" data-index="${index}">
            <div class="cq-carousel-container">
              <div class="cq-carousel-content">
                <img src="${baseLogo}${item.logo}" alt="${item.titulo}" style="max-width: 100%; margin-bottom: 20px;">
                <p>${item.descripcion}</p>
                <a href="${baseEnlace}${item.slug}" class="cq-btn-get-started"><i class="bi bi-arrow-up-right-circle"></i> ${item.titulo}</a>
              </div>
            </div>
          </div>`).join("")}
      </div>
      <div class="cq-indicators">
        ${activos.map((_, i) => `
          <div class="cq-indicator"><div class="cq-bar" data-bar="${i}"></div></div>
        `).join("")}
      </div>
    </div>
  `;

  // Inyectar CSS con !important
  const style = document.createElement("style");
  style.textContent = `
    .cq-carousel-wrapper { width: 100% !important; height: calc(100vh - 110px) !important; position: relative !important; overflow: hidden !important; background: #000 !important; }
    .cq-carousel-inner { display: flex !important; width: 100% !important; height: 100% !important; transition: transform 1s ease-in-out !important; }
    .cq-carousel-item { min-width: 100% !important; height: 100% !important; background-size: cover !important; background-position: center !important; position: relative !important; flex-shrink: 0 !important; }
    .cq-carousel-container { display: flex !important; align-items: center !important; justify-content: flex-start !important; height: 100% !important; padding-left: 120px !important; z-index: 2 !important; position: relative !important; }
    .cq-carousel-content { max-width: 540px !important; color: white !important; }
    .cq-indicators { position: absolute !important; bottom: 30px !important; left: 50% !important; transform: translateX(-50%) !important; display: flex !important; gap: 8px !important; z-index: 5 !important; }
    .cq-indicator { width: 40px !important; height: 4px !important; background: rgba(255,255,255,0.3) !important; overflow: hidden !important; border-radius: 2px !important; }
    .cq-bar { height: 100% !important; width: 0% !important; background: white !important; transition: width ${duration}ms linear !important; }
  `;
  document.head.appendChild(style);

  // Lógica del carrusel sin Bootstrap
  let current = 0;
  const items = contenedor.querySelectorAll(".cq-carousel-item");
  const bars = contenedor.querySelectorAll(".cq-bar");
  const total = items.length;
  const inner = contenedor.querySelector(".cq-carousel-inner");

  function goToSlide(index) {
    current = index;
    inner.style.transform = `translateX(-${index * 100}%)`;
    bars.forEach((bar, i) => {
      bar.style.transition = "none";
      bar.style.width = i === index ? "0%" : "0%";
    });
    setTimeout(() => {
      bars[index].style.transition = `width ${duration}ms linear`;
      bars[index].style.width = "100%";
    }, 50);
  }

  function nextSlide() {
    const next = (current + 1) % total;
    goToSlide(next);
  }

  goToSlide(0);
  setInterval(nextSlide, duration);
});
