import { getFlagSvg } from '../utils/flags.js';
import { formatAmount } from '../utils/formatters.js';

export class ConverterCard {
  constructor({
    containerEl,
    onAmountChange,
    onOpenPicker,
    onSwap,
    onToggleFavorite,
    onLogConversion
  }) {
    this.containerEl = containerEl;
    this.onAmountChange = onAmountChange;
    this.onOpenPicker = onOpenPicker;
    this.onSwap = onSwap;
    this.onToggleFavorite = onToggleFavorite;
    this.onLogConversion = onLogConversion;

    this.state = {
      fromCurrency: 'USD',
      toCurrency: 'EUR',
      amount: 1000,
      convertedAmount: 853.02,
      rate: 0.85302,
      isFavorited: true
    };
  }

  update(newState) {
    this.state = { ...this.state, ...newState };
    this.render();
  }

  render() {
    if (!this.containerEl) return;

    const { fromCurrency, toCurrency, amount, convertedAmount, rate, isFavorited } = this.state;
    const fromFlag = getFlagSvg(fromCurrency);
    const toFlag = getFlagSvg(toCurrency);
    const toDecimals = (toCurrency === 'JPY' || toCurrency === 'BDT') ? 0 : 2;

    this.containerEl.innerHTML = `
      <div class="converter-card-wrapper">
        <h2 class="card-title">CHECK THE RATE</h2>

        <div class="converter-inputs-row">
          <!-- SEND BOX -->
          <div class="amount-field-box" id="send-field-box">
            <label class="field-label" for="send-amount-input">SEND</label>
            <div class="field-body">
              <input 
                type="text" 
                id="send-amount-input" 
                class="amount-input" 
                value="${formatAmount(amount, 0)}" 
                inputmode="decimal"
                autocomplete="off"
              />
              <button class="currency-pill-btn" id="from-currency-pill" title="Change send currency">
                <span class="pill-flag">${fromFlag}</span>
                <span class="pill-code">${fromCurrency}</span>
                <svg class="pill-chevron" viewBox="0 0 24 24">
                  <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- SWAP BUTTON -->
          <button class="swap-currency-btn" id="swap-currencies-btn" title="Swap currencies" aria-label="Swap currencies">
            <svg viewBox="0 0 24 24" class="swap-icon">
              <path d="M7 16V4M7 4L3 8M7 4L11 8M17 8V20M17 20L21 16M17 20L13 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>

          <!-- RECEIVE BOX -->
          <div class="amount-field-box" id="receive-field-box">
            <label class="field-label">RECEIVE</label>
            <div class="field-body">
              <span class="amount-output-text">${formatAmount(convertedAmount, toDecimals)}</span>
              <button class="currency-pill-btn" id="to-currency-pill" title="Change receive currency">
                <span class="pill-flag">${toFlag}</span>
                <span class="pill-code">${toCurrency}</span>
                <svg class="pill-chevron" viewBox="0 0 24 24">
                  <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- RATE SUBTITLE & ACTIONS -->
        <div class="converter-footer-row">
          <div class="rate-quote-subtext">
            1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}
          </div>

          <div class="card-action-btns">
            <button class="action-pill-btn fav-action-btn ${isFavorited ? 'is-active' : ''}" id="fav-toggle-btn">
              <span class="fav-icon">${isFavorited ? '★' : '☆'}</span>
              <span>${isFavorited ? 'FAVORITED' : 'FAVORITE'}</span>
            </button>

            <button class="action-pill-btn log-action-btn" id="log-conv-btn">
              <span>LOG CONVERSION</span>
            </button>
          </div>
        </div>
      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    const input = this.containerEl.querySelector('#send-amount-input');
    if (input) {
      input.addEventListener('focus', () => {
        // Remover vírgulas ao focar para facilitar edição
        const raw = input.value.replace(/,/g, '');
        input.value = raw;
      });

      input.addEventListener('blur', () => {
        const clean = parseFloat(input.value.replace(/,/g, ''));
        const finalVal = isNaN(clean) ? 0 : clean;
        this.state.amount = finalVal;
        input.value = formatAmount(finalVal, 0);
        if (this.onAmountChange) this.onAmountChange(finalVal);
      });

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          input.blur();
        }
      });
    }

    const fromPill = this.containerEl.querySelector('#from-currency-pill');
    if (fromPill) {
      fromPill.addEventListener('click', () => {
        if (this.onOpenPicker) this.onOpenPicker('from', this.state.fromCurrency);
      });
    }

    const toPill = this.containerEl.querySelector('#to-currency-pill');
    if (toPill) {
      toPill.addEventListener('click', () => {
        if (this.onOpenPicker) this.onOpenPicker('to', this.state.toCurrency);
      });
    }

    const swapBtn = this.containerEl.querySelector('#swap-currencies-btn');
    if (swapBtn) {
      swapBtn.addEventListener('click', () => {
        if (this.onSwap) this.onSwap();
      });
    }

    const favBtn = this.containerEl.querySelector('#fav-toggle-btn');
    if (favBtn) {
      favBtn.addEventListener('click', () => {
        if (this.onToggleFavorite) {
          this.onToggleFavorite(this.state.fromCurrency, this.state.toCurrency);
        }
      });
    }

    const logBtn = this.containerEl.querySelector('#log-conv-btn');
    if (logBtn) {
      logBtn.addEventListener('click', () => {
        if (this.onLogConversion) {
          this.onLogConversion({
            from: this.state.fromCurrency,
            to: this.state.toCurrency,
            fromAmount: this.state.amount,
            toAmount: this.state.convertedAmount,
            rate: this.state.rate
          });

          // Feedback visual rápido
          logBtn.classList.add('flash-success');
          setTimeout(() => logBtn.classList.remove('flash-success'), 600);
        }
      });
    }
  }
}
