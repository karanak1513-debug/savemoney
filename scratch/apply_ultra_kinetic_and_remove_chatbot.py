# -*- coding: utf-8 -*-
"""
Apply Ultra-Detailed Kinetic Vault Studio 3D engine to index.html
and remove chatbot completely.
"""
import re
import subprocess

print("Applying Ultra-Detailed Kinetic Vault Engine & Removing Chatbot...")

with open('scratch/ultra_dual_engine.js', 'r', encoding='utf-8') as f:
    ultra_engine_code = f.read().strip()

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# ─────────────────────────────────────────────────────────────
# 1. REPLACE 3D SCRIPT IN index.html
# ─────────────────────────────────────────────────────────────
# Find the start of the 3D script comment
m_start = html.find('<!-- 3D DUAL-MODE UNIVERSE & KINETIC STUDIO ENGINE')
if m_start == -1:
    m_start = html.find('<!-- 3D DUAL-MODE UNIVERSE')

prev_sep = html.rfind('<!-- ============================================================ -->', 0, m_start)

# Find the end of the 3D script (before ES6 module script)
m_mod = html.find('<!-- ES6 MODULE JAVASCRIPT', prev_sep)
end_sep = html.rfind('<!-- ============================================================ -->', 0, m_mod)

print(f"3D Engine range in index.html: {prev_sep} to {end_sep}")
assert prev_sep != -1 and end_sep != -1 and prev_sep < end_sep, "Could not find 3D engine boundaries!"

html_with_3d = html[:prev_sep] + ultra_engine_code + '\n\n' + html[end_sep:]

# ─────────────────────────────────────────────────────────────
# 2. REMOVE CHATBOT JS ENGINE FROM ES6 MODULE
# ─────────────────────────────────────────────────────────────
sg_js_start_str = '// ░░  SAVING GUIDE — HYBRID BOT & LIVE ADMIN DESK ENGINE  ░░'
sg_js_idx = html_with_3d.find(sg_js_start_str)
assert sg_js_idx != -1, "Saving Guide JS engine not found!"

# Find the separator line right before it
sg_js_prev_sep = html_with_3d.rfind('// ================================================================', 0, sg_js_idx)

# Find the end of the IIFE
sg_js_end_str = '    })(); // IIFE end'
sg_js_end_idx = html_with_3d.find(sg_js_end_str, sg_js_idx)
assert sg_js_end_idx != -1, "Saving Guide JS engine end not found!"
sg_js_end_pos = sg_js_end_idx + len(sg_js_end_str)

html_no_chat_js = html_with_3d[:sg_js_prev_sep] + '    // Saving Guide Chatbot removed as requested.\n' + html_with_3d[sg_js_end_pos:]
print("Chatbot JS engine successfully removed.")

# ─────────────────────────────────────────────────────────────
# 3. REMOVE CHATBOT HTML (Launcher, Window, Modals, Admin Desk)
# ─────────────────────────────────────────────────────────────
sg_html_start_str = '<!-- ░░  SAVING GUIDE — HYBRID BOT & LIVE ADMIN DESK HTML  ░░'
sg_html_idx = html_no_chat_js.find(sg_html_start_str)
assert sg_html_idx != -1, "Saving Guide HTML start not found!"

sg_html_prev_sep = html_no_chat_js.rfind('<!-- ================================================================ -->', 0, sg_html_idx)

# Find </body>
body_close_idx = html_no_chat_js.rfind('</body>')
assert body_close_idx != -1, "</body> tag not found!"

html_final = html_no_chat_js[:sg_html_prev_sep] + '\n' + html_no_chat_js[body_close_idx:]
print("Chatbot HTML elements successfully removed.")

# ─────────────────────────────────────────────────────────────
# 4. WRITE UPDATED index.html
# ─────────────────────────────────────────────────────────────
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html_final)

print("Successfully written updated index.html! New length:", len(html_final))
