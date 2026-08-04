import { useState } from "react";
import { X, ZoomIn, ArrowRight, Sparkles } from "lucide-react";

export interface ProjectItem {
  id: string;
  title: string;
  category: "Gaming & Anime" | "Pop Culture & Sports" | "Desk & Functional" | "Sculptures & Decor" | "Custom Gifts & Wearables";
  image: string;
  spanClass?: string;
}

export const PRINT_PROJECTS: ProjectItem[] = [
  { id: "car", title: "Cyberpunk Concept Car", category: "Desk & Functional", image: "/3DPrintPics/Car.png", spanClass: "col-span-2 row-span-2" },
  { id: "grogu", title: "Grogu Statue", category: "Gaming & Anime", image: "/3DPrintPics/Grogu_StarWars.png", spanClass: "col-span-1 row-span-2" },
  { id: "messi", title: "Lionel Messi Bust", category: "Pop Culture & Sports", image: "/3DPrintPics/messi1.png", spanClass: "col-span-1 row-span-1" },
  { id: "ironman-helmet", title: "Iron Man Helmet", category: "Pop Culture & Sports", image: "/3DPrintPics/ironman.jpeg", spanClass: "col-span-1 row-span-1" },
  { id: "luffy", title: "Monkey D. Luffy", category: "Gaming & Anime", image: "/3DPrintPics/Luffy.png", spanClass: "col-span-2 row-span-1" },
  { id: "harry-potter", title: "Harry Potter Bust", category: "Pop Culture & Sports", image: "/3DPrintPics/HarryPotter.png", spanClass: "col-span-1 row-span-1" },
  { id: "ronaldo", title: "Cristiano Ronaldo Bust", category: "Pop Culture & Sports", image: "/3DPrintPics/ronaldo.png", spanClass: "col-span-2 row-span-2" },
  { id: "lion", title: "Low-Poly Lion", category: "Sculptures & Decor", image: "/3DPrintPics/Lion.png", spanClass: "col-span-1 row-span-1" },
  { id: "mewtwo", title: "Mewtwo Figurine", category: "Gaming & Anime", image: "/3DPrintPics/Mewto.png", spanClass: "col-span-1 row-span-1" },
  { id: "project-hail-mary", title: "Project Hail Mary Ship", category: "Gaming & Anime", image: "/3DPrintPics/ProjectHailMary.jpeg", spanClass: "col-span-1 row-span-2" },
  { id: "controller-stand", title: "Controller Mount", category: "Desk & Functional", image: "/3DPrintPics/controllerholder.jpeg", spanClass: "col-span-2 row-span-1" },
  { id: "headphone-stand", title: "Headphone Stand", category: "Desk & Functional", image: "/3DPrintPics/headphonestand.jpeg", spanClass: "col-span-2 row-span-1" },
  { id: "cat", title: "Faceted Cat Statue", category: "Sculptures & Decor", image: "/3DPrintPics/Cat.png", spanClass: "col-span-1 row-span-1" },
  { id: "charmander", title: "Charmander Statue", category: "Gaming & Anime", image: "/3DPrintPics/Charmander.png", spanClass: "col-span-1 row-span-1" },
  { id: "pikachu", title: "Pikachu Statue", category: "Gaming & Anime", image: "/3DPrintPics/Pickachu.jpeg", spanClass: "col-span-1 row-span-1" },
  { id: "spiderman", title: "Spider-Man Figurine", category: "Pop Culture & Sports", image: "/3DPrintPics/spiderman.jpeg", spanClass: "col-span-2 row-span-2" },
  { id: "spiderman2", title: "Spider-Man Wall Pose", category: "Pop Culture & Sports", image: "/3DPrintPics/Spiderman2.jpeg", spanClass: "col-span-1 row-span-1" },
  { id: "batman-spiderman", title: "Batman & Spidey Diorama", category: "Pop Culture & Sports", image: "/3DPrintPics/batman+spiderman.jpeg", spanClass: "col-span-1 row-span-1" },
  { id: "batman0", title: "Batman Bust", category: "Pop Culture & Sports", image: "/3DPrintPics/batman0.jpeg", spanClass: "col-span-1 row-span-1" },
  { id: "batman1", title: "Tactical Batman", category: "Pop Culture & Sports", image: "/3DPrintPics/batman1.jpeg", spanClass: "col-span-1 row-span-1" },
  { id: "neymar", title: "Neymar Jr. Statue", category: "Pop Culture & Sports", image: "/3DPrintPics/neymar1.png", spanClass: "col-span-2 row-span-1" },
  { id: "zekrom", title: "Zekrom Statue", category: "Gaming & Anime", image: "/3DPrintPics/Zekram.png", spanClass: "col-span-2 row-span-1" },
  { id: "funko-pop", title: "Chibi Collectible", category: "Pop Culture & Sports", image: "/3DPrintPics/FunkoPop1.png", spanClass: "col-span-1 row-span-1" },
  { id: "film-camera-keychain", title: "Film Camera Keychain", category: "Custom Gifts & Wearables", image: "/3DPrintPics/FilmCamera_keychain.png", spanClass: "col-span-1 row-span-1" },
  { id: "ironman-keychain", title: "Iron Man Keychain", category: "Custom Gifts & Wearables", image: "/3DPrintPics/ironman_keychain.png", spanClass: "col-span-1 row-span-1" },
  { id: "slayer-keychain", title: "Slayer Mark Keychain", category: "Custom Gifts & Wearables", image: "/3DPrintPics/MarkoftheSlayer_keychain.png", spanClass: "col-span-1 row-span-1" },
  { id: "cute-keychain", title: "Kawaii Keychain", category: "Custom Gifts & Wearables", image: "/3DPrintPics/cute_keychain.jpeg", spanClass: "col-span-1 row-span-1" },
  { id: "dog", title: "Canine Statue", category: "Sculptures & Decor", image: "/3DPrintPics/Dog.png", spanClass: "col-span-1 row-span-1" },
  { id: "keys-holder-1", title: "Key Organizer", category: "Desk & Functional", image: "/3DPrintPics/KeysHolder.png", spanClass: "col-span-2 row-span-1" },
  { id: "keys-holder-2", title: "Wood Key Holder", category: "Desk & Functional", image: "/3DPrintPics/Keysholder.jpeg", spanClass: "col-span-2 row-span-1" },
  { id: "luffy22", title: "Luffy Action Figure", category: "Gaming & Anime", image: "/3DPrintPics/Luffy22.jpeg", spanClass: "col-span-1 row-span-1" },
  { id: "minions", title: "Minion Figurine", category: "Pop Culture & Sports", image: "/3DPrintPics/minions.jpeg", spanClass: "col-span-1 row-span-1" },
  { id: "clapperboard", title: "Film Clapperboard", category: "Desk & Functional", image: "/3DPrintPics/Clapperboard.jpeg", spanClass: "col-span-1 row-span-1" },
  { id: "earrings-1", title: "Geometric Earrings", category: "Custom Gifts & Wearables", image: "/3DPrintPics/earings1.jpeg", spanClass: "col-span-1 row-span-1" },
  { id: "earrings-2", title: "Spiral Earrings", category: "Custom Gifts & Wearables", image: "/3DPrintPics/earings2.jpeg", spanClass: "col-span-1 row-span-1" },
  { id: "earring-holder", title: "Earring Tree Display", category: "Desk & Functional", image: "/3DPrintPics/earingsholder.jpeg", spanClass: "col-span-1 row-span-1" },
  { id: "mom-lithophane", title: "Custom Lithophane", category: "Custom Gifts & Wearables", image: "/3DPrintPics/Mom.jpeg", spanClass: "col-span-2 row-span-1" },
  { id: "fathersday-1", title: "Father's Day Plaque", category: "Custom Gifts & Wearables", image: "/3DPrintPics/fathersday.jpeg", spanClass: "col-span-2 row-span-1" },
  { id: "fathersday-2", title: "Dad Desk Trophy", category: "Custom Gifts & Wearables", image: "/3DPrintPics/fathersday2.jpeg", spanClass: "col-span-1 row-span-1" },
  { id: "headphone-stand-2", title: "Dual Headphone Hook", category: "Desk & Functional", image: "/3DPrintPics/headphonestand2.jpeg", spanClass: "col-span-1 row-span-1" },
];

