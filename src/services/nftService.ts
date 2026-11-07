import { api } from './api';
import { NftItem, NftListResponse, NftQueryParams } from '@/types/nft';

export const nftService = {
  async listNfts(params?: NftQueryParams): Promise<NftListResponse> {
    const response = await api.get<NftListResponse>('/nfts', { params });
    return response.data;
  },

  async getNftById(id: string): Promise<NftItem> {
    const response = await api.get<NftItem>(`/nfts/${id}`);
    return response.data;
  },

  async toggleLike(id: string): Promise<NftItem> {
    const response = await api.post<NftItem>(`/nfts/${id}/like`);
    return response.data;
  },
};
