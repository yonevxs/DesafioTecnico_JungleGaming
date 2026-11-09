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

  // Em rotas de produto e checkout, o mobile exibe suas barras de acao dedicadas
  if (
    currentPath.startsWith('/nft/') ||
    currentPath === '/carrinho' ||
    currentPath === '/pagamento' ||
    currentPath.startsWith('/confirmacao')
  ) {
    return null;
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
      
      {/* Container Principal */}
      <div className="relative w-full max-w-md mx-auto h-[68px] pointer-events-auto">
        
        {/* Background com Concavidade Curvada Suave e mais ampla (Figma Print) */}
        <svg
          viewBox="0 0 375 68"
          fill="none"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full drop-shadow-[0_-6px_20px_rgba(0,0,0,0.55)] pointer-events-none"
        >
          {/* Fundo da barra com concavidade ampla e gap suave */}
          <path
            d="M 0 18
               C 0 8, 8 0, 18 0
               L 126 0
               C 146 0, 156 43, 187.5 43
               C 219 43, 229 0, 249 0
               L 357 0
               C 367 0, 375 8, 375 18
               L 375 68
               L 0 68
               Z"
            fill="#1E120C"
          />
          {/* Borda sutil superior contornando a concavidade */}
          <path
            d="M 0 18
               C 0 8, 8 0, 18 0
               L 126 0
               C 146 0, 156 43, 187.5 43
               C 219 43, 229 0, 249 0
               L 357 0
               C 367 0, 375 8, 375 18"
            stroke="#38220F"
            strokeWidth="1"
            fill="none"
          />
        </svg>

        {/* Botão Central de Rastrear NFT: Translúcido com Backdrop-blur e Ícone Maior */}
        <div className="absolute left-1/2 -top-6 -translate-x-1/2 z-20">
          <button
            type="button"
            onClick={handleCenterAction}
            className="w-14 h-14 rounded-full bg-gradient-to-b from-[#D28A4C]/75 to-[#B86B35]/70 backdrop-blur-md border border-[#F5A862]/30 shadow-[0_0_24px_rgba(210,138,76,0.4)] flex items-center justify-center active:scale-95 transition-all cursor-pointer group"
            aria-label="Rastrear NFT"
          >
            {/* Ícone de Escaneamento Ampliado (Visor Óptico com brackets e linha central) */}
            <svg
              width="30"
              height="30"
              viewBox="0 0 30 30"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="group-hover:scale-105 transition-transform drop-shadow-sm"
            >
              <path d="M 6.5 11.5 V 9.5 C 6.5 7.5, 8 6, 10 6 H 20 C 22 6, 23.5 7.5, 23.5 9.5 V 11.5" />
              <path d="M 6.5 18.5 V 20.5 C 6.5 22.5, 8 24, 10 24 H 20 C 22 24, 23.5 22.5, 23.5 20.5 V 18.5" />
              <line x1="5" y1="15" x2="25" y2="15" />
            </svg>
          </button>
        </div>

        {/* Barra de Itens de Navegação (Alinhados aos lados da concavidade) */}
        <nav className="relative z-10 h-[68px] px-8 flex items-center justify-between">
          
          {/* Lado Esquerdo: Home e Favoritos */}
          <div className="flex items-center space-x-10">
            {/* 1. Home (Casinha sólida âmbar) */}
            <button
              type="button"
              onClick={handleGoHome}
              className="p-1.5 transition-colors cursor-pointer"
              aria-label="Início"
            >
              <svg width="22" height="20" viewBox="0 0 22 20" fill="none">
                <path
                  d="M11 2L2.5 9V17C2.5 18.1046 3.39543 19 4.5 19H17.5C18.6046 19 19.5 18.1046 19.5 17V9L11 2Z"
                  fill="#D28A4C"
                  stroke="#D28A4C"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* 2. Favoritos (Coração) */}
            <button
              type="button"
              onClick={handleFavoritesClick}
              className="p-1.5 transition-colors cursor-pointer text-[#CFB28C]/80 hover:text-[#D28A4C]"
              aria-label="Lista de interesse"
            >
              <Heart className="w-5 h-5 fill-[#CFB28C]/20 stroke-[#CFB28C] stroke-[1.8]" />
            </button>
          </div>

          {/* Espaço central reservado para a concavidade e botão de rastrear */}
          <div className="w-14" />

          {/* Lado Direito: Carrinho e Perfil */}
          <div className="flex items-center space-x-10">
            {/* 3. Carrinho com badge */}
            <button
              type="button"
              onClick={() => navigate({ to: '/carrinho' })}
              className="relative p-1.5 transition-colors cursor-pointer text-[#CFB28C]/80 hover:text-[#D28A4C]"
              aria-label="Carrinho"
            >
              <ShoppingCart className={`w-5 h-5 stroke-[1.8] ${isCart ? 'text-[#D28A4C]' : 'text-[#CFB28C]/80'}`} />
              {totalCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#E89B55] text-[#140D0A] text-[9px] font-bold font-mono min-w-[16px] h-4 rounded-full flex items-center justify-center px-1 shadow-sm">
                  {totalCount}
                </span>
              )}
            </button>

            {/* 4. Perfil */}
            <button
              type="button"
              onClick={handleProfileClick}
              className={`p-1.5 transition-colors cursor-pointer ${
                isProfile ? 'text-[#D28A4C]' : 'text-[#CFB28C]/80 hover:text-[#D28A4C]'
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
