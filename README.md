# FX_CHECKER — Conversor USD & Multi-Moedas

Aplicação web de alta fidelidade visual para conversão cambial, análise histórica de taxas e monitoramento de mercado com estética Dark Fintech / Terminal inspirada no ecossistema Bloomberg.

---

## 🚀 Como Executar

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

## 📐 Estrutura do Projeto

```
Conversor_USD/
├── server.js                      # Inicialização do Fastify e roteamento estático/API
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
