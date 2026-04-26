import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AssessmentNav } from '../components/assessment/AssessmentNav';
import { SkillSidebar, type Skill } from '../components/assessment/SkillSidebar';
import { SkillHeader } from '../components/assessment/SkillHeader';
import { ChatThread, type ChatMessage } from '../components/assessment/ChatThread';
import { AnswerInput } from '../components/assessment/AnswerInput';
import { useWebSocket } from '../hooks/useWebSocket';
import { getWebSocketUrl } from '../lib/api';
import { useAuth } from '../hooks/useAuth';

export default function Assessment() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { session } = useAuth();
  const [wsUrl, setWsUrl] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sessionId && session?.access_token) {
      setWsUrl(getWebSocketUrl(sessionId, session.access_token));
    }
  }, [sessionId, session?.access_token]);

  const {
    messages: rawMessages,
    progress,
    isConnected,
    isComplete,
    activeInput,
    sendMessage,
    sendMCQAnswer,
    sendCodeAnswer,
  } = useWebSocket(wsUrl);

  useEffect(() => {
    if (isComplete && sessionId) {
      const timer = setTimeout(() => navigate(`/report/${sessionId}`), 2500);
      return () => clearTimeout(timer);
    }
  }, [isComplete, sessionId, navigate]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [rawMessages]);

  const isCodingPhase = progress?.coding_phase ?? false;

  const skills: Skill[] = progress
    ? progress.skills.map((s: any) => {
        const isDone = s.status === 'assessed';
        const scoreVal = isDone && s.score ? s.score.score : undefined;
        const maxVal = isDone && s.score ? (s.score.max_score ?? 10) : 10;
        return {
          id: s.name.toLowerCase().replace(/\s+/g, '-'),
          name: s.name,
          questions: s.questions_asked ?? 0,
          total: 3,
          status: isDone ? 'done' as const : s.status === 'in_progress' ? 'in_progress' as const : 'todo' as const,
          score: scoreVal,
          maxScore: maxVal,
        };
      })
    : [];

  if (progress?.is_tech_role) {
    const codingDone = isComplete && !isCodingPhase;
    skills.push({
      id: 'coding-challenge',
      name: `Coding (${progress.coding_language || 'Code'})`,
      questions: codingDone ? 1 : 0,
      total: 1,
      status: isCodingPhase ? 'in_progress' : codingDone ? 'done' : 'todo',
      score: undefined,
      maxScore: 10,
    });
  }

  const activeSkillId = isCodingPhase
    ? 'coding-challenge'
    : progress?.current_skill
      ? progress.current_skill.toLowerCase().replace(/\s+/g, '-')
      : '';

  const completed = skills.filter((s) => s.status === 'done').length;

  const activeSkill = skills.find((s) => s.id === activeSkillId);
  const skillIndex = skills.findIndex((s) => s.id === activeSkillId) + 1;

  const chatMessages: ChatMessage[] = rawMessages.map((m, i) => ({
    id: `msg-${i}`,
    role: m.role === 'assistant' ? 'agent' : 'user',
    content: m.content,
    messageType: m.messageType,
    mcqData: m.mcqData,
    codingData: m.codingData,
  }));

  const typing =
    isConnected &&
    !isComplete &&
    rawMessages.length > 0 &&
    (rawMessages[rawMessages.length - 1].role === 'user' ||
      rawMessages[rawMessages.length - 1].messageType === 'mcq_answer' ||
      rawMessages[rawMessages.length - 1].messageType === 'code_answer');

  const showTextInput = activeInput === 'text' && !isComplete;

  return (
    <main className="grain flex h-screen flex-col overflow-hidden bg-background text-foreground">
      <AssessmentNav />

      <div className="mx-auto grid w-full max-w-[1600px] flex-1 grid-cols-12 gap-6 overflow-hidden px-6 py-6 md:px-8">
        {/* Sidebar */}
        <div className="col-span-12 lg:col-span-3 xl:col-span-3 overflow-y-auto">
          {skills.length > 0 ? (
            <SkillSidebar
              skills={skills}
              activeSkillId={activeSkillId}
              completed={completed}
            />
          ) : (
            <div className="rounded-2xl border border-foreground/10 bg-foreground/5 p-5 backdrop-blur">
              <div className="flex items-center gap-3">
                <span className="ticker-pulse h-2 w-2 rounded-full bg-violet" />
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/60">
                  Initializing probe…
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Chat panel */}
        <section
          className="col-span-12 flex h-full flex-col overflow-hidden rounded-2xl border border-foreground/10 lg:col-span-9 xl:col-span-9"
          style={{
            background:
              'linear-gradient(180deg, oklch(0.18 0.05 275 / 0.55), oklch(0.16 0.04 270 / 0.4))',
            boxShadow: '0 30px 80px -40px oklch(0.62 0.24 295 / 0.4)',
          }}
        >
          <SkillHeader
            skillName={
              isCodingPhase
                ? `Coding Challenge · ${progress?.coding_language || ''}`
                : activeSkill?.name || (isComplete ? 'Assessment Complete' : 'Starting…')
            }
            questionIndex={activeSkill?.questions ?? 0}
            questionTotal={activeSkill?.total ?? 0}
            skillIndex={skillIndex || 1}
            skillTotal={skills.length || 1}
          />

          <div ref={scrollRef} className="flex-1 overflow-y-auto">
            <ChatThread
              messages={chatMessages}
              typing={typing}
              onMCQSubmit={sendMCQAnswer}
              onCodeSubmit={sendCodeAnswer}
              activeInput={activeInput}
            />
          </div>

          {showTextInput && (
            <AnswerInput onSend={sendMessage} disabled={!isConnected || isComplete} />
          )}
        </section>
      </div>
    </main>
  );
}
