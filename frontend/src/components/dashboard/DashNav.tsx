import { Link, useNavigate } from "react-router-dom";
import { LayoutGrid, LogOut } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export function DashNav() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const name =
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined;
  const initials = name
    .split(" ")
    .map((n: string) => n[0])
    .slice(0, 2)
    .join("");

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
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

        <div className="flex items-center gap-3 md:gap-5">
          <Link
            to="/app"
            className="group inline-flex items-center gap-2 rounded-full border border-foreground/15 px-4 py-2 text-sm text-foreground/80 transition-colors hover:border-foreground/40 hover:text-foreground"
          >
            <LayoutGrid className="h-4 w-4" />
            Dashboard
          </Link>

          <div className="hidden h-6 w-px bg-foreground/15 md:block" />

          <div className="flex items-center gap-3">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt=""
                className="h-9 w-9 rounded-full object-cover"
              />
            ) : (
              <div
                className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-medium text-background"
                style={{ background: "var(--gradient-warm)" }}
              >
                {initials}
              </div>
            )}
            <span className="hidden text-sm text-foreground/90 sm:block">{name}</span>
            <button
              onClick={handleSignOut}
              aria-label="Sign out"
              className="rounded-full p-2 text-foreground/60 transition-colors hover:bg-foreground/5 hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
