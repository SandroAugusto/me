import type { ReactNode } from "react";
import { SITE } from "@/lib/site";

export function ArticleShell({ title, meta, children }: { title: string; meta: string; children: ReactNode }) {
  return (
    <>
      <header className="site-header">
        <div className="wrap bar">
          <a className="brand" href="/">
            {SITE.person}
          </a>
          <a className="article-back" href="/#writing">
            ← Writing
          </a>
        </div>
      </header>
      <main className="article wrap">
        <article>
          <p className="eyebrow mono">{meta}</p>
          <h1 className="article-title">{title}</h1>
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
            Source code
          </a>
        </div>
      </footer>
    </>
  );
}
