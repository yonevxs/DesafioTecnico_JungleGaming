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
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 pointer-events-auto">
      
      {/* Container Principal */}
      <div className="relative w-full max-w-md mx-auto">
        
        {/* FAB Central Flutuante com Símbolo Kurio (Elevado sobre a barra plana) */}
        <div className="absolute left-1/2 -top-5 -translate-x-1/2 z-20">
          <button
            type="button"
            onClick={handleCenterAction}
            className="w-12 h-12 rounded-full bg-[#261712] border-2 border-[#D28A4C] shadow-[0_6px_20px_rgba(210,138,76,0.4)] flex items-center justify-center active:scale-95 transition-all cursor-pointer group"
            aria-label="Explorar Coleções Kurio"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#CFB28C"
              strokeWidth="1.8"
              strokeLinecap="round"
              className="group-hover:text-[#E89B55] group-hover:scale-105 transition-all"
            >
              <circle cx="12" cy="12" r="8.5" />
              <line x1="7.5" y1="10" x2="16.5" y2="10" />
              <line x1="7.5" y1="14" x2="16.5" y2="14" />
            </svg>
          </button>
        </div>

        {/* Barra de Navegação Horizontal Plana (Sem recorte, com cantos superiores arredondados) */}
        <nav className="h-16 bg-[#1F130E] border-t border-[#38220F]/60 rounded-t-3xl px-8 flex items-center justify-between shadow-2xl">
          
          {/* Lado Esquerdo: Home e Favoritos */}
          <div className="flex items-center space-x-10">
            {/* 1. Home (Casinha geométrica preenchida) */}
            <button
              type="button"
              onClick={handleGoHome}
              className="p-1.5 transition-colors cursor-pointer"
              aria-label="Início"
            >
              <svg width="22" height="20" viewBox="0 0 22 20" fill="none">
                <path
                  d="M11 2L2.5 9V17C2.5 18.1046 3.39543 19 4.5 19H17.5C18.6046 19 19.5 18.1046 19.5 17V9L11 2Z"
                  fill={isHome ? '#D28A4C' : 'none'}
                  stroke={isHome ? '#D28A4C' : '#8C7361'}
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* 2. Favoritos (Coração outline) */}
            <button
              type="button"
              onClick={handleFavoritesClick}
              className="p-1.5 text-[#8C7361] hover:text-[#D28A4C] transition-colors cursor-pointer"
              aria-label="Lista de interesse"
            >
              <Heart className="w-5 h-5 stroke-[1.8]" />
            </button>
          </div>

          {/* Espaço central reservado para o FAB */}
          <div className="w-12" />

          {/* Lado Direito: Carrinho e Perfil */}
          <div className="flex items-center space-x-10">
            {/* 3. Carrinho de compras com badge */}
            <button
              type="button"
              onClick={() => navigate({ to: '/carrinho' })}
              className="relative p-1.5 transition-colors cursor-pointer text-[#8C7361] hover:text-[#D28A4C]"
              aria-label="Carrinho"
            >
              <ShoppingCart className={`w-5 h-5 stroke-[1.8] ${isCart ? 'text-[#D28A4C]' : 'text-[#8C7361]'}`} />
              <span className="absolute -top-1.5 -right-2.5 bg-[#E89B55] text-[#140D0A] text-[9px] font-bold font-mono min-w-[17px] h-4 rounded-full flex items-center justify-center px-1 shadow-sm">
                {totalCount > 0 ? totalCount : 6}
              </span>
            </button>

            {/* 4. Perfil outline */}
            <button
              type="button"
              onClick={handleProfileClick}
              className={`p-1.5 transition-colors cursor-pointer ${
                isProfile ? 'text-[#D28A4C]' : 'text-[#8C7361] hover:text-[#D28A4C]'
              }`}
              aria-label="Perfil do colecionador"
            >
              <UserIcon className="w-5 h-5 stroke-[1.8]" />
            </button>
          </div>

        </nav>

      </div>

    </div>
  );
};
