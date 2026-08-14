const items = [
  { title: "Custom Prints", desc: "Your idea, printed your way.", img: "/projecthailmary.jpeg" },
  { title: "Prototypes", desc: "Turn CAD files into something real.", img: "/30.2.jpeg" },
  { title: "Functional Parts", desc: "Brackets, mounts, replacements — whatever you need.", img: "/27.1.jpeg" },
  { title: "Display Pieces", desc: "Figures, collectibles, things worth putting on your desk.", img: "/28.1.jpeg" },
  { title: "Custom Gifts", desc: "Something personal beats something off the shelf.", img: "/29.1.jpeg" },
  { title: "Small Batches", desc: "Need a few? We can make a few.", img: "/3DPrintPics/minions.jpeg" },
];

export function Categories() {

  return (
    <section
      id="categories"
      className="relative py-28 md:py-40 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #0a0a0a 0%, #111111 50%, #0d0d0d 100%)" }}
    >

      {/* Subtle grid lines */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Ambient corner glow */}
      <div className="pointer-events-none absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-cyan-500/[0.03] blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-48 -left-32 w-[400px] h-[400px] rounded-full bg-amber-500/[0.03] blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="mb-16 md:mb-20">
          <div className="flex items-center gap-4 mb-6">
            <span className="block h-px w-10 bg-white/20" />
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500 reveal">WHAT WE MAKE</p>
          </div>
          <h2
            className="reveal reveal-delay-1 text-4xl sm:text-5xl md:text-6xl leading-[1.1] max-w-xl text-white"
            style={{ fontFamily: "'Fraunces', ui-serif, Georgia, serif", fontWeight: 400, letterSpacing: "-0.025em" }}
          >
            Got an idea?
            <br />
            <span className="text-zinc-400">Let&apos;s make it.</span>
          </h2>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {items.map((it, i) => (
            <div
              key={it.title}
              className={`reveal reveal-delay-${(i % 3) + 1} group relative rounded-2xl overflow-hidden cursor-default transition-all duration-500 ease-out`}
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {/* Image background — desaturated, colorizes on hover */}
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={it.img}
                  alt={it.title}
                  loading="lazy"
                  className="w-full h-full object-cover opacity-0 group-hover:opacity-[0.15] transition-all duration-700 ease-out scale-105 group-hover:scale-100 grayscale group-hover:grayscale-0"
                />
              </div>

              {/* Hover border glow */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ boxShadow: "inset 0 0 0 1px rgba(0,229,255,0.15), 0 0 30px -10px rgba(0,229,255,0.1)" }}
              />

              {/* Content */}
              <div className="relative z-10 p-6 sm:p-7 flex flex-col min-h-[160px] justify-between">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3
                      className="text-lg sm:text-xl font-medium tracking-tight text-white/90 group-hover:text-white transition-colors duration-300"
                      style={{ fontFamily: "'Fraunces', ui-serif, Georgia, serif" }}
                    >
                      {it.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-500 group-hover:text-zinc-400 transition-colors duration-300">
                      {it.desc}
                    </p>
                  </div>

                  {/* Index */}
                  <span className="shrink-0 font-mono text-[11px] tracking-wider text-zinc-700 group-hover:text-cyan-800 transition-colors duration-500 mt-1">
                    0{i + 1}
                  </span>
                </div>

                {/* Bottom accent line — animates width on hover */}
                <div className="mt-6 h-px w-0 group-hover:w-full bg-gradient-to-r from-cyan-500/40 via-cyan-400/20 to-transparent transition-all duration-700 ease-out" />
              </div>
            </div>
          ))}
        </div>


      </div>
    </section>
  );
}
