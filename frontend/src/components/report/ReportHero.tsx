import { motion } from "framer-motion";

interface ReportHeroProps {
  candidate: string;
  role: string;
  company: string;
  score: number;
  verdict: string;
  summary: string;
  completedAt: string;
}

export function ReportHero({
  candidate,
  role,
  company,
  score,
  verdict,
  summary,
  completedAt,
}: ReportHeroProps) {
  const tone =
    score >= 75
      ? { label: "Strong fit", color: "var(--acid)" }
      : score >= 50
        ? { label: "Partial fit", color: "var(--violet)" }
        : { label: "Significant gaps", color: "var(--rose)" };

  return (
    <section className="relative border-b border-foreground/10">
      <div className="border-b border-foreground/10 px-6 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/60 md:px-10">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between">
          <span>Completed {completedAt}</span>
          <span className="hidden md:inline">An honest map, not a verdict</span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-acid" />
            Sealed
          </span>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1400px] grid-cols-12 gap-8 px-6 py-14 md:px-10 md:py-20">
        {/* Left: candidate + role meta */}
        <div className="col-span-12 lg:col-span-5">
          <div className="font-mono text-xs uppercase tracking-[0.2em] text-foreground/50">
            § Assessment Result
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-4 font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.95] tracking-[-0.02em] text-balance"
          >
            {candidate},
            <br />
            <span
              className="italic"
              style={{
                background: "var(--gradient-warm)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              honestly assessed.
            </span>
          </motion.h1>

          <div className="mt-8 space-y-3">
            <div className="rounded-xl border border-foreground/15 bg-foreground/[0.03] p-5">
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/50">
                Target Role
              </div>
              <div className="mt-1 font-display text-2xl leading-tight">
                {role}
              </div>
              <div className="mt-1 text-sm text-foreground/60">{company}</div>
            </div>

            <div className="rounded-xl border border-foreground/15 bg-foreground/[0.03] p-5">
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/50">
                Summary
              </div>
              <p className="mt-2 text-[15px] leading-relaxed text-foreground/80">
                {summary}
              </p>
            </div>
          </div>
        </div>

        {/* Right: score dial */}
        <div className="col-span-12 lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative flex h-full min-h-[420px] flex-col justify-between overflow-hidden rounded-2xl border border-foreground/15 p-8 md:p-10"
            style={{
              background:
                "radial-gradient(circle at 80% 0%, oklch(0.62 0.24 295 / 0.18), transparent 55%), linear-gradient(180deg, oklch(0.18 0.04 268), oklch(0.14 0.03 270))",
            }}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/50">
                  Overall Match
                </div>
                <div className="mt-2 font-display text-sm italic text-foreground/70">
                  weighted across required competencies
                </div>
              </div>
              <span
                className="rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em]"
                style={{ borderColor: tone.color, color: tone.color }}
              >
                {tone.label}
              </span>
            </div>

            {/* Gigantic numeric score */}
            <div className="my-6 flex items-end gap-4">
              <ScoreNumber score={score} />
              <div className="mb-4 flex flex-col gap-1">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/50">
                  out of 100
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/70">
                  {verdict}
                </span>
              </div>
            </div>

            {/* Score bar */}
            <div>
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-foreground/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${score}%` }}
                  transition={{ duration: 1.1, delay: 0.3, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ background: "var(--gradient-warm)" }}
                />
                <div
                  className="absolute top-1/2 h-4 w-px -translate-y-1/2 bg-foreground/60"
                  style={{ left: `70%` }}
                />
              </div>
              <div className="mt-2 flex justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/50">
                <span>0</span>
                <span>hire threshold · 70</span>
                <span>100</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ScoreNumber({ score }: { score: number }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2 }}
      className="font-display leading-[0.85] tracking-[-0.05em]"
      style={{
        fontSize: "clamp(6rem, 16vw, 11rem)",
        background: "var(--gradient-warm)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}
    >
      {score}
    </motion.span>
  );
}
