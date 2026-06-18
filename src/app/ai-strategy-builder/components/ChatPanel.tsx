'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, RefreshCw } from 'lucide-react';
import { useGeminiChat } from '@/lib/hooks/useGeminiChat';
import { toast } from 'sonner';
import type { StrategySection } from './StrategyBuilderLayout';

type Message = {
  id: string;
  role: 'ai' | 'user';
  text: string;
  timestamp: string;
};

type ApiMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

const SYSTEM_PROMPT = `You are a GTM Co-Pilot — an expert go-to-market strategist helping early-stage startup founders build their GTM strategy. You are concise, direct, and practical. You ask one focused question at a time to gather context, then provide actionable advice. You help founders with: positioning, ICP definition, pricing strategy, channel selection, outreach tactics, and 90-day launch plans. Use **bold** for key terms and recommendations. Keep responses under 150 words unless the founder asks for detail.`;

const initialMessages: Message[] = [
  {
    id: 'msg-1',
    role: 'ai',
    text: "Hi! I'm your GTM Co-Pilot powered by Gemini. Tell me about your startup — what does it do and who is it for?",
    timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
  },
];

interface ChatPanelProps {
  sections: StrategySection[];
  activeSection: string;
  onSectionUpdate: (id: string, content: string) => void;
  onUnlockSection: (id: string) => void;
}

export default function ChatPanel({ sections, activeSection, onSectionUpdate, onUnlockSection }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [apiHistory, setApiHistory] = useState<ApiMessage[]>([]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const { response, isLoading, error, sendMessage } = useGeminiChat(true);

  const [pendingAiMsg, setPendingAiMsg] = useState<string | null>(null);

  useEffect(() => {
    if (error) {
      toast.error('AI Co-Pilot error: ' + error.message);
    }
  }, [error]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, response]);

  // When streaming completes, add the final AI message to history
  useEffect(() => {
    if (!isLoading && response && pendingAiMsg !== response) {
      setPendingAiMsg(response);
      const timestamp = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
      const aiMsg: Message = {
        id: `msg-ai-${Date.now()}`,
        role: 'ai',
        text: response,
        timestamp,
      };
      setMessages((prev) => {
        // Remove any existing streaming placeholder and add final
        const filtered = prev.filter((m) => m.id !== 'streaming-placeholder');
        return [...filtered, aiMsg];
      });
      setApiHistory((prev) => [...prev, { role: 'assistant', content: response }]);
    }
  }, [isLoading, response]);

  const sendUserMessage = () => {
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    const timestamp = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    const userMsg: Message = {
      id: `msg-user-${Date.now()}`,
      role: 'user',
      text: userText,
      timestamp,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    const newApiHistory: ApiMessage[] = [...apiHistory, { role: 'user', content: userText }];
    setApiHistory(newApiHistory);

    const apiMessages: ApiMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...newApiHistory,
    ];

    sendMessage(apiMessages, { temperature: 0.7, max_tokens: 512 });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendUserMessage();
    }
  };

  const handleRestart = () => {
    setMessages(initialMessages);
    setApiHistory([]);
    setPendingAiMsg(null);
    setInput('');
  };

  return (
    <div className="card-base shadow-card flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
          <Sparkles size={16} className="text-white" />
        </div>
        <div>
          <p className="text-[14px] font-semibold text-foreground">GTM Co-Pilot</p>
          <p className="text-[11px] text-positive flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-positive inline-block" /> Gemini AI
          </p>
        </div>
        <button
          onClick={handleRestart}
          className="ml-auto text-muted-foreground hover:text-primary transition-colors"
          title="Restart conversation"
        >
          <RefreshCw size={15} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 chat-bubble-enter ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            {msg.role === 'ai' && (
              <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sparkles size={13} className="text-white" />
              </div>
            )}
            <div
              className={`max-w-[80%] px-3.5 py-2.5 rounded-xl text-[13px] leading-relaxed ${
                msg.role === 'ai' ?'bg-muted text-foreground rounded-tl-sm' :'gradient-primary text-white rounded-tr-sm'
              }`}
            >
              <p dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
              <p className={`text-[10px] mt-1 ${msg.role === 'ai' ? 'text-muted-foreground' : 'text-white/60'}`}>
                {msg.timestamp}
              </p>
            </div>
          </div>
        ))}

        {/* Streaming response */}
        {isLoading && response && (
          <div className="flex gap-3 chat-bubble-enter">
            <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0 mt-0.5">
              <Sparkles size={13} className="text-white" />
            </div>
            <div className="max-w-[80%] px-3.5 py-2.5 rounded-xl rounded-tl-sm text-[13px] leading-relaxed bg-muted text-foreground">
              <p dangerouslySetInnerHTML={{ __html: response.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
            </div>
          </div>
        )}

        {isLoading && !response && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
              <Sparkles size={13} className="text-white" />
            </div>
            <div className="bg-muted rounded-xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={`dot-${i}`}
                  className="w-1.5 h-1.5 rounded-full bg-muted-foreground typing-dot"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-border">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Answer the question or ask anything about your GTM strategy…"
            className="input-base resize-none text-[13px] py-2.5 min-h-[42px] max-h-[120px]"
            rows={1}
          />
          <button
            onClick={sendUserMessage}
            disabled={!input.trim() || isLoading}
            className="btn-primary px-3 py-2.5 flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
          >
            <Send size={16} />
          </button>
        </div>
        <p className="text-[10px] text-muted-foreground mt-1.5">Press Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  );
}