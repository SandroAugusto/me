/**
 * Figures quoted by the time-in-range article, in both languages. Each one
 * comes from docs/research/exit-time.md in the repository below; when that
 * report changes, change the number here and both versions follow.
 */

export const REPO = "https://github.com/SandroAugusto/liquidity-pool-analyzer";
export const REPORT = `${REPO}/blob/main/docs/research/exit-time.md`;

/** What the model itself predicts, in units of E[T]. */
export const MODEL = {
  median: 0.757,
  /** Share of positions out by a quarter of E[T], and by twice E[T], in percent. */
  exitedByQuarterPct: 9,
  exitedByTwicePct: 89,
  /** Broadie, Glasserman and Kou (1997): barrier shift per σ·√Δt. */
  barrierShift: 0.58,
};

/** Median time in range as a multiple of E[T]: two years of hourly closes, σ from 30 days. */
export const HOURLY = {
  positionsPerWidth: 700,
  rows: [
    { widthPct: 1, raw: 1.89, corrected: 1.14 },
    { widthPct: 2, raw: 1.34, corrected: 1.04 },
    { widthPct: 4, raw: 1.03, corrected: 0.89 },
    { widthPct: 8, raw: 0.77, corrected: 0.71 },
  ],
} as const;

/** ±1% median over the last 120 days, by sampling and by σ window. */
export const LAST_120_DAYS = {
  sigma30: { minute: 1.29, hourly: 1.77 },
  sigma7: { minute: 1.6, hourly: 1.29 },
  /** ±8% corrected median, against HOURLY's two-year figure. */
  wideCorrected: 0.59,
  /** Gaussian walk's own ±1% median on minute data, 10th to 90th percentile of seeds. */
  gaussianNarrow: [0.62, 1.0],
} as const;

/** How much longer than the model a ±1% range lasts at the median, σ from 30 days. */
export const NARROW_EXCESS = [1.5, 1.6] as const;

/** Altered paths: median of the runs, with the 10th to 90th percentile of seeds. */
export const SURROGATES = {
  runs: 40,
  real: { narrow: 1.14, wide: 0.71 },
  signs: { narrow: [1.15, 1.09, 1.23], wide: [0.83, 0.74, 0.93] },
  shuffled: { narrow: [1.02, 0.94, 1.1], wide: [0.8, 0.72, 0.85] },
  gaussian: { narrow: [0.77, 0.69, 0.83], wide: [0.74, 0.67, 0.83] },
  /** Signs randomised, ±1%, with the volatility the real prices had on each date. */
  signsWithRealVolatility: 1.1,
  /** ±8% tails, in percent: out within a quarter of E[T], still in at twice E[T]. */
  wideTails: { realEarlyPct: 16, realLatePct: 18, gaussianPct: 11 },
} as const;

/** Trailing volatility windows as forecasts of the following week. */
export const VOLATILITY = {
  mediansWithin: 0.02,
  missFactor: 1.4,
  shortWindowOvershootPct: 45,
  longWindowOvershootPct: 30,
} as const;

/** Out-of-sample forecasts, split in time, both directions. */
export const FORECAST = {
  /** ±1%: share of positions out by the model's median and by its 90th percentile, in percent. */
  exitedByModelMedianPct: [35, 36],
  exitedByModelP90Pct: [75, 77],
} as const;

/** First comparison of pool and exchange prices, in basis points. */
export const BASIS = { deepestPoolBp: 13.7, thinPoolsUpToBp: 198 } as const;
