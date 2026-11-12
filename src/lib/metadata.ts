import type { Metadata } from "next";
import { content } from "@/content";
import { PATHS, SITE, type Locale } from "./site";

const OG_LOCALE: Record<Locale, string> = { en: "en_US", pt: "pt_BR" };

export function buildMetadata(locale: Locale): Metadata {
  const { meta } = content[locale];
  return {
    metadataBase: new URL(SITE.url),
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: PATHS[locale],
      languages: { en: PATHS.en, "pt-BR": PATHS.pt, "x-default": PATHS.en },
    },
    openGraph: {
      type: "website",
      url: PATHS[locale],
      siteName: SITE.brand,
      title: meta.title,
      description: meta.description,
      locale: OG_LOCALE[locale],
      images: [{ url: "/og.png", width: 1200, height: 630, alt: `${SITE.person} — ${SITE.brand}` }],
    },
    twitter: { card: "summary_large_image" },
    icons: { icon: "/icon.svg" },
  };
}
