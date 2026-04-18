(function(){
      const dataTag = document.getElementById('mcqColoresMadridData');
      const heroStage = document.getElementById('mcqColoresMadridHeroStage');
      const heroStack = document.getElementById('mcqColoresMadridHeroStack');
      const grid = document.getElementById('mcqColoresMadridGrid');
      const modal = document.getElementById('mcqColoresMadridModal');

      if(!dataTag || !heroStage || !heroStack || !grid || !modal) return;

      const modalImage = document.getElementById('mcqColoresMadridModalImage');
      const modalTitle = document.getElementById('mcqColoresMadridModalTitle');
      const modalAuthor = document.getElementById('mcqColoresMadridModalAuthor');
      const modalDescription = document.getElementById('mcqColoresMadridModalDescription');
      const modalPalette = document.getElementById('mcqColoresMadridModalPalette');

      const items = JSON.parse(dataTag.textContent).postcards || [];
      let bgFront = 0;
      let heroIndex = -1;
      let heroTimer = null;

      function getImageUrl(item){
        return 'https://cdn.mcq.cl/madrid/' + item.id + '.png';
      }

      function rand(min, max){
        return Math.random() * (max - min) + min;
      }

      function nextHeroIndex(){
        if(items.length <= 1) return 0;
        let idx;
        do{
          idx = Math.floor(Math.random() * items.length);
        } while(idx === heroIndex);
        return idx;
      }

      function createHeroBackgrounds(){
        heroStage.innerHTML = `
          <div class="mcq-coloresmadrid-hero-bg is-active"></div>
          <div class="mcq-coloresmadrid-hero-bg"></div>
        `;
      }

      function paintHeroBackground(item){
        const bgs = heroStage.querySelectorAll('.mcq-coloresmadrid-hero-bg');
        const incoming = bgs[bgFront === 0 ? 1 : 0];
        const outgoing = bgs[bgFront];
        const url = getImageUrl(item);

        incoming.style.backgroundImage = 'url("' + url + '")';
        incoming.style.backgroundPosition =
          rand(42,58).toFixed(2) + '% ' + rand(38,56).toFixed(2) + '%';

        requestAnimationFrame(() => {
          incoming.classList.add('is-active');
          outgoing.classList.remove('is-active');
          bgFront = bgFront === 0 ? 1 : 0;
        });
      }

      function getHeroLayout(order){
        const isMobile = window.matchMedia('(max-width: 640px)').matches;
        const isTablet = window.matchMedia('(max-width: 1080px)').matches;

        if (isMobile) {
          return {
            x: rand(50, 52).toFixed(2) + '%',
            y: rand(50, 54).toFixed(2) + '%',
            r: rand(-5, 5).toFixed(2) + 'deg',
            s: '1.00',
            w: '380px'
          };
        }

        if (isTablet) {
          return {
            x: rand(50, 54).toFixed(2) + '%',
            y: rand(52, 54).toFixed(2) + '%',
            r: rand(-5, 5).toFixed(2) + 'deg',
            s: '1.00',
            w: '720px'
          };
        }

        return {
          x: rand(52, 55).toFixed(2) + '%',
          y: rand(52, 54).toFixed(2) + '%',
          r: rand(-5, 5).toFixed(2) + 'deg',
          s: '1.00',
          w: '860px'
        };
      }

      function appendHeroPostcard(item){
        const existing = Array.from(heroStack.querySelectorAll('.mcq-coloresmadrid-hero-card'));
        const layout = getHeroLayout(existing.length);
        const card = document.createElement('article');

        card.className = 'mcq-coloresmadrid-hero-card';
        card.style.setProperty('--mcq-coloresmadrid-card-x', layout.x);
        card.style.setProperty('--mcq-coloresmadrid-card-y', layout.y);
        card.style.setProperty('--mcq-coloresmadrid-card-rotate', layout.r);
        card.style.setProperty('--mcq-coloresmadrid-card-scale', layout.s);
        card.style.setProperty('--mcq-coloresmadrid-card-width', layout.w);

        card.innerHTML = `
          <img class="mcq-coloresmadrid-hero-card-image" src="${getImageUrl(item)}" alt="${item.title}">
        `;

        heroStack.appendChild(card);

        const cards = Array.from(heroStack.querySelectorAll('.mcq-coloresmadrid-hero-card'));
        cards.forEach((heroCard, index) => {
          const reverseIndex = cards.length - 1 - index;
          heroCard.style.zIndex = String(index + 1);

          if (reverseIndex === 0) {
            heroCard.style.filter = 'brightness(1) saturate(1)';
            delete heroCard.dataset.old;
          } else if (reverseIndex === 1) {
            heroCard.dataset.old = 'true';
            heroCard.style.filter = 'brightness(.92) saturate(.94)';
          } else {
            heroCard.dataset.old = 'true';
            heroCard.style.filter = 'brightness(.82) saturate(.88)';
          }
        });

        if (cards.length > 3) {
          const oldest = cards[0];
          oldest.dataset.fade = 'true';
          setTimeout(() => {
            if (oldest.parentNode) oldest.parentNode.removeChild(oldest);
          }, 520);
        }
      }

      function cycleHero(){
        if(!items.length) return;
        heroIndex = nextHeroIndex();
        const item = items[heroIndex];
        paintHeroBackground(item);
        appendHeroPostcard(item);
      }

      function createCardPalette(colors){
        return (colors || []).map(color =>
          '<span class="mcq-coloresmadrid-card-swatch" style="background:' + color + '" title="' + color + '"></span>'
        ).join('');
      }

      function createGridCard(item){
        const article = document.createElement('article');
        article.className = 'mcq-coloresmadrid-card';
        article.innerHTML = `
          <div class="mcq-coloresmadrid-card-media">
            <img
              class="mcq-coloresmadrid-card-image"
              src="${getImageUrl(item)}"
              alt="${item.title}"
              loading="lazy"
              style="object-position:center ${item.posY || '35%'}"
            >
            <div class="mcq-coloresmadrid-card-shade"></div>
            <div class="mcq-coloresmadrid-card-body">
              <h3 class="mcq-coloresmadrid-card-title">${item.title || ''}</h3>
              <p class="mcq-coloresmadrid-card-author"><i class="bi bi-instagram" aria-hidden="true"></i>${item.author || ''}</p>
              <div class="mcq-coloresmadrid-card-actions">
                <div class="mcq-coloresmadrid-card-palette">${createCardPalette(item.palette)}</div>
                <button class="mcq-coloresmadrid-card-button" type="button"><i class="bi bi-eye-fill" aria-hidden="true"></i>Ver más</button>
              </div>
            </div>
          </div>
        `;

        article.querySelector('.mcq-coloresmadrid-card-button').addEventListener('click', function(e){
          e.stopPropagation();
          openModal(item);
        });

        article.querySelector('.mcq-coloresmadrid-card-media').addEventListener('click', function(){
          openModal(item);
        });

        return article;
      }

      function openModal(item){
        modalImage.src = getImageUrl(item);
        modalImage.alt = item.title || '';
        modalTitle.textContent = item.title || '';
        modalAuthor.innerHTML = '<i class="bi bi-instagram" aria-hidden="true"></i>' + (item.author || '');
        modalDescription.textContent = item.description || '';

        modalPalette.innerHTML = '';
        (item.palette || []).forEach(color => {
          const li = document.createElement('li');
          li.style.background = color;
          li.title = color;
          modalPalette.appendChild(li);
        });

        modal.hidden = false;
        document.body.classList.add('mcq-coloresmadrid-no-scroll');
      }

      function closeModal(){
        modal.hidden = true;
        document.body.classList.remove('mcq-coloresmadrid-no-scroll');
        modalImage.src = '';
      }

      function buildGrid(){
        grid.innerHTML = '';
        items.forEach(item => grid.appendChild(createGridCard(item)));
      }

      function startHeroRotation(){
        if(heroTimer) clearInterval(heroTimer);
        heroTimer = setInterval(cycleHero, 2600);
      }

      createHeroBackgrounds();
      cycleHero();
      cycleHero();
      cycleHero();
      buildGrid();
      startHeroRotation();

      modal.addEventListener('click', function(e){
        if(e.target.matches('[data-mcq-coloresmadrid-close]')) closeModal();
      });

      document.addEventListener('keydown', function(e){
        if(e.key === 'Escape' && !modal.hidden) closeModal();
      });

      window.addEventListener('resize', function(){
        startHeroRotation();
      });
    })();