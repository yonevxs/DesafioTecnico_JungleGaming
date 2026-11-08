import { BlockchainNetwork } from './nft';
import { WalletType } from './order';

export interface WalletFormData {
  displayName: string;
  walletNickname: string;
  network: BlockchainNetwork | '';
  profileName: string;
  walletAddress: string;
  secondaryWalletOrEns: string;
  walletType: WalletType | '';
  referralCode: string;
  email: string;
  ensName: string;
}

export interface SecondaryWalletData {
  sameAsPrimary: boolean;
  address?: string;
  network?: BlockchainNetwork;
  nickname?: string;
  isAdded: boolean;
}
