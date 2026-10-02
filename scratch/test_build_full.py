# scratch/test_build_full.py
import re
import subprocess
import os

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Update index.html replacement chunk
target_chunk_old = """  <!-- ── 3D CELESTIAL TELEMETRY HUD ───────────────────────────── -->
  <div id="celestial-hud-indicator" class="celestial-hud-pill hidden sm:inline-flex" title="Real-time 3D Universe Tracking">
    <span class="celestial-pulse-dot"></span>
    <span id="celestial-hud-text">SOL SYSTEM • REAL-TIME 3D UNIVERSE</span>
  </div>

  <!-- ── 3D PLANET SELECTOR DOCK (FLY TO ANY PLANET IN HD) ───── -->
  <div id="celestial-planet-dock" class="celestial-planet-bar hidden lg:inline-flex" aria-label="Solar System Planet Selector">
    <button class="planet-dock-btn active" data-planet="overview" title="Panoramic Solar System View">🌌 System</button>
    <button class="planet-dock-btn" data-planet="sun" title="The Sun">☀️ Sun</button>
    <button class="planet-dock-btn" data-planet="mercury" title="Mercury">☿ Mercury</button>
    <button class="planet-dock-btn" data-planet="venus" title="Venus">♀ Venus</button>
    <button class="planet-dock-btn" data-planet="earth" title="Earth & Moon">🌍 Earth</button>
    <button class="planet-dock-btn" data-planet="mars" title="Mars & Moons">♂ Mars</button>
    <button class="planet-dock-btn" data-planet="jupiter" title="Jupiter & Moons">♃ Jupiter</button>
    <button class="planet-dock-btn" data-planet="saturn" title="Saturn & Rings">♄ Saturn</button>
    <button class="planet-dock-btn" data-planet="uranus" title="Uranus">♅ Uranus</button>
    <button class="planet-dock-btn" data-planet="neptune" title="Neptune">♆ Neptune</button>
    <button class="planet-dock-btn" data-planet="pluto" title="Pluto & Charon">♇ Pluto</button>
  </div>"""

target_chunk_new = """  <!-- ── 3D CELESTIAL SETTINGS / CONTROLS TOGGLE BUTTON ───────── -->
  <button id="btn-celestial-settings" title="3D Universe Settings & Planet Navigator" aria-label="3D Universe Settings" style="
    position: fixed;
    top: 1rem;
    right: 4.2rem;
    z-index: 99990;
    width: 2.6rem;
    height: 2.6rem;
    border-radius: 50%;
    border: 1.5px solid rgba(255,255,255,0.18);
    background: rgba(255,255,255,0.12);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    box-shadow: 0 4px 18px rgba(0,0,0,0.18);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.22s cubic-bezier(0.34,1.56,0.64,1);
    color: #64748B;
  ">
    <svg width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  </button>

  <!-- ── 3D CELESTIAL NAVIGATOR & SETTINGS POPOVER DRAWER ───── -->
  <div id="celestial-settings-panel" class="celestial-settings-drawer" aria-hidden="true">
    <div class="celestial-drawer-inner">
      <div class="flex items-center justify-between gap-3 pb-2.5 border-b border-slate-200/80 dark:border-white/10 mb-2.5">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span class="text-[11px] font-mono font-bold tracking-wider text-charcoal dark:text-blue-400 uppercase">3D Universe &amp; Planet Controls</span>
        </div>
        <button id="btn-close-celestial-drawer" class="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-coolslate hover:text-charcoal dark:hover:text-white flex items-center justify-center text-xs transition-colors cursor-pointer" type="button" aria-label="Close">✕</button>
      </div>

      <!-- 3D Celestial Telemetry HUD Indicator -->
      <div id="celestial-hud-indicator" class="celestial-hud-pill mb-2.5 w-full justify-center" title="Real-time 3D Universe Tracking">
        <span class="celestial-pulse-dot"></span>
        <span id="celestial-hud-text">SOL SYSTEM • REAL-TIME 3D UNIVERSE</span>
      </div>

      <div class="text-[9.5px] font-mono font-bold text-coolslate dark:text-slate-400 mb-1.5 px-0.5 tracking-wider uppercase">Fly to Planet (HD Camera Orbit):</div>

      <!-- 3D Planet Selector Dock -->
      <div id="celestial-planet-dock" class="celestial-planet-bar flex flex-wrap gap-1.5 justify-center" aria-label="Solar System Planet Selector">
        <button class="planet-dock-btn active" data-planet="overview" title="Panoramic Solar System View">🌌 System</button>
        <button class="planet-dock-btn" data-planet="sun" title="The Sun">☀️ Sun</button>
        <button class="planet-dock-btn" data-planet="mercury" title="Mercury">☿ Mercury</button>
        <button class="planet-dock-btn" data-planet="venus" title="Venus">♀ Venus</button>
        <button class="planet-dock-btn" data-planet="earth" title="Earth & Moon">🌍 Earth</button>
        <button class="planet-dock-btn" data-planet="mars" title="Mars & Moons">♂ Mars</button>
        <button class="planet-dock-btn" data-planet="jupiter" title="Jupiter & Moons">♃ Jupiter</button>
        <button class="planet-dock-btn" data-planet="saturn" title="Saturn & Rings">♄ Saturn</button>
        <button class="planet-dock-btn" data-planet="uranus" title="Uranus">♅ Uranus</button>
        <button class="planet-dock-btn" data-planet="neptune" title="Neptune">♆ Neptune</button>
        <button class="planet-dock-btn" data-planet="pluto" title="Pluto & Charon">♇ Pluto</button>
      </div>

      <div class="text-[9.5px] font-mono text-coolslate dark:text-slate-400 mt-2.5 text-center">
        Tip: Click any planet to fly camera in HD, or tap anywhere in space.
      </div>
    </div>
  </div>"""

