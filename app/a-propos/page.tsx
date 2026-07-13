import Link from "next/link";

export const metadata = {
  title: "À propos",
  description: "La mission et les fonctionnalités d'Assistant Vie Canada.",
  alternates: { canonical: "/a-propos" },
};

export default function AProposPage() {
  return (
    <main className="min-h-screen gradient-bg p-6 md:p-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">À propos</h1>
          <Link
            href="/"
            className="link-button rounded-lg bg-white/10 hover:bg-white/20 transition py-2 px-4 text-sm font-semibold"
          >
            ← Accueil
          </Link>
        </div>

        <div className="glass rounded-2xl p-6 md:p-8 space-y-8">
          <section>
            <h2 className="text-lg font-semibold text-[var(--color-primary)] mb-2">
              Notre mission
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
              Aider chaque personne au Canada à comprendre sa situation financière et à prendre des
              décisions éclairées — peu importe son statut, sa province ou son parcours. Nous
              croyons que des conseils personnalisés et une vision claire de son avenir financier
              ne devraient pas être réservés à ceux qui peuvent se payer un conseiller.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--color-primary)] mb-2">
              Ce que nous offrons
            </h2>
            <ul className="space-y-2 text-sm text-[var(--color-text-secondary)] leading-relaxed">
              <li>• Un score de santé financière clair, avec tes points forts et tes priorités.</li>
              <li>• Des projections de patrimoine sur 10 à 100 ans, adaptées à ta situation réelle.</li>
              <li>• Un conseiller et un assistant IA pour répondre à tes questions financières,
                professionnelles, administratives et personnelles.</li>
              <li>• Des opportunités personnalisées (aides, bourses, crédits d&apos;impôt) selon ta
                province et ton statut.</li>
              <li>• Un accompagnement pour les questions d&apos;immigration au Canada.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--color-primary)] mb-2">
              Nos valeurs
            </h2>
            <ul className="space-y-2 text-sm text-[var(--color-text-secondary)] leading-relaxed">
              <li>
                <span className="font-medium text-[var(--color-text-primary)]">Transparence</span> —
                nous expliquons toujours comment nos calculs et projections fonctionnent.
              </li>
              <li>
                <span className="font-medium text-[var(--color-text-primary)]">Honnêteté</span> —
                nos réponses IA ne garantissent jamais un résultat et rappellent quand consulter
                un(e) professionnel(le) qualifié(e).
              </li>
              <li>
                <span className="font-medium text-[var(--color-text-primary)]">
                  Respect de tes données
                </span>{" "}
                — tes informations financières sont sensibles ; elles ne sont jamais vendues ni
                partagées à des fins publicitaires.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
