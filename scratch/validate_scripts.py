# -*- coding: utf-8 -*-
import subprocess
import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Find inline scripts without src attribute
scripts = re.findall(r'<script(?![^>]*src=)([^>]*)>([\s\S]*?)</script>', html)
print(f'Found {len(scripts)} inline script tags.')

all_ok = True
for idx, (attrs, body) in enumerate(scripts):
    body = body.strip()
    if not body:
        continue
    test_file = f'scratch/test_inline_{idx}.js'
    # if it's a module, replace import/export or write with .mjs
    ext = '.mjs' if 'type="module"' in attrs or "type='module'" in attrs else '.js'
    test_file = f'scratch/test_inline_{idx}{ext}'
    with open(test_file, 'w', encoding='utf-8') as tf:
        tf.write(body)
    res = subprocess.run(['node', '-c', test_file], capture_output=True, text=True)
    if res.returncode == 0:
        print(f'Script {idx} ({ext}): SYNTAX VALID! (length: {len(body)})')
    else:
        print(f'Script {idx} ({ext}): SYNTAX ERROR:\n{res.stderr}')
        all_ok = False

if all_ok:
    print('ALL INLINE SCRIPTS ARE 100% VALID JAVASCRIPT!')
