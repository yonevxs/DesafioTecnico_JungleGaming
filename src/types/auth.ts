export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  walletAddress?: string;
  role?: 'collector' | 'creator';
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface RegisterData {
  name: string;
  username?: string;
  email: string;
  password?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
