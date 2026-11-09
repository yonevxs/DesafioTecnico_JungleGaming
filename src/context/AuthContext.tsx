import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { User, LoginCredentials, RegisterData } from '@/types/auth';
import { authService } from '@/services/authService';
import { socketService } from '@/services/socketService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  loginWithSocial: (provider: 'Google' | 'Facebook') => Promise<void>;
  logout: () => Promise<void>;
  // Controle do Modal
  isAuthModalOpen: boolean;
  authModalTab: 'login' | 'register';
  openAuthModal: (tab?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  setAuthModalTab: (tab: 'login' | 'register') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'kurio_auth_token';
const USER_KEY = 'kurio_auth_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  });

  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem(USER_KEY);
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');

  useEffect(() => {
    // Verifica se a URL contém ?login=true para abrir o pop-up automaticamente (apenas fora das páginas dedicadas)
    const params = new URLSearchParams(window.location.search);
    if (params.get('login') === 'true' && window.location.pathname !== '/login' && window.location.pathname !== '/cadastro') {
      setIsAuthModalOpen(true);
      setAuthModalTab('login');
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const data = await authService.login(credentials);
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      setIsAuthModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (registerData: RegisterData) => {
    setIsLoading(true);
    try {
      const data = await authService.register(registerData);
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      setIsAuthModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithSocial = async (provider: 'Google' | 'Facebook') => {
    setIsLoading(true);
    try {
      const mockSocialUser: User = {
        id: `usr_social_${Date.now()}`,
        name: provider === 'Google' ? 'Lucas Neves (Google)' : 'Lucas Neves (Facebook)',
        username: `lucas_${provider.toLowerCase()}`,
        email: `lucas.${provider.toLowerCase()}@email.com`,
        avatar: provider === 'Google' ? '/assets/NFT Auth Artwork 8.png' : '/assets/NFT Auth Artwork 10.png',
        walletAddress: '0x71C8360565ab8854E632310375776473060f641B',
        role: 'collector',
        createdAt: new Date().toISOString(),
      };
      const simulatedToken = `social_jwt_${Date.now()}`;
      setToken(simulatedToken);
      setUser(mockSocialUser);
      localStorage.setItem(TOKEN_KEY, simulatedToken);
      localStorage.setItem(USER_KEY, JSON.stringify(mockSocialUser));
      setIsAuthModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // Ignora erro no logout
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      queryClient.clear();
      socketService.clearSessionState();
    }
  };

  const openAuthModal = (tab: 'login' | 'register' = 'login') => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      const target = tab === 'register' ? '/cadastro' : '/login';
      if (window.location.pathname !== target) {
        window.location.href = target;
      }
      return;
    }
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        register,
        loginWithSocial,
        logout,
        isAuthModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal,
        setAuthModalTab,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
};
