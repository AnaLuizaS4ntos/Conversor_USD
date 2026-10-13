import { api } from './api.js';
import { initTicker } from './components/ticker.js';
import { ConverterCard } from './components/converterCard.js';
import { CurrencyPicker } from './components/currencyPicker.js';
import { HistoryChart } from './components/historyChart.js';
import { CompareList } from './components/compareList.js';
import { FavoritesList } from './components/favoritesList.js';
import { LogList } from './components/logList.js';

class App {
  constructor() {
    this.activeTab = 'history';
    this.activeRange = '1M';
    this.currencies = [];
    this.ratesData = {};
    this.favorites = [];
    this.logs = [];

    this.sendAmount = 1000;
    this.fromCurrency = 'USD';
    this.toCurrency = 'EUR';
    this.currentRate = 0.85302;

    this.init();
  }

  async init() {
    this.bindTabEvents();

    // 1. Carregar moedas
    try {
      const curRes = await api.getCurrencies();
      this.currencies = curRes.currencies || [];
    } catch (e) {
      console.error('Falha ao carregar moedas:', e);
    }

    // 2. Inicializar Seletor de Moedas
    this.currencyPicker = new CurrencyPicker({
      currencies: this.currencies,
      onSelect: (target, code) => this.handleCurrencySelect(target, code)
    });

    // 3. Inicializar Card Conversor
    const converterContainer = document.getElementById('converter-card-root');
    this.converterCard = new ConverterCard({
      containerEl: converterContainer,
      onAmountChange: (amt) => this.handleAmountChange(amt),
      onOpenPicker: (target, code) => this.currencyPicker.open(target, code),
      onSwap: () => this.handleSwap(),
      onToggleFavorite: (b, q) => this.handleToggleFavorite(b, q),
      onLogConversion: (data) => this.handleLogConversion(data)
    });

    // 4. Inicializar Componentes das Abas
    this.historyChart = new HistoryChart({
      containerEl: document.getElementById('history-tab-content'),
      onRangeChange: (r) => this.handleRangeChange(r)
    });

    this.compareList = new CompareList({
      containerEl: document.getElementById('compare-tab-content'),
      onToggleFavorite: (b, q) => this.handleToggleFavorite(b, q)
    });

    this.favoritesList = new FavoritesList({
      containerEl: document.getElementById('favorites-tab-content'),
      onToggleFavorite: (b, q) => this.handleToggleFavorite(b, q),
      onSelectPair: (b, q) => this.handleSelectPair(b, q)
    });

    this.logList = new LogList({
      containerEl: document.getElementById('log-tab-content'),
      onDeleteLog: (id) => this.handleDeleteLog(id),
      onClearLogs: () => this.handleClearLogs(),
      onSelectConversion: (f, t, amt) => this.handleSelectConversion(f, t, amt)
    });

    // 5. Carregar Dados Iniciais
    await Promise.all([
      this.loadTicker(),
      this.loadFavorites(),
      this.loadLogs(),
      this.recalculate()
    ]);

    // Rota inicial pela URL
    this.routeFromUrl();
  }

  routeFromUrl() {
    const path = window.location.pathname.replace('/', '').toLowerCase();
    if (['compare', 'favorites', 'log'].includes(path)) {
      this.switchTab(path, false);
    } else {
      this.switchTab('history', false);
    }
  }

  async loadTicker() {
    try {
      const tickerData = await api.getTicker();
      const tickerRoot = document.getElementById('header-ticker-root');
      initTicker(tickerRoot, tickerData);
    } catch (e) {
      console.warn('Ticker indisponível:', e);
    }
  }

