import type { ReactNode } from "react";
import { content } from "@/content";
import { ARTICLES, articlePaths, type ArticleSlug } from "@/content/writing";
import { PATHS, SITE, type Locale } from "@/lib/site";
import { LanguageSwitch } from "./LanguageSwitch";
import { Logo } from "./Logo";

/** Header, title block and footer of an article, in the page's language. */
export function ArticleShell({ slug, locale, children }: { slug: ArticleSlug; locale: Locale; children: ReactNode }) {
  const c = content[locale];
  const text = ARTICLES[slug].text[locale];
  return (
    <>
      <header className="site-header">
        <div className="wrap bar">
          <a className="brand" href={PATHS[locale]} aria-label={SITE.person}>
            <Logo />
            {SITE.person}
          </a>
          <div className="bar-right">
            <a className="article-back" href={`${PATHS[locale]}#writing`}>
              ← {c.nav.writing}
            </a>
            <LanguageSwitch current={locale} label={c.languageSwitch.label} paths={articlePaths(slug)} />
          </div>
        </div>
      </header>
      <main className="article wrap">
        <article>
          <p className="eyebrow mono">{text.meta}</p>
          <h1 className="article-title">{text.title}</h1>
          <p className="article-byline">{SITE.person}</p>
          <div className="article-body">{children}</div>
        </article>
      </main>
      <footer className="site-footer">
        <div className="wrap footer-row">
          <span>
            © {new Date().getFullYear()} {SITE.person} · {SITE.legalName}
          </span>
          <a href={SITE.repo} target="_blank" rel="noopener noreferrer">
            {c.footer.source}
          </a>
        </div>
      </footer>
    </>
  );
}
