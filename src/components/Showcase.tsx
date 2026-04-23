import s1 from "@/assets/show-1.jpg";
import s2 from "@/assets/show-2.jpg";
import s3 from "@/assets/show-3.jpg";
import s4 from "@/assets/show-4.jpg";

const works = [
  { img: s1, title: "Heritage Chess Set", tag: "Custom · Resin" },
  { img: s2, title: "Quiet Companion", tag: "Figure · PLA" },
  { img: s3, title: "Murano Pendant", tag: "Decor · Translucent" },
  { img: s4, title: "Studio in Motion", tag: "Behind the scenes" },
];

export function Showcase() {
  return (
    <section id="showcase" className="relative py-32 md:py-44">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 flex items-end justify-between">
          <div>
            <p className="eyebrow reveal mb-4">Showcase</p>
            <h2 className="display reveal reveal-delay-1 text-4xl leading-[1.05] md:text-6xl">
              Selected work.
            </h2>
          </div>
          <a href="#order" className="reveal reveal-delay-2 hidden text-sm text-muted-foreground hover:text-foreground md:inline">
            Commission a piece →
          </a>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-8">
          <figure className="reveal group md:col-span-7 md:row-span-2">
            <div className="overflow-hidden rounded-2xl bg-surface shadow-soft">
              <img src={works[0].img} alt={works[0].title} loading="lazy" width={1100} height={1300}
                className="aspect-[4/5] w-full object-cover transition-transform duration-[1600ms] ease-out-soft group-hover:scale-[1.03]" />
            </div>
            <figcaption className="mt-4 flex items-center justify-between text-sm">
              <span className="font-medium">{works[0].title}</span>
              <span className="text-muted-foreground">{works[0].tag}</span>
            </figcaption>
          </figure>

          <figure className="reveal reveal-delay-1 group md:col-span-5">
            <div className="overflow-hidden rounded-2xl bg-surface shadow-soft">
              <img src={works[1].img} alt={works[1].title} loading="lazy" width={1100} height={900}
                className="aspect-[5/4] w-full object-cover transition-transform duration-[1600ms] ease-out-soft group-hover:scale-[1.03]" />
            </div>
            <figcaption className="mt-4 flex items-center justify-between text-sm">
              <span className="font-medium">{works[1].title}</span>
              <span className="text-muted-foreground">{works[1].tag}</span>
            </figcaption>
          </figure>

          <figure className="reveal reveal-delay-2 group md:col-span-5">
            <div className="overflow-hidden rounded-2xl bg-surface shadow-soft">
              <img src={works[2].img} alt={works[2].title} loading="lazy" width={1100} height={900}
                className="aspect-[5/4] w-full object-cover transition-transform duration-[1600ms] ease-out-soft group-hover:scale-[1.03]" />
            </div>
            <figcaption className="mt-4 flex items-center justify-between text-sm">
              <span className="font-medium">{works[2].title}</span>
              <span className="text-muted-foreground">{works[2].tag}</span>
            </figcaption>
          </figure>

          <figure className="reveal reveal-delay-3 group md:col-span-12">
            <div className="overflow-hidden rounded-2xl bg-surface shadow-soft">
              <img src={works[3].img} alt={works[3].title} loading="lazy" width={1600} height={900}
                className="aspect-[16/9] w-full object-cover transition-transform duration-[1600ms] ease-out-soft group-hover:scale-[1.02]" />
            </div>
            <figcaption className="mt-4 flex items-center justify-between text-sm">
              <span className="font-medium">{works[3].title}</span>
              <span className="text-muted-foreground">{works[3].tag}</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
