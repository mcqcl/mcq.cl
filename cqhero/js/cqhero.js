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
  const intervalo = 5000;

  // Precargar fondos
  activos.forEach(item => {
    const preload = new Image();
    preload.src = baseFondo + item.fondo;
  });

  // Generar HTML manual
  contenedor.innerHTML = `
    <div class="cq-carousel-wrapper">
      ${activos.map((item, index) => `
        <div class="cq-carousel-item ${index === 0 ? "active" : ""}" style="background-image: url('${baseFondo}${item.fondo}')">
          <div class="cq-carousel-container">
            <div class="cq-carousel-content">
              <img src="${baseLogo}${item.logo}" alt="${item.titulo}" style="max-width: 100%; margin-bottom: 20px;">
              <p>${item.descripcion}</p>
              <a href="${baseEnlace}${item.slug}" class="cq-btn-get-started"><i class="bi bi-arrow-up-right-circle"></i> ${item.titulo}</a>
            </div>
          </div>
        </div>`).join("")}
      <div class="cq-carousel-arrow prev" role="button" aria-label="Anterior">
        <svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg>
      </div>
      <div class="cq-carousel-arrow next" role="button" aria-label="Siguiente">
        <svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>
      </div>
      <div class="cq-carousel-indicators">
        ${activos.map((_, i) => `
          <button class="${i === 0 ? "active" : ""}" data-index="${i}" aria-label="Slide ${i + 1}"></button>`).join("")}
      </div>
    </div>
  `;

  const slides = contenedor.querySelectorAll(".cq-carousel-item");
  const dots = contenedor.querySelectorAll(".cq-carousel-indicators button");
  const prev = contenedor.querySelector(".cq-carousel-arrow.prev");
  const next = contenedor.querySelector(".cq-carousel-arrow.next");

  let currentIndex = 0;
  let autoTimer;

  function goToSlide(index) {
    slides.forEach(slide => slide.classList.remove("active"));
    dots.forEach(dot => dot.classList.remove("active"));
    slides[index].classList.add("active");
    dots[index].classList.add("active");
    currentIndex = index;
  }

  function nextSlide() {
    const nextIndex = (currentIndex + 1) % slides.length;
    goToSlide(nextIndex);
  }

  function prevSlide() {
    const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
    goToSlide(prevIndex);
  }

  function startAutoSlide() {
    autoTimer = setInterval(nextSlide, intervalo);
  }

  function stopAutoSlide() {
    clearInterval(autoTimer);
  }

  // Eventos
  next.addEventListener("click", () => {
    stopAutoSlide();
    nextSlide();
    startAutoSlide();
  });

  prev.addEventListener("click", () => {
    stopAutoSlide();
    prevSlide();
    startAutoSlide();
  });

  dots.forEach(dot => {
    dot.addEventListener("click", (e) => {
      stopAutoSlide();
      goToSlide(parseInt(e.target.dataset.index));
      startAutoSlide();
    });
  });

  startAutoSlide();
});
