/**
 * Scriptor House - Live Metallic Theme Switcher
 * Allows real-time previewing and switching between metallic and luxury background styles.
 */

(function () {
  'use strict';

  const THEMES = [
    { id: 'theme-titanium', label: 'Titanium', icon: 'fa-solid fa-shield-halved' },
    { id: 'theme-obsidian', label: 'Obsidian', icon: 'fa-solid fa-gem' },
    { id: 'theme-chrome', label: 'Chrome', icon: 'fa-solid fa-wand-magic-sparkles' },
    { id: 'theme-carbon', label: 'Carbon Mesh', icon: 'fa-solid fa-layer-group' },
    { id: 'theme-bronze', label: 'Bronze Ore', icon: 'fa-solid fa-coins' },
    { id: 'theme-damask', label: 'Royal Filigree', icon: 'fa-solid fa-crown' },
    { id: 'theme-hexgrid', label: 'Hex Matrix', icon: 'fa-solid fa-cubes' },
    { id: 'theme-nebula', label: 'Cosmic Nebula', icon: 'fa-solid fa-meteor' },
    { id: 'theme-original', label: 'Original', icon: 'fa-solid fa-rotate-left' }
  ];

  function getActiveTheme() {
    for (const t of THEMES) {
      if (document.body.classList.contains(t.id)) {
        return t.id;
      }
    }
    const saved = localStorage.getItem('sh_preview_theme');
    if (saved && THEMES.some(t => t.id === saved)) {
      return saved;
    }
    return 'theme-titanium';
  }

  function applyTheme(themeId) {
    THEMES.forEach(t => document.body.classList.remove(t.id));
    document.body.classList.add(themeId);
    localStorage.setItem('sh_preview_theme', themeId);

    // Update active button state
    document.querySelectorAll('.sh-theme-btn').forEach(btn => {
      if (btn.getAttribute('data-theme') === themeId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  function initThemeSwitcher() {
    let activeTheme = '';
    for (const t of THEMES) {
      if (document.body.classList.contains(t.id)) {
        activeTheme = t.id;
        break;
      }
    }

    const saved = localStorage.getItem('sh_preview_theme');
    if (saved && THEMES.some(t => t.id === saved)) {
      activeTheme = saved;
    }

    if (activeTheme) {
      THEMES.forEach(t => document.body.classList.remove(t.id));
      document.body.classList.add(activeTheme);
    } else {
      activeTheme = 'theme-titanium';
      document.body.classList.add(activeTheme);
    }

    // Build switcher DOM
    const container = document.createElement('div');
    container.id = 'sh-theme-switcher';
    container.setAttribute('aria-label', 'Metallic Theme Switcher');

    let buttonsHtml = THEMES.map(t => `
      <button type="button" class="sh-theme-btn ${t.id === activeTheme ? 'active' : ''}" data-theme="${t.id}" title="${t.label} Background">
        <span class="sh-theme-indicator"></span>
        <i class="${t.icon}"></i>
        <span>${t.label}</span>
      </button>
    `).join('');

    container.innerHTML = `
      <div class="sh-switcher-panel">
        <div class="sh-switcher-title">
          <i class="fa-solid fa-palette"></i>
          <span>Theme Preview</span>
        </div>
        ${buttonsHtml}
      </div>
      <button type="button" class="sh-switcher-toggle-btn" title="Toggle Theme Bar">
        <i class="fa-solid fa-palette"></i>
      </button>
    `;

    document.body.appendChild(container);

    // Add event listeners
    container.querySelectorAll('.sh-theme-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const themeId = btn.getAttribute('data-theme');
        applyTheme(themeId);
      });
    });

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
