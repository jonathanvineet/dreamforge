const items = [
  { title: "Toys & Miniatures", desc: "Tactile, durable, made to be played with.", img: "/27.1.jpeg" },
  { title: "Figures", desc: "Collector-grade detail, hand-finished.", img: "/28.1.jpeg" },
  { title: "Decor", desc: "Sculptural pieces for considered spaces.", img: "/29.1.jpeg" },
  { title: "Student Projects", desc: "Prototypes, models, and proofs of concept.", img: "/30.2.jpeg" },
  { title: "Custom Designs", desc: "From your idea, sketch, or file.", img: "/projecthailmary.jpeg" },
];

export function Categories() {
  return (
    <section id="work" className="relative py-32 md:py-44 bg-surface/50">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-20 flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <div className="flex items-center gap-4 mb-6">
              <p className="eyebrow reveal">What we create</p>
              <span className="block h-px w-12 bg-foreground/10" />
            </div>
            <h2 className="display reveal reveal-delay-1 text-5xl leading-[1.1] md:text-7xl">
              Five disciplines.<br />
              <span className="italic text-foreground-soft">One standard.</span>
            </h2>
          </div>
          <p className="reveal reveal-delay-2 max-w-sm text-base leading-relaxed text-muted-foreground pb-2">
            Across every category, the same quiet attention to material, finish,
            and form. Designed to be held.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => (
            <article
              key={it.title}
              className={`reveal reveal-delay-${(i % 4) + 1} group relative overflow-hidden rounded-[2rem] glass p-3 shadow-soft transition-all duration-700 ease-out-soft hover:-translate-y-2 hover:shadow-lift ${
                i === 4 ? "sm:col-span-2 lg:col-span-1" : ""
              }`}
            >
              <div className="aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-surface relative">
                <div className="absolute inset-0 bg-foreground/5 z-10 transition-opacity duration-500 group-hover:opacity-0" />
                <img
                  src={it.img}
                  alt={it.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[2000ms] ease-out-soft group-hover:scale-[1.05]"
                />
              </div>
              <div className="mt-6 mb-2 px-4 flex items-start justify-between gap-4">
                <div>
                  <h3 className="display text-2xl font-medium tracking-tight">{it.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{it.desc}</p>
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-foreground/10 text-foreground transition-all duration-500 group-hover:border-foreground/30 group-hover:bg-foreground/5">
                  <span className="transition-transform duration-500 ease-out-soft group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    ↗
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
