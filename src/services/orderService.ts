import { api } from './api';
import { CreateOrderRequest, OrderReceipt } from '@/types/order';

export const orderService = {
  async createOrder(data: CreateOrderRequest): Promise<OrderReceipt> {
    const response = await api.post<OrderReceipt>('/orders', data, {
      headers: {
        'Idempotency-Key': data.idempotencyKey,
      },
    });
    return response.data;
  },

  async getOrder(orderId: string): Promise<OrderReceipt> {
    const response = await api.get<OrderReceipt>(`/orders/${orderId}`);
    return response.data;
  },
};
