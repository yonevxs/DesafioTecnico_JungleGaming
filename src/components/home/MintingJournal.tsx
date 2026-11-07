import React from 'react';
import { ArrowRight } from 'lucide-react';

const ARTICLES = [
  {
    id: 1,
    image: '/assets/NFT Auth Artwork 10.png',
    date: '12 de setembro',
    readTime: 'Leitura de 6 min',
    title: 'Como funciona a propriedade de NFTs',
    description: 'Aprenda a colecionar, negociar e verificar ativos digitais com segurança.',
  },
  {
    id: 2,
    image: '/assets/NFT Auth Artwork 8.png',
    date: '13 de setembro',
    readTime: 'Leitura de 2 min',
    title: '10 artistas digitais para acompanhar',
    description: 'Conheça criadores que moldam a cultura digital em todo o mundo.',
  },
  {
    id: 3,
    image: '/assets/NFT Auth Artwork 9.png',
    date: '15 de setembro',
    readTime: 'Leitura de 3 min',
    title: 'Raridade, atributos e procedência',
    description: 'Entenda raridade, procedência, direitos autorais e utilidade no ecossistema.',
  },
  {
    id: 4,
    image: '/assets/NFT Auth Artwork 11.png',
    date: '15 de setembro',
    readTime: 'Leitura de 2 min',
    title: 'Como proteger sua carteira',
    description: 'Proteja sua carteira, seus ativos e sua identidade contra golpes e drenadores.',
  },
];

export const MintingJournal: React.FC = () => {
  return (
    <section id="artigos" className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-16 scroll-mt-20">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#CFB28C] tracking-tight">
          Diário da Cunhagem
        </h2>
        <p className="text-xs sm:text-sm text-[#CFB28C]/70 mt-2">
          Histórias, guias e insights para colecionadores sobre o universo da propriedade digital.
        </p>
      </div>

      {/* Grid of Articles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {ARTICLES.map((article) => (
          <article
            key={article.id}
            className="group flex flex-col bg-[#241612] border border-[#38220F] rounded-2xl overflow-hidden p-3.5 hover:border-[#D28A4C]/60 transition-all duration-300 transform hover:-translate-y-1 shadow-lg"
          >
            {/* Image */}
            <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#140D0A] mb-3.5">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>

            {/* Meta */}
            <p className="text-[11px] text-[#CFB28C]/60 font-mono mb-2">
              {article.date} <span className="opacity-40">|</span> {article.readTime}
            </p>

            {/* Title */}
            <h3 className="text-sm font-bold text-[#CFB28C] group-hover:text-[#E89B55] transition-colors line-clamp-2 mb-2 leading-snug">
              {article.title}
            </h3>

            {/* Description */}
            <p className="text-xs text-[#CFB28C]/70 line-clamp-2 mb-4 leading-relaxed flex-grow">
              {article.description}
            </p>

            {/* Read more link */}
            <div className="pt-2 border-t border-[#38220F]/40 flex items-center gap-1.5 text-xs font-semibold text-[#D28A4C] group-hover:text-[#E89B55] transition-colors">
              <span>Ler mais</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </article>
        ))}
      </div>

    </section>
  );
};
