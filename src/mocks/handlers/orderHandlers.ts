import { http, HttpResponse, delay } from 'msw';
import { CreateOrderRequest, OrderReceipt } from '@/types/order';

// Banco em memória de pedidos processados indexados por idempotencyKey
const ordersByIdempotencyKey = new Map<string, OrderReceipt>();

export const orderHandlers = [
  // Criação de Pedido com Chave de Idempotência
  http.post('/api/orders', async ({ request }) => {
    await delay(600); // Latência simulada de rede blockchain

    const idempotencyKey = request.headers.get('Idempotency-Key') || `idemp-${Date.now()}`;
    const body = (await request.json()) as CreateOrderRequest;

    // Cenário de Idempotência: se já existe pedido para esta chave
    if (ordersByIdempotencyKey.has(idempotencyKey)) {
      const existing = ordersByIdempotencyKey.get(idempotencyKey)!;
      // Retorna exatamente o mesmo pedido sem duplicar
      return HttpResponse.json(existing, { status: 200 });
    }

    // Simulação de recusa caso o email seja "recusar@teste.com" para testes de falha
    const isRejectedScenario = body.collector.email?.toLowerCase().includes('recusar');

    const receipt: OrderReceipt = {
      orderId: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      transactionHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      idempotencyKey,
      status: isRejectedScenario ? 'rejected' : 'confirmed',
      createdAt: new Date().toISOString(),
      collector: body.collector,
      items: body.items,
      subtotalEth: body.subtotalEth,
      discountEth: body.discountEth,
      networkFeeEth: body.networkFeeEth,
      totalEth: body.totalEth,
      couponCode: body.couponCode,
    };

    ordersByIdempotencyKey.set(idempotencyKey, receipt);

    // Salva o último recibo no localStorage para sustentação de refresh
    try {
      localStorage.setItem('kurio_last_receipt', JSON.stringify(receipt));
    } catch {}

    if (isRejectedScenario) {
      return HttpResponse.json(receipt, { status: 400 });
    }

    return HttpResponse.json(receipt, { status: 201 });
  }),

  // Consulta de Pedido por ID
  http.get('/api/orders/:orderId', async ({ params }) => {
    await delay(200);
    const { orderId } = params;

    for (const receipt of ordersByIdempotencyKey.values()) {
      if (receipt.orderId === orderId) {
        return HttpResponse.json(receipt);
      }
    }

    return HttpResponse.json({ message: 'Pedido não encontrado' }, { status: 404 });
  }),
];
