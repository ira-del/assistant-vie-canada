import { createClient } from "@/lib/supabase/server";
import OnboardingFinancesClient from "./FinancesForm";

export default async function OnboardingFinancesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let finances = null;
  let situationProfessionnelle: string | null = null;
  if (user) {
    const { data } = await supabase
      .from("financial_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();
    finances = data;

    const { data: profile } = await supabase
      .from("profiles")
      .select("situation_professionnelle")
      .eq("user_id", user.id)
      .single();
    situationProfessionnelle = profile?.situation_professionnelle ?? null;
  }

  return (
    <OnboardingFinancesClient
      finances={finances}
      situationProfessionnelle={situationProfessionnelle}
    />
  );
}