import heroObject from "@/assets/hero-object.jpg";
import { useScrollY } from "@/hooks/use-scroll-y";
import { useEffect, useRef, useState } from "react";

export function About() {
  const ref = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState(0);
  const y = useScrollY();

  useEffect(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const center = rect.top + rect.height / 2 - window.innerHeight / 2;
    setOffset(-center * 0.06);
  }, [y]);

  return (
    <section id="about" ref={ref} className="relative py-32 md:py-44">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 px-6 md:grid-cols-12">
        <div className="md:col-span-7">
          <p className="eyebrow reveal mb-6">About</p>
          <h2 className="display reveal reveal-delay-1 text-4xl leading-[1.1] md:text-6xl">
            A small studio, obsessed with the details that nobody else notices.
          </h2>
          <p className="reveal reveal-delay-2 mt-8 max-w-xl text-base leading-relaxed text-foreground-soft">
            Dream Forge is a quiet workshop where ideas become objects.
            Every print is calibrated by hand, finished with patience, and shipped
            only when it feels right in our hands.
          </p>
          <div className="reveal reveal-delay-3 mt-10 grid grid-cols-3 gap-6 border-t border-foreground/10 pt-8">
            {[
              ["120+", "Pieces shipped"],
              ["18", "Materials"],
              ["0.05mm", "Tolerance"],
            ].map(([n, l]) => (
              <div key={l}>
                <div className="display text-2xl md:text-3xl">{n}</div>
                <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-5">
          <div
            className="relative mx-auto aspect-square w-full max-w-md"
            style={{ transform: `translateY(${offset}px)` }}
          >
            <div className="absolute inset-6 rounded-full bg-gradient-to-br from-white/60 to-transparent" />
            <img
              src={heroObject}
              alt=""
              loading="lazy"
              width={900}
              height={900}
              className="float-slow relative h-full w-full object-contain"
              style={{ filter: "drop-shadow(0 30px 50px hsl(24 10% 12% / 0.10))" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
