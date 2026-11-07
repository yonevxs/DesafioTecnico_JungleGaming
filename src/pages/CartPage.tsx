import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PerksSection } from '@/components/home/PerksSection';
import { NftCard } from '@/components/home/NftCard';
import { useCart } from '@/hooks/useCart';
import { mockNfts } from '@/mocks/data/nfts';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

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
      
      {/* Header com destaque no Mercado */}
      <Header
        onLoginClick={() => alert('Fluxo de login será implementado na tela de autenticação!')}
      />

      <main className="flex-grow">
        
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

      </main>

      {/* Footer (Print 3) */}
      <Footer />

    </div>
  );
};
