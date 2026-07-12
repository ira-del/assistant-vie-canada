import { createClient } from "@/lib/supabase/server";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

// Limites par fonctionnalité IA — évite les abus/coûts incontrôlés si l'app
// devient publique. Le chat est plus permissif car une conversation normale
// enchaîne plusieurs messages ; les autres sont "générer sur clic", donc
// utilisés plus rarement par session.
const LIMITES = {
  advisor: { maxAppels: 15, fenetreMinutes: 60 },
  assistant: { maxAppels: 30, fenetreMinutes: 60 },
  opportunities: { maxAppels: 15, fenetreMinutes: 60 },
  immigration: { maxAppels: 15, fenetreMinutes: 60 },
} as const;

export type ActionIA = keyof typeof LIMITES;

// Vérifie si l'utilisateur peut encore appeler cette action IA dans la
// fenêtre glissante, et enregistre l'appel s'il est autorisé. Retourne
// false sans rien enregistrer si la limite est déjà atteinte.
export async function verifierEtEnregistrerAppelIA(
  supabase: SupabaseServerClient,
  userId: string,
  action: ActionIA
): Promise<boolean> {
  const { maxAppels, fenetreMinutes } = LIMITES[action];
  const depuis = new Date(Date.now() - fenetreMinutes * 60 * 1000).toISOString();

  const { count } = await supabase
    .from("ai_usage_log")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("action", action)
    .gte("created_at", depuis);

  if ((count ?? 0) >= maxAppels) {
    return false;
  }

  await supabase.from("ai_usage_log").insert({ user_id: userId, action });
  return true;
}
