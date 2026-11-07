import React from 'react';
import { ArrowRight } from 'lucide-react';

interface GenesisBannersProps {
  onExploreClick?: () => void;
}

export const GenesisBanners: React.FC<GenesisBannersProps> = ({ onExploreClick }) => {
  return (
    <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        
        {/* Banner 1: Lançamentos Gênesis */}
        <div className="flex flex-col sm:flex-row items-center bg-[#241612] border border-[#38220F] rounded-2xl overflow-hidden p-4 sm:p-5 gap-5 group hover:border-[#D28A4C]/60 transition-all shadow-lg">
          <div className="w-full sm:w-44 h-44 shrink-0 rounded-xl overflow-hidden bg-[#140D0A]">
            <img
              src="/assets/NFT Auth Artwork 8.png"
              alt="Lançamentos gênesis de edição limitada"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="flex flex-col items-start justify-between h-full space-y-3">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#CFB28C] leading-snug">
                Lançamentos gênesis de edição limitada
              </h3>
              <p className="text-xs text-[#CFB28C]/70 mt-2 leading-relaxed">
                Colecione edições escassas diretamente dos criadores antes da revelação pública.
              </p>
            </div>
            <button
              onClick={onExploreClick}
              className="inline-flex items-center gap-2 bg-[#D28A4C] hover:bg-[#E89B55] text-[#140D0A] font-bold text-xs px-4 py-2 rounded-lg transition-all active:scale-95 shadow-md shadow-[#D28A4C]/10"
            >
              <span>Explorar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Banner 2: Arte digital selecionada */}
        <div className="flex flex-col sm:flex-row items-center bg-[#241612] border border-[#38220F] rounded-2xl overflow-hidden p-4 sm:p-5 gap-5 group hover:border-[#D28A4C]/60 transition-all shadow-lg">
          <div className="w-full sm:w-44 h-44 shrink-0 rounded-xl overflow-hidden bg-[#140D0A]">
            <img
              src="/assets/NFT Auth Artwork 10.png"
              alt="Arte digital selecionada e muito mais"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="flex flex-col items-start justify-between h-full space-y-3">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#CFB28C] leading-snug">
                Arte digital selecionada e muito mais
              </h3>
              <p className="text-xs text-[#CFB28C]/70 mt-2 leading-relaxed">
                Explore novos artistas, coleções verificadas e obras digitais que definem a nova era.
              </p>
            </div>
            <button
              onClick={onExploreClick}
              className="inline-flex items-center gap-2 bg-[#D28A4C] hover:bg-[#E89B55] text-[#140D0A] font-bold text-xs px-4 py-2 rounded-lg transition-all active:scale-95 shadow-md shadow-[#D28A4C]/10"
            >
              <span>Explorar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
