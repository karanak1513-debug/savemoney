with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

import re

# Find all getElementById calls in the module script
idx = content.find('<script type="module">')
module_script = content[idx:]
ids = sorted(list(set(re.findall(r"getElementById\(['\"]([^'\"]+)['\"]\)", module_script))))

print(f"Total unique IDs referenced in module script: {len(ids)}")
for i in ids:
    found = f'id="{i}"' in content
    print(f"  {i}: {'EXISTS' if found else 'MISSING'}")
