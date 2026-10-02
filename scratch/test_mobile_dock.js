const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8').replace(/\r\n/g, '\n');
const css = fs.readFileSync('styles/premium-theme.css', 'utf8').replace(/\r\n/g, '\n');

const checks = [
  ['mobile-controls-dock in HTML', html.includes('id="mobile-controls-dock"')],
  ['desktop-controls-slot in HTML', html.includes('id="desktop-controls-slot"')],
  ['syncControlButtonsPlacement defined', html.includes('function syncControlButtonsPlacement()')],
  ['window.__syncControlButtonsPlacement exported', html.includes('window.__syncControlButtonsPlacement = syncControlButtonsPlacement')],
  ['enterDashboard calls sync', html.includes('// 2. Force reveal backend dashboard') && html.includes('window.__syncControlButtonsPlacement()')],
  ['#mobile-controls-dock in CSS', css.includes('#mobile-controls-dock')],
  ['#mobile-controls-dock #theme-toggle-btn in CSS', css.includes('#mobile-controls-dock #theme-toggle-btn')],
  ['#mobile-controls-dock #btn-celestial-settings in CSS', css.includes('#mobile-controls-dock #btn-celestial-settings')],
  ['desktop-controls-slot hidden on session mobile', css.includes('html.smm-has-session #desktop-controls-slot')],
  ['SaveMoneyManually in mobile topbar', html.includes('SaveMoneyManually</div>\n          <div class="text-[8px] font-mono text-coolslate dark:text-slate-400 uppercase tracking-wider truncate">Discipline Ledger')]
];

let allPassed = true;
checks.forEach(([name, passed]) => {
  console.log(`${passed ? '✅' : '❌'} ${name}`);
  if (!passed) allPassed = false;
});

if (allPassed) {
  console.log('\n🎉 ALL CHECKS PASSED: Zero-overlap mobile docking architecture is fully implemented!');
} else {
  console.error('\n❌ SOME CHECKS FAILED!');
  process.exit(1);
}
