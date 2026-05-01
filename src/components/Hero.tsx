import { useScrollY } from "@/hooks/use-scroll-y";

export function Hero() {
  const y = useScrollY();
  // calm parallax
  const objectY = Math.min(y * 0.15, 200);
  const textY = Math.min(y * 0.25, 150);
  const opacity = Math.max(1 - y / 700, 0);

  return (
    <section
      id="top"
      className="relative isolate overflow-hidden min-h-[100svh] flex flex-col justify-center bg-background"
    >
      {/* image backdrop */}
      <div className="absolute inset-0 -z-10">
        <img
          src="/hero-bg.webp"
          alt=""
          className="h-full w-full object-cover object-center"
        />
        {/* Subtle dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/30" />
        {/* Gradient transition to the next section's background color */}
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-6 w-full pt-20">
        <div
          className="reveal in relative z-10 mx-auto max-w-5xl text-center"
          style={{ transform: `translateY(${-textY * 0.3}px)`, opacity }}
        >
          <h1 className="display mx-auto max-w-5xl text-7xl font-bold leading-[0.9] tracking-tighter md:text-[10rem] text-white drop-shadow-2xl uppercase">
            DreamForge
          </h1>
          <h2 className="display mx-auto mt-6 max-w-4xl text-3xl leading-[1.1] tracking-tight md:text-5xl text-white/90 drop-shadow-md">
            Where imagination meets material.
          </h2>
          
          <p className="mx-auto mt-8 max-w-lg text-lg leading-relaxed text-white/80 drop-shadow-sm">
            Precision 3D prints for creators, designers, and collectors.
            Considered, refined, and crafted one piece at a time.
          </p>

          <div className="mt-14 flex items-center justify-center gap-4">
            <a
              href="#order"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-semibold text-black shadow-lift transition-transform duration-700 ease-out-soft hover:-translate-y-1"
            >
              Start a Project
              <span className="transition-transform duration-700 ease-out-soft group-hover:translate-x-1">
                →
              </span>
            </a>
            <a
              href="#showcase"
              className="inline-flex items-center justify-center rounded-full border border-white/30 px-8 py-4 text-sm font-semibold text-white transition-all duration-700 hover:bg-white/10 hover:border-white/50"
            >
              See our work
            </a>
          </div>
        </div>


      </div>
    </section>
  );
}

