with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

import re
idx = content.find('script type="module"')
module_script = content[idx:]

kws = ['sidebar', 'tab-', 'desktop-nav-item', 'mobile-nav-item', 'switchTab', 'switchView', 'activeTab', 'btn-dash-signout', 'nav-switch-btn', 'sidebarToggleBtn']
for kw in kws:
    matches = list(re.finditer(re.escape(kw), module_script))
    print(f'{kw}: {len(matches)}')

# Print occurrences of switchTab or tab switching logic
lines = module_script.split('\n')
for i, line in enumerate(lines):
    if any(k in line for k in ['tab-home', 'desktop-nav-item', 'mobile-nav-item', 'switchTab', 'sidebarToggleBtn']):
        print(f"Line {i}: {line[:100]}")
