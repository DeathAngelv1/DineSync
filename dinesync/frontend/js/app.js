/**
 * DINESYNC Main Application Controller & Router
 */
const App = {
  currentRoute: 'home',

  async init() {
    console.log('🍽️ Initializing DINESYNC Smart Restaurant System...');
    
    // Connect WebSocket
    if (window.dinesyncWS) {
      window.dinesyncWS.connect();
    }

    // Initialize module controllers
    await DashboardController.init();
    await TablesController.init();
    await QueueController.init();
    await AIPredictionController.init();
    await AnalyticsController.init();
    await AdminController.init();

    // Check URL hash for routing
    const hash = window.location.hash.replace('#', '') || 'home';
    this.navigateTo(hash, false);

    window.addEventListener('hashchange', () => {
      const h = window.location.hash.replace('#', '') || 'home';
      this.navigateTo(h, false);
    });

    if (window.lucide) {
      lucide.createIcons();
    }
  },

  navigateTo(route, updateHash = true) {
    const validRoutes = ['home', 'dashboard', 'tables', 'queue', 'predictions', 'analytics', 'admin'];
    if (!validRoutes.includes(route)) route = 'home';

    this.currentRoute = route;
    if (updateHash) {
      window.location.hash = route;
    }

    // Hide all view containers
    validRoutes.forEach(r => {
      const el = document.getElementById(`view-${r}`);
      if (el) el.classList.add('hidden');

      const navBtn = document.getElementById(`nav-link-${r}`);
      const navBtnMobile = document.getElementById(`nav-mobile-${r}`);
      if (navBtn) navBtn.classList.remove('bg-cyan-500/20', 'text-cyan-400', 'border-cyan-500/30', 'font-semibold');
      if (navBtnMobile) navBtnMobile.classList.remove('text-cyan-400', 'font-bold');
    });

    // Show current route view
    const activeEl = document.getElementById(`view-${route}`);
    if (activeEl) activeEl.classList.remove('hidden');

    const activeNavBtn = document.getElementById(`nav-link-${route}`);
    const activeNavBtnMobile = document.getElementById(`nav-mobile-${route}`);
    if (activeNavBtn) activeNavBtn.classList.add('bg-cyan-500/20', 'text-cyan-400', 'border-cyan-500/30', 'font-semibold');
    if (activeNavBtnMobile) activeNavBtnMobile.classList.add('text-cyan-400', 'font-bold');

    // Trigger module-specific refreshes
    if (route === 'dashboard') DashboardController.fetchAndRenderStats();
    if (route === 'tables') TablesController.render();
    if (route === 'queue') QueueController.fetchPublicQueue();
    if (route === 'predictions') AIPredictionController.calculateWaitPrediction();
    if (route === 'analytics') AnalyticsController.fetchAndRenderAnalytics();
    if (route === 'admin') AdminController.refreshAll();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (window.lucide) {
      lucide.createIcons();
    }
  },

  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    let borderClass = 'border-cyan-500/40 text-cyan-200 bg-slate-900/95';
    let icon = 'info';

    if (type === 'success') {
      borderClass = 'border-emerald-500/50 text-emerald-200 bg-slate-900/95';
      icon = 'check-circle';
    } else if (type === 'warning') {
      borderClass = 'border-amber-500/50 text-amber-200 bg-slate-900/95';
      icon = 'alert-triangle';
    } else if (type === 'error') {
      borderClass = 'border-rose-500/50 text-rose-200 bg-slate-900/95';
      icon = 'alert-octagon';
    }

    toast.className = `toast p-4 rounded-xl border ${borderClass} shadow-2xl backdrop-blur-md flex items-center gap-3 text-xs max-w-sm`;
    toast.innerHTML = `
      <i data-lucide="${icon}" class="w-4 h-4 shrink-0"></i>
      <span class="flex-1 font-medium">${message}</span>
      <button onclick="this.parentElement.remove()" class="text-slate-400 hover:text-white ml-2">✕</button>
    `;

    container.appendChild(toast);
    if (window.lucide) lucide.createIcons();

    setTimeout(() => {
      if (toast.parentElement) {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
      }
    }, 4500);
  },

  playAlertChime() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';

      osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc1.frequency.setValueAtTime(880.00, ctx.currentTime + 0.15); // A5

      osc2.frequency.setValueAtTime(440.00, ctx.currentTime);
      osc2.frequency.setValueAtTime(659.25, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.85);
      osc2.stop(ctx.currentTime + 0.85);
    } catch (e) {
      console.log('Audio chime not supported');
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
