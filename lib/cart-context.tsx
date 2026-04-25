'use client';
import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Product, CartItem } from '@/types';

type CartState = { items: CartItem[]; isOpen: boolean };
type CartAction =
  | { type: 'ADD'; product: Product; color?: string }
  | { type: 'REMOVE'; id: string; color?: string }
  | { type: 'UPDATE_QTY'; id: string; quantity: number; color?: string }
  | { type: 'CLEAR' }
  | { type: 'LOAD'; items: CartItem[] };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | null>(null);

function cartKey(id: string, color?: string) { return `${id}__${color ?? 'default'}`; }

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD': {
      const key      = cartKey(action.product.id, action.color);
      const existing = state.items.find(i => cartKey(i.id, i.selectedColor) === key);
      const items    = existing
        ? state.items.map(i => cartKey(i.id, i.selectedColor) === key ? { ...i, quantity: i.quantity + 1 } : i)
        : [...state.items, { ...action.product, quantity: 1, selectedColor: action.color }];
      return { ...state, items };
    }
    case 'REMOVE':
      return { ...state, items: state.items.filter(i => cartKey(i.id, i.selectedColor) !== cartKey(action.id, action.color)) };
    case 'UPDATE_QTY': {
      const key = cartKey(action.id, action.color);
      return {
        ...state,
        items: action.quantity < 1
          ? state.items.filter(i => cartKey(i.id, i.selectedColor) !== key)
          : state.items.map(i => cartKey(i.id, i.selectedColor) === key ? { ...i, quantity: action.quantity } : i),
      };
    }
    case 'CLEAR':  return { ...state, items: [] };
    case 'LOAD':   return { ...state, items: action.items };
    default:       return state;
  }
}

const STORAGE_KEY = 'pf_cart_v2';

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: 'LOAD', items: JSON.parse(raw) });
    } catch (_) {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items)); } catch (_) {}
  }, [state.items]);

  return <CartContext.Provider value={{ state, dispatch }}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be inside CartProvider');
  return ctx;
}
