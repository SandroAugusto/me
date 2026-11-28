import { formatter } from "@/lib/format";
import { JUDGE_ON_PAIRS, PAIRS, PER_THOUSAND, REPO, THRESHOLD_ONLY, TRACK_A, WRONG_SHARE_AT_25 } from "./data";

const { n, pct } = formatter("en");

export function SemanticCacheEn() {
  return (
    <>
      <p className="article-lead">
        A semantic cache reuses a previous LLM answer when a new question is &ldquo;close enough&rdquo; to one it has
        already seen. I measured how often &ldquo;close enough&rdquo; returns the answer to a different question. The
        short version: in the configurations I tested, tuning the similarity threshold could not make the cache safe
        without giving up most of its savings, and the second fix, an LLM judge, looked perfect on my own test set and
        much weaker on real questions.
      </p>

      <h2>Why this matters</h2>
      <p>
        Semantic caching is one of the standard patterns in an LLM gateway, next to model routing and confidence
        thresholds. The appeal is obvious: a cache hit costs no model call. The failure mode is less obvious. A cache
        miss costs money; a false hit returns a confident, well-written answer to a question nobody asked. In a domain
        like clinical trials, &ldquo;what are the inclusion criteria?&rdquo; and &ldquo;what are the exclusion
        criteria?&rdquo; should never share an answer.
      </p>
      <p>
        My hypothesis was that questions on the same topic with a different meaning sit as close together in embedding
        space as true paraphrases do. If that holds, no threshold can tell them apart.
      </p>

      <h2>Experiment 1: the threshold alone</h2>
      <p>
        I wrote {n(PAIRS.total)} question pairs about clinical trials: {n(PAIRS.paraphrases)} paraphrases that should
        share an answer, {n(PAIRS.hardNegatives)} &ldquo;hard negatives&rdquo; that change one thing (an antonym, a
        negation, an entity, a number, the scope, or who acts on whom), and {n(PAIRS.unrelated)} unrelated pairs. I
        embedded them with <code>nomic-embed-text</code> and swept the threshold from {n(THRESHOLD_ONLY.sweep[0], 2)} to{" "}
        {n(THRESHOLD_ONLY.sweep[1], 2)}.
      </p>
      <p>
        The hypothesis was too optimistic. Hard negatives were not as close as paraphrases; they were{" "}
        <strong>closer</strong>. Paraphrases averaged {n(THRESHOLD_ONLY.paraphraseMean, 3)} cosine similarity; every
        hard-negative category averaged between {n(THRESHOLD_ONLY.hardNegativeCategoryMeans[0], 2)} and{" "}
        {n(THRESHOLD_ONLY.hardNegativeCategoryMeans[1], 2)}. &ldquo;Does the sponsor pay the participant?&rdquo; and
        &ldquo;Does the participant pay the sponsor?&rdquo; scored {n(THRESHOLD_ONLY.roleSwapSimilarity, 3)}.
      </p>
      <p>
        That turns the threshold into a trap. Raising it removes good hits before it removes bad ones. The lowest
        threshold that blocked every hard negative was above {n(THRESHOLD_ONLY.safeThresholdAbove, 2)} in all three
        embedding configurations, and at that point the cache reused {pct(THRESHOLD_ONLY.paraphrasesReusedAtSafePct)}{" "}
        of paraphrases. This is not a calibration problem; it is a property of what embeddings capture. They are good
        at topic and weak at the small details that change an answer.
      </p>

      <h2>Experiment 2: adding an LLM judge</h2>
      <p>
        The natural next step is to let the threshold propose a candidate and ask a small local model whether one
        answer fits both questions. At a permissive threshold of {n(JUDGE_ON_PAIRS.threshold, 2)},{" "}
        <code>qwen2.5:7b</code> kept every paraphrase and rejected all {n(JUDGE_ON_PAIRS.rejectedGuided)} hard
        negatives with a guided prompt ({n(JUDGE_ON_PAIRS.rejectedPlain)} of {n(PAIRS.hardNegatives)} with a plain
        one).
      </p>
      <figure className="article-figure">
        <img
          src="/writing/semantic-cache-tradeoff.svg"
          alt="Chart of paraphrases reused against hard negatives accepted. The threshold-only line never reaches the safe corner; threshold plus an LLM judge does."
          width={760}
          height={500}
        />
        <figcaption>Paraphrases reused vs. hard negatives accepted, threshold only and threshold plus a judge.</figcaption>
      </figure>
      <p>
        Two results from this round shaped how I evaluate everything after it. First, <code>llama3.2:3b</code> answered
        &ldquo;different&rdquo; to every pair: zero wrong answers and zero savings. Any evaluation that reports only
        safety would have called it perfect, so savings and errors always have to be reported together. Second, 0
        errors in {n(PAIRS.hardNegatives)} hard negatives still allows a true error rate of about{" "}
        {pct(JUDGE_ON_PAIRS.ruleOfThreePct)} at 95% confidence. A clean result on a small set is a signal, not a
        guarantee.
      </p>

      <h2>Track A: real questions against a whole cache</h2>
      <p>
        My pairs were written by changing one word, which is exactly the kind of difference an LLM spots easily. So I
        reran the idea on real patient questions from the Medical Question Pairs dataset (McCreery et al., KDD 2020):{" "}
        {n(TRACK_A.questions)} questions, each with a doctor-written rewrite that keeps the intent and a related
        question with similar keywords and a different answer. All {n(TRACK_A.questions)} originals went into the
        cache, and {n(TRACK_A.sampledPerKind)} rewrites plus {n(TRACK_A.sampledPerKind)} related questions searched the
        entire cache, as they would in production.
      </p>
      <p>Three things changed:</p>
      <ul className="article-list">
        <li>
          <strong>Real questions separate better, but not enough.</strong> At a threshold of{" "}
          {n(TRACK_A.wrongAtThreshold.threshold, 2)}, the cache still served a wrong answer to{" "}
          {pct(TRACK_A.wrongAtThreshold.relatedServedPct)} of related questions. Getting that below 1% took a threshold
          of {n(TRACK_A.onePercent.threshold, 3)}, which reused only {pct(TRACK_A.onePercent.rewritesReusedPct, 1)} of
          rewrites.
        </li>
        <li>
          <strong>A whole cache adds errors of its own.</strong> Even with no tricky traffic,{" "}
          {pct(TRACK_A.otherOriginal.pct, 1)} of rewrites matched a different cached question at thresholds up to{" "}
          {n(TRACK_A.otherOriginal.upTo, 2)}. Testing isolated pairs hides this entirely.
        </li>
        <li>
          <strong>The judge was much weaker.</strong> <code>qwen2.5:3b</code> let through{" "}
          {pct(TRACK_A.smallJudge.relatedAcceptedPct, 1)} of related questions (versus 0 of {n(PAIRS.hardNegatives)} in
          Experiment 2) and rejected a third of valid rewrites. A larger judge, <code>qwen2.5:7b</code>, was more
          lenient rather than more accurate, at {n(TRACK_A.largeJudge.secondsPerQuery, 1)} seconds per query on CPU
          (p95 {n(TRACK_A.largeJudge.p95Seconds, 1)} seconds).
        </li>
      </ul>
      <p>
        The useful way to compare policies turned out to be wrong answers and answers saved per 1,000 queries that have
        a close match in the cache, for different shares of related questions in the traffic:
      </p>
      <div className="article-table">
        <table>
          <thead>
            <tr>
              <th>Policy</th>
              {PER_THOUSAND.relatedSharesPct.map((share) => (
                <th key={share}>{pct(share)} related</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PER_THOUSAND.policies.map((policy) => (
              <tr key={policy.id}>
                <td>
                  {policy.judge === null
                    ? `threshold ${n(policy.threshold, 2)}`
                    : `${n(policy.threshold, 2)} + ${policy.judge} judge`}
                </td>
                {policy.cells.map(([wrong, saved], i) => (
                  <td key={i}>
                    {n(wrong)} / {n(saved)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        The 3B judge saves more than a 0.85 threshold but also serves more wrong answers, and it adds about{" "}
        {n(TRACK_A.smallJudge.secondsPerQuery, 1)} seconds per query on CPU. It moves along the same trade-off curve
        instead of escaping it. The honest conclusion is that Experiment 2 overstated the judge: hand-written, one-word
        hard negatives are easy; real near-misses are not.
      </p>
      <p>
        The same table reads differently as the share of served cache hits that are wrong, which is what a user
        actually experiences. With 25% related traffic, that is {pct(WRONG_SHARE_AT_25.threshold085, 1)} for the 0.85
        threshold, {pct(WRONG_SHARE_AT_25.judge3b, 1)} for the 3B judge, and {pct(WRONG_SHARE_AT_25.threshold080, 1)}{" "}
        and {pct(WRONG_SHARE_AT_25.judge7b, 1)} for the 0.80 threshold and the 7B judge. At 50% related traffic, every
        policy serves a wrong answer on roughly one hit in ten or more.
      </p>
      <p>
        One caveat applies to every Track A number. The dataset labels each question only against its own original, so
        a hit on a <em>different</em> cached question is counted as wrong without a label saying so. The wrong-answer
        figures are therefore an upper bound and the answers saved a lower bound. Those hits are now exported for
        labeling by hand, and this article will be updated with the corrected figures.
      </p>

      <h2>What I would do when designing a semantic cache</h2>
      <ul className="article-list">
        <li>
          <strong>Start from a wrong-answer budget, not a threshold.</strong> Decide how many wrong answers per 1,000
          queries the product can tolerate, then pick the policy that saves the most within that budget. A default like
          0.75 says nothing about either number.
        </li>
        <li>
          <strong>Evaluate against the whole cache with real near-misses.</strong> Pair tests miss neighbor collisions,
          and hand-written negatives flatter any judge.
        </li>
        <li>
          <strong>Report savings and errors side by side,</strong> as a function of the traffic mix, because the right
          policy changes with how often related-but-different questions arrive. Only production traffic can answer
          that.
        </li>
        <li>
          <strong>Fail closed.</strong> Use embeddings to retrieve candidates, not to decide that two questions are
          equivalent, and when the decision is unclear, call the model.
        </li>
        <li>
          <strong>Equivalent questions are not enough.</strong> A cached answer can be stale, or belong to a user with
          different permissions, a different document version or a different conversation. None of that is visible to
          an embedding; it has to be part of the cache key or the reuse decision. This experiment does not test it.
        </li>
        <li>
          <strong>Treat a judge as a trade-off, not a fix.</strong> It costs latency on most hits and, with small
          models, does not clearly beat a stricter threshold. Whether it pays off depends on how expensive the answer
          it saves is.
        </li>
      </ul>

      <h2>Limitations</h2>
      <p>
        One domain, one language, short questions, and small samples: 5 pairs per hard-negative category in Experiments
        1 and 2, and {n(TRACK_A.sampledPerKind)} + {n(TRACK_A.sampledPerKind)} queries in Track A. Labels are human
        judgment, and each pair was judged in one order only. Judges ran on free CPU runners, so latency on a GPU would
        be much lower and was not measured. Frontier models may judge better, at a much higher price per check.
      </p>
      <p>
        I also did not test the middle ground between an embedding and a generative judge: a cross-encoder trained for
        question equivalence, or a bidirectional entailment check. They are cheaper than an LLM call and built for
        exactly this decision. That is the next experiment, and this article will be updated with the result.
      </p>
      <p>
        Code, data and raw results are on <a href={REPO}>GitHub</a>, and every number above comes from runs committed
        there by GitHub Actions.
      </p>
    </>
  );
}
