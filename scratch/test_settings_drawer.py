# scratch/test_settings_drawer.py
import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Let's inspect lines 1320-1375 in index.html
start_marker = '<!-- ── 3D CELESTIAL TELEMETRY HUD ───────────────────────────── -->'
end_marker = '<!-- ── LIGHT / DARK MODE TOGGLE ────────────────────────────── -->'

idx_start = content.find(start_marker)
idx_end = content.find(end_marker)

print("idx_start:", idx_start, "idx_end:", idx_end)
if idx_start == -1 or idx_end == -1:
    print("ERROR: Markers not found!")
    exit(1)

print("Section to replace:\n", content[idx_start:idx_end])
