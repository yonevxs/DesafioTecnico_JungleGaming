import React, { useState, useEffect } from 'react';

const HERO_SLIDES = [
  {
    title1: 'SEJA DONO DO FUTURO',
    title2: 'DA ARTE DIGITAL',
    description: 'Descubra NFTs selecionados de criadores emergentes e consagrados. Colecione arte digital rara, apoie artistas e tenha uma parte da cultura da internet.',
    image: '/assets/NFT Auth Artwork 8.png',
    nftName: 'Emerald Ape #042',
    creator: 'Studio Kurio',
  },
  {
    title1: 'COLECIONE O RARO',
    title2: 'NO METAVERSO',
    description: 'Edições limitadas cunhadas na blockchain com autenticidade comprovada e utilidade real em comunidades exclusivas.',
    image: '/assets/NFT Auth Artwork 9.png',
    nftName: 'Sage Nomad #009',
    creator: 'CyberPrimate',
  },
  {
    title1: 'ESTILO E PODER',
    title2: 'NA REDE ETHEREUM',
    description: 'Obras de arte 3D e fotografia selecionadas para colecionadores exigentes.',
    image: '/assets/NFT Auth Artwork 10.png',
    nftName: 'Neon Vessel #552',
    creator: 'Baron Arts',
  },
];

export const HeroSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Troca automática a cada 6 segundos se o usuário não interagir
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[currentSlide];

  const handleScrollToCatalog = () => {
    const el = document.getElementById('catalogo');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 pt-8 pb-16 lg:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        
        {/* Left Column: Text & CTA com transição suave */}
        <div className="lg:col-span-7 flex flex-col items-start space-y-6">
          <span className="text-xs sm:text-sm font-semibold tracking-wider text-[#CFB28C]/70 uppercase font-mono">
            Bem-vindo à Kurio
          </span>

          <div key={`text-${currentSlide}`} className="space-y-4 animate-in fade-in duration-500">
            <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-bold leading-[1.15] tracking-tight text-[#CFB28C]">
              <span className="block">{slide.title1}</span>
              <span className="block text-[#CFB28C]">{slide.title2}</span>
            </h1>

            <p className="text-sm sm:text-base text-[#CFB28C]/80 max-w-xl leading-relaxed">
              {slide.description}
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={handleScrollToCatalog}
              className="bg-[#D28A4C] hover:bg-[#E89B55] text-[#140D0A] font-bold text-xs sm:text-sm tracking-wider px-8 py-3.5 rounded-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-[#D28A4C]/20 font-mono"
            >
              EXPLORAR
            </button>
          </div>

          {/* Carousel dots */}
          <div className="flex items-center space-x-2 pt-6">
            {HERO_SLIDES.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Ir para o slide ${idx + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  currentSlide === idx
                    ? 'w-7 bg-[#D28A4C]'
                    : 'w-2.5 bg-[#38220F] hover:bg-[#CFB28C]/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right Column: Hero Art Card com transição suave */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <div className="relative w-full max-w-[420px] aspect-[4/4.5] sm:aspect-[4/4.3] rounded-3xl overflow-hidden bg-gradient-to-b from-[#241612] to-[#140D0A] p-2 sm:p-3 border border-[#38220F]/80 shadow-2xl shadow-black/60 group">
            <div
              key={`img-${currentSlide}`}
              className="relative w-full h-full rounded-2xl overflow-hidden bg-[#241612] animate-in fade-in zoom-in-95 duration-500"
            >
              <img
                src={slide.image}
                alt={slide.nftName}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#140D0A]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <div>
                  <p className="text-xs text-[#E89B55] font-semibold">{slide.creator}</p>
                  <p className="text-lg font-bold text-[#CFB28C]">{slide.nftName}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
