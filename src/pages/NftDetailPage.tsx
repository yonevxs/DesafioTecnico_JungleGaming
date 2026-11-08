import React from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useNftDetail } from '@/hooks/useNfts';
import { Header } from '@/components/layout/Header';
import { NftGallery } from '@/components/nft-detail/NftGallery';
import { NftInfoPanel } from '@/components/nft-detail/NftInfoPanel';
import { NftTabsSection } from '@/components/nft-detail/NftTabsSection';
import { MoreFromCollection } from '@/components/nft-detail/MoreFromCollection';
import { PerksSection } from '@/components/home/PerksSection';
import { Footer } from '@/components/layout/Footer';
import { AlertTriangle } from 'lucide-react';

export const NftDetailPage: React.FC = () => {
  const { nftId } = useParams({ from: '/nft/$nftId' });
  const navigate = useNavigate();
  const { data: nft, isLoading, isError } = useNftDetail(nftId);

  return (
    <div className="min-h-screen bg-[#140D0A] text-[#CFB28C] flex flex-col font-mono selection:bg-[#D28A4C] selection:text-[#140D0A] animate-in fade-in duration-300">
      
      {/* Header com navegação SPA integrada */}
      <Header />

      <main className="flex-grow">
        
        {/* Loading Skeleton */}
        {isLoading && (
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-12">
            <div className="h-5 w-48 rounded bg-[#241612] shimmer mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              <div className="lg:col-span-6 aspect-square rounded-3xl bg-[#241612] shimmer" />
              <div className="lg:col-span-6 space-y-5">
                <div className="h-8 w-3/4 rounded bg-[#241612] shimmer" />
                <div className="h-6 w-1/3 rounded bg-[#241612] shimmer" />
                <div className="h-20 w-full rounded bg-[#241612] shimmer" />
                <div className="h-12 w-1/2 rounded bg-[#241612] shimmer" />
              </div>
            </div>
          </div>
        )}

        {/* 404 / NFT Inexistente (Requisito obrigatório do desafio) */}
        {!isLoading && (isError || !nft) && (
          <div className="max-w-2xl mx-auto px-4 py-24 text-center">
            <div className="w-16 h-16 rounded-full bg-red-950/60 border border-red-800/50 flex items-center justify-center mx-auto mb-4 text-red-400">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-[#CFB28C] mb-2">NFT Inexistente</h1>
            <p className="text-sm text-[#CFB28C]/70 mb-6">
              O token solicitado não foi encontrado ou não está mais disponível no catálogo da Kurio.
            </p>
            <button
              type="button"
              onClick={() => navigate({ to: '/' })}
              className="bg-[#D28A4C] hover:bg-[#E89B55] text-[#140D0A] font-bold text-xs px-6 py-3 rounded-lg transition-all"
            >
              Voltar ao Início
            </button>
          </div>
        )}

        {/* NFT Detalhes com Sucesso */}
        {!isLoading && nft && (
          <>
            {/* Breadcrumb (Início / Mercado) */}
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 pt-8 pb-4">
              <nav className="text-xs text-[#CFB28C]/60 flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => navigate({ to: '/' })}
                  className="hover:text-[#E89B55] transition-colors"
                >
                  Início
                </button>
                <span>/</span>
                <button
                  type="button"
                  onClick={() => {
                    navigate({ to: '/' }).then(() => {
                      setTimeout(() => {
                        document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    });
                  }}
                  className="text-[#CFB28C] hover:text-[#E89B55] transition-colors font-semibold"
                >
                  Mercado
                </button>
              </nav>
            </div>

            {/* Seção Principal: Galeria + Painel de Informações */}
            <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
                
                {/* Coluna da Galeria (Desktop: 7 colunas) */}
                <div className="lg:col-span-7">
                  <NftGallery
                    mainImage={nft.image}
                    nftName={nft.name}
                  />
                </div>

                {/* Coluna de Informações e Compra (Desktop: 5 colunas) */}
                <div className="lg:col-span-5">
                  <NftInfoPanel
                    nft={nft}
                    onBuySuccess={() => navigate({ to: '/carrinho' })}
                  />
                </div>

              </div>
            </section>

            {/* Abas com Detalhes e Avaliações (Print 2) */}
            <NftTabsSection nft={nft} />

            {/* Mais desta coleção (Print 3) */}
            <MoreFromCollection
              currentNftId={nft.id}
              onSelectNft={(item) => navigate({ to: '/nft/$nftId', params: { nftId: item.id } })}
            />

            {/* Vantagens (W, C, D) + Newsletter (Print 4) */}
            <PerksSection />
          </>
        )}

      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
};
