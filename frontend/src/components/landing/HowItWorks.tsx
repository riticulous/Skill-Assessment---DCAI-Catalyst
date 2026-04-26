import { motion } from "framer-motion";
import { FileText, MessageSquareDashed, Compass } from "lucide-react";

const steps = [
  {
    n: "01",
    icon: FileText,
    title: "Feed it the truth",
    body: "Paste the job description. Drop your résumé. The agent extracts every required skill — and every claim you've made about them.",
    detail: "JD parsed → 17 skills · Résumé mapped → 12 claims",
  },
  {
    n: "02",
    icon: MessageSquareDashed,
    title: "Sit through a real conversation",
    body: "No multiple choice. The agent probes with follow-ups, asks for trade-offs, and adapts difficulty in real time. It can tell rehearsed answers from actual depth.",
    detail: "~7 min · 9–14 adaptive questions · Voice or text",
  },
  {
    n: "03",
    icon: Compass,
    title: "Receive your map",
    body: "A skill radar showing exactly where you stand vs. the role. Honest scores. A learning plan focused on adjacent skills you can realistically acquire — with hand-picked resources and time estimates.",
    detail: "Gap report · Adjacent skills · Time-boxed plan",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative border-b border-foreground/10 py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-4">
            <div className="sticky top-28">
              <div className="font-mono text-xs uppercase tracking-[0.22em] text-foreground/50">
                § Method
              </div>
              <h2 className="mt-4 font-display text-5xl leading-[0.9] tracking-tight md:text-7xl">
                Three acts.
                <br />
                <span className="italic text-foreground/50">No theatre.</span>
              </h2>
              <p className="mt-6 max-w-sm text-foreground/70">
                Most assessments grade you on questions you've memorised.
                We grade you on the answers only experience can give.
              </p>
            </div>
          </div>

          <div className="col-span-12 space-y-3 md:col-span-8">
            {steps.map((step, i) => (
              <motion.article
                key={step.n}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="group relative overflow-hidden rounded-2xl border border-foreground/15 bg-background/40 p-8 backdrop-blur transition-colors hover:border-foreground/40 md:p-10"
              >
                <div className="grid grid-cols-12 gap-6">
                  <div className="col-span-12 flex items-start gap-4 md:col-span-3">
                    <div className="font-display text-6xl text-foreground/20 md:text-7xl">{step.n}</div>
                    <step.icon className="mt-2 h-6 w-6 text-amber" strokeWidth={1.5} />
                  </div>
                  <div className="col-span-12 md:col-span-9">
                    <h3 className="font-display text-3xl leading-tight tracking-tight md:text-4xl">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-base text-foreground/75 md:text-lg">{step.body}</p>
                    <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-foreground/20 bg-background px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/60">
                      {step.detail}
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
