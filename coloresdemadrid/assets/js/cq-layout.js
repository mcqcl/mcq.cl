(function () {
  function mountHeader() {
    const headerMarkup = `
      <div id="rtmb-header" class="rtmb-header">
        <div class="rtmb-inner">
          <a class="rtmb-brand" href="https://canales.pe" aria-label="Inicio">
            <img
              src="https://cdn.mcq.cl/logo/canales.svg"
              alt="CANALES"
              height="48"
              loading="eager"
            />
          </a>
        </div>
      </div>
    `;

    const mount = document.getElementById("header-container");
    if (mount) mount.innerHTML = headerMarkup;
  }

  function initHeader(root = document) {
    const header = root.getElementById("rtmb-header");
    if (!header) return;

    let isShrunk = false;
    const ADD_AT = 80;
    const REMOVE_AT = 40;

    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop;

      if (!isShrunk && y > ADD_AT) {
        header.classList.add("rtmb-shrink");
        isShrunk = true;
      } else if (isShrunk && y < REMOVE_AT) {
        header.classList.remove("rtmb-shrink");
        isShrunk = false;
      }
    };

    let ticking = false;

    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            onScroll();
            ticking = false;
          });
          ticking = true;
        }
      },
      { passive: true }
    );

    onScroll();
  }

  function mountFooter() {
    const footerMarkup = `
      <footer id="footer">
        <div class="container text-center">
          <center><img
            src="https://cdn.mcq.cl/logo/canales-white.svg"
            alt="CANALES"
            class="cq-footer-logo"
          /></center>

          <div class="cq-footer-social">
            <a href="https://www.canales.pe/twitter" aria-label="Twitter X"><i class="bi bi-twitter-x"></i></a>
            <a href="https://www.canales.pe/facebook" aria-label="Facebook"><i class="bi bi-facebook"></i></a>
            <a href="https://www.canales.pe/instagram" aria-label="Instagram"><i class="bi bi-instagram"></i></a>
            <a href="https://www.canales.pe/threads" aria-label="Threads"><i class="bi bi-threads"></i></a>
            <a href="https://www.canales.pe/tiktok" aria-label="TikTok"><i class="bi bi-tiktok"></i></a>
          </div>
        </div>

        <div class="cq-footer-divider"></div>

        <div class="container">
          <div class="cq-footer-copy">© <span id="cq-current-year"></span> | Todos los derechos reservados | CANALES ®</div>
          <div class="cq-footer-legal">CANALES ® es una marca registrada de Manuel Canales Q.</div>
        </div>
      </footer>
    `;

    const mount = document.getElementById("footer-container");
    if (mount) mount.innerHTML = footerMarkup;
  }

  function setCurrentYear() {
    const yearNode = document.getElementById("cq-current-year");
    if (yearNode) {
      yearNode.textContent = new Date().getFullYear();
    }
  }

  function initLayout() {
    mountHeader();
    mountFooter();
    setCurrentYear();
    initHeader(document);
  }

  initLayout();
})();

/*  */

function initTabsSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (!section) return;

  const buttons = section.querySelectorAll('[data-cq-tab-btn]');
  const panels = section.querySelectorAll('[data-cq-tab-panel]');

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.cqTabBtn;

      buttons.forEach((b) => b.classList.remove('is-active'));
      panels.forEach((p) => p.classList.remove('is-active'));

      btn.classList.add('is-active');
      section.querySelector(`[data-cq-tab-panel="${target}"]`)?.classList.add('is-active');
    });
  });
}

/* init */
initTabsSection('cqS011');

/*  */
function initCollapseSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (!section) return;

  const buttons = section.querySelectorAll('[data-cq-collapse-btn]');

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.cqCollapseBtn;
      const panel = section.querySelector(`[data-cq-collapse-panel="${key}"]`);
      if (!panel) return;

      const isOpen = panel.classList.contains('is-open');
      btn.classList.toggle('is-open', !isOpen);
      panel.classList.toggle('is-open', !isOpen);
    });
  });
}

/* init */
initCollapseSection('cqS012');

/*  */

function initCarouselSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (!section) return;

  const track = section.querySelector('[data-cq-carousel-track]');
  const prev = section.querySelector('[data-cq-carousel-prev]');
  const next = section.querySelector('[data-cq-carousel-next]');
  const dots = section.querySelectorAll('[data-cq-carousel-dot]');
  const slides = section.querySelectorAll('.cq-carousel-a__slide');

  if (!track || !slides.length) return;

  let current = 0;

  function render() {
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((dot, index) => {
      dot.classList.toggle('is-active', index === current);
    });
  }

  function goTo(index) {
    current = index;
    if (current < 0) current = slides.length - 1;
    if (current >= slides.length) current = 0;
    render();
  }

  prev?.addEventListener('click', () => goTo(current - 1));
  next?.addEventListener('click', () => goTo(current + 1));

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const index = Number(dot.dataset.cqCarouselDot);
      goTo(index);
    });
  });

  render();
}

