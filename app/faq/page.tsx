import Link from "next/link";
import JsonLd from "@/components/seo/JsonLd";

export const metadata = {
  title: "FAQ",
  description: "Réponses aux questions fréquentes sur Assistant Vie Canada.",
  alternates: { canonical: "/faq" },
};

const QUESTIONS = [
  {
    q: "Qu'est-ce qu'Assistant Vie Canada ?",
    r: "Un assistant de vie qui t'aide à comprendre et planifier ta situation financière au Canada — score de santé financière, projections, conseils personnalisés, opportunités et accompagnement immigration, adaptés à ta province et ton statut.",
  },
  {
    q: "Comment fonctionne l'IA ?",
    r: "Certaines fonctionnalités (conseiller, assistant, opportunités, immigration) utilisent un modèle d'intelligence artificielle pour générer des réponses personnalisées à partir de ton profil. Les réponses sont informatives — elles ne remplacent jamais l'avis d'un(e) professionnel(le) qualifié(e), surtout pour les sujets juridiques, fiscaux, de santé ou d'immigration.",
  },
  {
    q: "Mes données sont-elles protégées ?",
    r: "Oui. Toutes les communications sont chiffrées (HTTPS), ton mot de passe est haché (jamais stocké en clair), et l'accès à tes données est restreint par des règles de sécurité au niveau de la base de données — personne d'autre que toi ne peut y accéder via l'application. Tu peux consulter notre politique de confidentialité pour plus de détails.",
  },
  {
    q: "Le service est-il gratuit ?",
    r: "Oui, pour l'instant Assistant Vie Canada est entièrement gratuit pendant sa phase de développement. Un modèle freemium pourra être introduit plus tard, mais les fonctionnalités de base resteront accessibles.",
  },
  {
    q: "Comment sont calculées les projections ?",
    r: "À partir de ta situation actuelle (revenus, dépenses, épargne, dettes, investissements), en supposant qu'elle reste stable dans le temps. L'épargne, les investissements (avec intérêts composés) et le remboursement de tes dettes sont modélisés comme des flux indépendants. C'est un point de départ pour visualiser ton avenir financier, pas une garantie.",
  },
  {
    q: "Puis-je supprimer mes données ou mon compte ?",
    r: "Oui, à tout moment. Depuis la page Mes données (accessible via Sécurité dans le menu), tu peux télécharger une copie complète de tes données ou supprimer définitivement ton compte — cette dernière action est immédiate et irréversible.",
  },
];

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: QUESTIONS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.r,
      },
    })),
  };

  return (
    <main className="min-h-screen gradient-bg p-6 md:p-10">
      <JsonLd data={jsonLd} />
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Questions fréquentes</h1>
          <Link
            href="/"
            className="link-button rounded-lg bg-white/10 hover:bg-white/20 transition py-2 px-4 text-sm font-semibold"
          >
            ← Accueil
          </Link>
        </div>

        <div className="space-y-3">
          {QUESTIONS.map((item) => (
            <details key={item.q} className="glass rounded-2xl p-6 group">
              <summary className="cursor-pointer text-sm font-semibold flex items-center justify-between gap-3">
                {item.q}
                <svg
                  className="w-4 h-4 flex-shrink-0 transition-transform group-open:rotate-180"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </summary>
              <p className="mt-3 text-sm text-[var(--color-text-secondary)] leading-relaxed">
                {item.r}
              </p>
            </details>
          ))}
        </div>

        <p className="text-center text-sm text-[var(--color-text-secondary)] mt-8">
          D&apos;autres questions ?{" "}
          <Link href="/contact" className="text-[var(--color-secondary)] hover:underline">
            Contacte-nous
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
