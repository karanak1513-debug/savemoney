# scratch/test_apply_settings_drawer.py
import re

new_snippet = """<!-- ── 3D CELESTIAL SETTINGS / CONTROLS TOGGLE BUTTON ───────── -->
  <button id="btn-celestial-settings" title="3D Celestial Navigator & Settings" aria-label="3D Universe Settings" style="
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
    <svg width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24" class="transition-transform duration-300 hover:rotate-90">
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
  </div>\n\n  """

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

start_marker = '<!-- ── 3D CELESTIAL TELEMETRY HUD ───────────────────────────── -->'
end_marker = '<!-- ── LIGHT / DARK MODE TOGGLE ────────────────────────────── -->'

idx_start = content.find(start_marker)
idx_end = content.find(end_marker)

updated = content[:idx_start] + new_snippet + content[idx_end:]

with open('scratch/test_drawer_index.html', 'w', encoding='utf-8') as f:
    f.write(updated)

print("test_drawer_index.html written successfully.")
