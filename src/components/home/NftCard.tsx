import React from 'react';
import { NftItem } from '@/types/nft';

interface NftCardProps {
  nft: NftItem;
  onSelect?: (nft: NftItem) => void;
}

export const NftCard: React.FC<NftCardProps> = ({ nft, onSelect }) => {
  return (
    <div
      onClick={() => onSelect?.(nft)}
      className="group flex flex-col cursor-pointer transition-transform duration-300 hover:-translate-y-1"
    >
      {/* Imagem do NFT com cantos arredondados, fundo suave da arte */}
      <div className="relative aspect-square w-full rounded-[22px] overflow-hidden bg-[#241612]">
        <img
          src={nft.image}
          alt={`${nft.name} ${nft.tokenId}`}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
      </div>

      {/* Nome e Token ID */}
      <div className="pt-3 pb-1 flex flex-col space-y-1 text-left">
        <h3 className="text-sm sm:text-base font-normal text-[#CFB28C] tracking-wide truncate">
          {nft.name} {nft.tokenId}
        </h3>

        {/* Preço em ETH */}
        <div className="flex items-center space-x-2 font-mono">
          <span className="text-sm sm:text-base font-bold text-[#E89B55]">
            {nft.priceEth} ETH
          </span>

          {nft.originalPriceEth && (
            <span className="text-xs sm:text-sm text-[#CFB28C]/60 line-through">
              {nft.originalPriceEth} ETH
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
