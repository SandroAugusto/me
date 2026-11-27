# sandroaugusto.dev

Personal site of Sandro Augusto, at [sandroaugusto.dev](https://sandroaugusto.dev). A statically exported Next.js app in English and Portuguese.

## Stack

- Next.js (App Router) with React and TypeScript in strict mode
- Static export (`output: "export"`): the build produces plain files in `out/`, with no server at runtime
- Plain CSS with custom properties, and no client-side JavaScript beyond the language switch

## How it is organised

```
src/
  app/
    (en)/            English root layout and page, served at /
    (pt)/            Portuguese root layout and page, served at /pt/
    sitemap.ts       sitemap.xml, generated from the list of locales
    robots.ts        robots.txt
  components/        Site (all sections), RootShell, LanguageSwitch
  content/           typed content: types.ts, en.ts, pt.ts
  lib/               site constants and the metadata builder
```

Each language has its own root layout so that `<html lang>` is correct in the exported HTML. Both layouts render the same `Site` component with a different locale.

All copy lives in `src/content`. Both languages implement the `Content` interface, so a field added to one language and forgotten in the other fails the type check.

## Languages

- English is served at `/` and is the default for search engines (`x-default`).
- Portuguese is served at `/pt/`.
- Each page declares the other as an `hreflang` alternate, in the HTML and in the sitemap.
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
