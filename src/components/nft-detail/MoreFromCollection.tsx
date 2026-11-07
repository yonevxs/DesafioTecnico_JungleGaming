import React, { useState } from 'react';
import { NftCard } from '@/components/home/NftCard';
import { mockNfts } from '@/mocks/data/nfts';
import { NftItem } from '@/types/nft';

interface MoreFromCollectionProps {
  currentNftId: string;
  onSelectNft: (nft: NftItem) => void;
}

export const MoreFromCollection: React.FC<MoreFromCollectionProps> = ({
  currentNftId,
  onSelectNft,
}) => {
  const [activeSlide, setActiveSlide] = useState(0);

  // Divide o catálogo em 3 conjuntos de 5 itens para o carrossel
  const otherNfts = mockNfts.filter(i => i.id !== currentNftId);
  const slides = [
    otherNfts.slice(0, 5),
    otherNfts.slice(4, 9),
    otherNfts.slice(8, 13).length >= 3 ? otherNfts.slice(8, 13) : otherNfts.slice(2, 7),
  ];

  return (
    <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-12">
      
      {/* Título com linha horizontal */}
      <div className="border-b border-[#38220F]/60 pb-3 mb-8">
        <h2 className="text-base sm:text-lg font-bold text-[#E89B55] tracking-wide font-mono">
          Mais desta coleção
        </h2>
      </div>

      {/* Container do Carrossel com transição suave */}
      <div className="overflow-hidden w-full">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${activeSlide * 100}%)` }}
        >
          {slides.map((slideItems, slideIdx) => (
            <div
              key={slideIdx}
              className="w-full shrink-0 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6"
            >
              {slideItems.map((nft) => (
                <NftCard
                  key={nft.id}
                  nft={nft}
                  onSelect={() => onSelectNft(nft)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Indicador de 3 bolinhas (carrossel interativo) */}
      <div className="flex items-center justify-center space-x-2.5 pt-8">
        {slides.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setActiveSlide(idx)}
            aria-label={`Ir para a página de recomendados ${idx + 1}`}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              activeSlide === idx
                ? 'bg-[#E89B55] w-7'
                : 'bg-[#38220F] w-2.5 hover:bg-[#CFB28C]/50'
            }`}
          />
        ))}
      </div>

    </section>
  );
};
