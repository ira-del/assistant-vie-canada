import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog/posts";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://assistant-vie-canada.vercel.app";

const PAGES_PUBLIQUES = [
  "",
  "/fonctionnalites",
  "/blog",
  "/a-propos",
  "/faq",
  "/contact",
  "/confidentialite",
  "/conditions-utilisation",
  "/mentions-legales",
  "/login",
  "/register",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const pagesStatiques = PAGES_PUBLIQUES.map((chemin) => ({
    url: `${BASE_URL}${chemin}`,
    lastModified: new Date(),
  }));

  const articles = getAllPosts().map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
  }));

  return [...pagesStatiques, ...articles];
}
