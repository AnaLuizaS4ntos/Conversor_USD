import { formatPercentChange } from '../utils/formatters.js';

export class FavoritesList {
  constructor({ containerEl, onToggleFavorite, onSelectPair }) {
    this.containerEl = containerEl;
    this.onToggleFavorite = onToggleFavorite;
    this.onSelectPair = onSelectPair;
  }

  render(favorites = []) {
    if (!this.containerEl) return;

    if (!favorites || favorites.length === 0) {
      this.renderEmpty();
      return;
    }

    const rowsHtml = favorites.map(fav => {
      const { formatted, isPositive } = formatPercentChange(fav.changePercent);
      const colorClass = isPositive ? 'trend-up' : 'trend-down';
      const rateStr = fav.rate >= 100 ? fav.rate.toFixed(2) : fav.rate.toFixed(4);

      return `
        <div class="favorite-item-card" tabindex="0" data-base="${fav.base}" data-quote="${fav.quote}">
          <div class="fav-pair-title">
            <span class="fav-base">${fav.base}</span>
            <span class="fav-arrow">→</span>
            <span class="fav-quote">${fav.quote}</span>
          </div>
          <div class="fav-right">
            <div class="fav-rate-info">
              <span class="fav-rate">${rateStr}</span>
              <span class="fav-change ${colorClass}">${formatted}</span>
            </div>
            <button 
              class="star-fav-btn is-favorited" 
              data-base="${fav.base}" 
              data-quote="${fav.quote}"
              title="Remove from pinned pairs"
              aria-label="Remove favorite ${fav.base} to ${fav.quote}"
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
        <span class="sub-header-title">PINNED PAIRS</span>
        <span class="sub-header-count">${favorites.length} FAVORITES</span>
      </div>
      <div class="favorites-grid">
        ${rowsHtml}
      </div>
    `;

    this.attachEvents();
  }

  renderEmpty() {
    this.containerEl.innerHTML = `
      <div class="empty-state-box">
        <h3 class="empty-title">No pinned pairs yet</h3>
        <p class="empty-desc">Pin a pair to track its rate here. Tap the star icon on any conversion or comparison row.</p>
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

    const cards = this.containerEl.querySelectorAll('.favorite-item-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const b = card.dataset.base;
        const q = card.dataset.quote;
        if (b && q && this.onSelectPair) {
          this.onSelectPair(b, q);
        }
      });
    });
  }
}
