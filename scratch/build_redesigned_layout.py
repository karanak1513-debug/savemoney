# scratch/build_redesigned_layout.py
import re

new_layout_html = """  <!-- ============================================================ -->
  <!-- 1. FULL AUTONOMOUS SPA COCKPIT WITH FLOATING GLASS NAVIGATION -->
  <!-- ============================================================ -->
  <div id="dashboardContainer" data-view="dashboard-view" class="hidden relative z-10 min-h-screen flex flex-col md:flex-row w-full">

    <!-- ── DESKTOP FLOATING CYBER-GLASS SIDEBAR (STRICTLY DOCKED BOTTOM & COLLAPSIBLE) ── -->
    <aside id="sidebar" class="hidden md:flex md:w-64 flex-shrink-0 flex-col justify-between h-[calc(100vh-2rem)] sticky top-4 m-3 my-4 ml-4 rounded-3xl border border-white/20 dark:border-white/10 bg-white/70 dark:bg-slate-950/70 backdrop-blur-3xl z-30 shadow-2xl transition-all duration-300 ease-in-out relative p-4">
      
      <!-- Collapse / Expand Toggle Button -->
      <button id="sidebarToggleBtn" aria-label="Toggle Sidebar" title="Collapse Sidebar" class="absolute -right-3.5 top-7 border border-slate-200/90 dark:border-slate-700/80 shadow-lg bg-white/95 dark:bg-slate-900/95 hover:bg-slate-50 dark:hover:bg-slate-800 w-7 h-7 rounded-full flex items-center justify-center cursor-pointer z-50 text-slate-600 dark:text-slate-300 transition-all hover:scale-110" type="button">
        <svg class="w-3.5 h-3.5 transition-transform duration-300" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <!-- Top Section: Brand Header & User Profile Card ONLY -->
      <div class="flex flex-col gap-4">
        <!-- Brand Emblem & Identity -->
        <div id="dash-brand-wrap" class="flex items-center gap-3 px-1 pt-1">
          <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-cobalt via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30 flex-shrink-0 border border-white/25">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <circle cx="12" cy="11" r="2.5"/>
            </svg>
          </div>
          <div class="sidebar-text min-w-0">
            <div class="text-base font-extrabold text-charcoal dark:text-white tracking-tight leading-tight truncate">SaveMoneyManually</div>
            <div class="inline-flex items-center gap-1 text-[8.5px] font-mono font-bold text-cobalt dark:text-blue-400 uppercase tracking-widest truncate">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>WEALTH COCKPIT</span>
            </div>
          </div>
        </div>

        <!-- User Profile Card -->
        <div id="dash-profile-card" class="p-3 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 flex items-center gap-3 transition-all backdrop-blur-md shadow-xs">
          <div id="dash-user-avatar" class="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-sm flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">
            <img id="userAvatar" src="" class="w-full h-full object-cover hidden" alt="Avatar" />
            <span id="dash-avatar-initial">U</span>
          </div>
          <div class="min-w-0 flex-1 sidebar-text">
            <div id="dash-user-name" class="text-xs font-bold text-charcoal dark:text-white truncate"><span id="userDisplayName">Saver</span></div>
            <div class="text-[10px] font-mono text-coolslate dark:text-slate-400">&#8377;520/hr baseline</div>
          </div>
        </div>
      </div>

      <!-- Middle Section: Spacer pushing all navigation to absolute bottom -->
      <div class="flex-1"></div>

      <!-- Bottom/Lower Section: Anchored at Very Bottom (mt-auto flex flex-col gap-1 pb-2) -->
      <div class="mt-auto flex flex-col gap-1.5 pb-1 border-t border-slate-200/60 dark:border-white/10 pt-3">
        <div class="sidebar-text text-[9.5px] font-mono font-bold text-coolslate dark:text-slate-400 uppercase tracking-wider px-3 mb-1">Cockpit Views</div>

        <!-- 1. Home Tab -->
        <button id="tab-home-desktop" class="desktop-nav-item w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer bg-blue-50/90 text-blue-600 border border-blue-200/80 shadow-xs" data-target="home" type="button" title="Home">
          <div class="flex items-center gap-3">
            <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
            <span class="sidebar-text">Overview</span>
          </div>
          <span class="active-dot sidebar-text w-1.5 h-1.5 rounded-full bg-blue-600 transition-opacity"></span>
        </button>

        <!-- 2. Goals Tab -->
        <button id="tab-goals-desktop" class="desktop-nav-item w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all cursor-pointer border border-transparent" data-target="goals" type="button" title="Goals">
          <div class="flex items-center gap-3">
            <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><circle cx="12" cy="11" r="2.5"/></svg>
            <span class="sidebar-text">Goal Vaults</span>
          </div>
          <span class="active-dot sidebar-text w-1.5 h-1.5 rounded-full bg-blue-600 opacity-0 transition-opacity"></span>
        </button>

        <!-- 3. Calendar Tab -->
        <button id="tab-calendar-desktop" class="desktop-nav-item w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all cursor-pointer border border-transparent" data-target="calendar" type="button" title="Calendar">
          <div class="flex items-center gap-3">
            <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            <span class="sidebar-text">Calendar</span>
          </div>
          <span class="active-dot sidebar-text w-1.5 h-1.5 rounded-full bg-blue-600 opacity-0 transition-opacity"></span>
        </button>

        <!-- 4. Ledger Tab (Merged Ledger & History) -->
        <button id="tab-ledger-desktop" class="desktop-nav-item w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all cursor-pointer border border-transparent" data-target="ledger" type="button" title="Ledger">
          <div class="flex items-center gap-3">
            <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
            <span class="sidebar-text">Audit Ledger</span>
          </div>
          <span class="active-dot sidebar-text w-1.5 h-1.5 rounded-full bg-blue-600 opacity-0 transition-opacity"></span>
        </button>

        <!-- Sign Out Action (Neatly below Ledger tab) -->
        <div class="pt-2">
          <button id="btn-dash-signout" class="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold text-coolslate hover:text-crimson hover:bg-rose-500/10 border border-slate-200/80 dark:border-white/10 transition-colors cursor-pointer" type="button" title="Sign Out">
            <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
            <span class="sidebar-text">Sign Out</span>
          </button>
        </div>
      </div>
    </aside>

    <!-- ── MOBILE TOP BAR (MINIMAL BRAND & SIGN-OUT) ───────────── -->
    <div class="md:hidden w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-2xl border-b border-slate-200/80 dark:border-slate-800/80 px-4 py-3 sticky top-0 z-30 flex items-center justify-between">
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-cobalt to-blue-700 flex items-center justify-center shadow-md shadow-blue-500/25">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><circle cx="12" cy="11" r="2.5"/></svg>
        </div>
        <div class="leading-none">
          <div class="text-sm font-extrabold text-charcoal dark:text-white">SaveMoneyManually</div>
          <div class="text-[9px] font-mono text-coolslate uppercase tracking-wider">Discipline Ledger</div>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <div id="dash-user-avatar-mobile" class="w-7 h-7 rounded-full bg-blue-100 text-cobalt font-bold text-xs flex items-center justify-center">U</div>
        <button id="btn-dash-signout-mobile" class="text-xs font-semibold text-coolslate hover:text-crimson bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 py-1.5 px-2.5 rounded-lg cursor-pointer" type="button">Sign Out</button>
      </div>
    </div>

    <!-- ── MAIN SPA CONTENT AREA (ADAPTS FOR DESKTOP SIDEBAR) ── -->
    <main class="flex-1 min-w-0 min-h-screen px-4 py-5 sm:px-8 sm:py-6 pb-28 md:pb-12 max-w-7xl mx-auto w-full">

      <!-- Executive Cockpit Header Banner -->
      <div class="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider bg-blue-50/80 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-500/30 text-cobalt dark:text-blue-400 uppercase mb-2">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>AUTONOMOUS FINANCIAL COCKPIT</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-charcoal dark:text-white tracking-tight leading-tight">
            Executive <span class="bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 bg-clip-text text-transparent">Wealth Radar</span>
          </h1>
          <p class="text-xs text-coolslate dark:text-slate-400 mt-1">Autonomous quota mathematics, 0ms optimistic ledger &amp; impulse resistance locks.</p>
        </div>

        <!-- Realtime Telemetry Badge -->
        <div class="flex items-center gap-2 self-start sm:self-auto">
          <div class="px-3.5 py-2 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl shadow-xs flex items-center gap-2.5">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <div class="text-[11px] font-mono leading-none">
              <div class="font-bold text-charcoal dark:text-white">SYSTEM ONLINE</div>
              <div class="text-[9px] text-coolslate dark:text-slate-400">256-BIT ENCRYPTION</div>
            </div>
          </div>
        </div>
      </div>

      <!-- ======================================================= -->
      <!-- VIEW 1: HOME / OVERVIEW (#view-home)                     -->
      <!-- ======================================================= -->
      <div id="view-home" class="dissolve-enter flex flex-col gap-6">

        <!-- 1. Total Net Stashed Cockpit Card -->
        <section class="metallic-card p-6 sm:p-8 relative overflow-hidden" aria-label="Total Capital Overview">
          <div class="flex flex-col lg:flex-row lg:items-start justify-between gap-8 relative z-10">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2">
                <div class="w-2 h-5 rounded-full bg-gradient-to-b from-blue-500 to-indigo-600"></div>
                <span class="font-mono text-[10.5px] sm:text-[11.5px] font-bold uppercase tracking-widest text-coolslate dark:text-slate-400">Total Net Stashed Capital</span>
              </div>
              <div id="totalStashedDisplay" class="font-mono text-4xl sm:text-6xl lg:text-7xl font-extrabold text-charcoal dark:text-white tracking-tight leading-none drop-shadow-sm">&#8377;0</div>
              <p class="text-xs sm:text-sm text-coolslate dark:text-slate-400 mt-3 max-w-lg leading-relaxed">Continuous spare change round-ups, impulse cooldown locks, and background leakage prevention. Balance adjusts in real time.</p>

              <!-- Quick Action Bar -->
              <div class="flex flex-wrap items-center gap-3 mt-6">
                <button id="btn-quick-add-savings" class="btn-primary-metallic text-xs sm:text-sm min-h-[48px] py-2.5 px-6 cursor-pointer shadow-lg shadow-blue-500/25" type="button">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
                  <span>+ Add Saved</span>
                </button>
                <button id="btn-quick-withdrawal" class="btn-danger-metallic text-xs sm:text-sm min-h-[48px] py-2.5 px-5 cursor-pointer shadow-md shadow-rose-500/20" type="button">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20 12H4"/></svg>
                  <span>- Record Withdrawal</span>
                </button>
                <button id="btn-quick-new-vault" class="btn-secondary-metallic text-xs sm:text-sm min-h-[48px] py-2.5 px-5 cursor-pointer" type="button">
                  <svg class="w-4 h-4 text-cobalt" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><circle cx="12" cy="11" r="2.5"/></svg>
                  <span>🎯 Create Goal</span>
                </button>
              </div>
            </div>

            <!-- 3 Glass KPI Bento Tiles -->
            <div class="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3 gap-3.5 lg:min-w-[360px]">
              <div class="glass-inner-tile p-4">
                <div class="flex items-center justify-between mb-2">
                  <div class="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-sm shadow-xs">
                    <span class="inline-block animate-pulse">🔥</span>
                  </div>
                  <span class="text-[9.5px] font-mono font-bold text-coolslate dark:text-slate-400 uppercase tracking-widest">Discipline Streak</span>
                </div>
                <div class="flex items-baseline gap-2">
                  <span id="metric-streak-count" class="font-mono text-2xl font-extrabold text-charcoal dark:text-white">0 Days</span>
                  <span class="text-xs text-amber-500 font-bold animate-bounce">🔥</span>
                </div>
                <div class="text-[10.5px] text-coolslate dark:text-slate-400 mt-1">Consecutive active log-ins</div>
              </div>

              <div class="glass-inner-tile p-4">
                <div class="flex items-center justify-between mb-2">
                  <div class="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-500 shadow-xs">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6l4 2"/></svg>
                  </div>
                  <span class="text-[9.5px] font-mono font-bold text-coolslate dark:text-slate-400 uppercase tracking-widest">Active Goals</span>
                </div>
                <div id="metric-vaults-count" class="font-mono text-2xl font-extrabold text-charcoal dark:text-white">0</div>
                <div class="text-[10.5px] text-coolslate dark:text-slate-400 mt-1">Flexi-cadence targets</div>
              </div>

              <div class="glass-inner-tile p-4">
                <div class="flex items-center justify-between mb-2">
                  <div class="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-cobalt dark:text-blue-400 shadow-xs">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
                  </div>
                  <span class="text-[9.5px] font-mono font-bold text-coolslate dark:text-slate-400 uppercase tracking-widest">This Month</span>
                </div>
                <div id="metric-month-saved" class="font-mono text-2xl font-extrabold text-charcoal dark:text-white">&#8377;0</div>
                <div class="text-[10.5px] text-coolslate dark:text-slate-400 mt-1">Net disciplined stash</div>
              </div>
            </div>
          </div>
        </section>

        <!-- 2. AI Pacing Guardrail Banner -->
        <section class="metallic-card p-5 sm:p-7" aria-label="AI Dynamic Pacing Banner">
          <div class="flex items-center justify-between gap-3 pb-3.5 border-b border-slate-200/60 dark:border-white/10">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25">
                <span>✨</span>
              </div>
              <div>
                <h3 class="font-extrabold text-charcoal dark:text-white text-sm sm:text-base">AI Dynamic Pacing Guardrail</h3>
                <p class="text-[11px] text-coolslate dark:text-slate-400">Autonomous predictive calculations vs. active goal target deadlines</p>
              </div>
            </div>
            <span class="font-mono text-[9px] font-bold text-cobalt dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-500/30 px-3 py-1 rounded-full uppercase">Live Guardrail</span>
          </div>

          <!-- Dynamic Status Banner -->
          <div id="ai-pacing-banner" class="mt-4 p-4 rounded-2xl pacing-banner-optimal transition-all duration-300">
            <div class="flex items-start gap-3.5">
              <span id="ai-pacing-icon" class="text-2xl flex-shrink-0">⚡</span>
              <div class="flex-1">
                <div id="ai-pacing-headline" class="font-extrabold text-sm sm:text-base text-charcoal dark:text-white leading-snug">On schedule for all active goals</div>
                <div id="ai-pacing-detail" class="text-xs text-coolslate dark:text-slate-300 mt-1 leading-relaxed">Maintain your current daily quota to hit all your deadlines on time.</div>
              </div>
            </div>
          </div>

          <!-- Telemetry Numbers -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            <div class="glass-inner-tile p-3.5">
              <div class="text-[9.5px] font-mono font-bold text-coolslate dark:text-slate-400 uppercase tracking-wider">Daily Quota</div>
              <div id="ai-quota-daily" class="font-mono text-base sm:text-lg font-extrabold text-cobalt dark:text-blue-400 mt-1">&#8377;0 / day</div>
            </div>
            <div class="glass-inner-tile p-3.5">
              <div class="text-[9.5px] font-mono font-bold text-coolslate dark:text-slate-400 uppercase tracking-wider">Monthly Run-Rate</div>
              <div id="ai-quota-monthly" class="font-mono text-base sm:text-lg font-extrabold text-charcoal dark:text-white mt-1">&#8377;0 / mo</div>
            </div>
            <div class="glass-inner-tile p-3.5">
              <div class="text-[9.5px] font-mono font-bold text-coolslate dark:text-slate-400 uppercase tracking-wider">Days Remaining</div>
              <div id="ai-days-remaining" class="font-mono text-base sm:text-lg font-extrabold text-charcoal dark:text-white mt-1">0 Days</div>
            </div>
            <div class="glass-inner-tile p-3.5">
              <div class="text-[9.5px] font-mono font-bold text-coolslate dark:text-slate-400 uppercase tracking-wider">Projected ETA</div>
              <div id="ai-projected-eta" class="font-mono text-base sm:text-lg font-extrabold text-emerald-500 dark:text-emerald-400 mt-1">--</div>
            </div>
          </div>
        </section>

        <!-- 3. Split Two-Column Cockpit (Recent Ledger & Discipline Rulebook) -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <!-- Recent Activity Snapshot (2 Columns) -->
          <section class="metallic-card p-5 sm:p-6 lg:col-span-2" aria-label="Recent Activity Snapshot">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2">
                <div class="w-1.5 h-4 rounded-full bg-cobalt"></div>
                <h3 class="font-extrabold text-charcoal dark:text-white text-sm sm:text-base">Recent Ledger Activity</h3>
              </div>
              <button class="nav-switch-btn text-xs font-bold text-cobalt dark:text-blue-400 hover:underline cursor-pointer flex items-center gap-1" data-target="ledger" type="button">
                <span>View Full Ledger</span>
                <span>&rarr;</span>
              </button>
            </div>
            <div id="home-recent-ledger" class="flex flex-col gap-2.5">
              <!-- Populated dynamically -->
            </div>
          </section>

          <!-- Autonomous Wealth Rulebook Widget (1 Column) -->
          <section class="metallic-card p-5 sm:p-6 flex flex-col justify-between" aria-label="Discipline Rulebook">
            <div>
              <div class="flex items-center gap-2 mb-3.5">
                <div class="w-1.5 h-4 rounded-full bg-emerald-500"></div>
                <h3 class="font-extrabold text-charcoal dark:text-white text-sm sm:text-base">Discipline Protocol</h3>
              </div>
              <div class="space-y-3 text-xs text-coolslate dark:text-slate-300">
                <div class="glass-inner-tile p-3 flex items-start gap-2.5">
                  <span class="text-base leading-none">🛡️</span>
                  <div>
                    <div class="font-bold text-charcoal dark:text-white">Zero Impulses</div>
                    <div class="text-[11px] text-coolslate dark:text-slate-400 mt-0.5">24h deliberate cooling locks on all withdrawals.</div>
                  </div>
                </div>
                <div class="glass-inner-tile p-3 flex items-start gap-2.5">
                  <span class="text-base leading-none">⚡</span>
                  <div>
                    <div class="font-bold text-charcoal dark:text-white">Dynamic Quota</div>
                    <div class="text-[11px] text-coolslate dark:text-slate-400 mt-0.5">Remaining target dynamically spread across active days.</div>
                  </div>
                </div>
                <div class="glass-inner-tile p-3 flex items-start gap-2.5">
                  <span class="text-base leading-none">🔒</span>
                  <div>
                    <div class="font-bold text-charcoal dark:text-white">Optimistic Vaults</div>
                    <div class="text-[11px] text-coolslate dark:text-slate-400 mt-0.5">0ms UI speed backed by 256-bit encrypted ledger.</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="pt-4 mt-4 border-t border-slate-200/60 dark:border-white/10">
              <button class="nav-switch-btn w-full btn-secondary-metallic text-xs py-2 px-3 justify-center" data-target="goals" type="button">
                <span>Manage Target Vaults &rarr;</span>
              </button>
            </div>
          </section>

        </div>

      </div>

      <!-- ======================================================= -->
      <!-- VIEW 2: GOAL VAULTS (#view-goals)                        -->
      <!-- ======================================================= -->
      <div id="view-goals" class="dissolve-enter hidden flex flex-col gap-6">

        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-2 h-6 rounded-full bg-cobalt"></div>
            <div>
              <h2 class="text-base sm:text-xl font-extrabold text-charcoal dark:text-white tracking-tight">Active Smart Goal Vaults</h2>
              <p class="text-xs text-coolslate dark:text-slate-400">Prioritized targets with flexi-cadence math (Daily, Monthly, Yearly)</p>
            </div>
          </div>
          <button id="btn-grid-new-vault" class="btn-primary-metallic text-xs sm:text-sm min-h-[48px] py-2.5 px-5 cursor-pointer shadow-md shadow-blue-500/20" type="button">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
            <span>+ Create Target Vault</span>
          </button>
        </div>

        <!-- Dynamic Vault Cards Grid -->
        <div id="vaults-grid-container" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"></div>

        <!-- Empty State Container -->
        <div id="vaults-empty-state" class="metallic-card p-12 flex flex-col items-center justify-center text-center gap-4 hidden">
          <div class="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-500/30 flex items-center justify-center text-cobalt dark:text-blue-400 shadow-md">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><circle cx="12" cy="11" r="2.5"/></svg>
          </div>
          <div>
            <div class="font-extrabold text-charcoal dark:text-white text-lg">No active vaults yet</div>
            <div class="text-xs sm:text-sm text-coolslate dark:text-slate-400 mt-1 max-w-sm leading-relaxed">Create your first goal vault (e.g. "MacBook Pro", "Emergency Cash"). Live math will calculate your saving quota.</div>
          </div>
          <button id="btn-empty-new-vault" class="btn-primary-metallic text-xs sm:text-sm min-h-[48px] py-2.5 px-6 cursor-pointer shadow-lg shadow-blue-500/25" type="button">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
            <span>Create First Goal Vault</span>
          </button>
        </div>

      </div>

      <!-- ======================================================= -->
      <!-- VIEW 3: SAVINGS CALENDAR (#view-calendar)                -->
      <!-- ======================================================= -->
      <div id="view-calendar" class="dissolve-enter hidden flex flex-col gap-6">

        <section class="metallic-card p-5 sm:p-7" aria-label="Interactive Savings Calendar">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/60 dark:border-white/10">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-500/30 flex items-center justify-center text-sm shadow-xs">
                <span>📅</span>
              </div>
              <div>
                <h3 class="font-extrabold text-charcoal dark:text-white text-base sm:text-lg">Monthly Savings Calendar</h3>
                <p class="text-xs text-coolslate dark:text-slate-400">Days with logged deposits marked with Electric Cobalt Blue dots</p>
              </div>
            </div>

            <!-- Calendar month navigation -->
            <div class="flex items-center justify-between sm:justify-end gap-2">
              <button id="cal-prev-btn" class="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center text-charcoal dark:text-white font-bold cursor-pointer transition-colors" type="button" aria-label="Previous Month">&lsaquo;</button>
              <div id="cal-month-title" class="font-mono font-bold text-xs sm:text-sm text-charcoal dark:text-white min-w-[140px] text-center uppercase tracking-wider">September 2026</div>
              <button id="cal-next-btn" class="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center text-charcoal dark:text-white font-bold cursor-pointer transition-colors" type="button" aria-label="Next Month">&rsaquo;</button>
              <button id="cal-today-btn" class="text-xs font-bold text-cobalt dark:text-blue-400 px-3 py-1.5 rounded-xl border border-blue-200 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 cursor-pointer min-h-[36px] transition-colors" type="button">Today</button>
            </div>
          </div>

          <!-- 7-Column Day Names Header -->
          <div class="grid grid-cols-7 gap-1.5 text-center mt-5 mb-2">
            <div class="text-[10px] font-mono font-bold text-coolslate dark:text-slate-400">SUN</div>
            <div class="text-[10px] font-mono font-bold text-coolslate dark:text-slate-400">MON</div>
            <div class="text-[10px] font-mono font-bold text-coolslate dark:text-slate-400">TUE</div>
            <div class="text-[10px] font-mono font-bold text-coolslate dark:text-slate-400">WED</div>
            <div class="text-[10px] font-mono font-bold text-coolslate dark:text-slate-400">THU</div>
            <div class="text-[10px] font-mono font-bold text-coolslate dark:text-slate-400">FRI</div>
            <div class="text-[10px] font-mono font-bold text-coolslate dark:text-slate-400">SAT</div>
          </div>

          <!-- Calendar Day Cells Grid (Scaled cleanly for mobile & desktop) -->
          <div id="calendar-grid" class="grid grid-cols-7 gap-1.5 sm:gap-2 min-h-[240px]"></div>

          <!-- Calendar Summary Footer with Flame Streak -->
          <div class="mt-5 pt-4 border-t border-slate-200/60 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-coolslate dark:text-slate-300 font-medium">
            <div class="flex items-center gap-3">
              <div class="flex items-center gap-1.5">
                <span class="w-2.5 h-2.5 rounded-full bg-cobalt inline-block shadow-xs"></span>
                <span>Deposit Day</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="w-2.5 h-2.5 rounded-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 inline-block shadow-xs"></span>
                <span>Inactive</span>
              </div>
            </div>
            <div class="font-mono text-xs text-slate-700 dark:text-slate-200">
              Discipline Streak: <strong id="cal-streak-badge" class="text-amber-500 font-bold">0 Days 🔥</strong> &bull; Monthly Rate: <strong id="cal-discipline-rate" class="text-cobalt dark:text-blue-400 font-bold">0%</strong>
            </div>
          </div>
        </section>

      </div>

      <!-- ======================================================= -->
      <!-- VIEW 4: LEDGER & HISTORY (#view-ledger)                  -->
      <!-- ======================================================= -->
      <div id="view-ledger" class="dissolve-enter hidden flex flex-col gap-6">

        <section class="metallic-card p-5 sm:p-7" aria-label="Transaction Ledger">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/60 dark:border-white/10">
            <div class="flex items-center gap-3">
              <div class="w-2 h-6 rounded-full bg-cobalt"></div>
              <div>
                <h3 class="font-extrabold text-charcoal dark:text-white text-base sm:text-lg">Ledger &amp; Audit Trail</h3>
                <p class="text-xs text-coolslate dark:text-slate-400">Chronological entry log with inline editing and balance reversals</p>
              </div>
            </div>

            <!-- Filter buttons -->
            <div class="flex items-center gap-1 bg-slate-100/80 dark:bg-slate-900/80 p-1 rounded-xl border border-slate-200 dark:border-slate-800 self-start sm:self-auto">
              <button id="filter-ledger-all" class="text-xs font-bold px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 text-charcoal dark:text-white shadow-xs transition-all cursor-pointer min-h-[34px]" type="button">All</button>
              <button id="filter-ledger-add" class="text-xs font-bold px-3 py-1.5 rounded-lg text-coolslate dark:text-slate-400 hover:text-charcoal dark:hover:text-white transition-all cursor-pointer min-h-[34px]" type="button">+ Deposits</button>
              <button id="filter-ledger-minus" class="text-xs font-bold px-3 py-1.5 rounded-lg text-coolslate dark:text-slate-400 hover:text-charcoal dark:hover:text-white transition-all cursor-pointer min-h-[34px]" type="button">- Withdrawals</button>
            </div>
          </div>

          <!-- 1. MOBILE RESPONSIVE STACKED CARDS (md:hidden) -->
          <div id="ledger-mobile-cards" class="mt-4 flex flex-col gap-3 md:hidden"></div>

          <!-- 2. DESKTOP DATA TABLE (hidden md:block) -->
          <div class="mt-4 overflow-x-auto hidden md:block">
            <table class="w-full text-left border-collapse" id="ledger-table">
              <thead>
                <tr class="border-b border-slate-200/80 dark:border-white/10 text-[10.5px] font-mono font-bold text-coolslate dark:text-slate-400 uppercase tracking-wider">
                  <th class="py-3 px-3.5">Date</th>
                  <th class="py-3 px-3.5">Goal Vault</th>
                  <th class="py-3 px-3.5">Type</th>
                  <th class="py-3 px-3.5">Note / Reason</th>
                  <th class="py-3 px-3.5 text-right">Amount</th>
                  <th class="py-3 px-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody id="ledger-table-body" class="divide-y divide-slate-100 dark:divide-white/5 text-xs"></tbody>
            </table>
          </div>

          <!-- Empty state -->
          <div id="ledger-empty-state" class="py-12 flex flex-col items-center justify-center text-center gap-3">
            <div class="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-500/30 flex items-center justify-center text-cobalt dark:text-blue-400 shadow-xs">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
            </div>
            <div class="text-xs sm:text-sm text-coolslate dark:text-slate-400 font-medium">
              No ledger entries logged yet.<br/>Use <strong>[+ Add Saved]</strong> or <strong>[- Record Withdrawal]</strong> to start your trail.
            </div>
          </div>
        </section>

      </div>

    </main>

    <!-- ── MOBILE LOWER NAVIGATION DOCK (STRICT 4 TABS: md:hidden) ── -->
    <nav id="mobile-navigation-dock" class="fixed bottom-0 inset-x-0 bg-white/90 dark:bg-slate-950/90 backdrop-blur-2xl border-t border-slate-200 dark:border-slate-800 z-50 py-2.5 px-4 flex justify-around items-center pb-safe md:hidden shadow-[0_-8px_30px_rgba(0,0,0,0.15)]">
      
      <!-- Tab 1: Home -->
      <button id="tab-home" class="mobile-nav-item flex-1 flex flex-col items-center justify-center py-1.5 text-blue-600 font-bold transition-all cursor-pointer" data-target="home" type="button">
        <svg class="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
        <span class="text-[10px] leading-tight">Home</span>
        <span class="active-dot w-1 h-1 rounded-full bg-blue-600 mt-0.5 transition-opacity"></span>
      </button>

      <!-- Tab 2: Goals -->
      <button id="tab-goals" class="mobile-nav-item flex-1 flex flex-col items-center justify-center py-1.5 text-slate-500 font-medium transition-all cursor-pointer" data-target="goals" type="button">
        <svg class="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><circle cx="12" cy="11" r="2.5"/></svg>
        <span class="text-[10px] leading-tight">Goals</span>
        <span class="active-dot w-1 h-1 rounded-full bg-blue-600 mt-0.5 opacity-0 transition-opacity"></span>
      </button>

      <!-- Tab 3: Calendar -->
      <button id="tab-calendar" class="mobile-nav-item flex-1 flex flex-col items-center justify-center py-1.5 text-slate-500 font-medium transition-all cursor-pointer" data-target="calendar" type="button">
        <svg class="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        <span class="text-[10px] leading-tight">Calendar</span>
        <span class="active-dot w-1 h-1 rounded-full bg-blue-600 mt-0.5 opacity-0 transition-opacity"></span>
      </button>

      <!-- Tab 4: Ledger (Merged Ledger & History) -->
      <button id="tab-ledger" class="mobile-nav-item flex-1 flex flex-col items-center justify-center py-1.5 text-slate-500 font-medium transition-all cursor-pointer" data-target="ledger" type="button">
        <svg class="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
        <span class="text-[10px] leading-tight">Ledger</span>
        <span class="active-dot w-1 h-1 rounded-full bg-blue-600 mt-0.5 opacity-0 transition-opacity"></span>
      </button>

    </nav>

  </div>

  <!-- ============================================================ -->
  <!-- MODALS (BOTTOM SHEETS ON MOBILE, CENTERED DIALOGS ON DESKTOP) -->
  <!-- ============================================================ -->

  <!-- 1. MODAL: CREATE GOAL VAULT -->
  <div class="modal-overlay" id="modal-create-goal" role="dialog" aria-modal="true" aria-labelledby="modal-goal-title">
    <div class="modal-dialog">
      <div class="bottom-sheet-handle"></div>

      <div class="flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-100 dark:border-white/10">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-700 flex items-center justify-center text-white shadow-xs">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><circle cx="12" cy="11" r="2.5"/></svg>
          </div>
          <div>
            <h3 id="modal-goal-title" class="font-bold text-charcoal dark:text-white text-sm">Create Target Vault</h3>
            <p class="text-[11px] text-coolslate dark:text-slate-400">Custom goal name, target &amp; dynamic cadence math</p>
          </div>
        </div>
        <button class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-coolslate hover:text-charcoal dark:hover:text-white modal-close cursor-pointer transition-colors" type="button" aria-label="Close">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <form id="form-create-goal" class="px-5 py-4 space-y-3.5" novalidate autocomplete="off">
        <div>
          <label class="block text-xs font-bold text-charcoal dark:text-white mb-1" for="goal-input-name">Target Name</label>
          <input type="text" id="goal-input-name" class="input-metallic text-base sm:text-sm" placeholder="e.g. MacBook Pro, Emergency Cash" required />
          <p id="goal-err-name" class="text-[11px] text-rose-600 font-medium mt-1 hidden">Please provide a target name.</p>
        </div>

        <div>
          <label class="block text-xs font-bold text-charcoal dark:text-white mb-1" for="goal-input-amount">Target Amount (&#8377;)</label>
          <div class="amount-prefix-wrap">
            <span class="prefix-symbol">&#8377;</span>
            <input type="number" id="goal-input-amount" class="input-metallic font-mono text-base sm:text-sm" placeholder="75,000" min="100" required />
          </div>
          <p id="goal-err-amount" class="text-[11px] text-rose-600 font-medium mt-1 hidden">Please enter a valid target amount.</p>
        </div>

        <div>
          <label class="block text-xs font-bold text-charcoal dark:text-white mb-1" for="goal-input-deadline">Target Deadline</label>
          <input type="date" id="goal-input-deadline" class="input-metallic text-base sm:text-sm font-mono" required />
          <p id="goal-err-deadline" class="text-[11px] text-rose-600 font-medium mt-1 hidden">Please select a deadline date.</p>
        </div>

        <div>
          <label class="block text-xs font-bold text-charcoal dark:text-white mb-1.5">Cadence Selector</label>
          <div class="grid grid-cols-3 gap-2">
            <button type="button" class="btn-cadence-toggle min-h-[48px] py-2 px-3 text-xs font-bold rounded-xl border border-cobalt bg-blue-50 dark:bg-blue-950/60 text-cobalt dark:text-blue-400 transition-all cursor-pointer" data-cadence="DAILY">Daily</button>
            <button type="button" class="btn-cadence-toggle min-h-[48px] py-2 px-3 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-coolslate transition-all cursor-pointer" data-cadence="MONTHLY">Monthly</button>
            <button type="button" class="btn-cadence-toggle min-h-[48px] py-2 px-3 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-coolslate transition-all cursor-pointer" data-cadence="YEARLY">Yearly</button>
          </div>
        </div>

        <!-- Real-Time Math Calculator -->
        <div id="goal-math-readout" class="rounded-xl border border-blue-200 dark:border-blue-500/30 p-3 bg-blue-50/80 dark:bg-blue-950/40 shadow-xs">
          <div class="text-[10px] font-mono font-bold text-cobalt dark:text-blue-400 uppercase tracking-wider mb-0.5">⚡ Real-Time Math Calculator</div>
          <div id="goal-math-text" class="text-xs font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
            Enter amount and deadline to compute your required quota: Remaining / Days.
          </div>
        </div>

        <div class="border-t border-slate-100 dark:border-white/10 pt-3 flex items-center justify-between gap-2.5">
          <button type="button" class="btn-secondary-metallic min-h-[48px] text-xs modal-close flex-1">Cancel</button>
          <button type="submit" id="btn-create-goal-submit" class="btn-primary-metallic min-h-[48px] text-xs flex-[2] flex items-center justify-center gap-2">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
            <span>Lock Goal Vault</span>
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- 2. MODAL: ADD SAVINGS (+ DEPOSIT BOTTOM-SHEET) -->
  <div class="modal-overlay" id="modal-add-savings" role="dialog" aria-modal="true" aria-labelledby="modal-add-title">
    <div class="modal-dialog">
      <div class="bottom-sheet-handle"></div>

      <div class="flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-100 dark:border-white/10">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white shadow-xs">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
          </div>
          <div>
            <h3 id="modal-add-title" class="font-bold text-charcoal dark:text-white text-sm leading-tight">Add Saved Money</h3>
            <p class="text-[11px] text-coolslate dark:text-slate-400">Log cash or UPI deposit manually saved today</p>
          </div>
        </div>
        <button class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-coolslate hover:text-charcoal dark:hover:text-white modal-close cursor-pointer transition-colors" type="button" aria-label="Close">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <form id="form-add-savings" class="px-5 py-4 space-y-3.5" novalidate autocomplete="off">
        <div>
          <label class="block text-xs font-bold text-charcoal dark:text-white mb-1" for="add-savings-vault-input">
            Target Goal Vault
            <span class="font-normal text-coolslate dark:text-slate-400 ml-1">(type name or choose chip)</span>
          </label>
          <div class="relative">
            <div class="chip-input-wrapper" id="add-chips-wrapper">
              <input type="text" id="add-savings-vault-input" placeholder="e.g. MacBook Pro, Emergency Cash…" autocomplete="off" class="text-base sm:text-sm" />
            </div>
            <div class="chip-suggestions" id="add-chips-suggestions"></div>
          </div>
          <p id="add-err-vault" class="text-[11px] text-rose-600 font-medium mt-1 hidden">Please select or type a target vault.</p>
        </div>

        <div>
          <label class="block text-xs font-bold text-charcoal dark:text-white mb-1" for="add-savings-amount">Deposit Amount (&#8377;)</label>
          <div class="amount-prefix-wrap">
            <span class="prefix-symbol">&#8377;</span>
            <input type="number" id="add-savings-amount" class="input-metallic font-mono text-base sm:text-sm" placeholder="500" min="1" required />
          </div>
          <p id="add-err-amount" class="text-[11px] text-rose-600 font-medium mt-1 hidden">Please enter an amount greater than &#8377;0.</p>
        </div>

        <!-- Quick Presets -->
        <div class="flex flex-wrap gap-2 pt-0.5">
          <span class="text-[11px] font-semibold text-coolslate dark:text-slate-400 self-center">Quick:</span>
          <button type="button" class="btn-add-preset text-xs font-bold px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-cobalt hover:text-cobalt transition-colors cursor-pointer min-h-[38px]" data-amount="150">&#8377;150</button>
          <button type="button" class="btn-add-preset text-xs font-bold px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-cobalt hover:text-cobalt transition-colors cursor-pointer min-h-[38px]" data-amount="500">&#8377;500</button>
          <button type="button" class="btn-add-preset text-xs font-bold px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-cobalt hover:text-cobalt transition-colors cursor-pointer min-h-[38px]" data-amount="1000">&#8377;1,000</button>
          <button type="button" class="btn-add-preset text-xs font-bold px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-cobalt hover:text-cobalt transition-colors cursor-pointer min-h-[38px]" data-amount="2000">&#8377;2,000</button>
        </div>

        <div>
          <label class="block text-xs font-bold text-charcoal dark:text-white mb-1" for="add-savings-note">Note / Memo (Optional)</label>
          <input type="text" id="add-savings-note" class="input-metallic text-base sm:text-sm" placeholder="e.g. Daily coffee saving, UPI envelope" />
        </div>

        <div>
          <label class="block text-xs font-bold text-charcoal dark:text-white mb-1" for="add-savings-date">Date</label>
          <input type="date" id="add-savings-date" class="input-metallic text-base sm:text-sm font-mono" required />
        </div>

        <div class="border-t border-slate-100 dark:border-white/10 pt-3 flex items-center justify-between gap-2.5">
          <button type="button" class="btn-secondary-metallic min-h-[48px] text-xs modal-close flex-1">Cancel</button>
          <button type="submit" id="btn-add-savings-submit" class="btn-primary-metallic min-h-[48px] text-xs flex-[2] flex items-center justify-center gap-2">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
            <span>Confirm Stash</span>
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- 3. MODAL: RECORD WITHDRAWAL (- DEDUCTION BOTTOM-SHEET) -->
  <div class="modal-overlay" id="modal-record-withdrawal" role="dialog" aria-modal="true" aria-labelledby="modal-withdrawal-title">
    <div class="modal-dialog">
      <div class="bottom-sheet-handle"></div>

      <div class="flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-100 dark:border-white/10">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-500 to-rose-700 flex items-center justify-center text-white shadow-xs">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20 12H4"/></svg>
          </div>
          <div>
            <h3 id="modal-withdrawal-title" class="font-bold text-charcoal dark:text-white text-sm leading-tight">Record Withdrawal</h3>
            <p class="text-[11px] text-coolslate dark:text-slate-400">Log money taken out for an emergency</p>
          </div>
        </div>
        <button class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-coolslate hover:text-charcoal dark:hover:text-white modal-close cursor-pointer transition-colors" type="button" aria-label="Close">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <form id="form-record-withdrawal" class="px-5 py-4 space-y-3.5" novalidate autocomplete="off">
        <div>
          <label class="block text-xs font-bold text-charcoal dark:text-white mb-1" for="withdrawal-vault-select">Source Vault</label>
          <select id="withdrawal-vault-select" class="input-metallic text-base sm:text-sm font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer" required>
            <!-- Populated dynamically -->
          </select>
          <p id="withdrawal-err-vault" class="text-[11px] text-rose-600 font-medium mt-1 hidden">Please select a vault.</p>
        </div>

        <div>
          <label class="block text-xs font-bold text-charcoal dark:text-white mb-1" for="withdrawal-amount">Withdrawal Amount (&#8377;)</label>
          <div class="amount-prefix-wrap">
            <span class="prefix-symbol">&#8377;</span>
            <input type="number" id="withdrawal-amount" class="input-metallic font-mono text-base sm:text-sm" placeholder="500" min="1" required />
          </div>
          <p id="withdrawal-err-amount" class="text-[11px] text-rose-600 font-medium mt-1 hidden">Please enter a valid amount.</p>
        </div>

        <div>
          <label class="block text-xs font-bold text-charcoal dark:text-white mb-1" for="withdrawal-note">Emergency Reason / Note</label>
          <input type="text" id="withdrawal-note" class="input-metallic text-base sm:text-sm" placeholder="e.g. Urgent phone repair, medical bill" required />
          <p id="withdrawal-err-note" class="text-[11px] text-rose-600 font-medium mt-1 hidden">Please enter the reason.</p>
        </div>

        <div>
          <label class="block text-xs font-bold text-charcoal dark:text-white mb-1" for="withdrawal-date">Date</label>
          <input type="date" id="withdrawal-date" class="input-metallic text-base sm:text-sm font-mono" required />
        </div>

        <div class="border-t border-slate-100 dark:border-white/10 pt-3 flex items-center justify-between gap-2.5">
          <button type="button" class="btn-secondary-metallic min-h-[48px] text-xs modal-close flex-1">Cancel</button>
          <button type="submit" id="btn-withdrawal-submit" class="btn-danger-metallic min-h-[48px] text-xs flex-[2] flex items-center justify-center gap-2">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20 12H4"/></svg>
            <span>Record Withdrawal</span>
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- 4. MODAL: EDIT LEDGER ENTRY -->
  <div class="modal-overlay" id="modal-edit-ledger" role="dialog" aria-modal="true" aria-labelledby="modal-edit-title">
    <div class="modal-dialog">
      <div class="bottom-sheet-handle"></div>

      <div class="flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-100 dark:border-white/10">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-500/30 flex items-center justify-center text-charcoal dark:text-white shadow-xs">
            <span class="text-sm">✏️</span>
          </div>
          <div>
            <h3 id="modal-edit-title" class="font-bold text-charcoal dark:text-white text-sm">Edit Entry</h3>
            <p class="text-[11px] text-coolslate dark:text-slate-400">Correct amount, note, or date</p>
          </div>
        </div>
        <button class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-coolslate hover:text-charcoal dark:hover:text-white modal-close cursor-pointer transition-colors" type="button" aria-label="Close">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <form id="form-edit-ledger" class="px-5 py-4 space-y-3.5" novalidate autocomplete="off">
        <input type="hidden" id="edit-entry-id" />

        <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
          <div>
            <span class="font-semibold text-coolslate dark:text-slate-400">Goal Vault: </span>
            <span id="edit-entry-vault" class="font-bold text-charcoal dark:text-white">--</span>
          </div>
          <span id="edit-entry-type-badge" class="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full">--</span>
        </div>

        <div>
          <label class="block text-xs font-bold text-charcoal dark:text-white mb-1" for="edit-entry-amount">Amount (&#8377;)</label>
          <div class="amount-prefix-wrap">
            <span class="prefix-symbol">&#8377;</span>
            <input type="number" id="edit-entry-amount" class="input-metallic font-mono text-base sm:text-sm" min="1" required />
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-charcoal dark:text-white mb-1" for="edit-entry-note">Note / Reason</label>
          <input type="text" id="edit-entry-note" class="input-metallic text-base sm:text-sm" required />
        </div>

        <div>
          <label class="block text-xs font-bold text-charcoal dark:text-white mb-1" for="edit-entry-date">Date</label>
          <input type="date" id="edit-entry-date" class="input-metallic text-base sm:text-sm font-mono" required />
        </div>

        <div class="border-t border-slate-100 dark:border-white/10 pt-3 flex items-center justify-between gap-2.5">
          <button type="button" class="btn-secondary-metallic min-h-[48px] text-xs modal-close flex-1">Cancel</button>
          <button type="submit" id="btn-edit-ledger-submit" class="btn-primary-metallic min-h-[48px] text-xs flex-[2] flex items-center justify-center gap-2">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
            <span>Save Changes</span>
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- 5. MODAL: DELETE LEDGER CONFIRMATION -->
  <div class="modal-overlay" id="modal-delete-ledger" role="dialog" aria-modal="true" aria-labelledby="modal-del-title">
    <div class="modal-dialog max-w-sm">
      <div class="bottom-sheet-handle"></div>

      <div class="p-5 text-center space-y-3.5">
        <div class="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-500/30 text-crimson flex items-center justify-center mx-auto text-xl shadow-xs">
          🗑️
        </div>
        <div>
          <h3 id="modal-del-title" class="font-extrabold text-charcoal dark:text-white text-base">Delete Entry?</h3>
          <p class="text-xs text-coolslate dark:text-slate-400 mt-1 leading-relaxed">
            This will permanently remove this entry and reverse its balance impact on your vault.
          </p>
        </div>

        <div id="delete-preview-box" class="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-left text-xs space-y-1">
          <div class="text-coolslate dark:text-slate-400 font-mono text-[10px]" id="del-preview-date">--</div>
          <div class="font-bold text-charcoal dark:text-white flex justify-between">
            <span id="del-preview-vault">--</span>
            <span id="del-preview-amount" class="font-mono">--</span>
          </div>
          <div class="text-coolslate dark:text-slate-400 text-[11px]" id="del-preview-note">--</div>
        </div>

        <input type="hidden" id="delete-entry-id" />

        <div class="flex items-center gap-2.5 pt-1">
          <button type="button" class="btn-secondary-metallic min-h-[48px] text-xs modal-close flex-1">Cancel</button>
          <button type="button" id="btn-delete-ledger-confirm" class="btn-danger-metallic min-h-[48px] text-xs flex-1 flex items-center justify-center gap-2">
            <span>Delete Entry</span>
          </button>
        </div>
      </div>
    </div>
  </div>\n\n  """

with open('index.html', 'r', encoding='utf-8') as f:
    orig = f.read()

start_marker = '<!-- ============================================================ -->\n  <!-- 1. FULL AUTONOMOUS SPA COCKPIT WITH LOWER NAVIGATION DOCK    -->'
end_marker = '<!-- ============================================================ -->\n  <!-- 3D DUAL-MODE UNIVERSE & KINETIC STUDIO ENGINE v9               -->'

idx_start = orig.find(start_marker)
idx_end = orig.find(end_marker)

if idx_start == -1 or idx_end == -1:
    print("ERROR: Markers not found!")
    exit(1)

updated = orig[:idx_start] + new_layout_html + orig[idx_end:]

# Test write to a test file first
with open('scratch/test_index.html', 'w', encoding='utf-8') as f:
    f.write(updated)

print("scratch/test_index.html created successfully.")
