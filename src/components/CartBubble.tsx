"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

export function CartBubble() {
  const { itemCount, toggleDrawer } = useCart();

  return (
    <button
      id="cart-bubble"
      onClick={toggleDrawer}
      aria-label={`Open cart (${itemCount} items)`}
      className="fixed bottom-24 right-5 z-50 flex items-center justify-center w-12 h-12 rounded-full bg-white text-black shadow-lg hover:scale-105 active:scale-95 transition-transform duration-200"
    >
      <ShoppingCart className="w-5 h-5" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-zinc-900 text-white text-[10px] font-bold font-mono border-2 border-white">
          {itemCount > 9 ? "9+" : itemCount}
        </span>
      )}
    </button>
  );
}
