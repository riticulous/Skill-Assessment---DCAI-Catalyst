import { motion } from "framer-motion";
import { Radar, GitBranch, BookMarked, Clock4, ShieldCheck, Sparkles } from "lucide-react";

const items = [
  {
    icon: Radar,
    tag: "Diagnostic",
    title: "Skill radar, not a star rating",
    body: "Every required skill plotted against your actual depth. See your shape, not just a number.",
  },
  {
    icon: GitBranch,
    tag: "Discovery",
    title: "Adjacent skill detection",
    body: "The fastest path to the role often runs through skills you didn't know you almost had. We find them.",
  },
  {
    icon: BookMarked,
    tag: "Curation",
    title: "Hand-picked resources",
    body: "Not a playlist of 200 videos. A short, ordered list of the right courses, books and projects.",
  },
  {
    icon: Clock4,
    tag: "Realism",
    title: "Time estimates that respect your week",
    body: "Each gap is sized in honest hours. The plan fits whether you have weekends or evenings.",
  },
  {
    icon: ShieldCheck,
    tag: "Trust",
    title: "Your résumé doesn't get hoarded",
    body: "Documents are processed for assessment and discarded. We probe people, not databases.",
  },
  {
    icon: Sparkles,
    tag: "Depth",
    title: "Adaptive probing, not pop quizzes",
    body: "Get something right? It pushes harder. Get stuck? It pivots. The agent finds your ceiling.",
  },
];

export function Capabilities() {
  return (
    <section id="capabilities" className="relative border-b border-foreground/10 py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="mb-16 flex flex-col items-end gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.22em] text-foreground/50">
              § Capabilities
            </div>
            <h2 className="mt-4 max-w-3xl font-display text-5xl leading-[0.92] tracking-tight md:text-7xl">
              Built for people who'd rather know
              <span className="italic text-amber"> than wonder.</span>
            </h2>
          </div>
          <p className="max-w-sm text-right text-foreground/70 md:text-left">
            Six instruments working in concert — to convert vague ambition into
            a calendar you can keep.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-foreground/15 bg-foreground/15 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              className="group relative bg-background p-8 transition-colors hover:bg-accent/40"
            >
              <div className="flex items-center justify-between">
                <item.icon className="h-6 w-6 text-foreground" strokeWidth={1.5} />
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/40">
                  / {item.tag}
                </span>
              </div>
              <h3 className="mt-10 font-display text-2xl leading-tight tracking-tight md:text-3xl">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-foreground/70">{item.body}</p>
              <div className="mt-8 flex items-center gap-2 text-xs text-foreground/40 transition-colors group-hover:text-foreground">
                <span className="h-px w-6 bg-current" />
                <span className="font-mono uppercase tracking-[0.2em]">0{i + 1}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
