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

  const carouselId = "cqCarouselCustom";

  // Inyectar estilo para transición fade + progress bar
  const style = document.createElement("style");
  style.textContent = `
    .cq-slide {
      position: absolute !important;
      top: 0 !important;
      left: 0 !important;
      width: 100% !important;
      height: 100% !important;
      opacity: 0 !important;
      transition: opacity 0.8s ease-in-out !important;
      z-index: 0 !important;
    }
    .cq-slide.active {
      opacity: 1 !important;
      z-index: 1 !important;
    }
    .cq-indicator {
      width: 40px !important;
      height: 4px !important;
      background: rgba(255,255,255,0.4) !important;
      border-radius: 2px !important;
      overflow: hidden !important;
      position: relative !important;
    }
    .cq-progress-fill {
      background: white !important;
      height: 100% !important;
      width: 0% !important;
      transition: width linear !important;
      position: absolute !important;
      top: 0 !important;
      left: 0 !important;
    }
    .cq-nav {
      position: absolute !important;
      top: 50% !important;
      transform: translateY(-50%) !important;
      z-index: 5 !important;
      background: rgba(0,0,0,0.3) !important;
      border: none !important;
      width: 40px !important;
      height: 40px !important;
      border-radius: 50% !important;
      color: white !important;
      font-size: 24px !important;
      cursor: pointer !important;
    }
    .cq-nav.prev { left: 20px !important; }
    .cq-nav.next { right: 20px !important; }
  `;
  document.head.appendChild(style);

  let html = `<div id="${carouselId}" style="position: relative; height: 100%;">
    <div class="cq-carousel-inner" style="position: relative; height: 100%;">
      ${activos.map((item, index) => `
        <div class="cq-slide ${index === 0 ? 'active' : ''}" style="background-image: url('${baseFondo}${item.fondo}'); background-size: cover; background-position: center;">
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
    <button class="cq-nav prev">❮</button>
    <button class="cq-nav next">❯</button>
    <div class="cq-indicators" style="display:flex; gap: 6px; justify-content:center; position:absolute; bottom:30px; left:50%; transform:translateX(-50%); z-index:6;">
      ${activos.map((_, i) => `
        <div class="cq-indicator">
          <div class="cq-progress-fill" id="cq-progress-${i}"></div>
        </div>
      `).join('')}
    </div>
  </div>`;

  contenedor.innerHTML = html;

  const slides = Array.from(document.querySelectorAll(`#${carouselId} .cq-slide`));
  const indicators = Array.from(document.querySelectorAll('.cq-progress-fill'));
  const nextBtn = document.querySelector(`#${carouselId} .next`);
  const prevBtn = document.querySelector(`#${carouselId} .prev`);
  let currentSlide = 0;
  const duration = 5000;
  let timer;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });

    indicators.forEach((bar, i) => {
      bar.style.transition = 'none';
      bar.style.width = '0%';
      if (i === index) {
        setTimeout(() => {
          bar.style.transition = `width ${duration}ms linear`;
          bar.style.width = '100%';
        }, 20);
      }
    });

    currentSlide = index;
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
  }

  nextBtn.addEventListener('click', () => {
    nextSlide();
    resetInterval();
  });

  prevBtn.addEventListener('click', () => {
    prevSlide();
    resetInterval();
  });

  function resetInterval() {
    clearInterval(timer);
    timer = setInterval(nextSlide, duration);
  }

  showSlide(0);
  timer = setInterval(nextSlide, duration);
});
