import { api } from './api';
import { CreateOrderRequest, OrderReceipt } from '@/types/order';

export const orderService = {
  async createOrder(data: CreateOrderRequest): Promise<OrderReceipt> {
    const response = await api.post<OrderReceipt>('/orders', data, {
      headers: {
        'Idempotency-Key': data.idempotencyKey,
      },
    });
    if (response?.data) {
      try {
        localStorage.setItem('kurio_last_receipt', JSON.stringify(response.data));
      } catch {}
      return response.data;
    }
    throw new Error('Resposta inválida ao criar pedido');
  },

  async getOrder(orderId: string): Promise<OrderReceipt> {
    try {
      const response = await api.get<OrderReceipt>(`/orders/${orderId}`);
      if (response?.data) {
        return response.data;
      }
    } catch (err: any) {
      // Se for 404 mas o recibo persistido do próprio orderId estiver no localStorage após refresh, recupera
      const saved = localStorage.getItem('kurio_last_receipt');
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as OrderReceipt;
          if (!orderId || parsed.orderId === orderId) {
            return parsed;
          }
        } catch {}
      }
      throw err;
    }

    throw new Error('Pedido não encontrado');
  },
};
