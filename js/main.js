/**
 * GRAZING TABLE CO. — SIMPLY MINDFUL EVENTS (MIAMI)
 * Core Interactions, Scroll Observers, Typewriter, and Event Estimator
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileDrawer();
  initTypewriter();
  initScrollGlide();
  initStatCounters();
  initEstimator();
  initGalleryFilter();
  initVideoControls();
});

/* ==========================================================================
   NAVBAR & SCROLL STATE
   ========================================================================== */
function initNavbar() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* ==========================================================================
   MOBILE DRAWER NAVIGATION
   ========================================================================== */
function initMobileDrawer() {
  const hamburger = document.querySelector('.hamburger-btn');
  const drawer = document.querySelector('.mobile-drawer');
  if (!hamburger || !drawer) return;

  const toggle = () => {
    const isOpen = drawer.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  hamburger.addEventListener('click', toggle);

  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      drawer.classList.remove('open');
      document.body.style.overflow = '';
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      toggle();
    }
  });
}

/* ==========================================================================
   DYNAMIC TYPEWRITER EFFECT
   ========================================================================== */
function initTypewriter() {
  const el = document.querySelector('.dynamic-typewriter');
  if (!el) return;

  const phrases = [
    "Opulent Artisanal Grazing Tables.",
    "Mindfully Sourced Luxury Feasts.",
    "Bespoke Wedding & Gala Displays.",
    "Miami's Elevated Event Catering."
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 70;

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      el.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 35;
    } else {
      el.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 70;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      isDeleting = true;
      typingSpeed = 2000;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 400;
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ==========================================================================
   MANDATORY GLIDE-IN SCROLL ANIMATION
   ========================================================================== */
function initScrollGlide() {
  const elements = document.querySelectorAll('.glide-in');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   TELEMETRY STAT COUNTER
   ========================================================================== */
function initStatCounters() {
  const counters = document.querySelectorAll('.stat-counter');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const targetVal = parseFloat(target.getAttribute('data-target') || target.textContent);
        const prefix = target.getAttribute('data-prefix') || '';
        const suffix = target.getAttribute('data-suffix') || '';
        const isDecimal = targetVal % 1 !== 0;

        let start = 0;
        const duration = 1600;
        const startTime = performance.now();

        function animate(now) {
          const progress = Math.min((now - startTime) / duration, 1);
          const easeProgress = 1 - Math.pow(1 - progress, 3);
          const current = start + (targetVal - start) * easeProgress;

          target.textContent = prefix + (isDecimal ? current.toFixed(1) : Math.floor(current).toLocaleString()) + suffix;

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            target.textContent = prefix + (isDecimal ? targetVal.toFixed(1) : targetVal.toLocaleString()) + suffix;
          }
        }

        requestAnimationFrame(animate);
        obs.unobserve(target);
      }
    });
  }, { threshold: 0.2 });

  counters.forEach(c => observer.observe(c));
}

/* ==========================================================================
   INTERACTIVE EVENT GUEST COUNT & GRAZING STYLE ESTIMATOR
   ========================================================================== */
function initEstimator() {
  const form = document.querySelector('#grazingEstimatorForm');
  if (!form) return;

  const nameEl = document.querySelector('#summaryStyleName');
  const guestsEl = document.querySelector('#summaryGuests');
  const lengthEl = document.querySelector('#summaryTableLength');
  const dietaryEl = document.querySelector('#summaryDietary');
  const bookBtn = document.querySelector('#btnBookEstimator');

  const styles = {
    'grand': {
      name: 'The Grand Artisan Feast',
      tableLength: '6 - 12 Feet Banquet',
      inclusions: 'Triple-crème bries, prosciutto rosettes, honeycomb, rustic sourdough & figs'
    },
    'mediterranean': {
      name: 'The Mediterranean Olive Grove',
      tableLength: '6 - 10 Feet Banquet',
      inclusions: 'Manchego, aged gouda, marinated castelvetrano olives, pita crisps & pestos'
    },
    'vegan': {
      name: 'The Mindful Vegan Crudité',
      tableLength: '5 - 8 Feet Banquet',
      inclusions: 'Cashew brie, rainbow heritage crudités, beetroot hummus & edible florals'
    },
    'brunch': {
      name: 'The Coastal Sunshine Brunch',
      tableLength: '6 - 10 Feet Banquet',
      inclusions: 'French croissants, smoked salmon canapés, golden berries & artisan yogurts'
    }
  };

  function update() {
    const guestInput = form.querySelector('input[name="guests"]:checked');
    const styleInput = form.querySelector('input[name="style"]:checked');
    const dietInput = form.querySelector('input[name="dietary"]:checked');

    const guestText = guestInput ? guestInput.value : '35 - 75 Guests';
    const styleKey = styleInput ? styleInput.value : 'grand';
    const dietText = dietInput ? dietInput.value : 'Artisan Traditional & Gluten-Free Accommodations';
    const selectedStyle = styles[styleKey] || styles['grand'];

    if (nameEl) nameEl.textContent = selectedStyle.name;
    if (guestsEl) guestsEl.textContent = guestText;
    if (lengthEl) lengthEl.textContent = selectedStyle.tableLength;
    if (dietEl = dietaryEl) dietEl.textContent = dietText;

    if (bookBtn) {
      const msg = `Hi Grazing Table Co.! I would love to check availability for an event catering in Miami for ${guestText}. Style: ${selectedStyle.name} (${selectedStyle.tableLength}). Dietary preference: ${dietText}. When is a good time to chat?`;
      bookBtn.href = `https://wa.me/17865060040?text=${encodeURIComponent(msg)}`;
    }
  }

  form.querySelectorAll('input').forEach(input => {
    input.addEventListener('change', update);
  });

  update();
}

/* ==========================================================================
   GALLERY FILTER RAIL
   ========================================================================== */
function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.gallery-item');
  if (!filterBtns.length || !items.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      items.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.style.display = 'block';
          item.classList.add('glide-in', 'in-view');
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   VIDEO CONTROLS
   ========================================================================== */
function initVideoControls() {
  const video = document.querySelector('.hero-video');
  const btn = document.querySelector('.video-control-btn');
  if (!video || !btn) return;

  btn.addEventListener('click', () => {
    if (video.paused) {
      video.play();
      btn.innerHTML = `<svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;
      btn.setAttribute('aria-label', 'Pause background video');
    } else {
      video.pause();
      btn.innerHTML = `<svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>`;
      btn.setAttribute('aria-label', 'Play background video');
    }
  });
}
