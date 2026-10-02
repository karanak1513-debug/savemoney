/* ── LIGHT / DARK MODE ENGINE ─────────────────────────────── */
    (function() {
      var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      var savedTheme = localStorage.getItem('smm_theme');
      var isDark = savedTheme ? savedTheme === 'dark' : prefersDark;

      function applyTheme(dark) {
        var html = document.documentElement;
        var body = document.body;
        var overlay = document.getElementById('three-bg-overlay');
        var sunIcon = document.getElementById('theme-icon-sun');
        var moonIcon = document.getElementById('theme-icon-moon');
        var toggleBtn = document.getElementById('theme-toggle-btn');

        if (dark) {
          html.setAttribute('data-theme', 'dark');
          body.style.backgroundColor = '#040814';
          body.style.backgroundImage = 'none';
          body.style.color = '#F1F5F9';
          if (overlay) overlay.style.background = 'radial-gradient(circle at 50% 50%, rgba(4,8,20,0.05) 0%, rgba(4,8,20,0.28) 65%, rgba(2,5,15,0.65) 100%)';
          if (sunIcon) sunIcon.style.display = 'none';
          if (moonIcon) moonIcon.style.display = 'block';
          if (toggleBtn) {
            toggleBtn.style.background = 'rgba(15,23,42,0.55)';
            toggleBtn.style.borderColor = 'rgba(148,163,184,0.22)';
            toggleBtn.style.color = '#94A3B8';
          }
          var sBtnDark = document.getElementById('btn-celestial-settings');
          if (sBtnDark) {
            sBtnDark.style.background = 'rgba(15,23,42,0.55)';
            sBtnDark.style.borderColor = 'rgba(148,163,184,0.22)';
            sBtnDark.style.color = '#94A3B8';
          }
        } else {
          html.setAttribute('data-theme', 'light');
          body.style.backgroundColor = '#FFFFFF';
          body.style.backgroundImage = 'none';
          body.style.color = '#0B0F19';
          if (overlay) overlay.style.background = 'radial-gradient(circle at 50% 50%, rgba(248, 250, 252, 0.20) 0%, rgba(241, 245, 249, 0.55) 65%, rgba(226, 232, 240, 0.86) 100%)';
          if (sunIcon) sunIcon.style.display = 'block';
          if (moonIcon) moonIcon.style.display = 'none';
          if (toggleBtn) {
            toggleBtn.style.background = 'rgba(255,255,255,0.75)';
            toggleBtn.style.borderColor = 'rgba(226,232,240,0.9)';
            toggleBtn.style.color = '#475569';
          }
          var sBtnLight = document.getElementById('btn-celestial-settings');
          if (sBtnLight) {
            sBtnLight.style.background = 'rgba(255,255,255,0.75)';
            sBtnLight.style.borderColor = 'rgba(226,232,240,0.9)';
            sBtnLight.style.color = '#475569';
          }
        }
        localStorage.setItem('smm_theme', dark ? 'dark' : 'light');
        window.__smmIsDark = dark;
        if (window.__smmUpdateThreeTheme) window.__smmUpdateThreeTheme(dark);
      }

      // Apply immediately on first paint
      applyTheme(isDark);

      // Wire up toggle after DOM ready
      function wireToggle() {
        var btn = document.getElementById('theme-toggle-btn');
        if (btn) {
          btn.addEventListener('click', function() {
            var nowDark = document.documentElement.getAttribute('data-theme') !== 'dark';
            applyTheme(nowDark);
            // Update Three.js 3D renderer & particle colors
            if (window.__smmUpdateThreeTheme) window.__smmUpdateThreeTheme(nowDark);
          });
          btn.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.12) translateY(-1px)';
            this.style.boxShadow = '0 8px 28px rgba(37,99,235,0.28)';
          });
          btn.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '0 4px 18px rgba(0,0,0,0.18)';
          });
        }

        // 3D Celestial Settings Drawer Toggle
        var sBtn = document.getElementById('btn-celestial-settings');
        var sPanel = document.getElementById('celestial-settings-panel');
        var sClose = document.getElementById('btn-close-celestial-drawer');
        if (sBtn && sPanel) {
          sBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            sPanel.classList.toggle('open');
          });
          sBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.12) translateY(-1px)';
            this.style.boxShadow = '0 8px 28px rgba(37,99,235,0.28)';
          });
          sBtn.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '0 4px 18px rgba(0,0,0,0.18)';
          });
        }
        if (sClose && sPanel) {
          sClose.addEventListener('click', function() {
            sPanel.classList.remove('open');
          });
        }
        document.addEventListener('click', function(e) {
          if (sPanel && sPanel.classList.contains('open')) {
            if (!sPanel.contains(e.target) && e.target !== sBtn && !(sBtn && sBtn.contains(e.target))) {
              sPanel.classList.remove('open');
            }
          }
        });
        window.addEventListener('keydown', function(e) {
          if (e.key === 'Escape' && sPanel) sPanel.classList.remove('open');
        });

        // Dynamic Responsive Button Docking (Zero-Overlap Guarantee)
        syncControlButtonsPlacement();
        window.addEventListener('resize', syncControlButtonsPlacement);

        try {
          var viewObserver = new MutationObserver(function() {
            syncControlButtonsPlacement();
          });
          viewObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
          var dashEl = document.getElementById('dashboardContainer');
          if (dashEl) {
            viewObserver.observe(dashEl, { attributes: true, attributeFilter: ['style', 'class'] });
          }
          var authEl = document.getElementById('authContainer');
          if (authEl) {
            viewObserver.observe(authEl, { attributes: true, attributeFilter: ['style', 'class'] });
          }
        } catch (e) {}
      }

      function syncControlButtonsPlacement() {
        var sBtn = document.getElementById('btn-celestial-settings');
        var tBtn = document.getElementById('theme-toggle-btn');
        var deskSlot = document.getElementById('desktop-controls-slot');
        var mobDock = document.getElementById('mobile-controls-dock');
        var dashContainer = document.getElementById('dashboardContainer');

        if (!sBtn || !tBtn || !deskSlot || !mobDock) return;

        var isMobile = window.innerWidth < 768;
        var isDashActive = false;
        if (dashContainer) {
          if (document.documentElement.classList.contains('smm-has-session')) {
            isDashActive = dashContainer.style.display !== 'none';
          } else {
            var comp = window.getComputedStyle(dashContainer);
            isDashActive = comp.display !== 'none' && !dashContainer.classList.contains('hidden');
          }
        }

        if (isMobile && isDashActive) {
          if (sBtn.parentElement !== mobDock) {
            mobDock.appendChild(sBtn);
          }
          if (tBtn.parentElement !== mobDock) {
            mobDock.appendChild(tBtn);
          }
        } else {
          if (sBtn.parentElement !== deskSlot) {
            deskSlot.appendChild(sBtn);
          }
          if (tBtn.parentElement !== deskSlot) {
            deskSlot.appendChild(tBtn);
          }
        }
      }
      window.__syncControlButtonsPlacement = syncControlButtonsPlacement;

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', wireToggle);
      } else {
        wireToggle();
      }
    })();