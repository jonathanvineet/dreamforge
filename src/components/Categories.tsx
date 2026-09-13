import { FluidCanvas } from "./FluidCanvas";

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
      className="relative py-28 md:py-36 overflow-hidden bg-black select-none border-t border-b border-white/15"
      style={{
        background: "radial-gradient(ellipse at 50% 50%, #0d1217 0%, #07090b 60%, #000000 100%)",
      }}
    >

      {/* 2. Interactive Real-Time Fluid Dynamics Canvas (strictly contained within this section) */}
      <FluidCanvas className="z-0 opacity-90" />

      {/* 3. Section Boundary Edge Fades (ensures fluid never bleeds into adjacent sections) */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black via-black/60 to-transparent z-10" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black via-black/60 to-transparent z-10" />

      {/* 4. Subtle Cyber Precision Grid Background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04] z-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,229,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.15) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* 5. Main Section Content */}
      <div className="relative z-20 mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="mb-14 md:mb-18 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="block h-0.5 w-8 bg-cyan-400/80 shadow-[0_0_8px_rgba(0,229,255,0.6)]" />
              <p className="text-xs uppercase tracking-[0.3em] font-mono font-semibold text-cyan-400 reveal">
                WHAT WE MAKE
              </p>
            </div>
            <h2
              className="reveal reveal-delay-1 text-4xl sm:text-5xl md:text-6xl leading-[1.1] text-white"
              style={{ fontFamily: "'Fraunces', ui-serif, Georgia, serif", fontWeight: 400, letterSpacing: "-0.025em" }}
            >
              Got an idea?
              <br />
              <span className="text-zinc-400">Let&apos;s make it.</span>
            </h2>
          </div>
        </div>

        {/* Card Grid — Noticeably elevated, prominent 3D print imagery & high-contrast glass */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {items.map((it, i) => (
            <div
              key={it.title}
              className={`reveal reveal-delay-${(i % 3) + 1} group relative rounded-2xl overflow-hidden cursor-default transition-all duration-500 ease-out-soft hover:-translate-y-2 border border-white/20 hover:border-cyan-400/60 shadow-2xl shadow-black/80 hover:shadow-[0_0_40px_-5px_rgba(0,229,255,0.35)]`}
              style={{
                background: "linear-gradient(145deg, rgba(18,22,28,0.85) 0%, rgba(10,12,16,0.92) 100%)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
              }}
            >
              {/* Full-bleed 3D Print Image: Noticeably visible by default, scales and colorizes on hover */}
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={it.img}
                  alt={it.title}
                  loading="lazy"
                  className="w-full h-full object-cover opacity-50 group-hover:opacity-85 transition-all duration-700 ease-out scale-100 group-hover:scale-110"
                />
                {/* Contrast gradient scrim ensuring text legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30 group-hover:via-black/45 transition-colors duration-500" />
              </div>

              {/* Corner specular accent */}
              <div className="absolute -top-10 -right-10 w-28 h-28 bg-gradient-to-br from-cyan-400/25 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              {/* Card Content */}
              <div className="relative z-10 p-6 sm:p-7 flex flex-col min-h-[220px] justify-between">
                {/* Top: Index Pill */}
                <div className="flex items-start justify-between gap-4">
                  <span className="font-mono text-xs font-bold tracking-widest text-cyan-300 bg-cyan-950/80 border border-cyan-500/40 px-2.5 py-1 rounded-full shadow-[0_0_12px_rgba(0,229,255,0.2)] group-hover:border-cyan-400 group-hover:shadow-[0_0_16px_rgba(0,229,255,0.4)] transition-all">
                    0{i + 1}
                  </span>
                </div>

                {/* Bottom: Title & Description */}
                <div>
                  <h3
                    className="text-xl sm:text-2xl font-medium tracking-tight text-white group-hover:text-cyan-200 transition-colors duration-300"
                    style={{ fontFamily: "'Fraunces', ui-serif, Georgia, serif" }}
                  >
                    {it.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-200 group-hover:text-white transition-colors duration-300">
                    {it.desc}
                  </p>

                  {/* Animated laser accent line */}
                  <div className="mt-5 h-[2px] w-0 group-hover:w-full bg-gradient-to-r from-cyan-400 via-cyan-300 to-amber-400 transition-all duration-700 ease-out shadow-[0_0_8px_rgba(0,229,255,0.6)]" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Interactive Stir Indicator */}
        <div className="pointer-events-none mt-12 text-center text-xs font-mono uppercase tracking-[0.25em] text-cyan-400/70 flex items-center justify-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          MOVE CURSOR TO STIR LIQUID RESIN
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
        </div>
      </div>

      {/* 6. Bottom Section Boundary Glow Line */}
      <div className="absolute bottom-0 left-0 right-0 z-30 pointer-events-none">
        <div className="h-[1.5px] w-full bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
      </div>
    </section>
  );
}

