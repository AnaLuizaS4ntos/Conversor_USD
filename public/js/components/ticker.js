export function initTicker(containerEl, tickerData) {
  if (!containerEl) return;

  const markets = tickerData?.markets || [];
  const label = tickerData?.label || '55 CURRENCIES · EOD · ECB DATA';

  const marketsHtml = markets.map(item => {
    const isPositive = item.changePercent >= 0;
    const sign = isPositive ? '+' : '';
    const arrow = isPositive ? '▲ ' : '▼ ';
    const colorClass = isPositive ? 'trend-up' : 'trend-down';
    return `
      <div class="ticker-item">
        <span class="ticker-pair">${item.pair}</span>
        <span class="ticker-rate">${item.rate.toFixed(item.rate >= 100 ? 2 : 4)}</span>
        <span class="ticker-change ${colorClass}">${arrow}${sign}${item.changePercent.toFixed(2)}%</span>
      </div>
    `;
  }).join('');

  containerEl.innerHTML = `
    <div class="ticker-bar">
      <div class="ticker-left">
        <div class="live-badge">
          <span class="live-dot"></span>
          LIVE MARKETS
        </div>
        <div class="ticker-scroll">
          ${marketsHtml}
        </div>
      </div>
      <div class="ticker-meta">${label}</div>
    </div>
  `;
}
