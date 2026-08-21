/**
 * Reviews & Testimonials — Carousel System
 * reviews-js/reviews.js
 */

class RvCarousel {
  constructor(el) {
    this.el = el;
    this.viewport = el.querySelector('.rv-viewport');
    this.track = el.querySelector('.rv-track');
    this.slides = [...el.querySelectorAll('.rv-slide')];
    this.prevBtn = el.querySelector('.rv-prev');
    this.nextBtn = el.querySelector('.rv-next');
    this.dotsEl = el.querySelector('.rv-dots');

    this.index = 0;
    this.resizeTimer = null;
    this.autoTimer = null;

    if (!this.track || !this.slides.length) return;

    this.setup();
    this.bindEvents();

    window.addEventListener('resize', () => {
      clearTimeout(this.resizeTimer);
      this.resizeTimer = setTimeout(() => {
        this.index = Math.min(this.index, this.maxIndex());
        this.setup();
      }, 180);
    });
  }

  /* ── Responsive items per view ── */
  getK() {
    const w = window.innerWidth;
    if (w <= 600) return parseInt(this.el.dataset.itemsMobile || 1);
    if (w <= 992) return parseInt(this.el.dataset.itemsTablet || this.el.dataset.items || 1);
    return parseInt(this.el.dataset.items || 1);
  }

  get gap() { return 24; }

  maxIndex() {
    return Math.max(0, this.slides.length - this.getK());
  }

  /* ── Setup / measure ── */
  setup() {
    const k = this.getK();
    const g = this.gap;

    this.slides.forEach(slide => {
      slide.style.flex = `0 0 calc((100% - ${g * (k - 1)}px) / ${k})`;
    });
    this.track.style.gap = `${g}px`;

    this.buildDots(k);
    this.update();
  }

  /* ── Dot generation ── */
  buildDots(k) {
    if (!this.dotsEl) return;
    const pages = Math.ceil(this.slides.length / k);
    this.dotsEl.innerHTML = '';

    for (let i = 0; i < pages; i++) {
      const dot = document.createElement('span');
      dot.className = 'rv-dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => this.goTo(i * k));
      this.dotsEl.appendChild(dot);
    }
  }

  /* ── Translate + state ── */
  update() {
    // Use pixel offset so it works perfectly with CSS calc widths
    const slideEl = this.slides[0];
    const slideWidth = slideEl ? slideEl.offsetWidth : 0;
    const offset = -(slideWidth + this.gap) * this.index;
    this.track.style.transform = `translateX(${offset}px)`;

    // Dots
    if (this.dotsEl) {
      const k = this.getK();
      const activePage = Math.floor(this.index / k);
      [...this.dotsEl.querySelectorAll('.rv-dot')].forEach((d, i) => {
        d.classList.toggle('active', i === activePage);
      });
    }

    // Buttons
    if (this.prevBtn) this.prevBtn.disabled = this.index <= 0;
    if (this.nextBtn) this.nextBtn.disabled = this.index >= this.maxIndex();
  }

  goTo(idx) {
    this.index = Math.max(0, Math.min(idx, this.maxIndex()));
    this.update();
  }

  /* ── Event bindings ── */
  bindEvents() {
    this.prevBtn?.addEventListener('click', () => this.goTo(this.index - 1));
    this.nextBtn?.addEventListener('click', () => this.goTo(this.index + 1));

    /* Touch / mouse swipe */
    let startX = 0;
    let active = false;

    const onStart = (x) => { startX = x; active = true; };
    const onEnd   = (x) => {
      if (!active) return;
      active = false;
      const diff = startX - x;
      if (Math.abs(diff) > 44) {
        diff > 0 ? this.goTo(this.index + 1) : this.goTo(this.index - 1);
      }
    };

    // Touch
    this.track.addEventListener('touchstart', e => onStart(e.touches[0].clientX), { passive: true });
    this.track.addEventListener('touchend',   e => onEnd(e.changedTouches[0].clientX));

    // Mouse drag (desktop swipe)
    this.track.addEventListener('mousedown', e => { onStart(e.clientX); this.track.style.cursor = 'grabbing'; });
    document.addEventListener('mouseup', e => {
      if (!active) return;
      this.track.style.cursor = '';
      onEnd(e.clientX);
    });

    // Keyboard (when focused inside carousel)
    this.el.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft')  this.goTo(this.index - 1);
      if (e.key === 'ArrowRight') this.goTo(this.index + 1);
    });
  }
}


/* ── Autoplay wrapper for hero quote card (optional flair) ── */
function initHeroQuoteAnimation() {
  const card = document.querySelector('.rv-hero-quote-card');
  if (!card) return;

  // Subtle entrance shimmer on the card border
  card.style.transition = 'box-shadow 1s ease';
  setTimeout(() => {
    card.style.boxShadow = '0 24px 70px rgba(0,0,0,.45), 0 0 40px rgba(255,200,0,.06)';
  }, 800);
}


/* ── Toggle Collapsible Long Reviews ── */
function grToggle(btn) {
  const wrap = btn.previousElementSibling;
  if (!wrap) return;
  const isExpanded = wrap.classList.toggle('expanded');
  btn.classList.toggle('open', isExpanded);
  btn.innerHTML = isExpanded 
    ? 'Read less <i class="fa-solid fa-chevron-down"></i>' 
    : 'Read more <i class="fa-solid fa-chevron-down"></i>';
}

/* ── Single video active player handler ── */
function initVideoPlayers() {
  const allVideos = document.querySelectorAll('video');
  allVideos.forEach(vid => {
    vid.addEventListener('play', () => {
      allVideos.forEach(otherVid => {
        if (otherVid !== vid && !otherVid.paused) {
          otherVid.pause();
        }
      });
    });
  });
}

/* ── Init all carousels on DOM ready ── */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.rv-carousel').forEach(el => new RvCarousel(el));
  initHeroQuoteAnimation();
  initVideoPlayers();
});


