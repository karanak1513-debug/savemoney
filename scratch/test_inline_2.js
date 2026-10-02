(function() {
      const loader = document.getElementById('app-opening-loader');
      const bar = document.getElementById('loader-progress-fill');
      const pct = document.getElementById('loader-percent');
      const statusText = document.getElementById('loader-status-text');
      if (!loader || !bar || !pct) return;

      const steps = [
        { p: 25, msg: "Igniting 3D Quantum Engine..." },
        { p: 55, msg: "Calibrating Orbital Shaders..." },
        { p: 85, msg: "Synchronizing Prismatic Vault..." },
        { p: 100, msg: "Hyper-Drive Ready · Entering Cockpit" }
      ];

      let current = 0;
      let stepIdx = 0;
      let triggeredWarp = false;

      function frame() {
        if (stepIdx < steps.length) {
          const target = steps[stepIdx];
          if (current < target.p) {
            current += Math.max(1, Math.round((target.p - current) * 0.28));
          } else {
            if (statusText) statusText.textContent = target.msg;
            stepIdx++;
          }
        } else {
          current = 100;
        }

        bar.style.width = current + '%';
        pct.textContent = current + '%';

        // Trigger Three.js camera fly-in warp right as we reach 75%
        if (current >= 75 && !triggeredWarp) {
          triggeredWarp = true;
          if (typeof window.__smmPlay3DIntro === 'function') {
            window.__smmPlay3DIntro();
          }
        }

        if (current < 100) {
          requestAnimationFrame(frame);
        } else {
          setTimeout(dismiss, 280);
        }
      }

      function dismiss() {
        if (!loader || loader.classList.contains('dissolved')) return;
        // Trigger 3D camera warp if not already triggered
        if (typeof window.__smmPlay3DIntro === 'function') {
          window.__smmPlay3DIntro();
        }
        loader.classList.add('dissolved');
        setTimeout(() => {
          loader.style.display = 'none';
          try { loader.remove(); } catch(e) {}
        }, 780);
      }

      requestAnimationFrame(frame);
      loader.addEventListener('click', dismiss);
      window.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') dismiss();
      }, { once: true });
      setTimeout(dismiss, 2200);
    })();