export function Footer() {
  return (
    <footer className="border-t border-foreground/10 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 md:flex-row md:items-center">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-foreground" />
          <span className="text-sm font-medium tracking-tight">Dream Forge</span>
          <span className="ml-3 text-xs text-muted-foreground">© {new Date().getFullYear()}</span>
        </div>
        <div className="flex gap-8 text-sm text-muted-foreground">
          <a href="#about" className="hover:text-foreground transition-colors duration-300">About</a>
          <a href="#work" className="hover:text-foreground transition-colors duration-300">Work</a>
          <a href="#order" className="hover:text-foreground transition-colors duration-300">Contact</a>
          <a href="mailto:hello@dreamforge.studio" className="hover:text-foreground transition-colors duration-300">hello@dreamforge.studio</a>
        </div>
      </div>
    </footer>
  );
}
