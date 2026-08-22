/**
 * Scriptor House - Live Theme Switcher
 * Two tabs: Background Themes + Exact Reference Color Palettes
 */

(function () {
  'use strict';

  /* ── Background Themes ── */
  const BG_THEMES = [
    { id: 'theme-titanium',  label: 'Titanium',       icon: 'fa-solid fa-shield-halved' },
    { id: 'theme-obsidian',  label: 'Obsidian',       icon: 'fa-solid fa-gem' },
    { id: 'theme-chrome',    label: 'Chrome',         icon: 'fa-solid fa-wand-magic-sparkles' },
    { id: 'theme-carbon',    label: 'Carbon Mesh',    icon: 'fa-solid fa-layer-group' },
    { id: 'theme-bronze',    label: 'Bronze Ore',     icon: 'fa-solid fa-coins' },
    { id: 'theme-damask',    label: 'Royal Filigree', icon: 'fa-solid fa-crown' },
    { id: 'theme-hexgrid',   label: 'Hex Matrix',     icon: 'fa-solid fa-cubes' },
    { id: 'theme-nebula',    label: 'Cosmic Nebula',  icon: 'fa-solid fa-meteor' },
    { id: 'theme-original',  label: 'Original',       icon: 'fa-solid fa-rotate-left' }
  ];

  /* ── Color Palettes (Curated from Reference Images) ── */
  const PALETTES = [
    { 
      id: 'palette-classic-gold', 
      label: 'Classic Gold', 
      swatch: '#FFC800', 
      sub: '#050505',
      icon: 'fa-solid fa-star' 
    },
    { 
      id: 'palette-midnight-gold', 
      label: 'Midnight & Amber', 
      swatch: '#FCA311', 
      sub: '#14213D',
      icon: 'fa-solid fa-moon' 
    },
    { 
      id: 'palette-spruce-sage', 
      label: 'Spruce & Sage', 
      swatch: '#8EB69B', 
      sub: '#0B2B26',
      icon: 'fa-solid fa-leaf' 
    },
    { 
      id: 'palette-terracotta-slate', 
      label: 'Terracotta & Slate', 
      swatch: '#FFB162', 
      sub: '#2C3B4D',
      icon: 'fa-solid fa-feather-pointed' 
    },
    { 
      id: 'palette-cyber-orange', 
      label: 'Cyber Flame', 
      swatch: '#E85002', 
      sub: '#333333',
      icon: 'fa-solid fa-fire-flame-curved' 
    },
    { 
      id: 'palette-tangerine-espresso', 
      label: 'Tangerine Espresso', 
      swatch: '#FF6D29', 
      sub: '#453027',
      icon: 'fa-solid fa-mug-hot' 
    }
  ];

  /* ── Apply background theme ── */
  function applyBgTheme(id) {
    BG_THEMES.forEach(t => document.body.classList.remove(t.id));
    document.body.classList.add(id);
    localStorage.setItem('sh_bg_theme', id);
    document.querySelectorAll('[data-bg-theme]').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-bg-theme') === id);
    });
  }

  /* ── Apply color palette ── */
  function applyPalette(id) {
    PALETTES.forEach(p => document.body.classList.remove(p.id));
    document.body.classList.add(id);
    localStorage.setItem('sh_palette', id);
    document.querySelectorAll('[data-palette]').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-palette') === id);
    });
  }

  /* ── Init ── */
  function initThemeSwitcher() {
    // Restore saved preferences
    const savedBg = localStorage.getItem('sh_bg_theme') || 'theme-titanium';
    let savedPalette = localStorage.getItem('sh_palette') || 'palette-classic-gold';

    // Backwards compatibility migration
    if (savedPalette === 'palette-gold') savedPalette = 'palette-classic-gold';
    if (savedPalette === 'palette-amber') savedPalette = 'palette-midnight-gold';
    if (savedPalette === 'palette-emerald') savedPalette = 'palette-spruce-sage';
    if (savedPalette === 'palette-crimson') savedPalette = 'palette-cyber-orange';
    if (!PALETTES.some(p => p.id === savedPalette)) savedPalette = 'palette-classic-gold';

    BG_THEMES.forEach(t => document.body.classList.remove(t.id));
    document.body.classList.add(savedBg);
    PALETTES.forEach(p => document.body.classList.remove(p.id));
    document.body.classList.add(savedPalette);

    // Build HTML
    const bgButtons = BG_THEMES.map(t => `
      <button type="button" class="sh-theme-btn ${t.id === savedBg ? 'active' : ''}" data-bg-theme="${t.id}" title="${t.label} Background">
        <span class="sh-theme-indicator"></span>
        <i class="${t.icon}"></i>
        <span>${t.label}</span>
      </button>
    `).join('');

    const paletteButtons = PALETTES.map(p => `
      <button type="button" class="sh-palette-btn ${p.id === savedPalette ? 'active' : ''}" data-palette="${p.id}" title="${p.label}" style="--swatch:${p.swatch}; --sub-swatch:${p.sub}">
        <span class="sh-swatch-split" style="background: linear-gradient(135deg, ${p.swatch} 50%, ${p.sub} 50%)"></span>
        <i class="${p.icon}"></i>
        <span>${p.label}</span>
      </button>
    `).join('');

    const container = document.createElement('div');
    container.id = 'sh-theme-switcher';
    container.setAttribute('aria-label', 'Theme Switcher');

    container.innerHTML = `
      <div class="sh-switcher-panel">
        <div class="sh-switcher-title">
          <i class="fa-solid fa-palette"></i>
          <span>Theme Preview</span>
        </div>
        <div class="sh-tabs">
          <button class="sh-tab active" data-tab="palette"><i class="fa-solid fa-swatchbook"></i> Color Palettes</button>
          <button class="sh-tab" data-tab="bg"><i class="fa-solid fa-image"></i> Background</button>
        </div>
        <div class="sh-tab-content" id="sh-tab-palette">
          ${paletteButtons}
        </div>
        <div class="sh-tab-content sh-hidden" id="sh-tab-bg">
          ${bgButtons}
        </div>
      </div>
      <button type="button" class="sh-switcher-toggle-btn" title="Toggle Theme Bar">
        <i class="fa-solid fa-palette"></i>
      </button>
    `;

    document.body.appendChild(container);

    // Tab switching
    container.querySelectorAll('.sh-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        container.querySelectorAll('.sh-tab').forEach(t => t.classList.remove('active'));
        container.querySelectorAll('.sh-tab-content').forEach(c => c.classList.add('sh-hidden'));
        tab.classList.add('active');
        const target = document.getElementById(`sh-tab-${tab.getAttribute('data-tab')}`);
        if (target) target.classList.remove('sh-hidden');
      });
    });

    // Background theme buttons
    container.querySelectorAll('[data-bg-theme]').forEach(btn => {
      btn.addEventListener('click', () => applyBgTheme(btn.getAttribute('data-bg-theme')));
    });

    // Palette buttons
    container.querySelectorAll('[data-palette]').forEach(btn => {
      btn.addEventListener('click', () => applyPalette(btn.getAttribute('data-palette')));
    });

    // Toggle open/close
    const toggleBtn = container.querySelector('.sh-switcher-toggle-btn');
    toggleBtn.addEventListener('click', () => {
      container.classList.toggle('collapsed');
      const isCollapsed = container.classList.contains('collapsed');
      toggleBtn.innerHTML = isCollapsed
        ? '<i class="fa-solid fa-palette"></i>'
        : '<i class="fa-solid fa-xmark"></i>';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThemeSwitcher);
  } else {
    initThemeSwitcher();
  }
})();
