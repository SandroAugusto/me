import type { Locale } from "./site";

const NUMBER_LOCALE: Record<Locale, string> = { en: "en-US", pt: "pt-BR" };

/**
 * Number formatting for article text. Figures are stored once as numbers
 * (src/articles/<slug>/data.ts) and written here in each language's
 * convention: 1,524 and 0.757 in English, 1.524 and 0,757 in Portuguese.
 */
export function formatter(locale: Locale) {
  const tag = NUMBER_LOCALE[locale];
  /** `value` with exactly `digits` decimal places. */
  const n = (value: number, digits = 0): string =>
    value.toLocaleString(tag, { minimumFractionDigits: digits, maximumFractionDigits: digits });
  return {
    n,
    /** A percentage already expressed in percent: pct(29.5, 1) is "29.5%" or "29,5%". */
    pct: (value: number, digits = 0): string => `${n(value, digits)}%`,
  };
}

export type Formatter = ReturnType<typeof formatter>;
