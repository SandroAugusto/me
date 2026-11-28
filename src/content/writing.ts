import { LOCALES, PATHS, type Locale } from "@/lib/site";

/** What the home page, the article header and the page metadata show, per language. */
export interface ArticleText {
  title: string;
  summary: string;
  /** Short line above the title, e.g. topic and reading time. */
  meta: string;
}

export interface Article {
  slug: string;
  text: Record<Locale, ArticleText>;
}

/**
 * Every article exists in both languages. The prose is in
 * src/articles/<slug>/{en,pt}.tsx and the figures both versions quote are in
 * src/articles/<slug>/data.ts, so a new result is changed in one place.
 */
export const ARTICLES = {
  "semantic-cache-false-hits": {
    slug: "semantic-cache-false-hits",
    text: {
      en: {
        title: "Similar is not the same: measuring false hits in semantic caches",
        summary:
          "Tuning the similarity threshold could not make a semantic cache safe without giving up most of its savings, and an LLM judge that looked perfect on hand-written pairs was much weaker on real ones.",
        meta: "LLM systems · Experiment · 8 min read",
      },
      pt: {
        title: "Parecido não é igual: medindo falsos acertos em caches semânticos",
        summary:
          "Ajustar o limiar de similaridade não tornou o cache semântico seguro sem abrir mão da maior parte da economia, e um juiz LLM que parecia perfeito em pares escritos à mão foi bem mais fraco em perguntas reais.",
        meta: "Sistemas com LLM · Experimento · 8 min de leitura",
      },
    },
  },
  "time-in-range": {
    slug: "time-in-range",
    text: {
      en: {
        title: "How long does a liquidity range last? Testing the textbook formula on public prices",
        summary:
          "The standard formula for how long a price stays in a range was wrong in a way that depended on the range's width. A large part of the error came from how I was measuring, and the model's own world does not reproduce the rest.",
        meta: "Quantitative modelling · Experiment · 9 min read",
      },
      pt: {
        title: "Quanto tempo dura uma faixa de liquidez? Testando a fórmula de livro-texto em preços públicos",
        summary:
          "A fórmula padrão para o tempo que um preço permanece em uma faixa errou de um jeito que dependia da largura da faixa. Boa parte do erro vinha de como eu estava medindo, e o mundo do próprio modelo não reproduz o restante.",
        meta: "Modelagem quantitativa · Experimento · 9 min de leitura",
      },
    },
  },
} satisfies Record<string, Article>;

export type ArticleSlug = keyof typeof ARTICLES;

export const ARTICLE_SLUGS = Object.keys(ARTICLES) as ArticleSlug[];

/** Where an article is served in a language: /writing/<slug>/ or /pt/writing/<slug>/. */
export function articlePath(slug: ArticleSlug, locale: Locale): string {
  return `${PATHS[locale]}writing/${slug}/`;
}

/** The article's path in every language, for the language switch and hreflang. */
export function articlePaths(slug: ArticleSlug): Record<Locale, string> {
  return Object.fromEntries(LOCALES.map((locale) => [locale, articlePath(slug, locale)])) as Record<Locale, string>;
}