const CATEGORIES = [
  "All Projects",
  "Gaming & Anime",
  "Pop Culture & Sports",
  "Desk & Functional",
  "Sculptures & Decor",
  "Custom Gifts & Wearables",
] as const;

export function BentoShowcase() {
  const [activeCategory, setActiveCategory] = useState<string>("All Projects");
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  // Filter projects based on active tab
  const filteredProjects = activeCategory === "All Projects"
    ? PRINT_PROJECTS
    : PRINT_PROJECTS.filter((p) => p.category === activeCategory);

  const handleOpenOrder = (title: string) => {
    setSelectedProject(null);
    const orderElem = document.getElementById("order");
    if (orderElem) {
      orderElem.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => {
        const inputElem = document.getElementById("project-details") as HTMLTextAreaElement | null;
        if (inputElem) {
          inputElem.value = `Hi Dream Forge! I would like to inquire about printing a piece similar to: "${title}".`;
          inputElem.focus();
        }
      }, 500);
    }
  };

  return (
    <section id="project-showcase" className="relative py-20 md:py-32 bg-background overflow-hidden border-t border-foreground/5">
      {/* Ambient background accent */}
      <div className="pointer-events-none absolute left-1/2 top-1/4 -translate-x-1/2 -z-10 h-[400px] w-[600px] rounded-full blur-[130px] opacity-20 bg-gradient-to-tr from-amber-500/20 to-orange-400/10" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Compact Header */}
        <div className="mb-10 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-foreground/5 border border-foreground/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                <Sparkles className="w-3 h-3 text-amber-500" />
                Gallery
              </span>
              <span className="block h-px w-8 bg-foreground/10" />
            </div>
            <h2 className="display text-3xl sm:text-4xl md:text-5xl text-foreground font-normal tracking-tight">
              Project Showcase.
            </h2>
          </div>

          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider bg-surface border border-foreground/10 px-3 py-1 rounded-full">
            {filteredProjects.length} Items
          </span>
        </div>

        {/* Category Filters Bar */}
        <div className="mb-8 flex flex-wrap items-center gap-2">
          {CATEGORIES.map((cat) => {
            const count = cat === "All Projects" 
              ? PRINT_PROJECTS.length 
              : PRINT_PROJECTS.filter(p => p.category === cat).length;

            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-foreground text-background shadow-soft"
                    : "bg-surface/80 text-foreground-soft hover:bg-surface hover:text-foreground border border-foreground/5"
                }`}
              >
                <span>{cat}</span>
                <span className={`rounded-full px-1.5 py-0.2 text-[10px] ${isActive ? "bg-background/20 text-background" : "text-muted-foreground"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Dense Bento Grid - Slightly Larger Pictures & Zero Empty Gaps */}
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

              {/* Minimal Dark Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-between p-4">
                <div className="self-end">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md border border-white/30 shadow-sm">
                    <ZoomIn className="w-4 h-4" />
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white drop-shadow-md truncate">
                    {project.title}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Clean Lightbox Modal */}
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
    </section>
  );
}
