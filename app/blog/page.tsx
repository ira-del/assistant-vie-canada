import Link from "next/link";
import Logo from "@/components/ui/Logo";
import { getAllPosts, CATEGORIES, formatDateArticle } from "@/lib/blog/posts";

export const metadata = {
  title: "Blog",
  description:
    "Conseils et explications sur les finances, l'immigration, les études, l'emploi et plus, au Canada.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ categorie?: string }>;
}) {
  const { categorie } = await searchParams;
  const tousLesArticles = getAllPosts();
  const articles = categorie
    ? tousLesArticles.filter((a) => a.category === categorie)
    : tousLesArticles;

  return (
    <main className="min-h-screen gradient-bg">
      <div className="max-w-4xl mx-auto px-6 md:px-10">
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

        <section className="text-center py-10 md:py-16">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Blog</h1>
          <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            Conseils et explications sur les finances, l&apos;immigration, les études, l&apos;emploi
            et plus, au Canada.
          </p>
        </section>

        <nav aria-label="Filtrer par catégorie" className="flex flex-wrap justify-center gap-2 pb-10">
          <Link
            href="/blog"
            className={`rounded-full transition py-1.5 px-4 text-xs font-medium ${
              !categorie
                ? "bg-[var(--color-primary)] text-white"
                : "bg-white/5 hover:bg-white/10 border border-white/10 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            Tout
          </Link>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/blog?categorie=${encodeURIComponent(cat)}`}
              className={`rounded-full transition py-1.5 px-4 text-xs font-medium ${
                categorie === cat
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-white/5 hover:bg-white/10 border border-white/10 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              }`}
            >
              {cat}
            </Link>
          ))}
        </nav>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pb-16">
          {articles.length === 0 && (
            <p className="col-span-full text-center text-sm text-[var(--color-text-secondary)]">
              Aucun article dans cette catégorie pour l&apos;instant.
            </p>
          )}
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="glass rounded-2xl p-6 hover:bg-white/10 transition"
            >
              <span className="inline-block rounded-full bg-[var(--color-primary)]/15 text-[var(--color-primary)] text-xs font-semibold py-1 px-3 mb-3">
                {article.category}
              </span>
              <h2 className="font-semibold mb-2">{article.title}</h2>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-3">
                {article.description}
              </p>
              <p className="text-xs text-[var(--color-text-secondary)] opacity-70">
                {formatDateArticle(article.date)}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
