(function() {

      const canvas = document.getElementById('three-bg-canvas');
      if (!canvas || typeof THREE === 'undefined') return;

      const scene = new THREE.Scene();

      // Cinematic Perspective Camera with Dramatic Oblique Celestial Angle
      const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 3000);
      camera.position.set(0, 8.5, 26.0);
      camera.lookAt(0, -1.0, 0);

      const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.62;

      // Master Cosmos Root & Tilted Solar System Plane
      const universeRoot = new THREE.Group();
      scene.add(universeRoot);

      const solarSystemGroup = new THREE.Group();
      solarSystemGroup.rotation.x = 0.38; // 22-degree celestial plane tilt for dramatic depth
      universeRoot.add(solarSystemGroup);

      // Fast 2D Perlin / Value Noise & Fractal Brownian Motion (fBM) Engine
      function createNoise2D() {
        const perm = new Uint8Array(512);
        const p = new Uint8Array(256);
        for (let i = 0; i < 256; i++) p[i] = i;
        for (let i = 255; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          const tmp = p[i]; p[i] = p[j]; p[j] = tmp;
        }
        for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
        function lerp(a, b, t) { return a + t * (b - a); }
        function grad(hash, x, y) {
          const h = hash & 7;
          const u = h < 4 ? x : y;
          const v = h < 4 ? y : x;
          return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
        }
        return function noise(x, y) {
          const X = Math.floor(x) & 255;
          const Y = Math.floor(y) & 255;
          const xf = x - Math.floor(x);
          const yf = y - Math.floor(y);
          const u = xf * xf * xf * (xf * (xf * 6 - 15) + 10);
          const v = yf * yf * yf * (yf * (yf * 6 - 15) + 10);
          const a = perm[X] + Y;
          const aa = perm[a], ab = perm[a + 1];
          const b = perm[X + 1] + Y;
          const ba = perm[b], bb = perm[b + 1];
          const x1 = lerp(grad(perm[aa], xf, yf), grad(perm[ba], xf - 1, yf), u);
          const x2 = lerp(grad(perm[ab], xf, yf - 1), grad(perm[bb], xf - 1, yf - 1), u);
          return (lerp(x1, x2, v) + 1) * 0.5;
        };
      }

      const n2d = createNoise2D();
      function fbm(x, y, oct = 4) {
        let v = 0, a = 0.5, f = 1, m = 0;
        for (let i = 0; i < oct; i++) {
          v += n2d(x * f, y * f) * a;
          m += a;
          a *= 0.5;
          f *= 2.0;
        }
        return v / m;
      }

      // Helper for offscreen canvas textures
      function makeTexture(w, h, renderFn) {
        const c = document.createElement('canvas');
        c.width = w;
        c.height = h;
        const ctx = c.getContext('2d');
        renderFn(ctx, w, h);
        const tex = new THREE.CanvasTexture(c);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.ClampToEdgeWrapping;
        return tex;
      }

      // Soft circular particle sprite generator for glowing stars and nebulae
      function makeGlowSpriteTexture(colorRgb) {
        const c = document.createElement('canvas');
        c.width = 64; c.height = 64;
        const ctx = c.getContext('2d');
        const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        grad.addColorStop(0, `rgba(${colorRgb}, 1.0)`);
        grad.addColorStop(0.25, `rgba(${colorRgb}, 0.55)`);
        grad.addColorStop(0.6, `rgba(${colorRgb}, 0.15)`);
        grad.addColorStop(1, `rgba(${colorRgb}, 0.0)`);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 64, 64);
        return new THREE.CanvasTexture(c);
      }

      // ─────────────────────────────────────────────────────────────
      // 1. PHOTOREALISTIC PROCEDURAL TEXTURE GENERATION
      // ─────────────────────────────────────────────────────────────

      // A. THE SUN: Granulation, Boiling Plasma & Sunspot Penumbras (1024x512)
      const sunTexture = makeTexture(1024, 512, (ctx, w, h) => {
        const img = ctx.createImageData(w, h);
        const d = img.data;
        for (let y = 0; y < h; y++) {
          const lat = Math.sin((y / h) * Math.PI);
          for (let x = 0; x < w; x++) {
            const idx = (y * w + x) * 4;
            const n1 = fbm(x * 0.025, y * 0.025, 4);
            const n2 = fbm(x * 0.08, y * 0.08, 2);
            const heat = n1 * 0.7 + n2 * 0.3;
            // Hot golden convection cells with deeper fiery red borders
            d[idx]     = Math.min(255, Math.floor(255 * (0.85 + heat * 0.2)));
            d[idx + 1] = Math.min(255, Math.floor(140 + heat * 115 * lat));
            d[idx + 2] = Math.min(255, Math.floor(10 + heat * heat * 180));
            d[idx + 3] = 255;
          }
        }
        ctx.putImageData(img, 0, 0);

        // Sunspot Active Clusters (Dark umbra with striated penumbra)
        const spots = [
          { x: 0.25, y: 0.42, r: 12 }, { x: 0.28, y: 0.45, r: 8 },
          { x: 0.55, y: 0.38, r: 16 }, { x: 0.59, y: 0.40, r: 10 },
          { x: 0.82, y: 0.58, r: 14 }, { x: 0.86, y: 0.60, r: 7 }
        ];
        spots.forEach(sp => {
          const sx = sp.x * w, sy = sp.y * h;
          // Penumbra (brownish-orange border)
          const pGrad = ctx.createRadialGradient(sx, sy, sp.r * 0.5, sx, sy, sp.r * 2.2);
          pGrad.addColorStop(0, 'rgba(154, 52, 18, 0.95)');
          pGrad.addColorStop(1, 'rgba(234, 88, 12, 0)');
          ctx.fillStyle = pGrad;
          ctx.beginPath();
          ctx.arc(sx, sy, sp.r * 2.2, 0, Math.PI * 2);
          ctx.fill();
          // Umbra (dark magnetic core)
          ctx.fillStyle = '#260606';
          ctx.beginPath();
          ctx.ellipse(sx, sy, sp.r, sp.r * 0.75, 0.2, 0, Math.PI * 2);
          ctx.fill();
        });
      });

      // B. MERCURY: Heavily Cratered Basalt Highlands (512x256)
      const mercuryTexture = makeTexture(512, 256, (ctx, w, h) => {
        ctx.fillStyle = '#4B5563';
        ctx.fillRect(0, 0, w, h);
        // Basalt terrain noise
        for (let i = 0; i < 900; i++) {
          ctx.fillStyle = Math.random() > 0.5 ? 'rgba(31, 41, 55, 0.3)' : 'rgba(156, 163, 175, 0.25)';
          ctx.fillRect(Math.random() * w, Math.random() * h, 3 + Math.random() * 8, 3 + Math.random() * 8);
        }
        // 140+ Impact Craters with sunlit rims & shadow floors
        for (let i = 0; i < 140; i++) {
          const cx = Math.random() * w, cy = Math.random() * h, cr = 1.8 + Math.random() * 8;
          ctx.beginPath();
          ctx.arc(cx, cy, cr, 0, Math.PI * 2);
          ctx.fillStyle = '#1E293B';
          ctx.fill();
          ctx.lineWidth = 1.3;
          ctx.strokeStyle = '#E2E8F0';
          ctx.stroke();
          // Ejecta rays for prominent craters
          if (cr > 5.5) {
            ctx.strokeStyle = 'rgba(241, 245, 249, 0.35)';
            ctx.lineWidth = 0.8;
            for (let r = 0; r < 6; r++) {
              const ang = (r / 6) * Math.PI * 2;
              ctx.beginPath();
              ctx.moveTo(cx, cy);
              ctx.lineTo(cx + Math.cos(ang) * (cr * 3.5), cy + Math.sin(ang) * (cr * 3.5));
              ctx.stroke();
            }
          }
        }
      });

      // C. VENUS: Sulfuric Acid Atmosphere with UV Chevron Waves (1024x512)
      const venusTexture = makeTexture(1024, 512, (ctx, w, h) => {
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, '#B45309');
        grad.addColorStop(0.2, '#D97706');
        grad.addColorStop(0.5, '#FDE68A');
        grad.addColorStop(0.8, '#D97706');
        grad.addColorStop(1, '#92400E');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
        // Planetary Chevron waves
        for (let y = 0; y < h; y += 4) {
          const wave = Math.sin(y * 0.08) * 12;
          ctx.fillStyle = `rgba(245, 158, 11, ${0.08 + Math.sin(y * 0.05) * 0.05})`;
          ctx.fillRect(0, y + wave, w, 3);
        }
      });

      // D. EARTH: High-Fidelity Continents, Biomes & Specular Oceans (2048x1024)
      const earthTexture = makeTexture(2048, 1024, (ctx, w, h) => {
        // Deep Abyssal Ocean Base
        const oceanGrad = ctx.createRadialGradient(w/2, h/2, 100, w/2, h/2, w/2);
        oceanGrad.addColorStop(0, '#0284C7');
        oceanGrad.addColorStop(0.5, '#0369A1');
        oceanGrad.addColorStop(1, '#0C2540');
        ctx.fillStyle = oceanGrad;
        ctx.fillRect(0, 0, w, h);

        function drawPath(pts, fill, stroke) {
          ctx.beginPath();
          ctx.moveTo(pts[0][0] * w, pts[0][1] * h);
          for (let i = 1; i < pts.length; i++) {
            ctx.lineTo(pts[i][0] * w, pts[i][1] * h);
          }
          ctx.closePath();
          if (fill) { ctx.fillStyle = fill; ctx.fill(); }
          if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1.5; ctx.stroke(); }
        }

        // Continental Shelf Turquoise Coastal Shallows (Cyan glow around landmasses)
        const coastalCyan = 'rgba(6, 182, 212, 0.45)';

        // 1. North America (Alaska, Canada, USA, Mexico)
        const na = [
          [0.06, 0.18], [0.12, 0.14], [0.20, 0.14], [0.27, 0.22], [0.28, 0.32],
          [0.24, 0.40], [0.21, 0.44], [0.18, 0.45], [0.14, 0.38], [0.08, 0.34], [0.05, 0.26]
        ];
        drawPath(na, '#15803D', coastalCyan);
        // Rocky Mountain snow peaks
        drawPath([[0.12, 0.22], [0.16, 0.20], [0.18, 0.32], [0.14, 0.36]], '#F1F5F9');

        // 2. South America (Amazon Basin, Andes, Patagonia)
        const sa = [
          [0.21, 0.46], [0.30, 0.48], [0.34, 0.56], [0.32, 0.72], [0.26, 0.86],
          [0.22, 0.88], [0.20, 0.74], [0.19, 0.58], [0.19, 0.48]
        ];
        drawPath(sa, '#166534', coastalCyan);
        // Amazon lush deep rainforest
        drawPath([[0.23, 0.52], [0.30, 0.54], [0.28, 0.65], [0.22, 0.62]], '#14532D');

        // 3. Eurasia & Europe
        const eurasia = [
          [0.38, 0.18], [0.46, 0.15], [0.60, 0.14], [0.75, 0.16], [0.88, 0.22],
          [0.86, 0.38], [0.78, 0.44], [0.68, 0.45], [0.58, 0.42], [0.48, 0.38],
          [0.38, 0.34], [0.36, 0.24]
        ];
        drawPath(eurasia, '#15803D', coastalCyan);
        // Himalayas mountain snow spine
        drawPath([[0.66, 0.34], [0.76, 0.32], [0.75, 0.36], [0.65, 0.37]], '#FFFFFF');
        // Gobi Desert
        drawPath([[0.68, 0.28], [0.76, 0.26], [0.78, 0.32], [0.70, 0.34]], '#D97706');

        // 4. Africa & Sahara Golden Desert
        const africa = [
          [0.43, 0.36], [0.56, 0.37], [0.60, 0.48], [0.58, 0.64], [0.52, 0.76],
          [0.47, 0.74], [0.43, 0.60], [0.40, 0.48], [0.41, 0.38]
        ];
        drawPath(africa, '#65A30D', coastalCyan);
        // Vast Sahara Desert (Golden Ochre)
        drawPath([[0.42, 0.37], [0.56, 0.38], [0.55, 0.48], [0.41, 0.47]], '#D97706');
        // Congo Rainforest
        drawPath([[0.45, 0.52], [0.54, 0.53], [0.52, 0.64], [0.44, 0.62]], '#14532D');

        // 5. Australia & New Zealand
        const aus = [
          [0.74, 0.60], [0.86, 0.62], [0.87, 0.78], [0.75, 0.78], [0.72, 0.68]
        ];
        drawPath(aus, '#15803D', coastalCyan);
        // Red Outback Center
        drawPath([[0.76, 0.64], [0.84, 0.65], [0.83, 0.74], [0.75, 0.72]], '#B45309');

        // 6. Madagascar, Japan, UK
        drawPath([[0.61, 0.64], [0.63, 0.66], [0.61, 0.74], [0.59, 0.72]], '#15803D'); // Madagascar
        drawPath([[0.88, 0.28], [0.90, 0.34], [0.89, 0.38], [0.87, 0.32]], '#15803D'); // Japan
        drawPath([[0.40, 0.22], [0.42, 0.24], [0.41, 0.28], [0.39, 0.26]], '#15803D'); // UK

        // 7. Polar Glacial Ice Caps (Pure White)
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, w, h * 0.08); // Arctic
        ctx.fillRect(0, h * 0.90, w, h * 0.10); // Antarctica
      });

      // E. EARTH DYNAMIC WEATHER FRONT & CLOUD CYCLONES (2048x1024)
      const cloudsTexture = makeTexture(2048, 1024, (ctx, w, h) => {
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.78)';
        // Trade wind cloud bands
        for (let i = 0; i < 380; i++) {
          const cx = Math.random() * w;
          const cy = h * 0.15 + Math.random() * (h * 0.70);
          const len = 35 + Math.random() * 110;
          ctx.beginPath();
          ctx.ellipse(cx, cy, len, 4 + Math.random() * 10, (Math.random() - 0.5) * 0.2, 0, Math.PI * 2);
          ctx.fill();
        }
        // Realistic Tropical Cyclones with Spiral Feeder Arms
        function drawCyclone(cx, cy, r) {
          ctx.save();
          ctx.translate(cx, cy);
          for (let a = 0; a < Math.PI * 4; a += 0.15) {
            const dist = (a / (Math.PI * 4)) * r;
            const px = Math.cos(a) * dist;
            const py = Math.sin(a) * dist;
            ctx.beginPath();
            ctx.arc(px, py, 4 + dist * 0.10, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
            ctx.fill();
          }
          ctx.restore();
        }
        drawCyclone(w * 0.26, h * 0.32, 60); // Caribbean Hurricane
        drawCyclone(w * 0.78, h * 0.38, 72); // Pacific Typhoon
      });

      // F. MARS: Rusted Iron Oxide, Syrtis Major & Valles Marineris (1024x512)
      const marsTexture = makeTexture(1024, 512, (ctx, w, h) => {
        ctx.fillStyle = '#C2410C';
        ctx.fillRect(0, 0, w, h);
        // Basaltic dark provinces (Syrtis Major & Acidalia Planitia)
        ctx.fillStyle = 'rgba(69, 26, 3, 0.55)';
        ctx.beginPath();
        ctx.ellipse(w * 0.65, h * 0.44, 130, 75, 0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(w * 0.28, h * 0.35, 110, 60, -0.1, 0, Math.PI * 2);
        ctx.fill();
        // Valles Marineris Grand Canyon Chasm
        ctx.beginPath();
        ctx.moveTo(w * 0.25, h * 0.52);
        ctx.bezierCurveTo(w * 0.40, h * 0.56, w * 0.52, h * 0.48, w * 0.68, h * 0.53);
        ctx.lineWidth = 6;
        ctx.strokeStyle = '#450A0A';
        ctx.stroke();
        // Olympus Mons Caldera
        ctx.beginPath();
        ctx.arc(w * 0.22, h * 0.46, 24, 0, Math.PI * 2);
        ctx.fillStyle = '#9A3412';
        ctx.fill();
        ctx.strokeStyle = '#7C2D12';
        ctx.lineWidth = 3;
        ctx.stroke();
        // White Polar Ice Caps
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, w, h * 0.07);
        ctx.fillRect(0, h * 0.92, w, h * 0.08);
      });

      // G. JUPITER: 24 Atmospheric Jet Belts & Swirling Great Red Spot (2048x1024)
      const jupiterTexture = makeTexture(2048, 1024, (ctx, w, h) => {
        const bands = [
          '#78350F', '#92400E', '#B45309', '#FDE68A', '#FEF3C7', '#D97706',
          '#78350F', '#B45309', '#FDE68A', '#FEF3C7', '#B45309', '#92400E',
          '#D97706', '#FDE68A', '#FEF3C7', '#B45309', '#78350F', '#92400E'
        ];
        const bandH = h / bands.length;
        bands.forEach((col, i) => {
          ctx.fillStyle = col;
          ctx.fillRect(0, i * bandH, w, bandH);
          // Wave turbulence at shear interfaces
          ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
          for (let x = 0; x < w; x += 10) {
            const offset = Math.sin(x * 0.04 + i * 2) * 5;
            ctx.fillRect(x, i * bandH + offset, 10, 4);
          }
        });
        // The Great Red Spot
        const sx = w * 0.62, sy = h * 0.65;
        // Outer turbulent halo
        ctx.beginPath();
        ctx.ellipse(sx, sy, 90, 52, -0.05, 0, Math.PI * 2);
        ctx.fillStyle = '#EA580C';
        ctx.fill();
        // Swirling internal crimson eye
        ctx.beginPath();
        ctx.ellipse(sx, sy, 58, 32, -0.05, 0, Math.PI * 2);
        ctx.fillStyle = '#991B1B';
        ctx.fill();
      });

      // H. SATURN BODY: Butterscotch & Gold Bands (1024x512)
      const saturnTexture = makeTexture(1024, 512, (ctx, w, h) => {
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, '#92400E');
        grad.addColorStop(0.2, '#B45309');
        grad.addColorStop(0.4, '#FDE68A');
        grad.addColorStop(0.6, '#F59E0B');
        grad.addColorStop(0.8, '#FDE68A');
        grad.addColorStop(1, '#78350F');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
        for (let y = 0; y < h; y += 4) {
          ctx.fillStyle = `rgba(180, 83, 9, ${0.06 + Math.sin(y * 0.08) * 0.04})`;
          ctx.fillRect(0, y, w, 2.5);
        }
      });

      // I. SATURN RINGS: Radial Map with Cassini Division & Encke Gap (2048x32)
      const saturnRingTexture = makeTexture(2048, 32, (ctx, w, h) => {
        const imgData = ctx.createImageData(w, h);
        const d = imgData.data;
        for (let x = 0; x < w; x++) {
          const t = x / w; // 0 (inner) to 1 (outer)
          let alpha = 0.88, r = 250, g = 220, b = 160;

          // Ring C (Crepe Ring, faint inner)
          if (t < 0.24) {
            alpha = 0.35 * (t / 0.24);
            r = 180; g = 145; b = 95;
          }
          // Ring B (Brilliant, dense, high opacity)
          else if (t >= 0.24 && t < 0.62) {
            const ripple = Math.sin(t * 220) * 0.08;
            alpha = 0.92 + ripple;
            r = 255; g = 235; b = 180;
          }
          // Cassini Division (Authentic transparent dark gap)
          else if (t >= 0.62 && t < 0.68) {
            alpha = 0.03;
          }
          // Ring A (with Encke division)
          else if (t >= 0.68 && t < 0.92) {
            if (t > 0.83 && t < 0.85) {
              alpha = 0.06; // Encke Gap
            } else {
              alpha = 0.75 + Math.sin(t * 140) * 0.07;
              r = 238; g = 210; b = 155;
            }
          }
          // Outer edge taper
          else {
            alpha = 0.40 * (1 - (t - 0.92) / 0.08);
          }

          for (let y = 0; y < h; y++) {
            const idx = (y * w + x) * 4;
            d[idx] = r; d[idx + 1] = g; d[idx + 2] = b;
            d[idx + 3] = Math.floor(Math.max(0, Math.min(255, alpha * 255)));
          }
        }
        ctx.putImageData(imgData, 0, 0);
      });

      // J. URANUS & NEPTUNE
      const uranusTexture = makeTexture(512, 256, (ctx, w, h) => {
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, '#0891B2');
        grad.addColorStop(0.5, '#67E8F9');
        grad.addColorStop(1, '#0E7490');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      });

      const neptuneTexture = makeTexture(1024, 512, (ctx, w, h) => {
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, '#1E3A8A');
        grad.addColorStop(0.4, '#2563EB');
        grad.addColorStop(0.7, '#1D4ED8');
        grad.addColorStop(1, '#172554');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
        // Great Dark Spot
        ctx.beginPath();
        ctx.ellipse(w * 0.56, h * 0.48, 55, 30, 0.1, 0, Math.PI * 2);
        ctx.fillStyle = '#0F172A';
        ctx.fill();
        // White methane cirrus storms ("Scooter")
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillRect(w * 0.50, h * 0.54, 70, 3.5);
      });

      // ─────────────────────────────────────────────────────────────
      // 2. CELESTIAL LIGHTING: AUTHENTIC SOLAR ILLUMINATION & SHADOWS
      // ─────────────────────────────────────────────────────────────
      // Authentic deep-space ambient light: low so planets have dramatic sunlit crescents
      const ambientLight = new THREE.AmbientLight(0x0F172A, 0.45);
      scene.add(ambientLight);

      // Central Solar PointLight: blazing sun energy illuminating planetary day sides
      const sunLight = new THREE.PointLight(0xFFFBEB, 8.5, 220, 0.9);
      sunLight.position.set(0, 0, 0);
      solarSystemGroup.add(sunLight);

      // Distant Interstellar Cosmic Starlight Fill
      const cosmicFillLight = new THREE.DirectionalLight(0x38BDF8, 0.45);
      cosmicFillLight.position.set(30, 35, 25);
      scene.add(cosmicFillLight);

      // ─────────────────────────────────────────────────────────────
      // 3. DEEP SPACE UNIVERSE: 4 NEBULAE, MILKY WAY & 4,200 STARS
      // ─────────────────────────────────────────────────────────────

      // A. 4 Volumetric Interstellar Nebulae (Glow particle clusters in deep space)
      const nebulaConfigs = [
        { color: '168, 85, 247', pos: [-60, 35, -70], count: 80, scale: 32 },  // Orion Magenta Nebula
        { color: '6, 182, 212',  pos: [70, -25, -60], count: 90, scale: 36 },  // Lagoon Cyan Nebula
        { color: '244, 63, 94',  pos: [-45, -30, -50], count: 70, scale: 28 }, // Rosette Nebula
        { color: '245, 158, 11', pos: [55, 40, -80], count: 60, scale: 30 }   // Amber Stellar Dust
      ];

      nebulaConfigs.forEach(neb => {
        const spriteTex = makeGlowSpriteTexture(neb.color);
        const nebGeo = new THREE.BufferGeometry();
        const nPos = new Float32Array(neb.count * 3);
        for (let i = 0; i < neb.count; i++) {
          nPos[i * 3]     = neb.pos[0] + (Math.random() - 0.5) * neb.scale;
          nPos[i * 3 + 1] = neb.pos[1] + (Math.random() - 0.5) * (neb.scale * 0.7);
          nPos[i * 3 + 2] = neb.pos[2] + (Math.random() - 0.5) * neb.scale;
        }
        nebGeo.setAttribute('position', new THREE.BufferAttribute(nPos, 3));
        const nebMat = new THREE.PointsMaterial({
          map: spriteTex,
          size: 14.0,
          transparent: true,
          opacity: 0.35,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        });
        scene.add(new THREE.Points(nebGeo, nebMat));
      });

      // B. Arching Milky Way Galactic Core (2,200 stars with dense golden bulge)
      const mwCount = 2200;
      const mwGeo = new THREE.BufferGeometry();
      const mwPos = new Float32Array(mwCount * 3);
      const mwColors = new Float32Array(mwCount * 3);

      for (let i = 0; i < mwCount; i++) {
        const angle = (i / mwCount) * Math.PI * 2;
        const spread = (Math.random() - 0.5) * 16;
        const dist = 85 + Math.random() * 30;

        mwPos[i * 3]     = Math.cos(angle) * dist + (Math.random() - 0.5) * 8;
        mwPos[i * 3 + 1] = Math.sin(angle) * 38 + spread;
        mwPos[i * 3 + 2] = Math.sin(angle) * dist + (Math.random() - 0.5) * 10;

        const isCore = Math.abs(angle - Math.PI) < 0.5;
        if (isCore) {
          mwColors[i * 3]     = 1.0;
          mwColors[i * 3 + 1] = 0.88;
          mwColors[i * 3 + 2] = 0.65;
        } else {
          mwColors[i * 3]     = 0.60;
          mwColors[i * 3 + 1] = 0.80;
          mwColors[i * 3 + 2] = 1.0;
        }
      }
      mwGeo.setAttribute('position', new THREE.BufferAttribute(mwPos, 3));
      mwGeo.setAttribute('color', new THREE.BufferAttribute(mwColors, 3));
      const mwMat = new THREE.PointsMaterial({
        size: 0.18,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending
      });
      scene.add(new THREE.Points(mwGeo, mwMat));

      // C. 4,200 Twinkling Multi-Spectral Background Stars
      const starCount = 4200;
      const starGeo = new THREE.BufferGeometry();
      const starPos = new Float32Array(starCount * 3);
      const starCols = new Float32Array(starCount * 3);
      const starPhases = new Float32Array(starCount); // For individual scintillation/twinkle

      const spectralClasses = [
        [1.0, 1.0, 1.0],      // Class A: Diamond White
        [0.45, 0.75, 1.0],    // Class B: Blue Supergiant
        [0.35, 0.95, 0.98],   // Class O: Cyan Hot Star
        [1.0, 0.88, 0.45],    // Class G: Golden Sun
        [1.0, 0.45, 0.40]     // Class M: Red Dwarf
      ];

      for (let i = 0; i < starCount; i++) {
        const rad = 70 + Math.random() * 110;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);

        starPos[i * 3]     = rad * Math.sin(phi) * Math.cos(theta);
        starPos[i * 3 + 1] = rad * Math.sin(phi) * Math.sin(theta);
        starPos[i * 3 + 2] = rad * Math.cos(phi);

        const col = spectralClasses[Math.floor(Math.random() * spectralClasses.length)];
        starCols[i * 3]     = col[0];
        starCols[i * 3 + 1] = col[1];
        starCols[i * 3 + 2] = col[2];
        starPhases[i] = Math.random() * Math.PI * 2;
      }
      starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
      starGeo.setAttribute('color', new THREE.BufferAttribute(starCols, 3));
      const starMat = new THREE.PointsMaterial({
        size: 0.13,
        vertexColors: true,
        transparent: true,
        opacity: 0.92,
        blending: THREE.AdditiveBlending
      });
      const starField = new THREE.Points(starGeo, starMat);
      scene.add(starField);

      // D. 8 Brilliant Diffraction-Spike Foreground Stars
      const crossTex = (function() {
        const c = document.createElement('canvas');
        c.width = 64; c.height = 64;
        const ctx = c.getContext('2d');
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(31, 0, 2, 64);
        ctx.fillRect(0, 31, 64, 2);
        const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 16);
        grad.addColorStop(0, 'rgba(255,255,255,1)');
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(32, 32, 16, 0, Math.PI * 2); ctx.fill();
        return new THREE.CanvasTexture(c);
      })();

      const spikeGeo = new THREE.BufferGeometry();
      const spikePos = new Float32Array(8 * 3);
      for (let i = 0; i < 8; i++) {
        const ang = (i / 8) * Math.PI * 2;
        const d = 55 + Math.random() * 20;
        spikePos[i * 3]     = Math.cos(ang) * d;
        spikePos[i * 3 + 1] = ((i % 2 === 0 ? 1 : -1) * 22) + Math.random() * 10;
        spikePos[i * 3 + 2] = Math.sin(ang) * d;
      }
      spikeGeo.setAttribute('position', new THREE.BufferAttribute(spikePos, 3));
      const spikeMat = new THREE.PointsMaterial({
        map: crossTex,
        size: 2.2,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending
      });
      scene.add(new THREE.Points(spikeGeo, spikeMat));

      // ─────────────────────────────────────────────────────────────
      // 4. CENTRAL STELLAR SUN (WITH CORONA & PROMINENCE LOOPS)
      // ─────────────────────────────────────────────────────────────
      const sunGroup = new THREE.Group();
      solarSystemGroup.add(sunGroup);

      // Photorealistic Sun Sphere
      const sunMesh = new THREE.Mesh(
        new THREE.SphereGeometry(1.60, 64, 64),
        new THREE.MeshBasicMaterial({ map: sunTexture })
      );
      sunGroup.add(sunMesh);

      // Inner Corona Glow Shell
      const coronaInner = new THREE.Mesh(
        new THREE.SphereGeometry(1.85, 36, 36),
        new THREE.MeshBasicMaterial({
          color: 0xF59E0B,
          transparent: true,
          opacity: 0.45,
          side: THREE.BackSide,
          blending: THREE.AdditiveBlending
        })
      );
      sunGroup.add(coronaInner);

      // Outer Solar Atmosphere Aura
      const coronaOuter = new THREE.Mesh(
        new THREE.SphereGeometry(2.30, 32, 32),
        new THREE.MeshBasicMaterial({
          color: 0xEF4444,
          transparent: true,
          opacity: 0.25,
          side: THREE.BackSide,
          blending: THREE.AdditiveBlending
        })
      );
      sunGroup.add(coronaOuter);

      // 4 Magnetic Prominence Flare Arches (Rotating loops)
      const flareLoops = [];
      for (let i = 0; i < 4; i++) {
        const fGeo = new THREE.TorusGeometry(1.65 + i * 0.15, 0.045, 16, 64, Math.PI * 0.70);
        const fMat = new THREE.MeshBasicMaterial({
          color: i % 2 === 0 ? 0xFBBF24 : 0xEF4444,
          transparent: true,
          opacity: 0.70,
          blending: THREE.AdditiveBlending
        });
        const fMesh = new THREE.Mesh(fGeo, fMat);
        fMesh.rotation.x = Math.random() * Math.PI;
        fMesh.rotation.y = Math.random() * Math.PI;
        sunGroup.add(fMesh);
        flareLoops.push(fMesh);
      }

      // Radiating Coronal Shockwave Rings
      const sunPulseRings = [];
      for (let i = 0; i < 2; i++) {
        const ring = new THREE.Mesh(
          new THREE.RingGeometry(1.80, 2.10, 64),
          new THREE.MeshBasicMaterial({
            color: 0xFDE047,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.0,
            blending: THREE.AdditiveBlending
          })
        );
        ring.rotation.x = Math.PI / 2;
        sunGroup.add(ring);
        sunPulseRings.push({ mesh: ring, offset: i * 1.5 });
      }

      // Solar Wind Particle Stream (180 energy photons radiating outward)
      const swCount = 180;
      const swGeo = new THREE.BufferGeometry();
      const swPos = new Float32Array(swCount * 3);
      const swVel = [];
      for (let i = 0; i < swCount; i++) {
        const v = new THREE.Vector3(
          (Math.random() - 0.5),
          (Math.random() - 0.5) * 0.4,
          (Math.random() - 0.5)
        ).normalize().multiplyScalar(1.6 + Math.random() * 12);
        swPos[i * 3]     = v.x;
        swPos[i * 3 + 1] = v.y;
        swPos[i * 3 + 2] = v.z;
        swVel.push(v.clone().normalize().multiplyScalar(0.04 + Math.random() * 0.03));
      }
      swGeo.setAttribute('position', new THREE.BufferAttribute(swPos, 3));
      const swMat = new THREE.PointsMaterial({
        color: 0xFDE047,
        size: 0.12,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending
      });
      const solarWind = new THREE.Points(swGeo, swMat);
      solarSystemGroup.add(solarWind);

      // ─────────────────────────────────────────────────────────────
      // 5. PLANETARY ORBIT TRACKS (WITH TRAVELING ENERGY PHOTONS)
      // ─────────────────────────────────────────────────────────────
      function makeOrbitTrack(radius, colorHex, opacity) {
        const pts = [];
        const segs = 140;
        for (let i = 0; i <= segs; i++) {
          const theta = (i / segs) * Math.PI * 2;
          pts.push(new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius));
        }
        const geo = new THREE.BufferGeometry().setFromPoints(pts);
        const mat = new THREE.LineBasicMaterial({
          color: colorHex,
          transparent: true,
          opacity: opacity,
          blending: THREE.AdditiveBlending
        });
        return new THREE.Line(geo, mat);
      }

      // ─────────────────────────────────────────────────────────────
      // 6. PHOTOREALISTIC PLANETS & MOONS
      // ─────────────────────────────────────────────────────────────
      const planets = [];

      const planetDefinitions = [
        { name: 'Mercury', dist: 3.2, size: 0.22, speed: 1.55, rot: 0.02,  map: mercuryTexture, rough: 0.85, metal: 0.25, orbitColor: 0x94A3B8, orbitOp: 0.32 },
        { name: 'Venus',   dist: 4.8, size: 0.36, speed: 1.12, rot: -0.015, map: venusTexture,   rough: 0.35, metal: 0.15, orbitColor: 0xF59E0B, orbitOp: 0.35, isVenus: true },
        { name: 'Earth',   dist: 6.8, size: 0.42, speed: 0.85, rot: 0.025,  map: earthTexture,   rough: 0.28, metal: 0.25, orbitColor: 0x38BDF8, orbitOp: 0.42, isEarth: true },
        { name: 'Mars',    dist: 8.8, size: 0.30, speed: 0.68, rot: 0.022,  map: marsTexture,    rough: 0.80, metal: 0.20, orbitColor: 0xF87171, orbitOp: 0.32, isMars: true },
        { name: 'Jupiter', dist: 13.0, size: 0.90, speed: 0.40, rot: 0.035, map: jupiterTexture, rough: 0.40, metal: 0.10, orbitColor: 0xFBBF24, orbitOp: 0.35, isJupiter: true },
        { name: 'Saturn',  dist: 16.8, size: 0.75, speed: 0.30, rot: 0.030, map: saturnTexture,  rough: 0.35, metal: 0.15, orbitColor: 0xFCD34D, orbitOp: 0.35, isSaturn: true },
        { name: 'Uranus',  dist: 20.4, size: 0.50, speed: 0.20, rot: 0.020, map: uranusTexture,  rough: 0.25, metal: 0.20, orbitColor: 0x22D3EE, orbitOp: 0.30, isUranus: true },
        { name: 'Neptune', dist: 23.8, size: 0.48, speed: 0.15, rot: 0.022, map: neptuneTexture, rough: 0.20, metal: 0.20, orbitColor: 0x60A5FA, orbitOp: 0.28, isNeptune: true }
      ];

      planetDefinitions.forEach(def => {
        // Orbit line
        solarSystemGroup.add(makeOrbitTrack(def.dist, def.orbitColor, def.orbitOp));

        // Planet Pivot Group
        const pivot = new THREE.Group();
        solarSystemGroup.add(pivot);

        // Planet Body
        const pGeo = new THREE.SphereGeometry(def.size, 48, 48);
        const pMat = new THREE.MeshStandardMaterial({
          map: def.map,
          roughness: def.rough,
          metalness: def.metal
        });
        const pMesh = new THREE.Mesh(pGeo, pMat);
        pMesh.position.x = def.dist;
        pivot.add(pMesh);

        const pData = {
          name: def.name,
          pivot: pivot,
          mesh: pMesh,
          speed: def.speed,
          rot: def.rot,
          angle: Math.random() * Math.PI * 2
        };

        // Venus Golden Atmospheric Scattering Halo
        if (def.isVenus) {
          const vAura = new THREE.Mesh(
            new THREE.SphereGeometry(def.size * 1.09, 32, 32),
            new THREE.MeshBasicMaterial({
              color: 0xFDE68A,
              transparent: true,
              opacity: 0.24,
              side: THREE.BackSide,
              blending: THREE.AdditiveBlending
            })
          );
          pMesh.add(vAura);
        }

        // Earth Volumetric Clouds + Thin Blue Line Atmospheric Scattering + Moon
        if (def.isEarth) {
          // Cloud sphere
          const cMesh = new THREE.Mesh(
            new THREE.SphereGeometry(def.size * 1.028, 48, 48),
            new THREE.MeshStandardMaterial({
              map: cloudsTexture,
              transparent: true,
              opacity: 0.52,
              roughness: 0.95
            })
          );
          pMesh.add(cMesh);
          pData.clouds = cMesh;

          // Atmospheric Rayleigh Scattering Cyan-Blue Limb Glow
          const eAura = new THREE.Mesh(
            new THREE.SphereGeometry(def.size * 1.10, 36, 36),
            new THREE.MeshBasicMaterial({
              color: 0x38BDF8,
              transparent: true,
              opacity: 0.28,
              side: THREE.BackSide,
              blending: THREE.AdditiveBlending
            })
          );
          pMesh.add(eAura);

          // Revolving Moon with basalt maria
          const moonPivot = new THREE.Group();
          pMesh.add(moonPivot);
          const moonMesh = new THREE.Mesh(
            new THREE.SphereGeometry(0.11, 28, 28),
            new THREE.MeshStandardMaterial({ map: mercuryTexture, roughness: 0.9 })
          );
          moonMesh.position.x = 0.92;
          moonPivot.add(moonMesh);
          pData.moon = moonPivot;
        }

        // Mars 2 Moonlets (Phobos & Deimos)
        if (def.isMars) {
          const phobosPivot = new THREE.Group();
          pMesh.add(phobosPivot);
          const phobos = new THREE.Mesh(new THREE.DodecahedronGeometry(0.048, 0), new THREE.MeshStandardMaterial({ color: 0x94A3B8, roughness: 0.9 }));
          phobos.position.x = 0.58;
          phobosPivot.add(phobos);
          pData.marsMoons = phobosPivot;
        }

        // Jupiter 4 Galilean Moons (Io, Europa, Ganymede, Callisto)
        if (def.isJupiter) {
          pData.jupMoons = [];
          const jMoons = [
            { dist: 1.45, size: 0.08, col: 0xFDE047, spd: 3.2 }, // Io (Sulfur)
            { dist: 1.90, size: 0.07, col: 0x93C5FD, spd: 2.4 }, // Europa (Ice)
            { dist: 2.40, size: 0.12, col: 0xE2E8F0, spd: 1.8 }, // Ganymede (Cratered)
            { dist: 3.00, size: 0.10, col: 0x94A3B8, spd: 1.2 }  // Callisto (Basalt)
          ];
          jMoons.forEach(jm => {
            const jp = new THREE.Group();
            pMesh.add(jp);
            const jmMesh = new THREE.Mesh(new THREE.SphereGeometry(jm.size, 18, 18), new THREE.MeshStandardMaterial({ color: jm.col, roughness: 0.8 }));
            jmMesh.position.x = jm.dist;
            jp.add(jmMesh);
            pData.jupMoons.push({ pivot: jp, spd: jm.spd });
          });
        }

        // Saturn Multi-Layered Rings & Titan Moon
        if (def.isSaturn) {
          const innerR = 1.05;
          const outerR = 2.45;
          const ringGeo = new THREE.RingGeometry(innerR, outerR, 160);

          // Remap UV coordinates radially so ring texture wraps 360 degrees smoothly
          const pos = ringGeo.attributes.position;
          const uvs = ringGeo.attributes.uv;
          for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i);
            const y = pos.getY(i);
            const r = Math.sqrt(x * x + y * y);
            const u = (r - innerR) / (outerR - innerR);
            uvs.setXY(i, u, 0.5);
          }
          uvs.needsUpdate = true;

          const ringMat = new THREE.MeshBasicMaterial({
            map: saturnRingTexture,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.94
          });
          const ringMesh = new THREE.Mesh(ringGeo, ringMat);
          ringMesh.rotation.x = Math.PI / 2 + 0.46; // Real 26.7-degree tilt
          pMesh.add(ringMesh);

          // Orbiting Titan Moon
          const titanPivot = new THREE.Group();
          pMesh.add(titanPivot);
          const titan = new THREE.Mesh(new THREE.SphereGeometry(0.13, 22, 22), new THREE.MeshStandardMaterial({ color: 0xFBBF24, roughness: 0.5 }));
          titan.position.x = 3.10;
          titanPivot.add(titan);
          pData.titan = titanPivot;
        }

        // Uranus Vertical Ice Ring & 97.8-degree Axial Roll
        if (def.isUranus) {
          const uRingGeo = new THREE.RingGeometry(0.72, 0.98, 80);
          const uRingMat = new THREE.MeshBasicMaterial({
            color: 0x67E8F9,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.65
          });
          const uRing = new THREE.Mesh(uRingGeo, uRingMat);
          uRing.rotation.y = Math.PI / 2.1;
          pMesh.add(uRing);
        }

        // Neptune Triton Moon
        if (def.isNeptune) {
          const tritonPivot = new THREE.Group();
          pMesh.add(tritonPivot);
          const triton = new THREE.Mesh(new THREE.SphereGeometry(0.09, 18, 18), new THREE.MeshStandardMaterial({ color: 0xE0E7FF, roughness: 0.8 }));
          triton.position.x = 1.05;
          tritonPivot.add(triton);
          pData.triton = tritonPivot;
        }

        planets.push(pData);
      });

      // ─────────────────────────────────────────────────────────────
      // 7. PHOTOREALISTIC ASTEROID BELT (550+ CRAGGY 3D ASTEROIDS)
      // ─────────────────────────────────────────────────────────────
      const asteroidCount = 550;
      const asteroidGroup = new THREE.Group();
      solarSystemGroup.add(asteroidGroup);

      // Create irregular craggy rocky geometries
      const astGeo1 = new THREE.DodecahedronGeometry(0.095, 1);
      const vPos = astGeo1.attributes.position;
      for (let i = 0; i < vPos.count; i++) {
        const factor = 1.0 + (Math.random() - 0.5) * 0.45;
        vPos.setXYZ(i, vPos.getX(i) * factor, vPos.getY(i) * factor, vPos.getZ(i) * factor);
      }
      vPos.needsUpdate = true;
      astGeo1.computeVertexNormals();

      const astMat1 = new THREE.MeshStandardMaterial({ color: 0x6B7280, roughness: 0.9, metalness: 0.2 }); // Silicate
      const astMat2 = new THREE.MeshStandardMaterial({ color: 0x92400E, roughness: 0.85, metalness: 0.35 }); // Metallic
      const astMat3 = new THREE.MeshStandardMaterial({ color: 0x374151, roughness: 0.95, metalness: 0.1 }); // Carbonaceous

      for (let i = 0; i < asteroidCount; i++) {
        const dist = 10.4 + (Math.random() - 0.5) * 2.2;
        const angle = Math.random() * Math.PI * 2;
        const yJitter = (Math.random() - 0.5) * 0.6;
        const scl = 0.45 + Math.random() * 0.95;

        const mat = i % 3 === 0 ? astMat1 : (i % 3 === 1 ? astMat2 : astMat3);
        const rock = new THREE.Mesh(astGeo1, mat);
        rock.position.set(Math.cos(angle) * dist, yJitter, Math.sin(angle) * dist);
        rock.scale.set(scl, scl, scl);
        rock.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        asteroidGroup.add(rock);
      }

      // ─────────────────────────────────────────────────────────────
      // 8. DYNAMIC SHOOTING COMETS / BOLIDE METEORS
      // ─────────────────────────────────────────────────────────────
      const meteors = [];
      for (let i = 0; i < 2; i++) {
        const mGroup = new THREE.Group();
        scene.add(mGroup);

        const mHead = new THREE.Mesh(
          new THREE.SphereGeometry(0.16, 16, 16),
          new THREE.MeshBasicMaterial({ color: 0x67E8F9, blending: THREE.AdditiveBlending })
        );
        mGroup.add(mHead);

        // Ionized plasma dust tail
        const tLen = 40;
        const tGeo = new THREE.BufferGeometry();
        const tPos = new Float32Array(tLen * 3);
        for (let j = 0; j < tLen; j++) {
          tPos[j * 3]     = -j * 0.28;
          tPos[j * 3 + 1] = j * 0.09;
          tPos[j * 3 + 2] = 0;
        }
        tGeo.setAttribute('position', new THREE.BufferAttribute(tPos, 3));
        const tMesh = new THREE.Points(tGeo, new THREE.PointsMaterial({
          color: 0x38BDF8,
          size: 0.14,
          transparent: true,
          opacity: 0.85,
          blending: THREE.AdditiveBlending
        }));
        mGroup.add(tMesh);

        meteors.push({
          group: mGroup,
          active: false,
          progress: 0,
          start: new THREE.Vector3(),
          end: new THREE.Vector3(),
          speed: 0.018 + Math.random() * 0.012
        });
      }

      function fireMeteor(m) {
        m.active = true;
        m.progress = 0;
        const sx = -40 - Math.random() * 15;
        const sy = 20 + Math.random() * 14;
        const sz = -18 - Math.random() * 20;
        m.start.set(sx, sy, sz);
        m.end.set(sx + 85, sy - 32, sz + 45);
        m.group.position.copy(m.start);
        m.group.lookAt(m.end);
      }

      // ─────────────────────────────────────────────────────────────
      // 9. INTERACTIVE 3D PARALLAX & AUTO-DRIFT
      // ─────────────────────────────────────────────────────────────
      let targetRotX = 0, targetRotY = 0;
      let curRotX = 0, curRotY = 0;

      window.addEventListener('pointermove', (e) => {
        const nx = (e.clientX / window.innerWidth) * 2 - 1;
        const ny = -(e.clientY / window.innerHeight) * 2 + 1;
        targetRotY = nx * 0.38;
        targetRotX = -ny * 0.25;
      }, { passive: true });

      window.addEventListener('deviceorientation', (e) => {
        if (e.beta !== null && e.gamma !== null) {
          targetRotX = (e.beta - 45) * 0.005;
          targetRotY = e.gamma * 0.007;
        }
      }, { passive: true });

      window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }, { passive: true });

      // ─────────────────────────────────────────────────────────────
      // 10. THEME REACTION (LIGHT / DARK)
      // ─────────────────────────────────────────────────────────────
      window.__smmUpdateThreeTheme = function(isDark) {
        ambientLight.intensity       = isDark ? 0.45 : 1.25;
        sunLight.intensity           = isDark ? 9.5 : 7.0;
        cosmicFillLight.intensity    = isDark ? 0.65 : 0.35;
        starMat.opacity              = isDark ? 0.95 : 0.40;
        mwMat.opacity                = isDark ? 0.88 : 0.35;
        coronaInner.material.opacity = isDark ? 0.48 : 0.25;
        coronaOuter.material.opacity = isDark ? 0.26 : 0.12;
        renderer.toneMappingExposure = isDark ? 1.62 : 1.30;
      };
      if (window.__smmIsDark) window.__smmUpdateThreeTheme(true);

      // ─────────────────────────────────────────────────────────────
      // 11. 60 FPS ULTRA-REALISTIC ANIMATION RENDER LOOP
      // ─────────────────────────────────────────────────────────────
      const clock = new THREE.Clock();
      let meteorTimer = 0;

      function animate() {
        requestAnimationFrame(animate);
        const t = clock.getElapsedTime();

        // 1. Sun Convective Rotation & Plasma Flare Breathing
        sunMesh.rotation.y += 0.0022;
        const sunBreath = 1.0 + Math.sin(t * 1.6) * 0.025;
        sunMesh.scale.set(sunBreath, sunBreath, sunBreath);

        // Rotating Prominence Magnetic Flare Loops
        flareLoops.forEach((fl, idx) => {
          fl.rotation.z += 0.0035 + idx * 0.0018;
          fl.rotation.x += 0.0020;
        });

        // Coronal Expanding Shockwave Rings
        sunPulseRings.forEach(pr => {
          const phase = (t * 0.70 + pr.offset) % 3.0;
          const prog = phase / 3.0;
          const scl = 1.0 + prog * 4.2;
          pr.mesh.scale.set(scl, scl, 1);
          pr.mesh.material.opacity = Math.sin(prog * Math.PI) * 0.42;
        });

        // Solar Wind Outward Particle Streaming
        const swP = swGeo.attributes.position.array;
        for (let i = 0; i < swCount; i++) {
          swP[i * 3]     += swVel[i].x;
          swP[i * 3 + 1] += swVel[i].y;
          swP[i * 3 + 2] += swVel[i].z;
          const dist = Math.sqrt(swP[i * 3] ** 2 + swP[i * 3 + 1] ** 2 + swP[i * 3 + 2] ** 2);
          if (dist > 18.0) {
            swP[i * 3]     = swVel[i].x * 30;
            swP[i * 3 + 1] = swVel[i].y * 30;
            swP[i * 3 + 2] = swVel[i].z * 30;
          }
        }
        swGeo.attributes.position.needsUpdate = true;

        // 2. Planets Orbital Revolutions & Axial Spins
        planets.forEach(p => {
          // Keplerian orbital revolution around the Sun
          p.pivot.rotation.y = p.angle + t * (p.speed * 0.28);

          // Planetary axial spin
          p.mesh.rotation.y += p.rot;

          // Earth clouds independent differential counter-rotation & Moon orbit
          if (p.clouds) p.clouds.rotation.y -= 0.0045;
          if (p.moon) p.moon.rotation.y += 0.030;

          // Mars moonlets
          if (p.marsMoons) p.marsMoons.rotation.y += 0.042;

          // Jupiter 4 Galilean Moons synchronized 3D orbits
          if (p.jupMoons) {
            p.jupMoons.forEach(jm => {
              jm.pivot.rotation.y += jm.spd * 0.015;
            });
          }

          // Saturn Titan moon
          if (p.titan) p.titan.rotation.y += 0.018;

          // Neptune Triton moon
          if (p.triton) p.triton.rotation.y += 0.025;
        });

        // 3. Asteroid Belt Precession
        asteroidGroup.rotation.y += 0.0014;

        // 4. Dynamic Bolide Meteors / Comets
        meteorTimer += 0.016;
        if (meteorTimer > 4.5) {
          const idleM = meteors.find(m => !m.active);
          if (idleM) fireMeteor(idleM);
          meteorTimer = 0;
        }
        meteors.forEach(m => {
          if (m.active) {
            m.progress += m.speed;
            m.group.position.lerpVectors(m.start, m.end, m.progress);
            if (m.progress >= 1.0) m.active = false;
          }
        });

        // 5. Deep Space Stars Dynamic Twinkling & Milky Way Drift
        starField.rotation.y = t * 0.0022;
        starMat.opacity = 0.82 + Math.sin(t * 1.8) * 0.12; // Scintillating starlight
        mwMat.opacity = 0.80 + Math.sin(t * 0.6) * 0.08;

        // 6. Smooth Cinematic Parallax + Organic Celestial Orbit Drift
        const cinematicAutoDriftX = Math.sin(t * 0.12) * 0.04;
        const cinematicAutoDriftY = Math.cos(t * 0.10) * 0.04;

        curRotX += (targetRotX + cinematicAutoDriftX - curRotX) * 0.045;
        curRotY += (targetRotY + cinematicAutoDriftY - curRotY) * 0.045;
        universeRoot.rotation.x = curRotX;
        universeRoot.rotation.y = curRotY;

        renderer.render(scene, camera);
      }
      animate();
    
})();