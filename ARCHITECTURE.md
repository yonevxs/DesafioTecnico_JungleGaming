# Arquitetura e Decisões de Projeto — Kurio NFT Marketplace

Este documento detalha as decisões arquiteturais, contratos REST, eventos Socket.IO, política de sessão, gerenciamento de cache e acessibilidade do marketplace **Kurio**, desenvolvido para o desafio técnico da **Jungle Gaming**.

---

## 1. Visão Geral da Arquitetura

A aplicação foi construída com **React 19**, **TypeScript**, **Tailwind CSS** e componentes **`shadcn/ui`** (`src/components/ui/*`), seguindo separação estrita entre camada de apresentação, estado remoto (`TanStack Query`), estado de rota (`TanStack Router`), transporte (`Axios` + `socket.io-client`) e simulação de rede (`MSW v2` + `@mswjs/socket.io-binding`).

```
┌─────────────────────────────────────────────────────────────┐
│                INTERFACE & SHADCN/UI (React 19)             │
│   Páginas (Home, Detalhe, Carrinho, Checkout, Perfil, Auth) │
│   Primitivos shadcn/ui (Dialog, Tabs, Skeleton, Button...)  │
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
│   - Token Bearer & Idempotency│   │   - Monotonic versioning      │
│   - Sem fallbacks fictícios   │   │   - Reconciliação no reconnect│
└───────────────┬───────────────┘   └───────────────┬───────────────┘
                │                                   │
                └──────────────────┬────────────────┘
                                   ▼
┌─────────────────────────────────────────────────────────────┐
│                 MOCK SERVICE WORKER (MSW v2)                │
│   - Handlers REST (/api/nfts, /api/orders, /api/quote...)   │
│   - Socket.IO Binding (@mswjs/socket.io-binding)            │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Contratos REST (Seção 5)

| Recurso | Método & Endpoint | Descrição e Códigos de Status |
|---|---|---|
| **Catálogo de NFTs** | `GET /api/nfts` | Suporta `tab`, `category`, `network`, `minPrice`, `maxPrice`, `sort`, `search`, `page`, `limit`. Retorna `200 OK` ou `500` em falha simulada. |
| **Detalhe do NFT** | `GET /api/nfts/:id` | Retorna metadados completos do NFT (`200 OK`) ou `404 Not Found` (`NFT_NOT_FOUND`). |
| **Favoritar NFT** | `POST /api/nfts/:id/like` | Alterna favorito isolado por sessão do usuário (`200 OK`) ou `500` para exercitar rollback otimista. |
| **Listar Favoritos** | `GET /api/favorites` | Lista os NFTs favoritados pelo usuário autenticado (`200 OK`). |
| **Cotação e Cupom** | `POST /api/quote` | Valida disponibilidade de estoque (`409`), cupom (`422` se inválido/expirado) e retorna `subtotalEth`, `discountEth`, `networkFeeEth` e `totalEth` (`200 OK`). |
| **Criar Pedido** | `POST /api/orders` | Exige header `Idempotency-Key`. Retorna `201 Created` (novo), `200 OK` (repetição idêntica), `409 Conflict` (mesma chave com payload diferente) ou `400 Bad Request` (pagamento recusado). |
| **Consultar Pedido** | `GET /api/orders/:orderId` | Retorna o snapshot imutável do recibo (`200 OK`) ou `404 Not Found`. |
| **Sessão e Conta** | `POST /api/auth/login`<br>`POST /api/auth/register`<br>`GET /api/auth/me`<br>`POST /api/auth/logout` | Autenticação (`200`/`401`), criação de conta com validação de conflito (`201`/`409`), consulta de sessão (`200`/`401`) e encerramento (`200`). |
| **Perfil e Senha** | `PUT /api/profile`<br>`PUT /api/profile/password` | Atualização de dados cadastrais, avatar e senha (`200 OK`). |
| **Carteiras** | `GET /api/wallets`<br>`POST /api/wallets`<br>`PUT /api/wallets` | Listagem, cadastro e atualização das carteiras principal e secundária (`200`/`201`). |
| **Reset de Mocks** | `POST /api/mock/reset` | Restaura integralmente o estado em memória do catálogo, favoritos e pedidos para o cenário inicial conhecido (`200 OK`). |

---

## 3. Política de Cache, Sessão e Reconciliação Socket.IO

1. **Estado na URL (`TanStack Router`)**:
   - Busca, abas, categoria, rede, preço mínimo/máximo, ordenação e página compõem os Search Params tipados da rota `/`. Qualquer alteração de filtro reinicia `page: 1` e preserva o histórico (`back`/`forward`).
   - Rotas inexistentes são capturadas pelo `notFoundComponent` do `rootRoute`.
2. **Atualização Otimista com Rollback (`useToggleNftLike`)**:
   - Cancela queries concorrentes (`cancelQueries`), salva snapshots tanto do detalhe (`NFT_KEYS.detail(id)`) quanto das listas (`NFT_KEYS.lists()`), aplica a mutação instantaneamente na UI e restaura ambos os snapshots no `onError` caso o servidor retorne erro.
3. **Isolamento de Sessão e Logout**:
   - Ao executar `logout()` no `AuthContext`, o token e o usuário são removidos, o cache privado do `TanStack Query` é limpo integralmente (`queryClient.clear()`) e o controle de versões do `SocketService` é reiniciado (`socketService.clearSessionState()`).
4. **Tempo Real e Controle de Versão Monotônica (`Socket.IO`)**:
   - O `SocketService` conecta via `socket.io-client` ao handler WebSocket do MSW (`@mswjs/socket.io-binding`) e mantém um mapa `lastVersions` por entidade (`nft_<id>` e `order_<id>`).
   - Eventos com `version <= lastVersion` são descartados silenciosamente, impedindo regressão de estado por pacotes fora de ordem ou duplicados.
   - Após reconexão (`onReconnect`), o hook `useSocketNftSync` invalida as queries ativas (`queryClient.invalidateQueries({ queryKey: NFT_KEYS.all })`) para reconciliar o estado com a API REST.

---

## 4. Acessibilidade, Responsividade e Fidelidade ao Figma

- **Componentes `shadcn/ui`**: Primitivos em `src/components/ui/` (`Dialog`, `Tabs`, `Skeleton`, `Button`, `Input`, `Badge`) customizados com a paleta Kurio (`#140D0A`, `#241612`, `#38220F`, `#CFB28C`, `#D28A4C`, `#E89B55`).
- **Controle de Foco e Teclado**: O componente `Dialog` gerencia armadilha de foco (`Tab` / `Shift+Tab`) e fechamento por `Escape`, com atributos `role="dialog"` e `aria-modal="true"`.
- **Skeletons com Shimmer**: Componentes de carregamento preservam a proporção exata dos cards (`aspect-square rounded-[22px]`) evitando *Cumulative Layout Shift* (CLS) e respeitam `prefers-reduced-motion` (`motion-reduce:animate-none`).
