import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { nftService } from '@/services/nftService';
import { NftQueryParams, NftItem } from '@/types/nft';

export const NFT_KEYS = {
  all: ['nfts'] as const,
  lists: () => [...NFT_KEYS.all, 'list'] as const,
  list: (params: NftQueryParams) => [...NFT_KEYS.lists(), params] as const,
  details: () => [...NFT_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...NFT_KEYS.details(), id] as const,
};

export function useNfts(params: NftQueryParams = {}) {
  return useQuery({
    queryKey: NFT_KEYS.list(params),
    queryFn: () => nftService.listNfts(params),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 2, // 2 minutos
  });
}

export function useNftDetail(id: string) {
  return useQuery({
    queryKey: NFT_KEYS.detail(id),
    queryFn: () => nftService.getNftById(id),
    enabled: Boolean(id),
  });
}

export function useToggleNftLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => nftService.toggleLike(id),
    onMutate: async (id: string) => {
      // Cancela queries concorrentes para evitar sobrescrita
      await queryClient.cancelQueries({ queryKey: NFT_KEYS.detail(id) });
      await queryClient.cancelQueries({ queryKey: NFT_KEYS.lists() });

      // Salva snapshot anterior do detalhe para rollback em caso de falha
      const prevDetail = queryClient.getQueryData<NftItem>(NFT_KEYS.detail(id));
      if (prevDetail) {
        const isLiked = !prevDetail.isLiked;
        queryClient.setQueryData<NftItem>(NFT_KEYS.detail(id), {
          ...prevDetail,
          isLiked,
          likesCount: isLiked ? prevDetail.likesCount + 1 : Math.max(0, prevDetail.likesCount - 1),
        });
      }

      // Atualiza optimisticamente também a listagem do catálogo
      queryClient.setQueriesData({ queryKey: NFT_KEYS.lists() }, (oldData: any) => {
        if (!oldData?.items) return oldData;
        return {
          ...oldData,
          items: oldData.items.map((item: NftItem) => {
            if (item.id === id) {
              const isLiked = !item.isLiked;
              return {
                ...item,
                isLiked,
                likesCount: isLiked ? item.likesCount + 1 : Math.max(0, item.likesCount - 1),
              };
            }
            return item;
          }),
        };
      });

      return { prevDetail };
    },
    onError: (_err, id, context) => {
      // Rollback seguro em caso de erro
      if (context?.prevDetail) {
        queryClient.setQueryData(NFT_KEYS.detail(id), context.prevDetail);
      }
    },
    onSuccess: (updatedNft, id) => {
      // Atualiza com os dados reais confirmados pela API
      queryClient.setQueryData(NFT_KEYS.detail(id), updatedNft);
    },
    onSettled: (_data, _err, id) => {
      queryClient.invalidateQueries({ queryKey: NFT_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: NFT_KEYS.lists() });
    },
  });
}

import { useEffect } from 'react';
import { socketService } from '@/services/socketService';
import { NftUpdatedEvent } from '@/types/socket';

/**
 * Hook global que sincroniza eventos nft.updated com o cache do TanStack Query
 * garantindo atualização em tempo real no catálogo e na página de detalhes
 */
export function useSocketNftSync() {
  const queryClient = useQueryClient();

  useEffect(() => {
    socketService.init();

    const unsubscribe = socketService.onNftUpdated((event: NftUpdatedEvent) => {
      queryClient.setQueriesData({ queryKey: NFT_KEYS.lists() }, (oldData: any) => {
        if (!oldData?.items) return oldData;
        return {
          ...oldData,
          items: oldData.items.map((item: NftItem) => {
            if (item.id === event.id) {
              return {
                ...item,
                priceEth: event.priceEth ?? item.priceEth,
                priceUsd: event.priceUsd ?? item.priceUsd,
                availableQuantity: event.availableQuantity ?? item.availableQuantity,
                totalQuantity: event.totalQuantity ?? item.totalQuantity,
                isSoldOut: event.isSoldOut ?? item.isSoldOut,
              };
            }
            return item;
          }),
        };
      });

      queryClient.setQueryData<NftItem>(NFT_KEYS.detail(event.id), (prevDetail) => {
        if (!prevDetail) return prevDetail;
        return {
          ...prevDetail,
          priceEth: event.priceEth ?? prevDetail.priceEth,
          priceUsd: event.priceUsd ?? prevDetail.priceUsd,
          availableQuantity: event.availableQuantity ?? prevDetail.availableQuantity,
          totalQuantity: event.totalQuantity ?? prevDetail.totalQuantity,
          isSoldOut: event.isSoldOut ?? prevDetail.isSoldOut,
        };
      });
    });

    return () => {
      unsubscribe();
    };
  }, [queryClient]);
}
