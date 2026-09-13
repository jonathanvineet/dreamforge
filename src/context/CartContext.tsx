"use client";

import React, { createContext, useContext, useEffect, useReducer } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type FilamentColor = "black" | "white" | "grey" | "special";
export type LayerHeight = "0.20mm" | "0.12mm" | "0.28mm";

export interface CartItem {
  productId: string;
  title: string;
  image: string | null;
  category: string;
  basePrice: number;       // ₹ INR base from Supabase
  dimensions: string | null;
  // per-item print options
  quantity: number;
  filamentColor: FilamentColor;
  specialColorNote: string;
  layerHeight: LayerHeight;
  postFinish: string;
  lineTotal: number;       // computed = (basePrice + finishSurcharge) × quantity
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: Omit<CartItem, "lineTotal"> }
  | { type: "REMOVE_ITEM"; productId: string }
  | { type: "UPDATE_ITEM"; productId: string; patch: Partial<Omit<CartItem, "productId" | "lineTotal">> }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_DRAWER" }
  | { type: "OPEN_DRAWER" }
  | { type: "CLOSE_DRAWER" }
  | { type: "HYDRATE"; items: CartItem[] };

// ─── Helpers ──────────────────────────────────────────────────────────────────

const FINISH_SURCHARGE: Record<string, number> = {
  "Standard Raw Print": 0,
  "Hand-Sanded & Smoothed": 90,
  "Primer Coated & Ready to Paint": 160,
};

function computeLineTotal(item: Omit<CartItem, "lineTotal">): number {
  const surcharge = FINISH_SURCHARGE[item.postFinish] ?? 0;
  const colorSurcharge = item.filamentColor === "special" ? 60 : 0;
  return (item.basePrice + surcharge + colorSurcharge) * item.quantity;
}

function withLineTotal(item: Omit<CartItem, "lineTotal">): CartItem {
  return { ...item, lineTotal: computeLineTotal(item) };
}

// ─── Reducer ──────────────────────────────────────────────────────────────────

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "HYDRATE":
      return { ...state, items: action.items };

    case "ADD_ITEM": {
      const exists = state.items.find((i) => i.productId === action.payload.productId);
      if (exists) {
        // Bump quantity instead of duplicating
        const updated = state.items.map((i) =>
          i.productId === action.payload.productId
            ? withLineTotal({ ...i, quantity: i.quantity + action.payload.quantity })
            : i
        );
        return { ...state, items: updated };
      }
      return { ...state, items: [...state.items, withLineTotal(action.payload)] };
    }

    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter((i) => i.productId !== action.productId) };

    case "UPDATE_ITEM": {
      const updated = state.items.map((i) => {
        if (i.productId !== action.productId) return i;
        const merged = { ...i, ...action.patch };
        return withLineTotal(merged);
      });
      return { ...state, items: updated };
    }

    case "CLEAR_CART":
      return { ...state, items: [] };

    case "TOGGLE_DRAWER":
      return { ...state, isOpen: !state.isOpen };
    case "OPEN_DRAWER":
      return { ...state, isOpen: true };
    case "CLOSE_DRAWER":
      return { ...state, isOpen: false };

    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  itemCount: number;
  subtotal: number;
  addItem: (item: Omit<CartItem, "lineTotal">) => void;
  removeItem: (productId: string) => void;
  updateItem: (productId: string, patch: Partial<Omit<CartItem, "productId" | "lineTotal">>) => void;
  clearCart: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "dreamforge_cart_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false });

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: CartItem[] = JSON.parse(raw);
        dispatch({ type: "HYDRATE", items: parsed });
      }
    } catch {
      // Corrupt storage — ignore
    }
  }, []);

  // Persist to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch {
      // Storage full or private mode — ignore
    }
  }, [state.items]);

  const itemCount = state.items.reduce((acc, i) => acc + i.quantity, 0);
  const subtotal = state.items.reduce((acc, i) => acc + i.lineTotal, 0);

  const value: CartContextValue = {
    items: state.items,
    isOpen: state.isOpen,
    itemCount,
    subtotal,
    addItem: (item) => dispatch({ type: "ADD_ITEM", payload: item }),
    removeItem: (productId) => dispatch({ type: "REMOVE_ITEM", productId }),
    updateItem: (productId, patch) => dispatch({ type: "UPDATE_ITEM", productId, patch }),
    clearCart: () => dispatch({ type: "CLEAR_CART" }),
    openDrawer: () => dispatch({ type: "OPEN_DRAWER" }),
    closeDrawer: () => dispatch({ type: "CLOSE_DRAWER" }),
    toggleDrawer: () => dispatch({ type: "TOGGLE_DRAWER" }),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
