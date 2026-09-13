import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { DreamForgeLogo } from "./DreamForgeLogo";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

export function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const { itemCount, toggleDrawer } = useCart();

  const navLinks = [
    ["About", "/#about"],
    ["Projects", "/projects"],
    ["Services", "/#categories"],
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4">
      <div className="mx-auto mt-6 flex max-w-3xl items-center justify-between rounded-full bg-black/60 backdrop-blur-md border border-white/15 px-5 py-2.5 shadow-xl">
        {/* Brand Logo & Name */}
        <a href="/" className="flex items-center gap-2.5 group">
          <DreamForgeLogo className="w-8 h-8 transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_0_8px_rgba(0,240,255,0.4)]" />
          <span className="text-sm font-bold tracking-tight text-white group-hover:text-cyan-400 transition-colors">
            DreamForge
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map(([l, h]) => (
            <a
              key={l}
              href={h}
              className="text-xs font-medium text-white/80 transition-colors duration-300 hover:text-white"
            >
              {l}
            </a>
          ))}
        </nav>

        {/* Mobile Hamburger Menu */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Toggle navigation menu"
        >
          <span
            className={`block w-5 h-0.5 bg-white transition-all duration-300 ${
              isOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-white transition-all duration-300 ${
              isOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-white transition-all duration-300 ${
              isOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>

        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={toggleDrawer}
            className="relative flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
            aria-label={`Open cart (${itemCount} items)`}
          >
            <ShoppingCart className="w-4 h-4" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500 text-white text-[10px] font-bold font-mono">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </button>
          <a
            href="/#order"
            className="rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-black transition-transform duration-300 ease-out-soft hover:scale-[1.05]"
          >
            Start a Project
          </a>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && isMobile && (
        <div className="md:hidden mt-2 mx-auto max-w-xl rounded-2xl bg-black/90 backdrop-blur-md border border-white/10 p-5 space-y-4 shadow-2xl">
          <nav className="flex flex-col gap-3">
            {navLinks.map(([l, h]) => (
              <a
                key={l}
                href={h}
                className="text-sm font-medium text-white/70 transition-colors duration-300 hover:text-white block"
                onClick={() => setIsOpen(false)}
              >
                {l}
              </a>
            ))}
          </nav>
          
          <div className="border-t border-white/10 pt-4 flex items-center gap-4">
            <button
              onClick={() => { setIsOpen(false); toggleDrawer(); }}
              className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white shrink-0"
              aria-label={`Open cart (${itemCount} items)`}
            >
              <ShoppingCart className="w-4 h-4" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500 text-white text-[10px] font-bold font-mono">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </button>
            <a
              href="/#order"
              className="flex-1 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition-transform duration-300 ease-out-soft hover:scale-[1.05] text-center"
              onClick={() => setIsOpen(false)}
            >
              Start a Project
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
