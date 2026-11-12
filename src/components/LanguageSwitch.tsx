"use client";

import { LANG_STORAGE_KEY, LOCALES, PATHS, type Locale } from "@/lib/site";

function remember(locale: Locale) {
  try {
    localStorage.setItem(LANG_STORAGE_KEY, locale);
  } catch {
    // Storage can be unavailable (private mode, blocked cookies); the link still works.
  }
}

export function LanguageSwitch({ current, label }: { current: Locale; label: string }) {
  return (
    <div className="langs" role="group" aria-label={label}>
      {LOCALES.map((locale) => (
        <a
          key={locale}
          href={PATHS[locale]}
          hrefLang={locale}
          aria-current={locale === current ? "true" : undefined}
          onClick={() => remember(locale)}
        >
          {locale.toUpperCase()}
        </a>
      ))}
    </div>
  );
}
