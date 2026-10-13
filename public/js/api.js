// Cliente de chamadas REST para a API Fastify
export const api = {
  async getCurrencies() {
    const res = await fetch('/api/currencies');
    return res.json();
  },

  async getLatestRates(base = 'USD') {
    const res = await fetch(`/api/rates/latest?base=${encodeURIComponent(base)}`);
    return res.json();
  },

  async convert(from, to, amount) {
    const res = await fetch(`/api/rates/convert?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&amount=${encodeURIComponent(amount)}`);
    return res.json();
  },

  async getTicker() {
    const res = await fetch('/api/rates/ticker');
    return res.json();
  },

  async getHistory(base = 'USD', quote = 'EUR', range = '1M') {
    const res = await fetch(`/api/rates/history?base=${encodeURIComponent(base)}&quote=${encodeURIComponent(quote)}&range=${encodeURIComponent(range)}`);
    return res.json();
  },

  async getFavorites() {
    const res = await fetch('/api/favorites');
    return res.json();
  },

  async toggleFavorite(base, quote) {
    const res = await fetch('/api/favorites/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ base, quote })
    });
    return res.json();
  },

  async getLogs() {
    const res = await fetch('/api/logs');
    return res.json();
  },

  async addLog({ from, to, fromAmount, toAmount, rate }) {
    const res = await fetch('/api/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to, fromAmount, toAmount, rate })
    });
    return res.json();
  },

  async deleteLog(id) {
    const res = await fetch(`/api/logs/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  async clearLogs() {
    const res = await fetch('/api/logs', {
      method: 'DELETE'
    });
    return res.json();
  }
};
