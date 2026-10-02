with open('index.html', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

import re
for m in re.finditer(r'<div id="(authContainer|dashboardContainer)"', text):
    start = max(0, m.start() - 50)
    end = min(len(text), m.end() + 200)
    print('Found at', m.start())
    print(text[start:end])
    print('='*50)
