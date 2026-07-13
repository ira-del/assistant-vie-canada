"use client";

import { useState, useTransition } from "react";
import { generateAdvisorSummary } from "@/app/actions/advisor";
import type { ProfileInsights } from "@/lib/finance/profileInsights";

export default function AdvisorSummary({
  profileInsights,
}: {
  profileInsights: ProfileInsights | null;
}) {
  // "revealed" contrôle l'affichage groupé des conseils + du résumé IA —
  // rien ne s'affiche tant qu'on n'a pas cliqué sur "Générer mon résumé".
  const [revealed, setRevealed] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleGenerate() {
    setError(null);
    setRevealed(true);
    startTransition(async () => {
      const result = await generateAdvisorSummary();
      if (!result.ok) {
        setError(
          result.error === "profil_incomplet"
            ? "Complète d'abord ton profil financier pour obtenir un résumé."
            : result.error === "limite_atteinte"
            ? "Tu as atteint la limite d'utilisation de cette fonctionnalité pour l'instant. Réessaie dans quelques minutes."
            : "Impossible de générer le résumé pour le moment. Réessaie dans un instant."
        );
        return;
      }
      setSummary(result.summary);
    });
  }

  function handleHide() {
    setRevealed(false);
    setSummary(null);
    setError(null);
  }

  return (
    <div className="glass rounded-2xl p-5 sm:p-6 mb-6 md:mb-8">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-[var(--color-primary)]">
          Mon conseiller
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isPending}
            className="rounded-lg bg-[var(--color-primary)] hover:opacity-90 transition py-1.5 px-3 text-xs font-semibold disabled:opacity-50 flex items-center gap-2"
          >
            <svg
              className={`animate-spin h-4 w-4 ${isPending ? "" : "hidden"}`}
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-90"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            {isPending
              ? "Analyse en cours..."
              : revealed
              ? "Régénérer mon résumé"
              : "Générer mon résumé"}
          </button>
          {revealed && !isPending && (
            <button
              type="button"
              onClick={handleHide}
              aria-label="Masquer le résumé"
              className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition text-sm leading-none px-1"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {!revealed && !isPending && (
        <p className="text-sm text-[var(--color-text-secondary)]">
          Obtiens tes conseils personnalisés et un résumé de ta situation financière.
        </p>
      )}

      {revealed && (
        <>
          {isPending && (
            <p className="text-sm text-[var(--color-text-secondary)]">
              Ton conseiller analyse ta situation...
            </p>
          )}

          {error && <p className="text-sm text-[var(--color-danger)]">{error}</p>}

          {/* Les conseils n'apparaissent qu'une fois la génération du résumé
              terminée, pas avant — tout arrive d'un coup à la fin. */}
          {summary && !isPending && (
            <>
              <div className="text-sm text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-wrap">
                {summary}
              </div>

              {profileInsights && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-xs font-semibold text-[var(--color-text-primary)] mb-2">
                    {profileInsights.titre}
                  </p>
                  <ul className="space-y-2">
                    {profileInsights.conseils.map((conseil, i) => (
                      <li
                        key={i}
                        className="text-sm text-[var(--color-text-secondary)] leading-relaxed flex gap-2"
                      >
                        <span className="text-[var(--color-primary)]">•</span>
                        {conseil}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
