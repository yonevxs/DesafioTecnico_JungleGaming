import React, { useState } from 'react';
import { Star, Heart, Minus, Plus, Mail } from 'lucide-react';
import { NftItem } from '@/types/nft';
import { useCart } from '@/hooks/useCart';
import { useToggleNftLike } from '@/hooks/useNfts';

interface NftInfoPanelProps {
  nft: NftItem;
  onBuySuccess?: () => void;
}

const EDITIONS = [
  { id: '1/1', label: '1/1', maxAvailable: 1, available: 0, soldOut: true },
  { id: '1/10', label: '1/10', maxAvailable: 10, available: 2, soldOut: false },
  { id: '1/50', label: '1/50', maxAvailable: 50, available: 8, soldOut: false },
  { id: 'ABERTA', label: 'ABERTA', maxAvailable: 999, available: 999, soldOut: false },
];

export const NftInfoPanel: React.FC<NftInfoPanelProps> = ({ nft, onBuySuccess }) => {
  const { addItem } = useCart();
  const toggleLike = useToggleNftLike();

  const [selectedEdition, setSelectedEdition] = useState('1/50');
  const [quantity, setQuantity] = useState(1);
  const [copiedShare, setCopiedShare] = useState(false);

  const currentEditionObj = EDITIONS.find(e => e.id === selectedEdition);
  const maxAllowed = currentEditionObj ? Math.min(currentEditionObj.available, 10) : 1;
  const isSoldOut = currentEditionObj?.soldOut || false;

  const handleQuantityMinus = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleQuantityPlus = () => {
    if (quantity < maxAllowed) setQuantity(quantity + 1);
  };

  const handleBuy = () => {
    if (isSoldOut) return;
    addItem(nft, quantity);
    onBuySuccess?.();
  };

  const handleToggleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (nft?.id) {
      toggleLike.mutate(nft.id);
    }
  };

  const handleShare = (channel: 'copy' | 'twitter' | 'email') => {
    const url = window.location.href;
    const text = `Confira a obra ${nft?.name || 'NFT'} na Kurio!`;

    if (channel === 'copy') {
      navigator.clipboard?.writeText(url);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    } else if (channel === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
    } else if (channel === 'email') {
      window.location.href = `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(url)}`;
    }
  };

  return (
    <div className="flex flex-col space-y-6 text-[#CFB28C] font-mono">
      
      {/* 1. Título */}
      <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#CFB28C]">
        {nft?.name || 'Emerald Ape'} {nft?.tokenId || '#042'}
      </h1>

      {/* 2. Preço e Avaliações */}
      <div className="flex flex-wrap items-center gap-4 sm:gap-6">
        <span className="text-2xl sm:text-3xl font-bold text-[#E89B55]">
          {nft?.priceEth || '1.19'} ETH
        </span>

        {/* 5 Estrelas + Avaliações */}
        <div className="flex items-center gap-1.5 text-xs text-[#CFB28C]/80">
          <div className="flex text-[#E89B55]">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-[#E89B55] stroke-[#E89B55]" />
            ))}
          </div>
          <span>19 avaliações de colecionadores</span>
        </div>
      </div>

      {/* 3. Sobre este NFT */}
      <div className="space-y-1.5">
        <h3 className="text-xs sm:text-sm font-bold text-[#CFB28C]">
          Sobre este NFT:
        </h3>
        <p className="text-xs sm:text-sm text-[#CFB28C]/80 leading-relaxed max-w-xl">
          {nft?.description || 'Um colecionável digital finalizado à mão da coleção Kurio Editions, verificado na Ethereum, com arte desbloqueável e acesso para colecionadores.'}
        </p>
      </div>

      {/* 4. Seleção de Edição */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs sm:text-sm font-bold text-[#CFB28C]">
            Edição:
          </h3>
          {isSoldOut && (
            <span className="text-xs text-red-400 font-semibold">
              Edição esgotada
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2.5">
          {EDITIONS.map((ed) => {
            const isSelected = selectedEdition === ed.id;

            return (
              <button
                key={ed.id}
                type="button"
                onClick={() => {
                  setSelectedEdition(ed.id);
                  setQuantity(1);
                }}
                className={`text-xs px-3.5 py-1.5 rounded-full border transition-all ${
                  isSelected
                    ? 'border-[#D28A4C] bg-[#D28A4C]/10 text-[#E89B55] font-bold shadow-sm'
                    : ed.soldOut
                    ? 'border-[#38220F] text-[#CFB28C]/40 line-through cursor-not-allowed'
                    : 'border-[#38220F] text-[#CFB28C]/80 hover:border-[#CFB28C]'
                }`}
              >
                {ed.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Stepper de Quantidade & Botões COMPRAR e Favoritar */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
        
        {/* Stepper (- 1 +) */}
        <div className="flex items-center bg-[#241612] border border-[#38220F] rounded-lg px-2 py-1 gap-3">
          <button
            type="button"
            onClick={handleQuantityMinus}
            disabled={quantity <= 1 || isSoldOut}
            aria-label="Diminuir quantidade"
            className="w-7 h-7 rounded-full bg-[#D28A4C] hover:bg-[#E89B55] disabled:opacity-40 disabled:hover:bg-[#D28A4C] text-[#140D0A] flex items-center justify-center transition-all"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          <span className="text-sm font-bold w-4 text-center text-[#CFB28C]">
            {quantity}
          </span>

          <button
            type="button"
            onClick={handleQuantityPlus}
            disabled={quantity >= maxAllowed || isSoldOut}
            aria-label="Aumentar quantidade"
            className="w-7 h-7 rounded-full bg-[#D28A4C] hover:bg-[#E89B55] disabled:opacity-40 disabled:hover:bg-[#D28A4C] text-[#140D0A] flex items-center justify-center transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Botão COMPRAR */}
        <button
          type="button"
          onClick={handleBuy}
          disabled={isSoldOut}
          className="bg-[#D28A4C] hover:bg-[#E89B55] disabled:opacity-50 disabled:cursor-not-allowed text-[#140D0A] font-bold text-xs sm:text-sm px-8 py-3 rounded-lg transition-all active:scale-95 shadow-lg shadow-[#D28A4C]/15"
        >
          {isSoldOut ? 'ESGOTADO' : 'COMPRAR'}
        </button>

        {/* Botão Favoritar com suporte a toggle e loading status */}
        <button
          type="button"
          onClick={handleToggleLike}
          aria-label={nft?.isLiked ? 'Desfavoritar NFT' : 'Favoritar NFT'}
          className={`flex items-center gap-2 border px-5 py-3 rounded-lg text-xs sm:text-sm font-bold transition-all active:scale-95 ${
            nft?.isLiked
              ? 'border-[#E89B55] bg-[#E89B55]/15 text-[#E89B55]'
              : 'border-[#38220F] bg-[#241612]/60 hover:border-[#D28A4C] text-[#CFB28C]'
          }`}
        >
          <Heart className={`w-4 h-4 transition-transform ${nft?.isLiked ? 'fill-current scale-110' : ''}`} />
          <span>{nft?.isLiked ? 'Favoritado' : 'Favoritar'}</span>
        </button>

      </div>

      {/* 6. Metadados do NFT */}
      <div className="pt-4 border-t border-[#38220F]/60 space-y-2 text-xs text-[#CFB28C]/80">
        <p>
          <span className="text-[#CFB28C]/60">ID do token:</span>{' '}
          <span className="text-[#CFB28C] font-semibold">{nft?.tokenId || '#0042'}</span>
        </p>
        <p>
          <span className="text-[#CFB28C]/60">Coleção:</span>{' '}
          <span className="text-[#CFB28C] font-semibold">Kurio Apes</span>
        </p>
        <p>
          <span className="text-[#CFB28C]/60">Atributos:</span>{' '}
          <span className="text-[#CFB28C] font-semibold">Óculos, Esmeralda, Raro</span>
        </p>
        
        {/* Compartilhar este NFT com o símbolo oficial do X (Twitter) */}
        <div className="flex items-center gap-3 pt-2">
          <span className="text-[#CFB28C]/60">Compartilhar este NFT:</span>
          <div className="flex items-center gap-3">
            {/* LinkedIn */}
            <button
              type="button"
              onClick={() => handleShare('copy')}
              title="LinkedIn"
              className="font-bold text-xs hover:text-[#E89B55] transition-colors"
            >
              in
            </button>

            {/* Email */}
            <button
              type="button"
              onClick={() => handleShare('email')}
              title="E-mail"
              className="hover:text-[#E89B55] transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
            </button>

            {/* Símbolo Oficial do X (antigo Twitter) */}
            <button
              type="button"
              onClick={() => handleShare('twitter')}
              title="Compartilhar no X"
              className="hover:text-[#E89B55] transition-colors flex items-center justify-center"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </button>

            {copiedShare && (
              <span className="text-[10px] text-green-400 font-bold ml-1">Link copiado!</span>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};
