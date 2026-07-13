"use client";

import { useState, useTransition } from "react";
import { generateOpportunities, type Opportunity } from "@/app/actions/opportunities";
import { trouverLienOrganisme } from "@/lib/data/organismLinks";

// Carte repliée par défaut (titre + résumé court) pour éviter d'obliger à
// tout faire défiler ; la description complète et la démarche ne
// s'affichent qu'au clic sur "Voir plus".
function OpportunityCard({
  opp,
  lien,
}: {
  opp: Opportunity;
  lien: ReturnType<typeof trouverLienOrganisme>;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="glass rounded-2xl p-5 sm:p-6">
      <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-[var(--color-primary)]/20 text-[var(--color-primary)] mb-3">
        {opp.categorie}
      </span>
      <p className="text-sm font-semibold mb-2">{opp.titre}</p>
      <p
        className={`text-sm text-[var(--color-text-secondary)] leading-relaxed mb-3 ${
          expanded ? "" : "line-clamp-2"
        }`}
      >
        {opp.description}
      </p>

      {expanded && (
        <>
          <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mb-3">
            <span className="font-medium text-[var(--color-text-primary)]">Démarche : </span>
            {opp.demarche}
          </p>
          <div className="flex items-center justify-between">
            <p className="text-xs text-[var(--color-text-secondary)] opacity-70">
              {opp.organisme}
            </p>
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
          </div>
        </>
      )}

      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="text-xs font-medium text-[var(--color-primary)] hover:underline mt-3"
      >
        {expanded ? "Voir moins" : "Voir plus"}
      </button>
    </div>
  );
}

export default function OpportunitiesList() {
  const [opportunites, setOpportunites] = useState<Opportunity[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleGenerate() {
    setError(null);
    startTransition(async () => {
      const result = await generateOpportunities();
      if (!result.ok) {
        setError(
          result.error === "profil_incomplet"
            ? "Complète d'abord ton profil pour découvrir tes opportunités."
            : result.error === "limite_atteinte"
            ? "Tu as atteint la limite d'utilisation de cette fonctionnalité pour l'instant. Réessaie dans quelques minutes."
            : "Impossible de générer tes opportunités pour le moment. Réessaie dans un instant."
        );
        return;
      }
      setOpportunites(result.opportunites);
    });
  }

  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl p-5 sm:p-6">
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <p className="text-sm font-semibold text-[var(--color-primary)]">
            Découvre ce à quoi tu pourrais avoir droit
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
              : opportunites
              ? "Regénérer"
              : "Trouver mes opportunités"}
          </button>
        </div>
        <p className="text-xs text-[var(--color-text-secondary)]">
          Analysé à partir de ton profil complet (âge, province, statut, situation professionnelle, finances).
        </p>
        {error && <p className="text-sm text-[var(--color-danger)] mt-3">{error}</p>}
      </div>

      {isPending && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass rounded-2xl p-6 animate-pulse">
              <div className="h-5 w-24 rounded-full bg-white/10 mb-3" />
              <div className="h-4 w-3/4 rounded bg-white/10 mb-3" />
              <div className="h-3 w-full rounded bg-white/5 mb-2" />
              <div className="h-3 w-5/6 rounded bg-white/5 mb-4" />
              <div className="h-3 w-2/3 rounded bg-white/5" />
            </div>
          ))}
        </div>
      )}

      {opportunites && !isPending && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {opportunites.map((opp, i) => (
              <OpportunityCard key={i} opp={opp} lien={trouverLienOrganisme(opp.organisme)} />
            ))}
          </div>

          <p className="text-xs text-[var(--color-text-secondary)] opacity-70 px-2">
            Ces suggestions sont informatives et générées automatiquement — vérifie toujours ton admissibilité exacte auprès de l&apos;organisme officiel avant d&apos;entamer une démarche. Ceci ne remplace pas l&apos;avis d&apos;un(e) professionnel(le) pour les sujets juridiques, fiscaux ou d&apos;immigration.
          </p>
        </>
      )}
    </div>
  );
}
