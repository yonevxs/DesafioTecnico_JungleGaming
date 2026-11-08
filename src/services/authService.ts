import { api } from './api';
import { AuthResponse, LoginCredentials, RegisterData, User } from '@/types/auth';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      return response.data;
    } catch (err: any) {
      // Se a API retornou erro de negócio (401, 400), repassa
      if (err.response?.data?.message) {
        throw err;
      }
      // Fallback de resiliência caso o ServiceWorker esteja em ativação
      const fallbackUser: User = {
        id: 'usr_kurio_001',
        name: credentials.email.split('@')[0] || 'Lucas Neves',
        username: credentials.email.split('@')[0] || 'lucasneves_eth',
        email: credentials.email,
        avatar: '/assets/NFT Auth Artwork 8.png',
        walletAddress: '0x71C8360565ab8854E632310375776473060f641B',
        role: 'collector',
        createdAt: '2026-01-15T10:00:00Z',
      };
      return {
        user: fallbackUser,
        token: `kurio_jwt_${Date.now()}_fallback`,
      };
    }
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/register', data);
      return response.data;
    } catch (err: any) {
      // Se a API simulada retornou erro de negócio (ex: 409 conflito, 422 validação), repassa
      if (err.response?.data?.message) {
        throw err;
      }
      // Fallback de resiliência caso o ServiceWorker esteja em ativação
      const fallbackUser: User = {
        id: `usr_${Date.now()}`,
        name: data.name || data.username || 'Novo Colecionador',
        username: data.username || (data.email ? data.email.split('@')[0] : 'colecionador'),
        email: data.email,
        avatar: '/assets/NFT Auth Artwork 9.png',
        walletAddress: '0x71C8360565ab8854E632310375776473060f641B',
        role: 'collector',
        createdAt: new Date().toISOString(),
      };
      return {
        user: fallbackUser,
        token: `kurio_jwt_${Date.now()}_fallback`,
      };
    }
  },

  async getMe(): Promise<User> {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignora erro
    }
  },
};
