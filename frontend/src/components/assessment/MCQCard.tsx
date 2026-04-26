import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Send } from "lucide-react";

interface MCQOption {
  id: string;
  text: string;
}

interface MCQCardProps {
  question: string;
  options: MCQOption[];
  onSubmit: (selectedId: string) => void;
  disabled?: boolean;
}

export function MCQCard({ question, options, onSubmit, disabled }: MCQCardProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSubmit = () => {
    if (selected && !disabled) {
      onSubmit(selected);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-[600px] rounded-2xl border border-violet/20 bg-foreground/[0.04] p-6 backdrop-blur"
      style={{ boxShadow: "0 12px 40px -16px oklch(0.62 0.24 295 / 0.3)" }}
    >
      <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-violet/70">
        Multiple Choice
      </div>
      <p className="mb-5 text-[15px] leading-relaxed text-foreground/90">
        {question}
      </p>

      <div className="flex flex-col gap-2.5">
        {options.map((opt) => {
          const isSelected = selected === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              disabled={disabled}
              onClick={() => setSelected(opt.id)}
              className={[
                "group flex items-start gap-3 rounded-xl border px-4 py-3 text-left transition-all",
                isSelected
                  ? "border-violet/50 bg-violet/10"
                  : "border-foreground/10 bg-foreground/[0.02] hover:border-foreground/20 hover:bg-foreground/[0.04]",
                disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
              ].join(" ")}
            >
              <span className="mt-0.5 shrink-0">
                {isSelected ? (
                  <CheckCircle2 className="h-4.5 w-4.5 text-violet" />
                ) : (
                  <Circle className="h-4.5 w-4.5 text-foreground/30 group-hover:text-foreground/50" />
                )}
              </span>
              <span className="text-[14px] leading-relaxed">
                <span className="mr-1.5 font-semibold text-foreground/60">{opt.id}.</span>
                <span className={isSelected ? "text-foreground" : "text-foreground/75"}>
                  {opt.text}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex justify-end">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!selected || disabled}
          className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-background transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
          style={{
            background: "var(--gradient-warm)",
            boxShadow: "0 8px 20px -8px oklch(0.62 0.24 295 / 0.6)",
          }}
        >
          <Send className="h-3.5 w-3.5" />
          Submit Answer
        </button>
      </div>
    </motion.div>
  );
}
