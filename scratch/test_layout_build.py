# scratch/test_layout_build.py
import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Verify boundaries
start_marker = '<!-- ============================================================ -->\n  <!-- 1. FULL AUTONOMOUS SPA COCKPIT WITH LOWER NAVIGATION DOCK    -->'
end_marker = '<!-- ============================================================ -->\n  <!-- 3D DUAL-MODE UNIVERSE & KINETIC STUDIO ENGINE v9               -->'

idx_start = content.find(start_marker)
idx_end = content.find(end_marker)

print(f"Start index: {idx_start}, End index: {idx_end}")
if idx_start == -1 or idx_end == -1:
    print("ERROR: Markers not found!")
    exit(1)

print("Original length of section to replace:", idx_end - idx_start)
