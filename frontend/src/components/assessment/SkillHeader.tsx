import { motion } from "framer-motion";

interface SkillHeaderProps {
  skillName: string;
  questionIndex: number;
  questionTotal: number;
  skillIndex: number;
  skillTotal: number;
}

export function SkillHeader({
  skillName,
  questionIndex,
  questionTotal,
  skillIndex,
  skillTotal,
}: SkillHeaderProps) {
  return (
    <div
      className="sticky top-0 z-10 flex items-center justify-between border-b border-foreground/10 px-6 py-4 backdrop-blur-xl md:px-10"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.14 0.03 270 / 0.85), oklch(0.14 0.03 270 / 0.6))",
      }}
    >
      <motion.div
        key={skillName}
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-3"
      >
        <span className="ticker-pulse h-2 w-2 rounded-full bg-violet" />
        <span className="font-display text-xl tracking-tight md:text-2xl">
          {skillName}
        </span>
        {questionTotal > 0 && (
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/45">
            Q{questionIndex}/{questionTotal}
          </span>
        )}
      </motion.div>

      <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/55">
        {skillIndex}/{skillTotal} skills
      </span>
    </div>
  );
}
