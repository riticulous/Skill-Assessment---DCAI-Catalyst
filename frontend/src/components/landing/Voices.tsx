const quotes = [
  {
    q: "I thought I knew React. The agent showed me I knew patterns from 2019. The plan got me current in six weeks.",
    name: "Maya O.",
    role: "Frontend → Staff Engineer",
  },
  {
    q: "Every other tool flatters you. This one diagnosed me. Brutal. Useful.",
    name: "Devansh K.",
    role: "Career switcher",
  },
  {
    q: "It found three adjacent skills I'd never have studied. Two of them got me the offer.",
    name: "Priya R.",
    role: "Data Engineer",
  },
];

export function Voices() {
  return (
    <section
      className="relative border-b border-foreground/10 py-24 text-foreground md:py-32"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.22 0.12 285) 0%, oklch(0.18 0.1 260) 50%, oklch(0.2 0.14 295) 100%)",
      }}
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="mb-12 flex items-end justify-between">
          <div className="font-mono text-xs uppercase tracking-[0.22em] text-foreground/60">
            § Voices from the field
          </div>
          <div className="font-mono text-xs uppercase tracking-[0.22em] text-foreground/50">
            ★★★★★ · 4.9 avg
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {quotes.map((t, i) => (
            <figure key={i} className="border-t border-foreground/20 pt-8">
              <div className="font-display text-5xl leading-none text-violet">"</div>
              <blockquote className="mt-2 font-display text-2xl leading-snug text-balance md:text-3xl">
                {t.q}
              </blockquote>
              <figcaption className="mt-8 flex items-center justify-between font-mono text-xs uppercase tracking-[0.18em] text-foreground/60">
                <span>— {t.name}</span>
                <span>{t.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
