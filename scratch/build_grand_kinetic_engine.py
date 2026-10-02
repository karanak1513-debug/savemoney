# -*- coding: utf-8 -*-
"""
Build the Grand Haute-Horlogerie Tourbillon Vault (Ultra-Detailed Light Mode).
"""
import re
import subprocess

print("Writing Grand Haute-Horlogerie 3D Engine...")

with open('scratch/ultra_dual_engine.js', 'r', encoding='utf-8') as f:
    code = f.read()

# Markers
p2_start_marker = '// =============================================================\n      // PART 2: LIGHT MODE'
p3_start_marker = '// =============================================================\n      // PART 3: INTERACTIVE CONTROLLER'
anim_start_marker = '// B. LIGHT MODE: Ultra-Detailed Prismatic Kinetic Vault Animation'
anim_end_marker = 'renderer.render(scene, camera);'

assert p2_start_marker in code, "p2_start_marker not found"
assert p3_start_marker in code, "p3_start_marker not found"
assert anim_start_marker in code, "anim_start_marker not found"
assert anim_end_marker in code, "anim_end_marker not found"

grand_part2 = r"""      // =============================================================
      // PART 2: LIGHT MODE — GRAND HAUTE-HORLOGERIE TOURBILLON VAULT
      // =============================================================

      // 1. Studio 5-Point High-Key Lighting (Ultra-Graphic Speculars)
      const lightStudioAmbient = new THREE.AmbientLight(0xF8FAFC, 2.3);
      lightStudioRoot.add(lightStudioAmbient);

      const lightStudioKeyLight = new THREE.DirectionalLight(0xFFFBEB, 4.0); // Warm Sunlight / 24K Gold
      lightStudioKeyLight.position.set(24, 34, 26);
      lightStudioRoot.add(lightStudioKeyLight);

      const lightStudioFillLight = new THREE.DirectionalLight(0x38BDF8, 2.0); // Crisp Sky Cyan
      lightStudioFillLight.position.set(-24, -16, 22);
      lightStudioRoot.add(lightStudioFillLight);

      const lightStudioRimLight = new THREE.DirectionalLight(0xF43F5E, 1.8); // Rose Gold Iridescent Rim
      lightStudioRimLight.position.set(0, 20, -26);
      lightStudioRoot.add(lightStudioRimLight);

      const lightStudioTopLight = new THREE.DirectionalLight(0xE0E7FF, 1.5); // Cool Overhead Studio Light
      lightStudioTopLight.position.set(0, 38, 0);
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
        roughness: 0.10
      });

      const matIngotGold = new THREE.MeshStandardMaterial({
        color: 0xFBBF24,
        metalness: 0.98,
        roughness: 0.06
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

      const matNeonEmerald = new THREE.MeshBasicMaterial({
        color: 0x10B981,
        transparent: true,
        opacity: 0.95
      });

      const matDiamondGlass = new THREE.MeshStandardMaterial({
        color: 0xE0F2FE,
        roughness: 0.03,
        metalness: 0.12,
        transparent: true,
        opacity: 0.92
      });

      const matRuby = new THREE.MeshStandardMaterial({ color: 0xE11D48, roughness: 0.08, metalness: 0.20 });
      const matSapphire = new THREE.MeshStandardMaterial({ color: 0x0284C7, roughness: 0.08, metalness: 0.20 });

      // ─────────────────────────────────────────────────────────────
      // 1. GRAND ZODIAC & FINANCIAL MILESTONES CHRONO-RING (Radius 10.4)
      // ─────────────────────────────────────────────────────────────
      const zodiacChronoGroup = new THREE.Group();
      kineticVaultGroup.add(zodiacChronoGroup);

      // Large Fine Titanium & Gold Outer Astrolabe Ring
      const zodiacRing = new THREE.Mesh(new THREE.TorusGeometry(10.4, 0.048, 16, 160), matTitanium);
      zodiacChronoGroup.add(zodiacRing);

      // 12 Milestone Plaque Badges (Every 30 Degrees)
      const milestoneBadges = [];
      const plaqueGeo = new THREE.BoxGeometry(0.55, 0.26, 0.06);
      const plaqueJewelGeo = new THREE.SphereGeometry(0.08, 12, 12);

      for (let i = 0; i < 12; i++) {
        const ang = (i / 12) * Math.PI * 2;
        const pMesh = new THREE.Mesh(plaqueGeo, matMirrorGold);
        pMesh.position.set(Math.cos(ang) * 10.4, Math.sin(ang) * 10.4, 0);
        pMesh.rotation.z = ang;
        zodiacChronoGroup.add(pMesh);

        const jMesh = new THREE.Mesh(plaqueJewelGeo, (i % 2 === 0) ? matRuby : matSapphire);
        jMesh.position.set(Math.cos(ang) * 10.4, Math.sin(ang) * 10.4, 0.05);
        zodiacChronoGroup.add(jMesh);
        milestoneBadges.push(pMesh);
      }

      // Slender 24K Gold Vernier Chrono-Needle (Grand Chronometer Hand)
      const chronoHandGroup = new THREE.Group();
      zodiacChronoGroup.add(chronoHandGroup);

      const handShaftGeo = new THREE.CylinderGeometry(0.038, 0.018, 10.2, 12);
      const handShaft = new THREE.Mesh(handShaftGeo, matMirrorGold);
      handShaft.position.y = 5.1;
      chronoHandGroup.add(handShaft);

      // Arrowhead Tip
      const arrowTipGeo = new THREE.ConeGeometry(0.12, 0.45, 12);
      const arrowTip = new THREE.Mesh(arrowTipGeo, matRuby);
      arrowTip.position.y = 10.4;
      chronoHandGroup.add(arrowTip);

      // Counterweight Crescent
      const counterGeo = new THREE.TorusGeometry(0.40, 0.04, 12, 24, Math.PI * 1.5);
      const counterMesh = new THREE.Mesh(counterGeo, matRoseGold);
      counterMesh.position.y = -0.40;
      chronoHandGroup.add(counterMesh);

      // ─────────────────────────────────────────────────────────────
      // 2. OUTER MASTER GIMBAL RING (Platinum & Calibrated Chrono-Rim)
      // ─────────────────────────────────────────────────────────────
      const platMasterGroup = new THREE.Group();
      kineticVaultGroup.add(platMasterGroup);

      const platRing = new THREE.Mesh(new THREE.TorusGeometry(6.4, 0.22, 36, 128), matPlatinum);
      platMasterGroup.add(platRing);

      const railGeo = new THREE.TorusGeometry(6.72, 0.038, 16, 100);
      const topRail = new THREE.Mesh(railGeo, matTitanium);
      topRail.position.z = 0.22;
      platMasterGroup.add(topRail);

      const botRail = new THREE.Mesh(railGeo, matTitanium);
      botRail.position.z = -0.22;
      platMasterGroup.add(botRail);

      // 72 Laser-Engraved Degree Calibration Ticks
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

      // 12 Golden Hexagonal Rivet-Bolts
      const boltGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.08, 6);
      for (let i = 0; i < 12; i++) {
        const ang = (i / 12) * Math.PI * 2;
        const bolt = new THREE.Mesh(boltGeo, matMirrorGold);
        bolt.position.set(Math.cos(ang) * 6.64, Math.sin(ang) * 6.64, 0);
        bolt.rotation.x = Math.PI / 2;
        bolt.rotation.z = ang;
        platMasterGroup.add(bolt);
      }

      // 4 Heavy Gimbal Pivot Sockets
      const pivotSocketGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.36, 16);
      const rubyBearingGeo = new THREE.SphereGeometry(0.12, 16, 16);

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
      // 3. MIDDLE 24K FLUTED ESCAPEMENT GEAR RING (Gold Tourbillon)
      // ─────────────────────────────────────────────────────────────
      const goldGearGroup = new THREE.Group();
      goldGearGroup.rotation.x = Math.PI / 4.2;
      goldGearGroup.rotation.z = 0.18;
      kineticVaultGroup.add(goldGearGroup);

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

      // 4 Cardinal Sapphire & Ruby Jewel Bearings
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

        const collar = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.04, 12, 24), matMirrorGold);
        collar.position.copy(jMesh.position);
        goldGearGroup.add(collar);
      });

      // ─────────────────────────────────────────────────────────────
      // 4. INNER CHRONO-AURA RING (Rose Gold & Holographic Runners)
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
      // 5. EQUATORIAL ORBITAL TRACK & 3 WEALTH CHRONO-SATELLITES
      // ─────────────────────────────────────────────────────────────
      const orbitTrackGroup = new THREE.Group();
      orbitTrackGroup.rotation.x = 1.05;
      orbitTrackGroup.rotation.z = 0.38;
      kineticVaultGroup.add(orbitTrackGroup);

      const orbitEllipse = new THREE.Mesh(new THREE.TorusGeometry(8.2, 0.045, 16, 140), matMirrorGold);
      orbitTrackGroup.add(orbitEllipse);

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
      // 6. CENTRAL HYPER-CORE, INTERLOCKING GEARS & BALANCE WHEEL
      // ─────────────────────────────────────────────────────────────
      const crystalCoreGroup = new THREE.Group();
      kineticVaultGroup.add(crystalCoreGroup);

      // Outer Sacred Geometric Dodecahedron Cage
      const dodecaWireGeo = new THREE.WireframeGeometry(new THREE.DodecahedronGeometry(1.95, 0));
      const dodecaLines = new THREE.LineSegments(dodecaWireGeo, new THREE.LineBasicMaterial({ color: 0xF59E0B, transparent: true, opacity: 0.55 }));
      crystalCoreGroup.add(dodecaLines);

      // 20 Golden Vertex Nodes
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

      // ── Visible Planetary Gear Train ──
      const gearSunGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.16, 18);
      const sunGear = new THREE.Mesh(gearSunGeo, matMirrorGold);
      crystalCoreGroup.add(sunGear);

      const planetaryGears = [];
      const pGearGeo = new THREE.CylinderGeometry(0.26, 0.26, 0.14, 12);
      for (let i = 0; i < 3; i++) {
        const pPivot = new THREE.Group();
        pPivot.rotation.z = (i / 3) * Math.PI * 2;
        crystalCoreGroup.add(pPivot);

        const pMesh = new THREE.Mesh(pGearGeo, matRoseGold);
        pMesh.position.x = 0.72;
        pPivot.add(pMesh);
        planetaryGears.push({ pivot: pPivot, gear: pMesh });
      }

      // ── Oscillating Tourbillon Balance Wheel & Hairspring ──
      const balanceWheelGroup = new THREE.Group();
      balanceWheelGroup.position.z = 0.25;
      crystalCoreGroup.add(balanceWheelGroup);

      const balanceRim = new THREE.Mesh(new THREE.TorusGeometry(0.88, 0.032, 16, 48), matMirrorGold);
      balanceWheelGroup.add(balanceRim);

      // Balance Wheel 2 Diametric Spokes
      const spokeGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.76, 8);
      const spoke1 = new THREE.Mesh(spokeGeo, matTitanium);
      spoke1.rotation.z = Math.PI / 2;
      balanceWheelGroup.add(spoke1);

      // Inner Pulsating Singularity Star Heart
      const singularityGeo = new THREE.SphereGeometry(0.68, 32, 32);
      const matSingularity = new THREE.MeshBasicMaterial({ color: 0xFBBF24 });
      const singularityHeart = new THREE.Mesh(singularityGeo, matSingularity);
      crystalCoreGroup.add(singularityHeart);

      // Dynamic Internal Specular PointLight
      const corePointLight = new THREE.PointLight(0x38BDF8, 3.8, 16, 1.8);
      crystalCoreGroup.add(corePointLight);

      // Dual Floating Holographic Reticle Dials
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
      // 7. 8 RADIANT VOLUMETRIC LIGHT CAUSTICS (Prismatic Sunbeams)
      // ─────────────────────────────────────────────────────────────
      const causticBeams = [];
      const beamGeo = new THREE.CylinderGeometry(0.12, 1.8, 14.0, 16, 1, true);
      const beamMat = new THREE.MeshBasicMaterial({
        color: 0x38BDF8,
        transparent: true,
        opacity: 0.12,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
      });

      for (let i = 0; i < 8; i++) {
        const bMesh = new THREE.Mesh(beamGeo, beamMat);
        const ang = (i / 8) * Math.PI * 2;
        bMesh.position.set(Math.cos(ang) * 5.0, Math.sin(ang) * 5.0, -1.0);
        bMesh.rotation.z = ang + Math.PI / 2;
        bMesh.rotation.x = Math.PI / 2;
        crystalCoreGroup.add(bMesh);
        causticBeams.push(bMesh);
      }

      // ─────────────────────────────────────────────────────────────
      // 8. 4 FLOATING 3D HOLOGRAPHIC CURRENCY & WEALTH CRESTS
      // ─────────────────────────────────────────────────────────────
      const currencyGlyphs = [];

      // Helper to build 3D Rupee symbol (₹)
      function createRupeeGlyph() {
        const g = new THREE.Group();
        const bMat = matMirrorGold;
        // Top horizontal bar
        const topBar = new THREE.Mesh(new THREE.BoxGeometry(0.70, 0.09, 0.09), bMat);
        topBar.position.set(0, 0.40, 0);
        g.add(topBar);
        // Middle horizontal bar
        const midBar = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.08, 0.08), bMat);
        midBar.position.set(-0.06, 0.18, 0);
        g.add(midBar);
        // Semi-circle curved loop
        const loop = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.045, 12, 24, Math.PI), bMat);
        loop.position.set(0.08, 0.18, 0);
        loop.rotation.z = -Math.PI / 2;
        g.add(loop);
        // Down stem
        const stem = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.50, 0.09), bMat);
        stem.position.set(-0.25, 0.15, 0);
        g.add(stem);
        // Diagonal leg
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.55, 0.09), bMat);
        leg.position.set(0.08, -0.22, 0);
        leg.rotation.z = Math.PI / 4.2;
        g.add(leg);
        return g;
      }

      // Helper for Dollar Glyph ($)
      function createDollarGlyph() {
        const g = new THREE.Group();
        const dMat = matNeonEmerald;
        const sGeo = new THREE.TorusGeometry(0.24, 0.045, 12, 32, Math.PI * 1.5);
        const topLoop = new THREE.Mesh(sGeo, dMat);
        topLoop.position.set(0, 0.16, 0);
        g.add(topLoop);

        const botLoop = new THREE.Mesh(sGeo, dMat);
        botLoop.position.set(0, -0.16, 0);
        botLoop.rotation.z = Math.PI;
        g.add(botLoop);

        const spine = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, 0.95, 12), matMirrorGold);
        g.add(spine);
        return g;
      }

      // Helper for Euro Glyph (€)
      function createEuroGlyph() {
        const g = new THREE.Group();
        const eMat = matSapphire;
        const arc = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.045, 12, 32, Math.PI * 1.4), eMat);
        arc.rotation.z = Math.PI * 0.3;
        g.add(arc);
        const bar1 = new THREE.Mesh(new THREE.BoxGeometry(0.40, 0.06, 0.06), matMirrorGold);
        bar1.position.set(-0.06, 0.08, 0);
        g.add(bar1);
        const bar2 = new THREE.Mesh(new THREE.BoxGeometry(0.40, 0.06, 0.06), matMirrorGold);
        bar2.position.set(-0.06, -0.08, 0);
        g.add(bar2);
        return g;
      }

      // Helper for Solitaire Diamond Crest (💎)
      function createDiamondCrest() {
        const g = new THREE.Group();
        const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.42, 1), matRuby);
        g.add(gem);
        const wire = new THREE.LineSegments(new THREE.WireframeGeometry(new THREE.OctahedronGeometry(0.44, 1)), new THREE.LineBasicMaterial({ color: 0xF59E0B }));
        g.add(wire);
        return g;
      }

      const glyphFactories = [createRupeeGlyph, createDollarGlyph, createEuroGlyph, createDiamondCrest];
      for (let i = 0; i < 4; i++) {
        const gMesh = glyphFactories[i]();
        const ang = (i / 4) * Math.PI * 2;
        const rad = 9.2;
        const yPos = (i % 2 === 0 ? 1.5 : -1.5);
        gMesh.position.set(Math.cos(ang) * rad, yPos, Math.sin(ang) * rad);
        lightStudioRoot.add(gMesh);
        currencyGlyphs.push({
          group: gMesh,
          rad: rad,
          ang: ang,
          yBase: yPos,
          speed: 0.0055,
          rotY: 0.015 + i * 0.005
        });
      }

      // ─────────────────────────────────────────────────────────────
      // 9. 8 FLOATING 24K GOLD BULLION BARS (INGOTS)
      // ─────────────────────────────────────────────────────────────
      const goldBars = [];
      const barGeo = new THREE.BoxGeometry(0.82, 0.40, 0.20);
      const barRimGeo = new THREE.WireframeGeometry(new THREE.BoxGeometry(0.84, 0.42, 0.22));

      for (let i = 0; i < 8; i++) {
        const barGroup = new THREE.Group();

        const barMesh = new THREE.Mesh(barGeo, matIngotGold);
        barGroup.add(barMesh);

        const wire = new THREE.LineSegments(barRimGeo, new THREE.LineBasicMaterial({ color: 0xFFFBEB, transparent: true, opacity: 0.4 }));
        barGroup.add(wire);

        const ang = (i / 8) * Math.PI * 2 + 0.4;
        const rad = 11.2;
        const yBase = Math.sin(i * 1.2) * 3.2;

        barGroup.position.set(Math.cos(ang) * rad, yBase, Math.sin(ang) * rad);
        barGroup.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        lightStudioRoot.add(barGroup);

        goldBars.push({
          group: barGroup,
          rad: rad,
          ang: ang,
          yBase: yBase,
          orbSpd: 0.0045,
          rotX: 0.012,
          rotY: 0.016,
          rotZ: 0.008,
          bobSpd: 1.1 + (i % 3) * 0.4
        });
      }

      // ─────────────────────────────────────────────────────────────
      // 10. 16 MINTED 3D GOLD COINS (Raised Rim & Star Medallion)
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
      // 11. 12 BRILLIANT CUT FLOATING DIAMONDS & GEMSTONES
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
      // 12. DOUBLE-HELIX QUANTUM ENERGY VORTEX (160 SPARKS)
      // ─────────────────────────────────────────────────────────────
      const helixCount = 160;
      const helixGeo = new THREE.BufferGeometry();
      const hPos = new Float32Array(helixCount * 3);
      for (let i = 0; i < helixCount; i++) {
        const prog = (i / helixCount);
        const y = (prog - 0.5) * 10.0;
        const theta = prog * Math.PI * 8.0 + (i % 2 === 0 ? 0 : Math.PI);
        const r = 1.35 + Math.sin(prog * Math.PI) * 0.8;
        hPos[i * 3]     = Math.cos(theta) * r;
        hPos[i * 3 + 1] = y;
        hPos[i * 3 + 2] = Math.sin(theta) * r;
      }
      helixGeo.setAttribute('position', new THREE.BufferAttribute(hPos, 3));
      const helixMat = new THREE.PointsMaterial({
        color: 0x06B6D4,
        size: 0.65,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending
      });
      const helixPoints = new THREE.Points(helixGeo, helixMat);
      kineticVaultGroup.add(helixPoints);

      // ─────────────────────────────────────────────────────────────
      // 13. ARCHITECTURAL FLOOR HOLOGRAPHIC PROJECTION DIAL
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

      const rayGeo = new THREE.BoxGeometry(0.04, 4.4, 0.02);
      for (let i = 0; i < 12; i++) {
        const ang = (i / 12) * Math.PI * 2;
        const rMesh = new THREE.Mesh(rayGeo, matNeonCyan);
        rMesh.position.set(Math.cos(ang) * 7.2, Math.sin(ang) * 7.2, 0);
        rMesh.rotation.z = ang;
        floorDialGroup.add(rMesh);
      }

      // ─────────────────────────────────────────────────────────────
      // 14. 600+ DIAMOND DUST & GOLDEN STARLIGHT SPARKS
      // ─────────────────────────────────────────────────────────────
      const bokehTex = makeGlowSpriteTexture('245, 158, 11');
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
"""

