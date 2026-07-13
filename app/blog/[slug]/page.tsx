import Link from "next/link";
import { notFound } from "next/navigation";
import Logo from "@/components/ui/Logo";
import JsonLd from "@/components/seo/JsonLd";
import { getAllPosts, getPostBySlug, formatDateArticle } from "@/lib/blog/posts";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getPostBySlug(slug);
  if (!article) return {};

  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: `/blog/${slug}` },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getPostBySlug(slug);
  if (!article) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    inLanguage: "fr-CA",
    author: { "@type": "Organization", name: "Assistant Vie Canada" },
  };

  return (
    <main className="min-h-screen gradient-bg">
      <JsonLd data={jsonLd} />
      <div className="max-w-2xl mx-auto px-6 md:px-10">
        <header className="flex items-center justify-between py-6">
          <Logo />
          <Link
            href="/blog"
            className="link-button rounded-lg bg-white/10 hover:bg-white/20 transition py-2 px-4 text-sm font-semibold"
          >
            ← Blog
          </Link>
        </header>

        <article className="pb-16">
          <span className="inline-block rounded-full bg-[var(--color-primary)]/15 text-[var(--color-primary)] text-xs font-semibold py-1 px-3 mb-4">
            {article.category}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">{article.title}</h1>
          <p className="text-xs text-[var(--color-text-secondary)] opacity-70 mb-8">
            {formatDateArticle(article.date)}
          </p>

          <div
            className="glass rounded-2xl p-6 md:p-8 prose-blog"
            dangerouslySetInnerHTML={{ __html: article.contenuHtml }}
          />
        </article>
      </div>
    </main>
  );
}
