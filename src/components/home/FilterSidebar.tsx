import React, { useState, useEffect } from 'react';
import { NftCategory, BlockchainNetwork } from '@/types/nft';

interface FilterSidebarProps {
  selectedCategory?: string;
  onSelectCategory: (cat: string | undefined) => void;
  selectedNetwork?: string;
  onSelectNetwork: (net: string | undefined) => void;
  minPrice?: string;
  maxPrice?: string;
  onApplyPriceRange: (min?: string, max?: string) => void;
  categoryCounts?: Record<string, number>;
  networkCounts?: Record<string, number>;
  onSelectFeatured?: () => void;
}

const CATEGORIES: NftCategory[] = [
  'Arte digital',
  'Fotografia',
  'Música',
  'Arte 3D',
  'Colecionáveis',
  'Generativa',
  'Jogos',
  'Assinaturas',
  'Utilidade',
];

const NETWORKS: BlockchainNetwork[] = ['Ethereum', 'Polygon', 'Solana'];

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedNetwork,
  onSelectNetwork,
  minPrice = '0.02',
  maxPrice = '12.30',
  onApplyPriceRange,
  categoryCounts = {},
  networkCounts = {},
  onSelectFeatured,
}) => {
  const [sliderMax, setSliderMax] = useState<number>(parseFloat(maxPrice) || 12.3);

  useEffect(() => {
    if (maxPrice) {
      setSliderMax(parseFloat(maxPrice) || 12.3);
    }
  }, [maxPrice]);

  const handleApply = (e: React.MouseEvent) => {
    e.preventDefault();
    onApplyPriceRange('0.02', sliderMax.toFixed(2));
  };

  return (
    <aside className="w-full flex flex-col space-y-6 text-xs sm:text-sm font-mono text-[#CFB28C]">
      
      {/* Bloco 1: Filtros com fundo #241612 */}
      <div className="bg-[#241612] rounded-2xl p-5 sm:p-6 flex flex-col space-y-6 shadow-md">
        
        {/* Coleções */}
        <div>
          <h3 className="text-sm sm:text-base font-bold text-[#CFB28C] mb-3">
            Coleções
          </h3>
          <ul className="space-y-2">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory?.toLowerCase() === cat.toLowerCase();
              const count = categoryCounts[cat] ?? 0;

              return (
                <li key={cat}>
                  <button
                    type="button"
                    onClick={() => onSelectCategory(isSelected ? undefined : cat)}
                    className={`w-full flex items-center justify-between text-left transition-colors py-0.5 ${
                      isSelected
                        ? 'text-[#E89B55] font-bold'
                        : 'text-[#CFB28C]/80 hover:text-[#E89B55]'
                    }`}
                  >
                    <span>{cat}</span>
                    <span className="text-[#CFB28C]/60 text-xs font-mono">
                      ({count})
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Faixa de preço */}
        <div>
          <h3 className="text-sm sm:text-base font-bold text-[#CFB28C] mb-2.5">
            Faixa de preço
          </h3>
          
          <div className="relative py-2 flex items-center">
            <input
              type="range"
              min="0.02"
              max="15.0"
              step="0.1"
              value={sliderMax}
              onChange={(e) => setSliderMax(parseFloat(e.target.value))}
              className="w-full h-1 bg-[#38220F] rounded-lg appearance-none cursor-pointer accent-[#D28A4C]"
            />
          </div>

          <p className="text-xs text-[#CFB28C]/80 mt-1 mb-2.5">
            Preço: 0,02 - {sliderMax.toFixed(2).replace('.', ',')} ETH
          </p>

          <button
            type="button"
            onClick={handleApply}
            className="bg-[#D28A4C] hover:bg-[#E89B55] text-[#140D0A] font-bold text-xs px-5 py-1.5 rounded transition-all active:scale-95 shadow-sm"
          >
            Aplicar
          </button>
        </div>

        {/* Rede */}
        <div>
          <h3 className="text-sm sm:text-base font-bold text-[#CFB28C] mb-2.5">
            Rede
          </h3>
          <ul className="space-y-2">
            {NETWORKS.map((net) => {
              const isSelected = selectedNetwork?.toLowerCase() === net.toLowerCase();
              const count = networkCounts[net] ?? 0;

              return (
                <li key={net}>
                  <button
                    type="button"
                    onClick={() => onSelectNetwork(isSelected ? undefined : net)}
                    className={`w-full flex items-center justify-between text-left transition-colors py-0.5 ${
                      isSelected
                        ? 'text-[#E89B55] font-bold'
                        : 'text-[#CFB28C]/80 hover:text-[#E89B55]'
                    }`}
                  >
                    <span>{net}</span>
                    <span className="text-[#CFB28C]/60 text-xs font-mono">
                      ({count})
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

      </div>

      {/* Bloco 2: NFT em Destaque / Oferta Limitada com fundo #241612 */}
      <div className="bg-[#241612] rounded-2xl p-5 sm:p-6 flex flex-col shadow-md">
        <div className="text-left mb-3 leading-tight">
          <span className="block text-xs font-bold tracking-wider text-[#D28A4C] uppercase">
            NFT EM DESTAQUE
          </span>
          <span className="block text-xs sm:text-sm font-bold text-[#CFB28C] tracking-wide uppercase">
            OFERTA LIMITADA
          </span>
        </div>

        <div
          onClick={onSelectFeatured}
          className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#140D0A] cursor-pointer group shadow-lg"
        >
          <img
            src="/assets/NFT Auth Artwork 9.png"
            alt="Sage Nomad Oferta Limitada"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>

    </aside>
  );
};
