/**
 * Figures quoted by the semantic cache article, in both languages. Each one
 * comes from the results committed by GitHub Actions in the repository below
 * (README.md and results/); when a run changes them, change the number here
 * and both versions follow.
 */

export const REPO = "https://github.com/SandroAugusto/semantic-cache-false-hits";

/** The hand-written dataset (data/pairs.jsonl). */
export const PAIRS = { total: 56, paraphrases: 18, hardNegatives: 30, unrelated: 8 } as const;

/** Experiment 1: cosine similarity with nomic-embed-text, threshold swept from 0.50 to 0.99. */
export const THRESHOLD_ONLY = {
  sweep: [0.5, 0.99],
  paraphraseMean: 0.737,
  hardNegativeCategoryMeans: [0.81, 0.97],
  /** "Does the sponsor pay the participant?" against the same question reversed. */
  roleSwapSimilarity: 0.993,
  /** Every configuration needed a threshold above this to block all hard negatives. */
  safeThresholdAbove: 0.99,
  paraphrasesReusedAtSafePct: 0,
} as const;

/** Experiment 2: threshold plus an LLM judge, on the hand-written pairs. */
export const JUDGE_ON_PAIRS = {
  threshold: 0.6,
  /** qwen2.5:7b: hard negatives rejected, of PAIRS.hardNegatives. */
  rejectedGuided: 30,
  rejectedPlain: 29,
  /** Rule of three: the error rate 0 errors in 30 still allows, in percent. */
  ruleOfThreePct: 10,
} as const;

/** Track A: Medical Question Pairs against a whole cache. */
export const TRACK_A = {
  questions: 1524,
  sampledPerKind: 150,
  /** Threshold only. */
  wrongAtThreshold: { threshold: 0.75, relatedServedPct: 42 },
  onePercent: { threshold: 0.907, rewritesReusedPct: 29.5 },
  /** Rewrites that matched a different cached question, at thresholds up to `upTo`. */
  otherOriginal: { pct: 3.3, upTo: 0.7 },
  /** qwen2.5:3b judge. */
  smallJudge: { relatedAcceptedPct: 7.3, secondsPerQuery: 2.2 },
  /** qwen2.5:7b judge, on CPU. */
  largeJudge: { secondsPerQuery: 9.2, p95Seconds: 13.9 },
} as const;

/** Wrong answers / answers saved per 1,000 queries with a close match, by share of related traffic. */
export const PER_THOUSAND = {
  relatedSharesPct: [0, 10, 25, 50],
  policies: [
    { id: "threshold-0.80", threshold: 0.8, judge: null, cells: [[13, 773], [28, 696], [50, 580], [87, 387]] },
    { id: "threshold-0.85", threshold: 0.85, judge: null, cells: [[0, 540], [5, 486], [13, 405], [27, 270]] },
    { id: "judge-3b", threshold: 0.6, judge: "qwen2.5:3b", cells: [[0, 640], [7, 576], [18, 480], [37, 320]] },
    { id: "judge-7b", threshold: 0.6, judge: "qwen2.5:7b", cells: [[13, 860], [28, 774], [50, 645], [87, 430]] },
  ],
} as const;

/** Share of served hits that are wrong at 25% related traffic, in percent. */
export const WRONG_SHARE_AT_25 = { threshold085: 3.1, judge3b: 3.6, threshold080: 7.9, judge7b: 7.2 } as const;
