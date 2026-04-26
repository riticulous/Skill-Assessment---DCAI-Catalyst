interface Stat {
  value: string;
  label: string;
  hint?: string;
}

interface ReportStatsProps {
  stats?: Stat[];
}

const defaultStats: Stat[] = [
  { value: "—", label: "Skills probed", hint: "across the JD" },
  { value: "—", label: "Questions asked", hint: "conversational depth" },
  { value: "—", label: "Critical gaps", hint: "below threshold" },
  { value: "—", label: "Learning plan", hint: "to close the gaps" },
];

export function ReportStats({ stats = defaultStats }: ReportStatsProps) {
  return (
    <section className="border-b border-foreground/10">
      <div className="mx-auto grid max-w-[1400px] grid-cols-2 md:grid-cols-4">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`px-6 py-8 md:px-10 md:py-10 ${
              i < stats.length - 1 ? "md:border-r" : ""
            } ${i < 2 ? "border-b md:border-b-0" : ""} ${
              i === 0 || i === 2 ? "border-r" : ""
            } border-foreground/10`}
          >
            <div className="font-display text-[clamp(2.5rem,5vw,3.75rem)] leading-none tracking-[-0.02em]">
              {s.value}
            </div>
            <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/55">
              {s.label}
            </div>
            {s.hint && (
              <div className="mt-1 text-sm italic text-foreground/50">
                {s.hint}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
