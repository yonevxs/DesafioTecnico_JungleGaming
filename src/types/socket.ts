export interface NftUpdatedEvent {
  id: string;
  version: number;
  priceEth?: string;
  priceUsd?: number;
  availableQuantity?: number;
  totalQuantity?: number;
  isSoldOut?: boolean;
  timestamp?: string;
}

export interface OrderUpdatedEvent {
  orderId: string;
  version: number;
  status: 'pending' | 'confirmed' | 'failed';
  transactionHash?: string;
  errorMessage?: string;
  timestamp?: string;
}

export interface SocketState {
  isConnected: boolean;
  lastEventTime?: string;
}
