import { existsSync, mkdirSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DB_PATH = join(__dirname, '../../data/db.json');

const INITIAL_DATA = {
  favorites: [
    { base: 'USD', quote: 'EUR', createdAt: '2026-05-14T10:00:00Z' },
    { base: 'GBP', quote: 'USD', createdAt: '2026-05-14T09:00:00Z' },
    { base: 'USD', quote: 'JPY', createdAt: '2026-05-14T08:00:00Z' },
    { base: 'USD', quote: 'BDT', createdAt: '2026-05-14T07:00:00Z' },
    { base: 'EUR', quote: 'GBP', createdAt: '2026-05-14T06:00:00Z' },
    { base: 'AUD', quote: 'NZD', createdAt: '2026-05-14T05:00:00Z' },
    { base: 'USD', quote: 'INR', createdAt: '2026-05-14T04:00:00Z' },
    { base: 'EUR', quote: 'CHF', createdAt: '2026-05-14T03:00:00Z' },
    { base: 'GBP', quote: 'JPY', createdAt: '2026-05-14T02:00:00Z' },
    { base: 'USD', quote: 'TRY', createdAt: '2026-05-14T01:00:00Z' }
  ],
  logs: [
    { id: '1', from: 'USD', to: 'EUR', fromAmount: 1000.00, toAmount: 853.02, rate: 0.85302, timestamp: Date.now() - 20 * 60 * 1000 },
    { id: '2', from: 'EUR', to: 'JPY', fromAmount: 500.00, toAmount: 92490.00, rate: 184.98, timestamp: Date.now() - 34 * 60 * 1000 },
    { id: '3', from: 'GBP', to: 'USD', fromAmount: 250.00, toAmount: 339.38, rate: 1.3575, timestamp: Date.now() - 50 * 60 * 1000 },
    { id: '4', from: 'USD', to: 'GBP', fromAmount: 1500.00, toAmount: 1104.95, rate: 0.73665, timestamp: Date.now() - 60 * 60 * 1000 },
    { id: '5', from: 'BDT', to: 'USD', fromAmount: 50000.00, toAmount: 406.77, rate: 0.00813, timestamp: Date.now() - 120 * 60 * 1000 },
    { id: '6', from: 'EUR', to: 'INR', fromAmount: 100.00, toAmount: 11127.43, rate: 111.27, timestamp: Date.now() - 240 * 60 * 1000 },
    { id: '7', from: 'AUD', to: 'USD', fromAmount: 2000.00, toAmount: 1441.60, rate: 0.7208, timestamp: Date.now() - 24 * 60 * 60 * 1000 },
    { id: '8', from: 'CHF', to: 'USD', fromAmount: 750.00, toAmount: 824.36, rate: 1.0991, timestamp: Date.now() - 48 * 60 * 60 * 1000 }
  ]
};

class Store {
  constructor() {
    this.ensureInitialized();
  }

  ensureInitialized() {
    const dataDir = dirname(DB_PATH);
    if (!existsSync(dataDir)) {
      mkdirSync(dataDir, { recursive: true });
    }
    if (!existsSync(DB_PATH)) {
      this.saveSync(INITIAL_DATA);
    }
  }

  saveSync(data) {
    import('node:fs').then(fs => {
      fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
    });
  }

  async read() {
    try {
      const content = await readFile(DB_PATH, 'utf8');
      return JSON.parse(content);
    } catch {
      return INITIAL_DATA;
    }
  }

  async write(data) {
    await writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
  }

  // Métodos de Favoritos
  async getFavorites() {
    const data = await this.read();
    return data.favorites || [];
  }

  async toggleFavorite(base, quote) {
    const data = await this.read();
    data.favorites = data.favorites || [];
    const index = data.favorites.findIndex(
      f => f.base.toUpperCase() === base.toUpperCase() && f.quote.toUpperCase() === quote.toUpperCase()
    );

    let favorited = false;
    if (index >= 0) {
      data.favorites.splice(index, 1);
      favorited = false;
    } else {
      data.favorites.push({
        base: base.toUpperCase(),
        quote: quote.toUpperCase(),
        createdAt: new Date().toISOString()
      });
      favorited = true;
    }

    await this.write(data);
    return { favorited, favorites: data.favorites };
  }

  async isFavorite(base, quote) {
    const favorites = await this.getFavorites();
    return favorites.some(
      f => f.base.toUpperCase() === base.toUpperCase() && f.quote.toUpperCase() === quote.toUpperCase()
    );
  }

  // Métodos de Conversão / Logs
  async getLogs() {
    const data = await this.read();
    return data.logs || [];
  }

  async addLog({ from, to, fromAmount, toAmount, rate }) {
    const data = await this.read();
    data.logs = data.logs || [];
    const newLog = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 6),
      from: from.toUpperCase(),
      to: to.toUpperCase(),
      fromAmount: Number(fromAmount),
      toAmount: Number(toAmount),
      rate: Number(rate),
      timestamp: Date.now()
    };
    data.logs.unshift(newLog); // Inserir no topo
    await this.write(data);
    return newLog;
  }

  async removeLog(id) {
    const data = await this.read();
    data.logs = (data.logs || []).filter(item => item.id !== id);
    await this.write(data);
    return data.logs;
  }

  async clearLogs() {
    const data = await this.read();
    data.logs = [];
    await this.write(data);
    return [];
  }
}

export const store = new Store();
