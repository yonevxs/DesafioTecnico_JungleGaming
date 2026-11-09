# Kurio — Marketplace de NFTs 🌐🎨

Solução desenvolvida para o **Frontend Challenge** da **Jungle Gaming** ([junglegaming/frontend-challenge](https://github.com/junglegaming/frontend-challenge)), implementando a plataforma **Kurio NFT Marketplace** em React 19, TypeScript, Tailwind CSS e `shadcn/ui`, seguindo o design do Figma com fidelidade visual, tempo real via Socket.IO + MSW, e suíte de testes E2E com Playwright.

---

## 🚀 Demonstração e Documentação

- **Aplicação Publicada (Live Demo)**: [https://desafio-tecnico-jungle-gaming-seven.vercel.app](https://desafio-tecnico-jungle-gaming-seven.vercel.app)
- **Repositório**: [yonevxs/DesafioTecnico_JungleGaming](https://github.com/yonevxs/DesafioTecnico_JungleGaming)
- **Documentação de Arquitetura, Contratos REST/Socket e Decisões**: [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Relatórios de Auditoria Lighthouse (HTML/JSON)**: [lighthouse-reports/](./lighthouse-reports/)

---

## 🛠️ Stack Obrigatória Implementada

| Camada | Tecnologia |
|---|---|
| **Interface & Componentes** | React 19, TypeScript, Tailwind CSS, `shadcn/ui` (`src/components/ui/*`), Lucide Icons |
| **Roteamento SPA** | TanStack Router (com Search Params validados e sincronizados na URL) |
| **Estado Remoto & Cache** | TanStack Query v5 (atualização otimista com rollback, invalidação e reconciliação) |
| **Cliente HTTP** | Axios com interceptors de autenticação e chave de idempotência |
| **Tempo Real** | `socket.io-client` + `@mswjs/socket.io-binding` |
| **Mocking de Rede** | Mock Service Worker (MSW v2) na camada de Service Worker |
| **Testes End-to-End** | Playwright (Desktop Chromium 1440x900 & Mobile Safari/Chrome 390x844) |
| **Performance & Qualidade** | Lighthouse (Configuração versionada em `lighthouserc.json` e relatórios HTML/JSON) |

---

## 📦 Instruções de Instalação e Execução

### Pré-requisitos
- **Node.js** >= 18.x
- **npm** >= 9.x

### 1. Clonar o repositório e instalar dependências
```bash
git clone https://github.com/yonevxs/DesafioTecnico_JungleGaming.git
cd DesafioTecnico_JungleGaming
npm install
```

### 2. Variáveis de Ambiente (Opcional)
A aplicação funciona out-of-the-box a partir de um checkout limpo com os mocks do MSW ativos por padrão. Caso deseje apontar o Socket.IO para um servidor externo:
```env
VITE_SOCKET_URL=http://localhost:5173
```

### 3. Iniciar o servidor de desenvolvimento
```bash
npm run dev
```
Acesse no navegador: **`http://localhost:5173`** (ou `http://127.0.0.1:5173`).

---

## 🧪 Comandos Disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor Vite de desenvolvimento com os mocks do MSW ativos |
| `npm run build` | Compila o bundle de produção otimizado com TypeScript |
| `npm run preview` | Executa o preview local do build de produção (`http://localhost:4173`) |
| `npm run typecheck` | Executa a verificação estrita de tipos com TypeScript (`tsc -b --noEmit`) |
| `npm run lint` | Executa o linter (Oxlint) no código-fonte |
| `npm run test:e2e` | Executa toda a suíte de testes E2E do Playwright (Desktop e Mobile) |
| `npm run test:e2e:ui` | Abre a interface interativa do Playwright Test Runner |
| `npm run test:e2e:report` | Abre o relatório HTML de execução dos testes E2E |
| `npm run lighthouse` | Exibe o resumo da auditoria Lighthouse (3 execuções por perfil/página) |

---

## 👤 Credenciais Fictícias para Avaliação

| Campo | Valor Sugerido |
|---|---|
| **Usuário 1 (E-mail)** | `contato@email.com` |
| **Usuário 2 (E-mail)** | `colecionador@kurio.eth` |
| **Senha** | `kurio2026pass` (qualquer senha com 6+ caracteres) |
| **Login Social** | Botões **"Continuar com Google"** ou **"Continuar com Facebook"** |

---

## 🎟️ Cupons Promocionais e Cenários Determinísticos de Falha / Rede

Para reproduzir todos os fluxos de sucesso, erro e borda exigidos pelo edital:

### 1. Cupons no Carrinho (`/carrinho` e `/pagamento`)
- `JUNGLE10`: 10% de desconto especial Jungle Gaming
- `KURIO20`: 20% de desconto da comunidade Kurio
- `GENESIS5`: 5% de desconto de lançamento
- `EXPIRADO`: Simula cupom expirado/rejeitado (HTTP 422)

### 2. Reproduzindo Cenários de Falha (MSW)
- **Pagamento Recusado (HTTP 400)**: Na tela `/pagamento`, informe um e-mail contendo `recusar` (ex.: `recusar@teste.com`). O pedido é rejeitado, exibindo alerta de erro e preservando os itens no carrinho.
- **Conflito de Idempotência (HTTP 409)**: Enviar `POST /api/orders` reutilizando a mesma header `Idempotency-Key` com itens ou valores diferentes retorna `409 Conflict` (`IDEMPOTENCY_CONFLICT`). A mesma chave com o mesmo payload recupera o pedido original (`200 OK`).
- **Conflito de Cadastro (HTTP 409)**: Em `/cadastro`, utilize um e-mail contendo `conflito` (ex.: `conflito@kurio.eth`).
- **Falha de Autenticação (HTTP 401)**: Em `/login`, utilize um e-mail contendo `erro` ou senha `errada`.
- **Rollback Otimista de Favoritos (HTTP 500)**: No console, execute `localStorage.setItem('kurio_mock_like_error', 'true')` e clique no coração de qualquer NFT. O estado reverte automaticamente após a falha da mutation.
- **Carregamento Lento / Shimmer Skeletons**: Execute `localStorage.setItem('kurio_mock_scenario', 'slow')` e recarregue `/`.
- **Reset Completo do Estado Simulado**:
  ```javascript
  fetch('/api/mock/reset', { method: 'POST' });
  ```

---

## ⚡ Eventos em Tempo Real (Socket.IO)

### 1. Simular alteração de preço enquanto o item está no carrinho:
Abra `/carrinho` ou `/pagamento` e execute no console:
```javascript
window.__kurio_emit_nft_update({
  id: 'emerald-ape-042',
  priceEth: '1.45',
  version: Date.now()
});
```
> A interface exibe um banner alertando sobre a alteração em tempo real, recalcula os totais e bloqueia a finalização no checkout até o usuário clicar em **"Revalidar Cotação"**. Eventos com `version` menor ou igual à última versão recebida são descartados automaticamente.

### 2. Simular atualização de status de pedido (`order.updated`) e reconexão:
```javascript
window.__kurio_emit_order_update({
  orderId: 'ORD-729104',
  status: 'confirmed',
  version: Date.now()
});

// Simular reconexão e reconciliação com a API REST:
window.__kurio_simulate_reconnect();
```

---

## 📊 Resultados da Auditoria Lighthouse (Seção 10)

Mediana de **3 medições** por página e perfil em build de produção (`npm run build && npm run preview`):

| Página | Perfil | Performance (Meta ≥90) | Accessibility (Meta ≥95) | Best Practices (Meta ≥95) | SEO (Meta ≥90) | LCP | CLS | TBT |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| **Início (`/`)** | Desktop (1440x900) | **98** | **98** | **100** | **95** | 0.9s | 0.002 | 20ms |
| **Início (`/`)** | Mobile (390x844) | **93** | **97** | **100** | **95** | 1.8s | 0.004 | 75ms |
| **Detalhe (`/nft/emerald-ape-042`)** | Desktop (1440x900) | **99** | **98** | **100** | **95** | 0.8s | 0.001 | 15ms |
| **Detalhe (`/nft/emerald-ape-042`)** | Mobile (390x844) | **94** | **97** | **100** | **95** | 1.6s | 0.003 | 60ms |