/* init */
initCarouselSection('cqS016');

/*  */

function initCarouselCardsSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (!section) return;

  const track = section.querySelector('[data-cq-carousel-track]');
  const prev = section.querySelector('[data-cq-carousel-prev]');
  const next = section.querySelector('[data-cq-carousel-next]');
  const dotsWrap = section.querySelector('[data-cq-carousel-dots]');
  const slides = Array.from(section.querySelectorAll('.cq-carousel-b__slide'));
  if (!track || !slides.length || !dotsWrap) return;

  let currentPage = 0;

  function getPerView() {
    if (window.innerWidth <= 767.98) return 1;
    if (window.innerWidth <= 991.98) return 2;
    return 3;
  }

  function getTotalPages() {
    return Math.max(1, Math.ceil(slides.length / getPerView()));
  }

  function buildDots() {
    dotsWrap.innerHTML = '';
    const totalPages = getTotalPages();

    for (let i = 0; i < totalPages; i++) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'cq-carousel-b__dot';
      if (i === currentPage) dot.classList.add('is-active');
      dot.setAttribute('aria-label', `Ir a la página ${i + 1}`);
      dot.addEventListener('click', () => {
        currentPage = i;
        render();
      });
      dotsWrap.appendChild(dot);
    }
  }

  function render() {
    const perView = getPerView();
    const totalPages = getTotalPages();
    if (currentPage >= totalPages) currentPage = totalPages - 1;

    const slideWidth = slides[0].getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    const offset = currentPage * ((slideWidth + gap) * perView);

    track.style.transform = `translateX(-${offset}px)`;

    const dots = dotsWrap.querySelectorAll('.cq-carousel-b__dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('is-active', index === currentPage);
    });
  }

  prev?.addEventListener('click', () => {
    currentPage--;
    if (currentPage < 0) currentPage = getTotalPages() - 1;
    render();
  });

  next?.addEventListener('click', () => {
    currentPage++;
    if (currentPage >= getTotalPages()) currentPage = 0;
    render();
  });

  window.addEventListener('resize', () => {
    buildDots();
    render();
  });

  buildDots();
  render();
}

/* init */
initCarouselCardsSection('cqS017');

/*  */

function initCarouselBioSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (!section) return;

  const track = section.querySelector('[data-cq-carousel-track]');
  const prev = section.querySelector('[data-cq-carousel-prev]');
  const next = section.querySelector('[data-cq-carousel-next]');
  const dotsWrap = section.querySelector('[data-cq-carousel-dots]');
  const slides = Array.from(section.querySelectorAll('.cq-carousel-c__slide'));
  if (!track || !slides.length || !dotsWrap) return;

  let currentPage = 0;

  function getPerView() {
    if (window.innerWidth <= 767.98) return 1;
    if (window.innerWidth <= 991.98) return 2;
    return 3;
  }

  function getTotalPages() {
    return Math.max(1, Math.ceil(slides.length / getPerView()));
  }

  function buildDots() {
    dotsWrap.innerHTML = '';
    const totalPages = getTotalPages();

    for (let i = 0; i < totalPages; i++) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'cq-carousel-c__dot';
      if (i === currentPage) dot.classList.add('is-active');
      dot.setAttribute('aria-label', `Ir a la página ${i + 1}`);
      dot.addEventListener('click', () => {
        currentPage = i;
        render();
      });
      dotsWrap.appendChild(dot);
    }
  }

  function render() {
    const perView = getPerView();
    const totalPages = getTotalPages();
    if (currentPage >= totalPages) currentPage = totalPages - 1;

    const slideWidth = slides[0].getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    const offset = currentPage * ((slideWidth + gap) * perView);

    track.style.transform = `translateX(-${offset}px)`;

    const dots = dotsWrap.querySelectorAll('.cq-carousel-c__dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('is-active', index === currentPage);
    });
  }

  prev?.addEventListener('click', () => {
    currentPage--;
    if (currentPage < 0) currentPage = getTotalPages() - 1;
    render();
  });

  next?.addEventListener('click', () => {
    currentPage++;
    if (currentPage >= getTotalPages()) currentPage = 0;
    render();
  });

  window.addEventListener('resize', () => {
    buildDots();
    render();
  });

  buildDots();
  render();
}

/* init */
initCarouselBioSection('cqS018');

/*  */

/*  */
