import { motion } from "framer-motion";
import { AlertTriangle, TrendingUp, Target } from "lucide-react";

interface Gap {
  tag: "Critical" | "Adjacent";
  skill: string;
  delta: string;
  note: string;
}

interface Strength {
  skill: string;
  note: string;
}

interface GapAnalysisProps {
  gaps: Gap[];
  strengths: Strength[];
}

const gapIcon = { Critical: AlertTriangle, Adjacent: TrendingUp };

export function GapAnalysis({ gaps, strengths }: GapAnalysisProps) {
  return (
    <section className="border-b border-foreground/10 py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 md:col-span-5">
            <div className="font-mono text-xs uppercase tracking-[0.22em] text-foreground/50">
              § Gap Analysis
            </div>
            <h2 className="mt-4 font-display text-5xl leading-[0.9] tracking-tight md:text-6xl">
              Where the
              <br />
              <span className="italic">distance lives.</span>
            </h2>
            <p className="mt-6 max-w-md text-foreground/70">
              Gaps prioritised by{" "}
              <em>realistic acquisition cost</em> — not by what's most flattering
              to learn.
            </p>
          </div>

          <div className="col-span-12 space-y-3 md:col-span-7">
            {gaps.map((g, i) => {
              const Icon = gapIcon[g.tag] || AlertTriangle;
              return (
                <motion.div
                  key={g.skill}
                  initial={{ opacity: 0, x: 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="flex items-start gap-4 rounded-xl border border-foreground/12 bg-foreground/[0.025] p-5"
                >
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                    style={{
                      background:
                        g.tag === "Critical"
                          ? "oklch(0.7 0.22 18 / 0.15)"
                          : "oklch(0.62 0.24 295 / 0.15)",
                    }}
                  >
                    <Icon
                      className="h-5 w-5"
                      style={{
                        color:
                          g.tag === "Critical"
                            ? "oklch(0.7 0.22 18)"
                            : "var(--violet)",
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline justify-between gap-3">
                      <div>
                        <span
                          className="mr-3 font-mono text-[10px] uppercase tracking-[0.2em]"
                          style={{
                            color:
                              g.tag === "Critical"
                                ? "oklch(0.7 0.22 18)"
                                : "var(--violet)",
                          }}
                        >
                          {g.tag}
                        </span>
                        <span className="font-display text-2xl">{g.skill}</span>
                      </div>
                      <span className="font-mono text-sm text-foreground/60">
                        {g.delta}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-foreground/70">
                      {g.note}
                    </p>
                  </div>
                </motion.div>
              );
            })}

            {strengths.length > 0 && (
              <div className="mt-6 rounded-xl border border-foreground/12 bg-foreground/[0.025] p-5">
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/50">
                  Lean into these
                </div>
                <ul className="mt-3 space-y-3">
                  {strengths.map((s) => (
                    <li key={s.skill} className="flex items-start gap-3">
                      <Target className="mt-1 h-4 w-4 text-acid" />
                      <div>
                        <div className="font-medium">{s.skill}</div>
                        <div className="text-sm text-foreground/65">
                          {s.note}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
