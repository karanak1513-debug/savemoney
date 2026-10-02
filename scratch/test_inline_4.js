(function() {
      // ── CSS Rising Particles ────────────────────────────────
      var pf = document.getElementById('css-particle-field');
      if (pf) {
        var colors = ['#2563EB','#7C3AED','#10B981','#EC4899','#F59E0B','#06B6D4','#A855F7'];
        for (var i = 0; i < 28; i++) {
          var p = document.createElement('div');
          p.className = 'css-particle';
          var size = Math.random() * 6 + 3;
          p.style.cssText = [
            'width:' + size + 'px',
            'height:' + size + 'px',
            'left:' + (Math.random() * 100) + 'vw',
            'background:' + colors[Math.floor(Math.random() * colors.length)],
            'opacity:' + (Math.random() * 0.5 + 0.2),
            'animation-duration:' + (Math.random() * 18 + 12) + 's',
            'animation-delay:' + (Math.random() * 20) + 's',
            'filter:blur(' + (Math.random() * 1.5) + 'px)'
          ].join(';');
          pf.appendChild(p);
        }
      }

      // ── Animated counter for stats ──────────────────────────
      function animateNum(el, end, prefix, suffix, duration) {
        if (!el) return;
        var start = 0; var startTime = null;
        function step(ts) {
          if (!startTime) startTime = ts;
          var prog = Math.min((ts - startTime) / duration, 1);
          var ease = 1 - Math.pow(1 - prog, 3);
          var val = Math.round(ease * end);
          el.textContent = (prefix || '') + val.toLocaleString('en-IN') + (suffix || '');
          if (prog < 1) requestAnimationFrame(step);
        }
        setTimeout(function() { requestAnimationFrame(step); }, 300);
      }
      animateNum(document.getElementById('stat-saved'),  24682, '₹', '', 2200);
      animateNum(document.getElementById('stat-vaults'), 4851,  '',  '', 2400);
      animateNum(document.getElementById('stat-streak'), 32,    '',  'd', 1800);

      // ── Cursor Spotlight ────────────────────────────────────
      var spot = document.getElementById('auth-spotlight');
      var authCont = document.getElementById('authContainer');
      if (spot && authCont) {
        window.addEventListener('mousemove', function(e) {
          spot.style.left = e.clientX + 'px';
          spot.style.top  = e.clientY + 'px';
        }, { passive: true });
      }

      // Dark mode headline color update
      function updateHeadline() {
        var h = document.getElementById('auth-headline');
        if (!h) return;
        var dark = document.documentElement.getAttribute('data-theme') === 'dark';
        h.style.color = dark ? '#F8FAFC' : '#0B0F19';
      }
      updateHeadline();
      var origApply = window.__smmApplyThemeOrig;
      // Patch: watch for theme attribute changes
      var themeObs = new MutationObserver(updateHeadline);
      themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    })();