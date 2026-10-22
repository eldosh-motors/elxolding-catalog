// Premium intro splash screen with 50+ falling realistic vector educational equipment & clipped logo sheen
(function(){
  const splash = document.createElement('div');
  splash.id = 'premium-splash';
  splash.innerHTML = `
    <div class="splash-bg-glow"></div>
    <div class="splash-particles" id="splash-particles"></div>
    
    <div class="splash-content">
      <div class="splash-logo-wrap">
        <div class="splash-logo-aura"></div>
        <div class="splash-logo-clip">
          <img class="splash-logo" src="assets/elxolding-logo.png" alt="ELXOLDING">
          <div class="splash-shine"></div>
        </div>
      </div>

      <div class="splash-brand-text">
        <span class="splash-brand-title">ELXOLDING</span>
        <span class="splash-brand-subtitle">SMART EDUCATIONAL CATALOG</span>
      </div>

      <div class="splash-progress-container">
        <div class="splash-progress-bar">
          <div class="splash-progress-fill" id="splash-progress-fill"></div>
          <div class="splash-progress-glow"></div>
        </div>
        <div class="splash-progress-info">
          <span class="splash-status-text" id="splash-status">Загрузка каталога…</span>
          <span class="splash-percent" id="splash-percent">0%</span>
        </div>
      </div>
    </div>
  `;
  document.body.prepend(splash);

  // Rich set of transparent SVG educational items:
  // Microscopes, Flasks, DNA, Atoms, Telescopes, Magnets, Compasses, Scales, Test tubes, Prisms, Globes, Batteries etc.
  const educationalSVGs = [
    // 1. Microscope (микроскоп с объективом и регулятором)
    `<svg viewBox="0 0 64 64" fill="none">
      <path d="M22 14l12-7 6 10-12 7z" fill="#00c8d6" stroke="#fff" stroke-width="2"/>
      <path d="M28 24l-4 8 8 4 4-8z" fill="#008b94" stroke="#fff" stroke-width="1.5"/>
      <path d="M18 36c4-8 14-10 22-6 8 4 10 14 6 22l-6-3" stroke="#5ce3ec" stroke-width="3" stroke-linecap="round"/>
      <rect x="24" y="38" width="16" height="4" rx="2" fill="#fff"/>
      <path d="M12 56h40c2 0 4 2 4 4H8c0-2 2-4 4-4z" fill="#00e5f2"/>
      <circle cx="42" cy="30" r="4" fill="#ffd166"/>
      <circle cx="28" cy="22" r="2.5" fill="#fff"/>
    </svg>`,
    // 2. Erlenmeyer Flask (химическая колба Эрленмейера)
    `<svg viewBox="0 0 64 64" fill="none">
      <path d="M28 8h8v14l14 26c2 4-1 8-5 8H19c-4 0-7-4-5-8l14-26V8z" fill="rgba(0,214,224,0.25)" stroke="#5ce3ec" stroke-width="2.5"/>
      <path d="M26 8h12M24 6h16" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
      <path d="M17 48c4-2 8-2 15 1s11 2 15 0l1 3c0 2.5-2 4-4.5 4h-29c-2.5 0-4-1.5-4-4l6.5-4z" fill="#00e5f2" opacity="0.85"/>
      <circle cx="28" cy="42" r="2.5" fill="#fff" opacity="0.8"/>
      <circle cx="38" cy="46" r="1.8" fill="#fff" opacity="0.8"/>
      <circle cx="34" cy="36" r="1.5" fill="#fff" opacity="0.8"/>
    </svg>`,
    // 3. Atom with electron orbits (атом физика)
    `<svg viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="6" fill="#ffd166" stroke="#fff" stroke-width="1.5"/>
      <ellipse cx="32" cy="32" rx="26" ry="10" stroke="#00e5f2" stroke-width="2" transform="rotate(0 32 32)"/>
      <ellipse cx="32" cy="32" rx="26" ry="10" stroke="#5ce3ec" stroke-width="2" transform="rotate(60 32 32)"/>
      <ellipse cx="32" cy="32" rx="26" ry="10" stroke="#9bf6ff" stroke-width="2" transform="rotate(120 32 32)"/>
      <circle cx="54" cy="32" r="3" fill="#fff"/>
      <circle cx="21" cy="13" r="3" fill="#fff"/>
      <circle cx="21" cy="51" r="3" fill="#fff"/>
    </svg>`,
    // 4. DNA Double Helix (ДНК биология)
    `<svg viewBox="0 0 64 64" fill="none">
      <path d="M20 10c0 14 24 14 24 22s-24 8-24 22" stroke="#00e5f2" stroke-width="3" stroke-linecap="round"/>
      <path d="M44 10c0 14-24 14-24 22s24 8 24 22" stroke="#ff70a6" stroke-width="3" stroke-linecap="round"/>
      <line x1="22" y1="16" x2="42" y2="16" stroke="#fff" stroke-width="2"/>
      <line x1="27" y1="24" x2="37" y2="24" stroke="#ffd166" stroke-width="2"/>
      <line x1="27" y1="40" x2="37" y2="40" stroke="#ffd166" stroke-width="2"/>
      <line x1="22" y1="48" x2="42" y2="48" stroke="#fff" stroke-width="2"/>
    </svg>`,
    // 5. Telescope on tripod (телескоп на штативе астрономия)
    `<svg viewBox="0 0 64 64" fill="none">
      <path d="M14 26l32-14 6 14-32 14z" fill="#008b94" stroke="#5ce3ec" stroke-width="2"/>
      <path d="M10 28l8-3.5 2 4.5-8 3.5z" fill="#ffd166"/>
      <line x1="32" y1="36" x2="18" y2="58" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="32" y1="36" x2="46" y2="58" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="32" y1="36" x2="32" y2="58" stroke="#5ce3ec" stroke-width="2" stroke-linecap="round"/>
      <circle cx="32" cy="36" r="3.5" fill="#00e5f2"/>
    </svg>`,
    // 6. Horseshoe Magnet (магнит физика)
    `<svg viewBox="0 0 64 64" fill="none">
      <path d="M18 12v18c0 7.7 6.3 14 14 14s14-6.3 14-14V12h-9v18c0 2.8-2.2 5-5 5s-5-2.2-5-5V12h-9z" fill="#ff5964" stroke="#fff" stroke-width="1.5"/>
      <rect x="18" y="12" width="9" height="7" fill="#5ce3ec"/>
      <rect x="37" y="12" width="9" height="7" fill="#5ce3ec"/>
    </svg>`,
    // 7. Geometry Compass & Ruler (циркуль и линейка)
    `<svg viewBox="0 0 64 64" fill="none">
      <path d="M14 50L46 18l6 6L20 56z" fill="rgba(255,209,102,0.8)" stroke="#fff" stroke-width="2"/>
      <line x1="24" y1="26" x2="28" y2="30" stroke="#102d47" stroke-width="1.5"/>
      <line x1="30" y1="20" x2="34" y2="24" stroke="#102d47" stroke-width="1.5"/>
      <line x1="36" y1="14" x2="40" y2="18" stroke="#102d47" stroke-width="1.5"/>
      <line x1="26" y1="16" x2="42" y2="48" stroke="#00e5f2" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="38" y1="16" x2="22" y2="48" stroke="#00e5f2" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="32" cy="16" r="3.5" fill="#ffd166"/>
    </svg>`,
    // 8. Test Tube Rack with Bubbles (пробирки химические)
    `<svg viewBox="0 0 64 64" fill="none">
      <rect x="22" y="10" width="8" height="34" rx="4" fill="rgba(0,214,224,0.2)" stroke="#5ce3ec" stroke-width="2"/>
      <rect x="34" y="16" width="8" height="28" rx="4" fill="rgba(255,112,166,0.2)" stroke="#ff70a6" stroke-width="2"/>
      <path d="M22 32h8v8a4 4 0 0 1-8 0v-8z" fill="#00e5f2"/>
      <path d="M34 34h8v6a4 4 0 0 1-8 0v-6z" fill="#ff70a6"/>
      <rect x="14" y="44" width="36" height="4" rx="2" fill="#fff"/>
      <rect x="18" y="48" width="28" height="3" rx="1.5" fill="#5ce3ec"/>
    </svg>`,
    // 9. Optical Glass Prism with Spectrum (оптическая призма со спектром)
    `<svg viewBox="0 0 64 64" fill="none">
      <polygon points="32,10 52,48 12,48" fill="rgba(255,255,255,0.15)" stroke="#5ce3ec" stroke-width="2.5"/>
      <line x1="8" y1="36" x2="26" y2="30" stroke="#fff" stroke-width="2.5"/>
      <line x1="38" y1="30" x2="56" y2="24" stroke="#ff5964" stroke-width="2"/>
      <line x1="38" y1="30" x2="57" y2="28" stroke="#ffd166" stroke-width="2"/>
      <line x1="38" y1="30" x2="56" y2="33" stroke="#00e5f2" stroke-width="2"/>
    </svg>`,
    // 10. Laboratory Balance Scales (весы лабораторные)
    `<svg viewBox="0 0 64 64" fill="none">
      <line x1="32" y1="12" x2="32" y2="52" stroke="#5ce3ec" stroke-width="3"/>
      <line x1="16" y1="20" x2="48" y2="20" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>
      <polygon points="32,12 28,20 36,20" fill="#ffd166"/>
      <path d="M12 34h12l-6-14z" fill="rgba(0,214,224,0.3)" stroke="#5ce3ec" stroke-width="1.5"/>
      <path d="M40 34h12l-6-14z" fill="rgba(0,214,224,0.3)" stroke="#5ce3ec" stroke-width="1.5"/>
      <rect x="20" y="52" width="24" height="4" rx="2" fill="#fff"/>
    </svg>`,
    // 11. School Globe on Stand (глобус географический)
    `<svg viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="26" r="16" fill="rgba(0,180,210,0.3)" stroke="#5ce3ec" stroke-width="2.5"/>
      <path d="M22 26c2-4 8-4 10 0s8 4 10 0" stroke="#06d6a0" stroke-width="2.5" fill="none"/>
      <path d="M20 18c8 4 16 0 20 4" stroke="#06d6a0" stroke-width="2.5" fill="none"/>
      <path d="M18 12c-8 8-8 20 0 28" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <line x1="18" y1="40" x2="32" y2="48" stroke="#fff" stroke-width="2.5"/>
      <rect x="24" y="50" width="16" height="4" rx="2" fill="#ffd166"/>
    </svg>`,
    // 12. Molecular Structure (молекула)
    `<svg viewBox="0 0 64 64" fill="none">
      <circle cx="20" cy="22" r="6" fill="#00e5f2" stroke="#fff" stroke-width="1.5"/>
      <circle cx="44" cy="18" r="7" fill="#ff70a6" stroke="#fff" stroke-width="1.5"/>
      <circle cx="34" cy="46" r="8" fill="#ffd166" stroke="#fff" stroke-width="1.5"/>
      <line x1="24" y1="24" x2="40" y2="20" stroke="#fff" stroke-width="2.5"/>
      <line x1="22" y1="26" x2="32" y2="42" stroke="#fff" stroke-width="2.5"/>
      <line x1="42" y1="24" x2="36" y2="40" stroke="#fff" stroke-width="2.5"/>
    </svg>`
  ];

  const particlesContainer = document.getElementById('splash-particles');
  // 50+ falling items
  const totalItems = Math.max(52, Math.floor(window.innerWidth / 24));

  for (let i = 0; i < totalItems; i++) {
    const drop = document.createElement('div');
    drop.className = 'splash-drop';

    const left = Math.random() * 96 + 2; // percentage across width
    const duration = 2.4 + Math.random() * 3.8; // varied speed
    const delay = Math.random() * 3.2; // staggered rain start
    const size = 32 + Math.random() * 38; // 32px to 70px
    const opacity = 0.45 + Math.random() * 0.5; // clear visible transparency

    drop.style.left = left + '%';
    drop.style.width = size + 'px';
    drop.style.height = size + 'px';
    drop.style.animationDuration = duration + 's';
    drop.style.animationDelay = delay + 's';
    drop.style.opacity = opacity;

    // Pick from rich educational SVG collection
    drop.innerHTML = educationalSVGs[i % educationalSVGs.length];
    particlesContainer.appendChild(drop);
  }

  // Smooth progress animation 0 to 100%
  const fill = document.getElementById('splash-progress-fill');
  const percentEl = document.getElementById('splash-percent');
  const statusEl = document.getElementById('splash-status');

  const statusMessages = [
    'Инициализация каталога…',
    'Загрузка лабораторного оборудования…',
    'Подготовка витрины и спецификаций…',
    'Каталог готов!'
  ];

  let current = 0;
  const target = 100;
  const durationMs = 1900;
  const startTime = performance.now();

  function updateProgress(now) {
    const elapsed = now - startTime;
    const progressRatio = Math.min(1, elapsed / durationMs);
    const eased = 1 - Math.pow(1 - progressRatio, 2.5);
    current = Math.floor(eased * target);

    fill.style.width = current + '%';
    percentEl.textContent = current + '%';

    const stageIdx = Math.min(statusMessages.length - 1, Math.floor((current / 100) * statusMessages.length));
    statusEl.textContent = statusMessages[stageIdx];

    if (progressRatio < 1) {
      requestAnimationFrame(updateProgress);
    } else {
      setTimeout(() => {
        splash.classList.add('splash-fade-out');
        setTimeout(() => {
          splash.remove();
        }, 650);
      }, 300);
    }
  }

  requestAnimationFrame(updateProgress);
})();
