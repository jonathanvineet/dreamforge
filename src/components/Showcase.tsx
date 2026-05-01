const works = [
  { img: "/27.2.jpeg", title: "Architectural Model", tag: "Commission · Resin", colSpan: "md:col-span-7 md:row-span-2", aspect: "aspect-[3/4]" },
  { img: "/Pic2.jpeg", title: "Quiet Companion", tag: "Figure · PLA", colSpan: "md:col-span-5", aspect: "aspect-[4/3]" },
  { img: "/29.2.jpeg", title: "Abstract Form", tag: "Decor · Sanded", colSpan: "md:col-span-5", aspect: "aspect-[4/3]" },
  { img: "/30.4.jpeg", title: "Mechanics", tag: "Prototype · Nylon", colSpan: "md:col-span-6", aspect: "aspect-[4/3]" },
  { img: "/28.2.jpeg", title: "Bust Study", tag: "Art · Marble PLA", colSpan: "md:col-span-6", aspect: "aspect-[4/3]" },
];

export function Showcase() {
  return (
    <section id="showcase" className="relative py-32 md:py-44">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-20 flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <p className="eyebrow reveal">Showcase</p>
              <span className="block h-px w-12 bg-foreground/10" />
            </div>
            <h2 className="display reveal reveal-delay-1 text-5xl leading-[1.05] md:text-7xl">
              Selected work.
            </h2>
          </div>
          <a
            href="#order"
            className="reveal reveal-delay-2 group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <span className="underline decoration-foreground/20 underline-offset-4 transition-colors group-hover:decoration-foreground">
              Commission a piece
            </span>
            <span className="transition-transform duration-500 ease-out-soft group-hover:translate-x-1">
              →
            </span>
          </a>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-8">
          {works.map((work, i) => (
            <figure key={i} className={`reveal group ${work.colSpan}`}>
              <div className="overflow-hidden rounded-2xl bg-surface relative">
                <div className="absolute inset-0 bg-foreground/5 z-10 transition-opacity duration-700 group-hover:opacity-0" />
                <img
                  src={work.img}
                  alt={work.title}
                  loading="lazy"
                  className={`w-full object-cover transition-transform duration-[2000ms] ease-out-soft group-hover:scale-[1.03] ${work.aspect}`}
                />
              </div>
              <figcaption className="mt-5 flex items-center justify-between text-sm">
                <span className="display text-xl font-medium">{work.title}</span>
                <span className="text-muted-foreground">{work.tag}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
