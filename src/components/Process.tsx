import { useEffect, useRef, useState } from "react";

const steps = [
  { n: "01", t: "Idea", d: "We listen. Sketches, references, or just a feeling — we begin exactly where you are." },
  { n: "02", t: "Design", d: "Modeled and refined in CAD. Reviewed together until the proportions feel undeniably right." },
  { n: "03", t: "Print", d: "Calibrated by hand. Layer by layer, built with precision and patience." },
  { n: "04", t: "Finish", d: "Sanded, treated, and packed. It arrives feeling like a small gift to yourself." },
];

export function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = Math.min(Math.max(-rect.top / total, 0), 1);
      setProgress(p);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section id="process" ref={sectionRef} className="relative">
      <div className="sticky top-0 flex min-h-screen items-center overflow-hidden bg-background">
        {/* Soft background glow */}
        <div 
          className="absolute left-1/4 top-1/4 h-[800px] w-[800px] rounded-full blur-[120px] opacity-20 pointer-events-none"
          style={{ background: "radial-gradient(circle, hsl(36 12% 85%) 0%, transparent 60%)" }}
        />

        <div className="mx-auto w-full max-w-7xl px-6 relative z-10">
          <div className="mb-16 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <span className="block h-px w-8 bg-foreground/20" />
                <p className="eyebrow">The Process</p>
              </div>
              <h2 className="display text-5xl leading-[1.05] md:text-7xl">
                From thought<br />
                <span className="italic text-foreground-soft">to object.</span>
              </h2>
            </div>
            <div className="hidden text-right md:block">
              <div className="display text-6xl tracking-tighter tabular-nums text-foreground-soft">
                {String(Math.round(progress * 100)).padStart(2, "0")}
              </div>
              <div className="eyebrow mt-2">Progress</div>
            </div>
          </div>

          {/* progress rail */}
          <div className="relative mb-16 h-px w-full bg-foreground/10">
            <div
              className="absolute left-0 top-0 h-px bg-foreground transition-[width] duration-300 ease-out-soft"
              style={{ width: `${progress * 100}%` }}
            />
          </div>

          {/* horizontal slider driven by scroll */}
          <div className="overflow-hidden pb-12">
            <div
              className="flex gap-8 transition-transform duration-700 ease-out-soft"
              style={{ transform: `translateX(-${progress * 60}%)` }}
            >
              {steps.map((s, i) => {
                const active = progress * 4 >= i + 0.5;
                return (
                  <div
                    key={s.n}
                    className={`relative w-[85vw] shrink-0 rounded-[2rem] glass-strong p-10 shadow-soft md:w-[460px] transition-all duration-700 ${
                      active ? "opacity-100 translate-y-0" : "opacity-40 translate-y-4"
                    }`}
                  >
                    <div className="display text-7xl text-foreground/20 tracking-tighter">{s.n}</div>
                    <h3 className="display mt-8 text-3xl">{s.t}</h3>
                    <p className="mt-4 text-base leading-relaxed text-muted-foreground">{s.d}</p>
                    {/* decorative line */}
                    <div className="absolute left-10 bottom-10 h-px w-12 bg-foreground/20" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      {/* tall scroll spacer */}
      <div className="h-[200vh]" aria-hidden />
    </section>
  );
}
