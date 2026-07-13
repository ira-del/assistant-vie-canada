import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

// Chaque article est un simple fichier .md dans content/blog/ — pas de base
// de données, pas d'interface d'administration à construire. Pour publier un
// nouvel article, il suffit d'ajouter un fichier ici avec le même
// frontmatter (title, description, date, category).
const DOSSIER_ARTICLES = path.join(process.cwd(), "content", "blog");

export const CATEGORIES = [
  "Finance",
  "Immigration",
  "Études",
  "Emploi",
  "Investissement",
  "Fiscalité",
  "Retraite",
  "Actualités",
] as const;

export interface ArticleMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
}

export interface Article extends ArticleMeta {
  contenuHtml: string;
}

function listerFichiers(): string[] {
  if (!fs.existsSync(DOSSIER_ARTICLES)) return [];
  return fs.readdirSync(DOSSIER_ARTICLES).filter((f) => f.endsWith(".md"));
}

// Permet d'écrire des articles à l'avance avec une date future — ils restent
// invisibles (liste, sitemap, page individuelle) jusqu'à ce que leur date
// arrive, sans qu'aucune action manuelle ne soit nécessaire pour les publier.
function estPublie(date: string): boolean {
  const aujourdhui = new Date().toISOString().slice(0, 10);
  return date <= aujourdhui;
}

export function getAllPosts(): ArticleMeta[] {
  return listerFichiers()
    .map((fichier) => {
      const contenuBrut = fs.readFileSync(path.join(DOSSIER_ARTICLES, fichier), "utf-8");
      const { data } = matter(contenuBrut);
      return {
        slug: fichier.replace(/\.md$/, ""),
        title: data.title as string,
        description: data.description as string,
        date: data.date as string,
        category: data.category as string,
      };
    })
    .filter((post) => estPublie(post.date))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

// new Date("2026-06-22") est interprété en UTC minuit — dans un fuseau
// derrière UTC, toLocaleDateString affiche alors la veille. On construit la
// date à partir de ses composantes locales pour éviter ce décalage.
export function formatDateArticle(iso: string): string {
  const [annee, mois, jour] = iso.split("-").map(Number);
  return new Date(annee, mois - 1, jour).toLocaleDateString("fr-CA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function getPostBySlug(slug: string): Article | null {
  const cheminFichier = path.join(DOSSIER_ARTICLES, `${slug}.md`);
  if (!fs.existsSync(cheminFichier)) return null;

  const contenuBrut = fs.readFileSync(cheminFichier, "utf-8");
  const { data, content } = matter(contenuBrut);

  // Accès direct à l'URL d'un article dont la date n'est pas encore arrivée
  // — on le traite comme inexistant, exactement comme s'il n'était pas
  // encore publié.
  if (!estPublie(data.date as string)) return null;

  return {
    slug,
    title: data.title as string,
    description: data.description as string,
    date: data.date as string,
    category: data.category as string,
    contenuHtml: marked.parse(content, { async: false }) as string,
  };
}
