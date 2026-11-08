import React from 'react';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { Home, Heart, ShoppingCart, User as UserIcon } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/context/AuthContext';

export const BottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const { totalCount } = useCart();
  const { isAuthenticated, openAuthModal } = useAuth();

  const isHome = currentPath === '/';
  const isCart = currentPath === '/carrinho';
  const isProfile = currentPath === '/perfil' || currentPath === '/carteiras' || currentPath === '/perfil-colecionador';

  const handleGoHome = () => {
    if (currentPath !== '/') {
      navigate({ to: '/' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCenterAction = () => {
    if (currentPath !== '/') {
      navigate({ to: '/' }).then(() => {
        setTimeout(() => {
          const el = document.getElementById('catalogo');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      });
    } else {
      const el = document.getElementById('catalogo');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFavoritesClick = () => {
    if (currentPath !== '/') {
      navigate({ to: '/' }).then(() => {
        setTimeout(() => {
          const el = document.getElementById('catalogo');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      });
    } else {
      const el = document.getElementById('catalogo');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleProfileClick = () => {
    if (isAuthenticated) {
      navigate({ to: '/perfil' });
    } else {
      openAuthModal('login');
    }
  };

  // Na página de detalhes do NFT, o mobile exibe a barra fixa de compra exclusiva do produto (Print 2)
  if (currentPath.startsWith('/nft/')) {
    return null;
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
      
      {/* Container com fundo escuro e notch suave */}
      <div className="relative max-w-md mx-auto w-full pointer-events-auto">
        
        {/* FAB Central Flutuante com Símbolo Kurio */}
        <div className="absolute left-1/2 -top-6 -translate-x-1/2 z-20">
          <button
            type="button"
            onClick={handleCenterAction}
            className="w-14 h-14 rounded-full bg-gradient-to-br from-[#D28A4C] to-[#E89B55] p-0.5 shadow-xl shadow-[#D28A4C]/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer group"
            aria-label="Explorar Coleções"
          >
            <div className="w-full h-full rounded-full bg-[#38220F]/90 backdrop-blur-md flex items-center justify-center border border-[#CFB28C]/30">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[#CFB28C] group-hover:text-[#E89B55] transition-colors"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="6" y1="9" x2="18" y2="9" />
                <line x1="6" y1="15" x2="18" y2="15" />
              </svg>
            </div>
          </button>
        </div>

        {/* Barra de Navegação Horizontal */}
        <nav className="h-16 bg-[#1A110E]/95 backdrop-blur-xl border-t border-[#38220F]/80 rounded-t-3xl px-6 flex items-center justify-between shadow-2xl">
          
          {/* Lado Esquerdo: Home e Favoritos */}
          <div className="flex items-center space-x-8">
            <button
              type="button"
              onClick={handleGoHome}
              className={`p-2 transition-colors cursor-pointer ${
                isHome ? 'text-[#E89B55]' : 'text-[#CFB28C]/60 hover:text-[#CFB28C]'
              }`}
              aria-label="Início"
            >
              <Home className={`w-5 h-5 ${isHome ? 'fill-current' : ''}`} />
            </button>

            <button
              type="button"
              onClick={handleFavoritesClick}
              className="p-2 text-[#CFB28C]/60 hover:text-[#E89B55] transition-colors cursor-pointer"
              aria-label="Lista de interesse"
            >
              <Heart className="w-5 h-5" />
            </button>
          </div>

          {/* Espaço central reservado para o FAB */}
          <div className="w-14" />

          {/* Lado Direito: Carrinho e Perfil */}
          <div className="flex items-center space-x-8">
            <button
              type="button"
              onClick={() => navigate({ to: '/carrinho' })}
              className={`relative p-2 transition-colors cursor-pointer ${
                isCart ? 'text-[#E89B55]' : 'text-[#CFB28C]/60 hover:text-[#CFB28C]'
              }`}
              aria-label="Carrinho"
            >
              <ShoppingCart className={`w-5 h-5 ${isCart ? 'fill-current' : ''}`} />
              {totalCount > 0 && (
                <span className="absolute top-1 right-0 bg-[#E89B55] text-[#140D0A] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center font-mono">
                  {totalCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={handleProfileClick}
              className={`p-2 transition-colors cursor-pointer ${
                isProfile ? 'text-[#E89B55]' : 'text-[#CFB28C]/60 hover:text-[#CFB28C]'
              }`}
              aria-label="Perfil do colecionador"
            >
              <UserIcon className={`w-5 h-5 ${isProfile ? 'fill-current' : ''}`} />
            </button>
          </div>

        </nav>

      </div>

    </div>
  );
};
