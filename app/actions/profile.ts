"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Sauvegarde l'étape 1 : profil général
export async function saveGeneralProfile(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const age = Number(formData.get("age"));
  const province = formData.get("province") as string;
  const statut_immigration = formData.get("statut_immigration") as string;
  const situation_familiale = formData.get("situation_familiale") as string;
  const a_des_enfants = formData.get("a_des_enfants") === "on";

  const { error } = await supabase.from("profiles").upsert(
    {
      user_id: user!.id,
      age,
      province,
      statut_immigration,
      situation_familiale,
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

  const salaire_mensuel = Number(formData.get("salaire_mensuel")) || 0;
  const autres_revenus = Number(formData.get("autres_revenus")) || 0;
  const depenses_mensuelles = Number(formData.get("depenses_mensuelles")) || 0;
  const epargne_actuelle = Number(formData.get("epargne_actuelle")) || 0;
  const dettes = Number(formData.get("dettes")) || 0;
  const taux_interet_dettes = Number(formData.get("taux_interet_dettes")) || 0;
  const montant_investi_mensuel = Number(formData.get("montant_investi_mensuel")) || 0;
  const rendement_annuel_estime = Number(formData.get("rendement_annuel_estime")) || 0;
  const objectif_financier = formData.get("objectif_financier") as string;
  const montant_objectif = Number(formData.get("montant_objectif")) || null;

  const { error } = await supabase.from("financial_profiles").upsert(
    {
      user_id: user!.id,
      salaire_mensuel,
      autres_revenus,
      depenses_mensuelles,
      epargne_actuelle,
      dettes,
      taux_interet_dettes,
      montant_investi_mensuel,
      rendement_annuel_estime,
      objectif_financier,
      montant_objectif,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );

  if (error) {
    redirect(`/onboarding/finances?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/dashboard");
}