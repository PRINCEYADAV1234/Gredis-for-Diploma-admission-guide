export function SiteFooter() {
  return (
    <footer className="border-t border-border py-16">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-12 px-6 md:flex-row">
        <div className="max-w-sm space-y-4">
          <span className="font-display text-xl font-semibold">GREDIS</span>
          <p className="text-sm text-muted-foreground">
            Guided admission systems for the next generation of diploma engineers in India.
          </p>
        </div>
        <div className="flex gap-16">
          <div className="space-y-3">
            <p className="font-mono text-[10px] uppercase tracking-widest text-brand">Product</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/features" className="hover:text-foreground">Features</a></li>
              <li><a href="/dashboard/compare" className="hover:text-foreground">Compare</a></li>
              <li><a href="/dashboard" className="hover:text-foreground">Dashboard</a></li>
            </ul>
          </div>
          <div className="space-y-3">
            <p className="font-mono text-[10px] uppercase tracking-widest text-brand">Legal</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground">Privacy</a></li>
              <li><a href="#" className="hover:text-foreground">Terms</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-12 flex max-w-7xl items-center justify-between px-6 pt-8 font-mono text-[10px] uppercase text-muted-foreground/60">
        <span>© 2026 Gredis Systems</span>
        <span>Built for diploma admissions</span>
      </div>
    </footer>
  );
}
