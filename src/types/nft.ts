export type NftCategory = 
  | 'Arte digital'
  | 'Fotografia'
  | 'Música'
  | 'Arte 3D'
  | 'Colecionáveis'
  | 'Generativa'
  | 'Jogos'
  | 'Assinaturas'
  | 'Utilidade';

export type BlockchainNetwork = 'Ethereum' | 'Polygon' | 'Solana';

export type NftTab = 'todos' | 'novos' | 'em-alta';

export type NftSortOption = 'recentes' | 'preco-menor' | 'preco-maior' | 'mais-populares';

export interface NftItem {
  id: string;
  name: string;
  title?: string;
  tokenId: string; // Ex: #042
  creator: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  priceEth: string; // String decimal para manter precisão de cálculo
  priceUsd?: number;
  originalPriceEth?: string; // Preço original em caso de desconto
  image: string;
  category: NftCategory;
  network: BlockchainNetwork;
  isGenesis?: boolean;
  isTrending?: boolean;
  isNewRelease?: boolean;
  isLimitedOffer?: boolean;
  edition: string; // Ex: "1 de 10"
  availableEditions: number;
  totalEditions: number;
  availableQuantity?: number;
  totalQuantity?: number;
  isSoldOut?: boolean;
  description: string;
  likesCount: number;
  isLiked?: boolean;
  rarity?: string;
  collection?: string;
  attributes?: { trait_type: string; value: string }[];
  createdAt: string;
}

export interface NftQueryParams {
  tab?: NftTab;
  category?: string;
  network?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: NftSortOption;
  search?: string;
  page?: number;
  limit?: number;
}

export interface NftListResponse {
  items: NftItem[];
  total: number;
  page: number;
  totalPages: number;
  categoryCounts: Record<string, number>;
  networkCounts: Record<string, number>;
}
