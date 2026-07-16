import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChatSessions, useProfile, type ChatSession, type ChatMessage } from "@/lib/store";
import { chatCompletion, deleteChatSession } from "@/lib/ai.functions";
import { Send, MessageSquare, Plus, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import React from "react";

function formatMarkdown(text: string) {
  // Replace bold **text** with <strong>text</strong>
  let formatted = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  // Replace single asterisks *text* with <em>text</em>
  formatted = formatted.replace(/\*(.*?)\*/g, "<em>$1</em>");
  
  // Split by newlines and handle paragraphs/lists
  const lines = formatted.split("\n");
  const elements: React.ReactNode[] = [];
  let currentList: React.ReactNode[] = [];
  
  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      currentList.push(
        <li key={`li-${idx}`} className="ml-4 list-disc text-sm leading-relaxed animate-in fade-in duration-200" dangerouslySetInnerHTML={{ __html: trimmed.substring(2) }} />
      );
    } else {
      if (currentList.length > 0) {
        elements.push(<ul key={`ul-${idx}`} className="my-2 space-y-1">{currentList}</ul>);
        currentList = [];
      }
      if (trimmed !== "") {
        elements.push(
          <p key={`p-${idx}`} className="my-1.5 leading-relaxed" dangerouslySetInnerHTML={{ __html: line }} />
        );
      }
    }
  });
  
  if (currentList.length > 0) {
    elements.push(<ul key={`ul-final`} className="my-2 space-y-1">{currentList}</ul>);
  }
  
  return <div className="space-y-1">{elements}</div>;
}

const SUGGESTIONS = [
  "Which college is best for me?",
  "Can I get admission with my marks?",
  "Which branch should I choose?",
  "What documents are required?",
  "What are the fees?",
  "What are the deadlines?",
];

