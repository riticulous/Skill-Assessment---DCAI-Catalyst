import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export function CTA() {
  const navigate = useNavigate();
  const { user, signInWithGoogle } = useAuth();

  const handleCTA = () => {
    if (user) navigate("/app");
    else signInWithGoogle();
  };

  return (
    <section className="relative overflow-hidden border-b border-foreground/10 py-24 md:py-40">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="flex flex-col items-start gap-10">
          <div className="font-mono text-xs uppercase tracking-[0.22em] text-foreground/50">
            § Begin
          </div>
          <h2 className="font-display text-[clamp(3rem,10vw,9rem)] leading-[0.86] tracking-[-0.04em] text-balance">
            Find out what you{" "}
            <span
              className="italic"
              style={{
                background: "var(--gradient-warm)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              actually
            </span>{" "}
            know.
          </h2>
          <p className="max-w-xl text-lg text-foreground/70 md:text-xl">
            One conversation. One report. The first honest read on your craft —
            and the shortest path to the role you want.
          </p>
          <div className="flex flex-wrap items-center gap-5">
            <button
              onClick={handleCTA}
              className="group inline-flex items-center gap-3 rounded-full bg-foreground px-8 py-5 text-lg font-medium text-background transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0_oklch(0.62_0.24_295)]"
            >
              Start your free probe
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </button>
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-foreground/50">
              No card · 7 minutes · Yours forever
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
