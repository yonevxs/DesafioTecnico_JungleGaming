import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { NftItem } from '@/types/nft';
import { mockNfts } from '@/mocks/data/nfts';
import { socketService } from '@/services/socketService';
import { NftUpdatedEvent } from '@/types/socket';

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

export const VALID_COUPONS: Record<string, { discountPercentage: number; description: string }> = {
  JUNGLE10: { discountPercentage: 10, description: '10% de desconto especial Jungle Gaming' },
  KURIO20: { discountPercentage: 20, description: '20% de desconto da comunidade Kurio' },
  GENESIS5: { discountPercentage: 5, description: '5% de desconto de lançamento' },
};

export function parseEth(val: string | number): number {
  return typeof val === 'number' ? val : parseFloat(val) || 0;
}

export function formatEthString(val: number, decimals: number = 3): string {
  return (Math.round(val * 1000) / 1000).toFixed(decimals).replace(/\.?0+$/, (match) => {
    return match.length === 2 ? '0' : '';
  });
}

const CART_STORAGE_KEY = 'kurio_cart_items_v2';
const COUPON_STORAGE_KEY = 'kurio_cart_coupon_v2';

const DEFAULT_INITIAL_ITEMS: CartItem[] = [
  { nft: mockNfts.find(i => i.id === 'emerald-ape-042') || mockNfts[0], quantity: 2, addedAt: new Date().toISOString() },
  { nft: mockNfts.find(i => i.id === 'violet-nomad-314') || mockNfts[4], quantity: 6, addedAt: new Date().toISOString() },
  { nft: mockNfts.find(i => i.id === 'ivory-baron-088') || mockNfts[5], quantity: 9, addedAt: new Date().toISOString() },
];

export interface CartContextType {
  items: CartItem[];
  totalCount: number;
  subtotalEth: string;
  discountEth: string;
  networkFeeEth: string;
  totalEth: string;
  appliedCoupon: Coupon | null;
  couponError: string | null;
  isQuoteOutdated: boolean;
  quoteAlert: string | null;
  addItem: (nft: NftItem, quantity?: number) => void;
  removeItem: (nftId: string) => void;
  updateQuantity: (nftId: string, quantity: number) => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  clearCart: () => void;
  reconfirmQuote: () => void;
  dismissQuoteAlert: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
  const [isQuoteOutdated, setIsQuoteOutdated] = useState(false);
  const [quoteAlert, setQuoteAlert] = useState<string | null>(null);

  // Inicializa a conexão do Socket.IO
  useEffect(() => {
    socketService.init();

    // Listener do evento nft.updated em tempo real
    const unsubscribe = socketService.onNftUpdated((event: NftUpdatedEvent) => {
      setItems((prevItems) => {
        const itemIndex = prevItems.findIndex((it) => it.nft.id === event.id);
        if (itemIndex === -1) return prevItems;

        const currentItem = prevItems[itemIndex];
        const oldPrice = currentItem.nft.priceEth;
        const newPrice = event.priceEth ?? oldPrice;

        const updatedNft: NftItem = {
          ...currentItem.nft,
          priceEth: newPrice,
          priceUsd: event.priceUsd ?? currentItem.nft.priceUsd,
          availableQuantity: event.availableQuantity ?? currentItem.nft.availableQuantity,
          totalQuantity: event.totalQuantity ?? currentItem.nft.totalQuantity,
          isSoldOut: event.isSoldOut ?? currentItem.nft.isSoldOut,
        };

        const updatedItems = [...prevItems];
        updatedItems[itemIndex] = {
          ...currentItem,
          nft: updatedNft,
        };

        // Cenário obrigatório: alteração de preço enquanto o item está no carrinho
        if (event.priceEth && event.priceEth !== oldPrice) {
          setIsQuoteOutdated(true);
          setQuoteAlert(
            `A cotação de "${updatedNft.title}" foi atualizada na rede de ${oldPrice} ETH para ${newPrice} ETH. Revalide a compra antes de finalizar.`
          );
        }

        return updatedItems;
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

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

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotalNumber = items.reduce((sum, item) => {
    return sum + (parseEth(item.nft.priceEth) * item.quantity);
  }, 0);
  const subtotalEth = subtotalNumber.toFixed(2);

  const discountRate = appliedCoupon ? appliedCoupon.discountPercentage / 100 : 0;
  const discountNumber = subtotalNumber * discountRate;
  const discountEth = discountNumber > 0 ? discountNumber.toFixed(2) : '00.00';

  const networkFeeNumber = items.length > 0 ? 0.016 : 0;
  const networkFeeEth = networkFeeNumber > 0 ? '0.016' : '0.000';

  const totalNumber = Math.max(0, subtotalNumber - discountNumber + networkFeeNumber);
  const totalEth = totalNumber > 0 ? totalNumber.toFixed(3) : '0.000';

  const addItem = useCallback((nft: NftItem, quantity = 1) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.nft.id === nft.id);
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
  }, []);

  const removeItem = useCallback((nftId: string) => {
    setItems((prev) => prev.filter((i) => i.nft.id !== nftId));
  }, []);

  const updateQuantity = useCallback((nftId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.nft.id !== nftId));
      return;
    }
    setItems((prev) => prev.map((i) => (i.nft.id === nftId ? { ...i, quantity } : i)));
  }, []);

  const applyCoupon = useCallback((code: string): boolean => {
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
  }, []);

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
    setCouponError(null);
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setAppliedCoupon(null);
    setIsQuoteOutdated(false);
    setQuoteAlert(null);
  }, []);

  const reconfirmQuote = useCallback(() => {
    setIsQuoteOutdated(false);
    setQuoteAlert(null);
  }, []);

  const dismissQuoteAlert = useCallback(() => {
    setQuoteAlert(null);
  }, []);

  return (
    <CartContext.Provider
      value={{
        items,
        totalCount,
        subtotalEth,
        discountEth,
        networkFeeEth,
        totalEth,
        appliedCoupon,
        couponError,
        isQuoteOutdated,
        quoteAlert,
        addItem,
        removeItem,
        updateQuantity,
        applyCoupon,
        removeCoupon,
        clearCart,
        reconfirmQuote,
        dismissQuoteAlert,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart deve ser utilizado dentro de um CartProvider');
  }
  return context;
};
