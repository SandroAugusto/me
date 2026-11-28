import type { Metadata } from "next";
import { ARTICLES, articlePath, type ArticleSlug } from "@/content/writing";
import { OG_LOCALE } from "./metadata";
import { SITE, type Locale } from "./site";

/** Metadata of one article in one language, with the other language as an hreflang alternate. */
export function articleMetadata(slug: ArticleSlug, locale: Locale): Metadata {
  const text = ARTICLES[slug].text[locale];
  const path = articlePath(slug, locale);
  return {
    metadataBase: new URL(SITE.url),
    title: `${text.title} | ${SITE.person}`,
    description: text.summary,
    alternates: {
      canonical: path,
      languages: {
        en: articlePath(slug, "en"),
        "pt-BR": articlePath(slug, "pt"),
        "x-default": articlePath(slug, "en"),
      },
    },
    openGraph: {
      type: "article",
      url: path,
      siteName: SITE.person,
      title: text.title,
      description: text.summary,
      locale: OG_LOCALE[locale],
      images: [{ url: "/og.png", width: 1200, height: 630, alt: SITE.person }],
    },
    twitter: { card: "summary_large_image" },
  };
}
