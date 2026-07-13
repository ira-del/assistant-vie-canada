"use client";

import { useEffect, useState } from "react";
import { lireConsentement, ecrireConsentement } from "@/lib/analytics/consent";

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [personnaliserOuvert, setPersonnaliserOuvert] = useState(false);
  const [analyticsActif, setAnalyticsActif] = useState(true);

  useEffect(() => {
    // localStorage n'existe pas côté serveur — on ne peut lire le
    // consentement qu'après le montage, pour éviter un mismatch
    // d'hydratation entre le rendu serveur et le premier rendu client.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(lireConsentement() === null);
  }, []);

  function accepter() {
    ecrireConsentement("accepted");
    setVisible(false);
  }

  function refuser() {
    ecrireConsentement("refused");
    setVisible(false);
  }

  function enregistrerPersonnalisation() {
    ecrireConsentement(analyticsActif ? "accepted" : "refused");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-[60] p-4">
      <div className="max-w-2xl mx-auto glass rounded-2xl p-5 shadow-2xl">
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4">
          On utilise des cookies de mesure d&apos;audience (Google Analytics) pour comprendre
          comment le site est utilisé et l&apos;améliorer. Aucun cookie publicitaire. Tu peux
          changer d&apos;avis à tout moment.
        </p>

        {personnaliserOuvert && (
          <label className="flex items-center gap-3 mb-4 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={analyticsActif}
              onChange={(e) => setAnalyticsActif(e.target.checked)}
              className="w-4 h-4"
            />
            Mesure d&apos;audience (Google Analytics)
          </label>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={accepter}
            className="rounded-lg bg-[var(--color-primary)] hover:opacity-90 transition py-2 px-4 text-sm font-semibold"
          >
            Accepter
          </button>
          <button
            type="button"
            onClick={refuser}
            className="rounded-lg bg-white/10 hover:bg-white/20 transition py-2 px-4 text-sm font-semibold"
          >
            Refuser
          </button>
          {personnaliserOuvert ? (
            <button
              type="button"
              onClick={enregistrerPersonnalisation}
              className="rounded-lg bg-white/10 hover:bg-white/20 transition py-2 px-4 text-sm font-semibold"
            >
              Enregistrer mes choix
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setPersonnaliserOuvert(true)}
              className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition underline"
            >
              Personnaliser
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
