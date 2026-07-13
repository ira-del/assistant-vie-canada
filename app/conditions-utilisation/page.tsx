import Link from "next/link";

export const metadata = {
  title: "Conditions d'utilisation",
  description: "Les règles d'utilisation d'Assistant Vie Canada.",
  alternates: { canonical: "/conditions-utilisation" },
};

export default function ConditionsUtilisationPage() {
  return (
    <main className="min-h-screen gradient-bg p-6 md:p-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Conditions d&apos;utilisation</h1>
          <Link
            href="/"
            className="link-button rounded-lg bg-white/10 hover:bg-white/20 transition py-2 px-4 text-sm font-semibold"
          >
            ← Accueil
          </Link>
        </div>

        <div className="glass rounded-2xl p-6 md:p-8 space-y-6 text-sm text-[var(--color-text-secondary)] leading-relaxed">
          <p className="text-xs opacity-70">Dernière mise à jour : juillet 2026</p>

          <section>
            <h2 className="text-base font-semibold text-[var(--color-text-primary)] mb-2">
              Objet du service
            </h2>
            <p>
              Assistant Vie Canada est un outil informatif d&apos;aide à la planification financière
              et personnelle. Il fournit des projections, des scores et des conseils générés à
              partir des informations que tu fournis. <strong>Ce service ne constitue pas un avis
              professionnel</strong> (financier, juridique, fiscal, d&apos;immigration ou de santé)
              et ne remplace pas la consultation d&apos;un(e) professionnel(le) qualifié(e).
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[var(--color-text-primary)] mb-2">
              Ton compte
            </h2>
            <p>
              Tu es responsable de la confidentialité de ton mot de passe et de toute activité sur
              ton compte. Les informations que tu fournis (revenus, dépenses, etc.) doivent être
              exactes dans la mesure du possible — la qualité des projections en dépend directement.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[var(--color-text-primary)] mb-2">
              Usage acceptable
            </h2>
            <p>
              Le service est destiné à un usage personnel. Il est interdit de tenter de contourner
              les mesures de sécurité, d&apos;automatiser des requêtes en masse, ou d&apos;utiliser
              le service à des fins illégales.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[var(--color-text-primary)] mb-2">
              Limitation de responsabilité
            </h2>
            <p>
              Les projections, scores et conseils générés (y compris par l&apos;intelligence
              artificielle) sont fournis à titre indicatif seulement, sans garantie
              d&apos;exactitude. Assistant Vie Canada ne peut être tenu responsable des décisions
              prises sur la base de ces informations. Consulte toujours un(e) professionnel(le)
              qualifié(e) pour des décisions financières, juridiques, fiscales ou
              d&apos;immigration importantes.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[var(--color-text-primary)] mb-2">
              Modification et résiliation
            </h2>
            <p>
              Le service peut évoluer, être temporairement indisponible ou modifié sans préavis
              pendant cette phase de développement. Tu peux supprimer ton compte à tout moment
              depuis la page{" "}
              <Link href="/mes-donnees" className="text-[var(--color-secondary)] hover:underline">
                Mes données
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[var(--color-text-primary)] mb-2">
              Droit applicable
            </h2>
            <p>
              Ces conditions sont régies par les lois applicables au Canada et, le cas échéant, par
              les lois de la province de résidence de l&apos;utilisateur.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
