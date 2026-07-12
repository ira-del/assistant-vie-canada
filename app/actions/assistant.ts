"use server";

import { createClient } from "@/lib/supabase/server";
import { anthropic, CLAUDE_MODEL } from "@/lib/ai/client";
import { verifierEtEnregistrerAppelIA } from "@/lib/ai/rateLimit";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ConversationSummary {
  id: string;
  title: string;
  updated_at: string;
}

const SYSTEM_PROMPT = `Tu es l'Assistant IA d'Assistant Vie Canada, un assistant de vie généraliste qui aide les utilisateurs à réfléchir à leurs décisions financières, professionnelles, administratives et personnelles au Canada.

L'utilisateur décrit librement sa situation. Structure ta réponse ainsi :
1. Reformule brièvement la situation pour montrer que tu as compris.
2. Propose un diagnostic clair.
3. Présente les options envisageables, avec leurs avantages et inconvénients.
4. Suggère des démarches concrètes et, si pertinent, des ressources ou organismes canadiens à consulter.
5. Termine TOUJOURS par un rappel que, pour tout sujet juridique, fiscal, de santé ou lié à l'immigration, il est essentiel de consulter un(e) professionnel(le) qualifié(e) (avocat(e), comptable, consultant(e) en immigration, etc.) — précise que tes réponses sont informatives et générales, jamais un avis professionnel engageant.

Réponds en français, de façon claire, structurée et bienveillante, sans jargon inutile.`;

// La conversation complète est conservée en base pour l'affichage, mais on
// borne le contexte envoyé à Claude à chaque tour — sinon une conversation
// persistée sur plusieurs mois ferait grossir la facture indéfiniment.
const CONTEXTE_MAX_MESSAGES = 20;

function genererTitre(premierMessage: string): string {
  const texte = premierMessage.trim().replace(/\s+/g, " ");
  return texte.length > 50 ? `${texte.slice(0, 50)}…` : texte;
}

export async function sendAssistantMessage(
  conversationId: string | null,
  history: ChatMessage[]
): Promise<
  | { ok: true; reply: string; conversationId: string }
  | { ok: false; error: string }
> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "not_authenticated" };

  if (history.length === 0 || history[history.length - 1].role !== "user") {
    return { ok: false, error: "requete_invalide" };
  }

  const autorise = await verifierEtEnregistrerAppelIA(supabase, user.id, "assistant");
  if (!autorise) return { ok: false, error: "limite_atteinte" };

  const dernierMessage = history[history.length - 1];

  let idConversation = conversationId;
  if (!idConversation) {
    const { data: nouvelleConversation, error } = await supabase
      .from("assistant_conversations")
      .insert({ user_id: user.id, title: genererTitre(dernierMessage.content) })
      .select("id")
      .single();
    if (error || !nouvelleConversation) {
      console.error("sendAssistantMessage: création de conversation échouée:", error);
      return { ok: false, error: "erreur_ia" };
    }
    idConversation = nouvelleConversation.id;
  }
  if (!idConversation) {
    return { ok: false, error: "erreur_ia" };
  }

  await supabase.from("assistant_messages").insert({
    user_id: user.id,
    conversation_id: idConversation,
    role: dernierMessage.role,
    content: dernierMessage.content,
  });

  try {
    const contexte = history.slice(-CONTEXTE_MAX_MESSAGES);
    const response = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 1536,
      thinking: { type: "adaptive" },
      system: SYSTEM_PROMPT,
      messages: contexte.map((m) => ({ role: m.role, content: m.content })),
    });

    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return { ok: false, error: "reponse_vide" };
    }

    await supabase.from("assistant_messages").insert({
      user_id: user.id,
      conversation_id: idConversation,
      role: "assistant",
      content: textBlock.text,
    });

    await supabase
      .from("assistant_conversations")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", idConversation);

    return { ok: true, reply: textBlock.text, conversationId: idConversation };
  } catch (err) {
    console.error("sendAssistantMessage failed:", err);
    return { ok: false, error: "erreur_ia" };
  }
}

export async function listConversations(): Promise<ConversationSummary[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("assistant_conversations")
    .select("id, title, updated_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  return data ?? [];
}

export async function loadConversationMessages(
  conversationId: string
): Promise<ChatMessage[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("assistant_messages")
    .select("role, content")
    .eq("user_id", user.id)
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  return data ?? [];
}

export async function deleteConversation(
  conversationId: string
): Promise<{ error: string | null }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "not_authenticated" };

  const { error } = await supabase
    .from("assistant_conversations")
    .delete()
    .eq("id", conversationId)
    .eq("user_id", user.id);

  return { error: error?.message ?? null };
}
