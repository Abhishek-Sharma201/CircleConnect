"use client";
import React, { useState, useRef } from "react";
import { Bot, X, Send, Loader2, Sparkles } from "lucide-react";
import { apiFetch } from "@/src/lib/api";

const QUICK_QUESTIONS = [
  "Summarize in 3 bullets",
  "What's the main argument?",
  "What are the key takeaways?",
];

const AskAIPanel = ({ postContent }) => {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [history, setHistory] = useState([]); // [{ question, answer }]
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  const ask = async (q) => {
    const trimmed = (q || question).trim();
    if (!trimmed) return;
    setLoading(true);
    setQuestion("");
    try {
      const data = await apiFetch("/api/ai/ask-post", {
        method: "POST",
        body: JSON.stringify({ postContent, question: trimmed }),
      });
      setHistory((prev) => [
        ...prev.slice(-2), // keep last 2 exchanges
        { question: trimmed, answer: data.answer || "Sorry, I couldn't answer that." },
      ]);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (err) {
      setHistory((prev) => [
        ...prev,
        { question: trimmed, answer: `Error: ${err.message || "Request failed"}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setOpen((v) => !v)}
        title="Ask AI about this post"
        className={`fixed bottom-8 right-8 z-50 flex items-center gap-2 px-4 py-3 rounded-full shadow-lg transition-all duration-200 ${
          open
            ? "bg-[var(--geist-foreground)] text-[var(--geist-background)]"
            : "bg-[var(--accents-2)] text-[var(--geist-foreground)] hover:bg-[var(--accents-3)]"
        }`}
      >
        {open ? <X size={16} /> : <Bot size={16} />}
        <span className="text-[13px] font-medium">{open ? "Close" : "Ask AI"}</span>
      </button>

      {/* Slide-in panel */}
      <div
        className={`fixed bottom-24 right-8 z-50 w-80 rounded-xl border border-[var(--accents-2)] bg-[var(--geist-background)] shadow-2xl flex flex-col overflow-hidden transition-all duration-200 ${
          open ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        style={{ maxHeight: "420px" }}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-[var(--accents-2)] flex items-center gap-2">
          <Sparkles size={14} className="text-[var(--geist-foreground)]" />
          <span className="text-[13px] font-semibold text-[var(--geist-foreground)]">Ask about this post</span>
        </div>

        {/* Q&A history */}
        <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3 min-h-0">
          {history.length === 0 && !loading && (
            <>
              <p className="text-[12px] text-[var(--accents-5)] leading-relaxed">
                Ask anything about this post — summaries, key points, or deeper explanations.
              </p>
              <div className="flex flex-col gap-1.5 mt-2">
                {QUICK_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => ask(q)}
                    className="text-left text-[12px] px-3 py-2 rounded-md bg-[var(--accents-1)] text-[var(--accents-6)] hover:bg-[var(--accents-2)] hover:text-[var(--geist-foreground)] transition-colors border border-[var(--accents-2)]"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </>
          )}
          {history.map((item, i) => (
            <div key={i} className="flex flex-col gap-2">
              <p className="text-[12px] font-medium text-[var(--geist-foreground)] bg-[var(--accents-2)] px-3 py-2 rounded-lg self-end max-w-[85%]">
                {item.question}
              </p>
              <div className="flex gap-2 items-start">
                <Bot size={14} className="text-[var(--accents-5)] mt-0.5 shrink-0" />
                <p className="text-[12px] text-[var(--accents-6)] leading-relaxed">{item.answer}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-[var(--accents-5)]">
              <Loader2 size={13} className="animate-spin" />
              <span className="text-[12px]">Thinking…</span>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-3 py-3 border-t border-[var(--accents-2)] flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && ask()}
            placeholder="Ask a question…"
            disabled={loading}
            className="flex-1 text-[13px] bg-[var(--accents-1)] border border-[var(--accents-2)] rounded-md px-3 py-2 text-[var(--geist-foreground)] placeholder-[var(--accents-4)] focus:outline-none focus:border-[var(--accents-4)] disabled:opacity-50"
          />
          <button
            onClick={() => ask()}
            disabled={loading || !question.trim()}
            className="p-2 rounded-md bg-[var(--geist-foreground)] text-[var(--geist-background)] disabled:opacity-40 hover:opacity-80 transition-opacity"
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </>
  );
};

export default AskAIPanel;
