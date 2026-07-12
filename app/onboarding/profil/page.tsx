import { createClient } from "@/lib/supabase/server";
import { saveGeneralProfile } from "@/app/actions/profile";
import OnboardingStepper from "@/components/onboarding/OnboardingStepper";

export default async function OnboardingProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();
    profile = data;
  }

  return (
    <main className="min-h-screen gradient-bg flex items-center justify-center p-6">
      <div className="glass rounded-2xl p-10 max-w-lg w-full">
        <OnboardingStepper currentStep={1} totalSteps={2} />
        <p className="text-sm text-[var(--color-secondary)] mb-2 text-center">
          Étape 1 sur 2
        </p>
        <h1 className="text-3xl font-bold mb-2 text-center">
          Parlons de toi
        </h1>
        <p className="text-[var(--color-text-secondary)] text-center mb-8">
          Ces infos nous aident à personnaliser ton expérience
        </p>

        <form action={saveGeneralProfile} className="flex flex-col gap-4">
          <div>
            <label htmlFor="age" className="block text-sm mb-1">
              Âge
            </label>
            <input
              id="age"
              name="age"
              type="number"
              min="0"
              max="120"
              required
              defaultValue={profile?.age ?? ""}
              className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2 outline-none focus:border-[var(--color-primary)] transition"
              placeholder="Ex: 28"
            />
          </div>

          <div>
            <label htmlFor="province" className="block text-sm mb-1">
              Province / Territoire
            </label>
            <select
              id="province"
              name="province"
              required
              defaultValue={profile?.province ?? ""}
              className="w-full rounded-lg bg-[var(--color-surface)] border border-white/10 px-4 py-2 outline-none focus:border-[var(--color-primary)] transition text-white"
            >
              <option value="" disabled className="bg-[var(--color-surface)] text-white">Sélectionne...</option>
              <option className="bg-[var(--color-surface)] text-white">Alberta</option>
              <option className="bg-[var(--color-surface)] text-white">Colombie-Britannique</option>
              <option className="bg-[var(--color-surface)] text-white">Île-du-Prince-Édouard</option>
              <option className="bg-[var(--color-surface)] text-white">Manitoba</option>
              <option className="bg-[var(--color-surface)] text-white">Nouveau-Brunswick</option>
              <option className="bg-[var(--color-surface)] text-white">Nouvelle-Écosse</option>
              <option className="bg-[var(--color-surface)] text-white">Ontario</option>
              <option className="bg-[var(--color-surface)] text-white">Québec</option>
              <option className="bg-[var(--color-surface)] text-white">Saskatchewan</option>
              <option className="bg-[var(--color-surface)] text-white">Terre-Neuve-et-Labrador</option>
              <option className="bg-[var(--color-surface)] text-white">Territoires du Nord-Ouest</option>
              <option className="bg-[var(--color-surface)] text-white">Nunavut</option>
              <option className="bg-[var(--color-surface)] text-white">Yukon</option>
            </select>
          </div>

          <div>
            <label htmlFor="statut_immigration" className="block text-sm mb-1">
              Statut au Canada
            </label>
            <select
              id="statut_immigration"
              name="statut_immigration"
              required
              defaultValue={profile?.statut_immigration ?? ""}
              className="w-full rounded-lg bg-[var(--color-surface)] border border-white/10 px-4 py-2 outline-none focus:border-[var(--color-primary)] transition text-white"
            >
              <option value="" disabled className="bg-[var(--color-surface)] text-white">Sélectionne...</option>
              <option className="bg-[var(--color-surface)] text-white">Citoyen canadien</option>
              <option className="bg-[var(--color-surface)] text-white">Résident permanent</option>
              <option className="bg-[var(--color-surface)] text-white">Étudiant international</option>
              <option className="bg-[var(--color-surface)] text-white">Travailleur étranger temporaire</option>
              <option className="bg-[var(--color-surface)] text-white">Visiteur</option>
              <option className="bg-[var(--color-surface)] text-white">Réfugié</option>
              <option className="bg-[var(--color-surface)] text-white">Demandeur d&apos;asile</option>
              <option className="bg-[var(--color-surface)] text-white">Permis ouvert</option>
              <option className="bg-[var(--color-surface)] text-white">Permis fermé</option>
              <option className="bg-[var(--color-surface)] text-white">Sans statut</option>
              <option className="bg-[var(--color-surface)] text-white">Demande refusée</option>
              <option className="bg-[var(--color-surface)] text-white">Autre</option>
            </select>
          </div>

          <div>
            <label htmlFor="situation_familiale" className="block text-sm mb-1">
              Situation familiale
            </label>
            <select
              id="situation_familiale"
              name="situation_familiale"
              required
              defaultValue={profile?.situation_familiale ?? ""}
              className="w-full rounded-lg bg-[var(--color-surface)] border border-white/10 px-4 py-2 outline-none focus:border-[var(--color-primary)] transition text-white"
            >
              <option value="" disabled className="bg-[var(--color-surface)] text-white">Sélectionne...</option>
              <option className="bg-[var(--color-surface)] text-white">Célibataire</option>
              <option className="bg-[var(--color-surface)] text-white">En couple</option>
              <option className="bg-[var(--color-surface)] text-white">Marié(e)</option>
              <option className="bg-[var(--color-surface)] text-white">Divorcé(e)</option>
              <option className="bg-[var(--color-surface)] text-white">Veuf/Veuve</option>
            </select>
          </div>

          <div>
            <label htmlFor="situation_professionnelle" className="block text-sm mb-1">
              Situation professionnelle
            </label>
            <select
              id="situation_professionnelle"
              name="situation_professionnelle"
              required
              defaultValue={profile?.situation_professionnelle ?? ""}
              className="w-full rounded-lg bg-[var(--color-surface)] border border-white/10 px-4 py-2 outline-none focus:border-[var(--color-primary)] transition text-white"
            >
              <option value="" disabled className="bg-[var(--color-surface)] text-white">Sélectionne...</option>
              <option className="bg-[var(--color-surface)] text-white">Étudiant(e)</option>
              <option className="bg-[var(--color-surface)] text-white">Travailleur(-euse) salarié(e)</option>
              <option className="bg-[var(--color-surface)] text-white">Entrepreneur(e) / travailleur(-euse) autonome</option>
              <option className="bg-[var(--color-surface)] text-white">Retraité(e)</option>
              <option className="bg-[var(--color-surface)] text-white">Sans emploi actuellement</option>
            </select>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="a_des_enfants"
              defaultChecked={profile?.a_des_enfants ?? false}
              className="w-4 h-4"
            />
            J&apos;ai des enfants
          </label>

          <button
            type="submit"
            className="mt-4 rounded-lg bg-[var(--color-primary)] hover:opacity-90 transition py-2 font-semibold"
          >
            Continuer
          </button>
        </form>
      </div>
    </main>
  );
}