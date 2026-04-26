import { motion } from "framer-motion";

const skills = [
  { name: "React", you: 8.4, need: 8 },
  { name: "TypeScript", you: 7.1, need: 8 },
  { name: "System Design", you: 5.2, need: 7 },
  { name: "Testing", you: 6.8, need: 7 },
  { name: "Performance", you: 4.9, need: 7 },
  { name: "GraphQL", you: 3.2, need: 6 },
];

const plan = [
  { week: "Wk 1–2", topic: "Frontend system design fundamentals", hrs: "8h", source: "Course · Designing Web APIs" },
  { week: "Wk 3", topic: "React rendering & profiling deep-dive", hrs: "5h", source: "Workshop · Kent C. Dodds" },
  { week: "Wk 4–5", topic: "GraphQL with Apollo — build a project", hrs: "12h", source: "Project · Real-world repo" },
];

export function SampleReport() {
  return (
    <section id="proof" className="relative border-b border-foreground/10 py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-5">
            <div className="font-mono text-xs uppercase tracking-[0.22em] text-foreground/50">
              § Specimen Report
            </div>
            <h2 className="mt-4 font-display text-5xl leading-[0.9] tracking-tight md:text-7xl">
              The map you
              <br />
              <span className="italic">walk away with.</span>
            </h2>
            <p className="mt-6 max-w-md text-foreground/70">
              Below: a real (anonymised) report from a candidate probed against a
              senior frontend role. The honest score is harder to swallow — and
              far more useful.
            </p>

            <div className="mt-10 space-y-4">
              <div className="rounded-xl border border-foreground/15 bg-background/40 p-5">
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/50">Candidate</div>
                <div className="mt-1 font-display text-2xl">Anon · 4 yrs experience</div>
              </div>
              <div className="rounded-xl border border-foreground/15 bg-background/40 p-5">
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/50">Target</div>
                <div className="mt-1 font-display text-2xl">Senior Frontend Engineer · Series B fintech</div>
              </div>
              <div className="rounded-xl border border-foreground bg-foreground p-5 text-background">
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-background/60">Verdict</div>
                <div className="mt-1 font-display text-2xl">2 critical gaps · 6-week catch-up plan</div>
              </div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-7">
            {/* Skill bars */}
            <div className="rounded-2xl border border-foreground bg-background p-6 md:p-8">
              <div className="flex items-center justify-between border-b border-foreground/15 pb-4">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/50">Skill Matrix</div>
                  <div className="font-display text-2xl">Depth vs. Required</div>
                </div>
                <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.18em]">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-foreground" /> You
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full border border-foreground" /> Required
                  </span>
                </div>
              </div>

              <div className="mt-6 space-y-5">
                {skills.map((s, i) => {
                  const gap = s.you < s.need;
                  return (
                    <div key={s.name}>
                      <div className="flex items-baseline justify-between font-mono text-xs">
                        <span className="font-sans text-base text-foreground">{s.name}</span>
                        <span className={gap ? "text-rose" : "text-foreground/60"}>
                          {s.you.toFixed(1)} / {s.need.toFixed(1)}
                          {gap && " · gap"}
                        </span>
                      </div>
                      <div className="relative mt-2 h-2 w-full rounded-full bg-foreground/10">
                        <div
                          className="absolute top-1/2 h-3 w-px -translate-y-1/2 bg-foreground"
                          style={{ left: `${s.need * 10}%` }}
                        />
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${s.you * 10}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.1 * i }}
                          className="h-full rounded-full"
                          style={{
                            background: gap
                              ? "linear-gradient(90deg, oklch(0.7 0.22 320), oklch(0.62 0.24 295))"
                              : "var(--gradient-warm)",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Plan */}
            <div className="mt-4 rounded-2xl border border-foreground/15 bg-background/60 p-6 md:p-8">
              <div className="flex items-center justify-between border-b border-foreground/15 pb-4">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/50">Learning Plan · Excerpt</div>
                  <div className="font-display text-2xl">25 hours over 5 weeks</div>
                </div>
                <span className="rounded-full border border-foreground/30 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em]">
                  Auto-curated
                </span>
              </div>
              <ul className="mt-4 divide-y divide-foreground/10">
                {plan.map((p) => (
                  <li key={p.topic} className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:gap-6">
                    <span className="w-24 font-mono text-xs uppercase tracking-[0.16em] text-foreground/60">
                      {p.week}
                    </span>
                    <span className="flex-1 font-medium">{p.topic}</span>
                    <span className="font-mono text-xs text-foreground/60">{p.source}</span>
                    <span className="font-display text-lg">{p.hrs}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
