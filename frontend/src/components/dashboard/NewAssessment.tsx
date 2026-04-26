import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { UploadCloud, FileText, X, Sparkles, Loader2 } from "lucide-react";

interface NewAssessmentProps {
  onStart: (jd: string, file: File, title: string) => Promise<void>;
  loading?: boolean;
  error?: string;
}

export function NewAssessment({ onStart, loading, error }: NewAssessmentProps) {
  const [title, setTitle] = useState("");
  const [jd, setJd] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f && f.type === "application/pdf") setFile(f);
  };

  const ready = jd.trim().length > 80 && file && !loading;

  const handleBegin = () => {
    if (ready && file) onStart(jd, file, title);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="hover-lift relative rounded-2xl border border-foreground/15 bg-background/40 p-6 backdrop-blur md:p-8"
    >
      {/* Header */}
      <div className="flex items-start gap-4 border-b border-foreground/10 pb-5">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
          style={{ background: "var(--gradient-warm)" }}
        >
          <Sparkles className="h-5 w-5 text-background" />
        </div>
        <div className="flex-1">
          <h2 className="font-display text-3xl leading-none tracking-tight md:text-4xl">
            New Assessment
          </h2>
          <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/55">
            Paste a JD · Upload résumé · ~7 min probe
          </p>
        </div>
      </div>

      {/* Assessment Title */}
      <div className="mt-6">
        <label className="font-mono text-xs uppercase tracking-[0.18em] text-foreground/70">
          Assessment Title
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Software Engineer 3 · Google"
          className="mt-3 w-full rounded-xl border border-foreground/15 bg-background/60 px-4 py-3.5 text-sm text-foreground placeholder:text-foreground/40 focus:border-violet/60 focus:outline-none focus:ring-2 focus:ring-violet/30"
          style={{ fontFamily: "var(--font-sans)" }}
        />
        <p className="mt-1.5 font-mono text-[10px] text-foreground/40">
          Optional — helps you identify this probe later
        </p>
      </div>

      {/* Job Description */}
      <div className="mt-6">
        <div className="flex items-center justify-between">
          <label className="font-mono text-xs uppercase tracking-[0.18em] text-foreground/70">
            Job Description
          </label>
          <span className="font-mono text-[11px] text-foreground/50">
            {jd.length.toLocaleString()} chars
          </span>
        </div>
        <textarea
          value={jd}
          onChange={(e) => setJd(e.target.value)}
          placeholder="Paste the full job description here — role, responsibilities, required skills, nice-to-haves…"
          rows={7}
          className="mt-3 w-full resize-none rounded-xl border border-foreground/15 bg-background/60 p-4 text-sm leading-relaxed text-foreground placeholder:text-foreground/40 focus:border-violet/60 focus:outline-none focus:ring-2 focus:ring-violet/30"
          style={{ fontFamily: "var(--font-sans)" }}
        />
      </div>

      {/* Resume Upload */}
      <div className="mt-7">
        <label className="font-mono text-xs uppercase tracking-[0.18em] text-foreground/70">
          Résumé (PDF)
        </label>

        {!file ? (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
            className={`mt-3 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed p-10 text-center transition-all ${
              dragging
                ? "border-violet bg-violet/10"
                : "border-foreground/20 hover:border-foreground/40 hover:bg-foreground/5"
            }`}
          >
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full"
              style={{ background: "var(--gradient-warm)" }}
            >
              <UploadCloud className="h-5 w-5 text-background" />
            </div>
            <p className="mt-4 text-sm text-foreground/85">
              Drop your résumé here
            </p>
            <p className="mt-1 text-sm text-foreground/55">
              or{" "}
              <span className="text-violet underline decoration-violet/40 underline-offset-4">
                browse files
              </span>{" "}
              · PDF up to 10MB
            </p>
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setFile(f);
              }}
            />
          </div>
        ) : (
          <div className="mt-3 flex items-center justify-between rounded-xl border border-foreground/15 bg-background/60 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-foreground/10">
                <FileText className="h-4 w-4 text-foreground" />
              </div>
              <div>
                <div className="text-sm text-foreground">{file.name}</div>
                <div className="font-mono text-[11px] text-foreground/50">
                  {(file.size / 1024).toFixed(0)} KB · ready
                </div>
              </div>
            </div>
            <button
              onClick={() => setFile(null)}
              className="rounded-full p-2 text-foreground/60 transition-colors hover:bg-foreground/10 hover:text-foreground"
              aria-label="Remove file"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="mt-4 rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* CTA Row */}
      <div className="mt-8 flex flex-col-reverse items-stretch justify-between gap-4 border-t border-foreground/10 pt-6 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/55">
          <span>· Private</span>
          <span>· Adaptive</span>
          <span>· No résumé hoarding</span>
        </div>
        <button
          onClick={handleBegin}
          disabled={!ready}
          className="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full bg-foreground px-7 py-3.5 text-sm font-medium text-background transition-all hover:-translate-y-0.5 hover:shadow-[6px_6px_0_oklch(0.62_0.24_295)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:shadow-none"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyzing…
            </>
          ) : (
            <>
              Begin probe
              <span className="text-base transition-transform group-hover:translate-x-1">↗</span>
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
