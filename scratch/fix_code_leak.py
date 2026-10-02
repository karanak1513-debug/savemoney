# -*- coding: utf-8 -*-
import re

print("Fixing raw code leakage in index.html...")

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Marker where the double animation starts
start_str = '// B. LIGHT MODE: Prismatic Wealth Vault Animation'
end_marker = '<!-- ============================================================ -->\n  <!-- ES6 MODULE JAVASCRIPT'

idx_start = html.find(start_str)
assert idx_start != -1, "start_str not found!"

idx_end = html.find(end_marker, idx_start)
assert idx_end != -1, "end_marker not found!"

grand_anim_clean = r"""// B. LIGHT MODE: Grand Haute-Horlogerie Tourbillon Vault Animation
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

        renderer.render(scene, camera);
      }
      animate();
    })();
  </script>
"""

new_html = html[:idx_start] + grand_anim_clean + '\n' + html[idx_end:]

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_html)

print("SUCCESS: Fixed code leak! New length:", len(new_html))
