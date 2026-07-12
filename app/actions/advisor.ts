"use server";

import { createClient } from "@/lib/supabase/server";
import { anthropic, CLAUDE_MODEL } from "@/lib/ai/client";
import { calculateHealthScore } from "@/lib/finance/calculateHealthScore";
import { buildProfessionalContext } from "@/lib/finance/profileContext";
import { verifierEtEnregistrerAppelIA } from "@/lib/ai/rateLimit";

const SYSTEM_PROMPT = `Tu es un conseiller financier virtuel bienveillant, spécialisé pour des utilisateurs au Canada.
Tu rédiges un résumé personnalisé et encourageant de la situation financière de l'utilisateur, en français, avec un ton chaleureux mais professionnel.
Structure: 1) un constat honnête de la situation actuelle (2-3 phrases), 2) 2-3 conseils concrets et priorisés adaptés à ses chiffres, 3) une note d'encouragement.
Reste concis (180-250 mots), évite le jargon, et ne donne jamais de conseil juridique, fiscal ou d'immigration précis.
Termine toujours par une phrase rappelant que ceci est informatif et ne remplace pas l'avis d'un(e) planificateur(-trice) financier(-ère) agréé(e).`;

export async function generateAdvisorSummary(): Promise<
  { ok: true; summary: string } | { ok: false; error: string }
> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "not_authenticated" };

  const autorise = await verifierEtEnregistrerAppelIA(supabase, user.id, "advisor");
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
  const depenses = Number(finances.depenses_mensuelles);
  const epargne = Number(finances.epargne_actuelle);
  const dettes = Number(finances.dettes);
  const investiMensuel = Number(finances.montant_investi_mensuel);
  const patrimoineNet = epargne - dettes;
  const montantObjectif = Number(finances.montant_objectif) || 0;
  const progressionObjectif =
    montantObjectif > 0
      ? Math.min(100, Math.round((epargne / montantObjectif) * 100))
      : 0;

  const healthScore = calculateHealthScore({
    revenuMensuelTotal,
    depensesMensuelles: depenses,
    epargneActuelle: epargne,
    dettes,
    montantEpargneMensuel: Number(finances.montant_epargne_mensuel) || 0,
    montantInvestiMensuel: investiMensuel,
    montantPaiementDettes: Number(finances.montant_paiement_dettes) || 0,
    patrimoineNet,
    montantObjectif,
    progressionObjectif,
  });

  const contextePro = buildProfessionalContext(profile.situation_professionnelle, finances);

  const contexte = `
Profil : ${profile.age} ans, ${profile.province}, situation familiale : ${profile.situation_familiale}${profile.a_des_enfants ? ", avec enfant(s)" : ""}.
Situation professionnelle : ${profile.situation_professionnelle || "non renseignée"}
Revenu mensuel total : ${revenuMensuelTotal} $
Dépenses mensuelles : ${depenses} $
Épargne actuelle : ${epargne} $
Dettes : ${dettes} $ (taux d'intérêt : ${finances.taux_interet_dettes ?? "non renseigné"}%)
Investissement mensuel : ${investiMensuel} $
Valeur nette : ${patrimoineNet} $
Objectif financier : ${finances.objectif_financier || "non défini"}${montantObjectif > 0 ? ` (${montantObjectif} $, progression ${progressionObjectif}%)` : ""}
Score de santé financière calculé : ${healthScore.score}/100 (${healthScore.niveau})
Points faibles déjà détectés : ${healthScore.pointsFaibles.join(" / ") || "aucun"}
${contextePro ? `\nInfos spécifiques à sa situation professionnelle :\n${contextePro}` : ""}
`.trim();

  try {
    const response = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 1024,
      thinking: { type: "adaptive" },
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: contexte }],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return { ok: false, error: "reponse_vide" };
    }

    return { ok: true, summary: textBlock.text };
  } catch (err) {
    console.error("generateAdvisorSummary failed:", err);
    return { ok: false, error: "erreur_ia" };
  }
}
