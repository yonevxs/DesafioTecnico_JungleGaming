import React from 'react';
import { useSearch, useNavigate } from '@tanstack/react-router';
import { Header } from '@/components/layout/Header';
import { HeroSection } from '@/components/home/HeroSection';
import { CatalogSection } from '@/components/home/CatalogSection';
import { GenesisBanners } from '@/components/home/GenesisBanners';
import { MintingJournal } from '@/components/home/MintingJournal';
import { PerksSection } from '@/components/home/PerksSection';
import { Footer } from '@/components/layout/Footer';
import { Search, SlidersHorizontal } from 'lucide-react';
import { NftQueryParams } from '@/types/nft';

export const HomePage: React.FC = () => {
  const searchParams = useSearch({ from: '/' });
  const navigate = useNavigate();

  // Atualiza os parâmetros na URL mantendo o scroll exatamente onde está (resetScroll: false)
  const handleUpdateParams = (newParams: Partial<NftQueryParams>) => {
    navigate({
      to: '/',
      search: (prev) => ({
        ...prev,
        ...newParams,
      }),
      replace: true,
      resetScroll: false,
    });
  };

  const handleSearchChange = (val: string) => {
    handleUpdateParams({ search: val || undefined, page: 1 });
  };

  return (
    <div className="min-h-screen bg-[#140D0A] text-[#CFB28C] flex flex-col font-mono selection:bg-[#D28A4C] selection:text-[#140D0A] pb-20 md:pb-0 animate-in fade-in duration-300">
      
      {/* 1. Header com navegação SPA integrada para o carrinho */}
      <Header
        searchQuery={searchParams.search || ''}
        onSearchChange={handleSearchChange}
      />

      <main className="flex-grow">
        {/* Mobile Search Bar + Filter Button (Figma Print Mobile / Home) */}
        <div className="md:hidden px-4 pt-3 pb-1 flex items-center gap-2.5">
          <div className="flex-1 relative flex items-center bg-[#241612] border border-[#38220F] rounded-2xl px-3.5 py-2.5 shadow-sm">
            <Search className="w-4 h-4 text-[#CFB28C]/60 mr-2.5 shrink-0" />
            <input
              type="text"
              placeholder="Explorar coleções"
              value={searchParams.search || ''}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="bg-transparent text-xs text-[#CFB28C] placeholder-[#CFB28C]/40 outline-none w-full font-mono"
            />
          </div>
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('catalogo');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-10 h-10 rounded-2xl bg-[#D28A4C] hover:bg-[#E89B55] text-[#140D0A] flex items-center justify-center shrink-0 shadow-md shadow-[#D28A4C]/15 cursor-pointer active:scale-95 transition-all"
            aria-label="Filtrar coleções"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#140D0A]" />
          </button>
        </div>

        {/* 2. Hero Section (Print 1) */}
        <HeroSection />

        {/* 3. Catalog Section com navegação para a tela de Detalhes do NFT ao clicar */}
        <CatalogSection
          queryParams={searchParams}
          onUpdateParams={handleUpdateParams}
          onSelectNft={(nft) => {
            navigate({ to: '/nft/$nftId', params: { nftId: nft.id } });
          }}
        />

        {/* 4. Genesis Banners (Print 3) */}
        <GenesisBanners
          onExploreClick={() => {
            const el = document.getElementById('catalogo');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* 5. Diário da Cunhagem - Articles (Print 4) */}
        <MintingJournal />

        {/* 6. Perks (W, C, D) & Newsletter (Print 5) */}
        <PerksSection />
      </main>

      {/* 7. Footer (Print 5) */}
      <Footer />

    </div>
  );
};