  async loadFavorites() {
    try {
      const res = await api.getFavorites();
      this.favorites = res.favorites || [];
      this.updateBadges();
      if (this.activeTab === 'favorites') {
        this.favoritesList.render(this.favorites);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async loadLogs() {
    try {
      const res = await api.getLogs();
      this.logs = res.logs || [];
      this.updateBadges();
      if (this.activeTab === 'log') {
        this.logList.render(this.logs);
      }
    } catch (e) {
      console.error(e);
    }
  }

  updateBadges() {
    const favCountEl = document.getElementById('fav-count-badge');
    const logCountEl = document.getElementById('log-count-badge');
    const mobileFavBadge = document.getElementById('mobile-fav-badge');

    const favCount = this.favorites.length;
    const logCount = this.logs.length;

    if (favCountEl) favCountEl.textContent = favCount;
    if (mobileFavBadge) mobileFavBadge.textContent = favCount;
    if (logCountEl) logCountEl.textContent = logCount;
  }

  async recalculate() {
    try {
      const conv = await api.convert(this.fromCurrency, this.toCurrency, this.sendAmount);
      this.currentRate = conv.rate;
      const convertedAmount = conv.result;

      // Verificar se par atual está favoritado
      const isFav = this.favorites.some(
        f => f.base.toUpperCase() === this.fromCurrency.toUpperCase() &&
             f.quote.toUpperCase() === this.toCurrency.toUpperCase()
      );

      // Atualizar card conversor
      this.converterCard.update({
        fromCurrency: this.fromCurrency,
        toCurrency: this.toCurrency,
        amount: this.sendAmount,
        convertedAmount: convertedAmount,
        rate: this.currentRate,
        isFavorited: isFav
      });

      // Atualizar aba ativa
      await this.refreshActiveTab();
    } catch (e) {
      console.error('Erro na recalculação:', e);
    }
  }

  async refreshActiveTab() {
    if (this.activeTab === 'history') {
      try {
        const histData = await api.getHistory(this.fromCurrency, this.toCurrency, this.activeRange);
        this.historyChart.setData(histData);
      } catch {
        this.historyChart.renderEmpty();
      }
    } else if (this.activeTab === 'compare') {
      try {
        const ratesRes = await api.getLatestRates(this.fromCurrency);
        this.compareList.render({
          base: this.fromCurrency,
          amount: this.sendAmount,
          rates: ratesRes.rates || {},
          favorites: this.favorites
        });
      } catch {
        this.compareList.renderEmpty();
      }
    } else if (this.activeTab === 'favorites') {
      this.favoritesList.render(this.favorites);
    } else if (this.activeTab === 'log') {
      this.logList.render(this.logs);
    }
  }

  handleCurrencySelect(target, code) {
    if (target === 'from') {
      this.fromCurrency = code;
    } else {
      this.toCurrency = code;
    }
    this.recalculate();
  }

  handleAmountChange(amt) {
    this.sendAmount = amt;
    this.recalculate();
  }

  handleSwap() {
    const temp = this.fromCurrency;
    this.fromCurrency = this.toCurrency;
    this.toCurrency = temp;
    this.recalculate();
  }

  async handleToggleFavorite(base, quote) {
    try {
      await api.toggleFavorite(base, quote);
      await this.loadFavorites();
      
      // Atualizar estado no card se for o par ativo
      const isFav = this.favorites.some(
        f => f.base.toUpperCase() === this.fromCurrency.toUpperCase() &&
             f.quote.toUpperCase() === this.toCurrency.toUpperCase()
      );
      this.converterCard.update({ isFavorited: isFav });
      
      // Re-renderizar aba ativa se afetada
      if (this.activeTab === 'compare' || this.activeTab === 'favorites') {
        this.refreshActiveTab();
      }
    } catch (e) {
      console.error(e);
    }
  }

  async handleLogConversion(data) {
    try {
      await api.addLog(data);
      await this.loadLogs();
      if (this.activeTab === 'log') {
        this.logList.render(this.logs);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async handleDeleteLog(id) {
    try {
      await api.deleteLog(id);
      await this.loadLogs();
    } catch (e) {
      console.error(e);
    }
  }

  async handleClearLogs() {
    try {
      await api.clearLogs();
      await this.loadLogs();
    } catch (e) {
      console.error(e);
    }
  }

  handleSelectPair(base, quote) {
    this.fromCurrency = base;
    this.toCurrency = quote;
    this.switchTab('history');
    this.recalculate();
  }

  handleSelectConversion(from, to, amount) {
    this.fromCurrency = from;
    this.toCurrency = to;
    this.sendAmount = Number(amount);
    this.switchTab('history');
    this.recalculate();
  }

  handleRangeChange(range) {
    this.activeRange = range;
    this.refreshActiveTab();
  }

  switchTab(tabName, pushState = true) {
    this.activeTab = tabName;

    // Atualizar botões desktop
    const tabButtons = document.querySelectorAll('.nav-tab-btn');
    tabButtons.forEach(btn => {
      if (btn.dataset.tab === tabName) {
        btn.classList.add('is-active');
      } else {
        btn.classList.remove('is-active');
      }
    });

    // Atualizar seletor mobile
    const mobileTabSelect = document.getElementById('mobile-tab-trigger-label');
    if (mobileTabSelect) {
      mobileTabSelect.textContent = tabName.toUpperCase();
    }

    // Esconder/exibir painéis
    const tabPanels = document.querySelectorAll('.tab-panel');
    tabPanels.forEach(panel => {
      if (panel.id === `${tabName}-tab-content`) {
        panel.classList.remove('hidden');
      } else {
        panel.classList.add('hidden');
      }
    });

    if (pushState) {
      const newPath = tabName === 'history' ? '/home' : `/${tabName}`;
      window.history.pushState({}, '', newPath);
    }

    this.refreshActiveTab();
  }

  bindTabEvents() {
    // Abas Desktop
    const tabButtons = document.querySelectorAll('.nav-tab-btn');
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        if (tab) this.switchTab(tab);
      });
    });

    // Dropdown de abas no Mobile
    const mobileTrigger = document.getElementById('mobile-tabs-dropdown-btn');
    const mobileMenu = document.getElementById('mobile-tabs-menu');

    if (mobileTrigger && mobileMenu) {
      mobileTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        mobileMenu.classList.toggle('hidden');
      });

      document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && e.target !== mobileTrigger) {
          mobileMenu.classList.add('hidden');
        }
      });

      const mobileOptions = mobileMenu.querySelectorAll('.mobile-tab-opt');
      mobileOptions.forEach(opt => {
        opt.addEventListener('click', () => {
          const tab = opt.dataset.tab;
          if (tab) {
            this.switchTab(tab);
            mobileMenu.classList.add('hidden');
          }
        });
      });
    }

    // Navegação via Voltar/Avançar do navegador
    window.addEventListener('popstate', () => {
      this.routeFromUrl();
    });
  }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  window.fxApp = new App();
});
