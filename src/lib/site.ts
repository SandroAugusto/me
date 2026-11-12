export const SITE = {
  url: "https://soatech.dev",
  brand: "SOATECH",
  legalName: "S.O.A Soluções Tecnológicas",
  person: "Sandro Augusto",
  linkedin: "https://www.linkedin.com/in/sandro-oliveira-augusto",
  github: "https://github.com/SandroAugusto",
  repo: "https://github.com/SandroAugusto/me",
} as const;

export const LOCALES = ["en", "pt"] as const;
export type Locale = (typeof LOCALES)[number];

/** English lives at the root and is the default for search engines; Portuguese is under /pt/. */
export const PATHS: Record<Locale, string> = { en: "/", pt: "/pt/" };

export const HTML_LANG: Record<Locale, string> = { en: "en", pt: "pt-BR" };

export const LANG_STORAGE_KEY = "lang";
