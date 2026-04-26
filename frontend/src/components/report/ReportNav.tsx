import { Link } from "react-router-dom";
import { ArrowLeft, Download, Loader2, Share2 } from "lucide-react";

interface ReportNavProps {
  onExport?: () => void;
  exporting?: boolean;
}

export function ReportNav({ onExport, exporting }: ReportNavProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-foreground/10 bg-background/70 backdrop-blur-xl print:hidden">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 md:px-10">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-foreground text-background">
              <span className="font-display text-xl leading-none">S</span>
            </div>
            <span className="font-display text-2xl tracking-tight">
              Skillprobe
            </span>
          </Link>
          <div className="hidden h-6 w-px bg-foreground/15 md:block" />
          <Link
            to="/app"
            className="hidden items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/60 transition-colors hover:text-foreground md:inline-flex"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to workspace
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <button className="hidden items-center gap-2 rounded-full border border-foreground/15 px-4 py-2 text-sm text-foreground/80 transition-colors hover:border-foreground/40 hover:text-foreground sm:inline-flex">
            <Share2 className="h-4 w-4" />
            Share
          </button>
          <button
            onClick={onExport}
            disabled={exporting || !onExport}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-background disabled:opacity-60"
            style={{ background: "var(--gradient-warm)" }}
          >
            {exporting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Exporting…
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Export PDF
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
