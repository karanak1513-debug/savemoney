import re
import sys

print("Building Ultra-Graphic Photorealistic Solar System & Universe Engine v7...")

# Read index.html
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Define the start and end markers of the Three.js solar script
start_marker = "<!-- 3D HYPER-REALISTIC UNIVERSE & SOLAR SYSTEM ENGINE"
end_marker = "<!-- ============================================================\n  <!-- ES6 MODULE JAVASCRIPT: APPLICATION LOGIC"

start_idx = html.find(start_marker)
if start_idx == -1:
    # Try alternate start marker
    start_marker = "initPhotorealisticSolarSystem"
    start_idx = html.find(start_marker)
    if start_idx != -1:
        # back up to <script>
        start_idx = html.rfind('<script>', 0, start_idx)

end_idx = html.find(end_marker)

print(f"Found markers: start={start_idx}, end={end_idx}")
assert start_idx != -1 and end_idx != -1, "Could not locate exact script boundaries!"
