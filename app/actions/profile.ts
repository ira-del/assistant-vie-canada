"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Petite fonction utilitaire : convertit en nombre, jamais NaN
function toNumber(value: FormDataEntryValue | null): number {
  const n = Number(value);
  return isNaN(n) ? 0 : n;
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

  redirect("/dashboard");
}