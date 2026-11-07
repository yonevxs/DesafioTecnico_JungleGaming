import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface NftGalleryProps {
  mainImage: string;
  nftName: string;
}

export const NftGallery: React.FC<NftGalleryProps> = ({ mainImage, nftName }) => {
  const safeImage = mainImage || '/assets/NFT Auth Artwork 8.png';
  const [selectedImage, setSelectedImage] = useState(safeImage);
  const [zoomModalOpen, setZoomModalOpen] = useState(false);

  useEffect(() => {
    if (mainImage) {
      setSelectedImage(mainImage);
    }
  }, [mainImage]);

  // 4 miniaturas para a galeria
  const thumbnails = [
    safeImage,
    safeImage,
    safeImage,
    safeImage,
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 items-start">
      
      {/* Coluna Vertical de Miniaturas (à esquerda) */}
      <div className="flex sm:flex-col gap-3 order-2 sm:order-1 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0">
        {thumbnails.map((thumb, idx) => {
          const isSelected = selectedImage === thumb && idx === 0;

          return (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedImage(thumb)}
              aria-label={`Ver miniatura ${idx + 1}`}
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-[#241612] border transition-all shrink-0 ${
                isSelected
                  ? 'border-[#E89B55] ring-2 ring-[#E89B55]/30'
                  : 'border-[#38220F] hover:border-[#CFB28C]/50 opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={thumb}
                alt={`${nftName || 'NFT'} thumbnail ${idx + 1}`}
                className="w-full h-full object-cover object-center"
              />
            </button>
          );
        })}
      </div>

      {/* Imagem Principal em Destaque (com botão de zoom no topo direito) */}
      <div className="relative flex-grow aspect-square w-full max-w-[500px] rounded-3xl overflow-hidden bg-[#241612] p-3 sm:p-4 border border-[#38220F]/60 shadow-2xl order-1 sm:order-2 group">
        <div className="relative w-full h-full rounded-2xl overflow-hidden bg-[#140D0A]">
          <img
            src={selectedImage}
            alt={nftName || 'NFT'}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />

          {/* Botão de Lupa / Zoom no canto superior direito */}
          <button
            type="button"
            onClick={() => setZoomModalOpen(true)}
            aria-label="Ampliar imagem do NFT"
            className="absolute top-3 right-3 p-2.5 rounded-full bg-[#140D0A]/70 text-[#CFB28C] hover:text-[#E89B55] hover:bg-[#140D0A] backdrop-blur-md transition-all shadow-lg"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Modal de Zoom em Alta Resolução */}
      {zoomModalOpen && (
        <div
          onClick={() => setZoomModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200 cursor-zoom-out"
        >
          <div className="relative max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden bg-[#241612] p-4 border border-[#38220F]">
            <button
              onClick={() => setZoomModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-[#140D0A]/80 text-[#CFB28C] hover:text-[#E89B55]"
              aria-label="Fechar zoom"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={selectedImage}
              alt={nftName}
              className="w-full h-auto max-h-[80vh] object-contain rounded-2xl"
            />
          </div>
        </div>
      )}

    </div>
  );
};
