with open('index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

targets = [
    'btn-celestial-settings',
    'theme-toggle-btn',
    'dash-user-avatar-mobile',
    'mobile-navigation-dock',
    'view-home',
    'view-goals',
    'view-calendar',
    'view-ledger',
    'authContainer'
]

for target in targets:
    for idx, line in enumerate(lines):
        if target in line:
            print(f"Line {idx+1}: {target} -> {line.strip()[:100]}")
            break
