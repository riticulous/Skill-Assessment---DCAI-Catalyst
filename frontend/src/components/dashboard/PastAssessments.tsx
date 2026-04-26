import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Clock, CheckCircle2, Loader2, ArrowUpRight, Trash2 } from "lucide-react";

type Status = "in_progress" | "done";

interface Assessment {
  id: string;
  title: string;
  company?: string;
  date: string;
  status: Status;
  score?: number;
}

function StatusPill({ status }: { status: Status }) {
  if (status === "done") {
    return (
      <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-acid">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Done
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-amber">
      <Loader2 className="h-3.5 w-3.5 animate-spin" />
      In progress
    </span>
  );
}

interface PastAssessmentsProps {
  items: Assessment[];
  loading?: boolean;
  onDelete?: (id: string) => Promise<void>;
}

export function PastAssessments({ items, loading, onDelete }: PastAssessmentsProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!onDelete) return;

    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="flex h-full flex-col"
    >
      <div className="flex items-end justify-between border-b border-foreground/10 pb-5">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/55">
            Archive
          </div>
          <h2 className="mt-1 font-display text-3xl leading-none tracking-tight md:text-4xl">
            Past assessments
          </h2>
        </div>
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/50">
          {items.length} total
        </span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-5 w-5 animate-spin text-foreground/50" />
        </div>
      ) : items.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-foreground/15 p-10 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/55">
            No assessments yet — start your first probe
          </p>
        </div>
      ) : (
        <ul className="mt-5 space-y-3">
          <AnimatePresence>
            {items.map((a, i) => (
              <motion.li
                key={a.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.35, delay: i * 0.04 }}
                layout
              >
                <div className="flex items-center gap-2">
                <Link
                  to={a.status === "done" ? `/report/${a.id}` : `/assessment/${a.id}`}
                  className="group block min-w-0 flex-1 rounded-xl border border-foreground/12 bg-background/40 p-5 transition-all hover:-translate-y-0.5 hover:border-foreground/30 hover:bg-background/60 hover:shadow-[4px_4px_0_oklch(0.62_0.24_295)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/45">
                        {a.company && <span>{a.company}</span>}
                        {a.company && <span>·</span>}
                        <Clock className="h-3 w-3" />
                        <span>{a.date}</span>
                      </div>
                      <h3 className="mt-2 truncate font-display text-xl leading-tight text-foreground">
                        {a.title}
                      </h3>
                      <div className="mt-3">
                        <StatusPill status={a.status} />
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      {a.score !== undefined && (
                        <div
                          className="font-display text-3xl leading-none tracking-tight"
                          style={{
                            background: "var(--gradient-warm)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                          }}
                        >
                          {a.score}%
                        </div>
                      )}
                      <ArrowUpRight className="h-4 w-4 text-foreground/40 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
                    </div>
                  </div>

                  {a.status === "done" && a.score !== undefined && (
                    <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-foreground/10">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${a.score}%` }}
                        transition={{ duration: 1, delay: 0.6 + i * 0.1 }}
                        className="h-full rounded-full"
                        style={{ background: "var(--gradient-warm)" }}
                      />
                    </div>
                  )}
                </Link>

                {onDelete && (
                  <button
                    type="button"
                    onClick={(e) => handleDelete(e, a.id)}
                    disabled={deletingId === a.id}
                    className="shrink-0 rounded-lg p-2 text-foreground/25 transition-all hover:bg-red-500/15 hover:text-red-400 disabled:opacity-50"
                    title="Delete assessment"
                  >
                    {deletingId === a.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                )}
              </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}

      <div className="mt-6 rounded-xl border border-dashed border-foreground/15 p-5 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/55">
          Reports auto-archive after 90 days
        </p>
      </div>
    </motion.div>
  );
}
