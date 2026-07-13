import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Logo from "@/components/ui/Logo";
import JsonLd from "@/components/seo/JsonLd";

export const metadata = {
  alternates: { canonical: "/" },
};

const FONCTIONNALITES = [
  {
    color: "#6366f1",
    titre: "Gestion financière",
    description: "Centralise revenus, dépenses, épargne, dettes et investissements en un seul endroit clair.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 10h18M3 6a2 2 0 012-2h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6z M7 15h4"
      />
    ),
  },
  {
    color: "#10b981",
    titre: "Assistant IA",
    description: "Un assistant conversationnel pour réfléchir à tes décisions financières, professionnelles, administratives et personnelles.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8-1.5 0-2.91-.32-4.14-.9L3 20l1.1-3.6C3.4 15.1 3 13.6 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    ),
  },
  {
    color: "#06b6d4",
    titre: "Projection financière",
    description: "Visualise l'évolution de ton épargne, tes dettes et tes investissements sur 10 à 100 ans.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 17l6-6 4 4 8-8M21 7v6M21 7h-6"
      />
    ),
  },
  {
    color: "#f59e0b",
    titre: "Objectifs de vie",
    description: "Fixe un objectif financier concret et suis en temps réel combien de temps il te faudra pour l'atteindre.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 2v4m0 12v4m10-10h-4M6 12H2m15.07-7.07l-2.83 2.83M9.76 14.24l-2.83 2.83m0-10.14l2.83 2.83m4.48 4.48l2.83 2.83M12 8a4 4 0 100 8 4 4 0 000-8z"
      />
    ),
  },
  {
    color: "#a855f7",
    titre: "Analyse personnalisée",
    description: "Un conseiller IA qui génère des conseils à partir de ta situation réelle, pas des généralités.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11 4a7 7 0 100 14 7 7 0 000-14zM21 21l-4.35-4.35"
      />
    ),
  },
  {
    color: "#ef4444",
    titre: "Sécurité des données",
    description: "Chiffrement, accès restreint et contrôle total : consulte, exporte ou supprime tes données à tout moment.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4zM9 12l2 2 4-4"
      />
    ),
  },
  {
    color: "#eab308",
    titre: "Opportunités adaptées",
    description: "Découvre les aides, bourses et crédits d'impôt auxquels tu pourrais être admissible selon ta province.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M20 12v8a1 1 0 01-1 1H5a1 1 0 01-1-1v-8M2 7h20v5H2V7zM12 22V7M12 7c0-1.657-1.343-4-3-4S6 5.343 6 7h6zm0 0c0-1.657 1.343-4 3-4s3 2.343 3 4h-6z"
      />
    ),
  },
  {
    color: "#ec4899",
    titre: "Scénarios de vie",
    description: "Compare plusieurs rythmes d'épargne et scénarios pour voir leur impact concret sur ton avenir.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 3v12a3 3 0 003 3h9m-9-9a3 3 0 100-6 3 3 0 000 6zm12 6a3 3 0 11-6 0 3 3 0 016 0zm-6-9a3 3 0 116 0 3 3 0 01-6 0z"
      />
    ),
  },
];

