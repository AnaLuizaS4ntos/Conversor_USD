// Formatadores numéricos, monetários e temporais
export function formatAmount(val, decimals = 2) {
  if (val === undefined || val === null || isNaN(val)) return '0.00';
  const num = Number(val);
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

export function formatRate(val) {
  if (val === undefined || val === null || isNaN(val)) return '0.0000';
  const num = Number(val);
  if (num >= 100) return num.toFixed(2);
  if (num >= 1) return num.toFixed(4);
  return num.toFixed(4);
}

export function formatRelativeTime(timestamp) {
  if (!timestamp) return 'Just now';
  const now = Date.now();
  const diffMinutes = Math.floor((now - timestamp) / (60 * 1000));
  
  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}M`;
  
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}H`;

  const date = new Date(timestamp);
  const day = date.getDate();
  const month = date.toLocaleString('en-US', { month: 'short' });
  return `${day} ${month}`;
}

export function formatPercentChange(percent) {
  const num = Number(percent);
  const sign = num > 0 ? '+' : '';
  const arrow = num >= 0 ? '▲ ' : '▼ ';
  return {
    formatted: `${arrow}${sign}${num.toFixed(2)}%`,
    isPositive: num >= 0
  };
}
