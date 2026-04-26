import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export function Nav() {
  const { user, signInWithGoogle } = useAuth();

  const handleCTA = () => {
    if (user) window.location.href = "/app";
    else signInWithGoogle();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-foreground/10 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 md:px-10">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-foreground text-background">
            <span className="font-display text-xl leading-none">S</span>
          </div>
          <span className="font-display text-2xl tracking-tight">Skillprobe</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm md:flex">
          <a href="#how" className="text-foreground/70 transition-colors hover:text-foreground">How it works</a>
          <a href="#capabilities" className="text-foreground/70 transition-colors hover:text-foreground">Capabilities</a>
          <a href="#proof" className="text-foreground/70 transition-colors hover:text-foreground">Proof</a>
          <a href="#faq" className="text-foreground/70 transition-colors hover:text-foreground">FAQ</a>
        </nav>

        <div className="flex items-center gap-3">
          <button onClick={handleCTA} className="hidden text-sm text-foreground/70 hover:text-foreground sm:block">
            {user ? "Dashboard" : "Sign in"}
          </button>
          <button
            onClick={handleCTA}
            className="group inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-transform hover:-translate-y-0.5"
          >
            Begin assessment
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </button>
        </div>
      </div>
    </header>
  );
}
