import { useState, useEffect } from 'react';
import { NftItem } from '@/types/nft';
import { mockNfts } from '@/mocks/data/nfts';

export interface CartItem {
  nft: NftItem;
  quantity: number;
  addedAt: string;
}

export interface Coupon {
  code: string;
  discountPercentage: number;
  description: string;
}

const CART_STORAGE_KEY = 'kurio_cart_items_v2';
const COUPON_STORAGE_KEY = 'kurio_cart_coupon_v2';

// Cupons simulados
export const VALID_COUPONS: Record<string, { discountPercentage: number; description: string }> = {
  JUNGLE10: { discountPercentage: 10, description: '10% de desconto especial Jungle Gaming' },
  KURIO20: { discountPercentage: 20, description: '20% de desconto da comunidade Kurio' },
  GENESIS5: { discountPercentage: 5, description: '5% de desconto de lançamento' },
};

// Precisão de string decimal ETH
export function parseEth(val: string | number): number {
  return typeof val === 'number' ? val : parseFloat(val) || 0;
}

export function formatEthString(val: number, decimals: number = 3): string {
  // Evita problemas de notação científica ou ponto flutuante estranho
  return (Math.round(val * 1000) / 1000).toFixed(decimals).replace(/\.?0+$/, (match) => {
    // Mantém pelo menos 2 casas decimais se for ex: 2.30
    return match.length === 2 ? '0' : '';
  });
}

// Inicialização com itens padrão caso o carrinho esteja vazio na primeira visita
const DEFAULT_INITIAL_ITEMS: CartItem[] = [
  { nft: mockNfts.find(i => i.id === 'emerald-ape-042') || mockNfts[0], quantity: 2, addedAt: new Date().toISOString() },
  { nft: mockNfts.find(i => i.id === 'violet-nomad-314') || mockNfts[4], quantity: 6, addedAt: new Date().toISOString() },
  { nft: mockNfts.find(i => i.id === 'ivory-baron-088') || mockNfts[5], quantity: 9, addedAt: new Date().toISOString() },
];

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return DEFAULT_INITIAL_ITEMS;
    } catch {
      return DEFAULT_INITIAL_ITEMS;
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(() => {
    try {
      const saved = localStorage.getItem(COUPON_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [couponError, setCouponError] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Falha ao salvar carrinho no localStorage', e);
    }
  }, [items]);

  useEffect(() => {
    try {
      if (appliedCoupon) {
        localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem(COUPON_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Falha ao salvar cupom no localStorage', e);
    }
  }, [appliedCoupon]);

  // Cálculos precisos de valores
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Subtotal = soma de (preço do item * quantidade)
  const subtotalNumber = items.reduce((sum, item) => {
    return sum + (parseEth(item.nft.priceEth) * item.quantity);
  }, 0);
  const subtotalEth = subtotalNumber.toFixed(2);

  // Desconto calculado
  const discountRate = appliedCoupon ? appliedCoupon.discountPercentage / 100 : 0;
  const discountNumber = subtotalNumber * discountRate;
  const discountEth = discountNumber > 0 ? discountNumber.toFixed(2) : '00.00';

  // Taxa de rede estimada
  const networkFeeNumber = items.length > 0 ? 0.016 : 0;
  const networkFeeEth = networkFeeNumber > 0 ? '0.016' : '0.000';

  // Total final = Subtotal - Desconto + Taxa de Rede
  const totalNumber = Math.max(0, subtotalNumber - discountNumber + networkFeeNumber);
  const totalEth = totalNumber > 0 ? totalNumber.toFixed(3) : '0.000';

  const addItem = (nft: NftItem, quantity = 1) => {
    setItems(prev => {
      const existingIndex = prev.findIndex(i => i.nft.id === nft.id);
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        };
        return next;
      }
      return [...prev, { nft, quantity, addedAt: new Date().toISOString() }];
    });
  };

  const removeItem = (nftId: string) => {
    setItems(prev => prev.filter(i => i.nft.id !== nftId));
  };

  const updateQuantity = (nftId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(nftId);
      return;
    }
    setItems(prev => prev.map(i => i.nft.id === nftId ? { ...i, quantity } : i));
  };

  const applyCoupon = (code: string): boolean => {
    const cleanCode = code.trim().toUpperCase();
    setCouponError(null);

    if (!cleanCode) {
      setCouponError('Informe um código promocional');
      return false;
    }

    if (cleanCode === 'EXPIRADO') {
      setCouponError('Este código promocional expirou');
      return false;
    }

    const found = VALID_COUPONS[cleanCode];
    if (found) {
      setAppliedCoupon({
        code: cleanCode,
        discountPercentage: found.discountPercentage,
        description: found.description,
      });
      return true;
    } else {
      setCouponError('Código promocional inválido');
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
  };

  return {
    items,
    totalCount,
    subtotalEth,
    discountEth,
    networkFeeEth,
    totalEth,
    appliedCoupon,
    couponError,
    addItem,
    removeItem,
    updateQuantity,
    applyCoupon,
    removeCoupon,
    clearCart,
  };
}
