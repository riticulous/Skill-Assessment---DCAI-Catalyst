import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export interface SkillScore {
  name: string;
  score: number;
  required: number;
  evidence: string;
  rationale: string;
}

interface SkillMatrixProps {
  skills: SkillScore[];
}

export function SkillMatrix({ skills }: SkillMatrixProps) {
  return (
    <section className="border-b border-foreground/10 py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 md:col-span-4">
            <div className="font-mono text-xs uppercase tracking-[0.22em] text-foreground/50">
              § Skill Matrix
            </div>
            <h2 className="mt-4 font-display text-5xl leading-[0.9] tracking-tight md:text-6xl">
              Depth, against
              <br />
              <span className="italic">what was asked.</span>
            </h2>
            <p className="mt-6 max-w-sm text-foreground/70">
              Every bar is a conversation, not a checkbox. Tap a skill to read
              what the agent heard — and what it didn't.
            </p>

            <div className="mt-8 space-y-2 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/60">
              <div className="flex items-center gap-2">
                <span className="h-2 w-6 rounded-full bg-foreground/30" />
                Required level
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="h-2 w-6 rounded-full"
                  style={{ background: "var(--gradient-warm)" }}
                />
                Your demonstrated depth
              </div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-8">
            <div className="space-y-2">
              {skills.map((s, i) => (
                <SkillRow key={s.name} skill={s} index={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SkillRow({ skill, index }: { skill: SkillScore; index: number }) {
  const [open, setOpen] = useState(false);
  const gap = skill.required - skill.score;
  const isCritical = gap >= 4;
  const isGap = gap > 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.45, delay: index * 0.04 }}
      className="overflow-hidden rounded-xl border border-foreground/12 bg-foreground/[0.025]"
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="group flex w-full items-center gap-5 px-5 py-4 text-left transition-colors hover:bg-foreground/[0.04]"
      >
        <div className="flex flex-1 items-center gap-5">
          <span className="w-44 shrink-0 truncate font-medium">
            {skill.name}
          </span>

          <div className="relative h-2 flex-1 rounded-full bg-foreground/10">
            <div
              className="absolute top-1/2 h-4 w-px -translate-y-1/2 bg-foreground/60"
              style={{ left: `${skill.required * 10}%` }}
            />
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${skill.score * 10}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.1 + index * 0.05 }}
              className="h-full rounded-full"
              style={{
                background: isCritical
                  ? "linear-gradient(90deg, oklch(0.7 0.22 18), oklch(0.7 0.22 320))"
                  : isGap
                    ? "linear-gradient(90deg, oklch(0.7 0.22 320), oklch(0.62 0.24 295))"
                    : "var(--gradient-warm)",
              }}
            />
          </div>
        </div>

        <div className="flex w-28 items-center justify-end gap-3 font-mono text-xs">
          <span
            className={
              isCritical
                ? "text-rose"
                : isGap
                  ? "text-violet"
                  : "text-foreground/70"
            }
          >
            {skill.score.toFixed(1)} / {skill.required.toFixed(1)}
          </span>
          <ChevronDown
            className={`h-4 w-4 text-foreground/50 transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="grid gap-4 border-t border-foreground/10 px-5 py-5 md:grid-cols-2">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/50">
              What we heard
            </div>
            <p className="mt-2 text-sm leading-relaxed text-foreground/80">
              {skill.evidence}
            </p>
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/50">
              Why this score
            </div>
            <p className="mt-2 text-sm leading-relaxed text-foreground/80">
              {skill.rationale}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
