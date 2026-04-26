import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2,
  Play,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Copy,
  Check,
  Terminal,
  FileCode,
} from "lucide-react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { EditorView } from "@codemirror/view";

interface CodeExample {
  input: string;
  output: string;
  explanation?: string;
}

interface CodeEditorProps {
  title: string;
  description: string;
  language: string;
  starterCode: string;
  examples: CodeExample[];
  hints?: string[];
  onSubmit: (code: string) => void;
  disabled?: boolean;
}

function getLanguageExtension(lang: string) {
  const l = lang.toLowerCase();
  if (l.includes("python")) return python();
  if (l.includes("java") && !l.includes("javascript")) return java();
  if (l.includes("c++") || l.includes("cpp") || l === "c") return cpp();
  return javascript({ typescript: l.includes("typescript") });
}

const editorTheme = EditorView.theme(
  {
    "&": {
      backgroundColor: "transparent",
      fontSize: "13.5px",
    },
    ".cm-gutters": {
      backgroundColor: "rgba(255,255,255,0.03)",
      borderRight: "1px solid rgba(255,255,255,0.08)",
      color: "rgba(255,255,255,0.25)",
      minWidth: "40px",
    },
    ".cm-activeLineGutter": {
      backgroundColor: "rgba(139,92,246,0.1)",
      color: "rgba(255,255,255,0.5)",
    },
    ".cm-activeLine": {
      backgroundColor: "rgba(139,92,246,0.06)",
    },
    ".cm-cursor": {
      borderLeftColor: "#a78bfa",
    },
    ".cm-selectionBackground": {
      backgroundColor: "rgba(139,92,246,0.25) !important",
    },
    ".cm-content": {
      caretColor: "#a78bfa",
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Menlo, Monaco, monospace",
      padding: "8px 0",
    },
    ".cm-line": {
      padding: "0 8px",
    },
    ".cm-matchingBracket": {
      backgroundColor: "rgba(139,92,246,0.3)",
      outline: "1px solid rgba(139,92,246,0.5)",
    },
    ".cm-tooltip": {
      backgroundColor: "#1e1b2e",
      border: "1px solid rgba(255,255,255,0.1)",
    },
    ".cm-tooltip-autocomplete": {
      "& > ul > li[aria-selected]": {
        backgroundColor: "rgba(139,92,246,0.2)",
      },
    },
    ".cm-foldPlaceholder": {
      backgroundColor: "rgba(139,92,246,0.15)",
      border: "1px solid rgba(139,92,246,0.3)",
      color: "#a78bfa",
    },
    "&.cm-focused .cm-selectionBackground": {
      backgroundColor: "rgba(139,92,246,0.25) !important",
    },
    "&.cm-focused": {
      outline: "none",
    },
    ".cm-scroller": {
      overflow: "auto",
    },
  },
  { dark: true }
);

