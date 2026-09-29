/**
 * ==========================================================================
 * SCRIPTOR HOUSE — CINEMATIC LIVE BACKGROUND ENGINE
 * Film grain, projector light beams, bokeh dust particles
 * ==========================================================================
 */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────────
     CONFIG
  ───────────────────────────────────────────────── */
  const CFG = {
    grain: {
      enabled:   true,
      opacity:   0.040,    // how strong the grain is
      interval:  60,       // ms between grain refreshes (lower = more flicker)
    },
    beams: [
      // Primary slow projector sweep
      {
        x: 0.18, y: 0,          // start anchor (ratio of screen)
        spreadDeg: 28,           // cone half-angle in degrees
        length: 1.1,             // relative to screen height
        color: 'rgba(240,146,42,', // burnt sienna
        baseOpacity: 0.080,
        pulseSpeed: 0.00045,
        sweepSpeed: 0.00018,
        sweepRange: 0.55,        // how far it sweeps (ratio of width)
      },
      // Secondary soft blue-white cinematic fill beam
      {
        x: 0.82, y: 0,
        spreadDeg: 22,
        length: 0.95,
        color: 'rgba(240,220,195,',
        baseOpacity: 0.048,
        pulseSpeed: 0.00038,
        sweepSpeed: 0.00022,
        sweepRange: 0.42,
      },
      // Accent warm side beam
      {
        x: 0.5, y: 0,
        spreadDeg: 15,
        length: 0.80,
        color: 'rgba(180,100,30,',
        baseOpacity: 0.038,
        pulseSpeed: 0.00055,
        sweepSpeed: 0.00013,
        sweepRange: 0.70,
      },
    ],
    dust: {
      count:       50,
      minSize:     1.0,    // px
      maxSize:     3.2,
      minDuration: 14,     // seconds
      maxDuration: 38,
      colors: [
        'rgba(240,146,42,',
        'rgba(255,160,60,',
        'rgba(250,240,220,',
        'rgba(180,90,20,',
      ],
    },
  };

  /* ─────────────────────────────────────────────────
     CANVAS SETUP
  ───────────────────────────────────────────────── */
  const canvas = document.createElement('canvas');
  canvas.id = 'cinematic-canvas';
  document.body.prepend(canvas);
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  /* ─────────────────────────────────────────────────
     FILM STRIP EDGES
  ───────────────────────────────────────────────── */
  ['left','right'].forEach(side => {
    const wrap = document.createElement('div');
    wrap.id = `cinematic-filmstrip-${side}`;
    const inner = document.createElement('div');
    inner.className = 'filmstrip-inner';
    wrap.appendChild(inner);
    document.body.prepend(wrap);
  });

  /* ─────────────────────────────────────────────────
     VIGNETTE OVERLAY
  ───────────────────────────────────────────────── */
  const vignette = document.createElement('div');
  vignette.id = 'cinematic-vignette';
  document.body.prepend(vignette);

  /* ─────────────────────────────────────────────────
     GRAIN — off-screen canvas, refreshed periodically
  ───────────────────────────────────────────────── */
  let grainCanvas, grainCtx, grainFrame;
  let lastGrainTime = 0;

  function buildGrain() {
    grainCanvas = document.createElement('canvas');
    grainCanvas.width  = 256;
    grainCanvas.height = 256;
    grainCtx = grainCanvas.getContext('2d');
    refreshGrain();
  }

  function refreshGrain() {
    const imageData = grainCtx.createImageData(256, 256);
    const buf = imageData.data;
    for (let i = 0; i < buf.length; i += 4) {
      const v = (Math.random() * 255) | 0;
      buf[i]   = v;
      buf[i+1] = v;
      buf[i+2] = v;
      buf[i+3] = 255;
    }
    grainCtx.putImageData(imageData, 0, 0);
  }

  function drawGrain(now) {
    if (now - lastGrainTime > CFG.grain.interval) {
      refreshGrain();
      lastGrainTime = now;
    }
    ctx.save();
    ctx.globalAlpha      = CFG.grain.opacity;
    ctx.globalCompositeOperation = 'screen';

    const pat = ctx.createPattern(grainCanvas, 'repeat');
    if (pat) {
      ctx.fillStyle = pat;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.restore();
  }

  /* ─────────────────────────────────────────────────
     BEAMS — cinematic projector cone sweep
  ───────────────────────────────────────────────── */
  function drawBeams(t) {
    const W = canvas.width;
    const H = canvas.height;

    CFG.beams.forEach(beam => {
      // sweeping origin X
      const sweep    = Math.sin(t * beam.sweepSpeed) * beam.sweepRange;
      const originX  = (beam.x + sweep) * W;
      const originY  = beam.y * H;

      // pulsing opacity
      const pulse    = 0.65 + 0.35 * Math.sin(t * beam.pulseSpeed);
      const opacity  = beam.baseOpacity * pulse;

      // cone tip angle
      const halfRad  = (beam.spreadDeg * Math.PI) / 180;
      const endY     = originY + beam.length * H;
      const radius   = Math.tan(halfRad) * (beam.length * H);

      // gradient from tip to base of cone
      const grad = ctx.createRadialGradient(
        originX, originY, 0,
        originX, endY,    radius
      );
      grad.addColorStop(0,   beam.color + (opacity * 0.9) + ')');
      grad.addColorStop(0.35, beam.color + (opacity * 0.55) + ')');
      grad.addColorStop(0.7,  beam.color + (opacity * 0.18) + ')');
      grad.addColorStop(1,    beam.color + '0)');

      ctx.save();
      ctx.globalCompositeOperation = 'screen';

      // clip to cone shape
      ctx.beginPath();
      ctx.moveTo(originX, originY);
      ctx.lineTo(originX - radius, endY);
      ctx.lineTo(originX + radius, endY);
      ctx.closePath();
      ctx.clip();

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();

      // soft glow halo at the beam origin tip
      const halo = ctx.createRadialGradient(originX, originY, 0, originX, originY, 120);
      halo.addColorStop(0,   beam.color + (opacity * 1.2) + ')');
      halo.addColorStop(0.5, beam.color + (opacity * 0.3) + ')');
      halo.addColorStop(1,   beam.color + '0)');
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(originX, originY, 120, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  /* ─────────────────────────────────────────────────
     DUST PARTICLES — DOM-based floating bokeh
  ───────────────────────────────────────────────── */
  function spawnDust() {
    const { count, minSize, maxSize, minDuration, maxDuration, colors } = CFG.dust;

    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = 'cinematic-dust';

      const size     = minSize + Math.random() * (maxSize - minSize);
      const dur      = minDuration + Math.random() * (maxDuration - minDuration);
      const delay    = -(Math.random() * dur); // start mid-animation
      const left     = Math.random() * 100;
      const drift    = (Math.random() - 0.5) * 180;
      const opacity  = 0.25 + Math.random() * 0.55;
      const color    = colors[(Math.random() * colors.length) | 0];

      el.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        bottom: 0;
        background: ${color}${opacity});
        box-shadow: 0 0 ${size * 3}px ${color}${opacity * 0.6});
        --drift: ${drift}px;
        animation-duration: ${dur}s;
        animation-delay: ${delay}s;
        filter: blur(${size > 1.8 ? '0.5px' : '0'});
      `;

      document.body.appendChild(el);
    }
  }

  /* ─────────────────────────────────────────────────
     MAIN RENDER LOOP
  ───────────────────────────────────────────────── */
  let raf;

  function render(t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Projector beams
    drawBeams(t);

    // 2. Film grain overlay
    if (CFG.grain.enabled) drawGrain(t);

    raf = requestAnimationFrame(render);
  }

  /* ─────────────────────────────────────────────────
     INIT
  ───────────────────────────────────────────────── */
  function init() {
    buildGrain();
    spawnDust();
    raf = requestAnimationFrame(render);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Pause animation when tab is hidden (performance)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(raf);
    } else {
      raf = requestAnimationFrame(render);
    }
  });

})();
