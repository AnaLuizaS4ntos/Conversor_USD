import { fastify } from 'fastify';
import fastifyStatic from '@fastify/static';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { apiRoutes } from './src/routes/api.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const server = fastify({
  logger: false
});

// Registrar rotas de API primeiro
await server.register(apiRoutes);

// Servir arquivos estáticos do frontend (HTML, CSS, JS, Assets)
await server.register(fastifyStatic, {
  root: join(__dirname, 'public'),
  prefix: '/',
  index: 'index.html'
});

// Rotas de navegação direta para suportar URLs diretas (como /home, /compare, /favorites, /log)
const routes = ['/home', '/compare', '/favorites', '/log'];
for (const route of routes) {
  server.get(route, (req, reply) => {
    return reply.sendFile('index.html');
  });
}

// Porta híbrida (ambiente em nuvem ou localhost)
const porta = process.env.PORT || 3333;

const start = async () => {
  try {
    await server.listen({
      port: Number(porta),
      host: '0.0.0.0'
    });
    console.log(`[FX_CHECKER] Servidor iniciado e ouvindo na porta ${porta}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

// Se estiver no Vercel Serverless, exporta handler compatível; caso contrário inicia standalone
if (!process.env.VERCEL) {
  start();
}

export default async function handler(req, res) {
  await server.ready();
  server.server.emit('request', req, res);
}
