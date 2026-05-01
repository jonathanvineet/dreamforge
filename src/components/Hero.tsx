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
      className="relative isolate overflow-hidden pt-40 pb-20 md:pt-48 md:pb-32"
    >
      {/* soft backdrop */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{ background: "var(--gradient-soft)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/4 -z-10 h-[600px] w-[600px] -translate-x-1/2 rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, hsl(30 15% 90%) 0%, transparent 70%)",
        }}
      />

      <div className="mx-auto max-w-7xl px-6">
        <div
          className="reveal in relative z-10 mx-auto max-w-4xl text-center"
          style={{ transform: `translateY(${-textY * 0.3}px)`, opacity }}
        >
          <h1 className="display mx-auto mt-8 max-w-4xl text-5xl leading-[1.1] tracking-tight md:text-[6rem]">
            Where imagination meets material.
          </h1>
          
          <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
            Precision 3D prints for creators, designers, and collectors.
            Considered, refined, and crafted one piece at a time.
          </p>

          <div className="mt-12 flex items-center justify-center gap-4">
            <a
              href="#order"
              className="group inline-flex items-center gap-2 rounded-full bg-foreground px-8 py-4 text-sm font-medium text-background shadow-lift transition-transform duration-700 ease-out-soft hover:-translate-y-1"
            >
              Start a Project
              <span className="transition-transform duration-700 ease-out-soft group-hover:translate-x-1">
                →
              </span>
            </a>
            <a
              href="#showcase"
              className="inline-flex items-center justify-center rounded-full border border-foreground/15 px-8 py-4 text-sm font-medium text-foreground transition-all duration-700 hover:bg-foreground/5 hover:border-foreground/30"
            >
              See our work
            </a>
          </div>
        </div>

        {/* floating object */}
        <div
          className="relative mx-auto mt-16 h-[400px] w-full max-w-[500px] md:mt-24 md:h-[600px] md:max-w-[700px]"
          style={{ transform: `translateY(${objectY * -0.6}px)` }}
        >
          <div className="float-slow absolute inset-0">
            <img
              src="/batman.png"
              alt="A floating premium 3D printed object"
              className="h-full w-full object-contain"
              style={{
                filter: "drop-shadow(0 50px 80px hsl(24 10% 12% / 0.15))",
              }}
            />
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center gap-4 text-muted-foreground">
          <span className="eyebrow">Scroll to explore</span>
          <span className="block h-16 w-px bg-gradient-to-b from-foreground/30 to-transparent" />
        </div>
      </div>
    </section>
  );
}

