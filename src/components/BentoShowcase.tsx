import { useState } from "react";
import { X, ZoomIn, ArrowRight, ShoppingCart } from "lucide-react";
import { useFeaturedProducts, CatalogueProduct } from "@/lib/catalogue";
import { useCart } from "@/context/CartContext";

export function BentoShowcase() {
  const { products: featuredProjects, loading } = useFeaturedProducts();
  const { addItem, openDrawer } = useCart();
  const [selectedProject, setSelectedProject] = useState<CatalogueProduct | null>(null);

  // Modal State
  const [qty, setQty] = useState(1);
  const [color, setColor] = useState<"black" | "white" | "grey" | "special">("black");

  const handleOpenOrder = (title: string) => {
    setSelectedProject(null);
    const orderElem = document.getElementById("order");
    if (orderElem) {
      orderElem.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => {
        const inputElem = document.getElementById("project-details") as HTMLTextAreaElement | null;
        if (inputElem) {
          inputElem.value = `Hi Dream Forge! I would like to inquire about a custom version of: "${title}".`;
          inputElem.focus();
        }
      }, 500);
    }
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
    <section id="project-showcase" className="relative py-20 md:py-28 bg-background overflow-hidden border-t border-foreground/5">
      {/* Ambient background accent */}
      <div className="pointer-events-none absolute left-1/2 top-1/4 -translate-x-1/2 -z-10 h-[350px] w-[550px] rounded-full blur-[120px] opacity-20 bg-gradient-to-tr from-amber-500/20 to-orange-400/10" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="mb-10">
          <h2 className="display text-3xl sm:text-4xl md:text-5xl text-foreground font-normal tracking-tight">
            Project Showcase.
          </h2>
        </div>

        {/* Curated Grid with Fade-Out Transition */}
        <div className="relative mt-8">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <span className="text-sm font-mono text-foreground/50 animate-pulse">Loading showcase...</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 grid-flow-dense gap-4 sm:gap-5 auto-rows-[220px] sm:auto-rows-[250px]">
              {featuredProjects.map((project) => (
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

                  {/* Minimal Dark Hover Overlay */}
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

          {/* Gradient Fade Overlay & Show More Button */}
          <div className="absolute inset-x-0 bottom-0 flex h-64 items-end justify-center bg-gradient-to-t from-background via-background/90 to-transparent pb-8 pointer-events-none">
            <a
              href="/projects"
              className="pointer-events-auto group relative inline-flex items-center gap-3 rounded-full bg-foreground px-8 py-4 text-sm font-bold text-background shadow-lift transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_12px_30px_rgba(0,0,0,0.25)]"
            >
              <span>Show More Projects</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
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
    </section>
  );
}
