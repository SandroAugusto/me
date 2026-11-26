import type { MetadataRoute } from "next";
import { LOCALES, PATHS, SITE } from "@/lib/site";
import { ARTICLE_LIST } from "@/content/writing";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = { en: SITE.url + PATHS.en, "pt-BR": SITE.url + PATHS.pt };
  const pages = LOCALES.map((locale) => ({
    url: SITE.url + PATHS[locale],
    lastModified: new Date(),
    alternates: { languages },
  }));
  const articles = ARTICLE_LIST.map((article) => ({ url: SITE.url + article.path, lastModified: new Date() }));
  return [...pages, ...articles];
}
