import type { MetadataRoute } from "next";
import { HTML_LANG, LOCALES, PATHS, SITE } from "@/lib/site";
import { ARTICLE_SLUGS, articlePath } from "@/content/writing";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = { en: SITE.url + PATHS.en, "pt-BR": SITE.url + PATHS.pt };
  const pages = LOCALES.map((locale) => ({
    url: SITE.url + PATHS[locale],
    lastModified: new Date(),
    alternates: { languages },
  }));
  const articles = ARTICLE_SLUGS.flatMap((slug) => {
    const alternates = {
      languages: Object.fromEntries(LOCALES.map((l) => [HTML_LANG[l], SITE.url + articlePath(slug, l)])),
    };
    return LOCALES.map((locale) => ({
      url: SITE.url + articlePath(slug, locale),
      lastModified: new Date(),
      alternates,
    }));
  });
  return [...pages, ...articles];
}
