import React, { useState } from 'react';
import { ChevronDown, SlidersHorizontal, ChevronRight, AlertCircle } from 'lucide-react';
import { NftItem, NftTab, NftSortOption, NftQueryParams } from '@/types/nft';
import { useNfts } from '@/hooks/useNfts';
import { NftCard } from './NftCard';
import { NftCardSkeleton } from './NftCardSkeleton';
import { FilterSidebar } from './FilterSidebar';

interface CatalogSectionProps {
  queryParams: NftQueryParams;
  onUpdateParams: (newParams: Partial<NftQueryParams>) => void;
  onSelectNft?: (nft: NftItem) => void;
}

export const CatalogSection: React.FC<CatalogSectionProps> = ({
  queryParams,
  onUpdateParams,
  onSelectNft,
}) => {
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const { data, isLoading, isError, refetch } = useNfts(queryParams);

  const activeTab: NftTab = queryParams.tab || 'todos';
  const currentSort: NftSortOption = queryParams.sort || 'recentes';
  const currentPage = queryParams.page || 1;

  const handleTabChange = (tab: NftTab) => {
    onUpdateParams({ tab, page: 1 });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdateParams({ sort: e.target.value as NftSortOption, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    onUpdateParams({ page: newPage });
  };

  return (
    <section id="catalogo" className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-8">
      
      {/* Top Bar: Tabs e Ordenação inline limpa */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 mb-8 gap-4 border-b border-transparent">
        
        {/* Abas */}
        <div className="flex items-center space-x-6 sm:space-x-8 text-xs sm:text-sm font-mono">
          <button
            type="button"
            onClick={() => handleTabChange('todos')}
            className={`pb-1 transition-all ${
              activeTab === 'todos'
                ? 'text-[#E89B55] border-b-2 border-[#E89B55] font-semibold'
                : 'text-[#CFB28C]/80 hover:text-[#CFB28C]'
            }`}
          >
            Todos os NFTs
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('novos')}
            className={`pb-1 transition-all ${
              activeTab === 'novos'
                ? 'text-[#E89B55] border-b-2 border-[#E89B55] font-semibold'
                : 'text-[#CFB28C]/80 hover:text-[#CFB28C]'
            }`}
          >
            Novos lançamentos
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('em-alta')}
            className={`pb-1 transition-all ${
              activeTab === 'em-alta'
                ? 'text-[#E89B55] border-b-2 border-[#E89B55] font-semibold'
                : 'text-[#CFB28C]/80 hover:text-[#CFB28C]'
            }`}
          >
            Em alta
          </button>
        </div>

        {/* Lado direito: Ordenação inline pura (como no print) */}
        <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* Mobile Filter Toggle */}
          <button
            type="button"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden flex items-center gap-1.5 bg-[#241612] text-[#CFB28C] px-3 py-1.5 rounded text-xs font-mono"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#D28A4C]" />
            <span>Filtros</span>
          </button>

          {/* Ordenar por: Listados recentemente */}
          <div className="relative flex items-center text-xs font-mono text-[#CFB28C]">
            <span className="whitespace-nowrap">Ordenar por:</span>
            <div className="relative inline-flex items-center ml-1">
              <select
                id="sort-select"
                value={currentSort}
                onChange={handleSortChange}
                className="appearance-none bg-transparent hover:text-[#E89B55] text-xs text-[#CFB28C] pr-4 outline-none cursor-pointer font-mono"
              >
                <option value="recentes" className="bg-[#140D0A] text-[#CFB28C]">Listados recentemente</option>
                <option value="preco-menor" className="bg-[#140D0A] text-[#CFB28C]">Menor preço</option>
                <option value="preco-maior" className="bg-[#140D0A] text-[#CFB28C]">Maior preço</option>
                <option value="mais-populares" className="bg-[#140D0A] text-[#CFB28C]">Mais populares</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#CFB28C] pointer-events-none absolute right-0" />
            </div>
          </div>
        </div>

      </div>

      {/* Main Grid: Sidebar + NFTs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        
        {/* Sidebar Esquerda (Sem moldura externa, idêntica ao Figma) */}
        <div className="hidden lg:block lg:col-span-3">
          <FilterSidebar
            selectedCategory={queryParams.category}
            onSelectCategory={(cat) => onUpdateParams({ category: cat, page: 1 })}
            selectedNetwork={queryParams.network}
            onSelectNetwork={(net) => onUpdateParams({ network: net, page: 1 })}
            minPrice={queryParams.minPrice}
            maxPrice={queryParams.maxPrice}
            onApplyPriceRange={(min, max) => onUpdateParams({ minPrice: min, maxPrice: max, page: 1 })}
            categoryCounts={data?.categoryCounts}
            networkCounts={data?.networkCounts}
            onSelectFeatured={() => {
              const featured = data?.items?.find(i => i.id === 'sage-nomad-009');
              if (featured) onSelectNft?.(featured);
            }}
          />
        </div>

        {/* Mobile Filter Drawer */}
        {mobileFilterOpen && (
          <div className="lg:hidden col-span-1 bg-[#241612] p-5 rounded-2xl border border-[#38220F] mb-4">
            <div className="flex items-center justify-between mb-4">
              <span className="font-bold text-[#CFB28C]">Filtros</span>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="text-xs text-[#E89B55]"
              >
                ✕ Fechar
              </button>
            </div>
            <FilterSidebar
              selectedCategory={queryParams.category}
              onSelectCategory={(cat) => {
                onUpdateParams({ category: cat, page: 1 });
                setMobileFilterOpen(false);
              }}
              selectedNetwork={queryParams.network}
              onSelectNetwork={(net) => {
                onUpdateParams({ network: net, page: 1 });
                setMobileFilterOpen(false);
              }}
              minPrice={queryParams.minPrice}
              maxPrice={queryParams.maxPrice}
              onApplyPriceRange={(min, max) => {
                onUpdateParams({ minPrice: min, maxPrice: max, page: 1 });
                setMobileFilterOpen(false);
              }}
              categoryCounts={data?.categoryCounts}
              networkCounts={data?.networkCounts}
            />
          </div>
        )}

        {/* Grid de NFTs */}
        <div className="lg:col-span-9 flex flex-col justify-between">
          
          {/* Error State */}
          {isError && (
            <div className="p-8 rounded-2xl bg-[#241612] text-center my-6">
              <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
              <p className="text-[#CFB28C] font-semibold mb-2">Erro ao carregar os NFTs</p>
              <button
                type="button"
                onClick={() => refetch()}
                className="bg-[#D28A4C] text-[#140D0A] font-bold text-xs px-4 py-2 rounded"
              >
                Tentar novamente
              </button>
            </div>
          )}

          {/* Skeletons Shimmer */}
          {isLoading && (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
              {Array.from({ length: 6 }).map((_, idx) => (
                <NftCardSkeleton key={idx} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !isError && data?.items?.length === 0 && (
            <div className="p-12 rounded-2xl bg-[#241612]/50 text-center my-6">
              <p className="text-base text-[#CFB28C] font-bold mb-2">Nenhum NFT encontrado</p>
              <p className="text-xs text-[#CFB28C]/60 mb-5">
                Tente ajustar os filtros selecionados para encontrar itens disponíveis.
              </p>
              <button
                type="button"
                onClick={() => onUpdateParams({ category: undefined, network: undefined, search: undefined, minPrice: undefined, maxPrice: undefined, page: 1 })}
                className="bg-[#D28A4C] hover:bg-[#E89B55] text-[#140D0A] font-bold text-xs px-4 py-2 rounded transition-all"
              >
                Limpar filtros
              </button>
            </div>
          )}

          {/* Cards Grid idêntico ao Figma (2 colunas no mobile) */}
          {!isLoading && !isError && data && data.items.length > 0 && (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
              {data.items.map((nft) => (
                <NftCard key={nft.id} nft={nft} onSelect={onSelectNft} />
              ))}
            </div>
          )}

          {/* Paginação inferior direita idêntica ao print */}
          {!isLoading && data && data.totalPages > 1 && (
            <div className="flex items-center justify-end space-x-1.5 pt-12 pb-2">
              {Array.from({ length: data.totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                const isActive = pageNum === currentPage;

                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-7 h-7 rounded text-xs font-mono font-bold transition-all flex items-center justify-center ${
                      isActive
                        ? 'bg-[#D28A4C] text-[#140D0A]'
                        : 'bg-[#241612] hover:bg-[#38220F] text-[#CFB28C]'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {currentPage < data.totalPages && (
                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="w-7 h-7 rounded bg-[#241612] hover:bg-[#38220F] text-[#CFB28C] flex items-center justify-center text-xs font-mono transition-all"
                  aria-label="Próxima página"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
