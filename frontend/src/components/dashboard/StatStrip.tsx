import { motion } from "framer-motion";

interface Stat {
  label: string;
  value: string;
  note: string;
}

const defaultStats: Stat[] = [
  { label: "Probes run", value: "—", note: "this month" },
  { label: "Skills measured", value: "—", note: "across roles" },
  { label: "Avg. depth", value: "—", note: "/ 10" },
  { label: "Hours planned", value: "—", note: "in your roadmap" },
];

export function StatStrip({ stats = defaultStats }: { stats?: Stat[] }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.05 }}
      className="border-y border-foreground/10 bg-background/30"
    >
      <div className="mx-auto grid max-w-[1400px] grid-cols-2 divide-foreground/10 md:grid-cols-4 md:divide-x">
        {stats.map((s, i) => (
          <div key={i} className="px-6 py-6 md:px-10 md:py-7">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/55">
              {s.label}
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-display text-4xl leading-none tracking-tight">
                {s.value}
              </span>
              <span className="text-xs text-foreground/50">{s.note}</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
