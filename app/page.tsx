import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const FONCTIONNALITES = [
  {
    color: "#6366f1",
    titre: "Score de santé financière",
    description: "Un score sur 100 qui résume ta situation, avec tes points forts et tes priorités à travailler.",
  },
  {
    color: "#06b6d4",
    titre: "Projection de patrimoine",
    description: "Visualise l'évolution de ton épargne, tes dettes et tes investissements sur 10 à 100 ans.",
  },
  {
    color: "#a855f7",
    titre: "Conseiller IA",
    description: "Des conseils personnalisés générés à partir de ta situation réelle, pas des généralités.",
  },
  {
    color: "#10b981",
    titre: "Assistant IA",
    description: "Un assistant conversationnel pour réfléchir à tes décisions financières, professionnelles, administratives et personnelles.",
  },
  {
    color: "#f59e0b",
    titre: "Opportunités",
    description: "Découvre les aides, bourses et crédits d'impôt auxquels tu pourrais être admissible.",
  },
  {
    color: "#ef4444",
    titre: "Immigration",
    description: "Un diagnostic clair de ton statut au Canada et les prochaines étapes à envisager.",
  },
];

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen gradient-bg">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        {/* Header */}
        <header className="flex items-center justify-between py-6">
          <p className="text-lg font-bold">Assistant Vie Canada</p>
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
        <section className="text-center py-16 md:py-24 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Ton assistant de vie financier, pensé pour le Canada
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)] mb-10">
            Simule ton avenir financier, obtiens des conseils personnalisés par IA, et découvre les
            aides auxquelles tu as droit — le tout adapté à ta province et à ton statut.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/register"
              className="link-button rounded-lg bg-[var(--color-primary)] hover:opacity-90 transition py-3 px-8 text-base font-semibold"
            >
              Commencer gratuitement
            </Link>
            <Link
              href="/login"
              className="link-button rounded-lg bg-white/10 hover:bg-white/20 transition py-3 px-8 text-base font-semibold"
            >
              Se connecter
            </Link>
          </div>
        </section>

        {/* Fonctionnalités */}
        <section className="py-12 md:py-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FONCTIONNALITES.map((f) => (
              <div key={f.titre} className="glass rounded-2xl p-6">
                <span
                  className="inline-block w-2.5 h-2.5 rounded-full mb-4"
                  style={{ backgroundColor: f.color }}
                />
                <p className="font-semibold mb-2">{f.titre}</p>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="py-10 text-center text-xs text-[var(--color-text-secondary)] opacity-70">
          <p>
            Assistant Vie Canada fournit des informations générales à titre éducatif — ce n&apos;est
            pas un avis professionnel (financier, juridique, fiscal ou d&apos;immigration).
          </p>
          <p className="mt-2">© 2026 Assistant Vie Canada</p>
        </footer>
      </div>
    </main>
  );
}
