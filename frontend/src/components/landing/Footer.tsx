export function Footer() {
  return (
    <footer className="bg-background py-16">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="flex flex-col gap-12 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="font-display text-7xl leading-none tracking-tight md:text-9xl">
              Skillprobe<span className="text-amber">.</span>
            </div>
            <div className="mt-4 max-w-sm text-foreground/60">
              A quiet instrument for honest careers. Built for people who'd rather
              do the work than fake the answer.
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 md:grid-cols-3">
            {[
              { h: "Product", l: ["The Probe", "Sample Report", "Pricing"] },
              { h: "Company", l: ["Manifesto", "Careers", "Press"] },
              { h: "Legal", l: ["Privacy", "Terms", "Data handling"] },
            ].map((c) => (
              <div key={c.h}>
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/50">
                  {c.h}
                </div>
                <ul className="mt-4 space-y-2 text-sm">
                  {c.l.map((i) => (
                    <li key={i}>
                      <a className="text-foreground/80 hover:text-foreground" href="#">
                        {i}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-3 border-t border-foreground/15 pt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/50 md:flex-row md:items-center">
          <span>© {new Date().getFullYear()} Skillprobe — All probes reserved</span>
          <span>Edition 01 · Printed on the open web</span>
        </div>
      </div>
    </footer>
  );
}
