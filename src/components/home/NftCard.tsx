import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { NftItem } from '@/types/nft';

interface NftCardProps {
  nft: NftItem;
  onSelect?: (nft: NftItem) => void;
}

export const NftCard: React.FC<NftCardProps> = ({ nft, onSelect }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const isRare =
    nft.rarity === 'raro' ||
    nft.rarity === 'lendario' ||
    nft.tokenId === '#0042' ||
    nft.id.includes('ape-042') ||
    nft.id.includes('vessel');

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <div
      onClick={() => onSelect?.(nft)}
      className="group flex flex-col cursor-pointer transition-transform duration-300 hover:-translate-y-1 select-none"
    >
      {/* Imagem do NFT com cantos arredondados, fundo suave da arte */}
      <div className="relative aspect-square w-full rounded-2xl sm:rounded-[22px] overflow-hidden bg-[#241612]">
        <img
          src={nft.image}
          alt={`${nft.name} ${nft.tokenId}`}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Badge de Raridade (como no Figma print) */}
        {isRare && (
          <div className="absolute top-2 left-2 z-10 bg-[#D28A4C] text-[#140D0A] font-bold text-[9px] sm:text-[10px] px-2 py-0.5 rounded shadow-md tracking-wider uppercase font-mono">
            RARO
          </div>
        )}

        {/* Botão de Favorito no Canto Superior Direito (Figma Mobile Print) */}
        <button
          type="button"
          onClick={handleFavoriteClick}
          className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-[#140D0A]/60 backdrop-blur-md text-[#CFB28C] hover:text-[#E89B55] hover:bg-[#140D0A]/90 transition-all active:scale-90"
          aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          <Heart
            className={`w-3.5 h-3.5 transition-colors ${
              isFavorite ? 'fill-[#E89B55] text-[#E89B55]' : 'text-[#CFB28C]/80'
            }`}
          />
        </button>
      </div>

      {/* Nome e Token ID */}
      <div className="pt-2 sm:pt-3 pb-1 flex flex-col space-y-0.5 sm:space-y-1 text-left">
        <h3 className="text-xs sm:text-base font-normal text-[#CFB28C] tracking-wide truncate font-mono">
          {nft.name} {nft.tokenId}
        </h3>

        {/* Preço em ETH */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 font-mono">
          <span className="text-xs sm:text-base font-bold text-[#E89B55]">
            {nft.priceEth} ETH
          </span>

          {nft.originalPriceEth && (
            <span className="text-[10px] sm:text-xs text-[#CFB28C]/60 line-through">
              {nft.originalPriceEth} ETH
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

