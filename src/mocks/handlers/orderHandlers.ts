import { http, HttpResponse, delay } from 'msw';
import { CreateOrderRequest, OrderReceipt } from '@/types/order';
import { updateMockNftPrice, resetNftMocks } from './nftHandlers';
import { broadcastOrderUpdate } from './socketHandler';

interface StoredOrderEntry {
  payloadSignature: string;
  receipt: OrderReceipt;
}

// Banco em memória de pedidos processados indexados por idempotencyKey
const ordersByIdempotencyKey = new Map<string, StoredOrderEntry>();
const ordersById = new Map<string, OrderReceipt>();

export function resetOrderMocks() {
  ordersByIdempotencyKey.clear();
  ordersById.clear();
}

function computePayloadSignature(body: CreateOrderRequest): string {
  const itemsPart = (body.items || [])
    .map((i) => `${i.nft.id}:${i.quantity}`)
    .sort()
    .join('|');
  return `${itemsPart}__${body.totalEth}__${body.collector?.email || ''}`;
}

export const orderHandlers = [
  // Criação de Pedido com Chave de Idempotência e validação de conflito (Seção 5)
  http.post('/api/orders', async ({ request }) => {
    await delay(350);

    const idempotencyKey =
      request.headers.get('Idempotency-Key') || `idemp-${Date.now()}`;
    const body = (await request.json()) as CreateOrderRequest;
    const incomingSignature = computePayloadSignature(body);

    // Cenário de Idempotência: se já existe pedido para esta chave
    if (ordersByIdempotencyKey.has(idempotencyKey)) {
      const existing = ordersByIdempotencyKey.get(idempotencyKey)!;

      // Reutilizar a mesma chave com conteúdo diferente deve gerar 409 Conflict (Seção 5)
      if (existing.payloadSignature !== incomingSignature) {
        return HttpResponse.json(
          {
            message:
              'Conflito de idempotência: esta chave já foi utilizada para um pedido com parâmetros diferentes.',
            code: 'IDEMPOTENCY_CONFLICT',
          },
          { status: 409 }
        );
      }

      // Mesma tentativa recupera exatamente o mesmo pedido sem duplicar
      return HttpResponse.json(existing.receipt, { status: 200 });
    }

    // Simulação de recusa caso o email ou endereço contenha "recusar" ou "rejected"
    const isRejectedScenario =
      body.collector.email?.toLowerCase().includes('recusar') ||
      body.collector.email?.toLowerCase().includes('rejected') ||
      body.collector.walletAddress?.toLowerCase().includes('recusar');

    // Simulação de pedido inicialmente pendente caso notes/email contenha "pendente"
    const isPendingScenario =
      body.collector.email?.toLowerCase().includes('pendente') ||
      body.collector.notes?.toLowerCase().includes('pendente');

    const status = isRejectedScenario
      ? 'rejected'
      : isPendingScenario
      ? 'pending'
      : 'confirmed';

    const receipt: OrderReceipt = {
      orderId: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      transactionHash: `0x${Array.from({ length: 64 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join('')}`,
      idempotencyKey,
      status,
      createdAt: new Date().toISOString(),
      collector: body.collector,
      items: body.items,
      subtotalEth: body.subtotalEth,
      discountEth: body.discountEth,
      networkFeeEth: body.networkFeeEth,
      totalEth: body.totalEth,
      couponCode: body.couponCode,
    };

    ordersByIdempotencyKey.set(idempotencyKey, {
      payloadSignature: incomingSignature,
      receipt,
    });
    ordersById.set(receipt.orderId, receipt);

    if (isRejectedScenario) {
      broadcastOrderUpdate({
        orderId: receipt.orderId,
        status: 'failed',
        version: Date.now(),
        timestamp: new Date().toISOString(),
      });
      return HttpResponse.json(
        {
          message:
            'Pagamento recusado pela carteira conectada ou saldo insuficiente para cobrir taxas de rede.',
          code: 'PAYMENT_REJECTED',
          receipt,
        },
        { status: 400 }
      );
    }

    // Atualiza disponibilidade dos NFTs comprados quando confirmado
    if (status === 'confirmed') {
      for (const item of body.items || []) {
        const currentAvail =
          item.nft.availableEditions ?? item.nft.availableQuantity ?? 20;
        const nextAvail = Math.max(0, currentAvail - item.quantity);
        updateMockNftPrice(item.nft.id, undefined, nextAvail, nextAvail === 0);
      }
    }

    // Salva o último recibo confirmado/pendente no localStorage para sustentação de refresh
    try {
      localStorage.setItem('kurio_last_receipt', JSON.stringify(receipt));
    } catch {}

    broadcastOrderUpdate({
      orderId: receipt.orderId,
      status: status === 'confirmed' ? 'confirmed' : 'pending',
      transactionHash: receipt.transactionHash,
      version: Date.now(),
      timestamp: new Date().toISOString(),
    });

    return HttpResponse.json(receipt, { status: 201 });
  }),

  // Consulta de Pedido por ID
  http.get('/api/orders/:orderId', async ({ params }) => {
    await delay(150);
    const { orderId } = params as { orderId: string };

    if (ordersById.has(orderId)) {
      return HttpResponse.json(ordersById.get(orderId)!);
    }

    for (const entry of ordersByIdempotencyKey.values()) {
      if (entry.receipt.orderId === orderId) {
        return HttpResponse.json(entry.receipt);
      }
    }

    return HttpResponse.json({ message: 'Pedido não encontrado' }, { status: 404 });
  }),

  // Endpoint de Reset Completo dos Mocks (Seção 6 e 12)
  http.post('/api/mock/reset', async () => {
    resetNftMocks();
    resetOrderMocks();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('kurio_mock_scenario');
      localStorage.removeItem('kurio_mock_like_error');
      localStorage.removeItem('kurio_last_receipt');
    }
    return HttpResponse.json({
      success: true,
      message: 'Estado dos mocks restaurado para o cenário padrão.',
    });
  }),
];

export function updateStoredOrderStatus(
  orderId: string,
  status: 'pending' | 'confirmed' | 'rejected'
) {
  const existing = ordersById.get(orderId);
  if (existing) {
    existing.status = status;
    ordersById.set(orderId, existing);
    try {
      localStorage.setItem('kurio_last_receipt', JSON.stringify(existing));
    } catch {}
  }
}
