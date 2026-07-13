"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { enregistrerActivite } from "@/lib/auth/activityLog";

// Petite fonction utilitaire : convertit en nombre, jamais NaN ni négatif.
// Tous les champs qui passent par ici (âge, montants, taux) n'ont de sens
// qu'à partir de 0 — le formulaire l'impose déjà côté client (min="0"), mais
// rien ne validait ça côté serveur si ce champ était contourné.
function toNumber(value: FormDataEntryValue | null): number {
  const n = Number(value);
  return isNaN(n) ? 0 : Math.max(0, n);
}

// Sauvegarde l'étape 1 : profil général
export async function saveGeneralProfile(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const age = toNumber(formData.get("age"));
  const province = formData.get("province") as string;
  const statut_immigration = formData.get("statut_immigration") as string;
  const situation_familiale = formData.get("situation_familiale") as string;
  const situation_professionnelle = formData.get("situation_professionnelle") as string;
  const a_des_enfants = formData.get("a_des_enfants") === "on";

  const { error } = await supabase.from("profiles").upsert(
    {
      user_id: user!.id,
      age,
      province,
      statut_immigration,
      situation_familiale,
      situation_professionnelle,
      a_des_enfants,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );

  if (error) {
    redirect(`/onboarding/profil?error=${encodeURIComponent(error.message)}`);
  }

  await enregistrerActivite(supabase, user!.id, "profil_modifie");

  redirect("/onboarding/finances");
}

// Sauvegarde l'étape 2 : profil financier
export async function saveFinancialProfile(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const salaire_mensuel = toNumber(formData.get("salaire_mensuel"));
  const autres_revenus = toNumber(formData.get("autres_revenus"));
  const depenses_mensuelles = toNumber(formData.get("depenses_mensuelles"));
  const epargne_actuelle = toNumber(formData.get("epargne_actuelle"));
  const montant_epargne_mensuel = toNumber(formData.get("montant_epargne_mensuel"));
  const frequence_epargne = (formData.get("frequence_epargne") as string) || "mensuel";
  const dettes = toNumber(formData.get("dettes"));
  const taux_interet_dettes = toNumber(formData.get("taux_interet_dettes"));
  const montant_paiement_dettes = toNumber(formData.get("montant_paiement_dettes"));
  const frequence_paiement_dettes =
    (formData.get("frequence_paiement_dettes") as string) || "mensuel";
  const montant_investi_mensuel = toNumber(formData.get("montant_investi_mensuel"));
  const rendement_annuel_estime = toNumber(formData.get("rendement_annuel_estime"));
  const objectif_financier = (formData.get("objectif_financier") as string) || null;
  const montant_objectif = toNumber(formData.get("montant_objectif"));

  // Regardé avant l'upsert pour distinguer un premier remplissage (onboarding)
  // d'une simple modification ultérieure, et détecter si l'objectif financier
  // vient d'être ajouté ou retiré — sert uniquement à choisir quels
  // événements analytics envoyer, aucune incidence sur l'enregistrement.
  const { data: profilExistant } = await supabase
    .from("financial_profiles")
    .select("objectif_financier")
    .eq("user_id", user!.id)
    .maybeSingle();
  const estOnboarding = !profilExistant;
  const evenements: string[] = [];
  if (estOnboarding) evenements.push("onboarding_complete");
  if (!profilExistant?.objectif_financier && objectif_financier) {
    evenements.push("goal_added");
  } else if (profilExistant?.objectif_financier && !objectif_financier) {
    evenements.push("goal_deleted");
  }

  const chiffre_affaires_mensuel = toNumber(formData.get("chiffre_affaires_mensuel"));
  const benefices_mensuels = toNumber(formData.get("benefices_mensuels"));
  const taxes_a_payer_estimees = toNumber(formData.get("taxes_a_payer_estimees"));
  const montant_bourse_mensuel = toNumber(formData.get("montant_bourse_mensuel"));
  const programme_etudes = (formData.get("programme_etudes") as string) || null;
  const progression_etudes = (formData.get("progression_etudes") as string) || null;
  const montant_pension_mensuel = toNumber(formData.get("montant_pension_mensuel"));
  const age_retraite_prevu = toNumber(formData.get("age_retraite_prevu"));

  const { error } = await supabase.from("financial_profiles").upsert(
    {
      user_id: user!.id,
      salaire_mensuel,
      autres_revenus,
      depenses_mensuelles,
      epargne_actuelle,
      montant_epargne_mensuel,
      frequence_epargne,
      dettes,
      taux_interet_dettes,
      montant_paiement_dettes,
      frequence_paiement_dettes,
      montant_investi_mensuel,
      rendement_annuel_estime,
      objectif_financier,
      montant_objectif,
      chiffre_affaires_mensuel,
      benefices_mensuels,
      taxes_a_payer_estimees,
      montant_bourse_mensuel,
      programme_etudes,
      progression_etudes,
      montant_pension_mensuel,
      age_retraite_prevu,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );

  if (error) {
    redirect(`/onboarding/finances?error=${encodeURIComponent(error.message)}`);
  }

  await enregistrerActivite(supabase, user!.id, "finances_modifiees");

  redirect(evenements.length > 0 ? `/dashboard?event=${evenements.join(",")}` : "/dashboard");
}