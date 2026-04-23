import heroObject from "@/assets/hero-object.jpg";
import { useScrollY } from "@/hooks/use-scroll-y";

export function Hero() {
  const y = useScrollY();
  // calm parallax
  const objectY = Math.min(y * 0.18, 220);
  const textY = Math.min(y * 0.35, 200);
  const opacity = Math.max(1 - y / 600, 0);

  return (
    <section id="top" className="relative isolate overflow-hidden pt-40 pb-32 md:pt-48 md:pb-44">
      {/* soft backdrop */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{ background: "var(--gradient-soft)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[520px] w-[520px] -translate-x-1/2 rounded-full opacity-70 blur-3xl"
        style={{ background: "radial-gradient(circle, hsl(30 15% 90%) 0%, transparent 70%)" }}
      />

      <div className="mx-auto max-w-6xl px-6 text-center">
        <div
          className="reveal in"
          style={{ transform: `translateY(${-textY * 0.2}px)`, opacity }}
        >
          <p className="eyebrow mb-8">Studio · Est. 2024</p>
          <h1 className="display text-[14vw] leading-[0.9] md:text-[8.5rem]">
            Dream <span className="italic text-foreground-soft">Forge</span>
          </h1>
          <p className="display mt-6 text-2xl text-foreground-soft md:text-3xl">
            Crafting ideas into reality.
          </p>
          <p className="mx-auto mt-6 max-w-md text-[15px] leading-relaxed text-muted-foreground">
            Custom 3D prints for creators, students, and collectors —
            considered, refined, and made one piece at a time.
          </p>

          <div className="mt-10 flex items-center justify-center gap-3">
            <a
              href="#order"
              className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background shadow-soft transition-transform duration-500 ease-out-soft hover:scale-[1.02]"
            >
              Start a Project
              <span className="transition-transform duration-500 ease-out-soft group-hover:translate-x-0.5">→</span>
            </a>
            <a
              href="#work"
              className="rounded-full border border-foreground/10 px-6 py-3 text-sm font-medium text-foreground transition-colors duration-500 hover:bg-foreground/[0.03]"
            >
              See our work
            </a>
          </div>
        </div>

        {/* floating object */}
        <div
          className="relative mx-auto mt-20 h-[360px] w-[360px] md:h-[520px] md:w-[520px]"
          style={{ transform: `translateY(${objectY * -0.5}px)` }}
        >
          <div className="float-slow absolute inset-0">
            <img
              src={heroObject}
              alt="A floating clay-style 3D printed object"
              width={1024}
              height={1024}
              className="h-full w-full object-contain"
              style={{ filter: "drop-shadow(0 40px 60px hsl(24 10% 12% / 0.12))" }}
            />
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center gap-3 text-muted-foreground">
          <span className="eyebrow">Scroll</span>
          <span className="block h-10 w-px bg-foreground/20" />
        </div>
      </div>
    </section>
  );
}
