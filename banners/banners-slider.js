'use strict';
// Premium Banner Slider Component for ELXOLDING Catalog
(function(){
  let currentBannerIdx = 0;
  let bannerTimer = null;

  function getBanners(){
    return window.BANNERS_CONFIG && window.BANNERS_CONFIG.length ? window.BANNERS_CONFIG : [];
  }

  function initBannerSlider(){
    const hero = document.querySelector('.hero');
    if(!hero || hero.classList.contains('about-hero')) return;
    const banners = getBanners();
    if(!banners.length) return;

    // Remove existing slider if any
    const existing = document.getElementById('hero-slider');
    if(existing) existing.remove();

    const slider = document.createElement('div');
    slider.id = 'hero-slider';
    slider.className = 'hero-slider';

    slider.innerHTML = `
      <div class="hero-slider-track">
        ${banners.map((b, idx) => `
          <div class="hero-slide ${idx === currentBannerIdx ? 'active' : ''}" data-idx="${idx}" data-direction="${esc(b.direction || '')}">
            <img src="${esc(b.image)}" alt="${esc(b.alt || 'ELXOLDING Banner')}" class="hero-banner-img" onerror="this.parentElement.classList.add('banner-fallback')">
          </div>
        `).join('')}
      </div>
      ${banners.length > 1 ? `
        <button type="button" class="slider-arrow slider-prev" aria-label="Предыдущий баннер">‹</button>
        <button type="button" class="slider-arrow slider-next" aria-label="Следующий баннер">›</button>
        <div class="slider-dots">
          ${banners.map((_, idx) => `<button type="button" class="slider-dot ${idx === currentBannerIdx ? 'active' : ''}" data-idx="${idx}" aria-label="Слайд ${idx+1}"></button>`).join('')}
        </div>
      ` : ''}
    `;

    // Replace hero completely with slider banner
    hero.classList.add('hero-with-banner');
    hero.replaceWith(slider);

    function showSlide(idx){
      const slides = slider.querySelectorAll('.hero-slide');
      const dots = slider.querySelectorAll('.slider-dot');
      if(!slides.length) return;
      currentBannerIdx = (idx + slides.length) % slides.length;
      slides.forEach((s, i) => s.classList.toggle('active', i === currentBannerIdx));
      dots.forEach((d, i) => d.classList.toggle('active', i === currentBannerIdx));
      resetTimer();
    }

    function nextSlide(){ showSlide(currentBannerIdx + 1); }
    function prevSlide(){ showSlide(currentBannerIdx - 1); }

    const prevBtn = slider.querySelector('.slider-prev');
    const nextBtn = slider.querySelector('.slider-next');
    if(prevBtn) prevBtn.onclick = (e) => { e.stopPropagation(); prevSlide(); };
    if(nextBtn) nextBtn.onclick = (e) => { e.stopPropagation(); nextSlide(); };

    slider.querySelectorAll('.slider-dot').forEach(dot => {
      dot.onclick = (e) => {
        e.stopPropagation();
        showSlide(Number(dot.dataset.idx));
      };
    });

    // Click on slide to filter category if direction set
    slider.onclick = (e) => {
      const slide = e.target.closest('.hero-slide');
      if(!slide) return;
      const dir = slide.dataset.direction;
      if(dir && window.state){
        window.state.direction = dir;
        window.state.pageNo = 1;
        const sel = document.getElementById('direction');
        if(sel) sel.value = dir;
        if(typeof renderResults === 'function') renderResults();
        const sideBtn = document.querySelector(`[data-direction="${dir}"]`);
        if(sideBtn) sideBtn.click();
      }
    };

    function resetTimer(){
      if(bannerTimer) clearInterval(bannerTimer);
      if(banners.length > 1){
        bannerTimer = setInterval(nextSlide, 5000);
      }
    }

    slider.addEventListener('mouseenter', () => clearInterval(bannerTimer));
    slider.addEventListener('mouseleave', resetTimer);

    resetTimer();
  }

  // Hook into catalog render
  const originalRenderCatalog = window.renderCatalog;
  if(typeof originalRenderCatalog === 'function'){
    window.renderCatalog = function(){
      originalRenderCatalog();
      initBannerSlider();
    };
  }

  document.addEventListener('DOMContentLoaded', initBannerSlider);
  if(document.readyState === 'complete' || document.readyState === 'interactive'){
    setTimeout(initBannerSlider, 100);
  }
})();
