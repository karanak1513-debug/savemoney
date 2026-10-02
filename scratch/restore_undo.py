# -*- coding: utf-8 -*-
import re

print("Restoring index.html to pre-Avengers state...")

with open('scratch/dual_engine.js', 'r', encoding='utf-8') as f:
    dual_code = f.read()

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Remove Marvel dock
dock_pat = r'\s*<!-- ── 3D MARVEL AVENGERS ROSTER DOCK \(LIGHT MODE\) ─────────── -->\s*<div id="avengers-roster-dock"[\s\S]*?</div>'
html = re.sub(dock_pat, '', html)
print("Avengers dock removed.")

# 2. Find boundaries of 3D engine
start_idx = html.find('<!-- 3D DUAL-MODE UNIVERSE & MARVEL AVENGERS ENGINE v10')
if start_idx == -1:
    start_idx = html.find('<!-- 3D DUAL-MODE UNIVERSE')

prev_sep = html.rfind('<!-- ============================================================ -->', 0, start_idx)

mod_idx = html.find('<!-- ES6 MODULE JAVASCRIPT', prev_sep)
end_sep = html.rfind('<!-- ============================================================ -->', 0, mod_idx)

print(f"Replacement range: {prev_sep} to {end_sep}")
assert prev_sep != -1 and end_sep != -1 and prev_sep < end_sep

reverted_html = html[:prev_sep] + dual_code.strip() + '\n\n' + html[end_sep:]

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(reverted_html)

print("SUCCESS: index.html has been completely reverted to Dual-Mode Engine v9 (pre-Avengers)!")
