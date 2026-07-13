"use client";

import { useState, useTransition } from "react";
import {
  generateImmigrationDiagnosis,
  type ImmigrationDiagnosis,
} from "@/app/actions/immigration";
import { trouverLienOrganisme } from "@/lib/data/organismLinks";

// Repliée par défaut (titre + résumé court) pour éviter d'obliger à tout
// faire défiler ; la description complète ne s'affiche qu'au clic.
function EtapeCard({ etape, index }: { etape: ImmigrationDiagnosis["etapes"][number]; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="glass rounded-2xl p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--color-primary)]/20 text-[var(--color-primary)] text-xs font-semibold flex items-center justify-center">
          {index + 1}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold mb-1">{etape.titre}</p>
          <p
            className={`text-xs text-[var(--color-text-secondary)] leading-relaxed ${
              expanded ? "" : "line-clamp-2"
            }`}
          >
            {etape.description}
          </p>
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            className="text-xs font-medium text-[var(--color-primary)] hover:underline mt-2"
          >
            {expanded ? "Voir moins" : "Voir plus"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ImmigrationDiagnosisView() {
  const [diagnosis, setDiagnosis] = useState<ImmigrationDiagnosis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleGenerate() {
    setError(null);
    startTransition(async () => {
      const result = await generateImmigrationDiagnosis();
      if (!result.ok) {
        setError(
          result.error === "profil_incomplet"
            ? "Complète d'abord ton profil pour obtenir un diagnostic."
            : result.error === "limite_atteinte"
            ? "Tu as atteint la limite d'utilisation de cette fonctionnalité pour l'instant. Réessaie dans quelques minutes."
            : "Impossible de générer ton diagnostic pour le moment. Réessaie dans un instant."
        );
        return;
      }
      setDiagnosis(result.diagnosis);
    });
  }

  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl p-5 sm:p-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-[var(--color-primary)]">
            Comprendre ta situation et tes prochaines étapes
          </p>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isPending}
            className="rounded-lg bg-[var(--color-primary)] hover:opacity-90 transition py-2 px-4 text-sm font-semibold disabled:opacity-50 flex items-center gap-2"
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
              : diagnosis
              ? "Régénérer"
              : "Obtenir mon diagnostic"}
          </button>
        </div>
        <p className="text-xs text-[var(--color-text-secondary)]">
          Basé sur ton statut, ton âge, ta province et ta situation familiale/professionnelle.
        </p>
        {error && <p className="text-sm text-[var(--color-danger)] mt-3">{error}</p>}
      </div>

      {isPending && (
        <div className="space-y-4">
          <div className="glass rounded-2xl p-6 animate-pulse">
            <div className="h-4 w-full rounded bg-white/10 mb-2" />
            <div className="h-4 w-5/6 rounded bg-white/10 mb-2" />
            <div className="h-4 w-3/4 rounded bg-white/10" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="glass rounded-2xl p-6 animate-pulse">
                <div className="h-4 w-2/3 rounded bg-white/10 mb-3" />
                <div className="h-3 w-full rounded bg-white/5 mb-2" />
                <div className="h-3 w-5/6 rounded bg-white/5" />
              </div>
            ))}
          </div>
        </div>
      )}

      {diagnosis && !isPending && (
        <>
          <div className="glass rounded-2xl p-5 sm:p-6">
            <p className="text-sm font-semibold mb-2">Ton diagnostic</p>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
              {diagnosis.diagnostic}
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold mb-3">Prochaines étapes</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {diagnosis.etapes.map((etape, i) => (
                <EtapeCard key={i} etape={etape} index={i} />
              ))}
            </div>
          </div>

          {diagnosis.organismes.length > 0 && (
            <div className="glass rounded-2xl p-5 sm:p-6">
              <p className="text-sm font-semibold mb-3">Ressources et organismes</p>
              <ul className="space-y-2">
                {diagnosis.organismes.map((organisme, i) => {
                  const lien = trouverLienOrganisme(organisme);
                  return (
                    <li key={i} className="flex items-center justify-between text-sm">
                      <span className="text-[var(--color-text-secondary)]">{organisme}</span>
                      {lien && (
                        <a
                          href={lien.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link-button text-xs font-medium text-[var(--color-primary)] hover:underline whitespace-nowrap ml-2"
                        >
                          Visiter le site →
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          <p className="text-xs text-[var(--color-text-secondary)] opacity-70 px-2">
            {diagnosis.avertissement}
          </p>
        </>
      )}
    </div>
  );
}
