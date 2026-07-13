import Link from "next/link";

export const metadata = {
  title: "Politique de confidentialité",
  description: "Comment Assistant Vie Canada collecte, utilise et protège tes données personnelles.",
};

export default function ConfidentialitePage() {
  return (
    <main className="min-h-screen gradient-bg p-6 md:p-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Politique de confidentialité</h1>
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
              Quelles données nous collectons
            </h2>
            <p>
              Pour t&apos;offrir des projections et des conseils personnalisés, nous conservons : ton
              profil (âge, province, statut d&apos;immigration, situation familiale et
              professionnelle), ta situation financière (revenus, dépenses, épargne, dettes,
              objectifs), ta progression (badges, étapes, historique de ton score), tes conversations
              avec l&apos;Assistant IA, et un journal des actions importantes sur ton compte
              (connexions, modifications).
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[var(--color-text-primary)] mb-2">
              Pourquoi nous les collectons
            </h2>
            <p>
              Uniquement pour faire fonctionner le service : calculer ton score de santé financière,
              générer tes projections, personnaliser les conseils de l&apos;IA et identifier les
              opportunités (aides, crédits d&apos;impôt) qui te concernent réellement. Nous ne
              vendons ni ne partageons tes données à des fins publicitaires.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[var(--color-text-primary)] mb-2">
              Avec qui tes données sont partagées
            </h2>
            <p>
              Tes données sont hébergées par <strong>Supabase</strong> (base de données et
              authentification) et le site est déployé sur <strong>Vercel</strong>. Lorsque tu
              utilises une fonctionnalité IA (conseiller, assistant, opportunités, immigration), le
              contenu pertinent est envoyé à <strong>Anthropic</strong> (fournisseur du modèle
              d&apos;intelligence artificielle) pour générer une réponse. Aucune de ces données
              n&apos;est vendue à des tiers ni utilisée à des fins publicitaires.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[var(--color-text-primary)] mb-2">
              Comment tes données sont protégées
            </h2>
            <p>
              Toutes les communications avec le site sont chiffrées (HTTPS/TLS). Ton mot de passe
              n&apos;est jamais stocké en clair — il est haché par Supabase Auth. L&apos;accès à tes
              données est restreint par des règles de sécurité au niveau de la base de données
              (Row Level Security) : personne d&apos;autre que toi ne peut lire tes informations via
              l&apos;application.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[var(--color-text-primary)] mb-2">
              Cookies
            </h2>
            <p>
              Nous utilisons uniquement des cookies essentiels au fonctionnement du site (maintenir
              ta session de connexion). Aucun cookie de suivi publicitaire ou d&apos;analyse tierce
              n&apos;est utilisé.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[var(--color-text-primary)] mb-2">
              Tes droits
            </h2>
            <p>
              Tu peux à tout moment consulter, télécharger (format PDF) ou supprimer définitivement
              toutes tes données depuis la page{" "}
              <Link href="/mes-donnees" className="text-[var(--color-secondary)] hover:underline">
                Mes données
              </Link>
              . La suppression de ton compte est immédiate et irréversible.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[var(--color-text-primary)] mb-2">
              Nous contacter
            </h2>
            <p>
              Pour toute question sur cette politique, écris à{" "}
              <a
                href="mailto:contact@assistantvie.com"
                className="text-[var(--color-secondary)] hover:underline"
              >
                contact@assistantvie.com
              </a>{" "}
              ou consulte notre page{" "}
              <Link href="/contact" className="text-[var(--color-secondary)] hover:underline">
                Contact
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
