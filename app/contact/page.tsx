import Link from "next/link";

export const metadata = {
  title: "Contact",
  description: "Contacte l'équipe d'Assistant Vie Canada.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen gradient-bg p-6 md:p-10">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Contact</h1>
          <Link
            href="/"
            className="link-button rounded-lg bg-white/10 hover:bg-white/20 transition py-2 px-4 text-sm font-semibold"
          >
            ← Accueil
          </Link>
        </div>

        <div className="glass rounded-2xl p-6 md:p-8 space-y-6">
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
            Une question, un problème, une suggestion ? Écris-nous à{" "}
            <a
              href="mailto:contact@assistantvie.com"
              className="text-[var(--color-secondary)] hover:underline font-semibold"
            >
              contact@assistantvie.com
            </a>
            . La majorité des questions courantes trouvent aussi leur réponse dans notre{" "}
            <Link href="/faq" className="text-[var(--color-secondary)] hover:underline">
              FAQ
            </Link>
            .
          </p>

          <div className="border-t border-white/10 pt-6">
            <p className="text-sm font-semibold text-[var(--color-primary)] mb-1">
              Délai de réponse habituel
            </p>
            <p className="text-sm text-[var(--color-text-secondary)]">48 heures ouvrables.</p>
          </div>

          <div className="border-t border-white/10 pt-6">
            <p className="text-sm font-semibold text-[var(--color-primary)] mb-1">
              Question sur tes données ?
            </p>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Rendez-vous sur la page{" "}
              <Link href="/mes-donnees" className="text-[var(--color-secondary)] hover:underline">
                Mes données
              </Link>{" "}
              pour les consulter, les télécharger ou les supprimer directement.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
