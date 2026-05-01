export function Nav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto mt-6 flex max-w-xl items-center justify-between rounded-full bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 shadow-soft">
        <nav className="flex items-center gap-6 pl-2">
          {[
            ["About", "#about"],
            ["Work", "#work"],
            ["Process", "#process"],
            ["Showcase", "#showcase"],
          ].map(([l, h]) => (
            <a
              key={l}
              href={h}
              className="text-xs font-medium text-white/70 transition-colors duration-300 hover:text-white"
            >
              {l}
            </a>
          ))}
        </nav>
        <a
          href="#order"
          className="rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-black transition-transform duration-300 ease-out-soft hover:scale-[1.05]"
        >
          Start a Project
        </a>
      </div>
    </header>
  );
}
