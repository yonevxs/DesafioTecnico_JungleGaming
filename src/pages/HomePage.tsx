import React from 'react';
import { useSearch, useNavigate } from '@tanstack/react-router';
import { Header } from '@/components/layout/Header';
import { HeroSection } from '@/components/home/HeroSection';
import { CatalogSection } from '@/components/home/CatalogSection';
import { GenesisBanners } from '@/components/home/GenesisBanners';
import { MintingJournal } from '@/components/home/MintingJournal';
import { PerksSection } from '@/components/home/PerksSection';
import { Footer } from '@/components/layout/Footer';
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
    <div className="min-h-screen bg-[#140D0A] text-[#CFB28C] flex flex-col font-mono selection:bg-[#D28A4C] selection:text-[#140D0A] animate-in fade-in duration-300">
      
      {/* 1. Header com navegação SPA integrada para o carrinho */}
      <Header
        searchQuery={searchParams.search || ''}
        onSearchChange={handleSearchChange}
        onLoginClick={() => alert('Fluxo de login será implementado na tela de autenticação!')}
      />

      <main className="flex-grow">
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
