"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { marked } from "marked";
import {
  sendAssistantMessage,
  listConversations,
  loadConversationMessages,
  deleteConversation,
  type ChatMessage,
  type ConversationSummary,
} from "@/app/actions/assistant";
import { Analytics } from "@/lib/analytics/events";

export default function AssistantChat({
  initialConversationId = null,
  initialMessages = [],
  initialConversations = [],
}: {
  initialConversationId?: string | null;
  initialMessages?: ChatMessage[];
  initialConversations?: ConversationSummary[];
}) {
  const [conversationId, setConversationId] = useState<string | null>(initialConversationId);
  const [conversations, setConversations] = useState<ConversationSummary[]>(initialConversations);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isSwitching, startSwitchTransition] = useTransition();
  const [historyOpen, setHistoryOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isPending]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (historyRef.current && !historyRef.current.contains(e.target as Node)) {
        setHistoryOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSend() {
    const text = input.trim();
    if (!text || isPending) return;

    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: text },
    ];
    setMessages(nextMessages);
    setInput("");
    setError(null);

    startTransition(async () => {
      const result = await sendAssistantMessage(conversationId, nextMessages);
      if (!result.ok) {
        setError(
          result.error === "limite_atteinte"
            ? "Tu as atteint la limite de messages pour l'instant. Réessaie dans quelques minutes."
            : "Impossible d'obtenir une réponse pour le moment. Réessaie dans un instant."
        );
        return;
      }
      setConversationId(result.conversationId);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: result.reply },
      ]);
      Analytics.questionIA();
      const fraicheListe = await listConversations();
      setConversations(fraicheListe);
    });
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleNewConversation() {
    setConversationId(null);
    setMessages([]);
    setError(null);
    setHistoryOpen(false);
  }

  function handleSwitchConversation(id: string) {
    setHistoryOpen(false);
    if (id === conversationId) return;
    startSwitchTransition(async () => {
      const msgs = await loadConversationMessages(id);
      setConversationId(id);
      setMessages(msgs);
      setError(null);
    });
  }

  function handleDeleteConversation(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    if (!window.confirm("Supprimer cette conversation ? Cette action est irréversible.")) {
      return;
    }
    startSwitchTransition(async () => {
      const result = await deleteConversation(id);
      if (result.error) return;
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (id === conversationId) {
        setConversationId(null);
        setMessages([]);
      }
    });
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("fr-CA", { day: "numeric", month: "short" });
  }

  return (
    <div className="flex flex-col h-[75vh] max-h-[800px]">
      <div className="glass rounded-2xl p-4 mb-4 flex items-start gap-3 justify-between">
        <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
          Cet assistant donne des informations générales, pas un avis professionnel. Pour tout sujet juridique, fiscal, de santé ou d&apos;immigration, consulte un(e) professionnel(le) qualifié(e).
        </p>
        <div className="flex-shrink-0 flex items-center gap-3">
          <div className="relative" ref={historyRef}>
            <button
              type="button"
              onClick={() => setHistoryOpen((o) => !o)}
              className="text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition underline"
            >
              Historique{conversations.length > 0 ? ` (${conversations.length})` : ""}
            </button>
            {historyOpen && (
              <div className="absolute right-0 mt-2 w-64 max-h-80 overflow-y-auto rounded-lg bg-[var(--color-surface)] border border-white/10 shadow-2xl z-50">
                {conversations.length === 0 && (
                  <p className="px-4 py-3 text-xs text-[var(--color-text-secondary)]">
                    Aucune conversation précédente.
                  </p>
                )}
                {conversations.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleSwitchConversation(c.id)}
                    className={`menu-item-button w-full text-left px-4 py-2.5 text-xs hover:bg-white/10 active:bg-white/20 transition flex items-center justify-between gap-2 ${
                      c.id === conversationId ? "bg-white/5" : ""
                    }`}
                  >
                    <span className="flex-1 min-w-0">
                      <span className="block truncate">{c.title || "Conversation"}</span>
                      <span className="block text-[var(--color-text-secondary)] opacity-70">
                        {formatDate(c.updated_at)}
                      </span>
                    </span>
                    <span
                      role="button"
                      onClick={(e) => handleDeleteConversation(c.id, e)}
                      aria-label="Supprimer cette conversation"
                      className="flex-shrink-0 text-[var(--color-text-secondary)] hover:text-[var(--color-danger)] transition px-1"
                    >
                      ✕
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={handleNewConversation}
            className="text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition underline"
          >
            Nouvelle conversation
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto glass rounded-2xl p-4 mb-4 space-y-4">
        {isSwitching && (
          <p className="text-sm text-[var(--color-text-secondary)]">Chargement...</p>
        )}
        {!isSwitching && messages.length === 0 && (
          <p className="text-sm text-[var(--color-text-secondary)]">
            Décris librement ta situation (financière, professionnelle, administrative ou personnelle) et je t&apos;aide à y voir plus clair.
          </p>
        )}
        {!isSwitching &&
          messages.map((message, i) => (
            <div
              key={i}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role === "assistant" ? (
                <div
                  className="max-w-[80%] rounded-2xl px-4 py-2.5 text-sm bg-white/5 text-[var(--color-text-primary)] prose-chat"
                  dangerouslySetInnerHTML={{
                    __html: marked.parse(message.content, { async: false }) as string,
                  }}
                />
              ) : (
                <div className="max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap bg-[var(--color-primary)] text-white">
                  {message.content}
                </div>
              )}
            </div>
          ))}
        {isPending && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-2xl px-4 py-2.5 text-sm bg-white/5 text-[var(--color-text-secondary)]">
              L&apos;assistant réfléchit...
            </div>
          </div>
        )}
        {error && (
          <p className="text-sm text-[var(--color-danger)]">{error}</p>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="flex items-end gap-3">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Écris ta situation ici..."
          rows={2}
          className="flex-1 rounded-lg bg-white/5 border border-white/10 px-4 py-2 outline-none focus:border-[var(--color-primary)] transition resize-none text-sm"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={isPending || !input.trim()}
          className="rounded-lg bg-[var(--color-primary)] hover:opacity-90 transition py-2 px-4 text-sm font-semibold disabled:opacity-50"
        >
          Envoyer
        </button>
      </div>
    </div>
  );
}
