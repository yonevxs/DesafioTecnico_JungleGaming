import { io, Socket } from 'socket.io-client';
import { NftUpdatedEvent, OrderUpdatedEvent } from '@/types/socket';

type NftUpdatedCallback = (event: NftUpdatedEvent) => void;
type OrderUpdatedCallback = (event: OrderUpdatedEvent) => void;
type ReconnectCallback = () => void;

class SocketService {
  private socket: Socket | null = null;
  private isConnected = false;
  private lastVersions: Map<string, number> = new Map();
  private nftSubscribers: Set<NftUpdatedCallback> = new Set();
  private orderSubscribers: Set<OrderUpdatedCallback> = new Set();
  private reconnectSubscribers: Set<ReconnectCallback> = new Set();
  private isInitialized = false;

  public init() {
    if (this.isInitialized || typeof window === 'undefined') return;
    this.isInitialized = true;

    const socketUrl = (import.meta as any).env?.VITE_SOCKET_URL || window.location.origin;

    try {
      this.socket = io(socketUrl, {
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1500,
        timeout: 4000,
      });

      this.socket.on('connect', () => {
        const wasDisconnected = !this.isConnected;
        this.isConnected = true;
        if (wasDisconnected) {
          for (const cb of this.reconnectSubscribers) {
            try {
              cb();
            } catch {}
          }
        }
      });

      this.socket.on('disconnect', () => {
        this.isConnected = false;
      });

      this.socket.on('nft.updated', (event: NftUpdatedEvent) => {
        this.handleNftUpdated(event);
      });

      this.socket.on('order.updated', (event: OrderUpdatedEvent) => {
        this.handleOrderUpdated(event);
      });
    } catch (err) {
      console.warn('[SocketService] Aviso ao inicializar socket.io-client:', err);
    }

    // Listener complementar para eventos despachados pelo handler MSW no mesmo contexto
    window.addEventListener('kurio:socket:nft.updated', ((e: CustomEvent<NftUpdatedEvent>) => {
      this.handleNftUpdated(e.detail);
    }) as EventListener);

    window.addEventListener('kurio:socket:order.updated', ((e: CustomEvent<OrderUpdatedEvent>) => {
      this.handleOrderUpdated(e.detail);
    }) as EventListener);
  }

  /**
   * Dispara atualização de NFT pelo cliente Socket.IO (interceptado por @mswjs/socket.io-binding)
   */
  public emitNftUpdate(data: Partial<NftUpdatedEvent> & { id: string }) {
    const event: NftUpdatedEvent = {
      version: data.version ?? Date.now(),
      timestamp: new Date().toISOString(),
      ...data,
    };

    if (this.socket && this.socket.connected) {
      this.socket.emit('client:trigger:nft.updated', event);
    }
    this.handleNftUpdated(event);
  }

  /**
   * Dispara atualização de pedido pelo cliente Socket.IO
   */
  public emitOrderUpdate(
    data: Partial<OrderUpdatedEvent> & {
      orderId: string;
      status: 'pending' | 'confirmed' | 'failed';
    }
  ) {
    const event: OrderUpdatedEvent = {
      version: data.version ?? Date.now(),
      timestamp: new Date().toISOString(),
      ...data,
    };

    if (this.socket && this.socket.connected) {
      this.socket.emit('client:trigger:order.updated', event);
    }
    this.handleOrderUpdated(event);
  }

  private handleNftUpdated(event: NftUpdatedEvent) {
    if (!event || !event.id) return;

    // Tolerância a duplicatas e descarte de eventos obsoletos (versão monotônica)
    const lastVersion = this.lastVersions.get(`nft_${event.id}`) || 0;
    if (event.version && event.version <= lastVersion) {
      return;
    }

    if (event.version) {
      this.lastVersions.set(`nft_${event.id}`, event.version);
    }

    for (const callback of this.nftSubscribers) {
      try {
        callback(event);
      } catch (err) {
        console.error('[SocketService] Erro em subscriber de nft.updated:', err);
      }
    }
  }

  private handleOrderUpdated(event: OrderUpdatedEvent) {
    if (!event || !event.orderId) return;

    const lastVersion = this.lastVersions.get(`order_${event.orderId}`) || 0;
    if (event.version && event.version <= lastVersion) {
      return;
    }

    if (event.version) {
      this.lastVersions.set(`order_${event.orderId}`, event.version);
    }

    for (const callback of this.orderSubscribers) {
      try {
        callback(event);
      } catch (err) {
        console.error('[SocketService] Erro em subscriber de order.updated:', err);
      }
    }
  }

  public onNftUpdated(callback: NftUpdatedCallback): () => void {
    this.nftSubscribers.add(callback);
    return () => {
      this.nftSubscribers.delete(callback);
    };
  }

  public onOrderUpdated(callback: OrderUpdatedCallback): () => void {
    this.orderSubscribers.add(callback);
    return () => {
      this.orderSubscribers.delete(callback);
    };
  }

  public onReconnect(callback: ReconnectCallback): () => void {
    this.reconnectSubscribers.add(callback);
    return () => {
      this.reconnectSubscribers.delete(callback);
    };
  }

  /**
   * Simula desconexão e reconexão para reconciliação com a API REST (Seção 7)
   */
  public simulateReconnect() {
    this.isConnected = false;
    if (this.socket) {
      this.socket.disconnect();
      this.socket.connect();
    }
    this.isConnected = true;
    for (const cb of this.reconnectSubscribers) {
      try {
        cb();
      } catch {}
    }
  }

  /**
   * Limpa estado de versões ao encerrar ou trocar de sessão (Seção 3 e 7)
   */
  public clearSessionState() {
    this.lastVersions.clear();
  }

  public getStatus() {
    return {
      isConnected: this.isConnected,
      lastVersions: Object.fromEntries(this.lastVersions),
    };
  }
}

export const socketService = new SocketService();

if (typeof window !== 'undefined') {
  socketService.init();

  (window as any).__kurio_emit_nft_update = (data: Partial<NftUpdatedEvent> & { id: string }) => {
    socketService.emitNftUpdate(data);
  };

  (window as any).__kurio_emit_order_update = (
    data: Partial<OrderUpdatedEvent> & {
      orderId: string;
      status: 'pending' | 'confirmed' | 'failed';
    }
  ) => {
    socketService.emitOrderUpdate(data);
  };

  (window as any).__kurio_simulate_reconnect = () => {
    socketService.simulateReconnect();
  };
}
