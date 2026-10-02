# -*- coding: utf-8 -*-
import subprocess

print("Injecting Grand Dual Engine into index.html...")

with open('scratch/grand_dual_engine.js', 'r', encoding='utf-8') as f:
    grand_engine = f.read().strip()

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

m_start = html.find('<!-- 3D DUAL-MODE UNIVERSE & KINETIC STUDIO ENGINE')
if m_start == -1:
    m_start = html.find('<!-- 3D DUAL-MODE UNIVERSE')

prev_sep = html.rfind('<!-- ============================================================ -->', 0, m_start)

m_mod = html.find('<!-- ES6 MODULE JAVASCRIPT', prev_sep)
end_sep = html.rfind('<!-- ============================================================ -->', 0, m_mod)

print(f"Replacement range: {prev_sep} to {end_sep}")
assert prev_sep != -1 and end_sep != -1 and prev_sep < end_sep

new_html = html[:prev_sep] + grand_engine + '\n\n' + html[end_sep:]

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_html)

print("SUCCESS: Injected Grand Haute-Horlogerie Engine into index.html! New length:", len(new_html))
