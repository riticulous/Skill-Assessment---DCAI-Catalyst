import { useEffect, useRef, useState, useCallback } from 'react';

export type MessageType = 'text' | 'mcq' | 'coding' | 'mcq_answer' | 'code_answer';

export interface MCQData {
  question: string;
  options: { id: string; text: string }[];
}

export interface CodingData {
  title: string;
  description: string;
  language: string;
  starter_code: string;
  examples: { input: string; output: string; explanation?: string }[];
  hints?: string[];
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  messageType: MessageType;
  mcqData?: MCQData;
  codingData?: CodingData;
}

interface SkillProgress {
  skills: any[];
  current_skill: string | null;
  completed_count: number;
  total_count: number;
  coding_phase?: boolean;
  is_tech_role?: boolean;
  coding_language?: string;
}

export function useWebSocket(url: string | null) {
  const wsRef = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [progress, setProgress] = useState<SkillProgress | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [activeInput, setActiveInput] = useState<'text' | 'mcq' | 'coding'>('text');

  useEffect(() => {
    if (!url) return;

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => setIsConnected(true);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'message') {
        setMessages((prev) => [
          ...prev,
          { role: data.role, content: data.content, messageType: 'text' },
        ]);
        setActiveInput('text');
      } else if (data.type === 'mcq') {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: data.content,
            messageType: 'mcq',
            mcqData: data.mcq_data,
          },
        ]);
        setActiveInput('mcq');
      } else if (data.type === 'coding') {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: data.content,
            messageType: 'coding',
            codingData: data.coding_data,
          },
        ]);
        setActiveInput('coding');
      } else if (data.type === 'progress') {
        setProgress({
          skills: data.skills,
          current_skill: data.current_skill,
          completed_count: data.completed_count,
          total_count: data.total_count,
          coding_phase: data.coding_phase,
          is_tech_role: data.is_tech_role,
          coding_language: data.coding_language,
        });
      } else if (data.type === 'assessment_complete') {
        setIsComplete(true);
        setSessionId(data.session_id);
        setActiveInput('text');
      } else if (data.type === 'error') {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: `Error: ${data.content}`, messageType: 'text' },
        ]);
      }
    };

    ws.onclose = () => setIsConnected(false);
    ws.onerror = () => setIsConnected(false);

    return () => {
      ws.close();
    };
  }, [url]);

  const sendMessage = useCallback((message: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'text', message }));
      setMessages((prev) => [
        ...prev,
        { role: 'user', content: message, messageType: 'text' },
      ]);
    }
  }, []);

  const sendMCQAnswer = useCallback((selectedId: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'mcq_answer', message: selectedId }));
      setMessages((prev) => [
        ...prev,
        { role: 'user', content: `Selected: ${selectedId}`, messageType: 'mcq_answer' },
      ]);
      setActiveInput('text');
    }
  }, []);

  const sendCodeAnswer = useCallback((code: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'code_answer', message: code }));
      setMessages((prev) => [
        ...prev,
        { role: 'user', content: 'Code submitted', messageType: 'code_answer' },
      ]);
      setActiveInput('text');
    }
  }, []);

  return {
    messages,
    progress,
    isConnected,
    isComplete,
    sessionId,
    activeInput,
    sendMessage,
    sendMCQAnswer,
    sendCodeAnswer,
  };
}
