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
    <section className="relative w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 pt-4 pb-8 sm:pt-8 sm:pb-16 lg:py-20">
      
      {/* 1. VERSÃO MOBILE (Figma Print Mobile / Home) */}
      <div className="md:hidden">
        <div className="relative w-full rounded-[28px] overflow-hidden border border-[#4A2E19] p-5 sm:p-6 text-left shadow-2xl">
          
          {/* Fundo Estilizado Geométrico com Formas Curvas em Camadas (Figma Print Original) */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Base escuro chocolate */}
            <div className="absolute inset-0 bg-[#29160C]" />

            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 360 210"
              fill="none"
              preserveAspectRatio="none"
            >
              {/* Forma curva quente ampla à esquerda/centro */}
              <ellipse
                cx="155"
                cy="105"
                rx="105"
                ry="140"
                transform="rotate(-18 155 105)"
                fill="#553218"
              />
              {/* Camada curva secundária de profundidade */}
              <ellipse
                cx="50"
                cy="125"
                rx="90"
                ry="115"
                fill="#432410"
                opacity="0.9"
              />
              {/* Destaque sutil de brilho âmbar atrás do título */}
              <circle
                cx="110"
                cy="70"
                r="75"
                fill="#6A3D1E"
                opacity="0.35"
              />
              {/* Sombra de contraste atrás da arte do NFT à direita */}
              <ellipse
                cx="305"
                cy="105"
                rx="85"
                ry="115"
                fill="#1C0E07"
                opacity="0.75"
              />
            </svg>
          </div>

          <div className="relative z-10 flex items-center justify-between gap-4">
            {/* Esquerda: Textos Maiores e CTA */}
            <div className="flex-1 space-y-2.5">
              <span className="text-xs sm:text-sm text-[#D28A4C] block font-mono font-medium tracking-wide">
                Bem-vindo à Kurio
              </span>
              <h1 className="text-lg sm:text-xl font-bold text-[#FFF5EA] leading-[1.2] tracking-wide uppercase font-mono">
                SEJA DONO DA<br />CULTURA DIGITAL
              </h1>
              <p className="text-xs sm:text-[13px] text-[#CFB28C]/85 leading-relaxed font-mono max-w-[215px]">
                Descubra NFTs selecionados de criadores do mundo todo.
              </p>
              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleScrollToCatalog}
                  className="text-xs sm:text-sm font-bold text-[#E89B55] hover:text-[#FFAF68] flex items-center gap-1.5 font-mono cursor-pointer transition-colors"
                >
                  <span>EXPLORAR</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* Direita: Imagens sobrepostas idênticas ao Figma */}
            <div className="relative w-32 h-32 shrink-0">
              {/* Imagem Principal (Ape com óculos de sol redondos e jaqueta bomber verde) */}
              <div className="w-28 h-28 sm:w-30 sm:h-30 rounded-[22px] overflow-hidden bg-[#241612] ml-auto border border-[#4E2F18] shadow-xl">
                <img
                  src="/assets/NFT Auth Artwork 9.png"
                  alt="Emerald Ape #042"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Miniatura sobreposta no canto inferior esquerdo (Ape com chapéu bucket e moletom roxo) */}
              <div className="absolute -bottom-1 -left-1.5 w-13 h-13 rounded-2xl overflow-hidden border-2 border-[#24140B] shadow-2xl bg-[#241612]">
                <img
                  src="/assets/NFT Auth Artwork 10.png"
                  alt="Sage Nomad #009"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Pontos de paginação do carrossel */}
          <div className="relative z-10 flex items-center justify-center gap-2 pt-4">
            <span className="w-2 h-2 rounded-full bg-[#E89B55]" />
            <span className="w-2 h-2 rounded-full bg-[#462913]" />
            <span className="w-2 h-2 rounded-full bg-[#462913]" />
          </div>
        </div>
      </div>

      {/* 2. VERSÃO DESKTOP */}
      <div className="hidden md:grid md:grid-cols-12 gap-10 lg:gap-12 items-center">
        
        {/* Left Column: Text & CTA com transição suave */}
        <div className="md:col-span-7 flex flex-col items-start space-y-6">
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
        <div className="md:col-span-5 flex justify-center lg:justify-end">
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
