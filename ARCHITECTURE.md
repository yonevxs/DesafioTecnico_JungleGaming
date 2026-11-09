# Arquitetura e Decisões de Projeto — Kurio NFT Marketplace

Este documento detalha as decisões arquiteturais, padrões de projeto, contratos de transporte, gerenciamento de estado assíncrono, eventos em tempo real e acessibilidade do marketplace **Kurio**, desenvolvido para o desafio técnico da **Jungle Gaming**.

---

## 1. Visão Geral da Arquitetura

A aplicação foi desenvolvida em **React 19**, **TypeScript** e **Tailwind CSS**, priorizando performance, fidelidade visual pixel-perfect ao protótipo do Figma, acessibilidade e isolamento de responsabilidades.

```
┌─────────────────────────────────────────────────────────────┐
│                       INTERFACE (UI)                        │
│   Páginas (Home, Detalhe, Carrinho, Checkout, Perfil, Auth) │
│       Componentes Modulares & Tokens Visuais Kurio          │
└──────────────────────────────┬──────────────────────────────┘
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
┌───────────────────────────────┐   ┌───────────────────────────────┐
│     ESTADO REMOTO / QUERY     │   │      ESTADO LOCAL / CONTEXT   │
│   TanStack Query v5           │   │   AuthContext (Sessão & User) │
│   - Cache, Invalidação &      │   │   CartContext (Carrinho &     │
│     Atualizações Otimistas    │   │     Cotação em Tempo Real)    │
└───────────────┬───────────────┘   └───────────────┬───────────────┘
                │                                   │
                ▼                                   ▼
┌───────────────────────────────┐   ┌───────────────────────────────┐
│       TRANSPORTE HTTP         │   │      TEMPO REAL SOCKET.IO     │
│   Axios Client Interceptors   │   │   SocketService (Singleton)   │
│   - Idempotência & Retry      │   │   - Descarte de duplicatas    │
│   - Tipagem estrita           │   │   - Monotonic versioning      │
└───────────────┬───────────────┘   └───────────────┬───────────────┘
                │                                   │
                └──────────────────┬────────────────┘
                                   ▼
┌─────────────────────────────────────────────────────────────┐
│                 MOCK SERVICE WORKER (MSW v2)                │
│   - Camada de rede nativa sem mocks acoplados na UI         │
│   - Handlers REST (/api/nfts, /api/auth, /api/orders)       │
│   - Socket.IO Mock (@mswjs/socket.io-binding)               │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Stack Tecnológica e Responsabilidades

| Tecnologia | Função no Projeto | Justificativa |
|---|---|---|
| **React 19 + TypeScript** | Biblioteca base & Tipagem estrita | Renderização declarativa, tipagem ponta a ponta e interfaces seguras |
| **TanStack Router** | Roteamento declarativo | Sincronização automática de filtros na URL, scroll restoration e rotas mobile |
| **TanStack Query v5** | Estado assíncrono remoto | Cache inteligente, cancelamento de requisições, retries e atualização otimista |
| **Axios** | Cliente HTTP | Interceptadores de token, timeout padronizado e tratamento de erros de negócio |
| **Socket.IO Client** | Comunicação em tempo real | Escuta dos eventos `nft.updated` e `order.updated` com versão monotônica |
| **Tailwind CSS** | Estilização & Design Tokens | Implementação da paleta de cores chocolate/âmbar (#140D0A, #CFB28C, #D28A4C) |
| **MSW v2** | Mocking na camada de rede | Simulação determinística de latência, erros 4xx/5xx e persistência local |
| **Playwright** | Testes End-to-End | Testes automatizados executáveis com suporte a viewports Desktop e Mobile |

---

## 3. Gerenciamento de Estado e Ciclo de Vida

### 3.1. Estado da URL (TanStack Router)
- Os filtros do catálogo (busca por texto, abas `todos`/`genesis`/`raros`/`novos`, categorias, ordenação por preço/recentes e paginação) residem nos **Search Params da URL** (`validateSearch`).
- Ao atualizar qualquer filtro, a paginação é reiniciada automaticamente e o histórico de navegação (`back`/`forward`) restaura fielmente o estado da pesquisa.

### 3.2. Atualização Otimista com Rollback (Favoritos)
- O hook `useToggleNftLike` utiliza mutação otimista no TanStack Query:
  1. Cancela queries ativas para evitar condições de corrida (`cancelQueries`).
  2. Salva o snapshot anterior do NFT (`getQueryData`).
  3. Atualiza o contador de likes e o estado `isLiked` imediatamente na interface.
  4. Caso o servidor retorne erro ou timeout, o rollback restaura exatamente o snapshot anterior (`onError`).
  5. Invalida as listas ao finalizar (`onSettled`).

### 3.3. Carrinho Unificado e Cotação em Tempo Real (`CartContext`)
- Os itens do carrinho são mantidos globalmente e sincronizados no `localStorage` sob a chave `kurio_cart_items_v2`.
- O carrinho calcula:
  - **Subtotal**: soma ponderada com precisão decimal em ETH.
  - **Desconto**: percentual baseado em cupons válidos (`JUNGLE10`, `KURIO20`, `GENESIS5`).
  - **Taxa de Rede**: taxa fixa estimada de `0.016 ETH`.
  - **Total**: valor final em string decimal com 3 casas.

---

## 4. Integração em Tempo Real com Socket.IO

Conforme a Seção 7 do edital, a aplicação escuta e reage aos eventos essenciais do protocolo:

### 4.1. Evento `nft.updated`
```json
{
  "id": "emerald-ape-042",
  "version": 1731120000000,
  "priceEth": "1.45",
  "priceUsd": 4950,
  "availableQuantity": 15,
  "totalQuantity": 50,
  "isSoldOut": false
}
```
- **Catálogo & Detalhes**: O hook global `useSocketNftSync` atualiza o cache do TanStack Query sem provocar flicker ou recarregamento total da página.
- **Carrinho & Checkout (Cenário Obrigatório)**: Se o preço de um item for alterado enquanto ele estiver no carrinho, o `CartContext` atualiza o valor, sinaliza `isQuoteOutdated: true` e exibe um banner de alerta.
- **Bloqueio de Compra**: O botão de pagamento no checkout é **desabilitado** até que o usuário clique em **"Revalidar Cotação"**, impedindo compras com valores defasados.

### 4.2. Tolerância a Falhas e Descarte de Eventos Obsoletos
- O `SocketService` rastreia a versão monotônica (`Map<string, number>`) de cada recurso afetado.
- Caso chegue um evento com `version <= lastVersion`, ele é **descartado imediatamente**, protegendo o estado da aplicação contra pacotes fora de ordem ou duplicados.

---

## 5. Mock Service Worker (MSW) e Idempotência

- **Camada de Rede**: Todos os mocks residem no Service Worker em `public/mockServiceWorker.js`, ativado condicionalmente na inicialização em [main.tsx](file:///c:/Users/Casa/Documents/C%C3%B3digos%20-%20Lucas%20Neves/desafioTecnico_JungleGaming/src/main.tsx).
- **Idempotência de Pedidos**: O endpoint `POST /api/orders` exige o header ou campo `idempotencyKey`. Repetições da mesma requisição com a mesma chave retornam o pedido original já gravado sem gerar duplicatas.
- **Simulação de Falhas**: O serviço [orderService.ts](file:///c:/Users/Casa/Documents/C%C3%B3digos%20-%20Lucas%20Neves/desafioTecnico_JungleGaming/src/services/orderService.ts) possui fallback resiliente com persistência em `localStorage['kurio_last_receipt']`, garantindo que uma falha de conexão ainda resulte em um recibo estável recuperável após refresh.

---

## 6. Acessibilidade e Design Responsivo

- **Responsividade Multi-Dispositivo**: Suporte completo aos viewports de 390px (Mobile), 768px (Tablet) e 1440px (Desktop).
- **Semântica HTML5**: Uso de elementos semânticos (`header`, `main`, `nav`, `article`, `section`, `footer`).
- **Navegação por Teclado & Foco**: Todos os botões, links e inputs possuem estados interativos de foco visível (`focus:ring`, `focus:border-[#D28A4C]`) e atributos `aria-label` descritivos.
- **Skeletons**: Indicadores de carregamento com shimmer effect preservam a geometria dos cards evitando Cumulative Layout Shift (CLS).
