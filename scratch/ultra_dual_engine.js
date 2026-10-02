  <!-- ============================================================ -->
  <!-- 3D DUAL-MODE UNIVERSE & KINETIC STUDIO ENGINE v9               -->
  <!-- DARK MODE: Locked 9-Planet Ultra-HD Solar System & Universe     -->
  <!-- LIGHT MODE: Luxury Prismatic Wealth Vault & Kinetic 3D Studio   -->
  <!-- ============================================================ -->
  <script>
    (function initDualModeCosmicStudio() {
      const canvas = document.getElementById('three-bg-canvas');
      if (!canvas || typeof THREE === 'undefined') return;

      const scene = new THREE.Scene();

      // Cinematic Perspective Camera
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
      const darkUniverseRoot = new THREE.Group();
      const lightStudioRoot  = new THREE.Group();
      scene.add(darkUniverseRoot);
      scene.add(lightStudioRoot);

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

      // A. Textures for Planets
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
        grad.addColorStop(0, '#0891B2'); grad.addColorStop(0.5, '#67E8F9'); grad.addColorStop(1, '#0E7490');
        ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
      });

      const neptuneTexture = makeTexture(1024, 512, (ctx, w, h) => {
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, '#1E3A8A'); grad.addColorStop(0.4, '#2563EB'); grad.addColorStop(0.7, '#1D4ED8'); grad.addColorStop(1, '#172554');
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

      // B. Lighting in Dark Universe
      const ambientLight = new THREE.AmbientLight(0x0F172A, 0.48);
      darkUniverseRoot.add(ambientLight);

      const sunLight = new THREE.PointLight(0xFFFBEB, 9.5, 320, 0.85);
      sunLight.position.set(0, 0, 0);
      solarSystemGroup.add(sunLight);

      const cosmicFillLight = new THREE.DirectionalLight(0x38BDF8, 0.55);
      cosmicFillLight.position.set(35, 40, 30);
      darkUniverseRoot.add(cosmicFillLight);

      // C. 4 Volumetric Nebulae
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
        const nebMat = new THREE.PointsMaterial({
          map: spriteTex, size: 16.0, transparent: true, opacity: 0.38, blending: THREE.AdditiveBlending, depthWrite: false
        });
        darkUniverseRoot.add(new THREE.Points(nebGeo, nebMat));
      });

      // D. Milky Way & 12,000+ Stars
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
      const mwMat = new THREE.PointsMaterial({ size: 0.20, vertexColors: true, transparent: true, opacity: 0.88, blending: THREE.AdditiveBlending });
      darkUniverseRoot.add(new THREE.Points(mwGeo, mwMat));

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
      const starMat = new THREE.PointsMaterial({ size: 0.15, vertexColors: true, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending });
      const starField = new THREE.Points(starGeo, starMat);
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
      const spikeMat = new THREE.PointsMaterial({ map: crossTex, size: 2.4, transparent: true, opacity: 0.90, blending: THREE.AdditiveBlending });
      darkUniverseRoot.add(new THREE.Points(spikeGeo, spikeMat));

      // E. Central Sun
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

      // F. All 9 Planets
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

      // G. 700+ Asteroid Belt
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

      // H. Comets
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
      // PART 2: LIGHT MODE — ULTRA-DETAILED PRISMATIC KINETIC VAULT
      // =============================================================

      // 1. Studio 4-Point High-Key Lighting (Ultra-Graphic Speculars)
      const lightStudioAmbient = new THREE.AmbientLight(0xF8FAFC, 2.2);
      lightStudioRoot.add(lightStudioAmbient);

      const lightStudioKeyLight = new THREE.DirectionalLight(0xFFFBEB, 3.8); // Warm Sunlight / 24K Gold
      lightStudioKeyLight.position.set(24, 34, 26);
      lightStudioRoot.add(lightStudioKeyLight);

      const lightStudioFillLight = new THREE.DirectionalLight(0x38BDF8, 1.8); // Crisp Sky Cyan
      lightStudioFillLight.position.set(-24, -16, 22);
      lightStudioRoot.add(lightStudioFillLight);

      const lightStudioRimLight = new THREE.DirectionalLight(0xF43F5E, 1.6); // Rose Gold Iridescent Rim
      lightStudioRimLight.position.set(0, 20, -26);
      lightStudioRoot.add(lightStudioRimLight);

      const lightStudioTopLight = new THREE.DirectionalLight(0xE0E7FF, 1.4); // Cool Overhead Studio Light
      lightStudioTopLight.position.set(0, 36, 0);
      lightStudioRoot.add(lightStudioTopLight);

      // Master Kinetic Gyroscopic Vault Assembly
      const kineticVaultGroup = new THREE.Group();
      kineticVaultGroup.position.set(0, 0, 0);
      lightStudioRoot.add(kineticVaultGroup);

      // ── SHARED LUXURY MATERIALS ────────────────────────────────────
      const matPlatinum = new THREE.MeshStandardMaterial({
        color: 0xE2E8F0,
        metalness: 0.98,
        roughness: 0.08
      });

      const matTitanium = new THREE.MeshStandardMaterial({
        color: 0x94A3B8,
        metalness: 0.92,
        roughness: 0.16
      });

      const matMirrorGold = new THREE.MeshStandardMaterial({
        color: 0xF59E0B,
        metalness: 0.96,
        roughness: 0.12
      });

      const matRoseGold = new THREE.MeshStandardMaterial({
        color: 0xFB7185,
        metalness: 0.90,
        roughness: 0.16
      });

      const matNeonCyan = new THREE.MeshBasicMaterial({
        color: 0x06B6D4,
        transparent: true,
        opacity: 0.95
      });

      const matNeonPurple = new THREE.MeshBasicMaterial({
        color: 0xA855F7,
        transparent: true,
        opacity: 0.90
      });

      const matDiamondGlass = new THREE.MeshStandardMaterial({
        color: 0xE0F2FE,
        roughness: 0.03,
        metalness: 0.12,
        transparent: true,
        opacity: 0.92
      });

      // ─────────────────────────────────────────────────────────────
      // 1. OUTER MASTER GIMBAL RING (Platinum & Calibrated Chrono-Rim)
      // ─────────────────────────────────────────────────────────────
      const platMasterGroup = new THREE.Group();
      kineticVaultGroup.add(platMasterGroup);

      // Main Platinum Heavy Torus
      const platRing = new THREE.Mesh(new THREE.TorusGeometry(6.4, 0.22, 36, 128), matPlatinum);
      platMasterGroup.add(platRing);

      // Upper & Lower Guard Rails
      const railGeo = new THREE.TorusGeometry(6.72, 0.038, 16, 100);
      const topRail = new THREE.Mesh(railGeo, matTitanium);
      topRail.position.z = 0.22;
      platMasterGroup.add(topRail);

      const botRail = new THREE.Mesh(railGeo, matTitanium);
      botRail.position.z = -0.22;
      platMasterGroup.add(botRail);

      // 72 Laser-Engraved Degree Calibration Ticks (Every 5 Degrees)
      const majorTickGeo = new THREE.BoxGeometry(0.08, 0.38, 0.14);
      const minorTickGeo = new THREE.BoxGeometry(0.04, 0.20, 0.08);

      for (let i = 0; i < 72; i++) {
        const ang = (i / 72) * Math.PI * 2;
        const isMajor = (i % 6 === 0);
        const tick = new THREE.Mesh(isMajor ? majorTickGeo : minorTickGeo, isMajor ? matMirrorGold : matRoseGold);
        tick.position.set(Math.cos(ang) * 6.4, Math.sin(ang) * 6.4, 0);
        tick.rotation.z = ang;
        platMasterGroup.add(tick);
      }

      // 12 Golden Hexagonal Rivet-Bolts (Every 30 Degrees)
      const boltGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.08, 6);
      for (let i = 0; i < 12; i++) {
        const ang = (i / 12) * Math.PI * 2;
        const bolt = new THREE.Mesh(boltGeo, matMirrorGold);
        bolt.position.set(Math.cos(ang) * 6.64, Math.sin(ang) * 6.64, 0);
        bolt.rotation.x = Math.PI / 2;
        bolt.rotation.z = ang;
        platMasterGroup.add(bolt);
      }

      // 4 Heavy Gimbal Pivot Sockets with Miniature Ruby End-Caps
      const pivotSocketGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.36, 16);
      const rubyBearingGeo = new THREE.SphereGeometry(0.12, 16, 16);
      const matRuby = new THREE.MeshStandardMaterial({ color: 0xE11D48, roughness: 0.1, metalness: 0.2 });

      [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].forEach(ang => {
        const pSocket = new THREE.Mesh(pivotSocketGeo, matMirrorGold);
        pSocket.position.set(Math.cos(ang) * 6.4, Math.sin(ang) * 6.4, 0);
        pSocket.rotation.z = ang;
        platMasterGroup.add(pSocket);

        const ruby = new THREE.Mesh(rubyBearingGeo, matRuby);
        ruby.position.set(Math.cos(ang) * 6.4, Math.sin(ang) * 6.4, 0.20);
        platMasterGroup.add(ruby);
      });

      // ─────────────────────────────────────────────────────────────
      // 2. MIDDLE 24K FLUTED ESCAPEMENT GEAR RING (Gold Tourbillon)
      // ─────────────────────────────────────────────────────────────
      const goldGearGroup = new THREE.Group();
      goldGearGroup.rotation.x = Math.PI / 4.2;
      goldGearGroup.rotation.z = 0.18;
      kineticVaultGroup.add(goldGearGroup);

      // Fluted Gold Main Torus
      const goldRing = new THREE.Mesh(new THREE.TorusGeometry(4.9, 0.18, 32, 110), matMirrorGold);
      goldGearGroup.add(goldRing);

      // 48 Inward Escapement Gear Teeth
      const gearToothGeo = new THREE.BoxGeometry(0.12, 0.32, 0.22);
      for (let i = 0; i < 48; i++) {
        const ang = (i / 48) * Math.PI * 2;
        const tooth = new THREE.Mesh(gearToothGeo, matMirrorGold);
        tooth.position.set(Math.cos(ang) * 4.70, Math.sin(ang) * 4.70, 0);
        tooth.rotation.z = ang;
        goldGearGroup.add(tooth);
      }

      // 4 Cardinal Sapphire & Ruby Jewel Bearings in 4-Prong Gold Settings
      const matSapphire = new THREE.MeshStandardMaterial({ color: 0x0284C7, roughness: 0.08, metalness: 0.15 });
      const gemSphereGeo = new THREE.SphereGeometry(0.24, 20, 20);

      [
        { ang: 0, mat: matSapphire },
        { ang: Math.PI / 2, mat: matRuby },
        { ang: Math.PI, mat: matSapphire },
        { ang: (3 * Math.PI) / 2, mat: matRuby }
      ].forEach(jewel => {
        const jMesh = new THREE.Mesh(gemSphereGeo, jewel.mat);
        jMesh.position.set(Math.cos(jewel.ang) * 4.9, Math.sin(jewel.ang) * 4.9, 0);
        goldGearGroup.add(jMesh);

        // Gold Setting Collar
        const collar = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.04, 12, 24), matMirrorGold);
        collar.position.copy(jMesh.position);
        goldGearGroup.add(collar);
      });

      // ─────────────────────────────────────────────────────────────
      // 3. INNER CHRONO-AURA RING (Rose Gold & Holographic Runners)
      // ─────────────────────────────────────────────────────────────
      const chronoRingGroup = new THREE.Group();
      chronoRingGroup.rotation.y = Math.PI / 3.6;
      chronoRingGroup.rotation.x = -0.22;
      kineticVaultGroup.add(chronoRingGroup);

      const chronoRing = new THREE.Mesh(new THREE.TorusGeometry(3.6, 0.14, 32, 90), matRoseGold);
      chronoRingGroup.add(chronoRing);

      // 24 Glowing Cyan Neon Chevrons
      const chevGeo = new THREE.BoxGeometry(0.06, 0.18, 0.16);
      for (let i = 0; i < 24; i++) {
        const ang = (i / 24) * Math.PI * 2;
        const ch = new THREE.Mesh(chevGeo, matNeonCyan);
        ch.position.set(Math.cos(ang) * 3.6, Math.sin(ang) * 3.6, 0);
        ch.rotation.z = ang;
        chronoRingGroup.add(ch);
      }

      // Dual Counter-Rotating Holographic Neon Arc Runners
      const neonArc1 = new THREE.Mesh(new THREE.TorusGeometry(3.86, 0.035, 16, 64, Math.PI * 1.3), matNeonCyan);
      chronoRingGroup.add(neonArc1);

      const neonArc2 = new THREE.Mesh(new THREE.TorusGeometry(3.86, 0.035, 16, 64, Math.PI * 0.9), matNeonPurple);
      neonArc2.rotation.z = Math.PI;
      chronoRingGroup.add(neonArc2);

      // ─────────────────────────────────────────────────────────────
      // 4. EQUATORIAL ORBITAL TRACK & 3 WEALTH CHRONO-SATELLITES
      // ─────────────────────────────────────────────────────────────
      const orbitTrackGroup = new THREE.Group();
      orbitTrackGroup.rotation.x = 1.05;
      orbitTrackGroup.rotation.z = 0.38;
      kineticVaultGroup.add(orbitTrackGroup);

      // Slender Gold Orbit Ellipse
      const orbitEllipse = new THREE.Mesh(new THREE.TorusGeometry(8.2, 0.045, 16, 140), matMirrorGold);
      orbitTrackGroup.add(orbitEllipse);

      // 3 Micro-Satellites / Chrono-Probes
      const satellites = [];
      const satBodyGeo = new THREE.CylinderGeometry(0.26, 0.26, 0.36, 6);
      const satWingGeo = new THREE.BoxGeometry(0.72, 0.032, 0.25);
      const satBeaconGeo = new THREE.SphereGeometry(0.10, 16, 16);

      for (let i = 0; i < 3; i++) {
        const satPivot = new THREE.Group();
        orbitTrackGroup.add(satPivot);

        const satSub = new THREE.Group();
        satSub.position.set(8.2, 0, 0);
        satPivot.add(satSub);

        const sBody = new THREE.Mesh(satBodyGeo, matMirrorGold);
        sBody.rotation.x = Math.PI / 2;
        satSub.add(sBody);

        const sWings = new THREE.Mesh(satWingGeo, matSapphire);
        satSub.add(sWings);

        const sBeacon = new THREE.Mesh(satBeaconGeo, matNeonCyan);
        sBeacon.position.y = 0.22;
        satSub.add(sBeacon);

        satPivot.rotation.z = (i / 3) * Math.PI * 2;
        satellites.push({ pivot: satPivot, speed: 0.008 + i * 0.002 });
      }

      // ─────────────────────────────────────────────────────────────
      // 5. CENTRAL MULTI-FACETED CRYSTAL HYPER-CORE & SINGULARITY
      // ─────────────────────────────────────────────────────────────
      const crystalCoreGroup = new THREE.Group();
      kineticVaultGroup.add(crystalCoreGroup);

      // Outer Sacred Geometric Dodecahedron Cage
      const dodecaWireGeo = new THREE.WireframeGeometry(new THREE.DodecahedronGeometry(1.95, 0));
      const dodecaLines = new THREE.LineSegments(dodecaWireGeo, new THREE.LineBasicMaterial({ color: 0xF59E0B, transparent: true, opacity: 0.55 }));
      crystalCoreGroup.add(dodecaLines);

      // 20 Golden Vertex Spherical Nodes
      const nodeGeo = new THREE.SphereGeometry(0.075, 16, 16);
      const dodecaGeoRaw = new THREE.DodecahedronGeometry(1.95, 0);
      const dodecaPos = dodecaGeoRaw.attributes.position.array;
      const seenNodes = new Set();
      for (let i = 0; i < dodecaPos.length; i += 3) {
        const key = `${dodecaPos[i].toFixed(2)},${dodecaPos[i+1].toFixed(2)},${dodecaPos[i+2].toFixed(2)}`;
        if (!seenNodes.has(key)) {
          seenNodes.add(key);
          const nodeMesh = new THREE.Mesh(nodeGeo, matMirrorGold);
          nodeMesh.position.set(dodecaPos[i], dodecaPos[i+1], dodecaPos[i+2]);
          crystalCoreGroup.add(nodeMesh);
        }
      }

      // Multi-Faceted Refractive Hyper-Crystal Prism
      const crystalGeo = new THREE.IcosahedronGeometry(1.55, 1);
      const crystalMesh = new THREE.Mesh(crystalGeo, matDiamondGlass);
      crystalCoreGroup.add(crystalMesh);

      // Inner Pulsating Singularity Star
      const singularityGeo = new THREE.SphereGeometry(0.72, 32, 32);
      const matSingularity = new THREE.MeshBasicMaterial({ color: 0xFBBF24 });
      const singularityHeart = new THREE.Mesh(singularityGeo, matSingularity);
      crystalCoreGroup.add(singularityHeart);

      // Dynamic Specular Core Light (Emits light from inside the crystal onto gears!)
      const corePointLight = new THREE.PointLight(0x38BDF8, 3.8, 16, 1.8);
      crystalCoreGroup.add(corePointLight);

      // Dual Floating Holographic Reticle Dials (Top & Bottom)
      const dialGeo = new THREE.RingGeometry(1.4, 1.46, 64);
      const dialMat = new THREE.MeshBasicMaterial({ color: 0x38BDF8, transparent: true, opacity: 0.60, side: THREE.DoubleSide });

      const topDial = new THREE.Mesh(dialGeo, dialMat);
      topDial.position.y = 2.1;
      topDial.rotation.x = Math.PI / 2;
      crystalCoreGroup.add(topDial);

      const botDial = new THREE.Mesh(dialGeo, dialMat);
      botDial.position.y = -2.1;
      botDial.rotation.x = Math.PI / 2;
      crystalCoreGroup.add(botDial);

      // ─────────────────────────────────────────────────────────────
      // 6. ORBITING WEALTH TREASURES: 16 MINTED 3D GOLD COINS
      // ─────────────────────────────────────────────────────────────
      const goldCoins = [];
      const coinDiskGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.09, 36);
      const coinRimGeo  = new THREE.TorusGeometry(0.46, 0.04, 16, 36);
      const coinStarGeo = new THREE.OctahedronGeometry(0.18, 0);

      for (let i = 0; i < 16; i++) {
        const coinGroup = new THREE.Group();

        const disk = new THREE.Mesh(coinDiskGeo, matMirrorGold);
        disk.rotation.x = Math.PI / 2;
        coinGroup.add(disk);

        const rim = new THREE.Mesh(coinRimGeo, matMirrorGold);
        coinGroup.add(rim);

        const star = new THREE.Mesh(coinStarGeo, matRoseGold);
        star.position.z = 0.048;
        coinGroup.add(star);

        const ang = (i / 16) * Math.PI * 2;
        const rad = 8.5 + (i % 3) * 1.5;
        const yBase = ((i % 4) - 1.5) * 1.6;

        coinGroup.position.set(Math.cos(ang) * rad, yBase, Math.sin(ang) * rad);
        coinGroup.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        lightStudioRoot.add(coinGroup);

        goldCoins.push({
          group: coinGroup,
          baseY: yBase,
          rad: rad,
          ang: ang,
          orbSpd: 0.006 + (i % 3) * 0.003,
          rotSpdX: 0.015 + Math.random() * 0.015,
          rotSpdY: 0.012 + Math.random() * 0.018,
          rotSpdZ: 0.008 + Math.random() * 0.010,
          bobSpd: 1.2 + Math.random() * 1.2
        });
      }

      // ─────────────────────────────────────────────────────────────
      // 7. 12 BRILLIANT CUT FLOATING DIAMONDS & GEMSTONES
      // ─────────────────────────────────────────────────────────────
      const floatingGems = [];
      const gemConfigs = [
        { geo: new THREE.OctahedronGeometry(0.42, 1), mat: new THREE.MeshStandardMaterial({ color: 0x0284C7, metalness: 0.2, roughness: 0.05, transparent: true, opacity: 0.90 }) }, // Sapphire
        { geo: new THREE.OctahedronGeometry(0.38, 0), mat: new THREE.MeshStandardMaterial({ color: 0x10B981, metalness: 0.3, roughness: 0.08, transparent: true, opacity: 0.90 }) }, // Emerald
        { geo: new THREE.OctahedronGeometry(0.40, 1), mat: new THREE.MeshStandardMaterial({ color: 0x8B5CF6, metalness: 0.2, roughness: 0.06, transparent: true, opacity: 0.90 }) }, // Amethyst
        { geo: new THREE.OctahedronGeometry(0.36, 0), mat: new THREE.MeshStandardMaterial({ color: 0xF59E0B, metalness: 0.4, roughness: 0.06, transparent: true, opacity: 0.92 }) }  // Sunstone Topaz
      ];

      for (let i = 0; i < 12; i++) {
        const cfg = gemConfigs[i % gemConfigs.length];
        const gMesh = new THREE.Mesh(cfg.geo, cfg.mat);
        const ang = (i / 12) * Math.PI * 2 + 0.3;
        const rad = 7.0 + (i % 2) * 2.2;
        const yOff = Math.sin(i * 1.5) * 2.8;

        gMesh.position.set(Math.cos(ang) * rad, yOff, Math.sin(ang) * rad);
        lightStudioRoot.add(gMesh);

        floatingGems.push({
          mesh: gMesh,
          baseY: yOff,
          ang: ang,
          rad: rad,
          rotSpd: 0.018 + Math.random() * 0.02,
          bobSpd: 1.4 + Math.random() * 1.4
        });
      }

      // ─────────────────────────────────────────────────────────────
      // 8. ARCHITECTURAL FLOOR HOLOGRAPHIC PROJECTION DIAL
      // ─────────────────────────────────────────────────────────────
      const floorDialGroup = new THREE.Group();
      floorDialGroup.position.y = -5.8;
      floorDialGroup.rotation.x = -Math.PI / 2;
      lightStudioRoot.add(floorDialGroup);

      const floorRing1 = new THREE.Mesh(new THREE.RingGeometry(5.0, 5.08, 96), matNeonCyan);
      floorDialGroup.add(floorRing1);

      const floorRing2 = new THREE.Mesh(new THREE.RingGeometry(7.2, 7.32, 96), matNeonPurple);
      floorDialGroup.add(floorRing2);

      const floorRing3 = new THREE.Mesh(new THREE.RingGeometry(9.4, 9.50, 120), matNeonCyan);
      floorDialGroup.add(floorRing3);

      // 12 Radial Compass Rays on Floor
      const rayGeo = new THREE.BoxGeometry(0.04, 4.4, 0.02);
      for (let i = 0; i < 12; i++) {
        const ang = (i / 12) * Math.PI * 2;
        const rMesh = new THREE.Mesh(rayGeo, matNeonCyan);
        rMesh.position.set(Math.cos(ang) * 7.2, Math.sin(ang) * 7.2, 0);
        rMesh.rotation.z = ang;
        floorDialGroup.add(rMesh);
      }

      // ─────────────────────────────────────────────────────────────
      // 9. 600+ DIAMOND DUST & GOLDEN STARLIGHT SPARKS
      // ─────────────────────────────────────────────────────────────
      const bokehTex = makeGlowSpriteTexture('245, 158, 11'); // Warm gold glow
      const bokehCount = 600;
      const bokehGeo = new THREE.BufferGeometry();
      const bPos = new Float32Array(bokehCount * 3);
      for (let i = 0; i < bokehCount; i++) {
        bPos[i * 3]     = (Math.random() - 0.5) * 44;
        bPos[i * 3 + 1] = (Math.random() - 0.5) * 32;
        bPos[i * 3 + 2] = (Math.random() - 0.5) * 44;
      }
      bokehGeo.setAttribute('position', new THREE.BufferAttribute(bPos, 3));
      const bokehMat = new THREE.PointsMaterial({
        map: bokehTex,
        size: 0.95,
        transparent: true,
        opacity: 0.42,
        blending: THREE.AdditiveBlending
      });
      lightStudioRoot.add(new THREE.Points(bokehGeo, bokehMat));


      // =============================================================
      // PART 3: INTERACTIVE CONTROLLER & THEME SWITCHING
      // =============================================================
      let targetPlanet = null;
      const overviewCameraPos = new THREE.Vector3(0, 18.0, 42.0);
      const overviewLookAt = new THREE.Vector3(0, -1.0, 0);
      const curLookAt = new THREE.Vector3(0, -1.0, 0);

      function updateHud(text) {
        const hud = document.getElementById('celestial-hud-text');
        if (hud) hud.textContent = text;
      }

      window.__smmFocusPlanet = function(name) {
        if (!name || name === 'overview') {
          targetPlanet = null;
          updateHud('SOL SYSTEM • REAL-TIME 3D UNIVERSE');
          document.querySelectorAll('.planet-dock-btn').forEach(b => b.classList.toggle('active', b.dataset.planet === 'overview'));
          return;
        }
        document.querySelectorAll('.planet-dock-btn').forEach(b => b.classList.toggle('active', b.dataset.planet === name));
        if (name === 'sun') {
          targetPlanet = { isSun: true, mesh: sunMesh, size: 2.4 };
          updateHud('TARGET: THE SUN • 1,392,700 KM • STELLAR CORE');
        } else {
          const pl = planets.find(p => p.name.toLowerCase() === name.toLowerCase());
          if (pl) {
            targetPlanet = pl;
            updateHud(`TARGET: ${pl.name.toUpperCase()} • [${pl.distAU} AU] • HD ORBIT INSPECTION`);
          }
        }
      };

      function wirePlanetDock() {
        document.querySelectorAll('.planet-dock-btn').forEach(btn => {
          btn.addEventListener('click', function(e) {
            e.stopPropagation();
            window.__smmFocusPlanet(this.dataset.planet);
          });
        });
      }
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', wirePlanetDock);
      } else {
        wirePlanetDock();
      }

      // Raycasting for direct planet click
      const raycaster = new THREE.Raycaster();
      const mouseVec = new THREE.Vector2();
      window.addEventListener('click', (e) => {
        if (!darkUniverseRoot.visible) return; // Only in Dark Mode
        if (e.target.closest('button, input, select, a, .metallic-card, .glass-card, #sidebar, #auth-card, #dash-content')) return;
        mouseVec.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouseVec.y = -(e.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouseVec, camera);
        const clickable = planets.map(p => p.mesh).concat([sunMesh]);
        const hits = raycaster.intersectObjects(clickable);
        if (hits.length > 0) {
          const hit = hits[0].object;
          if (hit === sunMesh) {
            window.__smmFocusPlanet('sun');
          } else {
            const found = planets.find(p => p.mesh === hit);
            if (found) window.__smmFocusPlanet(found.name.toLowerCase());
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
        darkUniverseRoot.visible = isDark;
        lightStudioRoot.visible  = !isDark;

        const dock = document.getElementById('celestial-planet-dock');
        const hudText = document.getElementById('celestial-hud-text');

        if (isDark) {
          if (dock) dock.style.display = '';
          if (hudText) hudText.textContent = targetPlanet ? `TARGET: ${targetPlanet.name.toUpperCase()} • HD ORBIT` : 'SOL SYSTEM • REAL-TIME 3D UNIVERSE';
          renderer.toneMappingExposure = 1.65;
        } else {
          if (dock) dock.style.display = 'none';
          if (hudText) hudText.textContent = '✨ PRISMATIC VAULT • KINETIC 3D STUDIO';
          renderer.toneMappingExposure = 1.35;
          targetPlanet = null;
        }
      };

      // Set initial state based on current page theme
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

        // A. DARK MODE: Solar System Animation
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

          if (targetPlanet) {
            const targetWorld = new THREE.Vector3();
            if (targetPlanet.isSun) {
              targetWorld.set(0, 0, 0);
              const closePos = new THREE.Vector3(0, 3.5, 8.5);
              camera.position.lerp(closePos, 0.05);
              curLookAt.lerp(targetWorld, 0.05);
            } else {
              targetPlanet.mesh.getWorldPosition(targetWorld);
              const offsetDist = targetPlanet.size * 3.6 + 1.4;
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
            curLookAt.lerp(overviewLookAt, 0.045);
            camera.lookAt(curLookAt);
            solarSystemGroup.rotation.x = 0.36 + curRotX * 0.12;
            solarSystemGroup.rotation.y = curRotY * 0.15;
          }
        }

        // B. LIGHT MODE: Prismatic Wealth Vault Animation
        // B. LIGHT MODE: Ultra-Detailed Prismatic Kinetic Vault Animation
        if (lightStudioRoot.visible) {
          // 1. Multi-Tiered Gyroscopic Astrolabe Rotation (Harmonic Swiss Pacing)
          platMasterGroup.rotation.y += 0.0032;
          platMasterGroup.rotation.z += 0.0018;

          goldGearGroup.rotation.x += 0.0062;
          goldGearGroup.rotation.y += 0.0038;

          chronoRingGroup.rotation.z -= 0.0085;
          chronoRingGroup.rotation.x -= 0.0045;

          // Holographic Neon Runners Glide on Ring
          neonArc1.rotation.z += 0.018;
          neonArc2.rotation.z -= 0.014;

          // 2. Equatorial Orbit Ellipse & Satellites Orbit
          orbitTrackGroup.rotation.z += 0.0028;
          satellites.forEach(sat => {
            sat.pivot.rotation.z += sat.speed;
          });

          // 3. Central Multi-Faceted Hyper-Crystal & Singularity Pulse
          crystalMesh.rotation.y += 0.010;
          crystalMesh.rotation.x = Math.sin(t * 0.9) * 0.12;

          dodecaLines.rotation.y -= 0.007;
          dodecaLines.rotation.z = Math.cos(t * 0.7) * 0.10;

          const singPulse = 1.0 + Math.sin(t * 2.2) * 0.08;
          singularityHeart.scale.set(singPulse, singPulse, singPulse);
          corePointLight.intensity = 3.4 + Math.sin(t * 2.8) * 0.8;

          topDial.rotation.z += 0.012;
          botDial.rotation.z -= 0.010;

          // 4. 16 Minted 3D Gold Coins Graceful Orbit & Tumbling
          goldCoins.forEach((c, idx) => {
            c.ang += c.orbSpd;
            c.group.position.x = Math.cos(c.ang) * c.rad;
            c.group.position.z = Math.sin(c.ang) * c.rad;
            c.group.position.y = c.baseY + Math.sin(t * c.bobSpd + idx) * 0.55;

            c.group.rotation.x += c.rotSpdX;
            c.group.rotation.y += c.rotSpdY;
            c.group.rotation.z += c.rotSpdZ;
          });

          // 5. 12 Brilliant Cut Faceted Gemstones Floating Bob
          floatingGems.forEach((g, idx) => {
            g.mesh.rotation.x += g.rotSpd;
            g.mesh.rotation.y += g.rotSpd * 1.3;
            g.mesh.position.y = g.baseY + Math.sin(t * g.bobSpd + idx) * 0.45;
          });

          // 6. Floor Holographic Dial Slow Laser Sweep
          floorDialGroup.rotation.z += 0.0012;

          // 7. Interactive Parallax & Dynamic Camera Easing
          const lightCamPos = new THREE.Vector3(
            curRotY * 8.0,
            5.5 - curRotX * 5.0,
            24.5
          );
          camera.position.lerp(lightCamPos, 0.045);
          curLookAt.lerp(new THREE.Vector3(0, -0.5, 0), 0.045);
          camera.lookAt(curLookAt);

          kineticVaultGroup.rotation.x = curRotX * 0.28;
          kineticVaultGroup.rotation.y = curRotY * 0.38;
        }

        renderer.render(scene, camera);
      }
      animate();
    })();
  </script>
