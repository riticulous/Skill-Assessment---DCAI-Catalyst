import { motion } from "framer-motion";
import { ArrowUp, CornerDownLeft } from "lucide-react";
import { useState, type FormEvent, type KeyboardEvent } from "react";

interface AnswerInputProps {
  onSend: (value: string) => void;
  disabled?: boolean;
}

export function AnswerInput({ onSend, disabled }: AnswerInputProps) {
  const [value, setValue] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const v = value.trim();
    if (!v || disabled) return;
    onSend(v);
    setValue("");
  };

  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit(e as unknown as FormEvent);
    }
  };

  return (
    <div
      className="border-t border-foreground/10 bg-background/80 px-6 py-4 backdrop-blur-xl md:px-10"
      style={{
        backgroundImage:
          "linear-gradient(180deg, transparent, oklch(0.14 0.03 270 / 0.6))",
      }}
    >
      <motion.form
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        onSubmit={submit}
        className="group relative flex items-end gap-3 rounded-2xl border border-foreground/15 bg-foreground/[0.04] p-2.5 transition-colors focus-within:border-violet/50"
        style={{
          boxShadow: "0 12px 40px -20px oklch(0.62 0.24 295 / 0.4)",
        }}
      >
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKey}
          placeholder="Type your answer…"
          rows={1}
          disabled={disabled}
          className="min-h-[44px] max-h-40 flex-1 resize-none bg-transparent px-3 py-2.5 text-[15px] text-foreground placeholder:text-foreground/40 focus:outline-none"
        />

        <div className="flex items-center gap-2">
          <span className="hidden items-center gap-1.5 px-2 font-mono text-[10px] uppercase tracking-wider text-foreground/40 sm:inline-flex">
            <CornerDownLeft className="h-3 w-3" />
            Send
          </span>
          <button
            type="submit"
            disabled={!value.trim() || disabled}
            aria-label="Send answer"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-background transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
            style={{
              background: "var(--gradient-warm)",
              boxShadow: "0 8px 20px -8px oklch(0.62 0.24 295 / 0.6)",
            }}
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </motion.form>

      <div className="mt-2.5 flex items-center justify-between px-1 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/40">
        <span>Shift + Enter for newline</span>
        <span>Honest answers calibrate the probe</span>
      </div>
    </div>
  );
}
