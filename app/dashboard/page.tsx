import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/actions/auth";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Récupérer le profil général
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user!.id)
    .single();

  // Récupérer le profil financier
  const { data: finances } = await supabase
    .from("financial_profiles")
    .select("*")
    .eq("user_id", user!.id)
    .single();

  // Si l'utilisateur n'a pas encore rempli son profil, on l'y envoie
  if (!profile) {
    redirect("/onboarding/profil");
  }
  if (!finances) {
    redirect("/onboarding/finances");
  }

  // Calculs financiers de base
  const revenuMensuelTotal =
    Number(finances.salaire_mensuel) + Number(finances.autres_revenus);
  const depenses = Number(finances.depenses_mensuelles);
  const epargne = Number(finances.epargne_actuelle);
  const dettes = Number(finances.dettes);
  const investiMensuel = Number(finances.montant_investi_mensuel);

  const patrimoineNet = epargne - dettes;
  const soldeMensuel = revenuMensuelTotal - depenses - investiMensuel;
  const tauxEpargne =
    revenuMensuelTotal > 0
      ? Math.round(
          ((revenuMensuelTotal - depenses) / revenuMensuelTotal) * 100
        )
      : 0;

  // Progression vers l'objectif financier
  const montantObjectif = Number(finances.montant_objectif) || 0;
  const progressionObjectif =
    montantObjectif > 0
      ? Math.min(100, Math.round((epargne / montantObjectif) * 100))
      : 0;

  const formatMoney = (n: number) =>
    n.toLocaleString("fr-CA", { style: "currency", currency: "CAD" });

  return (
    <main className="min-h-screen gradient-bg p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        {/* En-tête */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Tableau de bord</h1>
            <p className="text-[var(--color-text-secondary)] text-sm">
              {user!.email} · {profile.province}
            </p>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="rounded-lg bg-white/10 hover:bg-white/20 transition py-2 px-4 text-sm font-semibold"
            >
              Se déconnecter
            </button>
          </form>
        </div>

        {/* Cartes principales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div className="glass rounded-2xl p-6">
            <p className="text-sm text-[var(--color-text-secondary)] mb-1">
              Valeur nette
            </p>
            <p
              className={`text-2xl font-bold ${
                patrimoineNet >= 0
                  ? "text-[var(--color-success)]"
                  : "text-[var(--color-danger)]"
              }`}
            >
              {formatMoney(patrimoineNet)}
            </p>
          </div>

          <div className="glass rounded-2xl p-6">
            <p className="text-sm text-[var(--color-text-secondary)] mb-1">
              Revenus mensuels
            </p>
            <p className="text-2xl font-bold">
              {formatMoney(revenuMensuelTotal)}
            </p>
          </div>

          <div className="glass rounded-2xl p-6">
            <p className="text-sm text-[var(--color-text-secondary)] mb-1">
              Dépenses mensuelles
            </p>
            <p className="text-2xl font-bold">{formatMoney(depenses)}</p>
          </div>

          <div className="glass rounded-2xl p-6">
            <p className="text-sm text-[var(--color-text-secondary)] mb-1">
              Épargne actuelle
            </p>
            <p className="text-2xl font-bold">{formatMoney(epargne)}</p>
          </div>

          <div className="glass rounded-2xl p-6">
            <p className="text-sm text-[var(--color-text-secondary)] mb-1">
              Dettes
            </p>
            <p className="text-2xl font-bold text-[var(--color-danger)]">
              {formatMoney(dettes)}
            </p>
          </div>

          <div className="glass rounded-2xl p-6">
            <p className="text-sm text-[var(--color-text-secondary)] mb-1">
              Taux d&apos;épargne
            </p>
            <p className="text-2xl font-bold">{tauxEpargne}%</p>
          </div>
        </div>

        {/* Solde mensuel */}
        <div className="glass rounded-2xl p-6 mb-8">
          <p className="text-sm text-[var(--color-text-secondary)] mb-1">
            Solde mensuel (après dépenses et investissements)
          </p>
          <p
            className={`text-3xl font-bold ${
              soldeMensuel >= 0
                ? "text-[var(--color-success)]"
                : "text-[var(--color-danger)]"
            }`}
          >
            {formatMoney(soldeMensuel)}
          </p>
        </div>

        {/* Objectif financier */}
        {finances.objectif_financier && (
          <div className="glass rounded-2xl p-6">
            <p className="text-sm text-[var(--color-text-secondary)] mb-2">
              Objectif : {finances.objectif_financier}
            </p>
            <div className="w-full bg-white/10 rounded-full h-3 mb-2 overflow-hidden">
              <div
                className="h-full bg-[var(--color-primary)] transition-all"
                style={{ width: `${progressionObjectif}%` }}
              />
            </div>
            <p className="text-sm text-[var(--color-text-secondary)]">
              {formatMoney(epargne)} / {formatMoney(montantObjectif)} (
              {progressionObjectif}%)
            </p>
          </div>
        )}
      </div>
    </main>
  );
}