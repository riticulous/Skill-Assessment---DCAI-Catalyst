import { Link } from "react-router-dom";
import { ArrowUpRight, RotateCw } from "lucide-react";

export function ReportCTA() {
  return (
    <section className="border-b border-foreground/10 py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div
          className="relative overflow-hidden rounded-2xl border border-foreground/15 p-10 md:p-16"
          style={{
            background:
              "radial-gradient(circle at 0% 100%, oklch(0.62 0.24 295 / 0.25), transparent 55%), radial-gradient(circle at 100% 0%, oklch(0.66 0.2 245 / 0.2), transparent 55%), oklch(0.18 0.04 268)",
          }}
        >
          <div className="grid gap-10 md:grid-cols-12 md:items-center">
            <div className="md:col-span-7">
              <div className="font-mono text-xs uppercase tracking-[0.22em] text-foreground/55">
                § What now?
              </div>
              <h3 className="mt-4 font-display text-4xl leading-[0.95] tracking-tight md:text-6xl">
                Ship the plan.
                <br />
                <span className="italic">Re-probe in 5 weeks.</span>
              </h3>
              <p className="mt-5 max-w-lg text-foreground/70">
                Reports are most useful when paired with their re-take. Schedule
                the next probe now — you'll have something to compare against.
              </p>
            </div>

            <div className="flex flex-col gap-3 md:col-span-5">
              <Link
                to="/app"
                className="inline-flex items-center justify-between gap-3 rounded-xl px-6 py-4 text-base font-medium text-background"
                style={{ background: "var(--gradient-warm)" }}
              >
                Start a follow-up probe
                <ArrowUpRight className="h-5 w-5" />
              </Link>
              <Link
                to="/app"
                className="inline-flex items-center justify-between gap-3 rounded-xl border border-foreground/20 px-6 py-4 text-base text-foreground/90 transition-colors hover:border-foreground/40"
              >
                Re-run on a new JD
                <RotateCw className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
