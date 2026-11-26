export interface Article {
  slug: string;
  path: string;
  title: string;
  summary: string;
  /** Short line under the title, e.g. topic and reading time. */
  meta: string;
}

export const ARTICLES = {
  "semantic-cache-false-hits": {
    slug: "semantic-cache-false-hits",
    path: "/writing/semantic-cache-false-hits/",
    title: "Similar is not the same: measuring false hits in semantic caches",
    summary:
      "Tuning the similarity threshold cannot stop a semantic cache from answering the wrong question, and an LLM judge that looked perfect on hand-written pairs was much weaker on real ones.",
    meta: "LLM systems · Experiment · 8 min read",
  },
} satisfies Record<string, Article>;

export const ARTICLE_LIST: Article[] = Object.values(ARTICLES);
