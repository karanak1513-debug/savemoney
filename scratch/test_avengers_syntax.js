(function initDualModeUniverseAndAvengers() {
      const canvas = document.getElementById('three-bg-canvas');
      if (!canvas || typeof THREE === 'undefined') return;

      const scene = new THREE.Scene();

      // Camera with Wide Cinematic Perspective
      const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 4000);
      camera.position.set(0, 16.0, 36.0);
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
      renderer.toneMappingExposure = 1.65;

      // ── MASTER DUAL ROOT GROUPS ──────────────────────────────────
      const darkUniverseRoot  = new THREE.Group();
      const lightAvengersRoot = new THREE.Group();
      scene.add(darkUniverseRoot);
      scene.add(lightAvengersRoot);

      // Fast 2D Noise & fBM Engine
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

      function makeTexture(w, h, renderFn) {
        const c = document.createElement('canvas');
        c.width = w; c.height = h;
        const ctx = c.getContext('2d');
        renderFn(ctx, w, h);
        const tex = new THREE.CanvasTexture(c);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.ClampToEdgeWrapping;
        return tex;
      }

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

      // =============================================================
      // PART 1: DARK MODE — LOCKED 9-PLANET ULTRA-HD SOLAR SYSTEM
      // =============================================================
      const solarSystemGroup = new THREE.Group();
      solarSystemGroup.rotation.x = 0.36; // 21-deg celestial tilt
      darkUniverseRoot.add(solarSystemGroup);

      // Planet Textures
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
            d[idx]     = Math.min(255, Math.floor(255 * (0.85 + heat * 0.2)));
            d[idx + 1] = Math.min(255, Math.floor(145 + heat * 110 * lat));
            d[idx + 2] = Math.min(255, Math.floor(10 + heat * heat * 180));
            d[idx + 3] = 255;
          }
        }
        ctx.putImageData(img, 0, 0);
        const spots = [
          { x: 0.25, y: 0.42, r: 14 }, { x: 0.29, y: 0.45, r: 9 },
          { x: 0.54, y: 0.38, r: 18 }, { x: 0.59, y: 0.41, r: 11 },
          { x: 0.81, y: 0.58, r: 15 }, { x: 0.86, y: 0.61, r: 8 }
        ];
        spots.forEach(sp => {
          const sx = sp.x * w, sy = sp.y * h;
          const pGrad = ctx.createRadialGradient(sx, sy, sp.r * 0.5, sx, sy, sp.r * 2.4);
          pGrad.addColorStop(0, 'rgba(154, 52, 18, 0.95)');
          pGrad.addColorStop(1, 'rgba(234, 88, 12, 0)');
          ctx.fillStyle = pGrad;
          ctx.beginPath(); ctx.arc(sx, sy, sp.r * 2.4, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#260606';
          ctx.beginPath(); ctx.ellipse(sx, sy, sp.r, sp.r * 0.75, 0.2, 0, Math.PI * 2); ctx.fill();
        });
      });

      const mercuryTexture = makeTexture(1024, 512, (ctx, w, h) => {
        ctx.fillStyle = '#4B5563'; ctx.fillRect(0, 0, w, h);
        for (let i = 0; i < 1200; i++) {
          ctx.fillStyle = Math.random() > 0.5 ? 'rgba(31, 41, 55, 0.3)' : 'rgba(156, 163, 175, 0.25)';
          ctx.fillRect(Math.random() * w, Math.random() * h, 3 + Math.random() * 8, 3 + Math.random() * 8);
        }
        for (let i = 0; i < 180; i++) {
          const cx = Math.random() * w, cy = Math.random() * h, cr = 2.0 + Math.random() * 9.0;
          ctx.beginPath(); ctx.arc(cx, cy, cr, 0, Math.PI * 2);
          ctx.fillStyle = '#1E293B'; ctx.fill();
          ctx.lineWidth = 1.4; ctx.strokeStyle = '#E2E8F0'; ctx.stroke();
          if (cr > 6.0) {
            ctx.strokeStyle = 'rgba(241, 245, 249, 0.35)'; ctx.lineWidth = 0.8;
            for (let r = 0; r < 6; r++) {
              const ang = (r / 6) * Math.PI * 2;
              ctx.beginPath(); ctx.moveTo(cx, cy);
              ctx.lineTo(cx + Math.cos(ang) * (cr * 3.5), cy + Math.sin(ang) * (cr * 3.5));
              ctx.stroke();
            }
          }
        }
      });

      const venusTexture = makeTexture(1024, 512, (ctx, w, h) => {
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, '#B45309'); grad.addColorStop(0.2, '#D97706');
        grad.addColorStop(0.5, '#FDE68A'); grad.addColorStop(0.8, '#D97706');
        grad.addColorStop(1, '#92400E');
        ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
        for (let y = 0; y < h; y += 4) {
          const wave = Math.sin(y * 0.08) * 14;
          ctx.fillStyle = `rgba(245, 158, 11, ${0.08 + Math.sin(y * 0.05) * 0.05})`;
          ctx.fillRect(0, y + wave, w, 3);
        }
      });

      const earthTexture = makeTexture(2048, 1024, (ctx, w, h) => {
        const oceanGrad = ctx.createRadialGradient(w/2, h/2, 100, w/2, h/2, w/2);
        oceanGrad.addColorStop(0, '#0284C7'); oceanGrad.addColorStop(0.5, '#0369A1'); oceanGrad.addColorStop(1, '#0C2540');
        ctx.fillStyle = oceanGrad; ctx.fillRect(0, 0, w, h);

        function drawPath(pts, fill, stroke) {
          ctx.beginPath();
          ctx.moveTo(pts[0][0] * w, pts[0][1] * h);
          for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0] * w, pts[i][1] * h);
          ctx.closePath();
          if (fill) { ctx.fillStyle = fill; ctx.fill(); }
          if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1.5; ctx.stroke(); }
        }
        const cyanCoast = 'rgba(6, 182, 212, 0.45)';
        drawPath([[0.06, 0.18], [0.12, 0.14], [0.20, 0.14], [0.27, 0.22], [0.28, 0.32], [0.24, 0.40], [0.21, 0.44], [0.18, 0.45], [0.14, 0.38], [0.08, 0.34], [0.05, 0.26]], '#15803D', cyanCoast);
        drawPath([[0.12, 0.22], [0.16, 0.20], [0.18, 0.32], [0.14, 0.36]], '#F1F5F9');
        drawPath([[0.21, 0.46], [0.30, 0.48], [0.34, 0.56], [0.32, 0.72], [0.26, 0.86], [0.22, 0.88], [0.20, 0.74], [0.19, 0.58], [0.19, 0.48]], '#166534', cyanCoast);
        drawPath([[0.23, 0.52], [0.30, 0.54], [0.28, 0.65], [0.22, 0.62]], '#14532D');
        drawPath([[0.38, 0.18], [0.46, 0.15], [0.60, 0.14], [0.75, 0.16], [0.88, 0.22], [0.86, 0.38], [0.78, 0.44], [0.68, 0.45], [0.58, 0.42], [0.48, 0.38], [0.38, 0.34], [0.36, 0.24]], '#15803D', cyanCoast);
        drawPath([[0.66, 0.34], [0.76, 0.32], [0.75, 0.36], [0.65, 0.37]], '#FFFFFF');
        drawPath([[0.68, 0.28], [0.76, 0.26], [0.78, 0.32], [0.70, 0.34]], '#D97706');
        drawPath([[0.43, 0.36], [0.56, 0.37], [0.60, 0.48], [0.58, 0.64], [0.52, 0.76], [0.47, 0.74], [0.43, 0.60], [0.40, 0.48], [0.41, 0.38]], '#65A30D', cyanCoast);
        drawPath([[0.42, 0.37], [0.56, 0.38], [0.55, 0.48], [0.41, 0.47]], '#D97706');
        drawPath([[0.45, 0.52], [0.54, 0.53], [0.52, 0.64], [0.44, 0.62]], '#14532D');
        drawPath([[0.74, 0.60], [0.86, 0.62], [0.87, 0.78], [0.75, 0.78], [0.72, 0.68]], '#15803D', cyanCoast);
        drawPath([[0.76, 0.64], [0.84, 0.65], [0.83, 0.74], [0.75, 0.72]], '#B45309');
        drawPath([[0.61, 0.64], [0.63, 0.66], [0.61, 0.74], [0.59, 0.72]], '#15803D');
        drawPath([[0.88, 0.28], [0.90, 0.34], [0.89, 0.38], [0.87, 0.32]], '#15803D');
        drawPath([[0.40, 0.22], [0.42, 0.24], [0.41, 0.28], [0.39, 0.26]], '#15803D');
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, w, h * 0.08); ctx.fillRect(0, h * 0.90, w, h * 0.10);
      });

      const cloudsTexture = makeTexture(2048, 1024, (ctx, w, h) => {
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.80)';
        for (let i = 0; i < 420; i++) {
          const cx = Math.random() * w, cy = h * 0.15 + Math.random() * (h * 0.70), len = 35 + Math.random() * 120;
          ctx.beginPath(); ctx.ellipse(cx, cy, len, 4 + Math.random() * 10, (Math.random() - 0.5) * 0.2, 0, Math.PI * 2); ctx.fill();
        }
        function drawCyclone(cx, cy, r) {
          ctx.save(); ctx.translate(cx, cy);
          for (let a = 0; a < Math.PI * 4; a += 0.15) {
            const dist = (a / (Math.PI * 4)) * r;
            const px = Math.cos(a) * dist, py = Math.sin(a) * dist;
            ctx.beginPath(); ctx.arc(px, py, 4 + dist * 0.10, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.78)'; ctx.fill();
          }
          ctx.restore();
        }
        drawCyclone(w * 0.26, h * 0.32, 65);
        drawCyclone(w * 0.78, h * 0.38, 75);
      });

      const marsTexture = makeTexture(1024, 512, (ctx, w, h) => {
        ctx.fillStyle = '#C2410C'; ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = 'rgba(69, 26, 3, 0.55)';
        ctx.beginPath(); ctx.ellipse(w * 0.65, h * 0.44, 135, 78, 0.2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(w * 0.28, h * 0.35, 115, 62, -0.1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath();
        ctx.moveTo(w * 0.25, h * 0.52);
        ctx.bezierCurveTo(w * 0.40, h * 0.56, w * 0.52, h * 0.48, w * 0.68, h * 0.53);
        ctx.lineWidth = 6; ctx.strokeStyle = '#450A0A'; ctx.stroke();
        ctx.beginPath(); ctx.arc(w * 0.22, h * 0.46, 25, 0, Math.PI * 2);
        ctx.fillStyle = '#9A3412'; ctx.fill();
        ctx.strokeStyle = '#7C2D12'; ctx.lineWidth = 3; ctx.stroke();
        ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, w, h * 0.07); ctx.fillRect(0, h * 0.92, w, h * 0.08);
      });

      const jupiterTexture = makeTexture(2048, 1024, (ctx, w, h) => {
        const bands = ['#78350F', '#92400E', '#B45309', '#FDE68A', '#FEF3C7', '#D97706', '#78350F', '#B45309', '#FDE68A', '#FEF3C7', '#B45309', '#92400E', '#D97706', '#FDE68A', '#FEF3C7', '#B45309', '#78350F', '#92400E', '#B45309', '#FDE68A', '#FEF3C7', '#D97706', '#78350F', '#92400E'];
        const bandH = h / bands.length;
        bands.forEach((col, i) => {
          ctx.fillStyle = col; ctx.fillRect(0, i * bandH, w, bandH);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.20)';
          for (let x = 0; x < w; x += 10) {
            const offset = Math.sin(x * 0.04 + i * 2) * 5;
            ctx.fillRect(x, i * bandH + offset, 10, 4);
          }
        });
        const sx = w * 0.62, sy = h * 0.65;
        ctx.beginPath(); ctx.ellipse(sx, sy, 95, 55, -0.05, 0, Math.PI * 2); ctx.fillStyle = '#EA580C'; ctx.fill();
        ctx.beginPath(); ctx.ellipse(sx, sy, 60, 34, -0.05, 0, Math.PI * 2); ctx.fillStyle = '#991B1B'; ctx.fill();
      });

      const saturnTexture = makeTexture(1024, 512, (ctx, w, h) => {
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, '#92400E'); grad.addColorStop(0.2, '#B45309');
        grad.addColorStop(0.4, '#FDE68A'); grad.addColorStop(0.6, '#F59E0B');
        grad.addColorStop(0.8, '#FDE68A'); grad.addColorStop(1, '#78350F');
        ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
        for (let y = 0; y < h; y += 4) {
          ctx.fillStyle = `rgba(180, 83, 9, ${0.06 + Math.sin(y * 0.08) * 0.04})`;
          ctx.fillRect(0, y, w, 2.5);
        }
      });

      const saturnRingTexture = makeTexture(2048, 32, (ctx, w, h) => {
        const imgData = ctx.createImageData(w, h);
        const d = imgData.data;
        for (let x = 0; x < w; x++) {
          const t = x / w;
          let alpha = 0.88, r = 250, g = 220, b = 160;
          if (t < 0.24) { alpha = 0.35 * (t / 0.24); r = 180; g = 145; b = 95; }
          else if (t >= 0.24 && t < 0.62) { const ripple = Math.sin(t * 220) * 0.08; alpha = 0.94 + ripple; r = 255; g = 235; b = 180; }
          else if (t >= 0.62 && t < 0.68) { alpha = 0.03; }
          else if (t >= 0.68 && t < 0.92) {
            if (t > 0.83 && t < 0.85) alpha = 0.06;
            else { alpha = 0.78 + Math.sin(t * 140) * 0.07; r = 238; g = 210; b = 155; }
          } else { alpha = 0.40 * (1 - (t - 0.92) / 0.08); }
          for (let y = 0; y < h; y++) {
            const idx = (y * w + x) * 4;
            d[idx] = r; d[idx + 1] = g; d[idx + 2] = b; d[idx + 3] = Math.floor(Math.max(0, Math.min(255, alpha * 255)));
          }
        }
        ctx.putImageData(imgData, 0, 0);
      });

      const uranusTexture = makeTexture(1024, 512, (ctx, w, h) => {
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, '#0891B2'); grad.addColorStop(0.5, '#67E8F9');
        grad.addColorStop(1, '#0E7490');
        ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
      });

      const neptuneTexture = makeTexture(1024, 512, (ctx, w, h) => {
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, '#1E3A8A'); grad.addColorStop(0.4, '#2563EB');
        grad.addColorStop(0.7, '#1D4ED8'); grad.addColorStop(1, '#172554');
        ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
        ctx.beginPath(); ctx.ellipse(w * 0.56, h * 0.48, 55, 30, 0.1, 0, Math.PI * 2); ctx.fillStyle = '#0F172A'; ctx.fill();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)'; ctx.fillRect(w * 0.50, h * 0.54, 75, 3.5);
      });

      const plutoTexture = makeTexture(1024, 512, (ctx, w, h) => {
        ctx.fillStyle = '#9A3412'; ctx.fillRect(0, 0, w, h);
        for (let i = 0; i < 600; i++) {
          ctx.fillStyle = Math.random() > 0.5 ? 'rgba(69, 26, 3, 0.4)' : 'rgba(217, 119, 6, 0.3)';
          ctx.fillRect(Math.random() * w, Math.random() * h, 4 + Math.random() * 8, 4 + Math.random() * 8);
        }
        ctx.fillStyle = '#3B1104'; ctx.fillRect(0, h * 0.48, w * 0.45, h * 0.14);
        const hx = w * 0.65, hy = h * 0.50;
        ctx.save(); ctx.translate(hx, hy); ctx.fillStyle = '#F8FAFC'; ctx.beginPath();
        ctx.arc(-22, -10, 28, Math.PI * 0.75, Math.PI * 1.85, false);
        ctx.arc(22, -10, 28, Math.PI * 1.15, Math.PI * 0.25, false);
        ctx.lineTo(0, 42); ctx.closePath(); ctx.fill(); ctx.restore();
      });

      // Dark Universe Lighting & Stars
      const ambientLight = new THREE.AmbientLight(0x0F172A, 0.48);
      darkUniverseRoot.add(ambientLight);
      const sunLight = new THREE.PointLight(0xFFFBEB, 9.5, 320, 0.85);
      sunLight.position.set(0, 0, 0);
      solarSystemGroup.add(sunLight);
      const cosmicFillLight = new THREE.DirectionalLight(0x38BDF8, 0.55);
      cosmicFillLight.position.set(35, 40, 30);
      darkUniverseRoot.add(cosmicFillLight);

      // 4 Volumetric Nebulae
      const nebulaConfigs = [
        { color: '168, 85, 247', pos: [-75, 40, -80], count: 90, scale: 38 },
        { color: '6, 182, 212',  pos: [85, -30, -70], count: 100, scale: 42 },
        { color: '244, 63, 94',  pos: [-55, -35, -60], count: 85, scale: 32 },
        { color: '245, 158, 11', pos: [65, 45, -95], count: 75, scale: 36 }
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
        const nebMat = new THREE.PointsMaterial({ map: spriteTex, size: 16.0, transparent: true, opacity: 0.38, blending: THREE.AdditiveBlending, depthWrite: false });
        darkUniverseRoot.add(new THREE.Points(nebGeo, nebMat));
      });

      // Milky Way & 12,000+ Stars
      const mwCount = 3500;
      const mwGeo = new THREE.BufferGeometry();
      const mwPos = new Float32Array(mwCount * 3);
      const mwColors = new Float32Array(mwCount * 3);
      for (let i = 0; i < mwCount; i++) {
        const angle = (i / mwCount) * Math.PI * 2, spread = (Math.random() - 0.5) * 18, dist = 95 + Math.random() * 35;
        mwPos[i * 3]     = Math.cos(angle) * dist + (Math.random() - 0.5) * 10;
        mwPos[i * 3 + 1] = Math.sin(angle) * 44 + spread;
        mwPos[i * 3 + 2] = Math.sin(angle) * dist + (Math.random() - 0.5) * 12;
        const isCore = Math.abs(angle - Math.PI) < 0.55;
        if (isCore) { mwColors[i * 3] = 1.0; mwColors[i * 3 + 1] = 0.88; mwColors[i * 3 + 2] = 0.65; }
        else { mwColors[i * 3] = 0.60; mwColors[i * 3 + 1] = 0.82; mwColors[i * 3 + 2] = 1.0; }
      }
      mwGeo.setAttribute('position', new THREE.BufferAttribute(mwPos, 3));
      mwGeo.setAttribute('color', new THREE.BufferAttribute(mwColors, 3));
      darkUniverseRoot.add(new THREE.Points(mwGeo, new THREE.PointsMaterial({ size: 0.20, vertexColors: true, transparent: true, opacity: 0.88, blending: THREE.AdditiveBlending })));

      const starCount = 6500;
      const starGeo = new THREE.BufferGeometry();
      const starPos = new Float32Array(starCount * 3);
      const starCols = new Float32Array(starCount * 3);
      const spectralClasses = [[1.0, 1.0, 1.0], [0.45, 0.75, 1.0], [0.35, 0.95, 0.98], [1.0, 0.88, 0.45], [1.0, 0.45, 0.40]];
      for (let i = 0; i < starCount; i++) {
        const rad = 80 + Math.random() * 140, theta = Math.random() * Math.PI * 2, phi = Math.acos((Math.random() * 2) - 1);
        starPos[i * 3]     = rad * Math.sin(phi) * Math.cos(theta);
        starPos[i * 3 + 1] = rad * Math.sin(phi) * Math.sin(theta);
        starPos[i * 3 + 2] = rad * Math.cos(phi);
        const col = spectralClasses[Math.floor(Math.random() * spectralClasses.length)];
        starCols[i * 3] = col[0]; starCols[i * 3 + 1] = col[1]; starCols[i * 3 + 2] = col[2];
      }
      starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
      starGeo.setAttribute('color', new THREE.BufferAttribute(starCols, 3));
      const starField = new THREE.Points(starGeo, new THREE.PointsMaterial({ size: 0.15, vertexColors: true, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending }));
      darkUniverseRoot.add(starField);

      // Diffraction Cross Stars
      const crossTex = (function() {
        const c = document.createElement('canvas'); c.width = 64; c.height = 64;
        const ctx = c.getContext('2d'); ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(31, 0, 2, 64); ctx.fillRect(0, 31, 64, 2);
        const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 16);
        grad.addColorStop(0, 'rgba(255,255,255,1)'); grad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(32, 32, 16, 0, Math.PI * 2); ctx.fill();
        return new THREE.CanvasTexture(c);
      })();
      const spikeGeo = new THREE.BufferGeometry();
      const spikePos = new Float32Array(30 * 3);
      for (let i = 0; i < 30; i++) {
        const ang = (i / 30) * Math.PI * 2, d = 60 + Math.random() * 30;
        spikePos[i * 3]     = Math.cos(ang) * d;
        spikePos[i * 3 + 1] = ((i % 2 === 0 ? 1 : -1) * 26) + (Math.random() - 0.5) * 20;
        spikePos[i * 3 + 2] = Math.sin(ang) * d;
      }
      spikeGeo.setAttribute('position', new THREE.BufferAttribute(spikePos, 3));
      darkUniverseRoot.add(new THREE.Points(spikeGeo, new THREE.PointsMaterial({ map: crossTex, size: 2.4, transparent: true, opacity: 0.90, blending: THREE.AdditiveBlending })));

      // Central Sun
      const sunGroup = new THREE.Group();
      solarSystemGroup.add(sunGroup);
      const sunMesh = new THREE.Mesh(new THREE.SphereGeometry(2.40, 64, 64), new THREE.MeshBasicMaterial({ map: sunTexture }));
      sunGroup.add(sunMesh);

      const coronaInner = new THREE.Mesh(new THREE.SphereGeometry(2.75, 36, 36), new THREE.MeshBasicMaterial({ color: 0xF59E0B, transparent: true, opacity: 0.48, side: THREE.BackSide, blending: THREE.AdditiveBlending }));
      sunGroup.add(coronaInner);
      const coronaOuter = new THREE.Mesh(new THREE.SphereGeometry(3.30, 32, 32), new THREE.MeshBasicMaterial({ color: 0xEF4444, transparent: true, opacity: 0.28, side: THREE.BackSide, blending: THREE.AdditiveBlending }));
      sunGroup.add(coronaOuter);

      const flareLoops = [];
      for (let i = 0; i < 5; i++) {
        const fGeo = new THREE.TorusGeometry(2.45 + i * 0.18, 0.05, 16, 64, Math.PI * 0.70);
        const fMat = new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? 0xFBBF24 : 0xEF4444, transparent: true, opacity: 0.72, blending: THREE.AdditiveBlending });
        const fMesh = new THREE.Mesh(fGeo, fMat);
        fMesh.rotation.x = Math.random() * Math.PI; fMesh.rotation.y = Math.random() * Math.PI;
        sunGroup.add(fMesh); flareLoops.push(fMesh);
      }

      const sunPulseRings = [];
      for (let i = 0; i < 2; i++) {
        const ring = new THREE.Mesh(new THREE.RingGeometry(2.6, 3.0, 64), new THREE.MeshBasicMaterial({ color: 0xFDE047, side: THREE.DoubleSide, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }));
        ring.rotation.x = Math.PI / 2; sunGroup.add(ring);
        sunPulseRings.push({ mesh: ring, offset: i * 1.5 });
      }

      const swCount = 220;
      const swGeo = new THREE.BufferGeometry();
      const swPos = new Float32Array(swCount * 3);
      const swVel = [];
      for (let i = 0; i < swCount; i++) {
        const v = new THREE.Vector3((Math.random() - 0.5), (Math.random() - 0.5) * 0.4, (Math.random() - 0.5)).normalize().multiplyScalar(2.4 + Math.random() * 15);
        swPos[i * 3]     = v.x; swPos[i * 3 + 1] = v.y; swPos[i * 3 + 2] = v.z;
        swVel.push(v.clone().normalize().multiplyScalar(0.045 + Math.random() * 0.03));
      }
      swGeo.setAttribute('position', new THREE.BufferAttribute(swPos, 3));
      const solarWind = new THREE.Points(swGeo, new THREE.PointsMaterial({ color: 0xFDE047, size: 0.14, transparent: true, opacity: 0.70, blending: THREE.AdditiveBlending }));
      solarSystemGroup.add(solarWind);

      function makeOrbitTrack(radius, colorHex, opacity) {
        const pts = [], segs = 160;
        for (let i = 0; i <= segs; i++) {
          const theta = (i / segs) * Math.PI * 2;
          pts.push(new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius));
        }
        const geo = new THREE.BufferGeometry().setFromPoints(pts);
        return new THREE.Line(geo, new THREE.LineBasicMaterial({ color: colorHex, transparent: true, opacity: opacity, blending: THREE.AdditiveBlending }));
      }

      // All 9 Planets Definitions
      const planets = [];
      const planetDefinitions = [
        { name: 'Mercury', dist: 4.8, distAU: '0.39', size: 0.38, speed: 1.55, rot: 0.02,  map: mercuryTexture, rough: 0.85, metal: 0.25, orbitColor: 0x94A3B8, orbitOp: 0.35 },
        { name: 'Venus',   dist: 7.2, distAU: '0.72', size: 0.65, speed: 1.12, rot: -0.015, map: venusTexture,   rough: 0.35, metal: 0.15, orbitColor: 0xF59E0B, orbitOp: 0.38, isVenus: true },
        { name: 'Earth',   dist: 10.2, distAU: '1.00', size: 0.78, speed: 0.85, rot: 0.025,  map: earthTexture,   rough: 0.28, metal: 0.25, orbitColor: 0x38BDF8, orbitOp: 0.45, isEarth: true },
        { name: 'Mars',    dist: 13.5, distAU: '1.52', size: 0.52, speed: 0.68, rot: 0.022,  map: marsTexture,    rough: 0.80, metal: 0.20, orbitColor: 0xF87171, orbitOp: 0.35, isMars: true },
        { name: 'Jupiter', dist: 19.5, distAU: '5.20', size: 1.85, speed: 0.40, rot: 0.035, map: jupiterTexture, rough: 0.40, metal: 0.10, orbitColor: 0xFBBF24, orbitOp: 0.38, isJupiter: true },
        { name: 'Saturn',  dist: 25.5, distAU: '9.58', size: 1.55, speed: 0.30, rot: 0.030, map: saturnTexture,  rough: 0.35, metal: 0.15, orbitColor: 0xFCD34D, orbitOp: 0.38, isSaturn: true },
        { name: 'Uranus',  dist: 31.0, distAU: '19.2', size: 0.95, speed: 0.20, rot: 0.020, map: uranusTexture,  rough: 0.25, metal: 0.20, orbitColor: 0x22D3EE, orbitOp: 0.32, isUranus: true },
        { name: 'Neptune', dist: 36.5, distAU: '30.1', size: 0.92, speed: 0.15, rot: 0.022, map: neptuneTexture, rough: 0.20, metal: 0.20, orbitColor: 0x60A5FA, orbitOp: 0.30, isNeptune: true },
        { name: 'Pluto',   dist: 42.0, distAU: '39.5', size: 0.34, speed: 0.11, rot: 0.018, map: plutoTexture,   rough: 0.85, metal: 0.15, orbitColor: 0xCBD5E1, orbitOp: 0.28, isPluto: true }
      ];

      planetDefinitions.forEach(def => {
        solarSystemGroup.add(makeOrbitTrack(def.dist, def.orbitColor, def.orbitOp));
        const pivot = new THREE.Group();
        solarSystemGroup.add(pivot);

        const pGeo = new THREE.SphereGeometry(def.size, 48, 48);
        const pMat = new THREE.MeshStandardMaterial({ map: def.map, roughness: def.rough, metalness: def.metal });
        const pMesh = new THREE.Mesh(pGeo, pMat);
        pMesh.position.x = def.dist;
        pivot.add(pMesh);

        const pData = {
          name: def.name, distAU: def.distAU, size: def.size, pivot: pivot, mesh: pMesh,
          speed: def.speed, rot: def.rot, angle: Math.random() * Math.PI * 2
        };

        if (def.isVenus) {
          const vAura = new THREE.Mesh(new THREE.SphereGeometry(def.size * 1.09, 32, 32), new THREE.MeshBasicMaterial({ color: 0xFDE68A, transparent: true, opacity: 0.25, side: THREE.BackSide, blending: THREE.AdditiveBlending }));
          pMesh.add(vAura);
        }
        if (def.isEarth) {
          const cMesh = new THREE.Mesh(new THREE.SphereGeometry(def.size * 1.028, 48, 48), new THREE.MeshStandardMaterial({ map: cloudsTexture, transparent: true, opacity: 0.55, roughness: 0.95 }));
          pMesh.add(cMesh); pData.clouds = cMesh;
          const eAura = new THREE.Mesh(new THREE.SphereGeometry(def.size * 1.10, 36, 36), new THREE.MeshBasicMaterial({ color: 0x38BDF8, transparent: true, opacity: 0.30, side: THREE.BackSide, blending: THREE.AdditiveBlending }));
          pMesh.add(eAura);
          const moonPivot = new THREE.Group(); pMesh.add(moonPivot);
          const moonMesh = new THREE.Mesh(new THREE.SphereGeometry(0.20, 28, 28), new THREE.MeshStandardMaterial({ map: mercuryTexture, roughness: 0.9 }));
          moonMesh.position.x = 1.55; moonPivot.add(moonMesh); pData.moon = moonPivot;
        }
        if (def.isMars) {
          const phobosPivot = new THREE.Group(); pMesh.add(phobosPivot);
          const phobos = new THREE.Mesh(new THREE.DodecahedronGeometry(0.065, 0), new THREE.MeshStandardMaterial({ color: 0x94A3B8, roughness: 0.9 }));
          phobos.position.x = 0.95; phobosPivot.add(phobos); pData.marsMoons = phobosPivot;
        }
        if (def.isJupiter) {
          pData.jupMoons = [];
          const jMoons = [{ dist: 2.65, size: 0.12, col: 0xFDE047, spd: 3.2 }, { dist: 3.35, size: 0.10, col: 0x93C5FD, spd: 2.4 }, { dist: 4.10, size: 0.16, col: 0xE2E8F0, spd: 1.8 }, { dist: 5.00, size: 0.14, col: 0x94A3B8, spd: 1.2 }];
          jMoons.forEach(jm => {
            const jp = new THREE.Group(); pMesh.add(jp);
            const jmMesh = new THREE.Mesh(new THREE.SphereGeometry(jm.size, 18, 18), new THREE.MeshStandardMaterial({ color: jm.col, roughness: 0.8 }));
            jmMesh.position.x = jm.dist; jp.add(jmMesh);
            pData.jupMoons.push({ pivot: jp, spd: jm.spd });
          });
        }
        if (def.isSaturn) {
          const innerR = 2.10, outerR = 4.85, ringGeo = new THREE.RingGeometry(innerR, outerR, 160);
          const pos = ringGeo.attributes.position, uvs = ringGeo.attributes.uv;
          for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i), y = pos.getY(i);
            const r = Math.sqrt(x * x + y * y);
            const u = (r - innerR) / (outerR - innerR);
            uvs.setXY(i, u, 0.5);
          }
          uvs.needsUpdate = true;
          const ringMat = new THREE.MeshBasicMaterial({ map: saturnRingTexture, side: THREE.DoubleSide, transparent: true, opacity: 0.95 });
          const ringMesh = new THREE.Mesh(ringGeo, ringMat);
          ringMesh.rotation.x = Math.PI / 2 + 0.46; pMesh.add(ringMesh);

          const titanPivot = new THREE.Group(); pMesh.add(titanPivot);
          const titan = new THREE.Mesh(new THREE.SphereGeometry(0.18, 22, 22), new THREE.MeshStandardMaterial({ color: 0xFBBF24, roughness: 0.5 }));
          titan.position.x = 5.80; titanPivot.add(titan); pData.titan = titanPivot;
        }
        if (def.isUranus) {
          const uRingGeo = new THREE.RingGeometry(1.35, 1.85, 80);
          const uRing = new THREE.Mesh(uRingGeo, new THREE.MeshBasicMaterial({ color: 0x67E8F9, side: THREE.DoubleSide, transparent: true, opacity: 0.68 }));
          uRing.rotation.y = Math.PI / 2.1; pMesh.add(uRing);
        }
        if (def.isNeptune) {
          const tritonPivot = new THREE.Group(); pMesh.add(tritonPivot);
          const triton = new THREE.Mesh(new THREE.SphereGeometry(0.13, 18, 18), new THREE.MeshStandardMaterial({ color: 0xE0E7FF, roughness: 0.8 }));
          triton.position.x = 1.85; tritonPivot.add(triton); pData.triton = tritonPivot;
        }
        if (def.isPluto) {
          const charonPivot = new THREE.Group(); pMesh.add(charonPivot);
          const charon = new THREE.Mesh(new THREE.SphereGeometry(0.15, 18, 18), new THREE.MeshStandardMaterial({ color: 0x94A3B8, roughness: 0.9 }));
          charon.position.x = 0.80; charonPivot.add(charon); pData.charon = charonPivot;
        }
        planets.push(pData);
      });

      // 700+ Asteroid Belt
      const asteroidCount = 700;
      const asteroidGroup = new THREE.Group();
      solarSystemGroup.add(asteroidGroup);
      const astGeo1 = new THREE.DodecahedronGeometry(0.11, 1);
      const vPos = astGeo1.attributes.position;
      for (let i = 0; i < vPos.count; i++) {
        const factor = 1.0 + (Math.random() - 0.5) * 0.45;
        vPos.setXYZ(i, vPos.getX(i) * factor, vPos.getY(i) * factor, vPos.getZ(i) * factor);
      }
      vPos.needsUpdate = true; astGeo1.computeVertexNormals();
      const astMat1 = new THREE.MeshStandardMaterial({ color: 0x6B7280, roughness: 0.9, metalness: 0.2 });
      const astMat2 = new THREE.MeshStandardMaterial({ color: 0x92400E, roughness: 0.85, metalness: 0.35 });
      const astMat3 = new THREE.MeshStandardMaterial({ color: 0x374151, roughness: 0.95, metalness: 0.1 });
      for (let i = 0; i < asteroidCount; i++) {
        const dist = 16.2 + (Math.random() - 0.5) * 2.8, angle = Math.random() * Math.PI * 2, yJitter = (Math.random() - 0.5) * 0.7, scl = 0.45 + Math.random() * 0.95;
        const mat = i % 3 === 0 ? astMat1 : (i % 3 === 1 ? astMat2 : astMat3);
        const rock = new THREE.Mesh(astGeo1, mat);
        rock.position.set(Math.cos(angle) * dist, yJitter, Math.sin(angle) * dist);
        rock.scale.set(scl, scl, scl);
        rock.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        asteroidGroup.add(rock);
      }

      // Comets
      const meteors = [];
      for (let i = 0; i < 2; i++) {
        const mGroup = new THREE.Group(); darkUniverseRoot.add(mGroup);
        const mHead = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), new THREE.MeshBasicMaterial({ color: 0x67E8F9, blending: THREE.AdditiveBlending }));
        mGroup.add(mHead);
        const tLen = 45, tGeo = new THREE.BufferGeometry(), tPos = new Float32Array(tLen * 3);
        for (let j = 0; j < tLen; j++) { tPos[j * 3] = -j * 0.32; tPos[j * 3 + 1] = j * 0.10; tPos[j * 3 + 2] = 0; }
        tGeo.setAttribute('position', new THREE.BufferAttribute(tPos, 3));
        const tMesh = new THREE.Points(tGeo, new THREE.PointsMaterial({ color: 0x38BDF8, size: 0.15, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending }));
        mGroup.add(tMesh);
        meteors.push({ group: mGroup, active: false, progress: 0, start: new THREE.Vector3(), end: new THREE.Vector3(), speed: 0.016 + Math.random() * 0.012 });
      }
      function fireMeteor(m) {
        m.active = true; m.progress = 0;
        const sx = -50 - Math.random() * 20, sy = 24 + Math.random() * 16, sz = -25 - Math.random() * 25;
        m.start.set(sx, sy, sz); m.end.set(sx + 110, sy - 40, sz + 60);
        m.group.position.copy(m.start); m.group.lookAt(m.end);
      }

      // =============================================================
      // PART 2: LIGHT MODE — 7 MARVEL AVENGERS 3D MODELS (RIGHT VISIBLE)
      // =============================================================
      // Master Avengers Group offset to the RIGHT SIDE of the viewport
      const avengersAssembleGroup = new THREE.Group();
      avengersAssembleGroup.position.set(7.2, 0.5, 0); // Positioned prominently on the right!
      lightAvengersRoot.add(avengersAssembleGroup);

      // Studio Daylight Illumination (Vibrant contrast on light background)
      const avengersAmbient = new THREE.AmbientLight(0xFFFFFF, 1.95);
      lightAvengersRoot.add(avengersAmbient);

      const avengersKeyLight = new THREE.DirectionalLight(0xFEF3C7, 3.4);
      avengersKeyLight.position.set(22, 30, 24);
      lightAvengersRoot.add(avengersKeyLight);

      const avengersFillLight = new THREE.DirectionalLight(0x38BDF8, 1.8);
      avengersFillLight.position.set(-15, -10, 18);
      lightAvengersRoot.add(avengersFillLight);

      const avengersRimLight = new THREE.DirectionalLight(0xDDD6FE, 1.6);
      avengersRimLight.position.set(10, 15, -20);
      lightAvengersRoot.add(avengersRimLight);

      // ── PROCEDURAL AVENGERS TEXTURES ─────────────────────────────
      // 1. Cap's Vibranium Shield Texture (512x512)
      const shieldTexture = makeTexture(512, 512, (ctx, w, h) => {
        const cx = w / 2, cy = h / 2;
        // Outer Red Ring
        ctx.fillStyle = '#DC2626';
        ctx.beginPath(); ctx.arc(cx, cy, 242, 0, Math.PI * 2); ctx.fill();
        // Silver White Ring
        ctx.fillStyle = '#F1F5F9';
        ctx.beginPath(); ctx.arc(cx, cy, 196, 0, Math.PI * 2); ctx.fill();
        // Inner Red Ring
        ctx.fillStyle = '#DC2626';
        ctx.beginPath(); ctx.arc(cx, cy, 150, 0, Math.PI * 2); ctx.fill();
        // Center Cobalt Blue Field
        ctx.fillStyle = '#1D4ED8';
        ctx.beginPath(); ctx.arc(cx, cy, 104, 0, Math.PI * 2); ctx.fill();
        // 5-Point Star
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const a1 = (i / 5) * Math.PI * 2 - Math.PI / 2;
          const a2 = a1 + Math.PI / 5;
          const x1 = cx + Math.cos(a1) * 88, y1 = cy + Math.sin(a1) * 88;
          const x2 = cx + Math.cos(a2) * 36, y2 = cy + Math.sin(a2) * 36;
          if (i === 0) ctx.moveTo(x1, y1);
          else ctx.lineTo(x1, y1);
          ctx.lineTo(x2, y2);
        }
        ctx.closePath(); ctx.fill();
      });

      // 2. Doctor Strange's Tao Mandala Magic Glyph Texture (512x512)
      const mandalaTexture = makeTexture(512, 512, (ctx, w, h) => {
        ctx.clearRect(0, 0, w, h);
        ctx.strokeStyle = '#F59E0B'; ctx.lineWidth = 3.5;
        const cx = w / 2, cy = h / 2;
        ctx.beginPath(); ctx.arc(cx, cy, 235, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.arc(cx, cy, 218, 0, Math.PI * 2); ctx.stroke();
        for (let i = 0; i < 8; i++) {
          const a = (i / 8) * Math.PI * 2;
          ctx.beginPath();
          ctx.moveTo(cx + Math.cos(a) * 218, cy + Math.sin(a) * 218);
          ctx.lineTo(cx + Math.cos(a + Math.PI * 0.75) * 218, cy + Math.sin(a + Math.PI * 0.75) * 218);
          ctx.stroke();
        }
        ctx.beginPath(); ctx.arc(cx, cy, 140, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.arc(cx, cy, 120, 0, Math.PI * 2); ctx.stroke();
        ctx.strokeRect(cx - 75, cy - 75, 150, 150);
        ctx.save(); ctx.translate(cx, cy); ctx.rotate(Math.PI / 4);
        ctx.strokeRect(-75, -75, 150, 150); ctx.restore();
        ctx.beginPath(); ctx.arc(cx, cy, 52, 0, Math.PI * 2); ctx.stroke();
      });

      // 3. Thor's Mjölnir Norse Triquetra Knot Rune Texture (512x512)
      const runeTexture = makeTexture(512, 512, (ctx, w, h) => {
        ctx.fillStyle = '#94A3B8'; ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = '#334155'; ctx.lineWidth = 8;
        const cx = w / 2, cy = h / 2;
        ctx.beginPath(); ctx.arc(cx, cy, 185, 0, Math.PI * 2); ctx.stroke();
        for (let i = 0; i < 3; i++) {
          const a = (i / 3) * Math.PI * 2;
          const rx = cx + Math.cos(a) * 65, ry = cy + Math.sin(a) * 65;
          ctx.beginPath(); ctx.arc(rx, ry, 80, 0, Math.PI * 2); ctx.stroke();
        }
      });

      // 4. Avengers "A" Monolith Logo Texture (512x512)
      const avengersLogoTexture = makeTexture(512, 512, (ctx, w, h) => {
        const cx = w / 2, cy = h / 2;
        ctx.clearRect(0, 0, w, h);
        ctx.strokeStyle = '#2563EB'; ctx.lineWidth = 26;
        ctx.beginPath(); ctx.arc(cx, cy, 215, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = '#0F172A';
        ctx.font = 'bold 360px "Space Grotesk", sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('A', cx - 12, cy + 18);
        ctx.fillStyle = '#2563EB';
        ctx.fillRect(cx - 30, cy + 45, 190, 26);
      });

      // ── BUILD ALL 7 CORE AVENGERS 3D MODELS ──────────────────────
      const heroes = [];
      const heroRingRadius = 7.0; // Circular exhibition radius

      // Helper to attach hero to orbit
      function registerHero(id, name, title, mesh, angleIdx, count = 7) {
        const angle = (angleIdx / count) * Math.PI * 2;
        const pivot = new THREE.Group();
        avengersAssembleGroup.add(pivot);

        mesh.position.set(Math.cos(angle) * heroRingRadius, 0, Math.sin(angle) * heroRingRadius);
        pivot.add(mesh);

        heroes.push({
          id: id,
          name: name,
          title: title,
          pivot: pivot,
          mesh: mesh,
          angle: angle,
          baseY: 0
        });
      }

      // 1. 🔴 HERO 1: IRON MAN (Nanotech Mark L Arc Reactor & Armor)
      const ironManGroup = new THREE.Group();
      // Armor Chestplate in Hot-Rod Red with Gold Accents
      const imPlateGeo = new THREE.CylinderGeometry(2.1, 2.3, 0.45, 32);
      const imPlateMat = new THREE.MeshStandardMaterial({ color: 0xDC2626, metalness: 0.95, roughness: 0.15 });
      const imPlate = new THREE.Mesh(imPlateGeo, imPlateMat);
      imPlate.rotation.x = Math.PI / 2;
      ironManGroup.add(imPlate);

      // Gold Beveled Collar Rim
      const imGoldRim = new THREE.Mesh(
        new THREE.TorusGeometry(2.15, 0.10, 16, 64),
        new THREE.MeshStandardMaterial({ color: 0xF59E0B, metalness: 0.92, roughness: 0.18 })
      );
      imGoldRim.rotation.x = Math.PI / 2;
      ironManGroup.add(imGoldRim);

      // Outer Titanium Reactor Ring
      const imReactorRim = new THREE.Mesh(
        new THREE.TorusGeometry(1.5, 0.12, 16, 64),
        new THREE.MeshStandardMaterial({ color: 0xE2E8F0, metalness: 0.98, roughness: 0.10 })
      );
      imReactorRim.position.z = 0.25;
      ironManGroup.add(imReactorRim);

      // 10 Copper Induction Wire Bundles
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * Math.PI * 2;
        const coil = new THREE.Mesh(
          new THREE.BoxGeometry(0.22, 0.35, 0.18),
          new THREE.MeshStandardMaterial({ color: 0xD97706, metalness: 0.85, roughness: 0.25 })
        );
        coil.position.set(Math.cos(a) * 1.5, Math.sin(a) * 1.5, 0.26);
        coil.rotation.z = a + Math.PI / 2;
        ironManGroup.add(coil);
      }

      // Glowing Cyan Unibeam Core
      const imUnibeam = new THREE.Mesh(
        new THREE.CircleGeometry(1.25, 32),
        new THREE.MeshBasicMaterial({ color: 0x22D3EE, transparent: true, opacity: 0.92, blending: THREE.AdditiveBlending })
      );
      imUnibeam.position.z = 0.28;
      ironManGroup.add(imUnibeam);

      // Holographic Nanotech Ring Projectors
      const imHoloRing = new THREE.Mesh(
        new THREE.RingGeometry(1.8, 1.88, 48),
        new THREE.MeshBasicMaterial({ color: 0x06B6D4, side: THREE.DoubleSide, transparent: true, opacity: 0.70, blending: THREE.AdditiveBlending })
      );
      imHoloRing.position.z = 0.40;
      ironManGroup.add(imHoloRing);

      registerHero('ironman', 'Iron Man', 'Mark L Nanotech Arc Reactor • Stark Industries', ironManGroup, 0);

      // 2. 🛡️ HERO 2: CAPTAIN AMERICA (Vibranium Shield with Star)
      const capGroup = new THREE.Group();
      // Curved Shield Dish
      const capDishGeo = new THREE.CylinderGeometry(2.5, 2.4, 0.25, 64);
      const capDishMat = [
        new THREE.MeshStandardMaterial({ color: 0xCBD5E1, metalness: 0.95, roughness: 0.15 }), // Sides
        new THREE.MeshStandardMaterial({ map: shieldTexture, metalness: 0.90, roughness: 0.15 }), // Front
        new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.85, roughness: 0.30 })  // Back
      ];
      const capShield = new THREE.Mesh(capDishGeo, capDishMat);
      capShield.rotation.x = Math.PI / 2;
      capGroup.add(capShield);

      // Chrome Outer Vibranium Bevel
      const capRim = new THREE.Mesh(
        new THREE.TorusGeometry(2.52, 0.08, 16, 64),
        new THREE.MeshStandardMaterial({ color: 0xFFFFFF, metalness: 0.98, roughness: 0.06 })
      );
      capRim.rotation.x = Math.PI / 2;
      capGroup.add(capRim);

      // Back Combat Leather Straps
      const capStrap1 = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 1.2, 0.35),
        new THREE.MeshStandardMaterial({ color: 0x78350F, roughness: 0.8 })
      );
      capStrap1.position.set(-0.6, -0.2, 0);
      capGroup.add(capStrap1);
      const capStrap2 = capStrap1.clone();
      capStrap2.position.set(0.6, -0.2, 0);
      capGroup.add(capStrap2);

      registerHero('cap', 'Captain America', 'Vibranium Shield • First Avenger', capGroup, 1);

      // 3. ⚡ HERO 3: THOR (Mjölnir Hammer & Crackling Lightning)
      const thorGroup = new THREE.Group();
      // Asgardian Uru Metal Head
      const mHeadGeo = new THREE.BoxGeometry(2.4, 1.5, 1.5);
      const mHeadMat = new THREE.MeshStandardMaterial({ color: 0x94A3B8, metalness: 0.96, roughness: 0.20 });
      const mHead = new THREE.Mesh(mHeadGeo, mHeadMat);
      thorGroup.add(mHead);

      // End-Cap Norse Knot Discs
      const mRuneDisc1 = new THREE.Mesh(
        new THREE.CircleGeometry(0.65, 32),
        new THREE.MeshStandardMaterial({ map: runeTexture, metalness: 0.9, roughness: 0.3 })
      );
      mRuneDisc1.position.x = 1.21;
      mRuneDisc1.rotation.y = Math.PI / 2;
      thorGroup.add(mRuneDisc1);

      const mRuneDisc2 = mRuneDisc1.clone();
      mRuneDisc2.position.x = -1.21;
      mRuneDisc2.rotation.y = -Math.PI / 2;
      thorGroup.add(mRuneDisc2);

      // Handle with Leather Grip
      const mHandle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.20, 0.20, 3.2, 24),
        new THREE.MeshStandardMaterial({ color: 0x78350F, roughness: 0.75 })
      );
      mHandle.position.y = -2.1;
      thorGroup.add(mHandle);

      // Handle Silver Accent Rings
      for (let r = 0; r < 4; r++) {
        const hRing = new THREE.Mesh(
          new THREE.TorusGeometry(0.22, 0.04, 16, 24),
          new THREE.MeshStandardMaterial({ color: 0xE2E8F0, metalness: 0.95 })
        );
        hRing.rotation.x = Math.PI / 2;
        hRing.position.y = -1.2 - (r * 0.6);
        thorGroup.add(hRing);
      }

      // Pommel & Wrist Loop
      const mPommel = new THREE.Mesh(
        new THREE.CylinderGeometry(0.28, 0.22, 0.35, 24),
        new THREE.MeshStandardMaterial({ color: 0xCBD5E1, metalness: 0.95 })
      );
      mPommel.position.y = -3.8;
      thorGroup.add(mPommel);

      const mLoop = new THREE.Mesh(
        new THREE.TorusGeometry(0.35, 0.06, 16, 32),
        new THREE.MeshStandardMaterial({ color: 0x78350F, roughness: 0.8 })
      );
      mLoop.position.y = -4.1;
      thorGroup.add(mLoop);

      // 3 Crackling Electric Lightning Arcs
      const thorLightningLines = [];
      for (let l = 0; l < 3; l++) {
        const lPts = [];
        for (let pt = 0; pt < 7; pt++) {
          lPts.push(new THREE.Vector3(
            (Math.random() - 0.5) * 2.8,
            (Math.random() - 0.5) * 1.8,
            (Math.random() - 0.5) * 1.8
          ));
        }
        const lGeo = new THREE.BufferGeometry().setFromPoints(lPts);
        const lMat = new THREE.LineBasicMaterial({ color: 0x93C5FD, transparent: true, opacity: 0.88, blending: THREE.AdditiveBlending });
        const lLine = new THREE.Line(lGeo, lMat);
        thorGroup.add(lLine);
        thorLightningLines.push(lLine);
      }

      registerHero('thor', 'Thor Odinson', 'Mjölnir & Stormbreaker • God of Thunder', thorGroup, 2);

      // 4. 🟢 HERO 4: THE INCREDIBLE HULK (Gamma Armored Fist & Shockwave)
      const hulkGroup = new THREE.Group();
      // Heavy Green Muscular Fist Block
      const hPalm = new THREE.Mesh(
        new THREE.BoxGeometry(2.0, 1.8, 1.8),
        new THREE.MeshStandardMaterial({ color: 0x16A34A, roughness: 0.55 })
      );
      hulkGroup.add(hPalm);

      // 4 Heavy Anatomical Knuckle Bulges
      for (let k = 0; k < 4; k++) {
        const kn = new THREE.Mesh(
          new THREE.DodecahedronGeometry(0.48, 1),
          new THREE.MeshStandardMaterial({ color: 0x15803D, roughness: 0.45 })
        );
        kn.position.set(-0.75 + k * 0.50, 0.95, 0.65);
        hulkGroup.add(kn);
      }

      // Armored Combat Gauntlet Cuff
      const hCuff = new THREE.Mesh(
        new THREE.CylinderGeometry(1.25, 1.35, 1.0, 32),
        new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.90, roughness: 0.25 })
      );
      hCuff.position.y = -1.35;
      hulkGroup.add(hCuff);

      // Gamma Radiation Glowing Veins
      const hVeinPts = [
        new THREE.Vector3(-0.6, 0.2, 0.92), new THREE.Vector3(-0.3, 0.8, 0.92),
        new THREE.Vector3(0.0, 0.3, 0.92), new THREE.Vector3(0.4, 0.9, 0.92),
        new THREE.Vector3(0.7, 0.4, 0.92)
      ];
      const hVein = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(hVeinPts),
        new THREE.LineBasicMaterial({ color: 0x4ADE80, transparent: true, opacity: 0.92, blending: THREE.AdditiveBlending })
      );
      hulkGroup.add(hVein);

      // Expanding Neon Green Gamma Shockwave
      const hShock = new THREE.Mesh(
        new THREE.RingGeometry(2.2, 2.45, 48),
        new THREE.MeshBasicMaterial({ color: 0x22C55E, side: THREE.DoubleSide, transparent: true, opacity: 0.45, blending: THREE.AdditiveBlending })
      );
      hShock.rotation.x = Math.PI / 2;
      hulkGroup.add(hShock);

      registerHero('hulk', 'The Incredible Hulk', 'Gamma Armor Gauntlet • World Breaker', hulkGroup, 3);

      // 5. 👁️ HERO 5: DOCTOR STRANGE (Eye of Agamotto & Eldritch Magic Mandalas)
      const strangeGroup = new THREE.Group();
      // Ornate Antique Bronze Amulet Frame
      const sAmulet = new THREE.Mesh(
        new THREE.TorusGeometry(1.6, 0.32, 24, 48),
        new THREE.MeshStandardMaterial({ color: 0xD97706, metalness: 0.85, roughness: 0.35 })
      );
      strangeGroup.add(sAmulet);

      // Inner Glowing Green Time Stone
      const sStone = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.58, 1),
        new THREE.MeshStandardMaterial({ color: 0x10B981, roughness: 0.1, emissive: 0x059669, emissiveIntensity: 0.8 })
      );
      sStone.position.z = 0.1;
      strangeGroup.add(sStone);

      // Dual Counter-Rotating Eldritch Magic Mandalas
      const sMandalaFront = new THREE.Mesh(
        new THREE.PlaneGeometry(5.2, 5.2),
        new THREE.MeshBasicMaterial({ map: mandalaTexture, side: THREE.DoubleSide, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending })
      );
      sMandalaFront.position.z = 0.15;
      strangeGroup.add(sMandalaFront);

      const sMandalaBack = new THREE.Mesh(
        new THREE.PlaneGeometry(6.4, 6.4),
        new THREE.MeshBasicMaterial({ map: mandalaTexture, side: THREE.DoubleSide, transparent: true, opacity: 0.60, blending: THREE.AdditiveBlending })
      );
      sMandalaBack.position.z = -0.15;
      strangeGroup.add(sMandalaBack);

      registerHero('strange', 'Doctor Strange', 'Eye of Agamotto & Time Stone • Sorcerer Supreme', strangeGroup, 4);

      // 6. 🐾 HERO 6: BLACK PANTHER (Vibranium Claws & Kinetic Armor)
      const pantherGroup = new THREE.Group();
      // Wakandan Vibranium Collar Base
      const pCollar = new THREE.Mesh(
        new THREE.CylinderGeometry(2.0, 2.2, 0.5, 32),
        new THREE.MeshStandardMaterial({ color: 0x0F172A, metalness: 0.95, roughness: 0.12 })
      );
      pCollar.rotation.x = Math.PI / 2;
      pantherGroup.add(pCollar);

      // 8 Sharp Polished Silver Vibranium Claws
      for (let c = 0; c < 8; c++) {
        const a = (c / 8) * Math.PI - Math.PI / 2 + 0.2;
        const claw = new THREE.Mesh(
          new THREE.ConeGeometry(0.18, 0.90, 16),
          new THREE.MeshStandardMaterial({ color: 0xE2E8F0, metalness: 0.98, roughness: 0.08 })
        );
        claw.position.set(Math.cos(a) * 1.8, Math.sin(a) * 1.8, 0.32);
        claw.rotation.z = a - Math.PI / 2;
        pantherGroup.add(claw);
      }

      // Kinetic Purple Absorption Glow Rings
      const pKinetic = new THREE.Mesh(
        new THREE.TorusGeometry(1.6, 0.06, 16, 48),
        new THREE.MeshBasicMaterial({ color: 0xA855F7, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending })
      );
      pKinetic.position.z = 0.30;
      pantherGroup.add(pKinetic);

      registerHero('panther', 'Black Panther', 'Vibranium Kinetic Claws • King of Wakanda', pantherGroup, 5);

      // 7. 🕷️ HERO 7: SPIDER-MAN (Iron Spider Nanotech Hub & 4 Golden Waldoes)
      const spiderGroup = new THREE.Group();
      // Metallic Red Nanotech Armor Hub
      const sHub = new THREE.Mesh(
        new THREE.SphereGeometry(0.95, 32, 32),
        new THREE.MeshStandardMaterial({ color: 0xDC2626, metalness: 0.95, roughness: 0.15 })
      );
      spiderGroup.add(sHub);

      // Center Gold Spider Emblem Ring
      const sEmblem = new THREE.Mesh(
        new THREE.TorusGeometry(0.70, 0.08, 16, 32),
        new THREE.MeshStandardMaterial({ color: 0xF59E0B, metalness: 0.96, roughness: 0.12 })
      );
      sEmblem.position.z = 0.85;
      spiderGroup.add(sEmblem);

      // 4 Articulated Golden Waldoes (Mechanical Spider Legs)
      for (let w = 0; w < 4; w++) {
        const wSignX = w % 2 === 0 ? 1 : -1;
        const wSignY = w < 2 ? 1 : -1;
        const legGroup = new THREE.Group();

        // Joint 1
        const seg1 = new THREE.Mesh(
          new THREE.CylinderGeometry(0.12, 0.09, 1.8, 16),
          new THREE.MeshStandardMaterial({ color: 0xF59E0B, metalness: 0.95, roughness: 0.14 })
        );
        seg1.position.set(wSignX * 0.9, wSignY * 0.9, 0);
        seg1.rotation.z = wSignX * wSignY * -0.65;
        legGroup.add(seg1);

        // Joint 2 (Arched claw)
        const seg2 = new THREE.Mesh(
          new THREE.ConeGeometry(0.14, 2.1, 16),
          new THREE.MeshStandardMaterial({ color: 0xFBBF24, metalness: 0.98, roughness: 0.10 })
        );
        seg2.position.set(wSignX * 1.8, wSignY * 1.9, 0.3);
        seg2.rotation.z = wSignX * wSignY * 0.85;
        legGroup.add(seg2);

        spiderGroup.add(legGroup);
      }

      registerHero('spiderman', 'Spider-Man', 'Iron Spider Nanotech Waldoes • Queens Avenger', spiderGroup, 6);

      // ── CENTRAL AVENGERS "A" MONOLITH ────────────────────────────
      const avengersCenter = new THREE.Group();
      avengersAssembleGroup.add(avengersCenter);

      // Hexagonal Polished Titanium Base
      const aBase = new THREE.Mesh(
        new THREE.CylinderGeometry(2.4, 2.6, 0.5, 6),
        new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.90, roughness: 0.20 })
      );
      aBase.position.y = -2.2;
      avengersCenter.add(aBase);

      // Vertical Standing "A" Logo Monolith
      const aLogoMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(3.6, 3.6),
        new THREE.MeshBasicMaterial({ map: avengersLogoTexture, side: THREE.DoubleSide, transparent: true, opacity: 0.95 })
      );
      aLogoMesh.position.y = 0;
      avengersCenter.add(aLogoMesh);

      // Chrome Frame around Monolith
      const aFrame = new THREE.Mesh(
        new THREE.TorusGeometry(1.85, 0.08, 16, 48),
        new THREE.MeshStandardMaterial({ color: 0x38BDF8, metalness: 0.95, roughness: 0.12 })
      );
      avengersCenter.add(aFrame);

      // Ambient Starlight / Golden Spark Particles (350 daylight sparks)
      const sparkCount = 350;
      const sparkGeo = new THREE.BufferGeometry();
      const sPos = new Float32Array(sparkCount * 3);
      for (let i = 0; i < sparkCount; i++) {
        sPos[i * 3]     = (Math.random() - 0.5) * 24;
        sPos[i * 3 + 1] = (Math.random() - 0.5) * 18;
        sPos[i * 3 + 2] = (Math.random() - 0.5) * 24;
      }
      sparkGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
      const sparkMat = new THREE.PointsMaterial({
        map: makeGlowSpriteTexture('245, 158, 11'),
        size: 0.65,
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending
      });
      avengersAssembleGroup.add(new THREE.Points(sparkGeo, sparkMat));

      // =============================================================
      // PART 3: INTERACTIVE CONTROLLER & DUAL-THEME SWITCHING
      // =============================================================
      let targetFocus = null;
      const overviewCameraPos = new THREE.Vector3(0, 18.0, 42.0);
      const curLookAt = new THREE.Vector3(0, -1.0, 0);

      function updateHud(text) {
        const hud = document.getElementById('celestial-hud-text');
        if (hud) hud.textContent = text;
      }

      // Universal Focus Function (Works for Planets in Dark, Heroes in Light)
      window.__smmFocusTarget = function(name) {
        if (!name || name === 'overview') {
          targetFocus = null;
          if (darkUniverseRoot.visible) {
            updateHud('SOL SYSTEM • REAL-TIME 3D UNIVERSE');
            document.querySelectorAll('.planet-dock-btn').forEach(b => b.classList.toggle('active', b.dataset.planet === 'overview'));
          } else {
            updateHud('AVENGERS ASSEMBLE • 7 HERO ARTIFACTS • EARTH\'S MIGHTIEST');
            document.querySelectorAll('.avengers-dock-btn').forEach(b => b.classList.toggle('active', b.dataset.hero === 'overview'));
          }
          return;
        }

        if (darkUniverseRoot.visible) {
          // Planet Focus
          document.querySelectorAll('.planet-dock-btn').forEach(b => b.classList.toggle('active', b.dataset.planet === name));
          if (name === 'sun') {
            targetFocus = { isSun: true, mesh: sunMesh, size: 2.4 };
            updateHud('TARGET: THE SUN • 1,392,700 KM • STELLAR CORE');
          } else {
            const pl = planets.find(p => p.name.toLowerCase() === name.toLowerCase());
            if (pl) {
              targetFocus = pl;
              updateHud(`TARGET: ${pl.name.toUpperCase()} • [${pl.distAU} AU] • HD ORBIT INSPECTION`);
            }
          }
        } else {
          // Avengers Hero Focus
          document.querySelectorAll('.avengers-dock-btn').forEach(b => b.classList.toggle('active', b.dataset.hero === name));
          const hr = heroes.find(h => h.id.toLowerCase() === name.toLowerCase());
          if (hr) {
            targetFocus = hr;
            updateHud(`HERO: ${hr.name.toUpperCase()} • ${hr.title.toUpperCase()}`);
          }
        }
      };

      // Wire Planet Selector Buttons
      function wireDocks() {
        document.querySelectorAll('.planet-dock-btn').forEach(btn => {
          btn.addEventListener('click', function(e) {
            e.stopPropagation();
            window.__smmFocusTarget(this.dataset.planet);
          });
        });
        document.querySelectorAll('.avengers-dock-btn').forEach(btn => {
          btn.addEventListener('click', function(e) {
            e.stopPropagation();
            window.__smmFocusTarget(this.dataset.hero);
          });
        });
      }
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', wireDocks);
      } else {
        wireDocks();
      }

      // 3D Raycasting: Click on any 3D model to focus
      const raycaster = new THREE.Raycaster();
      const mouseVec = new THREE.Vector2();
      window.addEventListener('click', (e) => {
        if (e.target.closest('button, input, select, a, .metallic-card, .glass-card, #sidebar, #auth-card, #dash-content')) return;
        mouseVec.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouseVec.y = -(e.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouseVec, camera);

        if (darkUniverseRoot.visible) {
          const clickable = planets.map(p => p.mesh).concat([sunMesh]);
          const hits = raycaster.intersectObjects(clickable);
          if (hits.length > 0) {
            const hit = hits[0].object;
            if (hit === sunMesh) window.__smmFocusTarget('sun');
            else {
              const found = planets.find(p => p.mesh === hit);
              if (found) window.__smmFocusTarget(found.name.toLowerCase());
            }
          }
        } else if (lightAvengersRoot.visible) {
          const heroMeshes = heroes.map(h => h.mesh);
          const hits = raycaster.intersectObjects(heroMeshes, true);
          if (hits.length > 0) {
            let topObj = hits[0].object;
            while (topObj.parent && !heroes.find(h => h.mesh === topObj)) {
              topObj = topObj.parent;
            }
            const foundHero = heroes.find(h => h.mesh === topObj);
            if (foundHero) window.__smmFocusTarget(foundHero.id);
          }
        }
      });

      // Parallax
      let targetRotX = 0, targetRotY = 0;
      let curRotX = 0, curRotY = 0;

      window.addEventListener('pointermove', (e) => {
        const nx = (e.clientX / window.innerWidth) * 2 - 1;
        const ny = -(e.clientY / window.innerHeight) * 2 + 1;
        targetRotY = nx * 0.35;
        targetRotX = -ny * 0.22;
      }, { passive: true });

      window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }, { passive: true });

      // ── DUAL THEME REACTION ──────────────────────────────────────
      window.__smmUpdateThreeTheme = function(isDark) {
        darkUniverseRoot.visible  = isDark;
        lightAvengersRoot.visible = !isDark;

        const planetDock   = document.getElementById('celestial-planet-dock');
        const avengersDock = document.getElementById('avengers-roster-dock');
        const hudText      = document.getElementById('celestial-hud-text');

        targetFocus = null;

        if (isDark) {
          if (planetDock)   planetDock.style.display   = '';
          if (avengersDock) avengersDock.style.display = 'none';
          if (hudText) hudText.textContent = 'SOL SYSTEM • REAL-TIME 3D UNIVERSE';
          renderer.toneMappingExposure = 1.65;
        } else {
          if (planetDock)   planetDock.style.display   = 'none';
          if (avengersDock) avengersDock.style.display = '';
          if (hudText) hudText.textContent = 'AVENGERS ASSEMBLE • 7 HERO ARTIFACTS • EARTH\'S MIGHTIEST';
          renderer.toneMappingExposure = 1.40;
        }
      };

      const initialDark = document.documentElement.getAttribute('data-theme') === 'dark' || window.__smmIsDark;
      window.__smmUpdateThreeTheme(initialDark);

      // =============================================================
      // PART 4: 60 FPS DUAL-SCENE RENDER LOOP
      // =============================================================
      const clock = new THREE.Clock();
      let meteorTimer = 0;

      function animate() {
        requestAnimationFrame(animate);
        const t = clock.getElapsedTime();

        curRotX += (targetRotX - curRotX) * 0.045;
        curRotY += (targetRotY - curRotY) * 0.045;

        // A. DARK MODE: Solar System Universe
        if (darkUniverseRoot.visible) {
          sunMesh.rotation.y += 0.0020;
          const sunBreath = 1.0 + Math.sin(t * 1.6) * 0.022;
          sunMesh.scale.set(sunBreath, sunBreath, sunBreath);

          flareLoops.forEach((fl, idx) => {
            fl.rotation.z += 0.0032 + idx * 0.0016;
            fl.rotation.x += 0.0018;
          });

          sunPulseRings.forEach(pr => {
            const phase = (t * 0.70 + pr.offset) % 3.0;
            const prog = phase / 3.0;
            const scl = 1.0 + prog * 4.2;
            pr.mesh.scale.set(scl, scl, 1);
            pr.mesh.material.opacity = Math.sin(prog * Math.PI) * 0.45;
          });

          const swP = swGeo.attributes.position.array;
          for (let i = 0; i < swCount; i++) {
            swP[i * 3]     += swVel[i].x;
            swP[i * 3 + 1] += swVel[i].y;
            swP[i * 3 + 2] += swVel[i].z;
            const dist = Math.sqrt(swP[i * 3] ** 2 + swP[i * 3 + 1] ** 2 + swP[i * 3 + 2] ** 2);
            if (dist > 28.0) {
              swP[i * 3]     = swVel[i].x * 35;
              swP[i * 3 + 1] = swVel[i].y * 35;
              swP[i * 3 + 2] = swVel[i].z * 35;
            }
          }
          swGeo.attributes.position.needsUpdate = true;

          planets.forEach(p => {
            p.pivot.rotation.y = p.angle + t * (p.speed * 0.24);
            p.mesh.rotation.y += p.rot;
            if (p.clouds) p.clouds.rotation.y -= 0.0040;
            if (p.moon) p.moon.rotation.y += 0.028;
            if (p.marsMoons) p.marsMoons.rotation.y += 0.040;
            if (p.jupMoons) { p.jupMoons.forEach(jm => { jm.pivot.rotation.y += jm.spd * 0.015; }); }
            if (p.titan) p.titan.rotation.y += 0.018;
            if (p.triton) p.triton.rotation.y += 0.022;
            if (p.charon) p.charon.rotation.y += 0.025;
          });

          asteroidGroup.rotation.y += 0.0012;

          meteorTimer += 0.016;
          if (meteorTimer > 4.2) {
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

          starField.rotation.y = t * 0.0020;
          starMat.opacity = 0.85 + Math.sin(t * 1.8) * 0.12;
          mwMat.opacity = 0.82 + Math.sin(t * 0.6) * 0.08;

          if (targetFocus) {
            const targetWorld = new THREE.Vector3();
            if (targetFocus.isSun) {
              targetWorld.set(0, 0, 0);
              const closePos = new THREE.Vector3(0, 3.5, 8.5);
              camera.position.lerp(closePos, 0.05);
              curLookAt.lerp(targetWorld, 0.05);
            } else {
              targetFocus.mesh.getWorldPosition(targetWorld);
              const offsetDist = targetFocus.size * 3.6 + 1.4;
              const desiredPos = new THREE.Vector3()
                .copy(targetWorld)
                .add(new THREE.Vector3(offsetDist * 0.8, offsetDist * 0.5, offsetDist * 0.9));
              camera.position.lerp(desiredPos, 0.05);
              curLookAt.lerp(targetWorld, 0.05);
            }
            camera.lookAt(curLookAt);
          } else {
            const desiredPos = new THREE.Vector3(
              curRotY * 14.0,
              18.0 - curRotX * 9.0,
              42.0
            );
            camera.position.lerp(desiredPos, 0.045);
            curLookAt.lerp(overviewCameraPos, 0.045);
            camera.lookAt(curLookAt);
            solarSystemGroup.rotation.x = 0.36 + curRotX * 0.12;
            solarSystemGroup.rotation.y = curRotY * 0.15;
          }
        }

        // B. LIGHT MODE: 7 Marvel Avengers Assemblage (Right Visible)
        if (lightAvengersRoot.visible) {
          // Slow Exhibition Turntable Rotation
          if (!targetFocus) {
            avengersAssembleGroup.rotation.y += 0.004;
          }

          // 1. Iron Man: Arc Reactor pulse & Holo rings spin
          imPlate.rotation.z += 0.005;
          imHoloRing.rotation.z -= 0.015;
          const arcPulse = 0.85 + Math.sin(t * 3.0) * 0.15;
          imUnibeam.material.opacity = arcPulse;

          // 2. Cap: Shield subtle levitation spin
          capGroup.rotation.y += 0.008;

          // 3. Thor: Crackling dynamic lightning arcs
          thorLightningLines.forEach(line => {
            const pos = line.geometry.attributes.position.array;
            for (let i = 0; i < pos.length; i += 3) {
              pos[i]     += (Math.random() - 0.5) * 0.08;
              pos[i + 1] += (Math.random() - 0.5) * 0.08;
              pos[i + 2] += (Math.random() - 0.5) * 0.08;
            }
            line.geometry.attributes.position.needsUpdate = true;
          });
          thorGroup.rotation.y += 0.006;

          // 4. Hulk: Expanding Gamma Shockwave
          const hPhase = (t * 0.8) % 2.5;
          const hProg = hPhase / 2.5;
          hShock.scale.set(1.0 + hProg * 2.2, 1.0 + hProg * 2.2, 1);
          hShock.material.opacity = Math.sin(hProg * Math.PI) * 0.55;

          // 5. Doctor Strange: Dual Counter-Rotating Tao Mandalas
          sMandalaFront.rotation.z += 0.014;
          sMandalaBack.rotation.z -= 0.010;
          sStone.rotation.y += 0.020;

          // 6. Black Panther: Kinetic Purple Pulse
          pKinetic.material.opacity = 0.65 + Math.sin(t * 2.2) * 0.35;
          pantherGroup.rotation.y += 0.006;

          // 7. Spider-Man: Mechanical Waldoes flex
          spiderGroup.rotation.y += 0.007;

          // Central Monolith Logo Rotation
          avengersCenter.rotation.y += 0.006;

          // Camera Framing for Avengers (Right Side of Screen)
          if (targetFocus && targetFocus.mesh) {
            const hWorld = new THREE.Vector3();
            targetFocus.mesh.getWorldPosition(hWorld);
            const focusCam = new THREE.Vector3().copy(hWorld).add(new THREE.Vector3(0, 0.8, 4.8));
            camera.position.lerp(focusCam, 0.05);
            curLookAt.lerp(hWorld, 0.05);
            camera.lookAt(curLookAt);
          } else {
            // Panoramic view focusing on the right side of the screen
            const rightFramedPos = new THREE.Vector3(
              5.5 + curRotY * 5.0,
              4.5 - curRotX * 3.5,
              20.0
            );
            const rightLookTarget = new THREE.Vector3(7.2, 0, 0);
            camera.position.lerp(rightFramedPos, 0.045);
            curLookAt.lerp(rightLookTarget, 0.045);
            camera.lookAt(curLookAt);

            avengersAssembleGroup.rotation.x = curRotX * 0.20;
          }
        }

        renderer.render(scene, camera);
      }
      animate();
    })();