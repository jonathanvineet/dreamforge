export function Nav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto mt-4 flex max-w-6xl items-center justify-between rounded-full glass px-5 py-3 shadow-soft">
        <a href="#top" className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-foreground" />
          <span className="text-sm font-medium tracking-tight">Dream Forge</span>
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          {[
            ["About", "#about"],
            ["Work", "#work"],
            ["Process", "#process"],
            ["Showcase", "#showcase"],
          ].map(([l, h]) => (
            <a
              key={l}
              href={h}
              className="text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground"
            >
              {l}
            </a>
          ))}
        </nav>
        <a
          href="#order"
          className="rounded-full bg-foreground px-4 py-2 text-xs font-medium text-background transition-transform duration-300 ease-out-soft hover:scale-[1.02]"
        >
          Start a Project
        </a>
      </div>
    </header>
  );
}
