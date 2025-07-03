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
        ${activos
          .map(
            (item, index) => `
          <div class="carousel-item cq-carousel-item ${index === 0 ? "active" : ""}" style="background-image: url('${baseFondo}${item.fondo}')">
            <div class="cq-carousel-container">
              <div class="cq-carousel-content">
                <img src="${baseLogo}${item.logo}" alt="${item.titulo}" style="max-width: 100%; margin-bottom: 20px;">
                <p>${item.descripcion}</p>
                <a href="${baseEnlace}${item.slug}/" class="cq-btn-get-started"><i class="bi bi-arrow-up-right-circle"></i> ${item.titulo}</a>
              </div>
            </div>
          </div>`
          )
          .join("")}
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
            <button type="button" data-bs-target="#${carouselId}" data-bs-slide-to="${i}" ${i === 0 ? "class='active'" : ""} aria-label="Slide ${i + 1}"></button>
          `).join("")}
        </div>
      ` : ""}
    </div>
  `;
});