export function Chat() {
  const [sessions, setSessions] = useChatSessions();
  const [profile] = useProfile();
  const [activeId, setActiveId] = useState<string | null>(sessions[0]?.id ?? null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const active = sessions.find((s) => s.id === activeId) ?? null;

  // Sync activeId when sessions load asynchronously
  useEffect(() => {
    if (!activeId && sessions.length > 0) {
      setActiveId(sessions[0].id);
    }
  }, [sessions, activeId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [active?.messages.length, loading]);

  function newSession(): ChatSession {
    const s: ChatSession = { id: crypto.randomUUID(), title: "New chat", messages: [], ts: Date.now() };
    setSessions([s, ...sessions]);
    setActiveId(s.id);
    return s;
  }

  async function send(text: string) {
    if (!text.trim() || loading) return;
    let session = active;
    if (!session) session = newSession();
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", content: text, ts: Date.now() };
    const updated: ChatSession = {
      ...session,
      title: session.messages.length === 0 ? text.slice(0, 40) : session.title,
      messages: [...session.messages, userMsg],
    };
    setSessions(sessions.map((s) => (s.id === session!.id ? updated : s)).concat(sessions.find((s) => s.id === session!.id) ? [] : [updated]));
    setActiveId(updated.id);
    setInput("");
    setLoading(true);
    try {
      const res = await chatCompletion({
        messages: updated.messages.map((m) => ({ role: m.role, content: m.content })),
        sessionId: session.messages.length > 0 ? session.id : undefined,
        profile
      }) as { text: string; sessionId: string };

      const asstMsg: ChatMessage = { id: crypto.randomUUID(), role: "assistant", content: res.text, ts: Date.now() };
      const withReply: ChatSession = {
        ...updated,
        id: res.sessionId, // Sync the client ID with Supabase session ID
        messages: [...updated.messages, asstMsg]
      };
      setSessions((prev) => prev.map((s) => (s.id === session!.id ? withReply : s)));
      setActiveId(res.sessionId);
    } catch (e) {
      console.error(e);
      toast.error("AI failed to reply");
    } finally {
      setLoading(false);
    }
  }

  async function deleteSession(id: string) {
    const next = sessions.filter((s) => s.id !== id);
    setSessions(next);
    if (activeId === id) setActiveId(next[0]?.id ?? null);
    try {
      await deleteChatSession(id);
    } catch (e) {
      console.error("Failed to delete chat session from database:", e);
    }
  }

  return (
    <div className="mx-auto grid h-[calc(100vh-8rem)] max-w-7xl grid-cols-1 gap-4 lg:grid-cols-[280px_1fr]">
      <aside className="hidden flex-col rounded-2xl border border-border bg-surface/30 lg:flex">
        <div className="border-b border-border p-3">
          <button onClick={newSession}
            className="flex w-full items-center gap-2 rounded-lg bg-brand px-3 py-2 text-sm font-semibold text-brand-foreground">
            <Plus className="size-4" /> New chat
          </button>
        </div>
        <div className="flex-1 space-y-1 overflow-y-auto p-2">
          {sessions.length === 0 && <p className="p-4 text-xs text-muted-foreground">No chats yet.</p>}
          {sessions.map((s) => (
            <div key={s.id} className={`group flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${activeId === s.id ? "bg-brand/10 text-brand" : "text-muted-foreground hover:bg-secondary"}`}>
              <button onClick={() => setActiveId(s.id)} className="flex-1 truncate text-left">{s.title}</button>
              <button onClick={() => deleteSession(s.id)} className="opacity-0 group-hover:opacity-100">
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      </aside>

      <div className="flex flex-col rounded-2xl border border-border bg-surface/30">
        <div ref={scrollRef} className="flex-1 space-y-6 overflow-y-auto p-6">
          {!active || active.messages.length === 0 ? (
            <EmptyChat onPick={(q) => send(q)} />
          ) : (
            <AnimatePresence>
              {active.messages.map((m) => (
                <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}>
                  {m.role === "assistant" && (
                    <div className="grid size-8 shrink-0 place-items-center rounded-full bg-brand/20 text-brand ring-1 ring-brand/40 font-mono text-xs">AI</div>
                  )}
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${m.role === "user" ? "bg-brand text-brand-foreground" : "bg-secondary"}`}>
                    <div className="whitespace-pre-wrap">
                      {m.role === "assistant" ? formatMarkdown(m.content) : m.content}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
          {loading && (
            <div className="flex gap-3">
              <div className="grid size-8 shrink-0 place-items-center rounded-full bg-brand/20 text-brand ring-1 ring-brand/40 font-mono text-xs">AI</div>
              <div className="rounded-2xl bg-secondary px-4 py-3">
                <Loader2 className="size-4 animate-spin text-brand" />
              </div>
            </div>
          )}
        </div>
        <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex gap-2 border-t border-border p-3">
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask Gredis anything about admissions…"
            className="h-11 flex-1 rounded-lg border border-border bg-background px-3 outline-none focus:border-brand" />
          <button disabled={loading || !input.trim()}
            className="grid size-11 place-items-center rounded-lg bg-brand text-brand-foreground disabled:opacity-40">
            <Send className="size-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

function EmptyChat({ onPick }: { onPick: (q: string) => void }) {
  return (
    <div className="grid h-full place-items-center">
      <div className="max-w-lg text-center">
        <div className="mx-auto mb-6 grid size-14 place-items-center rounded-2xl bg-brand/15 text-brand ring-1 ring-brand/30">
          <MessageSquare className="size-6" />
        </div>
        <h2 className="mb-2 font-display text-2xl font-semibold">Ask your AI counselor</h2>
        <p className="mb-8 text-sm text-muted-foreground">Try one of these:</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {SUGGESTIONS.map((s) => (
            <button key={s} onClick={() => onPick(s)}
              className="rounded-lg border border-border bg-surface/40 p-3 text-left text-sm hover:border-brand/40">
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
