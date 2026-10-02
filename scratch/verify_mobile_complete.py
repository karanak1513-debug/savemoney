import urllib.request
import re

url = "http://localhost:3001/"
try:
    resp = urllib.request.urlopen(url)
    html = resp.read().decode('utf-8')
    print(f"HTTP Status: {resp.status}")
    print(f"HTML Length: {len(html)} bytes")
except Exception as e:
    print(f"Error fetching URL: {e}")
    exit(1)

# Check essential mobile IDs
essential_ids = [
    'three-bg-canvas',
    'three-bg-overlay',
    'btn-celestial-settings',
    'celestial-settings-panel',
    'btn-close-celestial-drawer',
    'celestial-hud-indicator',
    'celestial-planet-dock',
    'theme-toggle-btn',
    'theme-icon-sun',
    'theme-icon-moon',
    'authContainer',
    'googleLoginBtn',
    'btn-demo-mode',
    'sidebar',
    'dash-user-avatar-mobile',
    'btn-dash-signout-mobile',
    'totalStashedDisplay',
    'btn-quick-add-savings',
    'btn-quick-withdrawal',
    'btn-quick-new-vault',
    'metric-streak-count',
    'metric-vaults-count',
    'metric-month-saved',
    'ai-pacing-banner',
    'ai-pacing-headline',
    'ai-pacing-detail',
    'ai-quota-daily',
    'ai-quota-monthly',
    'ai-days-remaining',
    'ai-projected-eta',
    'home-recent-ledger',
    'vaults-grid-container',
    'btn-grid-new-vault',
    'calendar-grid',
    'cal-prev-btn',
    'cal-next-btn',
    'cal-today-btn',
    'ledger-mobile-cards',
    'ledger-table',
    'filter-ledger-all',
    'filter-ledger-add',
    'filter-ledger-minus',
    'mobile-navigation-dock',
    'tab-home',
    'tab-goals',
    'tab-calendar',
    'tab-ledger',
    'modal-create-goal',
    'modal-add-savings',
    'modal-record-withdrawal',
    'modal-edit-ledger',
    'modal-delete-ledger'
]

missing = [i for i in essential_ids if f'id="{i}"' not in html and f"id='{i}'" not in html]
if missing:
    print(f"WARNING: Missing IDs: {missing}")
else:
    print(f"SUCCESS: All {len(essential_ids)} critical IDs are present and intact in the HTML!")

# Check CSS file
css_url = "http://localhost:3001/styles/premium-theme.css"
try:
    c_resp = urllib.request.urlopen(css_url)
    css_content = c_resp.read().decode('utf-8')
    print(f"CSS Status: {c_resp.status}, Length: {len(css_content)} bytes")
    print("Section 16 in CSS:", "16. MOBILE-FIRST RESPONSIVE PERFECTION FOR SMARTPHONES" in css_content)
    print("pb-safe in CSS:", ".pb-safe" in css_content)
    print("mobile media query in CSS:", "@media (max-width: 767px)" in css_content)
except Exception as e:
    print(f"Error fetching CSS: {e}")
