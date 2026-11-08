import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router';
import { HomePage } from '@/pages/HomePage';
import { NftDetailPage } from '@/pages/NftDetailPage';
import { CartPage } from '@/pages/CartPage';
import { CheckoutPage } from '@/pages/CheckoutPage';
import { OrderConfirmationPage } from '@/pages/OrderConfirmationPage';
import { NftTab, NftSortOption } from '@/types/nft';

// Definição dos Search Params tipados para a Home
export interface HomeSearch {
  tab?: NftTab;
  category?: string;
  network?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: NftSortOption;
  search?: string;
  page?: number;
}

import { AuthModal } from '@/components/auth/AuthModal';

// Root Route
const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <AuthModal />
    </>
  ),
});

// Index Route (Home)
export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  validateSearch: (search: Record<string, unknown>): HomeSearch => {
    return {
      tab: (search.tab as NftTab) || 'todos',
      category: search.category as string | undefined,
      network: search.network as string | undefined,
      minPrice: search.minPrice as string | undefined,
      maxPrice: search.maxPrice as string | undefined,
      sort: (search.sort as NftSortOption) || 'recentes',
      search: search.search as string | undefined,
      page: Number(search.page) || 1,
    };
  },
  component: HomePage,
});

// Rota de Detalhes do NFT com suporte a acesso direto
export const nftDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/nft/$nftId',
  component: NftDetailPage,
});

// Rota do Carrinho de NFTs
export const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/carrinho',
  component: CartPage,
});

// Rota de Pagamento / Checkout
export const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/pagamento',
  component: CheckoutPage,
});

// Rota de Confirmação do Pedido (com e sem parâmetro)
export const orderConfirmationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/confirmacao/$orderId',
  component: OrderConfirmationPage,
});

export const orderConfirmationBaseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/confirmacao',
  component: OrderConfirmationPage,
});

import { CollectorProfilePage } from '@/pages/CollectorProfilePage';

export const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/perfil',
  component: CollectorProfilePage,
});

export const profileAltRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/perfil-colecionador',
  component: CollectorProfilePage,
});

export const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: HomePage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  nftDetailRoute,
  cartRoute,
  checkoutRoute,
  orderConfirmationRoute,
  orderConfirmationBaseRoute,
  loginRoute,
  profileRoute,
  profileAltRoute,
]);

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
