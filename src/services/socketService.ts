import { io, Socket } from 'socket.io-client';
import { NftUpdatedEvent, OrderUpdatedEvent } from '@/types/socket';

type NftUpdatedCallback = (event: NftUpdatedEvent) => void;
type OrderUpdatedCallback = (event: OrderUpdatedEvent) => void;

class SocketService {
  private socket: Socket | null = null;
  private isConnected = false;
  private lastVersions: Map<string, number> = new Map();
  private nftSubscribers: Set<NftUpdatedCallback> = new Set();
  private orderSubscribers: Set<OrderUpdatedCallback> = new Set();
  private isInitialized = false;

  public init() {
    if (this.isInitialized || typeof window === 'undefined') return;
    this.isInitialized = true;

    try {
      const socketUrl = window.location.origin;
      this.socket = io(socketUrl, {
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
        timeout: 5000,
      });

      this.socket.on('connect', () => {
        this.isConnected = true;
        console.log('[SocketService] Conectado ao servidor Socket.IO');
      });

      this.socket.on('disconnect', (reason) => {
        this.isConnected = false;
        console.log('[SocketService] Desconectado do Socket.IO:', reason);
      });

      // Evento obrigatório: nft.updated
      this.socket.on('nft.updated', (event: NftUpdatedEvent) => {
        this.handleNftUpdated(event);
      });

      // Evento obrigatório: order.updated
      this.socket.on('order.updated', (event: OrderUpdatedEvent) => {
        this.handleOrderUpdated(event);
      });
    } catch (err) {
      console.warn('[SocketService] Não foi possível iniciar o cliente Socket.IO:', err);
    }

    // Ouvinte dual-channel de eventos via CustomEvent
    window.addEventListener('kurio:socket:nft.updated', ((e: CustomEvent<NftUpdatedEvent>) => {
      this.handleNftUpdated(e.detail);
    }) as EventListener);

    window.addEventListener('kurio:socket:order.updated', ((e: CustomEvent<OrderUpdatedEvent>) => {
      this.handleOrderUpdated(e.detail);
    }) as EventListener);
  }

  private handleNftUpdated(event: NftUpdatedEvent) {
    if (!event || !event.id) return;

    // Tolerância a duplicatas e descarte de eventos obsoletos (versão monotônica)
    const lastVersion = this.lastVersions.get(`nft_${event.id}`) || 0;
    if (event.version && event.version <= lastVersion) {
      console.warn(`[SocketService] Descartando nft.updated obsoleto ou duplicado para ${event.id} (v${event.version} <= v${lastVersion})`);
      return;
    }

    if (event.version) {
      this.lastVersions.set(`nft_${event.id}`, event.version);
    }

    // Notifica os inscritos
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
      console.warn(`[SocketService] Descartando order.updated obsoleto ou duplicado para ${event.orderId}`);
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

  /**
   * Inscreve um callback para eventos nft.updated
   * Retorna uma função para cancelar a inscrição
   */
  public onNftUpdated(callback: NftUpdatedCallback): () => void {
    this.nftSubscribers.add(callback);
    return () => {
      this.nftSubscribers.delete(callback);
    };
  }

  /**
   * Inscreve um callback para eventos order.updated
   * Retorna uma função para cancelar a inscrição
   */
  public onOrderUpdated(callback: OrderUpdatedCallback): () => void {
    this.orderSubscribers.add(callback);
    return () => {
      this.orderSubscribers.delete(callback);
    };
  }

  public getStatus() {
    return {
      isConnected: this.isConnected,
    };
  }
}

export const socketService = new SocketService();
