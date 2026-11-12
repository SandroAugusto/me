import type { MetadataRoute } from "next";
import { LOCALES, PATHS, SITE } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = { en: SITE.url + PATHS.en, "pt-BR": SITE.url + PATHS.pt };
  return LOCALES.map((locale) => ({
    url: SITE.url + PATHS[locale],
    lastModified: new Date(),
    alternates: { languages },
  }));
}
