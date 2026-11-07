import React, { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown, MessageSquare, Send } from 'lucide-react';
import { NftItem } from '@/types/nft';

interface Review {
  id: string;
  user: string;
  handle: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
  likes: number;
  isLiked?: boolean;
  isDisliked?: boolean;
}

const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    user: 'Crypt0Hunter',
    handle: '@crypt0hunter',
    avatar: '/assets/NFT Auth Artwork 8.png',
    rating: 5,
    date: 'há 2 dias',
    comment: 'Arte incrível e resolução impressionante na blockchain! Os detalhes no casaco e os reflexos nos óculos são absurdos. Valeu cada fração de ETH investida.',
    likes: 24,
  },
  {
    id: 'rev-2',
    user: 'Lucas Neves',
    handle: '@lucasneves_eth',
    avatar: '/assets/NFT Auth Artwork 10.png',
    rating: 5,
    date: 'há 4 dias',
    comment: 'Transação super rápida e detalhes visuais primorosos. Com certeza a coleção Kurio vai ser uma das maiores do ecossistema este ano.',
    likes: 12,
  },
  {
    id: 'rev-3',
    user: 'Web3Vessel',
    handle: '@web3vessel',
    avatar: '/assets/NFT Auth Artwork 9.png',
    rating: 5,
    date: 'há 1 semana',
    comment: 'Uma das edições mais raras e com utilidade futura garantida pela comunidade. Já fiz questão de favoritar e guardar na minha cold wallet.',
    likes: 8,
  },
  {
    id: 'rev-4',
    user: 'SatoVault',
    handle: '@satovault',
    avatar: '/assets/NFT Auth Artwork 11.png',
    rating: 5,
    date: 'há 2 semanas',
    comment: 'Contrato inteligente verificado e metadados no IPFS perfeitamente configurados. 10/10 para a transparência do criador!',
    likes: 19,
  },
];

interface NftTabsSectionProps {
  nft: NftItem;
}

