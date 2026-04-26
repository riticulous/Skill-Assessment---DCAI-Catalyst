import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export function Hero() {
  const navigate = useNavigate();
  const { user, signInWithGoogle } = useAuth();

  const handleCTA = () => {
    if (user) navigate("/app");
    else signInWithGoogle();
  };

  return (
    <section className="relative overflow-hidden border-b border-foreground/10">
      {/* Date strip */}
      <div className="border-b border-foreground/10 px-6 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/60 md:px-10">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between">
          <span>Vol. 01 — Edition Now</span>
          <span className="hidden md:inline">A field instrument for honest careers</span>
          <span className="flex items-center gap-2">
            <span className="ticker-pulse h-1.5 w-1.5 rounded-full bg-rose" />
            Live · AI-powered skill assessment
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-10 md:py-24">
        <div className="grid grid-cols-12 gap-6">
          {/* Left meta column */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="col-span-12 md:col-span-3"
          >
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-foreground/50">
              № 001 / Field Report
            </div>
            <div className="mt-6 h-px w-12 bg-foreground/30" />
            <p className="mt-6 max-w-[14rem] text-sm leading-relaxed text-foreground/70">
              An AI agent that holds a real conversation about your craft —
              then prescribes exactly what to learn next.
            </p>
          </motion.div>

          {/* Headline */}
          <div className="col-span-12 md:col-span-9">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="font-display text-[clamp(3.5rem,11vw,11rem)] leading-[0.86] tracking-[-0.04em] text-balance"
            >
              Your resume{" "}
              <span className="italic text-foreground/40">claims.</span>
              <br />
              We find out{" "}
              <span
                className="italic"
                style={{
                  background: "var(--gradient-warm)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                what's true.
              </span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-12"
            >
              <div className="md:col-span-7">
                <p className="text-lg leading-relaxed text-foreground/80 md:text-xl text-pretty">
                  Drop in a job description and your résumé. Our agent runs a
                  live, adaptive interview — measuring real proficiency on every
                  required skill. You leave with a brutally honest gap report and
                  a curated learning plan you can actually finish.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <button
                    onClick={handleCTA}
                    className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-foreground px-7 py-4 text-base font-medium text-background transition-all hover:-translate-y-0.5 hover:shadow-[6px_6px_0_oklch(0.62_0.24_295)]"
                  >
                    Start the probe
                    <span className="text-lg transition-transform group-hover:translate-x-1">↗</span>
                  </button>
                  <a
                    href="#proof"
                    className="group inline-flex items-center gap-2 px-2 py-4 text-base text-foreground underline decoration-foreground/30 underline-offset-[6px] transition-colors hover:decoration-foreground"
                  >
                    See a sample report
                  </a>
                </div>

                <div className="mt-8 flex items-center gap-6 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/50">
                  <span>· No résumé hoarding</span>
                  <span>· Avg. 7 min</span>
                  <span>· Free first probe</span>
                </div>
              </div>

              {/* Right card — mock probe */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
                className="md:col-span-5"
              >
                <div className="hover-lift relative rounded-2xl border border-foreground bg-background/60 p-5 backdrop-blur">
                  <div className="flex items-center justify-between border-b border-foreground/15 pb-3">
                    <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/60">
                      <span className="h-1.5 w-1.5 rounded-full bg-rose ticker-pulse" />
                      Live probe · React Engineer
                    </div>
                    <span className="font-mono text-[10px] text-foreground/40">07:42</span>
                  </div>

                  <div className="mt-4 space-y-3 text-sm">
                    <div className="rounded-lg bg-foreground/5 p-3">
                      <div className="font-mono text-[10px] uppercase tracking-wider text-foreground/50">Agent</div>
                      <p className="mt-1">You mentioned debouncing input. Walk me through the trade-off
                      between debouncing in a controlled component vs an uncontrolled one.</p>
                    </div>
                    <div className="ml-6 rounded-lg border border-foreground/15 p-3">
                      <div className="font-mono text-[10px] uppercase tracking-wider text-foreground/50">You</div>
                      <p className="mt-1 text-foreground/80">In a controlled component, the value lives in state, so debouncing the handler still triggers re-renders…</p>
                    </div>

                    <div className="rounded-lg border border-dashed border-foreground/30 p-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-foreground/50">Inferred depth</span>
                        <span className="font-mono text-xs">8.4 / 10</span>
                      </div>
                      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-foreground/10">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "84%" }}
                          transition={{ duration: 1.2, delay: 1 }}
                          className="h-full rounded-full"
                          style={{ background: "var(--gradient-warm)" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-3 px-1 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/50">
                  Excerpt — actual probe transcript
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Marquee */}
      <div className="overflow-hidden border-t border-foreground/10 py-5">
        <div className="marquee flex w-max gap-12 font-display text-3xl whitespace-nowrap text-foreground/30 md:text-5xl">
          {Array.from({ length: 2 }).flatMap((_, i) => [
            <span key={`a${i}`}>Honest assessment</span>,
            <span key={`b${i}`} className="text-amber">✦</span>,
            <span key={`c${i}`} className="italic">No fluff feedback</span>,
            <span key={`d${i}`} className="text-violet">●</span>,
            <span key={`e${i}`}>Adjacent skill discovery</span>,
            <span key={`f${i}`} className="text-rose">◆</span>,
            <span key={`g${i}`} className="italic">Curated learning plan</span>,
            <span key={`h${i}`}>—</span>,
          ])}
        </div>
      </div>
    </section>
  );
}
