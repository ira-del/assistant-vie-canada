"use server";

import { createClient } from "@/lib/supabase/server";
import { anthropic, CLAUDE_MODEL } from "@/lib/ai/client";
import { buildProfessionalContext } from "@/lib/finance/profileContext";
import { verifierEtEnregistrerAppelIA } from "@/lib/ai/rateLimit";

export interface ImmigrationStep {
  titre: string;
  description: string;
}

export interface ImmigrationDiagnosis {
  diagnostic: string;
  etapes: ImmigrationStep[];
  organismes: string[];
  avertissement: string;
}

const SYSTEM_PROMPT = `Tu es un assistant d'orientation qui aide les utilisateurs à comprendre leur situation d'immigration au Canada et les prochaines étapes possibles, à partir de leur profil.

Génère :
- diagnostic : 3-5 phrases qui résument honnêtement leur situation actuelle (statut, ce qu'il permet et ce qu'il ne permet pas) et les enjeux principaux à connaître.
- etapes : 3-6 étapes concrètes, dans un ordre logique et priorisé, chacune avec un titre court et une description de 1-2 phrases.
- organismes : 2-5 noms d'organismes ou ressources officielles pertinents (ex: "Immigration, Réfugiés et Citoyenneté Canada (IRCC)", "Ministère de l'Immigration, de la Francisation et de l'Intégration (MIFI)" si Québec).
- avertissement : rappel clair que ceci est informatif seulement, basé sur des généralités, et ne remplace pas l'avis d'un(e) avocat(e) ou consultant(e) en immigration réglementé(e) — les règles changent souvent et chaque dossier est différent.

Règles :
- Ne JAMAIS garantir une issue (ex: "tu seras accepté(e)", "ta demande sera approuvée").
- Reste factuel sur les programmes connus (Entrée express, Programme de l'expérience québécoise, Permis vacances-travail, parrainage familial, etc.) sans inventer de délais, quotas ou critères précis si tu n'es pas certain — reste général plutôt que de donner une info fausse.
- Adapte au Québec vs le reste du Canada quand c'est pertinent (l'immigration économique a des règles distinctes au Québec).
- Réponds en français.`;

export async function generateImmigrationDiagnosis(): Promise<
  { ok: true; diagnosis: ImmigrationDiagnosis } | { ok: false; error: string }
> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "not_authenticated" };

  const autorise = await verifierEtEnregistrerAppelIA(supabase, user.id, "immigration");
  if (!autorise) return { ok: false, error: "limite_atteinte" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();
  const { data: finances } = await supabase
    .from("financial_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!profile) {
    return { ok: false, error: "profil_incomplet" };
  }

  const contextePro = finances
    ? buildProfessionalContext(profile.situation_professionnelle, finances)
    : "";

  const contexte = `
Profil de l'utilisateur :
Âge : ${profile.age} ans
Province : ${profile.province}
Statut au Canada actuel : ${profile.statut_immigration}
Situation familiale : ${profile.situation_familiale}${profile.a_des_enfants ? ", avec enfant(s)" : ", sans enfant"}
Situation professionnelle : ${profile.situation_professionnelle || "non renseignée"}
${contextePro}
`.trim();

  try {
    const response = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 4096,
      thinking: { type: "adaptive" },
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: contexte }],
      output_config: {
        format: {
          type: "json_schema",
          schema: {
            type: "object",
            properties: {
              diagnostic: { type: "string" },
              etapes: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    titre: { type: "string" },
                    description: { type: "string" },
                  },
                  required: ["titre", "description"],
                  additionalProperties: false,
                },
              },
              organismes: { type: "array", items: { type: "string" } },
              avertissement: { type: "string" },
            },
            required: ["diagnostic", "etapes", "organismes", "avertissement"],
            additionalProperties: false,
          },
        },
      },
    });

    if (response.stop_reason === "max_tokens") {
      console.error("generateImmigrationDiagnosis: réponse tronquée (max_tokens atteint)");
      return { ok: false, error: "reponse_tronquee" };
    }

    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return { ok: false, error: "reponse_vide" };
    }

    let diagnosis: ImmigrationDiagnosis;
    try {
      diagnosis = JSON.parse(textBlock.text) as ImmigrationDiagnosis;
    } catch (parseErr) {
      console.error("generateImmigrationDiagnosis: JSON invalide:", parseErr, textBlock.text);
      return { ok: false, error: "reponse_illisible" };
    }

    return { ok: true, diagnosis };
  } catch (err) {
    console.error("generateImmigrationDiagnosis failed:", err);
    return { ok: false, error: "erreur_ia" };
  }
}
