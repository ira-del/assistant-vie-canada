"use client";

import { useState } from "react";
import {
  moisPourAtteindreObjectif,
  formatDureeMois,
  formatDateProjetee,
  SEUIL_MOIS_OBJECTIF_IRREALISTE,
} from "@/lib/finance/goalScenarios";

const formatMoney = (n: number) =>
  n.toLocaleString("fr-CA", { style: "currency", currency: "CAD" });

export default function GoalScenarios({
  epargneActuelle,
  montantObjectif,
  epargneMensuelleActuelle,
}: {
  epargneActuelle: number;
  montantObjectif: number;
  epargneMensuelleActuelle: number;
}) {
  const montantRestant = Math.max(montantObjectif - epargneActuelle, 0);
  const [montantPersonnalise, setMontantPersonnalise] = useState<number>(
    Math.round(epargneMensuelleActuelle) || 0
  );

  if (montantRestant <= 0) {
    return (
      <div className="mt-4 pt-4 border-t border-white/10 text-sm text-[var(--color-success)] font-semibold">
        Objectif déjà atteint — félicitations !
      </div>
    );
  }

  const scenarios = [
    { label: "Ton rythme actuel", montant: epargneMensuelleActuelle },
    { label: "Effort modéré (+50%)", montant: epargneMensuelleActuelle * 1.5 },
    { label: "Effort soutenu (x2)", montant: epargneMensuelleActuelle * 2 },
  ];

  const moisPersonnalise = moisPourAtteindreObjectif(montantRestant, montantPersonnalise);
  const moisRythmeActuel = moisPourAtteindreObjectif(montantRestant, epargneMensuelleActuelle);
  const objectifIrrealiste =
    moisRythmeActuel === null || moisRythmeActuel > SEUIL_MOIS_OBJECTIF_IRREALISTE;

  return (
    <div className="mt-4 pt-4 border-t border-white/10">
      <p className="text-sm font-semibold mb-3">
        Combien de temps pour atteindre ton objectif ?
      </p>

      {objectifIrrealiste && (
        <div className="rounded-xl bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/30 p-3 mb-4 text-sm text-[var(--color-text-secondary)]">
          <span className="font-semibold text-[var(--color-danger)]">
            À ton rythme actuel, cet objectif prendrait{" "}
            {moisRythmeActuel === null ? "très longtemps" : formatDureeMois(moisRythmeActuel)}.
          </span>{" "}
          Essaie d&apos;augmenter ton effort mensuel ci-dessous, ou ajuste le montant de ton
          objectif dans ton profil.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        {scenarios.map((s) => {
          const mois = moisPourAtteindreObjectif(montantRestant, s.montant);
          return (
            <div key={s.label} className="rounded-xl bg-white/5 p-3">
              <p className="text-xs text-[var(--color-text-secondary)] mb-1">{s.label}</p>
              <p className="text-sm font-semibold">{formatMoney(s.montant)}/mois</p>
              {mois === null ? (
                <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                  Ajoute un montant d&apos;épargne mensuelle
                </p>
              ) : (
                <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                  {formatDureeMois(mois)} · {formatDateProjetee(mois)}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div>
        <label
          htmlFor="montant_personnalise"
          className="block text-xs text-[var(--color-text-secondary)] mb-1"
        >
          Essaie ton propre montant mensuel
        </label>
        <div className="flex items-center gap-3 flex-wrap">
          <input
            id="montant_personnalise"
            type="number"
            min="0"
            step="10"
            value={montantPersonnalise}
            onChange={(e) => setMontantPersonnalise(Number(e.target.value) || 0)}
            className="w-32 rounded-lg bg-white/5 border border-white/10 px-3 py-1.5 text-sm outline-none focus:border-[var(--color-primary)] transition"
          />
          <span className="text-sm text-[var(--color-text-secondary)]">
            {montantPersonnalise <= 0
              ? "Entre un montant pour voir une estimation"
              : `→ objectif atteint dans ${formatDureeMois(
                  moisPersonnalise!
                )} (${formatDateProjetee(moisPersonnalise!)})`}
          </span>
        </div>
      </div>
    </div>
  );
}
