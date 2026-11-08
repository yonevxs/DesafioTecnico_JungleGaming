import React, { useState } from 'react';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { Search, ShoppingCart, LogIn, Menu, X, LogOut, User as UserIcon } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/context/AuthContext';

interface HeaderProps {
  onSearchClick?: () => void;
  onLoginClick?: () => void;
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onSearchClick,
  onLoginClick,
  searchQuery = '',
  onSearchChange,
}) => {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const { totalCount } = useCart();
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Navegação suave entre seções e rotas
  const handleNav = (target: 'inicio' | 'mercado' | 'criadores' | 'aprenda') => {
    setMobileMenuOpen(false);

    if (target === 'inicio') {
      if (currentPath !== '/') {
        navigate({ to: '/' }).then(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (target === 'mercado') {
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
    } else if (target === 'criadores' || target === 'aprenda') {
      if (currentPath !== '/') {
        navigate({ to: '/' }).then(() => {
          setTimeout(() => {
            const el = document.getElementById('artigos');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        });
      } else {
        const el = document.getElementById('artigos');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleGoToCart = () => {
    setMobileMenuOpen(false);
    navigate({ to: '/carrinho' });
  };

  // Determina qual item de navegação está ativo
  const isMercadoActive = currentPath.startsWith('/nft') || currentPath === '/carrinho' || currentPath === '/pagamento' || currentPath.startsWith('/confirmacao');
  const isInicioActive = currentPath === '/' && !isMercadoActive;

  return (
    <header className="sticky top-0 z-50 w-full bg-[#140D0A]/95 backdrop-blur-md border-b border-[#38220F]/60 transition-all">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-8">
          <button
            type="button"
            onClick={() => handleNav('inicio')}
            className="flex items-center gap-2 group text-left"
          >
            <span className="text-2xl font-bold tracking-[0.25em] text-[#CFB28C] group-hover:text-[#E89B55] transition-colors font-mono">
              KURIO
            </span>
          </button>

          {/* Desktop Navigation Links com transição suave */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-mono">
            
            {/* Início */}
            <button
              type="button"
              onClick={() => handleNav('inicio')}
              className={`relative pb-1.5 transition-all duration-300 font-semibold group ${
                isInicioActive ? 'text-[#E89B55]' : 'text-[#CFB28C]/80 hover:text-[#CFB28C]'
              }`}
            >
              <span>Início</span>
              <span
                className={`absolute bottom-0 left-0 right-0 h-0.5 bg-[#E89B55] transition-all duration-300 ease-out transform ${
                  isInicioActive ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0 group-hover:scale-x-50 group-hover:opacity-50'
                }`}
              />
            </button>

            {/* Mercado */}
            <button
              type="button"
              onClick={() => handleNav('mercado')}
              className={`relative pb-1.5 transition-all duration-300 font-semibold group ${
                isMercadoActive ? 'text-[#E89B55]' : 'text-[#CFB28C]/80 hover:text-[#CFB28C]'
              }`}
            >
              <span>Mercado</span>
              <span
                className={`absolute bottom-0 left-0 right-0 h-0.5 bg-[#E89B55] transition-all duration-300 ease-out transform ${
                  isMercadoActive ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0 group-hover:scale-x-50 group-hover:opacity-50'
                }`}
              />
            </button>

            {/* Criadores */}
            <button
              type="button"
              onClick={() => handleNav('criadores')}
              className="relative pb-1.5 text-[#CFB28C]/80 hover:text-[#CFB28C] transition-all duration-300 font-semibold group"
            >
              <span>Criadores</span>
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E89B55] transition-all duration-300 ease-out transform scale-x-0 opacity-0 group-hover:scale-x-50 group-hover:opacity-50" />
            </button>

            {/* Aprenda */}
            <button
              type="button"
              onClick={() => handleNav('aprenda')}
              className="relative pb-1.5 text-[#CFB28C]/80 hover:text-[#CFB28C] transition-all duration-300 font-semibold group"
            >
              <span>Aprenda</span>
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E89B55] transition-all duration-300 ease-out transform scale-x-0 opacity-0 group-hover:scale-x-50 group-hover:opacity-50" />
            </button>

          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 sm:gap-5">
          
          {/* Search Toggle / Input */}
          <div className="relative flex items-center">
            {searchOpen ? (
              <div className="flex items-center bg-[#241612] border border-[#38220F] rounded-full px-3 py-1.5 focus-within:border-[#D28A4C] transition-all animate-in fade-in duration-200">
                <Search className="w-4 h-4 text-[#CFB28C]/70 mr-2" />
                <input
                  type="text"
                  placeholder="Buscar NFTs..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  className="bg-transparent text-xs sm:text-sm text-[#CFB28C] placeholder-[#CFB28C]/40 outline-none w-28 sm:w-44 font-mono"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="text-[#CFB28C]/60 hover:text-[#CFB28C] text-xs ml-1"
                  aria-label="Fechar busca"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setSearchOpen(true);
                  onSearchClick?.();
                }}
                className="p-2 text-[#CFB28C] hover:text-[#E89B55] transition-all duration-200 rounded-full hover:bg-[#241612]/60"
                aria-label="Abrir pesquisa de NFTs"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Cart Icon with badge -> Navega suavemente para /carrinho */}
          <button
            type="button"
            onClick={handleGoToCart}
            className={`relative p-2 transition-all duration-300 rounded-full hover:bg-[#241612]/60 ${
              currentPath === '/carrinho' ? 'text-[#E89B55] bg-[#241612]' : 'text-[#CFB28C] hover:text-[#E89B55]'
            }`}
            aria-label={`Carrinho de compras com ${totalCount} itens`}
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="absolute top-1 right-0 bg-[#E89B55] text-[#140D0A] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center font-mono">
              {totalCount > 0 ? totalCount : 0}
            </span>
          </button>

          {/* Login or User Profile */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 bg-[#241612] hover:bg-[#38220F] border border-[#38220F] text-[#CFB28C] text-xs px-3.5 py-1.5 rounded-full transition-all duration-200 font-mono shadow-sm cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full overflow-hidden bg-[#140D0A] shrink-0 border border-[#D28A4C]">
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                </div>
                <span className="truncate max-w-[90px] font-semibold">{user.name.split(' ')[0]}</span>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[#241612] border border-[#38220F] rounded-xl shadow-2xl py-2 z-50 font-mono animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-2 border-b border-[#38220F]/60 text-xs">
                    <p className="font-bold text-[#CFB28C] truncate">{user.name}</p>
                    <p className="text-[10px] text-[#CFB28C]/60 truncate">{user.email}</p>
                    {user.walletAddress && (
                      <p className="text-[10px] text-[#E89B55] font-mono mt-1 truncate">
                        {user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      logout();
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-red-400 hover:bg-[#140D0A] transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sair da conta</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (onLoginClick) onLoginClick();
                else openAuthModal('login');
              }}
              className="flex items-center gap-2 bg-[#D28A4C] hover:bg-[#E89B55] text-[#140D0A] font-semibold text-xs sm:text-sm px-4 sm:px-5 py-2 sm:py-2.5 rounded-full transition-all duration-200 active:scale-95 shadow-md shadow-[#D28A4C]/10 font-mono cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Entrar</span>
            </button>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#CFB28C] hover:text-[#E89B55] transition-colors"
            aria-label="Menu de navegação mobile"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>
      </div>

      {/* Mobile Menu Overlay com links animados */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#140D0A] border-b border-[#38220F] px-6 py-4 flex flex-col space-y-4 font-mono animate-in slide-in-from-top-2 duration-300">
          <button
            type="button"
            onClick={() => handleNav('inicio')}
            className={`text-left text-base py-1 transition-colors ${
              isInicioActive ? 'text-[#E89B55] font-bold' : 'text-[#CFB28C]'
            }`}
          >
            Início
          </button>
          <button
            type="button"
            onClick={() => handleNav('mercado')}
            className={`text-left text-base py-1 transition-colors ${
              isMercadoActive ? 'text-[#E89B55] font-bold' : 'text-[#CFB28C]'
            }`}
          >
            Mercado
          </button>
          <button
            type="button"
            onClick={() => handleNav('criadores')}
            className="text-left text-[#CFB28C] hover:text-[#E89B55] text-base py-1 transition-colors"
          >
            Criadores
          </button>
          <button
            type="button"
            onClick={() => handleNav('aprenda')}
            className="text-left text-[#CFB28C] hover:text-[#E89B55] text-base py-1 transition-colors"
          >
            Aprenda
          </button>
          <button
            type="button"
            onClick={handleGoToCart}
            className="text-left text-[#E89B55] font-bold text-base py-1 flex items-center justify-between"
          >
            <span>Carrinho</span>
            <span className="bg-[#E89B55] text-[#140D0A] text-xs px-2 py-0.5 rounded-full">
              {totalCount}
            </span>
          </button>
        </div>
      )}
    </header>
  );
};
