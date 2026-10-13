import { getFlagSvg } from '../utils/flags.js';

export class CurrencyPicker {
  constructor({ currencies, onSelect }) {
    this.currencies = currencies || [];
    this.onSelect = onSelect;
    this.isOpen = false;
    this.target = null; // 'from' ou 'to'
    this.selectedCode = 'USD';
    this.searchQuery = '';
    
    this.modalEl = document.getElementById('currency-picker-modal');
    this.initEvents();
  }

  open(target, currentSelectedCode) {
    this.target = target;
    this.selectedCode = currentSelectedCode || 'USD';
    this.searchQuery = '';
    this.isOpen = true;
    
    if (this.modalEl) {
      this.modalEl.classList.remove('hidden');
      this.render();
      const input = this.modalEl.querySelector('.picker-search-input');
      if (input) {
        input.value = '';
        input.focus();
      }
    }
  }

  close() {
    this.isOpen = false;
    if (this.modalEl) {
      this.modalEl.classList.add('hidden');
    }
  }

  initEvents() {
    if (!this.modalEl) return;

    // Fechar ao clicar no backdrop
    this.modalEl.addEventListener('click', (e) => {
      if (e.target === this.modalEl) {
        this.close();
      }
    });

    // Tecla ESC para fechar
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });

    // Campo de busca
    this.modalEl.addEventListener('input', (e) => {
      if (e.target.classList.contains('picker-search-input')) {
        this.searchQuery = e.target.value.trim().toLowerCase();
        this.renderList();
      }
    });

    // Seleção de moeda
    this.modalEl.addEventListener('click', (e) => {
      const itemEl = e.target.closest('.picker-currency-item');
      if (itemEl) {
        const code = itemEl.dataset.code;
        if (code && this.onSelect) {
          this.onSelect(this.target, code);
        }
        this.close();
      }
    });
  }

  render() {
    if (!this.modalEl) return;

    this.modalEl.innerHTML = `
      <div class="picker-card" role="dialog" aria-modal="true" aria-label="Select currency">
        <div class="picker-search-box">
          <svg class="picker-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="text" 
            class="picker-search-input" 
            placeholder="Search currencies..." 
            autocomplete="off" 
            spellcheck="false"
          />
        </div>
        <div class="picker-scroll-container">
          <!-- Renderizado dinamicamente -->
        </div>
      </div>
    `;

    this.renderList();
  }

  renderList() {
    const container = this.modalEl.querySelector('.picker-scroll-container');
    if (!container) return;

    const filtered = this.currencies.filter(c => {
      if (!this.searchQuery) return true;
      return (
        c.code.toLowerCase().includes(this.searchQuery) ||
        c.name.toLowerCase().includes(this.searchQuery)
      );
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="picker-empty">
          <p>No currencies found for "${this.searchQuery}"</p>
        </div>
      `;
      return;
    }

    const popularList = filtered.filter(c => c.popular);
    const otherList = filtered.filter(c => !c.popular);

    let html = '';

    if (popularList.length > 0) {
      html += `
        <div class="picker-group-header">
          <span>POPULAR</span>
          <span class="picker-count">${popularList.length}</span>
        </div>
        <div class="picker-group-items">
          ${popularList.map(c => this.renderItemHtml(c)).join('')}
        </div>
      `;
    }

    if (otherList.length > 0) {
      html += `
        <div class="picker-group-header">
          <span>OTHER CURRENCIES</span>
          <span class="picker-count">${otherList.length}</span>
        </div>
        <div class="picker-group-items">
          ${otherList.map(c => this.renderItemHtml(c)).join('')}
        </div>
      `;
    }

    container.innerHTML = html;
  }

  renderItemHtml(currency) {
    const isSelected = currency.code === this.selectedCode;
    const flagSvg = getFlagSvg(currency.country || currency.code);

    return `
      <div 
        class="picker-currency-item ${isSelected ? 'is-selected' : ''}" 
        data-code="${currency.code}"
        tabindex="0"
        role="button"
      >
        <div class="picker-item-left">
          <div class="picker-flag-wrap">
            ${flagSvg}
          </div>
          <span class="picker-code">${currency.code}</span>
          <span class="picker-name">${currency.name}</span>
        </div>
        ${isSelected ? `
          <svg class="picker-check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        ` : ''}
      </div>
    `;
  }
}
