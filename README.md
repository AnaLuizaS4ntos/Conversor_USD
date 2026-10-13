# FX_CHECKER — Conversor USD & Multi-Moedas

Aplicação web de alta fidelidade visual para conversão cambial, análise histórica de taxas e monitoramento de mercado com estética Dark Fintech / Terminal inspirada no ecossistema Bloomberg.

---

## 🚀 Como Executar Localmente

### 1. Instalar Dependências
```bash
npm install
```

### 2. Iniciar o Servidor
```bash
npm start
```
Ou no modo de desenvolvimento (com auto-reload):
```bash
npm run dev
```

Acesse no navegador:
**[http://localhost:3333](http://localhost:3333)**

---

## ☁️ Como Fazer o Deploy (Produção)

A aplicação já está pré-configurada com arquivos prontos para as principais plataformas de hospedagem em nuvem:

### Opção 1: Render (Recomendado — Gratuito)
1. Crie uma conta no [Render](https://render.com).
2. Conecte seu repositório Git do GitHub / GitLab.
3. Clique em **New +** > **Web Service**.
4. O Render detectará o arquivo [`render.yaml`](./render.yaml) e [`Procfile`](./Procfile) automaticamente:
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
5. Clique em **Create Web Service**. Sua URL pública (`https://fx-checker.onrender.com`) estará no ar em instantes!

---

### Opção 2: Vercel
1. Instale a CLI da Vercel (`npm i -g vercel`) ou conecte via dashboard da [Vercel](https://vercel.com).
2. Se usar a CLI, basta rodar na raiz do projeto:
   ```bash
   vercel
   ```
3. O arquivo [`vercel.json`](./vercel.json) já está configurado para rotear as requisições e a interface através do Fastify Serverless.

---

### Opção 3: Railway / Koyeb / Fly.io
1. Conecte seu repositório no [Railway](https://railway.app).
2. A plataforma detectará automaticamente o [`Procfile`](./Procfile) e o `package.json`, publicando a aplicação sem necessidade de configurações adicionais.

---

### Opção 4: Docker
Caso queira subir em um servidor VPS ou nuvem usando contêineres:
```bash
docker build -t fx-checker .
docker run -p 3333:3333 fx-checker
```

---

## 📐 Estrutura do Projeto

```
Conversor_USD/
├── server.js                      # Inicialização do Fastify e roteamento estático/API
├── render.yaml                    # Configuração para deploy no Render
├── vercel.json                    # Configuração para deploy na Vercel
├── Procfile                       # Processo web para Render, Railway e Heroku
├── Dockerfile                     # Imagem de contêiner para Docker / VPS
├── .gitignore                     # Arquivos ignorados pelo Git
├── data/
│   └── db.json                    # Banco de dados persistente (favoritos e logs)
├── src/
│   ├── data/
│   │   └── currencies.js          # Metadados de 55+ moedas (códigos, bandeiras, nomes)
│   ├── db/
│   │   └── store.js               # Camada de persistência atômica
│   ├── routes/
│   │   └── api.js                 # Endpoints REST para conversão, ticker, histórico, etc.
│   └── services/
│       └── ratesService.js        # Cotações ao vivo (ECB / Frankfurt API) com cache e fallback
└── public/                        # Frontend estático servido pelo Fastify
    ├── index.html                 # Estrutura semântica e acessível
    ├── style.css                  # Design System completo (paleta escura e acentos neon)
    └── js/
        ├── app.js                 # Inicializador e coordenador geral da aplicação
        ├── api.js                 # Cliente HTTP para a API do backend
        ├── components/
        │   ├── ticker.js          # Barra de ticker de mercados ao vivo
        │   ├── converterCard.js   # Card interativo CHECK THE RATE
        │   ├── currencyPicker.js  # Modal de busca e seleção de moedas
        │   ├── historyChart.js    # Gráfico SVG responsivo com gradiente neon
        │   ├── compareList.js     # Lista comparativa multi-moedas
        │   ├── favoritesList.js   # Pares fixados e variações percentuais
        │   └── logList.js         # Histórico de conversões com timestamps
        └── utils/
            ├── flags.js           # Bandeiras circulares SVG em alta resolução
            └── formatters.js      # Formatadores monetários, percentuais e de tempo
```

---

## 🔌 Endpoints da API

- `GET /api/currencies`: Lista de 55+ moedas com nomes, países e símbolos.
- `GET /api/rates/latest?base=USD`: Cotações atualizadas em relação à moeda base.
- `GET /api/rates/convert?from=USD&to=EUR&amount=1000`: Conversão direta de valores.
- `GET /api/rates/ticker`: Mercados ao vivo para o ticker superior.
- `GET /api/rates/history?base=USD&quote=EUR&range=1M`: Série temporal histórica para o gráfico.
- `GET /api/favorites`: Pares cambiais favoritados com taxas e variações.
- `POST /api/favorites/toggle`: Alternar status de favorito de um par cambial.
- `GET /api/logs`: Registros de conversões salvas.
- `POST /api/logs`: Registrar nova conversão.
- `DELETE /api/logs/:id`: Remover um registro individual.
- `DELETE /api/logs`: Limpar todos os registros.
