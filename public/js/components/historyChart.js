export class HistoryChart {
  constructor({ containerEl, onRangeChange }) {
    this.containerEl = containerEl;
    this.onRangeChange = onRangeChange;
    this.activeRange = '1M';
    this.currentData = null;
  }

  setData(data) {
    this.currentData = data;
    this.render();
  }

  render() {
    if (!this.containerEl) return;

    if (!this.currentData || !this.currentData.points || this.currentData.points.length === 0) {
      this.renderEmpty();
      return;
    }

    const { base, quote, open, last, change, changePercent, range, lastUpdated, points } = this.currentData;
    this.activeRange = range || this.activeRange;

    const isPositive = change >= 0;
    const sign = isPositive ? '+' : '';
    const arrow = isPositive ? '▲ ' : '▼ ';
    const trendColor = isPositive ? 'trend-up' : 'trend-down';

    this.containerEl.innerHTML = `
      <div class="history-controls-bar">
        <div class="stats-grid">
          <div class="stat-card">
            <span class="stat-label">OPEN</span>
            <span class="stat-val">${open.toFixed(4)}</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">LAST</span>
            <span class="stat-val">${last.toFixed(4)}</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">CHANGE</span>
            <span class="stat-val ${trendColor}">${sign}${change.toFixed(4)}</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">% CHANGE</span>
            <span class="stat-val ${trendColor}">${arrow}${sign}${changePercent.toFixed(2)}%</span>
          </div>
        </div>

        <div class="range-selector">
          ${['5D', '1M', '3M', '1Y', '5Y'].map(r => `
            <button class="range-btn ${r === this.activeRange ? 'is-active' : ''}" data-range="${r}">${r}</button>
          `).join('')}
        </div>
      </div>

      <div class="chart-box">
        <div class="chart-header">
          <div class="chart-title">${base}/${quote}</div>
          <div class="chart-subtitle">${last.toFixed(4)} · ${lastUpdated || 'MAY 14 16:00 CET'}</div>
        </div>
        <div class="chart-canvas-wrap" id="chart-svg-container">
          ${this.generateSvg(points)}
        </div>
      </div>
    `;

    this.attachEvents();
  }

  generateSvg(points) {
    const width = 800;
    const height = 300;
    const padding = { top: 30, right: 30, bottom: 40, left: 60 };

    const values = points.map(p => p.value);
    const minVal = Math.min(...values) * 0.998;
    const maxVal = Math.max(...values) * 1.002;
    const rangeVal = maxVal - minVal || 1;

    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const getX = (index) => padding.left + (index / (points.length - 1)) * chartW;
    const getY = (val) => padding.top + chartH - ((val - minVal) / rangeVal) * chartH;

    // Gerar pontos da linha suave
    const pathCoords = points.map((p, i) => `${getX(i).toFixed(1)},${getY(p.value).toFixed(1)}`);
    const linePath = `M ${pathCoords.join(' L ')}`;
    
    // Caminho da área preenchida com gradiente
    const firstX = getX(0).toFixed(1);
    const lastX = getX(points.length - 1).toFixed(1);
    const bottomY = (padding.top + chartH).toFixed(1);
    const areaPath = `${linePath} L ${lastX},${bottomY} L ${firstX},${bottomY} Z`;

    // Linhas de grade e valores no eixo Y
    const ySteps = 3;
    let gridLinesHtml = '';
    let yLabelsHtml = '';
    for (let i = 0; i <= ySteps; i++) {
      const yNorm = i / ySteps;
      const yPos = padding.top + yNorm * chartH;
      const stepVal = maxVal - yNorm * rangeVal;
      gridLinesHtml += `<line x1="${padding.left}" y1="${yPos}" x2="${width - padding.right}" y2="${yPos}" stroke="#22242B" stroke-dasharray="3 3" stroke-width="1"/>`;
      yLabelsHtml += `<text x="${padding.left - 12}" y="${yPos + 4}" fill="#6E7079" font-size="11" font-family="monospace" text-anchor="end">${stepVal.toFixed(4)}</text>`;
    }

    // Rótulos do eixo X (5 datas distribuídas)
    let xLabelsHtml = '';
    const dateStep = Math.floor(points.length / 4);
    for (let i = 0; i < points.length; i += dateStep) {
      const p = points[i];
      const xPos = getX(i);
      const d = new Date(p.timestamp || p.date);
      const label = `${d.toLocaleString('en-US', { month: 'short' })} ${d.getDate()}`;
      xLabelsHtml += `<text x="${xPos}" y="${height - 10}" fill="#6E7079" font-size="11" font-family="monospace" text-anchor="middle">${label}</text>`;
    }

    return `
      <svg viewBox="0 0 ${width} ${height}" class="chart-svg" preserveAspectRatio="none">
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#B6F02A" stop-opacity="0.38"/>
            <stop offset="60%" stop-color="#B6F02A" stop-opacity="0.10"/>
            <stop offset="100%" stop-color="#B6F02A" stop-opacity="0.0"/>
          </linearGradient>
        </defs>

        <!-- Grade e Eixos -->
        ${gridLinesHtml}
        ${yLabelsHtml}
        ${xLabelsHtml}

        <!-- Preenchimento e Linha -->
        <path d="${areaPath}" fill="url(#chartGradient)"/>
        <path d="${linePath}" fill="none" stroke="#B6F02A" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
        
        <!-- Ponto final brilhante -->
        <circle cx="${lastX}" cy="${getY(points[points.length - 1].value)}" r="4" fill="#B6F02A" />
        <circle cx="${lastX}" cy="${getY(points[points.length - 1].value)}" r="7" fill="#B6F02A" fill-opacity="0.25" />
      </svg>
    `;
  }

  renderEmpty() {
    this.containerEl.innerHTML = `
      <div class="empty-state-box">
        <h3 class="empty-title">No chart data available</h3>
        <p class="empty-desc">We couldn't load rate history for this pair right now. This usually clears up in a minute.</p>
      </div>
    `;
  }

  attachEvents() {
    const rangeBtns = this.containerEl.querySelectorAll('.range-btn');
    rangeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const r = btn.dataset.range;
        if (r && this.onRangeChange) {
          this.activeRange = r;
          this.onRangeChange(r);
        }
      });
    });
  }
}
