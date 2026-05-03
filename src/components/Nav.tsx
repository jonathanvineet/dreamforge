import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  const navLinks = [
    ["About", "#about"],
    ["Work", "#work"],
    ["Process", "#process"],
    ["Showcase", "#showcase"],
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto mt-6 flex max-w-xl items-center justify-between rounded-full bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 shadow-soft md:rounded-full">
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 pl-2">
          {navLinks.map(([l, h]) => (
            <a
              key={l}
              href={h}
              className="text-xs font-medium text-white/70 transition-colors duration-300 hover:text-white"
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

        <a
          href="#order"
          className="hidden md:block rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-black transition-transform duration-300 ease-out-soft hover:scale-[1.05]"
        >
          Start a Project
        </a>
      </div>

      {/* Mobile Menu */}
      {isOpen && isMobile && (
        <div className="md:hidden mt-2 mx-auto max-w-xl rounded-lg bg-black/80 backdrop-blur-md border border-white/10 p-4 space-y-3">
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
          <a
            href="#order"
            className="block rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition-transform duration-300 ease-out-soft hover:scale-[1.05] text-center"
            onClick={() => setIsOpen(false)}
          >
            Start a Project
          </a>
        </div>
      )}
    </header>
  );
}