export const NftTabsSection: React.FC<NftTabsSectionProps> = ({ nft }) => {
  const [activeTab, setActiveTab] = useState<'detalhes' | 'avaliacoes'>('detalhes');
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const handleLikeReview = (id: string) => {
    setReviews(prev => prev.map(r => {
      if (r.id === id) {
        const isLiked = !r.isLiked;
        return {
          ...r,
          isLiked,
          likes: isLiked ? r.likes + 1 : Math.max(0, r.likes - 1),
          isDisliked: false,
        };
      }
      return r;
    }));
  };

  const handleDislikeReview = (id: string) => {
    setReviews(prev => prev.map(r => {
      if (r.id === id) {
        return {
          ...r,
          isDisliked: !r.isDisliked,
          isLiked: false,
          likes: r.isLiked ? Math.max(0, r.likes - 1) : r.likes,
        };
      }
      return r;
    }));
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      user: 'Colecionador Kurio',
      handle: '@colecionador',
      avatar: '/assets/NFT Auth Artwork 8.png',
      rating: newRating,
      date: 'agora mesmo',
      comment: newComment.trim(),
      likes: 0,
    };

    setReviews([newRev, ...reviews]);
    setNewComment('');
    setIsInputFocused(false);
  };

  return (
    <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-10 border-t border-[#38220F]/60">
      
      {/* Abas */}
      <div className="flex items-center space-x-8 border-b border-[#38220F]/60 pb-3 mb-8 text-sm font-mono">
        <button
          type="button"
          onClick={() => setActiveTab('detalhes')}
          className={`pb-2 transition-all font-semibold ${
            activeTab === 'detalhes'
              ? 'text-[#E89B55] border-b-2 border-[#E89B55]'
              : 'text-[#CFB28C]/70 hover:text-[#CFB28C]'
          }`}
        >
          Detalhes do NFT
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('avaliacoes')}
          className={`pb-2 transition-all font-semibold ${
            activeTab === 'avaliacoes'
              ? 'text-[#E89B55] border-b-2 border-[#E89B55]'
              : 'text-[#CFB28C]/70 hover:text-[#CFB28C]'
          }`}
        >
          Avaliações de colecionadores ({reviews.length})
        </button>
      </div>

      {/* Conteúdo da Aba: Detalhes do NFT */}
      {activeTab === 'detalhes' && (
        <div className="flex flex-col space-y-5 text-xs sm:text-sm text-[#CFB28C]/80 leading-relaxed font-mono max-w-4xl">
          <p>
            {nft.name} {nft.tokenId} é uma obra digital 1/50 finalizada à mão da coleção Kurio Editions. Cada atributo fica armazenado nos metadados do token e verificado na {nft.network}. A obra explora identidade, movimento e luz em um mundo digital sem fronteiras.
          </p>

          <p>
            A propriedade inclui a arte em alta resolução, lançamentos exclusivos para colecionadores e um registro permanente de procedência registrada na rede. Nova Sato recebe 5% de direitos autorais nas vendas secundárias, apoiando novos trabalhos e lançamentos da comunidade.
          </p>

          <div className="pt-2 space-y-3">
            <div>
              <span className="block font-bold text-[#CFB28C] mb-0.5">Rede:</span>
              <span>Cunhado na {nft.network} com procedência imutável e metadados armazenados no IPFS.</span>
            </div>

            <div>
              <span className="block font-bold text-[#CFB28C] mb-0.5">Contrato:</span>
              <span>Direitos autorais do criador: 5% nas vendas secundárias, pagos automaticamente pelos mercados compatíveis.</span>
            </div>

            <div>
              <span className="block font-bold text-[#CFB28C] mb-0.5">Direitos autorais:</span>
              <span className="text-[#CFB28C]">0x7A42...19E8 • Contrato inteligente ERC-721 verificado.</span>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo da Aba: Avaliações no Estilo Lista do YouTube */}
      {activeTab === 'avaliacoes' && (
        <div className="max-w-3xl flex flex-col space-y-8 font-mono">
          
          {/* Caixa de Entrada de Nova Avaliação (Estilo YouTube) */}
          <div className="flex items-start gap-4 pb-6 border-b border-[#38220F]/60">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-[#241612] shrink-0 border border-[#38220F]">
              <img
                src="/assets/NFT Auth Artwork 8.png"
                alt="Seu avatar"
                className="w-full h-full object-cover"
              />
            </div>

            <form onSubmit={handleSubmitReview} className="flex-grow space-y-3">
              {/* Seleção de Estrelas */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#CFB28C]/60">Sua nota:</span>
                <div className="flex gap-1 text-[#E89B55]">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className="hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          star <= newRating
                            ? 'fill-[#E89B55] stroke-[#E89B55]'
                            : 'stroke-[#CFB28C]/40'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Input com linha expansível */}
              <textarea
                rows={isInputFocused || newComment ? 3 : 1}
                placeholder="Adicione uma avaliação sobre este NFT..."
                value={newComment}
                onFocus={() => setIsInputFocused(true)}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full bg-transparent border-b border-[#38220F] focus:border-[#E89B55] text-xs sm:text-sm text-[#CFB28C] placeholder-[#CFB28C]/40 outline-none resize-none transition-all py-1"
              />

              {/* Botões de Ação */}
              {(isInputFocused || newComment) && (
                <div className="flex items-center justify-end gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setNewComment('');
                      setIsInputFocused(false);
                    }}
                    className="text-xs text-[#CFB28C]/70 hover:text-[#CFB28C] px-3 py-1.5"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    disabled={!newComment.trim()}
                    className="flex items-center gap-1.5 bg-[#D28A4C] hover:bg-[#E89B55] disabled:opacity-40 text-[#140D0A] font-bold text-xs px-4 py-1.5 rounded-full transition-all"
                  >
                    <span>Avaliar</span>
                    <Send className="w-3 h-3" />
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Lista de Avaliações em Feed Vertical (Estilo YouTube) */}
          <div className="space-y-6">
            {reviews.map((rev) => (
              <div key={rev.id} className="flex items-start gap-4 group">
                
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full overflow-hidden bg-[#241612] shrink-0 border border-[#38220F] mt-0.5">
                  <img
                    src={rev.avatar}
                    alt={rev.user}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Conteúdo do Comentário */}
                <div className="flex-grow space-y-1.5">
                  
                  {/* Linha de Autor + Data + Estrelas */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs sm:text-sm font-bold text-[#CFB28C]">
                      {rev.handle}
                    </span>

                    <span className="text-[11px] text-[#CFB28C]/50">
                      {rev.date}
                    </span>

                    {/* Estrelas */}
                    <div className="flex text-[#E89B55] ml-2">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-[#E89B55] stroke-[#E89B55]" />
                      ))}
                    </div>
                  </div>

                  {/* Texto do Comentário */}
                  <p className="text-xs sm:text-sm text-[#CFB28C]/90 leading-relaxed font-sans">
                    {rev.comment}
                  </p>

                  {/* Barra de Ações (Like, Dislike, Responder) */}
                  <div className="flex items-center gap-4 pt-1 text-xs text-[#CFB28C]/60">
                    
                    {/* Botão Like */}
                    <button
                      type="button"
                      onClick={() => handleLikeReview(rev.id)}
                      className={`flex items-center gap-1.5 hover:text-[#E89B55] transition-colors p-1 rounded-full ${
                        rev.isLiked ? 'text-[#E89B55]' : ''
                      }`}
                      aria-label="Gostei deste comentário"
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${rev.isLiked ? 'fill-current' : ''}`} />
                      <span className="text-[11px] font-mono">{rev.likes > 0 ? rev.likes : ''}</span>
                    </button>

                    {/* Botão Dislike */}
                    <button
                      type="button"
                      onClick={() => handleDislikeReview(rev.id)}
                      className={`hover:text-[#E89B55] transition-colors p-1 rounded-full ${
                        rev.isDisliked ? 'text-[#E89B55]' : ''
                      }`}
                      aria-label="Não gostei deste comentário"
                    >
                      <ThumbsDown className={`w-3.5 h-3.5 ${rev.isDisliked ? 'fill-current' : ''}`} />
                    </button>

                    {/* Botão Responder */}
                    <button
                      type="button"
                      onClick={() => alert(`Responder para ${rev.handle}`)}
                      className="hover:text-[#CFB28C] transition-colors font-semibold text-[11px]"
                    >
                      Responder
                    </button>

                  </div>

                </div>

              </div>
            ))}
          </div>

        </div>
      )}

    </section>
  );
};
