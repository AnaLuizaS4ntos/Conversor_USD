import { getFlagSvg } from '../utils/flags.js';
import { formatAmount } from '../utils/formatters.js';

export class CompareList {
  constructor({ containerEl, onToggleFavorite }) {
    this.containerEl = containerEl;
    this.onToggleFavorite = onToggleFavorite;
  }

  render({ base, amount, rates, favorites = [] }) {
    if (!this.containerEl) return;

    if (!amount || amount <= 0) {
      this.renderEmpty();
      return;
    }

    // Moedas de comparação do design: GBP, JPY, CHF, CAD, AUD, INR, CNY, BDT
    const compareTargets = [
      { code: 'GBP', name: 'British Pound', country: 'GB' },
      { code: 'JPY', name: 'Japanese Yen', country: 'JP' },
      { code: 'CHF', name: 'Swiss Franc', country: 'CH' },
      { code: 'CAD', name: 'Canadian Dollar', country: 'CA' },
      { code: 'AUD', name: 'Australian Dollar', country: 'AU' },
      { code: 'INR', name: 'Indian Rupee', country: 'IN' },
      { code: 'CNY', name: 'Chinese Yuan', country: 'CN' },
      { code: 'BDT', name: 'Bangladeshi Taka', country: 'BD' }
    ];

    const favSet = new Set(
      favorites.map(f => `${f.base.toUpperCase()}-${f.quote.toUpperCase()}`)
    );

    const rowsHtml = compareTargets.map(target => {
      const rate = rates[target.code] || 1;
      const convertedVal = amount * rate;
      const pairKey = `${base.toUpperCase()}-${target.code.toUpperCase()}`;
      const isFav = favSet.has(pairKey);
      const flagSvg = getFlagSvg(target.country || target.code);

      return `
        <div class="compare-item-card" tabindex="0" data-pair="${pairKey}">
          <div class="compare-left">
            <div class="compare-flag-wrap">
              ${flagSvg}
            </div>
            <div class="compare-info">
              <span class="compare-code">${target.code}</span>
              <span class="compare-name">${target.name}</span>
            </div>
          </div>
          <div class="compare-right">
            <div class="compare-values">
              <span class="compare-total">${formatAmount(convertedVal, target.code === 'JPY' ? 0 : 2)}</span>
              <span class="compare-unit">@ ${rate.toFixed(4)}</span>
            </div>
            <button 
              class="star-fav-btn ${isFav ? 'is-favorited' : ''}" 
              data-base="${base}" 
              data-quote="${target.code}"
              title="${isFav ? 'Remove from favorites' : 'Add to favorites'}"
              aria-label="Favorite ${base} to ${target.code}"
            >
              <svg viewBox="0 0 24 24" class="star-icon">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      `;
    }).join('');

    this.containerEl.innerHTML = `
      <div class="section-sub-header">
        <span class="sub-header-title">MULTI-CURRENCY ${formatAmount(amount, 0)} FROM ${base}</span>
        <span class="sub-header-count">${compareTargets.length} PAIRS</span>
      </div>
      <div class="compare-grid">
        ${rowsHtml}
      </div>
    `;

    this.attachEvents();
  }

  renderEmpty() {
    this.containerEl.innerHTML = `
      <div class="empty-state-box">
        <h3 class="empty-title">No comparison available</h3>
        <p class="empty-desc">Enter an amount in SEND above to see what your money is worth in other currencies.</p>
      </div>
    `;
  }

  attachEvents() {
    const starBtns = this.containerEl.querySelectorAll('.star-fav-btn');
    starBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const b = btn.dataset.base;
        const q = btn.dataset.quote;
        if (b && q && this.onToggleFavorite) {
          this.onToggleFavorite(b, q);
        }
      });
    });
  }
}
