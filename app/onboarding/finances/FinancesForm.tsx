"use client";

import { useState, type ReactNode } from "react";
import { saveFinancialProfile } from "@/app/actions/profile";
import OnboardingStepper from "@/components/onboarding/OnboardingStepper";

function LabelWithTooltip({
  htmlFor,
  label,
  tooltip,
}: {
  htmlFor: string;
  label: string;
  tooltip: string;
}) {
  const [show, setShow] = useState(false);

  return (
    <label htmlFor={htmlFor} className="block text-sm mb-1">
      {label}{" "}
      <span
        className="relative inline-flex align-middle"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        <span className="w-4 h-4 flex-shrink-0 rounded-full bg-white/10 text-[10px] inline-flex items-center justify-center cursor-pointer text-[var(--color-text-secondary)]">
          ?
        </span>
        {show && (
          <span
            className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2
                       w-64 max-w-[80vw] whitespace-normal
                       rounded-lg bg-[#1a1f2e] border border-white/15 shadow-2xl
                       p-3 text-xs leading-relaxed text-[var(--color-text-secondary)] font-normal
                       pointer-events-none"
          >
            {tooltip}
          </span>
        )}
      </span>
    </label>
  );
}

// Regroupe des champs liés dans une carte distincte, pour que le formulaire
// se lise comme plusieurs blocs plutôt qu'une longue liste de champs.
function FormSection({
  icon,
  title,
  children,
}: {
  icon: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4 sm:p-5">
      <p className="text-sm font-semibold text-[var(--color-primary)] mb-3 flex items-center gap-2">
        <span aria-hidden="true">{icon}</span> {title}
      </p>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}

interface FinancialProfile {
  salaire_mensuel?: number;
  autres_revenus?: number;
  depenses_mensuelles?: number;
  epargne_actuelle?: number;
  montant_epargne_mensuel?: number;
  frequence_epargne?: string;
  dettes?: number;
  taux_interet_dettes?: number;
  montant_paiement_dettes?: number;
  frequence_paiement_dettes?: string;
  montant_investi_mensuel?: number;
  rendement_annuel_estime?: number;
  objectif_financier?: string;
  montant_objectif?: number;
  chiffre_affaires_mensuel?: number;
  benefices_mensuels?: number;
  taxes_a_payer_estimees?: number;
  montant_bourse_mensuel?: number;
  programme_etudes?: string;
  progression_etudes?: string;
  montant_pension_mensuel?: number;
  age_retraite_prevu?: number;
}

export default function OnboardingFinancesClient({
  finances,
  situationProfessionnelle,
}: {
  finances: FinancialProfile | null;
  situationProfessionnelle: string | null;
}) {
  const [dettes, setDettes] = useState<number>(finances?.dettes ?? 0);
  const aDesDettes = dettes > 0;

  const estEntrepreneur = situationProfessionnelle === "Entrepreneur(e) / travailleur(-euse) autonome";
  const estEtudiant = situationProfessionnelle === "Étudiant(e)";
  const estRetraite = situationProfessionnelle === "Retraité(e)";

  return (
    <main className="min-h-screen gradient-bg flex items-center justify-center p-4 sm:p-6">
      <div className="glass rounded-2xl p-6 sm:p-8 md:p-10 max-w-lg w-full">
        <OnboardingStepper currentStep={2} totalSteps={2} />
        <p className="text-sm text-[var(--color-secondary)] mb-2 text-center">
          Étape 2 sur 2
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-center">
          Ta situation financière
        </h1>
        <p className="text-[var(--color-text-secondary)] text-center mb-6 sm:mb-8">
          Ces infos servent à calculer tes projections
        </p>

        <form action={saveFinancialProfile} className="flex flex-col gap-4">
          <FormSection icon="💰" title="Revenus">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <LabelWithTooltip
                  htmlFor="salaire_mensuel"
                  label="Salaire mensuel ($)"
                  tooltip="Ton salaire net (après impôts) que tu reçois chaque mois."
                />
                <input
                  id="salaire_mensuel"
                  name="salaire_mensuel"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={finances?.salaire_mensuel ?? 0}
                  className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2 outline-none focus:border-[var(--color-primary)] transition"
                />
              </div>
              <div>
                <LabelWithTooltip
                  htmlFor="autres_revenus"
                  label="Autres revenus ($)"
                  tooltip="Tout autre revenu mensuel : pension, allocation, revenus locatifs, freelance, etc."
                />
                <input
                  id="autres_revenus"
                  name="autres_revenus"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={finances?.autres_revenus ?? 0}
                  className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2 outline-none focus:border-[var(--color-primary)] transition"
                />
              </div>
            </div>
          </FormSection>

          <FormSection icon="🧾" title="Dépenses">
            <div>
              <LabelWithTooltip
                htmlFor="depenses_mensuelles"
                label="Dépenses mensuelles ($)"
                tooltip="Le total de tes dépenses fixes et courantes chaque mois (loyer, nourriture, transport, abonnements, etc.)."
              />
              <input
                id="depenses_mensuelles"
                name="depenses_mensuelles"
                type="number"
                step="0.01"
                min="0"
                defaultValue={finances?.depenses_mensuelles ?? 0}
                className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2 outline-none focus:border-[var(--color-primary)] transition"
              />
            </div>
          </FormSection>

          <FormSection icon="🏦" title="Épargne">
            <div>
              <LabelWithTooltip
                htmlFor="epargne_actuelle"
                label="Épargne actuelle ($)"
                tooltip="L'argent que tu as déjà mis de côté, disponible facilement (compte épargne, liquidités)."
              />
              <input
                id="epargne_actuelle"
                name="epargne_actuelle"
                type="number"
                step="0.01"
                min="0"
                defaultValue={finances?.epargne_actuelle ?? 0}
                className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2 outline-none focus:border-[var(--color-primary)] transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <LabelWithTooltip
                  htmlFor="montant_epargne_mensuel"
                  label="Épargne régulière ($)"
                  tooltip="Le montant que tu mets de côté régulièrement dans un compte d'épargne classique (pas des placements/actions — ça, c'est la section Investi/mois plus bas)."
                />
                <input
                  id="montant_epargne_mensuel"
                  name="montant_epargne_mensuel"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={finances?.montant_epargne_mensuel ?? 0}
                  className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2 outline-none focus:border-[var(--color-primary)] transition"
                />
              </div>
              <div>
                <LabelWithTooltip
                  htmlFor="frequence_epargne"
                  label="Fréquence"
                  tooltip="À quelle fréquence mets-tu cet argent de côté ?"
                />
                <select
                  id="frequence_epargne"
                  name="frequence_epargne"
                  defaultValue={finances?.frequence_epargne ?? "mensuel"}
                  className="w-full rounded-lg bg-[var(--color-surface)] border border-white/10 px-4 py-2 outline-none focus:border-[var(--color-primary)] transition text-white"
                >
                  <option value="hebdomadaire" className="bg-[var(--color-surface)] text-white">Chaque semaine</option>
                  <option value="aux_2_semaines" className="bg-[var(--color-surface)] text-white">Aux 2 semaines</option>
                  <option value="mensuel" className="bg-[var(--color-surface)] text-white">Chaque mois</option>
                </select>
              </div>
            </div>
          </FormSection>

          <FormSection icon="💳" title="Dettes">
            <div>
              <LabelWithTooltip
                htmlFor="dettes"
                label="Dettes ($)"
                tooltip="Le solde principal que tu dois actuellement (le capital restant à ce jour) — pas le total de tous tes futurs paiements avec intérêts inclus. Regarde ton relevé de prêt pour le 'solde actuel' ou 'capital restant'."
              />
              <input
                id="dettes"
                name="dettes"
                type="number"
                step="0.01"
                min="0"
                defaultValue={finances?.dettes ?? 0}
                onChange={(e) => setDettes(Number(e.target.value) || 0)}
                className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2 outline-none focus:border-[var(--color-primary)] transition"
              />
            </div>

            {aDesDettes && (
              <>
                <div>
                  <LabelWithTooltip
                    htmlFor="taux_interet_dettes"
                    label="Taux d'intérêt dettes (%)"
                    tooltip="Le taux d'intérêt annuel moyen de tes dettes. Regarde ton relevé de carte de crédit ou de prêt pour le trouver."
                  />
                  <input
                    id="taux_interet_dettes"
                    name="taux_interet_dettes"
                    type="number"
                    step="0.01"
                    min="0"
                    defaultValue={finances?.taux_interet_dettes ?? 0}
                    className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2 outline-none focus:border-[var(--color-primary)] transition"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <LabelWithTooltip
                      htmlFor="montant_paiement_dettes"
                      label="Paiement dettes ($)"
                      tooltip="Le montant que tu payes réellement sur tes dettes à chaque paiement (pas le total de la dette, juste ce que tu verses à chaque fois)."
                    />
                    <input
                      id="montant_paiement_dettes"
                      name="montant_paiement_dettes"
                      type="number"
                      step="0.01"
                      min="0"
                      defaultValue={finances?.montant_paiement_dettes ?? 0}
                      className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2 outline-none focus:border-[var(--color-primary)] transition"
                    />
                  </div>
                  <div>
                    <LabelWithTooltip
                      htmlFor="frequence_paiement_dettes"
                      label="Fréquence"
                      tooltip="À quelle fréquence fais-tu ce paiement sur tes dettes ?"
                    />
                    <select
                      id="frequence_paiement_dettes"
                      name="frequence_paiement_dettes"
                      defaultValue={finances?.frequence_paiement_dettes ?? "mensuel"}
                      className="w-full rounded-lg bg-[var(--color-surface)] border border-white/10 px-4 py-2 outline-none focus:border-[var(--color-primary)] transition text-white"
                    >
                      <option value="hebdomadaire" className="bg-[var(--color-surface)] text-white">Chaque semaine</option>
                      <option value="aux_2_semaines" className="bg-[var(--color-surface)] text-white">Aux 2 semaines</option>
                      <option value="mensuel" className="bg-[var(--color-surface)] text-white">Chaque mois</option>
                    </select>
                  </div>
                </div>
              </>
            )}
          </FormSection>

          <FormSection icon="📈" title="Investissements">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <LabelWithTooltip
                  htmlFor="montant_investi_mensuel"
                  label="Investi / mois ($)"
                  tooltip="L'argent que tu places chaque mois dans des investissements (actions, REER, CELI...) — pas ton épargne classique, mais de l'argent qui vise à croître avec le temps."
                />
                <input
                  id="montant_investi_mensuel"
                  name="montant_investi_mensuel"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={finances?.montant_investi_mensuel ?? 0}
                  className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2 outline-none focus:border-[var(--color-primary)] transition"
                />
              </div>
              <div>
                <LabelWithTooltip
                  htmlFor="rendement_annuel_estime"
                  label="Rendement estimé (%)"
                  tooltip="Le pourcentage de croissance que tu espères sur tes investissements chaque année. Une moyenne réaliste pour un portefeuille diversifié est autour de 6-7%. Laisse à 0 si tu ne sais pas."
                />
                <input
                  id="rendement_annuel_estime"
                  name="rendement_annuel_estime"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={finances?.rendement_annuel_estime ?? 0}
                  className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2 outline-none focus:border-[var(--color-primary)] transition"
                />
              </div>
            </div>
          </FormSection>

          <FormSection icon="🎯" title="Objectif financier">
            <div>
              <LabelWithTooltip
                htmlFor="objectif_financier"
                label="Ton objectif financier"
                tooltip="Décris en quelques mots ce que tu veux accomplir financièrement (ex: acheter une maison, être libre de dettes, prendre ta retraite plus tôt)."
              />
              <input
                id="objectif_financier"
                name="objectif_financier"
                type="text"
                defaultValue={finances?.objectif_financier ?? ""}
                className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2 outline-none focus:border-[var(--color-primary)] transition"
                placeholder="Ex: Acheter une maison"
              />
            </div>

            <div>
              <LabelWithTooltip
                htmlFor="montant_objectif"
                label="Montant visé ($)"
                tooltip="Le montant total que tu dois atteindre ou économiser pour réaliser cet objectif."
              />
              <input
                id="montant_objectif"
                name="montant_objectif"
                type="number"
                step="0.01"
                min="0"
                defaultValue={finances?.montant_objectif ?? 0}
                className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2 outline-none focus:border-[var(--color-primary)] transition"
              />
            </div>
          </FormSection>

          {estEntrepreneur && (
            <FormSection icon="🧑‍💼" title="Ton activité (travailleur autonome)">
              <div>
                <LabelWithTooltip
                  htmlFor="chiffre_affaires_mensuel"
                  label="Chiffre d'affaires mensuel ($)"
                  tooltip="Le total de ce que ton activité facture chaque mois, avant dépenses et taxes."
                />
                <input
                  id="chiffre_affaires_mensuel"
                  name="chiffre_affaires_mensuel"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={finances?.chiffre_affaires_mensuel ?? 0}
                  className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2 outline-none focus:border-[var(--color-primary)] transition"
                />
              </div>
              <div>
                <LabelWithTooltip
                  htmlFor="benefices_mensuels"
                  label="Bénéfices mensuels ($)"
                  tooltip="Ce qu'il te reste après les dépenses liées à ton activité (matériel, sous-traitance, etc.), avant impôt."
                />
                <input
                  id="benefices_mensuels"
                  name="benefices_mensuels"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={finances?.benefices_mensuels ?? 0}
                  className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2 outline-none focus:border-[var(--color-primary)] transition"
                />
              </div>
              <div>
                <LabelWithTooltip
                  htmlFor="taxes_a_payer_estimees"
                  label="Taxes/acomptes à prévoir ($)"
                  tooltip="Une estimation de ce que tu devras mettre de côté pour l'impôt et les acomptes provisionnels."
                />
                <input
                  id="taxes_a_payer_estimees"
                  name="taxes_a_payer_estimees"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={finances?.taxes_a_payer_estimees ?? 0}
                  className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2 outline-none focus:border-[var(--color-primary)] transition"
                />
              </div>
            </FormSection>
          )}

          {estEtudiant && (
            <FormSection icon="🎓" title="Tes études">
              <div>
                <LabelWithTooltip
                  htmlFor="montant_bourse_mensuel"
                  label="Bourse (équivalent mensuel, $)"
                  tooltip="Si tu reçois une bourse ou une aide financière, indique son équivalent mensuel. Laisse à 0 si tu n'en as pas."
                />
                <input
                  id="montant_bourse_mensuel"
                  name="montant_bourse_mensuel"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={finances?.montant_bourse_mensuel ?? 0}
                  className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2 outline-none focus:border-[var(--color-primary)] transition"
                />
              </div>
              <div>
                <LabelWithTooltip
                  htmlFor="programme_etudes"
                  label="Programme d'études"
                  tooltip="Le nom de ton programme ou domaine d'études."
                />
                <input
                  id="programme_etudes"
                  name="programme_etudes"
                  type="text"
                  defaultValue={finances?.programme_etudes ?? ""}
                  placeholder="Ex: Baccalauréat en informatique"
                  className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2 outline-none focus:border-[var(--color-primary)] transition"
                />
              </div>
              <div>
                <LabelWithTooltip
                  htmlFor="progression_etudes"
                  label="Progression"
                  tooltip="Où tu en es dans ton programme, ex: '2e année sur 4'."
                />
                <input
                  id="progression_etudes"
                  name="progression_etudes"
                  type="text"
                  defaultValue={finances?.progression_etudes ?? ""}
                  placeholder="Ex: 2e année sur 4"
                  className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2 outline-none focus:border-[var(--color-primary)] transition"
                />
              </div>
            </FormSection>
          )}

          {estRetraite && (
            <FormSection icon="🌅" title="Ta retraite">
              <div>
                <LabelWithTooltip
                  htmlFor="montant_pension_mensuel"
                  label="Pension mensuelle ($)"
                  tooltip="Le total de tes revenus de pension chaque mois (RRQ/RPC, Sécurité de la vieillesse, pension privée, etc.)."
                />
                <input
                  id="montant_pension_mensuel"
                  name="montant_pension_mensuel"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={finances?.montant_pension_mensuel ?? 0}
                  className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2 outline-none focus:border-[var(--color-primary)] transition"
                />
              </div>
              <div>
                <LabelWithTooltip
                  htmlFor="age_retraite_prevu"
                  label="Âge de retraite prévu/actuel"
                  tooltip="L'âge auquel tu as pris ta retraite, ou celui que tu prévois."
                />
                <input
                  id="age_retraite_prevu"
                  name="age_retraite_prevu"
                  type="number"
                  min="0"
                  max="120"
                  defaultValue={finances?.age_retraite_prevu ?? 0}
                  className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2 outline-none focus:border-[var(--color-primary)] transition"
                />
              </div>
            </FormSection>
          )}

          <button
            type="submit"
            className="mt-2 rounded-lg bg-[var(--color-primary)] hover:opacity-90 transition py-2.5 font-semibold"
          >
            Terminer et voir mon tableau de bord
          </button>
        </form>
      </div>
    </main>
  );
}
