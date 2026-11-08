import api from './api';
import { WalletFormData, SecondaryWalletData } from '@/types/wallet';

const PRIMARY_WALLET_STORAGE_KEY = 'kurio_primary_wallet';
const SECONDARY_WALLET_STORAGE_KEY = 'kurio_secondary_wallet';

export const walletService = {
  getPrimaryWallet(): WalletFormData | null {
    try {
      const stored = localStorage.getItem(PRIMARY_WALLET_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Ignora erro de parse
    }
    return null;
  },

  getSecondaryWallet(): SecondaryWalletData | null {
    try {
      const stored = localStorage.getItem(SECONDARY_WALLET_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Ignora erro de parse
    }
    return null;
  },

  async savePrimaryWallet(data: WalletFormData): Promise<WalletFormData> {
    try {
      localStorage.setItem(PRIMARY_WALLET_STORAGE_KEY, JSON.stringify(data));
      await api.put('/wallets', { primary: data }).catch(() => {});
    } catch {
      // Fallback local sempre salvo
    }
    return data;
  },

  async saveSecondaryWallet(data: SecondaryWalletData): Promise<SecondaryWalletData> {
    try {
      localStorage.setItem(SECONDARY_WALLET_STORAGE_KEY, JSON.stringify(data));
      await api.put('/wallets', { secondary: data }).catch(() => {});
    } catch {
      // Fallback local sempre salvo
    }
    return data;
  },
};
