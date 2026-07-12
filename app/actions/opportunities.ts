"use server";

import { createClient } from "@/lib/supabase/server";
import { anthropic, CLAUDE_MODEL } from "@/lib/ai/client";
import { buildProfessionalContext } from "@/lib/finance/profileContext";
import { verifierEtEnregistrerAppelIA } from "@/lib/ai/rateLimit";

export interface Opportunity {
  titre: string;
  categorie: string;
  description: string;
  demarche: string;
  organisme: string;
}

const SYSTEM_PROMPT = `Tu es un assistant qui identifie des opportunités financières et administratives réelles et pertinentes pour un utilisateur au Canada, à partir de son profil complet.

Génère entre 4 et 8 opportunités personnalisées, choisies parmi ces catégories : aide financière, bourse, crédit d'impôt, subvention, type de compte à ouvrir (ex: CELI, REER, REEE, CELIAPP), programme gouvernemental.

Règles :
- Base-toi sur des programmes RÉELS et connus (fédéraux et/ou propres à sa province), adaptés à son âge, son statut d'immigration, sa situation familiale et professionnelle, et ses chiffres.
- Priorise ce qui est le plus pertinent et probable pour SA situation précise, pas une liste générique identique pour tout le monde.
- Si son statut d'immigration limite l'admissibilité à certains programmes, n'inclus pas ces programmes ou précise la nuance dans la description.
- Ne jamais inventer un montant précis ou un taux si tu n'es pas certain — reste général plutôt que de donner un chiffre faux.
- Réponds en français.

Pour chaque opportunité, fournis un contenu DÉTAILLÉ (pas juste une phrase) :
- titre : clair et spécifique (pas juste le nom générique du programme)
- categorie
- description : 3 à 5 phrases expliquant concrètement ce que c'est, à qui ça s'adresse, et pourquoi ça s'applique précisément à CETTE personne (mentionne des éléments de son profil)
- demarche : 2 à 4 phrases décrivant les étapes concrètes à suivre, les documents généralement demandés, et où/comment faire la demande (formulaire, en ligne, en personne, etc.)
- organisme : le nom exact de l'organisme responsable (ex: "Agence du revenu du Canada (ARC)", "Revenu Québec", "Service Canada", "Emploi et Développement social Canada (EDSC)")`;

export async function generateOpportunities(): Promise<
  { ok: true; opportunites: Opportunity[] } | { ok: false; error: string }
> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "not_authenticated" };

  const autorise = await verifierEtEnregistrerAppelIA(supabase, user.id, "opportunities");
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

  if (!profile || !finances) {
    return { ok: false, error: "profil_incomplet" };
  }

  const revenuMensuelTotal =
    Number(finances.salaire_mensuel) + Number(finances.autres_revenus);
  const contextePro = buildProfessionalContext(profile.situation_professionnelle, finances);

  const contexte = `
Profil de l'utilisateur :
Âge : ${profile.age} ans
Province : ${profile.province}
Statut au Canada : ${profile.statut_immigration}
Situation familiale : ${profile.situation_familiale}${profile.a_des_enfants ? ", avec enfant(s)" : ", sans enfant"}
Situation professionnelle : ${profile.situation_professionnelle || "non renseignée"}
${contextePro}

Situation financière :
Revenu mensuel total : ${revenuMensuelTotal} $
Dépenses mensuelles : ${finances.depenses_mensuelles} $
Épargne actuelle : ${finances.epargne_actuelle} $
Dettes : ${finances.dettes} $
Investissement mensuel : ${finances.montant_investi_mensuel} $
Objectif financier : ${finances.objectif_financier || "non défini"}
`.trim();

  try {
    const response = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 8192,
      thinking: { type: "adaptive" },
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: contexte }],
      output_config: {
        format: {
          type: "json_schema",
          schema: {
            type: "object",
            properties: {
              opportunites: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    titre: { type: "string" },
                    categorie: { type: "string" },
                    description: { type: "string" },
                    demarche: { type: "string" },
                    organisme: { type: "string" },
                  },
                  required: ["titre", "categorie", "description", "demarche", "organisme"],
                  additionalProperties: false,
                },
              },
            },
            required: ["opportunites"],
            additionalProperties: false,
          },
        },
      },
    });

    if (response.stop_reason === "max_tokens") {
      console.error("generateOpportunities: réponse tronquée (max_tokens atteint)");
      return { ok: false, error: "reponse_tronquee" };
    }

    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return { ok: false, error: "reponse_vide" };
    }

    let parsed: { opportunites: Opportunity[] };
    try {
      parsed = JSON.parse(textBlock.text) as { opportunites: Opportunity[] };
    } catch (parseErr) {
      console.error("generateOpportunities: JSON invalide:", parseErr, textBlock.text);
      return { ok: false, error: "reponse_illisible" };
    }

    return { ok: true, opportunites: parsed.opportunites };
  } catch (err) {
    console.error("generateOpportunities failed:", err);
    return { ok: false, error: "erreur_ia" };
  }
}
