import { CartItem } from '@/hooks/useCart';
import { BlockchainNetwork } from './nft';

export type WalletType = 'MetaMask' | 'Coinbase Wallet' | 'WalletConnect';

export type OrderStatus = 'pending' | 'confirmed' | 'rejected';

export interface CollectorProfile {
  displayName: string;
  username: string;
  network: BlockchainNetwork;
  profileName: string;
  walletAddress: string;
  secondaryWalletOrEns?: string;
  walletType: WalletType;
  referralCode?: string;
  email: string;
  ensName?: string;
  useOtherWallet?: boolean;
  notes?: string;
}

export interface CreateOrderRequest {
  idempotencyKey: string;
  collector: CollectorProfile;
  items: CartItem[];
  subtotalEth: string;
  discountEth: string;
  networkFeeEth: string;
  totalEth: string;
  couponCode?: string;
}

export interface OrderReceipt {
  orderId: string;
  transactionHash: string;
  idempotencyKey: string;
  status: OrderStatus;
  createdAt: string;
  collector: CollectorProfile;
  items: CartItem[];
  subtotalEth: string;
  discountEth: string;
  networkFeeEth: string;
  totalEth: string;
  couponCode?: string;
}
