import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { generateNextSteps } from "@/lib/finance/generateNextSteps";
import NextStepsChecklist from "@/components/dashboard/NextStepsChecklist";
import { BADGE_CATALOG, computeSatisfiedBadgeIds } from "@/lib/finance/badgeCatalog";
import BadgesShelf from "@/components/dashboard/BadgesShelf";
import AdvisorSummary from "@/components/dashboard/AdvisorSummary";
import { getProfileInsights } from "@/lib/finance/profileInsights";
import HistoryChart from "@/components/progression/HistoryChart";

export default async function ProgressionPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Aucune de ces lectures ne dépend d'une autre — on les lance en parallèle
  // plutôt qu'en séquence pour réduire la latence totale de la page.
  const [
    { data: profile },
    { data: finances },
    { data: checklistRows },
    { data: earnedBadgeRows },
    { data: snapshotRows },
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("user_id", user!.id).single(),
    supabase.from("financial_profiles").select("*").eq("user_id", user!.id).single(),
    supabase.from("checklist_progress").select("step_id").eq("user_id", user!.id),
    supabase.from("badges_earned").select("badge_id").eq("user_id", user!.id),
    supabase
      .from("health_snapshots")
      .select("snapshot_date, health_score, patrimoine_net")
      .eq("user_id", user!.id)
      .order("snapshot_date", { ascending: true }),
  ]);

  if (!profile) {
    redirect("/onboarding/profil");
  }
  if (!finances) {
    redirect("/onboarding/finances");
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

  const scoreInputs = {
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
  };

  const nextSteps = generateNextSteps(scoreInputs);

  const completedStepIds = (checklistRows ?? []).map((row) => row.step_id);

  // Badges : on calcule ce qui est satisfait aujourd'hui, on attribue les
  // nouveaux, puis on affiche la liste complète des badges déjà gagnés
  // (un badge acquis reste acquis même si la situation régresse ensuite).
  const alreadyEarnedIds = (earnedBadgeRows ?? []).map((row) => row.badge_id);

  const satisfiedBadgeIds = computeSatisfiedBadgeIds(scoreInputs);
  const newlyEarnedIds = satisfiedBadgeIds.filter((id) => !alreadyEarnedIds.includes(id));

  if (newlyEarnedIds.length > 0) {
    await supabase.from("badges_earned").insert(
      newlyEarnedIds.map((badge_id) => ({ user_id: user!.id, badge_id }))
    );
  }
  const earnedBadgeIds = [...alreadyEarnedIds, ...newlyEarnedIds];

  const profileInsights = getProfileInsights(profile.situation_professionnelle);

  return (
    <main className="min-h-screen gradient-bg p-6 md:p-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Ma progression</h1>
            <p className="text-[var(--color-text-secondary)] text-sm">
              Ton conseiller, tes prochaines étapes et tes badges
            </p>
          </div>
          <Link
            href="/dashboard"
            className="link-button rounded-lg bg-white/10 hover:bg-white/20 transition py-2 px-4 text-sm font-semibold"
          >
            ← Tableau de bord
          </Link>
        </div>

        <AdvisorSummary profileInsights={profileInsights} />

        <NextStepsChecklist steps={nextSteps} completedIds={completedStepIds} />

        <BadgesShelf catalog={BADGE_CATALOG} earnedIds={earnedBadgeIds} />

        <HistoryChart snapshots={snapshotRows ?? []} />
      </div>
    </main>
  );
}
