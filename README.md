# sandroaugusto.dev

Personal site of Sandro Augusto, at [sandroaugusto.dev](https://sandroaugusto.dev). A statically exported Next.js app in English and Portuguese.

## Stack

- Next.js (App Router) with React and TypeScript in strict mode
- Static export (`output: "export"`): the build produces plain files in `out/`, with no server at runtime
- Plain CSS with custom properties. The only client-side JavaScript is the language switch and the mobile menu, which is a native `<details>` element that also works without it

## How it is organised

```
src/
  app/
    (en)/            English root layout and page, served at /
      writing/       one page per article, served at /writing/<slug>/
    (pt)/            Portuguese root layout and page, served at /pt/
      pt/writing/    the same articles in Portuguese, at /pt/writing/<slug>/
    sitemap.ts       sitemap.xml, generated from the locales and the articles
    robots.ts        robots.txt
  articles/<slug>/   an article: en.tsx, pt.tsx and the figures both quote, data.ts
  components/        Site (all sections), ArticleShell, RootShell, LanguageSwitch, MobileMenu, Logo
  content/           typed content: types.ts, en.ts, pt.ts, writing.ts
  lib/               site constants, metadata builders, number formatting
```

Each language has its own root layout so that `<html lang>` is correct in the exported HTML. Both layouts render the same `Site` component with a different locale.

All copy lives in `src/content`. Both languages implement the `Content` interface, so a field added to one language and forgotten in the other fails the type check.

## Articles

Every article exists in English and in Portuguese. Titles and summaries for both are in `src/content/writing.ts`, which the home page, the article header, the metadata and the sitemap read.

The prose is written twice, in `src/articles/<slug>/en.tsx` and `pt.tsx`. The figures are written once, in `src/articles/<slug>/data.ts`, as numbers with a note of where each comes from; both versions format them through `src/lib/format.ts` (`1,524` and `0.757` in English, `1.524` and `0,757` in Portuguese). Every figure comes from the repository the article links to, so when that repository's results change, the number is changed in `data.ts` and both languages follow. A change to the argument itself still has to be made in both files.

## Languages

- English is served at `/` and is the default for search engines (`x-default`).
- Portuguese is served at `/pt/`.
- Each page, articles included, declares its other language as an `hreflang` alternate, in the HTML and in the sitemap.
- The language switch on an article leads to the same article in the other language.
- A first-time visitor whose browser prefers Portuguese is sent from `/` to `/pt/`. A language picked by hand in the header is stored and always wins.

## Commands

```
npm install
npm run dev         # local development
npm run typecheck   # TypeScript only
npm run build       # static export to out/
npm run check       # typecheck and build
```

## Deploy

Any static host works. On Cloudflare Pages: build command `npm run build`, output directory `out`.