export function CodeEditor({
  title,
  description,
  language,
  starterCode,
  examples,
  hints = [],
  onSubmit,
  disabled,
}: CodeEditorProps) {
  const [code, setCode] = useState(starterCode);
  const [showHints, setShowHints] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"problem" | "editor">("editor");

  const langExtension = useMemo(() => getLanguageExtension(language), [language]);

  const handleSubmit = () => {
    if (code.trim() && !disabled) {
      onSubmit(code);
    }
  };

  const handleReset = () => {
    setCode(starterCode);
  };

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  const onChange = useCallback((val: string) => setCode(val), []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full overflow-hidden rounded-2xl border border-violet/20"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.14 0.04 280 / 0.95), oklch(0.12 0.03 275 / 0.9))",
        boxShadow: "0 20px 60px -20px oklch(0.62 0.24 295 / 0.35)",
      }}
    >
      {/* Title bar — mimics an IDE window */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex items-center gap-2 pl-2">
            <FileCode className="h-3.5 w-3.5 text-violet/70" />
            <span className="font-mono text-[12px] text-white/50">
              solution.{language.toLowerCase().replace("c++", "cpp").replace("javascript", "js").replace("typescript", "ts").replace("python", "py").split(" ")[0]}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-violet/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-violet/80">
            <Terminal className="h-3 w-3" />
            {language}
          </span>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex border-b border-white/[0.06]">
        <button
          type="button"
          onClick={() => setActiveTab("problem")}
          className={[
            "relative px-5 py-2.5 font-mono text-[11px] uppercase tracking-widest transition-colors",
            activeTab === "problem"
              ? "text-violet"
              : "text-white/35 hover:text-white/55",
          ].join(" ")}
        >
          Problem
          {activeTab === "problem" && (
            <motion.div
              layoutId="code-tab"
              className="absolute inset-x-0 -bottom-px h-px bg-violet"
            />
          )}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("editor")}
          className={[
            "relative px-5 py-2.5 font-mono text-[11px] uppercase tracking-widest transition-colors",
            activeTab === "editor"
              ? "text-violet"
              : "text-white/35 hover:text-white/55",
          ].join(" ")}
        >
          Editor
          {activeTab === "editor" && (
            <motion.div
              layoutId="code-tab"
              className="absolute inset-x-0 -bottom-px h-px bg-violet"
            />
          )}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "problem" ? (
          <motion.div
            key="problem"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="max-h-[420px] overflow-y-auto"
          >
            {/* Problem description */}
            <div className="border-b border-white/[0.06] px-6 py-5">
              <div className="mb-2 flex items-center gap-2">
                <Code2 className="h-4 w-4 text-violet" />
                <h3 className="text-[15px] font-semibold text-white/90">{title}</h3>
              </div>
              <p className="whitespace-pre-wrap text-[13.5px] leading-relaxed text-white/65">
                {description}
              </p>
            </div>

            {/* Examples */}
            {examples.length > 0 && (
              <div className="border-b border-white/[0.06] px-6 py-4">
                <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
                  Examples
                </div>
                <div className="flex flex-col gap-3">
                  {examples.map((ex, i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-3"
                    >
                      <div className="font-mono text-[12px] leading-5">
                        <span className="text-white/40">Input:{"  "}</span>
                        <span className="text-white/75">{ex.input}</span>
                      </div>
                      <div className="font-mono text-[12px] leading-5">
                        <span className="text-white/40">Output: </span>
                        <span className="text-emerald-400/90">{ex.output}</span>
                      </div>
                      {ex.explanation && (
                        <div className="mt-1.5 text-[12px] leading-4 text-white/40">
                          {ex.explanation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hints */}
            {hints.length > 0 && (
              <div className="px-6 py-4">
                <button
                  type="button"
                  onClick={() => setShowHints(!showHints)}
                  className="flex items-center gap-2 text-[12px] text-amber-400/60 transition-colors hover:text-amber-400/80"
                >
                  <Lightbulb className="h-3.5 w-3.5" />
                  {showHints ? "Hide" : "Show"} Hints ({hints.length})
                  {showHints ? (
                    <ChevronUp className="h-3 w-3" />
                  ) : (
                    <ChevronDown className="h-3 w-3" />
                  )}
                </button>
                <AnimatePresence>
                  {showHints && (
                    <motion.ul
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 flex flex-col gap-2 overflow-hidden pl-1"
                    >
                      {hints.map((hint, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-[13px] text-white/50"
                        >
                          <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-amber-400/50" />
                          {hint}
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="editor"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Editor toolbar */}
            <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/30">
                Your Solution
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleReset}
                  title="Reset to starter code"
                  className="rounded-md p-1.5 text-white/30 transition-colors hover:bg-white/[0.06] hover:text-white/60"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleCopy}
                  title="Copy code"
                  className="rounded-md p-1.5 text-white/30 transition-colors hover:bg-white/[0.06] hover:text-white/60"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* CodeMirror editor */}
            <div className="code-sandbox-editor">
              <CodeMirror
                value={code}
                onChange={onChange}
                height="340px"
                extensions={[langExtension, EditorView.lineWrapping]}
                theme={editorTheme}
                editable={!disabled}
                basicSetup={{
                  lineNumbers: true,
                  highlightActiveLineGutter: true,
                  highlightActiveLine: true,
                  foldGutter: true,
                  autocompletion: true,
                  bracketMatching: true,
                  closeBrackets: true,
                  indentOnInput: true,
                  tabSize: 4,
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom bar */}
      <div className="flex items-center justify-between border-t border-white/[0.06] px-5 py-3">
        <div className="flex items-center gap-4">
          <span className="font-mono text-[10px] text-white/25">
            {code.split("\n").length} lines
          </span>
          <span className="font-mono text-[10px] text-white/25">
            {code.length} chars
          </span>
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!code.trim() || disabled}
          className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
          style={{
            background: "linear-gradient(135deg, #7c3aed, #a855f7)",
            boxShadow: "0 8px 20px -8px rgba(139,92,246,0.6)",
          }}
        >
          <Play className="h-3.5 w-3.5" />
          Submit Solution
        </button>
      </div>
    </motion.div>
  );
}
