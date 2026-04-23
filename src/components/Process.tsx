import { useEffect, useRef, useState } from "react";

const steps = [
  { n: "01", t: "Idea", d: "We listen. Sketches, references, or just a feeling — we work from where you are." },
  { n: "02", t: "Design", d: "Modeled and refined in CAD. Reviewed together until the proportions feel right." },
  { n: "03", t: "Print", d: "Calibrated by hand on resin or filament. Layer by layer, with patience." },
  { n: "04", t: "Deliver", d: "Sanded, finished, packed. It arrives feeling like a small gift to yourself." },
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
      <div className="sticky top-0 flex min-h-screen items-center overflow-hidden">
        <div className="mx-auto w-full max-w-6xl px-6">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <p className="eyebrow mb-4">Process</p>
              <h2 className="display text-4xl leading-[1.05] md:text-6xl">
                From thought<br />
                <span className="italic text-foreground-soft">to object.</span>
              </h2>
            </div>
            <div className="hidden text-right md:block">
              <div className="display text-5xl tabular-nums">
                {String(Math.round(progress * 100)).padStart(2, "0")}
              </div>
              <div className="eyebrow mt-1">Progress</div>
            </div>
          </div>

          {/* progress rail */}
          <div className="relative mb-12 h-px w-full bg-foreground/10">
            <div
              className="absolute left-0 top-0 h-px bg-foreground transition-[width] duration-300 ease-out-soft"
              style={{ width: `${progress * 100}%` }}
            />
          </div>

          {/* horizontal slider driven by scroll */}
          <div className="overflow-hidden">
            <div
              className="flex gap-8 transition-transform duration-700 ease-out-soft"
              style={{ transform: `translateX(-${progress * 60}%)` }}
            >
              {steps.map((s, i) => {
                const active = progress * 4 >= i + 0.5;
                return (
                  <div
                    key={s.n}
                    className={`relative w-[80vw] shrink-0 rounded-2xl glass p-8 shadow-soft md:w-[420px] transition-opacity duration-700 ${
                      active ? "opacity-100" : "opacity-50"
                    }`}
                  >
                    <div className="display text-6xl text-foreground-soft">{s.n}</div>
                    <h3 className="display mt-6 text-2xl">{s.t}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
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
