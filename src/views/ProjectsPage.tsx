import { useState, useEffect } from "react";
import { X, ZoomIn, ArrowRight, Sparkles, ShoppingCart } from "lucide-react";
import { useProducts, CatalogueProduct, ProductCategory } from "@/lib/catalogue";
import { useCart } from "@/context/CartContext";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CursorDot } from "@/components/CursorDot";
import { DreamForgeLogo } from "@/components/DreamForgeLogo";

const CATEGORIES = [
  "All Projects",
  "Gaming & Anime",
  "Pop Culture & Sports",
  "Desk & Functional",
  "Sculptures & Decor",
  "Custom Gifts & Wearables",
] as const;

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All Projects");
  const [selectedProject, setSelectedProject] = useState<CatalogueProduct | null>(null);
  
  // Use real-time Supabase hook
  const { products, loading } = useProducts();
  const { addItem, openDrawer, itemCount, toggleDrawer } = useCart();

  // Modal State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [qty, setQty] = useState(1);
  const [color, setColor] = useState<"black" | "white" | "grey" | "special">("black");

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Project Gallery — DreamForge 3D Printing";
  }, []);

  // Filter projects based on active tab
  const filteredProjects =
    activeCategory === "All Projects"
      ? products
      : products.filter((p) => p.category === activeCategory);

  const handleGetQuote = () => {
    window.location.href = `/#order`;
  };

  const handleAddToCart = () => {
    if (!selectedProject) return;
    addItem({
      productId: selectedProject.id,
      title: selectedProject.title,
      image: selectedProject.image_url,
      category: selectedProject.category,
      basePrice: selectedProject.base_price,
      dimensions: selectedProject.dimensions,
      quantity: qty,
      filamentColor: color,
      specialColorNote: "",
      layerHeight: "0.20mm",
      postFinish: "Standard Raw Print",
    });
    setSelectedProject(null);
    openDrawer();
  };

  return (
    <main className="relative min-h-screen overflow-x-clip bg-background text-foreground pb-16">
      <CursorDot />
      
      <header className="relative z-20 w-full px-6 lg:px-12 pt-6 pb-12 flex items-center justify-between font-mono text-xs tracking-wider">
        <a href="/" className="flex items-center gap-2.5 group">
          <DreamForgeLogo className="w-8 h-8 transition-transform duration-300 group-hover:scale-105" />
          <span className="text-sm font-bold font-sans tracking-tight text-foreground">
            DreamForge
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-8 uppercase text-xs font-medium text-zinc-500">
          <a href="/#about" className="hover:text-black transition-colors tracking-widest">ABOUT</a>
          <a href="/#categories" className="hover:text-black transition-colors tracking-widest">SERVICES</a>
          <a href="/projects" className="text-black font-semibold transition-colors tracking-widest">PORTFOLIO</a>
          <a href="/#process" className="hover:text-black transition-colors tracking-widest">PROCESS</a>
          <button
            onClick={toggleDrawer}
            className="relative flex items-center justify-center w-9 h-9 rounded-full border border-black/20 hover:bg-black/10 transition-colors text-black"
            aria-label={`Open cart (${itemCount} items)`}
          >
            <ShoppingCart className="w-4 h-4" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#00E5FF] text-black text-[10px] font-bold font-mono shadow-sm">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </button>
          <button 
            onClick={handleGetQuote} 
            className="px-5 py-2 rounded-full border border-black/60 text-black hover:bg-black hover:text-white transition-all font-semibold tracking-widest cursor-pointer"
          >
            GET QUOTE
          </button>
        </nav>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 pb-24 md:pb-32">
        <div className="mb-10 space-y-6">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-foreground/5 border border-foreground/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Portfolio Showcase
                </span>
              </div>
              <h1 className="display text-4xl sm:text-5xl md:text-6xl text-foreground font-normal tracking-tight">
                Complete Project Gallery.
              </h1>
              <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
                Explore our custom 3D printed figurines, prop replicas, desk organizational gear, and high-precision prototypes.
              </p>
            </div>
          </div>
        </div>

        {/* Category Filters Bar */}
        <div className="mb-10 flex flex-wrap items-center gap-2 pb-4 border-b border-foreground/10">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-foreground text-background shadow-soft scale-[1.02]"
                    : "bg-surface/80 text-foreground-soft hover:bg-surface hover:text-foreground border border-foreground/10"
                }`}
              >
                <span>{cat}</span>
              </button>
            );
          })}
        </div>

        {/* Full Bento Grid */}
        <div className="relative min-h-[50vh]">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-mono text-foreground/50 animate-pulse">Loading portfolio...</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 grid-flow-dense gap-4 sm:gap-5 auto-rows-[220px] sm:auto-rows-[250px] md:auto-rows-[280px]">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => {
                    setSelectedProject(project);
                    setQty(1);
                    setColor("black");
                  }}
                  className={`group relative cursor-pointer overflow-hidden rounded-2xl border border-foreground/10 bg-surface/40 transition-all duration-300 hover:border-foreground/40 hover:shadow-lift ${
                    project.span_class || ""
                  }`}
                >
                  {project.image_url ? (
                    <img
                      src={project.image_url}
                      alt={project.title}
                      loading="lazy"
                      className="w-full h-full object-cover object-center transition-transform duration-500 ease-out-soft group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                      <ShoppingCart className="w-8 h-8 text-zinc-700" />
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-between p-4">
                    <div className="self-end">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md border border-white/30 shadow-sm">
                        <ZoomIn className="w-4 h-4" />
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-medium uppercase tracking-wider text-amber-300">
                        {project.category}
                      </span>
                      <p className="text-sm font-medium text-white drop-shadow-md truncate">
                        {project.title}
                      </p>
                      <p className="text-xs font-mono text-zinc-300 mt-1">
                        {project.base_price ? `₹${project.base_price.toLocaleString("en-IN")}` : "Price on Request"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="relative w-full max-w-3xl overflow-hidden rounded-3xl bg-background border border-foreground/15 p-5 sm:p-6 shadow-lift text-foreground flex flex-col md:flex-row gap-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-surface/80 backdrop-blur border border-foreground/10 text-foreground transition-colors hover:bg-foreground hover:text-background"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Left Col: Image */}
            <div className="w-full md:w-1/2 rounded-2xl border border-foreground/10 bg-muted/20 flex-shrink-0 flex items-center justify-center overflow-hidden">
              {selectedProject.image_url ? (
                <img
                  src={selectedProject.image_url}
                  alt={selectedProject.title}
                  className="w-full h-auto max-h-[440px] object-contain object-center rounded-2xl mx-auto"
                />
              ) : (
                <div className="py-24 text-zinc-500 font-mono text-sm">No Image</div>
              )}
            </div>

            {/* Right Col: Details & Add to Cart */}
            <div className="w-full md:w-1/2 flex flex-col pt-2 md:pt-4">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                {selectedProject.category}
              </span>
              <h3 className="display text-2xl sm:text-3xl font-normal mt-1">
                {selectedProject.title}
              </h3>
              
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-2xl font-semibold" style={{ fontFamily: "'Fraunces', ui-serif, Georgia, serif" }}>
                  {selectedProject.base_price ? `₹${selectedProject.base_price.toLocaleString("en-IN")}` : "Custom Quote"}
                </span>
                {selectedProject.base_price && <span className="text-sm font-mono text-muted-foreground">base price</span>}
              </div>

              {selectedProject.dimensions && (
                <p className="text-sm font-mono text-muted-foreground mt-2">
                  Dims: {selectedProject.dimensions}
                </p>
              )}

              {selectedProject.description && (
                <p className="text-sm text-foreground/80 mt-4 leading-relaxed">
                  {selectedProject.description}
                </p>
              )}

              {/* Configurator */}
              <div className="mt-8 space-y-5">
                <div>
                  <label className="text-xs font-mono text-muted-foreground uppercase tracking-widest block mb-2">
                    Color
                  </label>
                  <div className="flex gap-2">
                    {(["black", "white", "grey", "special"] as const).map((c) => (
                      <button
                        key={c}
                        onClick={() => setColor(c)}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          color === c ? "border-foreground scale-110" : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                        style={
                          c === "special" 
                            ? { background: "conic-gradient(red,yellow,lime,cyan,blue,magenta,red)" }
                            : { backgroundColor: c === "black" ? "#1a1a1a" : c === "white" ? "#f5f5f5" : "#9ca3af" }
                        }
                        title={c}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono text-muted-foreground uppercase tracking-widest block mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-8 h-8 rounded border border-foreground/20 flex items-center justify-center hover:bg-foreground/5">-</button>
                    <span className="w-8 text-center font-mono">{qty}</span>
                    <button onClick={() => setQty(qty + 1)} className="w-8 h-8 rounded border border-foreground/20 flex items-center justify-center hover:bg-foreground/5">+</button>
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-8 flex flex-col gap-3">
                <button
                  onClick={handleAddToCart}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-foreground text-background text-sm font-semibold py-3.5 hover:bg-foreground/90 active:scale-[0.99] transition-all"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>
                    {selectedProject.base_price 
                      ? `Add to Cart — ₹${(selectedProject.base_price * qty).toLocaleString("en-IN")}` 
                      : "Add to Request"}
                  </span>
                </button>
                <button
                  onClick={() => handleOpenOrder(selectedProject.title)}
                  className="w-full text-center text-xs font-medium text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
                >
                  Request modifications to this print ↗
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
