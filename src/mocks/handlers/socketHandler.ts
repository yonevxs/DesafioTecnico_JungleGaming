import { ws } from 'msw';
import { toSocketIo } from '@mswjs/socket.io-binding';
import { NftUpdatedEvent, OrderUpdatedEvent } from '@/types/socket';
import { updateMockNftPrice } from './nftHandlers';
import { updateStoredOrderStatus } from './orderHandlers';

// Registro de clientes Socket.IO conectados via @mswjs/socket.io-binding
const connectedClients: Array<any> = [];

// Intercepta conexões WebSocket do socket.io-client na mesma origem ou qualquer host
const socketLink = ws.link(/socket\.io/);

export const socketHandler = socketLink.addEventListener('connection', (connection) => {
  try {
    const io = toSocketIo(connection);
    connectedClients.push(io.client);

    // Handshake de boas-vindas
    io.client.emit('connected', {
      sid: `kurio_sock_${Date.now()}`,
      timestamp: new Date().toISOString(),
    });

    // Permite que o cliente ou testes solicitem emissão pelo protocolo Socket.IO
    io.client.on('client:trigger:nft.updated', (_event, payload: NftUpdatedEvent) => {
      broadcastNftUpdate(payload);
    });

    io.client.on('client:trigger:order.updated', (_event, payload: OrderUpdatedEvent) => {
      broadcastOrderUpdate(payload);
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
 * Emite o evento nft.updated para todos os clientes socket.io-client conectados
 * e mantém o estado REST do MSW sincronizado (Seção 6 e 7)
 */
export function broadcastNftUpdate(event: NftUpdatedEvent) {
  if (event?.id) {
    updateMockNftPrice(
      event.id,
      event.priceEth,
      event.availableQuantity,
      event.isSoldOut
    );
  }

  for (const client of connectedClients) {
    try {
      client.emit('nft.updated', event);
    } catch (e) {
      console.error('[MSW Socket.IO] Falha ao emitir nft.updated:', e);
    }
  }

  // Fallback complementar caso o ServiceWorker ainda esteja inicializando
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('kurio:socket:nft.updated', { detail: event })
    );
  }
}

/**
 * Emite o evento order.updated para todos os clientes socket.io-client conectados
 * e atualiza o status do pedido no MSW REST
 */
export function broadcastOrderUpdate(event: OrderUpdatedEvent) {
  if (event?.orderId && event?.status) {
    updateStoredOrderStatus(
      event.orderId,
      event.status === 'failed' ? 'rejected' : event.status
    );
  }

  for (const client of connectedClients) {
    try {
      client.emit('order.updated', event);
    } catch (e) {
      console.error('[MSW Socket.IO] Falha ao emitir order.updated:', e);
    }
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('kurio:socket:order.updated', { detail: event })
    );
  }
}
