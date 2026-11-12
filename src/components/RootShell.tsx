import type { ReactNode } from "react";
import { HTML_LANG, LANG_STORAGE_KEY, PATHS, type Locale } from "@/lib/site";

/**
 * Sends first-time visitors whose browser prefers Portuguese from "/" to "/pt/".
 * It runs before paint, never overrides a language the visitor picked by hand,
 * and does nothing for crawlers, which stay on the English default.
 */
const redirectScript = `try{var s=localStorage.getItem(${JSON.stringify(LANG_STORAGE_KEY)});var l=(navigator.languages&&navigator.languages[0])||navigator.language||"";if(!s&&/^pt\\b/i.test(l)&&location.pathname==="/"){location.replace(${JSON.stringify(PATHS.pt)})}}catch(e){}`;

export function RootShell({ locale, children }: { locale: Locale; children: ReactNode }) {
  return (
    <html lang={HTML_LANG[locale]}>
      <body>
        {locale === "en" ? <script dangerouslySetInnerHTML={{ __html: redirectScript }} /> : null}
        {children}
      </body>
    </html>
  );
}
