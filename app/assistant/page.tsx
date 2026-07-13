import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AssistantChat from "@/components/assistant/AssistantChat";
import type { ChatMessage } from "@/app/actions/assistant";

export default async function AssistantPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: conversations } = await supabase
    .from("assistant_conversations")
    .select("id, title, updated_at")
    .eq("user_id", user!.id)
    .order("updated_at", { ascending: false });

  const conversationLaPlusRecente = conversations?.[0] ?? null;

  let messageRows: ChatMessage[] = [];
  if (conversationLaPlusRecente) {
    const { data } = await supabase
      .from("assistant_messages")
      .select("role, content")
      .eq("user_id", user!.id)
      .eq("conversation_id", conversationLaPlusRecente.id)
      .order("created_at", { ascending: true });
    messageRows = data ?? [];
  }

  return (
    <main className="min-h-screen gradient-bg p-4 sm:p-6 md:p-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6 md:mb-8 gap-3 flex-wrap">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Assistant IA</h1>
            <p className="text-[var(--color-text-secondary)] text-sm">
              Ton assistant de vie pour le Canada
            </p>
          </div>
          <Link
            href="/dashboard"
            className="link-button rounded-lg bg-white/10 hover:bg-white/20 transition py-2 px-4 text-sm font-semibold"
          >
            ← Tableau de bord
          </Link>
        </div>

        <AssistantChat
          initialConversationId={conversationLaPlusRecente?.id ?? null}
          initialMessages={messageRows}
          initialConversations={conversations ?? []}
        />
      </div>
    </main>
  );
}
