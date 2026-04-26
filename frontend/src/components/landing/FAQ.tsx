import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";

const faqs = [
  {
    q: "Can the agent really tell if I'm bluffing?",
    a: "Yes — and gently. It probes follow-ups that only practitioners can answer (trade-offs, debugging stories, edge cases). Memorised answers collapse on the second question. Real understanding doesn't.",
  },
  {
    q: "What happens to my résumé and conversation?",
    a: "Documents are used for the assessment and then discarded. Transcripts belong to you. We never train external models on your content, and we don't sell anything to recruiters.",
  },
  {
    q: "How is this different from a typical interview prep tool?",
    a: "Prep tools rehearse you. We diagnose you. The output isn't a higher score on a quiz — it's a map of what to actually learn, in order, with time estimates that fit a working life.",
  },
  {
    q: "Which roles does it support?",
    a: "Any role with a job description: engineering, design, product, data, marketing, ops. The agent reads the JD, extracts skills, and probes accordingly — it isn't tied to a fixed role library.",
  },
  {
    q: "How long does an assessment take?",
    a: "Most probes finish in 6–10 minutes. The agent ends as soon as it has high confidence in your depth across every skill. No padding.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="border-b border-foreground/10 py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-4">
            <div className="font-mono text-xs uppercase tracking-[0.22em] text-foreground/50">
              § Honest questions
            </div>
            <h2 className="mt-4 font-display text-5xl leading-[0.9] tracking-tight md:text-6xl">
              Things people
              <br />
              <span className="italic">always ask.</span>
            </h2>
          </div>
          <div className="col-span-12 md:col-span-8">
            <ul className="border-t border-foreground/15">
              {faqs.map((f, i) => {
                const isOpen = open === i;
                return (
                  <li key={i} className="border-b border-foreground/15">
                    <button
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="flex w-full items-start justify-between gap-6 py-6 text-left"
                    >
                      <span className="font-display text-2xl tracking-tight md:text-3xl">{f.q}</span>
                      <Plus
                        className={`mt-2 h-5 w-5 shrink-0 transition-transform ${isOpen ? "rotate-45" : ""}`}
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <p className="max-w-2xl pb-6 text-base text-foreground/75 md:text-lg">{f.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