const AVANTAGES = [
  "Analyse personnalisée, pas des conseils génériques",
  "IA intelligente qui comprend ta situation réelle",
  "Données chiffrées et sous ton contrôle total",
  "Simulations réalistes sur 10 à 100 ans",
  "Vision à long terme de ton avenir financier",
  "Recommandations adaptées à ta province et ton statut",
];

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Assistant Vie Canada",
    url: "https://assistantvie.com",
    description:
      "Simule ton avenir financier, obtiens des conseils personnalisés par IA, et découvre les aides auxquelles tu as droit au Canada.",
    inLanguage: "fr-CA",
    publisher: {
      "@type": "Organization",
      name: "Assistant Vie Canada",
      url: "https://assistantvie.com",
    },
  };

  return (
    <main className="min-h-screen gradient-bg">
      <JsonLd data={jsonLd} />
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        {/* Header */}
        <header className="flex items-center justify-between py-6">
          <Logo />
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="link-button rounded-lg bg-white/10 hover:bg-white/20 transition py-2 px-4 text-sm font-semibold"
            >
              Connexion
            </Link>
            <Link
              href="/register"
              className="link-button rounded-lg bg-[var(--color-primary)] hover:opacity-90 transition py-2 px-4 text-sm font-semibold"
            >
              S&apos;inscrire
            </Link>
          </div>
        </header>

        {/* Hero */}
        <section className="py-16 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Prends les meilleures décisions pour ton avenir, grâce à l&apos;IA
            </h1>
            <p className="text-lg text-[var(--color-text-secondary)] mb-10">
              Simule ton avenir financier, obtiens des conseils personnalisés par IA, et découvre
              les aides auxquelles tu as droit — le tout adapté à ta province et à ton statut au
              Canada.
            </p>
            <div className="flex items-center justify-center lg:justify-start gap-4 flex-wrap">
              <Link
                href="/register"
                className="link-button rounded-lg bg-[var(--color-primary)] hover:opacity-90 transition py-3 px-8 text-base font-semibold"
              >
                Commencer gratuitement
              </Link>
              <a
                href="#fonctionnalites"
                className="link-button rounded-lg bg-white/10 hover:bg-white/20 transition py-3 px-8 text-base font-semibold"
              >
                Découvrir les fonctionnalités
              </a>
            </div>
          </div>

          {/* Illustration abstraite (SVG inline, pas d'image externe à charger) */}
          <div className="hidden lg:block" aria-hidden="true">
            <svg viewBox="0 0 480 340" className="w-full h-auto">
              <defs>
                <linearGradient id="heroFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <rect x="0" y="0" width="480" height="340" rx="24" fill="white" fillOpacity="0.04" />
              <path
                d="M40 260 L120 200 L190 230 L260 130 L330 160 L440 70"
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M40 260 L120 200 L190 230 L260 130 L330 160 L440 70 L440 300 L40 300 Z"
                fill="url(#heroFill)"
              />
              {[
                { x: 40, y: 260, c: "var(--color-primary)" },
                { x: 120, y: 200, c: "var(--color-secondary)" },
                { x: 190, y: 230, c: "var(--color-primary)" },
                { x: 260, y: 130, c: "var(--color-accent)" },
                { x: 330, y: 160, c: "var(--color-secondary)" },
                { x: 440, y: 70, c: "var(--color-success)" },
              ].map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="6" fill={p.c} />
              ))}
            </svg>
          </div>
        </section>

        {/* Fonctionnalités */}
        <section id="fonctionnalites" className="py-12 md:py-20 scroll-mt-20">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">
            Tout ce qu&apos;il te faut pour piloter ton avenir
          </h2>
          <p className="text-center text-[var(--color-text-secondary)] mb-10 max-w-2xl mx-auto">
            Huit outils pensés pour te donner une vision complète et concrète de ta situation.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FONCTIONNALITES.map((f) => (
              <div key={f.titre} className="glass rounded-2xl p-6">
                <svg
                  className="w-8 h-8 mb-4"
                  style={{ color: f.color }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {f.icon}
                </svg>
                <p className="font-semibold mb-2">{f.titre}</p>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Pourquoi choisir Assistant Vie Canada */}
        <section className="py-12 md:py-20">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
            Pourquoi choisir Assistant Vie Canada
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {AVANTAGES.map((avantage) => (
              <div key={avantage} className="glass rounded-xl p-4 flex items-start gap-3">
                <svg
                  className="w-5 h-5 flex-shrink-0 mt-0.5 text-[var(--color-success)]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-sm text-[var(--color-text-secondary)]">{avantage}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Appel à l'action final */}
        <section className="py-12 md:py-16">
          <div className="glass rounded-2xl p-8 md:p-12 text-center max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Prêt(e) à découvrir ta situation financière ?
            </h2>
            <p className="text-[var(--color-text-secondary)] mb-8">
              Crée ton compte gratuitement et obtiens ton score de santé financière en quelques
              minutes.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link
                href="/register"
                className="link-button rounded-lg bg-[var(--color-primary)] hover:opacity-90 transition py-3 px-8 text-base font-semibold"
              >
                Créer un compte gratuitement
              </Link>
              <Link
                href="/register"
                className="link-button rounded-lg bg-white/10 hover:bg-white/20 transition py-3 px-8 text-base font-semibold"
              >
                Découvrir mon score financier
              </Link>
            </div>
          </div>
        </section>

        {/* Avertissement — le pied de page complet (liens, copyright) est
            partagé sur tout le site via app/layout.tsx */}
        <p className="pb-10 text-center text-xs text-[var(--color-text-secondary)] opacity-70">
          Assistant Vie Canada fournit des informations générales à titre éducatif — ce n&apos;est
          pas un avis professionnel (financier, juridique, fiscal ou d&apos;immigration).
        </p>
      </div>
    </main>
  );
}
