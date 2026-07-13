import Link from "next/link";

export const metadata = {
  title: "Mentions légales",
  description: "Informations légales concernant Assistant Vie Canada.",
  alternates: { canonical: "/mentions-legales" },
};

export default function MentionsLegalesPage() {
  return (
    <main className="min-h-screen gradient-bg p-6 md:p-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Mentions légales</h1>
          <Link
            href="/"
            className="link-button rounded-lg bg-white/10 hover:bg-white/20 transition py-2 px-4 text-sm font-semibold"
          >
            ← Accueil
          </Link>
        </div>

        <div className="glass rounded-2xl p-6 md:p-8 space-y-6 text-sm text-[var(--color-text-secondary)] leading-relaxed">
          <section>
            <h2 className="text-base font-semibold text-[var(--color-text-primary)] mb-2">
              Éditeur
            </h2>
            <p>
              Assistant Vie Canada est actuellement un projet personnel en développement, non
              exploité par une entité juridique enregistrée. Ces informations seront mises à jour
              lors de l&apos;incorporation officielle du service.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[var(--color-text-primary)] mb-2">
              Hébergement
            </h2>
            <p>
              Le site est hébergé par Vercel Inc. (340 S Lemon Ave #4133, Walnut, CA 91789,
              États-Unis). La base de données et l&apos;authentification sont fournies par
              Supabase.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[var(--color-text-primary)] mb-2">
              Propriété intellectuelle
            </h2>
            <p>
              L&apos;ensemble du contenu, du design et du code d&apos;Assistant Vie Canada est
              protégé et ne peut être reproduit sans autorisation.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[var(--color-text-primary)] mb-2">
              Contact
            </h2>
            <p>
              Pour toute question, écris à{" "}
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
