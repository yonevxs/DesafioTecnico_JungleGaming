import { http, HttpResponse, delay } from 'msw';
import { mockNfts } from '../data/nfts';
import { NftItem, NftListResponse } from '@/types/nft';
import { VALID_COUPONS } from '@/context/CartContext';

// Estado em memória local que persiste entre requisições e pode ser resetado
let currentNfts: NftItem[] = structuredClone(mockNfts);
const favoritesByUser = new Map<string, Set<string>>();

export function resetNftMocks() {
  currentNfts = structuredClone(mockNfts);
  favoritesByUser.clear();
}

export function getCurrentNfts(): NftItem[] {
  return currentNfts;
}

function getUserKeyFromRequest(request: Request): string {
  const auth = request.headers.get('Authorization');
  if (!auth || !auth.startsWith('Bearer ')) return 'anonymous';
  return auth.replace('Bearer ', '').trim();
}

export const nftHandlers = [
  // Listagem com busca, filtros, ordenação e paginação
  http.get('/api/nfts', async ({ request }) => {
    const url = new URL(request.url);
    const customDelay = Number(url.searchParams.get('delay')) || 0;
    const scenario = typeof window !== 'undefined' ? localStorage.getItem('kurio_mock_scenario') : null;

    if (scenario === 'slow' || customDelay > 0) {
      await delay(customDelay || 1200);
    } else {
      await delay(250);
    }

    if (scenario === 'error_500' || url.searchParams.get('search') === '__erro500__') {
      return HttpResponse.json(
        { message: 'Falha transitória ao consultar catálogo na rede.', code: 'NETWORK_ERROR' },
        { status: 500 }
      );
    }

    const tab = url.searchParams.get('tab') || 'todos';
    const category = url.searchParams.get('category');
    const network = url.searchParams.get('network');
    const minPrice = url.searchParams.get('minPrice');
    const maxPrice = url.searchParams.get('maxPrice');
    const sort = url.searchParams.get('sort') || 'recentes';
    const search = url.searchParams.get('search')?.toLowerCase().trim();
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '6', 10);

    const userKey = getUserKeyFromRequest(request);
    const userFavs = favoritesByUser.get(userKey);

    let filtered = currentNfts.map((item) => ({
      ...item,
      isLiked: userFavs ? userFavs.has(item.id) : Boolean(item.isLiked),
    }));

    // Filtro por Tab
    if (tab === 'novos') {
      filtered = filtered.filter(
        (item) => item.isNewRelease || new Date(item.createdAt) >= new Date('2026-10-25')
      );
    } else if (tab === 'em-alta') {
      filtered = filtered.filter((item) => item.isTrending || item.likesCount > 100);
    }

    // Filtro por Categoria
    if (category) {
      filtered = filtered.filter((item) => item.category.toLowerCase() === category.toLowerCase());
    }

    // Filtro por Rede
    if (network) {
      filtered = filtered.filter((item) => item.network.toLowerCase() === network.toLowerCase());
    }

    // Filtro por Faixa de Preço (ETH decimal)
    if (minPrice) {
      const min = parseFloat(minPrice);
      if (!isNaN(min)) {
        filtered = filtered.filter((item) => parseFloat(item.priceEth) >= min);
      }
    }
    if (maxPrice) {
      const max = parseFloat(maxPrice);
      if (!isNaN(max)) {
        filtered = filtered.filter((item) => parseFloat(item.priceEth) <= max);
      }
    }

    // Filtro por Busca textual
    if (search) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(search) ||
          item.tokenId.toLowerCase().includes(search) ||
          item.creator.name.toLowerCase().includes(search) ||
          item.description.toLowerCase().includes(search)
      );
    }

    // Ordenação
    filtered.sort((a, b) => {
      if (sort === 'preco-menor') {
        return parseFloat(a.priceEth) - parseFloat(b.priceEth);
      }
      if (sort === 'preco-maior') {
        return parseFloat(b.priceEth) - parseFloat(a.priceEth);
      }
      if (sort === 'mais-populares') {
        return b.likesCount - a.likesCount;
      }
      // Padrão: 'recentes'
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    const categoryCounts: Record<string, number> = {
      'Arte digital': 33,
      'Fotografia': 12,
      'Música': 65,
      'Arte 3D': 39,
      'Colecionáveis': 23,
      'Generativa': 17,
      'Jogos': 19,
      'Assinaturas': 13,
      'Utilidade': 18,
    };

    const networkCounts: Record<string, number> = {
      Ethereum: 119,
      Polygon: 78,
      Solana: 86,
    };

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const startIndex = (page - 1) * limit;
    const paginatedItems = filtered.slice(startIndex, startIndex + limit);

    const response: NftListResponse = {
      items: paginatedItems,
      total,
      page,
      totalPages,
      categoryCounts,
      networkCounts,
    };

    return HttpResponse.json(response);
  }),

  // Detalhe de NFT
  http.get('/api/nfts/:id', async ({ params, request }) => {
    await delay(180);
    const { id } = params;
    const nft = currentNfts.find((item) => item.id === id);

    if (!nft) {
      return HttpResponse.json(
        { message: 'NFT não encontrado', code: 'NFT_NOT_FOUND' },
        { status: 404 }
      );
    }

    const userKey = getUserKeyFromRequest(request);
    const userFavs = favoritesByUser.get(userKey);

    return HttpResponse.json({
      ...nft,
      isLiked: userFavs ? userFavs.has(nft.id) : Boolean(nft.isLiked),
    });
  }),

  // Toggle Like (Favoritar) com suporte a falha determinística para teste de rollback otimista
  http.post('/api/nfts/:id/like', async ({ params, request }) => {
    await delay(150);
    const { id } = params as { id: string };

    const forceError =
      typeof window !== 'undefined' && localStorage.getItem('kurio_mock_like_error') === 'true';
    if (forceError || id === 'fail-like') {
      return HttpResponse.json(
        { message: 'Falha ao sincronizar favorito na rede.', code: 'LIKE_SYNC_FAILED' },
        { status: 500 }
      );
    }

    const nftIndex = currentNfts.findIndex((item) => item.id === id);
    if (nftIndex === -1) {
      return HttpResponse.json({ message: 'NFT não encontrado' }, { status: 404 });
    }

    const userKey = getUserKeyFromRequest(request);
    if (!favoritesByUser.has(userKey)) {
      favoritesByUser.set(userKey, new Set());
    }
    const userFavs = favoritesByUser.get(userKey)!;

    const nft = currentNfts[nftIndex];
    const currentlyLiked = userFavs.has(id) || Boolean(nft.isLiked);
    const isLiked = !currentlyLiked;

    if (isLiked) {
      userFavs.add(id);
    } else {
      userFavs.delete(id);
    }

    const likesCount = isLiked ? nft.likesCount + 1 : Math.max(0, nft.likesCount - 1);

    currentNfts[nftIndex] = {
      ...nft,
      isLiked,
      likesCount,
    };

    return HttpResponse.json(currentNfts[nftIndex]);
  }),

  // Recursos REST de Favoritos (Seção 5)
  http.get('/api/favorites', async ({ request }) => {
    await delay(120);
    const userKey = getUserKeyFromRequest(request);
    const userFavs = favoritesByUser.get(userKey) || new Set<string>();
    const items = currentNfts.filter((n) => userFavs.has(n.id) || n.isLiked);
    return HttpResponse.json({ items });
  }),

  // Recurso REST de Cotação (Seção 5: validação de cupom, disponibilidade, descontos, taxas e total)
  http.post('/api/quote', async ({ request }) => {
    await delay(150);
    const body = (await request.json().catch(() => ({}))) as {
      items?: Array<{ nftId: string; quantity: number }>;
      couponCode?: string;
    };

    const reqItems = body.items || [];
    let subtotal = 0;

    for (const entry of reqItems) {
      const found = currentNfts.find((n) => n.id === entry.nftId);
      if (!found) {
        return HttpResponse.json(
          { message: `NFT ${entry.nftId} não encontrado`, code: 'NFT_NOT_FOUND' },
          { status: 404 }
        );
      }
      const available = found.availableEditions ?? found.availableQuantity ?? 50;
      if (found.isSoldOut || entry.quantity > available) {
        return HttpResponse.json(
          {
            message: `Quantidade indisponível para ${found.name}`,
            code: 'AVAILABILITY_CONFLICT',
          },
          { status: 409 }
        );
      }
      subtotal += parseFloat(found.priceEth) * entry.quantity;
    }

    let discountPercentage = 0;
    const cleanCode = body.couponCode?.trim().toUpperCase();
    if (cleanCode) {
      if (cleanCode === 'EXPIRADO') {
        return HttpResponse.json(
          { message: 'Este código promocional expirou', code: 'COUPON_EXPIRED' },
          { status: 422 }
        );
      }
      const coupon = VALID_COUPONS[cleanCode];
      if (!coupon) {
        return HttpResponse.json(
          { message: 'Código promocional inválido', code: 'INVALID_COUPON' },
          { status: 422 }
        );
      }
      discountPercentage = coupon.discountPercentage;
    }

    const discount = subtotal * (discountPercentage / 100);
    const networkFee = reqItems.length > 0 ? 0.016 : 0;
    const total = Math.max(0, subtotal - discount + networkFee);

    return HttpResponse.json({
      subtotalEth: subtotal.toFixed(2),
      discountEth: discount > 0 ? discount.toFixed(2) : '00.00',
      networkFeeEth: networkFee > 0 ? '0.016' : '0.000',
      totalEth: total > 0 ? total.toFixed(3) : '0.000',
      couponCode: cleanCode,
      discountPercentage,
    });
  }),
];

// Utilitário para atualizar dados em tempo real via mock (sincroniza REST + Socket.IO)
export const updateMockNftPrice = (
  id: string,
  newPriceEth?: string,
  newAvailableEditions?: number,
  isSoldOut?: boolean
) => {
  const index = currentNfts.findIndex((n) => n.id === id);
  if (index !== -1) {
    currentNfts[index] = {
      ...currentNfts[index],
      priceEth: newPriceEth ?? currentNfts[index].priceEth,
      availableEditions: newAvailableEditions ?? currentNfts[index].availableEditions,
      availableQuantity: newAvailableEditions ?? currentNfts[index].availableQuantity,
      isSoldOut: isSoldOut ?? currentNfts[index].isSoldOut,
    };
    return currentNfts[index];
  }
  return null;
};
