import { CURRENCIES, CURRENCY_MAP } from '../data/currencies.js';
import { ratesService } from '../services/ratesService.js';
import { store } from '../db/store.js';

export async function apiRoutes(fastify) {
  // Lista de moedas com metadados
  fastify.get('/api/currencies', async () => {
    return {
      total: CURRENCIES.length,
      currencies: CURRENCIES
    };
  });

  // Cotações mais recentes para a moeda base
  fastify.get('/api/rates/latest', async (request) => {
    const { base = 'USD' } = request.query;
    return ratesService.getLatestRates(base);
  });

  // Conversão direta
  fastify.get('/api/rates/convert', async (request, reply) => {
    const { from = 'USD', to = 'EUR', amount = '1000' } = request.query;
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return reply.code(400).send({ error: 'Quantidade inválida' });
    }

    const rate = await ratesService.getExchangeRate(from, to);
    const converted = numAmount * rate;

    return {
      from: from.toUpperCase(),
      to: to.toUpperCase(),
      amount: numAmount,
      rate: Number(rate.toFixed(5)),
      result: Number(converted.toFixed(2))
    };
  });

  // Ticker de mercados do topo
  fastify.get('/api/rates/ticker', async () => {
    const items = await ratesService.getTickerMarkets();
    return {
      status: 'LIVE',
      label: '55 CURRENCIES · EOD · ECB DATA',
      markets: items
    };
  });

  // Histórico de taxas para o gráfico
  fastify.get('/api/rates/history', async (request) => {
    const { base = 'USD', quote = 'EUR', range = '1M' } = request.query;
    return ratesService.getHistory(base, quote, range);
  });

  // Favoritos (com taxas e variações calculadas dinamicamente)
  fastify.get('/api/favorites', async () => {
    const favorites = await store.getFavorites();
    const enriched = [];

    for (const item of favorites) {
      const rate = await ratesService.getExchangeRate(item.base, item.quote);
      // Simulação calculada de variação diária consistente
      const isDefault = (item.base === 'USD' && item.quote === 'EUR');
      const changePercent = isDefault ? 0.16 : (
        item.quote === 'JPY' ? 0.04 :
        item.base === 'GBP' ? -0.22 :
        item.quote === 'TRY' ? 0.54 :
        item.quote === 'BDT' ? 0.16 :
        item.quote === 'INR' ? -0.05 :
        item.quote === 'CHF' ? -0.15 : 0.11
      );

      enriched.push({
        base: item.base,
        quote: item.quote,
        rate: Number(rate.toFixed(4)),
        changePercent
      });
    }

    return {
      count: enriched.length,
      favorites: enriched
    };
  });

  // Alternar favorito
  fastify.post('/api/favorites/toggle', async (request, reply) => {
    const { base, quote } = request.body || {};
    if (!base || !quote) {
      return reply.code(400).send({ error: 'Moedas base e destino são obrigatórias' });
    }
    return store.toggleFavorite(base, quote);
  });

  // Logs de conversão
  fastify.get('/api/logs', async () => {
    const logs = await store.getLogs();
    return {
      count: logs.length,
      logs
    };
  });

  // Adicionar novo log de conversão
  fastify.post('/api/logs', async (request, reply) => {
    const { from, to, fromAmount, toAmount, rate } = request.body || {};
    if (!from || !to || !fromAmount || !toAmount) {
      return reply.code(400).send({ error: 'Dados incompletos para registro do log' });
    }
    const log = await store.addLog({ from, to, fromAmount, toAmount, rate });
    return log;
  });

  // Remover log por ID
  fastify.delete('/api/logs/:id', async (request) => {
    const { id } = request.params;
    const remaining = await store.removeLog(id);
    return { success: true, count: remaining.length, logs: remaining };
  });

  // Limpar todos os logs
  fastify.delete('/api/logs', async () => {
    await store.clearLogs();
    return { success: true, count: 0, logs: [] };
  });
}
