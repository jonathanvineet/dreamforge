import toys from "@/assets/cat-toys.jpg";
import figure from "@/assets/cat-figure.jpg";
import decor from "@/assets/cat-decor.jpg";
import student from "@/assets/cat-student.jpg";
import custom from "@/assets/cat-custom.jpg";

const items = [
  { title: "Toys", desc: "Tactile, durable, made to be played with.", img: toys },
  { title: "Anime Figures", desc: "Collector-grade detail, hand-finished.", img: figure },
  { title: "Decor", desc: "Sculptural pieces for considered spaces.", img: decor },
  { title: "Student Projects", desc: "Prototypes, models, and proofs of concept.", img: student },
  { title: "Custom Designs", desc: "From your idea, sketch, or file.", img: custom },
];

export function Categories() {
  return (
    <section id="work" className="relative py-32 md:py-44">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow reveal mb-4">What we create</p>
            <h2 className="display reveal reveal-delay-1 text-4xl leading-[1.05] md:text-6xl">
              Five disciplines.<br />
              <span className="italic text-foreground-soft">One standard.</span>
            </h2>
          </div>
          <p className="reveal reveal-delay-2 max-w-sm text-sm text-muted-foreground">
            Across every category, the same quiet attention to material, finish,
            and form.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => (
            <article
              key={it.title}
              className={`reveal reveal-delay-${(i % 4) + 1} group relative overflow-hidden rounded-2xl glass p-5 shadow-soft transition-all duration-700 ease-out-soft hover:-translate-y-1 hover:shadow-lift ${
                i === 4 ? "sm:col-span-2 lg:col-span-1" : ""
              }`}
            >
              <div className="aspect-[4/5] overflow-hidden rounded-xl bg-surface">
                <img
                  src={it.img}
                  alt={it.title}
                  loading="lazy"
                  width={900}
                  height={1100}
                  className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out-soft group-hover:scale-[1.04]"
                />
              </div>
              <div className="mt-5 flex items-end justify-between">
                <div>
                  <h3 className="text-lg font-medium tracking-tight">{it.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{it.desc}</p>
                </div>
                <span className="text-foreground/40 transition-transform duration-500 ease-out-soft group-hover:translate-x-1 group-hover:text-foreground">
                  →
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
