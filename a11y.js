'use strict';
// Accessibility toolbar for visually impaired users (версия для слабовидящих)
(function(){
  const STORAGE_KEY = 'elx-a11y-settings';
  const defaultSettings = {
    active: false,
    fontSize: 'normal', // 'normal', 'large', 'xlarge'
    theme: 'default',   // 'default', 'contrast-bw', 'contrast-wb', 'contrast-dark', 'contrast-blue'
    images: true,       // true (show), false (hide)
    speech: false       // text-to-speech reader on click
  };

  let settings = Object.assign({}, defaultSettings);
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if(saved) settings = Object.assign({}, defaultSettings, JSON.parse(saved));
  } catch(e){}

  function saveSettings(){
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch(e){}
    applySettings();
  }

  function applySettings(){
    const html = document.documentElement;
    const body = document.body;

    // Remove old classes
    html.classList.remove('a11y-active', 'a11y-font-large', 'a11y-font-xlarge', 'a11y-bw', 'a11y-wb', 'a11y-dark', 'a11y-blue', 'a11y-no-images');

    if(settings.active){
      html.classList.add('a11y-active');
      if(settings.fontSize === 'large') html.classList.add('a11y-font-large');
      if(settings.fontSize === 'xlarge') html.classList.add('a11y-font-xlarge');
      if(settings.theme === 'contrast-bw') html.classList.add('a11y-bw');
      if(settings.theme === 'contrast-wb') html.classList.add('a11y-wb');
      if(settings.theme === 'contrast-dark') html.classList.add('a11y-dark');
      if(settings.theme === 'contrast-blue') html.classList.add('a11y-blue');
      if(!settings.images) html.classList.add('a11y-no-images');
    }

    renderPanel();
  }

  function renderPanel(){
    let bar = document.getElementById('a11y-toolbar');
    let toggleBtn = document.getElementById('a11y-toggle-btn');
    const isUz = (window.state && window.state.lang === 'uz');

    if(!toggleBtn){
      toggleBtn = document.createElement('button');
      toggleBtn.id = 'a11y-toggle-btn';
      toggleBtn.type = 'button';
      toggleBtn.className = 'a11y-trigger-btn';
      toggleBtn.setAttribute('aria-label', isUz ? 'Ko‘zi ojizlar uchun' : 'Версия для слабовидящих');
      toggleBtn.innerHTML = `
        <span class="a11y-eye-icon">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        </span>
        <span class="a11y-btn-text">${isUz ? 'Maxsus imkoniyatlar' : 'Для слабовидящих'}</span>
      `;
      toggleBtn.onclick = () => {
        settings.active = !settings.active;
        saveSettings();
      };
      const headerNav = document.querySelector('header nav');
      const header = document.querySelector('header');
      if(headerNav){
        headerNav.prepend(toggleBtn);
      } else if(header){
        header.append(toggleBtn);
      } else {
        document.body.prepend(toggleBtn);
      }
    }

    if(settings.active){
      if(!bar){
        bar = document.createElement('div');
        bar.id = 'a11y-toolbar';
        bar.className = 'a11y-bar';
        document.body.prepend(bar);
      }
      bar.style.display = 'flex';
      bar.innerHTML = `
        <div class="a11y-bar-container">
          <!-- Размер шрифта -->
          <div class="a11y-group">
            <span class="a11y-label">${isUz ? 'Shrift:' : 'Шрифт:'}</span>
            <div class="a11y-btns">
              <button type="button" class="a11y-btn ${settings.fontSize==='normal'?'active':''}" data-font="normal" title="${isUz?'Oddiy':'Обычный'}">A</button>
              <button type="button" class="a11y-btn ${settings.fontSize==='large'?'active':''}" data-font="large" title="${isUz?'Katta':'Большой'}" style="font-size:16px;">A+</button>
              <button type="button" class="a11y-btn ${settings.fontSize==='xlarge'?'active':''}" data-font="xlarge" title="${isUz?'Juda katta':'Очень большой'}" style="font-size:19px;">A++</button>
            </div>
          </div>

          <!-- Цветовая схема / Контраст -->
          <div class="a11y-group">
            <span class="a11y-label">${isUz ? 'Rang:' : 'Цвет:'}</span>
            <div class="a11y-btns">
              <button type="button" class="a11y-btn theme-c-default ${settings.theme==='default'?'active':''}" data-theme="default" title="${isUz?'Standart':'Стандартная'}">C</button>
              <button type="button" class="a11y-btn theme-c-bw ${settings.theme==='contrast-bw'?'active':''}" data-theme="contrast-bw" title="${isUz?'Oq fonda qora':'Черно-белая'}">Ч/Б</button>
              <button type="button" class="a11y-btn theme-c-wb ${settings.theme==='contrast-wb'?'active':''}" data-theme="contrast-wb" title="${isUz?'Qora fonda oq':'Инверсия'}">Б/Ч</button>
              <button type="button" class="a11y-btn theme-c-blue ${settings.theme==='contrast-blue'?'active':''}" data-theme="contrast-blue" title="${isUz?'Moviy fon':'Темно-синяя'}">Син</button>
            </div>
          </div>

          <!-- Картинки -->
          <div class="a11y-group">
            <span class="a11y-label">${isUz ? 'Rasmlar:' : 'Фото:'}</span>
            <button type="button" class="a11y-btn ${settings.images?'active':''}" id="a11y-img-toggle">
              ${settings.images ? (isUz ? 'Yoqilgan' : 'Вкл') : (isUz ? 'O‘chirilgan' : 'Без фото')}
            </button>
          </div>

          <!-- Озвучивание (Синтез речи) -->
          <div class="a11y-group">
            <button type="button" class="a11y-btn ${settings.speech?'active':''}" id="a11y-tts-toggle" title="${isUz?'Matnni ovoz chiqarib o‘qish':'Озвучивать текст при клике'}">
              <span class="a11y-ico-vol">🔊</span> ${isUz ? 'Ovoz' : 'Озвучка'}
            </button>
          </div>

          <!-- Закрыть/Сбросить -->
          <div class="a11y-group a11y-right">
            <button type="button" class="a11y-btn a11y-reset-btn" id="a11y-reset">${isUz ? 'Standart' : 'Сброс'}</button>
            <button type="button" class="a11y-close-btn" id="a11y-close" title="${isUz ? 'Yopish' : 'Обычная версия'}">✕</button>
          </div>
        </div>
      `;

      // Event handlers
      bar.querySelectorAll('[data-font]').forEach(btn => {
        btn.onclick = () => {
          settings.fontSize = btn.dataset.font;
          saveSettings();
        };
      });

      bar.querySelectorAll('[data-theme]').forEach(btn => {
        btn.onclick = () => {
          settings.theme = btn.dataset.theme;
          saveSettings();
        };
      });

      const imgToggle = document.getElementById('a11y-img-toggle');
      if(imgToggle){
        imgToggle.onclick = () => {
          settings.images = !settings.images;
          saveSettings();
        };
      }

      const ttsToggle = document.getElementById('a11y-tts-toggle');
      if(ttsToggle){
        ttsToggle.onclick = () => {
          settings.speech = !settings.speech;
          saveSettings();
          if(settings.speech && 'speechSynthesis' in window){
            const utter = new SpeechSynthesisUtterance(isUz ? 'Ovozli o‘qish rejimi yoqildi' : 'Режим озвучивания включен. Нажмите на любой текст для чтения');
            utter.lang = isUz ? 'uz-UZ' : 'ru-RU';
            window.speechSynthesis.speak(utter);
          }
        };
      }

      const resetBtn = document.getElementById('a11y-reset');
      if(resetBtn){
        resetBtn.onclick = () => {
          settings = Object.assign({}, defaultSettings, { active: true });
          saveSettings();
        };
      }

      const closeBtn = document.getElementById('a11y-close');
      if(closeBtn){
        closeBtn.onclick = () => {
          settings.active = false;
          saveSettings();
        };
      }
    } else {
      if(bar) bar.style.display = 'none';
    }
  }

  // Text-To-Speech reader on click
  document.addEventListener('click', e => {
    if(!settings.active || !settings.speech || !('speechSynthesis' in window)) return;
    if(e.target.closest('#a11y-toolbar') || e.target.closest('#a11y-toggle-btn')) return;

    const el = e.target.closest('h1, h2, h3, p, strong, small, button, span, td, th, label, .price');
    if(!el) return;
    const text = el.innerText || el.textContent;
    if(text && text.trim().length > 1){
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text.trim());
      utter.lang = (window.state && window.state.lang === 'uz') ? 'uz-UZ' : 'ru-RU';
      window.speechSynthesis.speak(utter);
    }
  });

  // Init
  document.addEventListener('DOMContentLoaded', applySettings);
  if(document.readyState === 'interactive' || document.readyState === 'complete'){
    applySettings();
  }
})();
