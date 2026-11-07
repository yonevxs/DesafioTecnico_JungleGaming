import { http, HttpResponse, delay } from 'msw';
import { mockNfts } from '../data/nfts';
import { NftItem, NftListResponse } from '@/types/nft';

// Estado em memória local que pode persistir entre requisições
let currentNfts: NftItem[] = [...mockNfts];

export const nftHandlers = [
  // Listagem com busca, filtros, ordenação e paginação
  http.get('/api/nfts', async ({ request }) => {
    // Simula pequena latência para visualização do shimmer skeleton (300ms)
    await delay(350);

    const url = new URL(request.url);
    const tab = url.searchParams.get('tab') || 'todos';
    const category = url.searchParams.get('category');
    const network = url.searchParams.get('network');
    const minPrice = url.searchParams.get('minPrice');
    const maxPrice = url.searchParams.get('maxPrice');
    const sort = url.searchParams.get('sort') || 'recentes';
    const search = url.searchParams.get('search')?.toLowerCase().trim();
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '6', 10);

    let filtered = [...currentNfts];

    // Filtro por Tab
    if (tab === 'novos') {
      filtered = filtered.filter(item => item.isNewRelease || new Date(item.createdAt) >= new Date('2026-10-25'));
    } else if (tab === 'em-alta') {
      filtered = filtered.filter(item => item.isTrending || item.likesCount > 100);
    }

    // Filtro por Categoria
    if (category) {
      filtered = filtered.filter(item => item.category.toLowerCase() === category.toLowerCase());
    }

    // Filtro por Rede
    if (network) {
      filtered = filtered.filter(item => item.network.toLowerCase() === network.toLowerCase());
    }

    // Filtro por Faixa de Preço (ETH decimal)
    if (minPrice) {
      const min = parseFloat(minPrice);
      if (!isNaN(min)) {
        filtered = filtered.filter(item => parseFloat(item.priceEth) >= min);
      }
    }
    if (maxPrice) {
      const max = parseFloat(maxPrice);
      if (!isNaN(max)) {
        filtered = filtered.filter(item => parseFloat(item.priceEth) <= max);
      }
    }

    // Filtro por Busca textual
    if (search) {
      filtered = filtered.filter(item => 
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

    // Contadores para a Sidebar baseados no catálogo total
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
      'Ethereum': 119,
      'Polygon': 78,
      'Solana': 86,
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
  http.get('/api/nfts/:id', async ({ params }) => {
    await delay(200);
    const { id } = params;
    const nft = currentNfts.find(item => item.id === id);

    if (!nft) {
      return HttpResponse.json(
        { message: 'NFT não encontrado', code: 'NFT_NOT_FOUND' },
        { status: 404 }
      );
    }

    return HttpResponse.json(nft);
  }),

  // Toggle Like (Favoritar)
  http.post('/api/nfts/:id/like', async ({ params }) => {
    await delay(150);
    const { id } = params;
    const nftIndex = currentNfts.findIndex(item => item.id === id);

    if (nftIndex === -1) {
      return HttpResponse.json({ message: 'NFT não encontrado' }, { status: 404 });
    }

    const nft = currentNfts[nftIndex];
    const isLiked = !nft.isLiked;
    const likesCount = isLiked ? nft.likesCount + 1 : Math.max(0, nft.likesCount - 1);

    currentNfts[nftIndex] = {
      ...nft,
      isLiked,
      likesCount,
    };

    return HttpResponse.json(currentNfts[nftIndex]);
  }),
];

// Utilitário para atualizar dados em tempo real via mock
export const updateMockNftPrice = (id: string, newPriceEth: string, newAvailableEditions?: number) => {
  const index = currentNfts.findIndex(n => n.id === id);
  if (index !== -1) {
    currentNfts[index] = {
      ...currentNfts[index],
      priceEth: newPriceEth,
      availableEditions: newAvailableEditions ?? currentNfts[index].availableEditions,
    };
    return currentNfts[index];
  }
  return null;
};
