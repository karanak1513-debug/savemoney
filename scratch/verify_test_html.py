# scratch/verify_test_html.py
import re
import subprocess
import os

with open('index.html', 'r', encoding='utf-8') as f:
    orig = f.read()

with open('scratch/test_index.html', 'r', encoding='utf-8') as f:
    test = f.read()

# 1. Verify 3D engine script is identical
engine_header = 'initDualModeCosmicStudio'
orig_engine_start = orig.find(engine_header)
test_engine_start = test.find(engine_header)

orig_module_start = orig.find('<script type="module">')
test_module_start = test.find('<script type="module">')

orig_3d = orig[orig_engine_start:orig_module_start]
test_3d = test[test_engine_start:test_module_start]

print(f"3D Engine identical: {orig_3d == test_3d} (len: {len(orig_3d)})")
if orig_3d != test_3d:
    print("FATAL ERROR: 3D engine was modified!")
    exit(1)

# 2. Verify all getElementById calls
idx = test.find('<script type="module">')
module_script = test[idx:]
ids = sorted(list(set(re.findall(r"getElementById\(['\"]([^'\"]+)['\"]\)", module_script))))

missing = []
for i in ids:
    if f'id="{i}"' not in test and f"id='{i}'" not in test:
        # Check if it was missing in orig as well
        if f'id="{i}"' in orig or f"id='{i}'" in orig:
            missing.append(i)

if missing:
    print(f"ERROR: Missing IDs that existed in original: {missing}")
    exit(1)
else:
    print(f"All {len(ids)} required IDs verified in test_index.html!")

# 3. Check syntax of all inline scripts
pattern = re.compile(r'<script(?:\s+[^>]*)?>(.*?)</script>', re.DOTALL)
scripts = pattern.findall(test)
print(f"Found {len(scripts)} inline scripts in test_index.html")

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

print("\nALL VERIFICATIONS PASSED 100%!")
