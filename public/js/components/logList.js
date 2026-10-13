import { formatAmount, formatRelativeTime } from '../utils/formatters.js';

export class LogList {
  constructor({ containerEl, onDeleteLog, onClearLogs, onSelectConversion }) {
    this.containerEl = containerEl;
    this.onDeleteLog = onDeleteLog;
    this.onClearLogs = onClearLogs;
    this.onSelectConversion = onSelectConversion;
  }

  render(logs = []) {
    if (!this.containerEl) return;

    if (!logs || logs.length === 0) {
      this.renderEmpty();
      return;
    }

    const rowsHtml = logs.map(item => {
      const timeStr = formatRelativeTime(item.timestamp);
      const fromDecimals = (item.from === 'JPY' || item.from === 'BDT') ? 0 : 2;
      const toDecimals = (item.to === 'JPY' || item.to === 'BDT') ? 0 : 2;

      return `
        <div class="log-item-card" tabindex="0" data-id="${item.id}" data-from="${item.from}" data-to="${item.to}" data-amount="${item.fromAmount}">
          <div class="log-left-col">
            <span class="log-time">${timeStr}</span>
            <div class="log-pair-box">
              <span class="log-curr">${item.from}</span>
              <span class="log-arrow">→</span>
              <span class="log-curr">${item.to}</span>
            </div>
          </div>
          <div class="log-right-col">
            <div class="log-amounts">
              <span class="log-from-amount">${formatAmount(item.fromAmount, fromDecimals)}</span>
              <span class="log-to-amount">${formatAmount(item.toAmount, toDecimals)}</span>
            </div>
            <button class="log-trash-btn" data-id="${item.id}" title="Delete record" aria-label="Delete conversion record">
              <svg viewBox="0 0 24 24" class="trash-icon">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </div>
      `;
    }).join('');

    this.containerEl.innerHTML = `
      <div class="section-sub-header">
        <span class="sub-header-title">CONVERSION LOG</span>
        <div class="sub-header-actions">
          <span class="sub-header-count">${logs.length} LOGGED</span>
          <button class="clear-all-btn" id="clear-all-logs-btn">CLEAR ALL</button>
        </div>
      </div>
      <div class="logs-grid">
        ${rowsHtml}
      </div>
    `;

    this.attachEvents();
  }

  renderEmpty() {
    this.containerEl.innerHTML = `
      <div class="empty-state-box">
        <h3 class="empty-title">No conversions logged yet</h3>
        <p class="empty-desc">Every conversion is recorded here automatically when you tap LOG CONVERSION. Your log is private to this device and this browser.</p>
      </div>
    `;
  }

  attachEvents() {
    const trashBtns = this.containerEl.querySelectorAll('.log-trash-btn');
    trashBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        if (id && this.onDeleteLog) {
          this.onDeleteLog(id);
        }
      });
    });

    const clearBtn = this.containerEl.querySelector('#clear-all-logs-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (this.onClearLogs) {
          this.onClearLogs();
        }
      });
    }

    const cards = this.containerEl.querySelectorAll('.log-item-card');
    cards.forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.log-trash-btn')) return;
        const from = card.dataset.from;
        const to = card.dataset.to;
        const amount = card.dataset.amount;
        if (from && to && this.onSelectConversion) {
          this.onSelectConversion(from, to, amount);
        }
      });
    });
  }
}
