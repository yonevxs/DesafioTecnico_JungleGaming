import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { nftService } from '@/services/nftService';
import { NftQueryParams, NftItem } from '@/types/nft';
import { socketService } from '@/services/socketService';
import { NftUpdatedEvent } from '@/types/socket';

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
      // Cancela queries concorrentes para evitar condições de corrida
      await queryClient.cancelQueries({ queryKey: NFT_KEYS.detail(id) });
      await queryClient.cancelQueries({ queryKey: NFT_KEYS.lists() });

      // Salva snapshots anteriores para rollback seguro em caso de falha
      const prevDetail = queryClient.getQueryData<NftItem>(NFT_KEYS.detail(id));
      const prevLists = queryClient.getQueriesData({ queryKey: NFT_KEYS.lists() });

      if (prevDetail) {
        const isLiked = !prevDetail.isLiked;
        queryClient.setQueryData<NftItem>(NFT_KEYS.detail(id), {
          ...prevDetail,
          isLiked,
          likesCount: isLiked ? prevDetail.likesCount + 1 : Math.max(0, prevDetail.likesCount - 1),
        });
      }

      // Atualiza otimisticamente também a listagem do catálogo
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

      return { prevDetail, prevLists };
    },
    onError: (_err, id, context) => {
      // Rollback seguro em caso de erro tanto no detalhe quanto nas listas
      if (context?.prevDetail) {
        queryClient.setQueryData(NFT_KEYS.detail(id), context.prevDetail);
      }
      if (context?.prevLists) {
        for (const [queryKey, data] of context.prevLists) {
          queryClient.setQueryData(queryKey, data);
        }
      }
    },
    onSuccess: (updatedNft, id) => {
      queryClient.setQueryData(NFT_KEYS.detail(id), updatedNft);
    },
    onSettled: (_data, _err, id) => {
      queryClient.invalidateQueries({ queryKey: NFT_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: NFT_KEYS.lists() });
    },
  });
}

/**
 * Hook global que sincroniza eventos nft.updated com o cache do TanStack Query
 * e reconcilia recursos ativos após reconexão do Socket.IO (Seção 7)
 */
export function useSocketNftSync() {
  const queryClient = useQueryClient();

  useEffect(() => {
    socketService.init();

    const unsubscribeNft = socketService.onNftUpdated((event: NftUpdatedEvent) => {
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
                availableEditions: event.availableQuantity ?? item.availableEditions,
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
          availableEditions: event.availableQuantity ?? prevDetail.availableEditions,
          totalQuantity: event.totalQuantity ?? prevDetail.totalQuantity,
          isSoldOut: event.isSoldOut ?? prevDetail.isSoldOut,
        };
      });
    });

    // Reconcilia os recursos ativos com a API REST após reconexão (Seção 7)
    const unsubscribeReconnect = socketService.onReconnect(() => {
      queryClient.invalidateQueries({ queryKey: NFT_KEYS.all });
    });

    return () => {
      unsubscribeNft();
      unsubscribeReconnect();
    };
  }, [queryClient]);
}
