import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PerksSection } from '@/components/home/PerksSection';
import { NftCard } from '@/components/home/NftCard';
import { useCart } from '@/hooks/useCart';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ChevronLeft } from 'lucide-react';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    items,
    totalCount,
    subtotalEth,
    discountEth,
    networkFeeEth,
    totalEth,
    appliedCoupon,
    couponError,
    updateQuantity,
    removeItem,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [activeSlide, setActiveSlide] = useState(0);

  // 5 NFTs recomendados para "Colecionadores também viram"
  const recommendedNfts = mockNfts.slice(3, 8);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (applyCoupon(couponCode)) {
      setCouponCode('');
    }
  };

  return (
    <div className="min-h-screen bg-[#140D0A] text-[#CFB28C] flex flex-col font-mono selection:bg-[#D28A4C] selection:text-[#140D0A] animate-in fade-in duration-300">
      
      {/* Header com destaque no Mercado (Apenas Desktop) */}
      <div className="hidden md:block">
        <Header />
      </div>

      <main className="flex-grow">
        
        {/* 1. VISÃO MOBILE DEDICADA (Figma Print Mobile / Carrinho de NFTs) */}
        <div className="md:hidden flex flex-col min-h-screen">
          
          {/* Top Bar: Botão Voltar + Título */}
          <div className="flex items-center gap-4 px-4 pt-4 pb-3">
            <button
              type="button"
              onClick={() => navigate({ to: '/' })}
              className="w-10 h-10 rounded-full bg-[#241612] border border-[#38220F] text-[#CFB28C] flex items-center justify-center hover:text-[#E89B55] transition-all active:scale-95 cursor-pointer shadow-md"
              aria-label="Voltar para a página inicial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-base sm:text-lg font-bold text-[#CFB28C] font-mono tracking-wide">
              Carrinho de NFTs
            </h1>
          </div>

          {/* Lista de Cards de Itens no Carrinho */}
          <div className="px-4 space-y-3 pb-80 flex-1 overflow-y-auto">
            {items.length === 0 ? (
              <div className="bg-[#241612] rounded-2xl p-8 text-center border border-[#38220F] space-y-4 my-6">
                <ShoppingBag className="w-12 h-12 text-[#E89B55] mx-auto opacity-70" />
                <h3 className="text-base font-bold text-[#CFB28C]">Seu carrinho está vazio</h3>
                <p className="text-xs text-[#CFB28C]/60 max-w-xs mx-auto">
                  Explore os colecionáveis digitais exclusivos no mercado e adicione obras à sua coleção.
                </p>
                <button
                  type="button"
                  onClick={() => navigate({ to: '/' })}
                  className="bg-[#D28A4C] hover:bg-[#E89B55] text-[#140D0A] font-bold text-xs px-6 py-2.5 rounded-lg transition-all"
                >
                  Explorar Mercado
                </button>
              </div>
            ) : (
              items.map(({ nft, quantity }) => {
                const lineTotalEth = (parseFloat(nft.priceEth) * quantity).toFixed(2);
                return (
                  <div
                    key={nft.id}
                    className="bg-[#241612] border border-[#38220F]/60 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-md"
                  >
                    {/* Thumbnail + Textos */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#1A100A] shrink-0 border border-[#38220F]/40">
                        <img
                          src={nft.image}
                          alt={nft.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="min-w-0 flex flex-col justify-center space-y-0.5">
                        <h3 className="text-xs font-bold text-[#FFF5EA] truncate font-mono">
                          {nft.name} {nft.tokenId}
                        </h3>
                        <span className="text-[10px] text-[#CFB28C]/60 font-mono">
                          Edição: {nft.totalEditions ? `1/${nft.totalEditions}` : '1/50'}
                        </span>
                        <span className="text-xs font-bold text-[#D28A4C] font-mono pt-0.5">
                          {lineTotalEth} ETH
                        </span>
                      </div>
                    </div>

                    {/* Stepper de Quantidade */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => updateQuantity(nft.id, quantity - 1)}
                        className="w-6 h-6 rounded-full bg-[#180E09] border border-[#38220F] text-[#CFB28C] hover:text-[#E89B55] hover:border-[#D28A4C] flex items-center justify-center transition-all cursor-pointer active:scale-95"
                        aria-label="Diminuir quantidade"
                      >
                        <Minus className="w-3 h-3 stroke-[2.5]" />
                      </button>

                      <span className="text-xs font-bold text-[#CFB28C] w-4 text-center font-mono">
                        {quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() => updateQuantity(nft.id, quantity + 1)}
                        className="w-6 h-6 rounded-full bg-[#180E09] border border-[#38220F] text-[#CFB28C] hover:text-[#E89B55] hover:border-[#D28A4C] flex items-center justify-center transition-all cursor-pointer active:scale-95"
                        aria-label="Aumentar quantidade"
                      >
                        <Plus className="w-3 h-3 stroke-[2.5]" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Bottom Sheet Fixo com Resumo do Pedido (Figma Print) */}
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#1E120C] border-t border-[#38220F] rounded-t-[32px] px-5 pt-4 pb-6 shadow-[0_-12px_40px_rgba(0,0,0,0.85)] font-mono">
            <div className="max-w-md mx-auto space-y-3.5">
              
              {/* Código Promocional em formato Pill */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-[#241612] border border-green-800/60 rounded-full px-4 py-2 text-xs text-green-400">
                  <div>
                    <span className="font-bold">{appliedCoupon.code}</span>
                    <span className="text-[10px] text-[#CFB28C]/60 block">{appliedCoupon.description}</span>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-xs text-red-400 hover:text-red-300 font-bold ml-2 cursor-pointer"
                  >
                    Remover
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="relative flex items-center bg-[#241612] border border-[#38220F] rounded-full p-1 pl-4">
                  <input
                    type="text"
                    placeholder="Digite o código promocional..."
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="bg-transparent text-xs text-[#CFB28C] placeholder-[#CFB28C]/40 outline-none flex-grow font-mono"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-[#C8783E] hover:bg-[#D28A4C] text-[#140D0A] font-bold text-xs font-mono transition-all active:scale-95 cursor-pointer shrink-0"
                  >
                    Aplicar
                  </button>
                </form>
              )}

              {couponError && (
                <span className="text-[10px] text-red-400 block px-2">
                  {couponError}
                </span>
              )}

              {/* Detalhamento de Valores */}
              <div className="space-y-2 pt-1 text-xs">
                <div className="flex items-center justify-between text-[#CFB28C]/80">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#CFB28C] font-mono">{subtotalEth} ETH</span>
                </div>

                <div className="flex items-center justify-between text-[#CFB28C]/80">
                  <span>Desconto do lançamento</span>
                  <span className="font-mono text-[#CFB28C]/80">(-) {discountEth}</span>
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center justify-between text-[#CFB28C]/80">
                    <span>Taxa de rede</span>
                    <span className="font-mono text-[#CFB28C]">{networkFeeEth} ETH</span>
                  </div>
                  <span className="text-[10px] text-[#D28A4C] font-mono block text-right">
                    Taxa estimada
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1 text-sm font-bold">
                  <span className="text-[#FFF5EA]">Total</span>
                  <span className="text-base text-[#D28A4C] font-mono tracking-wide">
                    {totalEth} ETH
                  </span>
                </div>
              </div>

              {/* Botão Conectar e Finalizar */}
              <button
                type="button"
                onClick={() => navigate({ to: '/pagamento' })}
                disabled={items.length === 0}
                className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#D28A4C] to-[#C8783E] hover:from-[#E89B55] hover:to-[#D28A4C] disabled:opacity-40 disabled:cursor-not-allowed text-[#140D0A] font-bold text-sm font-mono flex items-center justify-center tracking-wider shadow-lg shadow-[#D28A4C]/20 transition-all active:scale-98 cursor-pointer"
              >
                Conectar e finalizar
              </button>

            </div>
          </div>

        </div>

        {/* 2. VISÃO DESKTOP (Preservada) */}
        <div className="hidden md:block">
          
          {/* Breadcrumb: Início / Mercado / Carrinho */}
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
              onClick={() => navigate({ to: '/' })}
              className="hover:text-[#E89B55] transition-colors"
            >
              Mercado
            </button>
            <span>/</span>
            <span className="text-[#CFB28C] font-semibold">Carrinho</span>
          </nav>
        </div>

        {/* Seção Principal: Itens do Carrinho + Resumo da Carteira */}
        <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            
            {/* Coluna da Esquerda: Tabela de Itens (Desktop: 8 colunas) */}
            <div className="lg:col-span-8 space-y-4">
              
              {/* Cabeçalho da Tabela */}
              <div className="hidden sm:grid grid-cols-12 gap-4 text-xs font-bold text-[#CFB28C] pb-2 px-6">
                <span className="col-span-6">NFTs</span>
                <span className="col-span-2 text-center">Preço</span>
                <span className="col-span-2 text-center">Edições</span>
                <span className="col-span-2 text-right">Total</span>
              </div>

              {/* Estado Vazio */}
              {items.length === 0 ? (
                <div className="bg-[#241612] rounded-2xl p-12 text-center border border-[#38220F] space-y-4">
                  <ShoppingBag className="w-12 h-12 text-[#E89B55] mx-auto opacity-70" />
                  <h3 className="text-lg font-bold text-[#CFB28C]">Seu carrinho está vazio</h3>
                  <p className="text-xs text-[#CFB28C]/60 max-w-sm mx-auto">
                    Explore os colecionáveis digitais exclusivos no mercado e adicione obras raras à sua coleção.
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate({ to: '/' })}
                    className="bg-[#D28A4C] hover:bg-[#E89B55] text-[#140D0A] font-bold text-xs px-6 py-2.5 rounded-lg transition-all"
                  >
                    Explorar Mercado
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map(({ nft, quantity }) => {
                    const lineTotalEth = (parseFloat(nft.priceEth) * quantity).toFixed(2);

                    return (
                      <div
                        key={nft.id}
                        className="bg-[#241612] rounded-2xl p-4 sm:p-5 flex flex-col sm:grid sm:grid-cols-12 gap-4 items-center shadow-md border border-[#38220F]/40 hover:border-[#D28A4C]/40 transition-colors"
                      >
                        {/* Imagem + Nome + Token ID (Col 6) */}
                        <div className="col-span-6 flex items-center gap-4 w-full sm:w-auto">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-[#140D0A] shrink-0">
                            <img
                              src={nft.image}
                              alt={nft.name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="flex flex-col min-w-0">
                            <h3 className="text-sm sm:text-base font-bold text-[#CFB28C] truncate">
                              {nft.name} {nft.tokenId}
                            </h3>
                            <span className="text-[11px] text-[#CFB28C]/60">
                              ID do token: {nft.tokenId}
                            </span>
                          </div>
                        </div>

                        {/* Preço Unitário (Col 2) */}
                        <div className="col-span-2 text-center text-xs sm:text-sm font-semibold text-[#CFB28C]">
                          <span className="sm:hidden text-[#CFB28C]/60 mr-2">Preço:</span>
                          {nft.priceEth} ETH
                        </div>

                        {/* Stepper de Edições (Col 2) */}
                        <div className="col-span-2 flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => updateQuantity(nft.id, quantity - 1)}
                            className="w-6 h-6 rounded-full bg-[#D28A4C] hover:bg-[#E89B55] text-[#140D0A] flex items-center justify-center transition-all"
                            aria-label="Diminuir quantidade"
                          >
                            <Minus className="w-3 h-3" />
                          </button>

                          <span className="text-xs sm:text-sm font-bold w-4 text-center text-[#CFB28C]">
                            {quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() => updateQuantity(nft.id, quantity + 1)}
                            className="w-6 h-6 rounded-full bg-[#D28A4C] hover:bg-[#E89B55] text-[#140D0A] flex items-center justify-center transition-all"
                            aria-label="Aumentar quantidade"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Total da Linha + Botão Remover (Col 2) */}
                        <div className="col-span-2 flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                          <span className="text-xs sm:text-sm font-bold text-[#E89B55]">
                            {lineTotalEth} ETH
                          </span>

                          <button
                            type="button"
                            onClick={() => removeItem(nft.id)}
                            className="text-[#CFB28C]/50 hover:text-red-400 p-1.5 transition-colors"
                            aria-label={`Remover ${nft.name}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>

            {/* Coluna da Direita: Resumo da Carteira (Desktop: 4 colunas) */}
            <div className="lg:col-span-4 flex flex-col space-y-6">
              
              <div className="space-y-4">
                <h2 className="text-base sm:text-lg font-bold text-[#CFB28C]">
                  Resumo da carteira
                </h2>

                {/* Código Promocional */}
                <div className="space-y-1.5">
                  <label htmlFor="coupon" className="text-xs text-[#CFB28C]/80 block">
                    Código promocional
                  </label>

                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-[#241612] border border-green-800/60 rounded-lg p-2.5 text-xs text-green-400">
                      <div>
                        <span className="font-bold">{appliedCoupon.code}</span>
                        <span className="text-[10px] text-[#CFB28C]/60 block">{appliedCoupon.description}</span>
                      </div>
                      <button
                        type="button"
                        onClick={removeCoupon}
                        className="text-xs text-red-400 hover:text-red-300 font-bold ml-2"
                      >
                        Remover
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        id="coupon"
                        type="text"
                        placeholder="Digite o código promocional..."
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-grow bg-[#140D0A] border border-[#38220F] focus:border-[#D28A4C] text-xs text-[#CFB28C] placeholder-[#CFB28C]/40 px-3 py-2.5 rounded-lg outline-none"
                      />
                      <button
                        type="submit"
                        className="bg-[#D28A4C] hover:bg-[#E89B55] text-[#140D0A] font-bold text-xs px-4 py-2.5 rounded-lg transition-all active:scale-95 shrink-0"
                      >
                        Aplicar
                      </button>
                    </form>
                  )}

                  {couponError && (
                    <span className="text-[11px] text-red-400 block pt-1">
                      {couponError}
                    </span>
                  )}
                </div>

                {/* Linhas de Valores */}
                <div className="pt-4 space-y-2.5 text-xs sm:text-sm">
                  
                  {/* Subtotal */}
                  <div className="flex items-center justify-between">
                    <span className="text-[#CFB28C]/80">Subtotal</span>
                    <span className="font-bold text-[#CFB28C] font-mono">{subtotalEth} ETH</span>
                  </div>

                  {/* Desconto do Lançamento */}
                  <div className="flex items-center justify-between">
                    <span className="text-[#CFB28C]/80">Desconto do lançamento</span>
                    <span className="font-mono text-[#CFB28C]/80">(-) {discountEth}</span>
                  </div>

                  {/* Taxa de Rede */}
                  <div className="space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[#CFB28C]/80">Taxa de rede</span>
                      <span className="font-mono text-[#CFB28C]">{networkFeeEth} ETH</span>
                    </div>
                    <span className="text-[10px] text-[#CFB28C]/50 block text-right">
                      Taxa estimada
                    </span>
                  </div>

                  {/* Linha Divisória */}
                  <div className="border-t border-[#38220F]/60 pt-3 my-2">
                    <div className="flex items-center justify-between text-base">
                      <span className="font-bold text-[#CFB28C]">Total</span>
                      <span className="font-bold text-[#E89B55] text-lg font-mono">
                        {totalEth} ETH
                      </span>
                    </div>
                  </div>

                </div>

                {/* Botões de Ação */}
                <div className="space-y-3 pt-2">
                  <button
                    type="button"
                    onClick={() => navigate({ to: '/pagamento' })}
                    disabled={items.length === 0}
                    className="w-full bg-[#D28A4C] hover:bg-[#E89B55] disabled:opacity-50 disabled:cursor-not-allowed text-[#140D0A] font-bold text-xs sm:text-sm py-3.5 rounded-lg transition-all active:scale-95 shadow-lg shadow-[#D28A4C]/15 flex items-center justify-center gap-2"
                  >
                    <span>Conectar e finalizar</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate({ to: '/' })}
                    className="w-full text-center text-xs text-[#CFB28C]/70 hover:text-[#E89B55] transition-colors py-1 block"
                  >
                    Continuar explorando
                  </button>
                </div>

              </div>

            </div>

          </div>
        </section>

        {/* Seção "Colecionadores também viram" (Print 2 com transição suave e deslizante) */}
        <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-14">
          <div className="border-b border-[#38220F]/60 pb-3 mb-8">
            <h2 className="text-base sm:text-lg font-bold text-[#E89B55] tracking-wide font-mono">
              Colecionadores também viram
            </h2>
          </div>

          {/* Container do Carrossel com transição suave */}
          <div className="overflow-hidden w-full">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeSlide * 100}%)` }}
            >
              {[
                mockNfts.slice(3, 8),
                mockNfts.slice(1, 6),
                mockNfts.slice(6, 11).length >= 3 ? mockNfts.slice(6, 11) : mockNfts.slice(0, 5),
              ].map((slideNfts, slideIdx) => (
                <div
                  key={slideIdx}
                  className="w-full shrink-0 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6"
                >
                  {slideNfts.map((nft) => (
                    <NftCard
                      key={nft.id}
                      nft={nft}
                      onSelect={() => navigate({ to: '/nft/$nftId', params: { nftId: nft.id } })}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Indicador do Carrossel com animação */}
          <div className="flex items-center justify-center space-x-2.5 pt-8">
            {[0, 1, 2].map((idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveSlide(idx)}
                aria-label={`Ir para página ${idx + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  activeSlide === idx
                    ? 'bg-[#E89B55] w-7'
                    : 'bg-[#38220F] w-2.5 hover:bg-[#CFB28C]/50'
                }`}
              />
            ))}
          </div>
        </section>

          {/* Vantagens (W, C, D) + Newsletter (Print 3) */}
          <PerksSection />

        </div>

      </main>

      {/* Footer (Apenas Desktop) */}
      <div className="hidden md:block">
        <Footer />
      </div>

    </div>
  );
};
