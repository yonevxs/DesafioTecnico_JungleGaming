import { ws } from 'msw';
import { toSocketIo } from '@mswjs/socket.io-binding';
import { NftUpdatedEvent, OrderUpdatedEvent } from '@/types/socket';

// Registro de clientes conectados simulados
const connectedClients: Array<any> = [];

// Intercepta qualquer conexao WebSocket direcionada ao Socket.IO
export const socketHandler = ws.link(/socket\.io/);

socketHandler.addEventListener('connection', (connection) => {
  try {
    const io = toSocketIo(connection);
    connectedClients.push(io.client);

    // Mensagem de boas-vindas / handshake
    io.client.emit('connected', {
      sid: `kurio_sock_${Date.now()}`,
      timestamp: new Date().toISOString(),
    });

    connection.client.addEventListener('close', () => {
      const idx = connectedClients.indexOf(io.client);
      if (idx > -1) {
        connectedClients.splice(idx, 1);
      }
    });
  } catch (err) {
    console.warn('[MSW Socket.IO] Erro ao vincular conexão Socket.IO:', err);
  }
});

/**
 * Emite o evento nft.updated para todos os clientes conectados
 */
export function broadcastNftUpdate(event: NftUpdatedEvent) {
  for (const client of connectedClients) {
    try {
      client.emit('nft.updated', event);
    } catch (e) {
      console.error('[MSW Socket.IO] Falha ao emitir nft.updated:', e);
    }
  }

  // Dual-channel dispatch para resiliência no browser
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('kurio:socket:nft.updated', { detail: event })
    );
  }
}

/**
 * Emite o evento order.updated para todos os clientes conectados
 */
export function broadcastOrderUpdate(event: OrderUpdatedEvent) {
  for (const client of connectedClients) {
    try {
      client.emit('order.updated', event);
    } catch (e) {
      console.error('[MSW Socket.IO] Falha ao emitir order.updated:', e);
    }
  }

  // Dual-channel dispatch para resiliência no browser
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('kurio:socket:order.updated', { detail: event })
    );
  }
}

// Expõe helpers na janela para testes E2E e demonstração manual
if (typeof window !== 'undefined') {
  (window as any).__kurio_emit_nft_update = (data: Partial<NftUpdatedEvent> & { id: string }) => {
    broadcastNftUpdate({
      version: Date.now(),
      timestamp: new Date().toISOString(),
      ...data,
    });
  };

  (window as any).__kurio_emit_order_update = (data: Partial<OrderUpdatedEvent> & { orderId: string; status: 'pending' | 'confirmed' | 'failed' }) => {
    broadcastOrderUpdate({
      version: Date.now(),
      timestamp: new Date().toISOString(),
      ...data,
    });
  };
}
