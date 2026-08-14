import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { X, ZoomIn, ArrowRight, ArrowLeft, Sparkles, Filter } from "lucide-react";
import { PRINT_PROJECTS, ProjectItem } from "@/components/BentoShowcase";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CursorDot } from "@/components/CursorDot";

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
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Project Gallery — DreamForge 3D Printing";
  }, []);

  // Filter projects based on active tab
  const filteredProjects =
    activeCategory === "All Projects"
      ? PRINT_PROJECTS
      : PRINT_PROJECTS.filter((p) => p.category === activeCategory);

  const handleOpenOrder = (title: string) => {
    setSelectedProject(null);
    window.location.href = `/#order`;
  };

  return (
    <main className="relative min-h-screen overflow-x-clip bg-background text-foreground pb-16">
      <CursorDot />
      
      <header className="relative z-20 w-full px-6 lg:px-12 pt-6 pb-12 flex items-center justify-end font-mono text-xs tracking-wider">
        <nav className="hidden md:flex items-center gap-8 uppercase text-xs font-medium text-zinc-500">
          <a href="/#about" className="hover:text-black transition-colors tracking-widest">ABOUT</a>
          <a href="/#categories" className="hover:text-black transition-colors tracking-widest">SERVICES</a>
          <a href="/projects" className="text-black font-semibold transition-colors tracking-widest">PORTFOLIO</a>
          <a href="/#process" className="hover:text-black transition-colors tracking-widest">PROCESS</a>
          <button 
            onClick={() => { window.location.href = '/#order' }}
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 grid-flow-dense gap-4 sm:gap-5 auto-rows-[220px] sm:auto-rows-[250px] md:auto-rows-[280px]">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className={`group relative cursor-pointer overflow-hidden rounded-2xl border border-foreground/10 bg-surface/40 transition-all duration-300 hover:border-foreground/40 hover:shadow-lift ${
                project.spanClass || ""
              }`}
            >
              <img
                src={project.image}
                alt={project.title}
                loading="lazy"
                className="w-full h-full object-cover object-center transition-transform duration-500 ease-out-soft group-hover:scale-105"
              />

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
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="relative w-full max-w-xl overflow-hidden rounded-3xl bg-background border border-foreground/15 p-5 sm:p-6 shadow-lift text-foreground"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-surface border border-foreground/10 text-foreground transition-colors hover:bg-foreground hover:text-background"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-4">
              <div className="overflow-hidden rounded-2xl border border-foreground/10 bg-muted/20">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-auto max-h-[440px] object-contain object-center rounded-2xl mx-auto"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    {selectedProject.category}
                  </span>
                  <h3 className="display text-xl sm:text-2xl font-normal">
                    {selectedProject.title}
                  </h3>
                </div>

                <button
                  onClick={() => handleOpenOrder(selectedProject.title)}
                  className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-xs font-semibold text-background transition-transform duration-200 hover:scale-[1.03]"
                >
                  <span>Request Print</span>
                  <ArrowRight className="w-3.5 h-3.5" />
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