grand_anim = r"""        // B. LIGHT MODE: Grand Haute-Horlogerie Tourbillon Vault Animation
        if (lightStudioRoot.visible) {
          // 1. Grand Zodiac Chrono-Ring & Sweeping Chronometer Hand
          zodiacChronoGroup.rotation.z += 0.0012;
          chronoHandGroup.rotation.z -= 0.0065; // Precision sweeping second hand

          // 2. Multi-Tiered Gyroscopic Astrolabe Rotation (Harmonic Swiss Pacing)
          platMasterGroup.rotation.y += 0.0032;
          platMasterGroup.rotation.z += 0.0018;

          goldGearGroup.rotation.x += 0.0062;
          goldGearGroup.rotation.y += 0.0038;

          chronoRingGroup.rotation.z -= 0.0085;
          chronoRingGroup.rotation.x -= 0.0045;

          // Holographic Neon Runners Glide on Ring
          neonArc1.rotation.z += 0.018;
          neonArc2.rotation.z -= 0.014;

          // 3. Equatorial Orbit Ellipse & Satellites Orbit
          orbitTrackGroup.rotation.z += 0.0028;
          satellites.forEach(sat => {
            sat.pivot.rotation.z += sat.speed;
          });

          // 4. Central Multi-Faceted Hyper-Crystal, Gears & Balance Wheel
          crystalMesh.rotation.y += 0.010;
          crystalMesh.rotation.x = Math.sin(t * 0.9) * 0.12;

          dodecaLines.rotation.y -= 0.007;
          dodecaLines.rotation.z = Math.cos(t * 0.7) * 0.10;

          // Sun Gear and Planetary Epicyclic Gears
          sunGear.rotation.y += 0.024;
          planetaryGears.forEach(pg => {
            pg.pivot.rotation.z += 0.008;
            pg.gear.rotation.y -= 0.028;
          });

          // High-frequency Swiss Balance Wheel Spring Oscillation
          balanceWheelGroup.rotation.z = Math.sin(t * 6.5) * 0.45;

          const singPulse = 1.0 + Math.sin(t * 2.2) * 0.08;
          singularityHeart.scale.set(singPulse, singPulse, singPulse);
          corePointLight.intensity = 3.4 + Math.sin(t * 2.8) * 0.8;

          topDial.rotation.z += 0.012;
          botDial.rotation.z -= 0.010;

          // 5. Volumetric Light Caustic Beams Rotation
          causticBeams.forEach((bm, idx) => {
            bm.rotation.z += 0.004 + idx * 0.0005;
          });

          // 6. 4 Floating Holographic Currency Glyphs (₹, $, €, 💎)
          currencyGlyphs.forEach(cg => {
            cg.ang += cg.speed;
            cg.group.position.x = Math.cos(cg.ang) * cg.rad;
            cg.group.position.z = Math.sin(cg.ang) * cg.rad;
            cg.group.rotation.y += cg.rotY;
            cg.group.position.y = cg.yBase + Math.sin(t * 1.5 + cg.ang) * 0.40;
          });

          // 7. 8 Minted 24K Gold Bullion Bars (Ingots) Tumbling
          goldBars.forEach((gb, idx) => {
            gb.ang += gb.orbSpd;
            gb.group.position.x = Math.cos(gb.ang) * gb.rad;
            gb.group.position.z = Math.sin(gb.ang) * gb.rad;
            gb.group.position.y = gb.yBase + Math.sin(t * gb.bobSpd + idx) * 0.45;
            gb.group.rotation.x += gb.rotX;
            gb.group.rotation.y += gb.rotY;
            gb.group.rotation.z += gb.rotZ;
          });

          // 8. 16 Minted 3D Gold Coins Graceful Orbit & Tumbling
          goldCoins.forEach((c, idx) => {
            c.ang += c.orbSpd;
            c.group.position.x = Math.cos(c.ang) * c.rad;
            c.group.position.z = Math.sin(c.ang) * c.rad;
            c.group.position.y = c.baseY + Math.sin(t * c.bobSpd + idx) * 0.55;

            c.group.rotation.x += c.rotSpdX;
            c.group.rotation.y += c.rotSpdY;
            c.group.rotation.z += c.rotSpdZ;
          });

          // 9. 12 Brilliant Cut Faceted Gemstones Floating Bob
          floatingGems.forEach((g, idx) => {
            g.mesh.rotation.x += g.rotSpd;
            g.mesh.rotation.y += g.rotSpd * 1.3;
            g.mesh.position.y = g.baseY + Math.sin(t * g.bobSpd + idx) * 0.45;
          });

          // 10. Double-Helix Upward Energy Stream
          const hP = helixGeo.attributes.position.array;
          for (let i = 0; i < helixCount; i++) {
            hP[i * 3 + 1] += 0.05;
            if (hP[i * 3 + 1] > 5.0) hP[i * 3 + 1] = -5.0;
          }
          helixGeo.attributes.position.needsUpdate = true;
          helixPoints.rotation.y += 0.015;

          // 11. Floor Holographic Dial Slow Laser Sweep
          floorDialGroup.rotation.z += 0.0012;

          // 12. Interactive Parallax & Dynamic Camera Easing
          const lightCamPos = new THREE.Vector3(
            curRotY * 8.0,
            5.5 - curRotX * 5.0,
            25.5
          );
          camera.position.lerp(lightCamPos, 0.045);
          curLookAt.lerp(new THREE.Vector3(0, -0.5, 0), 0.045);
          camera.lookAt(curLookAt);

          kineticVaultGroup.rotation.x = curRotX * 0.28;
          kineticVaultGroup.rotation.y = curRotY * 0.38;
        }
"""

p2_start = code.find(p2_start_marker)
p3_start = code.find(p3_start_marker)
step1 = code[:p2_start] + grand_part2 + '\n\n      ' + code[p3_start:]

a_start = step1.find(anim_start_marker)
if_start = step1.rfind('if (lightStudioRoot.visible) {', 0, a_start + 100)
a_end = step1.find(anim_end_marker, if_start)
step2 = step1[:if_start] + grand_anim.strip() + '\n\n        ' + step1[a_end:]

with open('scratch/grand_dual_engine.js', 'w', encoding='utf-8') as f:
    f.write(step2)

print("Saved scratch/grand_dual_engine.js successfully! Length:", len(step2))
