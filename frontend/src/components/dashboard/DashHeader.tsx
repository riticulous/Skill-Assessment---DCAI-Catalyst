import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function DashHeader({ name = "there" }: { name?: string }) {
  const [dateStr, setDateStr] = useState("");
  useEffect(() => {
    setDateStr(
      new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
      })
    );
  }, []);

  return (
    <section className="border-b border-foreground/10">
      <div className="border-b border-foreground/10 px-6 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/60 md:px-10">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between">
          <span>Workspace{dateStr && ` · ${dateStr}`}</span>
          <span className="hidden md:inline">A field instrument for honest careers</span>
          <span className="flex items-center gap-2">
            <span className="ticker-pulse h-1.5 w-1.5 rounded-full bg-rose" />
            Agent ready
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-6 py-12 md:px-10 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="font-mono text-xs uppercase tracking-[0.2em] text-foreground/50">
            № 002 / Personal Workspace
          </div>
          <h1 className="mt-4 font-display text-[clamp(2.75rem,8vw,6rem)] leading-[0.9] tracking-[-0.03em] text-balance">
            Hey {name}
            <span
              className="ml-3 inline-block italic"
              style={{
                background: "var(--gradient-warm)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              — what's next?
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-foreground/70 md:text-lg">
            Start a new probe, or pick up a conversation in progress. Each report
            ages quietly until you're ready to act on it.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
