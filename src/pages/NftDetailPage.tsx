import React, { useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useNftDetail, useToggleNftLike } from '@/hooks/useNfts';
import { useCart } from '@/hooks/useCart';
import { Header } from '@/components/layout/Header';
import { NftGallery } from '@/components/nft-detail/NftGallery';
import { NftInfoPanel } from '@/components/nft-detail/NftInfoPanel';
import { NftTabsSection } from '@/components/nft-detail/NftTabsSection';
import { MoreFromCollection } from '@/components/nft-detail/MoreFromCollection';
import { PerksSection } from '@/components/home/PerksSection';
import { Footer } from '@/components/layout/Footer';
import {
  AlertTriangle,
  ChevronLeft,
  Heart,
  Star,
  Minus,
  Plus,
  ShoppingCart,
  Check,
} from 'lucide-react';

export const NftDetailPage: React.FC = () => {
  const { nftId } = useParams({ from: '/nft/$nftId' });
  const navigate = useNavigate();
  const { data: nft, isLoading, isError } = useNftDetail(nftId);
  const { addItem } = useCart();
  const toggleLike = useToggleNftLike();

  // Estados para compras no layout mobile
  const [selectedEdition, setSelectedEdition] = useState('1/50');
  const [mobileQty, setMobileQty] = useState(1);
  const [addedCartFeedback, setAddedCartFeedback] = useState(false);

  const priceNum = parseFloat(nft?.priceEth || '1.19');
  const totalEthPrice = (priceNum * mobileQty).toFixed(2);

  const handleMobileMinus = () => {
    if (mobileQty > 1) setMobileQty(mobileQty - 1);
  };

  const handleMobilePlus = () => {
    if (mobileQty < 10) setMobileQty(mobileQty + 1);
  };

  const handleAddToCart = () => {
    if (!nft) return;
    addItem(nft, mobileQty);
    setAddedCartFeedback(true);
    setTimeout(() => setAddedCartFeedback(false), 2000);
  };

  const handleBuyNow = () => {
    if (!nft) return;
    addItem(nft, mobileQty);
    navigate({ to: '/pagamento' });
  };

  const handleToggleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    if (nft?.id) {
      toggleLike.mutate(nft.id);
    }
  };

  return (
    <div className="min-h-screen bg-[#140D0A] text-[#CFB28C] flex flex-col font-mono selection:bg-[#D28A4C] selection:text-[#140D0A] pb-28 md:pb-0 animate-in fade-in duration-300">
      
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

        {/* 404 / NFT Inexistente */}
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
            {/* 1. VISÃO MOBILE DEDICADA (Figma Print Mobile / Detalhes do NFT) */}
            <div className="md:hidden px-4 pt-3 pb-6 space-y-4">
              
              {/* Top Navigation Overlay: Botão Voltar e Botão Favorito */}
              <div className="flex items-center justify-between pb-1">
                <button
                  type="button"
                  onClick={() => navigate({ to: '/' })}
                  className="w-10 h-10 rounded-full bg-[#241612]/80 backdrop-blur-md border border-[#38220F] text-[#CFB28C] flex items-center justify-center hover:text-[#E89B55] transition-all active:scale-95 cursor-pointer shadow-md"
                  aria-label="Voltar para a página inicial"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={handleToggleLike}
                  className="w-10 h-10 rounded-full bg-[#241612]/80 backdrop-blur-md border border-[#38220F] text-[#CFB28C] flex items-center justify-center hover:text-[#E89B55] transition-all active:scale-95 cursor-pointer shadow-md"
                  aria-label={nft.isLiked ? 'Desfavoritar' : 'Favoritar'}
                >
                  <Heart
                    className={`w-4 h-4 transition-colors ${
                      nft.isLiked ? 'fill-[#E89B55] text-[#E89B55]' : 'text-[#CFB28C]'
                    }`}
                  />
                </button>
              </div>

              {/* Imagem Principal Arredondada */}
              <div className="w-full aspect-square rounded-3xl overflow-hidden bg-[#241612] border border-[#38220F]/80 shadow-2xl">
                <img
                  src={nft.image}
                  alt={`${nft.name} ${nft.tokenId}`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Card de Informações Arredondado */}
              <div className="p-5 rounded-3xl bg-[#241612] border border-[#38220F] space-y-3.5 shadow-xl text-left">
                
                {/* Linha do Título e Avaliação */}
                <div className="flex items-center justify-between gap-2">
                  <h1 className="text-base font-bold text-[#CFB28C] tracking-wide">
                    {nft.name} {nft.tokenId}
                  </h1>

                  <div className="flex items-center gap-1 bg-[#140D0A]/60 border border-[#D28A4C]/40 px-2.5 py-0.5 rounded-full text-xs font-mono text-[#E89B55] shrink-0">
                    <Star className="w-3.5 h-3.5 fill-[#E89B55] text-[#E89B55]" />
                    <span>4.8(19)</span>
                  </div>
                </div>

                {/* Descrição */}
                <p className="text-xs text-[#CFB28C]/80 leading-relaxed font-mono">
                  {nft.description ||
                    'Um colecionável digital 1/50 finalizado à mão da coleção Kurio Editions, verificado na Ethereum.'}
                </p>

                {/* Seleção de Edição */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-xs font-bold text-[#CFB28C] block">
                    Edição:
                  </span>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {['1/10', '1/10', '1/50', 'ABERTA'].map((ed, idx) => {
                      const isSelected = selectedEdition === ed && idx === 2; // Default 1/50 selecionada no print
                      return (
                        <button
                          key={`${ed}-${idx}`}
                          type="button"
                          onClick={() => setSelectedEdition(ed)}
                          className={`px-3 py-1 rounded-full text-[11px] font-mono transition-all cursor-pointer ${
                            isSelected
                              ? 'border border-[#D28A4C] text-[#E89B55] bg-[#D28A4C]/10 font-bold'
                              : 'border border-[#38220F] text-[#CFB28C]/60 hover:text-[#CFB28C]'
                          }`}
                        >
                          {ed}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Metadados Técnicos */}
                <div className="pt-2 border-t border-[#38220F]/60 space-y-1.5 text-xs text-[#CFB28C]/70 font-mono">
                  <p>
                    <span className="text-[#CFB28C]/50">ID do token: </span>
                    <span className="text-[#CFB28C]">{nft.tokenId || '#0042'}</span>
                  </p>
                  <p>
                    <span className="text-[#CFB28C]/50">Coleção: </span>
                    <span className="text-[#CFB28C]">{nft.collection || 'Kurio Apes'}</span>
                  </p>
                  <p>
                    <span className="text-[#CFB28C]/50">Atributos: </span>
                    <span className="text-[#CFB28C]">
                      {nft.attributes?.map((a: { value: string }) => a.value).join(', ') || 'Óculos, Esmeralda, Raro'}
                    </span>
                  </p>
                </div>

              </div>

              {/* Feedback toast de adicionado ao carrinho */}
              {addedCartFeedback && (
                <div className="p-3 bg-green-950/80 border border-green-800 rounded-xl text-green-300 text-xs flex items-center justify-center gap-2 animate-in fade-in duration-200">
                  <Check className="w-4 h-4 text-green-400" />
                  <span>Item adicionado ao carrinho!</span>
                </div>
              )}

              {/* Barra Inferior Fixa de Compra (Mobile Bottom Action Bar) */}
              <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#1A110E]/95 backdrop-blur-xl border-t border-[#38220F] px-4 py-3 shadow-2xl md:hidden font-mono">
                
                {/* Linha 1: Qtd. Stepper e Preço Total */}
                <div className="flex items-center justify-between pb-2.5 text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="text-[#CFB28C]/80 font-bold">Qtd.</span>
                    <button
                      type="button"
                      onClick={handleMobileMinus}
                      disabled={mobileQty <= 1}
                      className="w-5 h-5 rounded-full bg-[#D28A4C] hover:bg-[#E89B55] disabled:opacity-40 text-[#140D0A] flex items-center justify-center font-bold transition-all cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-bold text-[#CFB28C] w-4 text-center">
                      {mobileQty}
                    </span>
                    <button
                      type="button"
                      onClick={handleMobilePlus}
                      disabled={mobileQty >= 10}
                      className="w-5 h-5 rounded-full bg-[#D28A4C] hover:bg-[#E89B55] disabled:opacity-40 text-[#140D0A] flex items-center justify-center font-bold transition-all cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <span className="text-sm font-bold text-[#E89B55] font-mono">
                    {totalEthPrice} ETH
                  </span>
                </div>

                {/* Linha 2: Botão Comprar NFT e Botão Adicionar ao Carrinho */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    className="flex-1 bg-[#D28A4C] hover:bg-[#E89B55] text-[#140D0A] font-bold text-xs py-3 rounded-xl transition-all active:scale-95 shadow-lg shadow-[#D28A4C]/15 cursor-pointer font-mono tracking-wide"
                  >
                    Comprar NFT
                  </button>

                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="w-12 h-11 bg-[#241612] hover:bg-[#38220F] border border-[#38220F] text-[#CFB28C] hover:text-[#E89B55] rounded-xl flex items-center justify-center transition-all active:scale-95 cursor-pointer"
                    aria-label="Adicionar ao carrinho"
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                </div>

              </div>

            </div>

            {/* 2. VISÃO DESKTOP (Preservada) */}
            <div className="hidden md:block">
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

              {/* Abas com Detalhes e Avaliações */}
              <NftTabsSection nft={nft} />

              {/* Mais desta coleção */}
              <MoreFromCollection
                currentNftId={nft.id}
                onSelectNft={(item) => navigate({ to: '/nft/$nftId', params: { nftId: item.id } })}
              />

              {/* Vantagens (W, C, D) + Newsletter */}
              <PerksSection />
            </div>
          </>
        )}

      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
};
