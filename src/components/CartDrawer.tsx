"use client";

import { useEffect, useRef } from "react";
import { X, Trash2, ShoppingCart, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";

const SHIPPING_THRESHOLD = 500; // free above ₹500
const SHIPPING_COST = 79;

export function CartDrawer() {
  const { items, isOpen, closeDrawer, removeItem, updateItem, clearCart, subtotal } = useCart();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Trap focus + close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, closeDrawer]);

  const shipping = subtotal > 0 && subtotal < SHIPPING_THRESHOLD ? SHIPPING_COST : 0;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    closeDrawer();
    const el = document.getElementById("order");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      // Trigger cart tab via custom event
      window.dispatchEvent(new CustomEvent("dreamforge:open-cart-tab"));
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[59] bg-black/60 backdrop-blur-sm"
          onClick={closeDrawer}
          aria-hidden="true"
        />
      )}

      {/* Drawer panel */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-label="Shopping cart"
        aria-modal="true"
        className={`fixed top-0 right-0 z-[60] h-full w-full max-w-md flex flex-col bg-zinc-950 border-l border-white/[0.08] shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <ShoppingCart className="w-4 h-4 text-zinc-400" />
            <span className="text-sm font-medium text-white">
              Your Cart
            </span>
            {items.length > 0 && (
              <span className="text-[11px] font-mono text-zinc-500">
                ({items.length} item{items.length > 1 ? "s" : ""})
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="text-[11px] font-mono text-zinc-500 hover:text-rose-400 transition-colors"
              >
                Clear all
              </button>
            )}
            <button
              onClick={closeDrawer}
              className="flex items-center justify-center w-8 h-8 rounded-full border border-white/[0.08] text-zinc-400 hover:text-white hover:border-white/20 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Empty state */}
        {items.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 px-8 text-center">
            <ShoppingCart className="w-10 h-10 text-zinc-700" />
            <p className="text-sm text-zinc-500">Your cart is empty.</p>
            <p className="text-xs text-zinc-600">Browse the showcase and add items to get started.</p>
            <button
              onClick={closeDrawer}
              className="mt-2 text-xs text-zinc-400 hover:text-white transition-colors underline underline-offset-2"
            >
              Continue browsing
            </button>
          </div>
        )}

        {/* Item list */}
        {items.length > 0 && (
          <div className="flex-1 overflow-y-auto py-3 px-4 space-y-3">
            {items.map((item) => (
              <div
                key={item.productId}
                className="rounded-xl border border-white/[0.07] bg-zinc-900/60 p-3.5 space-y-3"
              >
                <div className="flex items-start gap-4">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-16 h-16 rounded-lg object-cover object-center bg-zinc-800 shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-zinc-800 shrink-0 flex items-center justify-center">
                      <ShoppingCart className="w-5 h-5 text-zinc-600" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0 flex flex-col justify-between h-16">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-white truncate" title={item.title}>
                        {item.title}
                      </p>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-zinc-500 hover:text-rose-400 transition-colors p-0.5 shrink-0"
                        aria-label={`Remove ${item.title}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateItem(item.productId, { quantity: Math.max(1, item.quantity - 1) })}
                          className="w-6 h-6 flex items-center justify-center rounded bg-white/[0.04] border border-white/[0.08] text-zinc-400 hover:text-white hover:bg-white/[0.08] text-xs font-mono transition-colors"
                        >
                          −
                        </button>
                        <span className="w-4 text-center text-xs font-mono text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateItem(item.productId, { quantity: item.quantity + 1 })}
                          className="w-6 h-6 flex items-center justify-center rounded bg-white/[0.04] border border-white/[0.08] text-zinc-400 hover:text-white hover:bg-white/[0.08] text-xs font-mono transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-sm font-mono font-semibold text-white tabular-nums">
                        ₹{item.lineTotal.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/[0.06] mt-3">
                  <button
                    onClick={handleCheckout}
                    className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500 hover:text-cyan-400 transition-colors flex items-center gap-1.5"
                  >
                    Add customization notes
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-4 pb-6 pt-3 border-t border-white/[0.08] space-y-3">
            {/* CTA */}
            <button
              onClick={handleCheckout}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-white text-black text-xs font-semibold py-3 hover:bg-zinc-100 active:scale-[0.99] transition-all"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <p className="text-center text-[10px] text-zinc-600">
              Delivery details collected at checkout
            </p>
          </div>
        )}
      </div>
    </>
  );
}
