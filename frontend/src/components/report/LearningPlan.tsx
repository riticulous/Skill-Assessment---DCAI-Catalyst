import { motion } from "framer-motion";
import { BookOpen, Code2, Headphones, Wrench, ExternalLink } from "lucide-react";

export interface LearningModule {
  week: string;
  topic: string;
  hours: string;
  format: "Course" | "Project" | "Reading" | "Workshop";
  source: string;
  url?: string;
  why: string;
}

const formatIcon: Record<LearningModule["format"], typeof BookOpen> = {
  Course: Headphones,
  Reading: BookOpen,
  Project: Wrench,
  Workshop: Code2,
};

interface LearningPlanProps {
  modules: LearningModule[];
  totalHours: number;
  totalWeeks: number;
}

export function LearningPlan({ modules, totalHours, totalWeeks }: LearningPlanProps) {
  return (
    <section className="border-b border-foreground/10 py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="font-mono text-xs uppercase tracking-[0.22em] text-foreground/50">
              § Personalised Learning Plan
            </div>
            <h2 className="mt-4 font-display text-5xl leading-[0.9] tracking-tight md:text-7xl">
              {totalHours} hours.
              <br />
              <span className="italic">{totalWeeks} weeks.</span>
            </h2>
            <p className="mt-6 text-foreground/70">
              Curated for adjacency — every module compounds the previous one.
              No filler, no certificates-for-show.
            </p>
          </div>

          <div className="flex gap-2 self-start md:self-end">
            <span className="rounded-full border border-foreground/20 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em]">
              Auto-curated
            </span>
            <span
              className="rounded-full px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-background"
              style={{ background: "var(--gradient-warm)" }}
            >
              Adaptive
            </span>
          </div>
        </div>

        <div className="mt-12 overflow-hidden rounded-2xl border border-foreground/15">
          {modules.map((m, i) => {
            const Icon = formatIcon[m.format] || BookOpen;
            return (
              <motion.div
                key={m.topic}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className={`group grid grid-cols-12 items-start gap-4 px-6 py-6 transition-colors hover:bg-foreground/[0.03] md:px-8 md:py-7 ${
                  i < modules.length - 1 ? "border-b border-foreground/10" : ""
                }`}
              >
                <div className="col-span-12 flex items-center gap-3 md:col-span-2">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-md"
                    style={{ background: "oklch(0.62 0.24 295 / 0.15)" }}
                  >
                    <Icon
                      className="h-4 w-4"
                      style={{ color: "var(--violet)" }}
                    />
                  </div>
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/70">
                    {m.week}
                  </span>
                </div>

                <div className="col-span-12 md:col-span-6">
                  <div className="font-display text-xl leading-snug md:text-2xl">
                    {m.topic}
                  </div>
                  <div className="mt-1 text-sm italic text-foreground/55">
                    {m.why}
                  </div>
                </div>

                <div className="col-span-8 md:col-span-3">
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/50">
                    {m.format}
                  </div>
                  {m.url ? (
                    <a
                      href={m.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center gap-1.5 text-sm text-foreground/80 underline decoration-foreground/30 underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground/60"
                    >
                      {m.source}
                      <ExternalLink className="h-3 w-3 opacity-60" />
                    </a>
                  ) : (
                    <div className="mt-1 inline-flex items-center gap-1.5 text-sm text-foreground/80">
                      {m.source}
                    </div>
                  )}
                </div>

                <div className="col-span-4 text-right md:col-span-1">
                  <div className="font-display text-2xl">{m.hours}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
