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
    setOffset(-center * 0.08);
  }, [y]);

  return (
    <section id="about" ref={ref} className="relative py-32 md:py-44 overflow-hidden">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-20 px-6 lg:grid-cols-12">
        <div className="lg:col-span-6 z-10">
          <div className="flex items-center gap-4 mb-8">
            <span className="block h-px w-8 bg-foreground/20" />
            <p className="eyebrow reveal">About the studio</p>
          </div>
          <h2 className="display reveal reveal-delay-1 text-5xl leading-[1.1] md:text-6xl">
            A small workshop, obsessed with the details that nobody else notices.
          </h2>
          <p className="reveal reveal-delay-2 mt-8 max-w-lg text-lg leading-relaxed text-foreground-soft">
            Dream Forge is a quiet space where ideas become tangible objects. Every
            print is calibrated by hand, finished with immense patience, and shipped
            only when it feels right to hold.
          </p>

        </div>

        <div className="lg:col-span-6 relative h-[600px] md:h-[700px] w-full">
          {/* Main image */}
          <div
            className="absolute right-0 top-0 w-[80%] max-w-[400px] overflow-hidden rounded-[2rem] bg-surface shadow-lift z-10"
            style={{ transform: `translateY(${offset * 0.8}px)` }}
          >
            <img
              src="/29.3.jpeg"
              alt="Detail of 3D printed object"
              loading="lazy"
              className="aspect-[4/5] w-full object-cover transition-transform duration-[2000ms] hover:scale-[1.03]"
            />
          </div>

          {/* Staggered secondary image */}
          <div
            className="absolute left-0 bottom-10 w-[55%] max-w-[280px] overflow-hidden rounded-[1.5rem] bg-surface shadow-soft z-20"
            style={{ transform: `translateY(${offset * 1.5}px)` }}
          >
            <div className="glass absolute inset-0 z-10 opacity-0 transition-opacity duration-500 hover:opacity-100" />
            <img
              src="/27.3.webp"
              alt="3D printer at work"
              loading="lazy"
              className="aspect-square w-full object-cover transition-transform duration-[2000ms] hover:scale-[1.05]"
            />
          </div>
          
          {/* Decorative element */}
          <div 
            className="absolute right-[20%] bottom-[20%] -z-10 h-[300px] w-[300px] rounded-full blur-3xl opacity-50"
            style={{ background: "radial-gradient(circle, hsl(30 15% 85%) 0%, transparent 70%)" }}
          />
        </div>
      </div>
    </section>
  );
}