if target_chunk_old not in html:
    print("ERROR: target_chunk_old not found!")
    exit(1)

html_mod = html.replace(target_chunk_old, target_chunk_new, 1)

# Now check script wiring
old_wire_block = """      // Wire up toggle after DOM ready
      function wireToggle() {
        var btn = document.getElementById('theme-toggle-btn');
        if (!btn) return;
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
      }"""

new_wire_block = """      // Wire up toggle after DOM ready
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
      }"""

if old_wire_block not in html_mod:
    print("ERROR: old_wire_block not found!")
    exit(1)

html_mod = html_mod.replace(old_wire_block, new_wire_block, 1)

# Check theme color application on settings button
old_theme_apply = """          if (toggleBtn) {
            toggleBtn.style.background = 'rgba(15,23,42,0.55)';
            toggleBtn.style.borderColor = 'rgba(148,163,184,0.22)';
            toggleBtn.style.color = '#94A3B8';
          }"""

new_theme_apply = """          if (toggleBtn) {
            toggleBtn.style.background = 'rgba(15,23,42,0.55)';
            toggleBtn.style.borderColor = 'rgba(148,163,184,0.22)';
            toggleBtn.style.color = '#94A3B8';
          }
          var sBtnDark = document.getElementById('btn-celestial-settings');
          if (sBtnDark) {
            sBtnDark.style.background = 'rgba(15,23,42,0.55)';
            sBtnDark.style.borderColor = 'rgba(148,163,184,0.22)';
            sBtnDark.style.color = '#94A3B8';
          }"""

html_mod = html_mod.replace(old_theme_apply, new_theme_apply, 1)

old_theme_light = """          if (toggleBtn) {
            toggleBtn.style.background = 'rgba(255,255,255,0.75)';
            toggleBtn.style.borderColor = 'rgba(226,232,240,0.9)';
            toggleBtn.style.color = '#475569';
          }"""

new_theme_light = """          if (toggleBtn) {
            toggleBtn.style.background = 'rgba(255,255,255,0.75)';
            toggleBtn.style.borderColor = 'rgba(226,232,240,0.9)';
            toggleBtn.style.color = '#475569';
          }
          var sBtnLight = document.getElementById('btn-celestial-settings');
          if (sBtnLight) {
            sBtnLight.style.background = 'rgba(255,255,255,0.75)';
            sBtnLight.style.borderColor = 'rgba(226,232,240,0.9)';
            sBtnLight.style.color = '#475569';
          }"""

html_mod = html_mod.replace(old_theme_light, new_theme_light, 1)

# Write to a test file and validate scripts
with open('scratch/test_full_mod.html', 'w', encoding='utf-8') as f:
    f.write(html_mod)

print("scratch/test_full_mod.html written.")

# Validate inline scripts
pattern = re.compile(r'<script(?:\s+[^>]*)?>(.*?)</script>', re.DOTALL)
scripts = pattern.findall(html_mod)
print(f"Found {len(scripts)} inline scripts in test_full_mod.html")

for idx_s, s in enumerate(scripts):
    s_clean = s.strip()
    if not s_clean:
        continue
    temp_file = f"scratch/test_script_{idx_s}.js"
    with open(temp_file, 'w', encoding='utf-8') as tf:
        tf.write(s_clean)
    res = subprocess.run(["node", "-c", temp_file], capture_output=True, text=True)
    if res.returncode != 0:
        print(f"Script {idx_s} syntax error:\n{res.stderr}")
        exit(1)
    else:
        print(f"Script {idx_s} syntax OK")
    if os.path.exists(temp_file):
        os.remove(temp_file)

print("\nALL INLINE SCRIPTS IN TEST_FULL_MOD ARE 100% VALID!")
