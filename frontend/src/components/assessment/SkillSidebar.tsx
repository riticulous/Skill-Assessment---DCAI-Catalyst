import { motion } from "framer-motion";
import { Check, Circle, Loader2 } from "lucide-react";

export type SkillStatus = "done" | "in_progress" | "todo";

export interface Skill {
  id: string;
  name: string;
  questions: number;
  total: number;
  status: SkillStatus;
  score?: number;
  maxScore?: number;
}

interface SkillSidebarProps {
  skills: Skill[];
  activeSkillId: string;
  completed: number;
}

export function SkillSidebar({ skills, activeSkillId, completed }: SkillSidebarProps) {
  const total = skills.length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <aside className="flex flex-col gap-4">
      {/* Progress card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl border border-foreground/10 bg-foreground/5 p-5 backdrop-blur"
      >
        <div className="flex items-baseline justify-between">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/60">
            Progress
          </span>
          <span
            className="font-display text-2xl"
            style={{
              background: "var(--gradient-warm)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {completed}/{total}
          </span>
        </div>
        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-foreground/10">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
            className="h-full rounded-full"
            style={{ background: "var(--gradient-warm)" }}
          />
        </div>
        <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/50">
          {pct}% probed · {total - completed} skills remain
        </div>
      </motion.div>

      {/* Skill list */}
      <nav className="flex flex-col gap-1.5">
        {skills.map((skill, i) => {
          const isActive = skill.id === activeSkillId;
          const isDone = skill.status === "done";

          const rightLabel = isDone && skill.score != null
            ? `${skill.score}/${skill.maxScore ?? 10}`
            : isActive
              ? `Q${skill.questions}/${skill.total}`
              : "—";

          const rightColor = isDone
            ? (skill.score != null && skill.score >= 7
                ? "oklch(0.72 0.19 155)"    // green for good scores
                : skill.score != null && skill.score >= 4
                  ? "oklch(0.78 0.16 85)"   // amber for mid scores
                  : "oklch(0.7 0.22 25)")   // red-ish for low
            : isActive
              ? "oklch(0.78 0.16 230)"
              : "oklch(0.5 0.04 265)";

          return (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              className={[
                "group flex items-center justify-between rounded-xl px-4 py-3 text-left transition-all",
                isActive
                  ? "border border-violet/40 bg-violet/10"
                  : "border border-transparent hover:border-foreground/10 hover:bg-foreground/5",
              ].join(" ")}
              style={
                isActive
                  ? {
                      boxShadow: "0 8px 30px -10px oklch(0.62 0.24 295 / 0.5)",
                    }
                  : undefined
              }
            >
              <div className="flex items-center gap-3">
                {isDone ? (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-foreground/10">
                    <Check className="h-3 w-3 text-foreground/80" />
                  </div>
                ) : isActive ? (
                  <Loader2 className="h-5 w-5 animate-spin text-violet" />
                ) : (
                  <Circle className="h-5 w-5 text-foreground/30" strokeWidth={1.5} />
                )}
                <span
                  className={[
                    "text-sm",
                    isActive
                      ? "font-medium text-foreground"
                      : isDone
                        ? "text-foreground/85"
                        : "text-foreground/55",
                  ].join(" ")}
                >
                  {skill.name}
                </span>
              </div>
              <span
                className="font-mono text-[10px] tracking-wider"
                style={{ color: rightColor }}
              >
                {rightLabel}
              </span>
            </motion.div>
          );
        })}
      </nav>
    </aside>
  );
}
