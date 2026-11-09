# Kurio — Marketplace de NFTs 🌐🎨

Solução desenvolvida para o **Frontend Challenge** da **Jungle Gaming** ([junglegaming/frontend-challenge](https://github.com/junglegaming/frontend-challenge)), implementando a plataforma **Kurio NFT Marketplace** em React 19, TypeScript e Tailwind CSS, seguindo o design do Figma com total fidelidade visual, tempo real via Socket.IO, mocking nativo com MSW e testes automatizados com Playwright.

---

## 🚀 Demonstração Rápida

- **Repositório**: [yonevxs/DesafioTecnico_JungleGaming](https://github.com/yonevxs/DesafioTecnico_JungleGaming)
- **Documentação de Arquitetura**: [ARCHITECTURE.md](./ARCHITECTURE.md)

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia |
|---|---|
| **Interface & Componentes** | React 19, TypeScript, Tailwind CSS, Lucide Icons |
| **Roteamento SPA** | TanStack Router (com Search Params tipados e rotas mobile dedicadas) |
| **Estado Remoto & Cache** | TanStack Query v5 (atualização otimista, invalidação e rollback) |
| **Cliente HTTP** | Axios com interceptors de autenticação e idempotência |
| **Tempo Real** | Socket.IO Client + `@mswjs/socket.io-binding` |
| **Mocking de Rede** | Mock Service Worker (MSW v2) |
| **Testes End-to-End** | Playwright (Desktop Chromium 1440x900 & Mobile Safari/Chrome 390x844) |

---

## 📦 Instruções de Instalação e Execução

### Pré-requisitos
- **Node.js** >= 18.x
- **npm** >= 9.x

### 1. Clonar o repositório
```bash
git clone https://github.com/yonevxs/DesafioTecnico_JungleGaming.git
cd DesafioTecnico_JungleGaming
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Iniciar o servidor de desenvolvimento
```bash
npm run dev
```
Acesse no seu navegador: **`http://localhost:5173`** (ou `http://127.0.0.1:5173`).

---

## 🧪 Comandos Disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor Vite de desenvolvimento com os mocks do MSW ativos |
| `npm run build` | Compila o bundle de produção otimizado com TypeScript |
| `npm run preview` | Executa o preview local do build de produção |
| `npm run test:e2e` | Executa toda a suíte de testes E2E do Playwright |
| `npm run test:e2e:ui` | Abre a interface interativa do Playwright Test Runner |
| `npm run test:e2e:report` | Abre o relatório HTML de execução dos testes E2E |
| `npm run lint` | Executa o linter (Oxlint) no código-fonte |

---

## 👤 Credenciais Fictícias para Avaliação

Para facilitar a avaliação da autenticação, utilize as seguintes credenciais simuladas:

| Campo | Valor Sugerido |
|---|---|
| **E-mail** | `contato@email.com` ou `colecionador@kurio.eth` |
| **Senha** | `kurio2026pass` (qualquer senha com 6+ caracteres é aceita) |
| **Nome de Usuário** | `lucasneves_eth` |
| **Login Social** | Clique em **"Continuar com Google"** ou **"Continuar com Facebook"** para login automático com perfil preenchido |

---

## 🎟️ Cupons Promocionais de Teste

No carrinho de compras (`/carrinho`), teste os cupons:

- `JUNGLE10`: 10% de desconto especial Jungle Gaming
- `KURIO20`: 20% de desconto da comunidade Kurio
- `GENESIS5`: 5% de desconto de lançamento
- `EXPIRADO`: Simula cupom rejeitado por expiração

---

## ⚡ Como Testar os Eventos de Tempo Real (Socket.IO)

A aplicação inclui gatilhos de simulação expostos no objeto global `window` para testar o comportamento em tempo real diretamente no console do navegador (DevTools):

### 1. Simular alteração de preço enquanto o item está no carrinho:
Abra o carrinho em `http://localhost:5173/carrinho` e execute no console:
```javascript
window.__kurio_emit_nft_update({
  id: 'emerald-ape-042',
  priceEth: '1.45',
  version: Date.now()
});
```
> **Resultado esperado**: A interface exibe imediatamente um banner em tom âmbar alertando sobre a alteração de cotação em tempo real e calcula os novos totais. Na tela de pagamento, a finalização é bloqueada até o usuário clicar em **"Revalidar Cotação"**.

### 2. Simular atualização de status de pedido:
```javascript
window.__kurio_emit_order_update({
  orderId: 'ord_12345',
  status: 'confirmed',
  version: Date.now()
});
```

---

## 📱 Telas Implementadas

1. **Início / Catálogo (`/`)**: Carrossel Hero com visual orgânico, destaques, diário de cunhagem e catálogo com busca, filtros de categoria, rede, ordenação e paginação persistidos na URL.
2. **Detalhes do NFT (`/nft/:nftId`)**: Galeria em alta definição, histórico de transações, seletor de quantidade e botão de compra com atualização de favoritos otimista.
3. **Carrinho de NFTs (`/carrinho`)**: Tabela de itens desktop e cards com bottom sheet mobile, edição de quantidades, cupom e resumo de taxas.
4. **Pagamento / Checkout (`/pagamento`)**: Seleção de carteira conectada (Reserva / Principal), provedor (MetaMask, Coinbase, WalletConnect), botão de preenchimento rápido para o avaliador e proteção contra cotação desatualizada.
5. **Confirmação do Pedido (`/confirmacao/:orderId`)**: Recibo detalhado com hash simulado da transação, badges de rede e link para explorer.
6. **Mobile / Login (`/login`) & Mobile / Cadastro (`/cadastro`)**: Telas mobile com logo centralizado KURIO, inputs com toggle de visibilidade de senha e autenticação social.
7. **Perfil do Colecionador (`/perfil`) & Carteiras (`/carteiras`)**: Gestão de dados pessoais, carteira primária/secundária e estatísticas do colecionador.
