import { motion, AnimatePresence } from "framer-motion";
import { Bot, User, CheckCircle2, Code2 } from "lucide-react";
import type { MessageType, MCQData, CodingData } from "../../hooks/useWebSocket";
import { MCQCard } from "./MCQCard";
import { CodeEditor } from "./CodeEditor";

export type ChatRole = "agent" | "user";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  messageType?: MessageType;
  mcqData?: MCQData;
  codingData?: CodingData;
}

interface ChatThreadProps {
  messages: ChatMessage[];
  typing?: boolean;
  onMCQSubmit?: (selectedId: string) => void;
  onCodeSubmit?: (code: string) => void;
  activeInput?: "text" | "mcq" | "coding";
}

export function ChatThread({
  messages,
  typing,
  onMCQSubmit,
  onCodeSubmit,
  activeInput,
}: ChatThreadProps) {
  return (
    <div className="flex flex-col gap-6 px-6 py-8 md:px-10">
      <AnimatePresence initial={false}>
        {messages.map((m, i) => {
          const isLastMCQ =
            m.messageType === "mcq" &&
            m.role === "agent" &&
            activeInput === "mcq" &&
            i === messages.length - 1;

          const isLastCoding =
            m.messageType === "coding" &&
            m.role === "agent" &&
            activeInput === "coding" &&
            !messages.slice(i + 1).some((x) => x.messageType === "code_answer");

          if (isLastMCQ && m.mcqData && onMCQSubmit) {
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="flex items-start gap-3"
              >
                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-violet/30 bg-violet/10 text-violet">
                  <Bot className="h-4 w-4" />
                </div>
                <MCQCard
                  question={m.mcqData.question}
                  options={m.mcqData.options}
                  onSubmit={onMCQSubmit}
                />
              </motion.div>
            );
          }

          if (isLastCoding && m.codingData && onCodeSubmit) {
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="flex items-start gap-3"
              >
                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-violet/30 bg-violet/10 text-violet">
                  <Code2 className="h-4 w-4" />
                </div>
                <CodeEditor
                  title={m.codingData.title}
                  description={m.codingData.description}
                  language={m.codingData.language}
                  starterCode={m.codingData.starter_code}
                  examples={m.codingData.examples}
                  hints={m.codingData.hints}
                  onSubmit={onCodeSubmit}
                />
              </motion.div>
            );
          }

          if (m.messageType === "mcq" && m.role === "agent" && m.mcqData) {
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="flex items-start gap-3"
              >
                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-violet/30 bg-violet/10 text-violet">
                  <Bot className="h-4 w-4" />
                </div>
                <MCQCard
                  question={m.mcqData.question}
                  options={m.mcqData.options}
                  onSubmit={() => {}}
                  disabled
                />
              </motion.div>
            );
          }

          if (m.messageType === "mcq_answer") {
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="flex items-start gap-3 flex-row-reverse"
              >
                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-foreground/15 bg-foreground/5 text-foreground/70">
                  <User className="h-4 w-4" />
                </div>
                <div
                  className="flex items-center gap-2 rounded-2xl px-5 py-3.5 text-[15px] text-background"
                  style={{
                    background: "var(--gradient-warm)",
                    boxShadow: "0 8px 24px -10px oklch(0.62 0.24 295 / 0.55)",
                  }}
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  {m.content}
                </div>
              </motion.div>
            );
          }

          if (m.messageType === "code_answer") {
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="flex items-start gap-3 flex-row-reverse"
              >
                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-foreground/15 bg-foreground/5 text-foreground/70">
                  <User className="h-4 w-4" />
                </div>
                <div
                  className="flex items-center gap-2 rounded-2xl px-5 py-3.5 text-[15px] text-background"
                  style={{
                    background: "var(--gradient-warm)",
                    boxShadow: "0 8px 24px -10px oklch(0.62 0.24 295 / 0.55)",
                  }}
                >
                  <Code2 className="h-4 w-4 shrink-0" />
                  Code submitted
                </div>
              </motion.div>
            );
          }

          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: Math.min(i * 0.03, 0.2) }}
              className={[
                "flex items-start gap-3",
                m.role === "user" ? "flex-row-reverse" : "flex-row",
              ].join(" ")}
            >
              <div
                className={[
                  "mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border",
                  m.role === "agent"
                    ? "border-violet/30 bg-violet/10 text-violet"
                    : "border-foreground/15 bg-foreground/5 text-foreground/70",
                ].join(" ")}
              >
                {m.role === "agent" ? (
                  <Bot className="h-4 w-4" />
                ) : (
                  <User className="h-4 w-4" />
                )}
              </div>

              <div
                className={[
                  "max-w-[78%] rounded-2xl px-5 py-3.5 text-[15px] leading-relaxed",
                  m.role === "agent"
                    ? "border border-foreground/10 bg-foreground/[0.04] text-foreground/90"
                    : "text-background",
                ].join(" ")}
                style={
                  m.role === "user"
                    ? {
                        background: "var(--gradient-warm)",
                        boxShadow: "0 8px 24px -10px oklch(0.62 0.24 295 / 0.55)",
                      }
                    : undefined
                }
              >
                {m.content}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {typing && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3"
        >
          <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-lg border border-violet/30 bg-violet/10 text-violet">
            <Bot className="h-4 w-4" />
          </div>
          <div className="rounded-2xl border border-foreground/10 bg-foreground/[0.04] px-5 py-4">
            <div className="flex gap-1.5">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-foreground/50 [animation-delay:-0.3s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-foreground/50 [animation-delay:-0.15s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-foreground/50" />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
