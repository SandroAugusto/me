import type { Metadata } from "next";
import { ArticleShell } from "@/components/ArticleShell";
import { SITE } from "@/lib/site";
import { ARTICLES } from "@/content/writing";

const article = ARTICLES["semantic-cache-false-hits"];
const REPO = "https://github.com/SandroAugusto/semantic-cache-false-hits";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: `${article.title} | ${SITE.person}`,
  description: article.summary,
  alternates: { canonical: article.path },
  openGraph: {
    type: "article",
    url: article.path,
    siteName: SITE.brand,
    title: article.title,
    description: article.summary,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: `${SITE.person} — ${SITE.brand}` }],
  },
  twitter: { card: "summary_large_image" },
};

export default function SemanticCacheArticle() {
  return (
    <ArticleShell title={article.title} meta={article.meta}>
      <p className="article-lead">
        A semantic cache reuses a previous LLM answer when a new question is &ldquo;close enough&rdquo; to one it has
        already seen. I measured how often &ldquo;close enough&rdquo; returns the answer to a different question. The
        short version: the common fix, tuning the similarity threshold, cannot solve it, and the second fix, an LLM
        judge, looked perfect on my own test set and much weaker on real questions.
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
        I wrote 56 question pairs about clinical trials: 18 paraphrases that should share an answer, 30 &ldquo;hard
        negatives&rdquo; that change one thing (an antonym, a negation, an entity, a number, the scope, or who acts on
        whom), and 8 unrelated pairs. I embedded them with <code>nomic-embed-text</code> and swept the threshold from
        0.50 to 0.99.
      </p>
      <p>
        The hypothesis was too optimistic. Hard negatives were not as close as paraphrases; they were{" "}
        <strong>closer</strong>. Paraphrases averaged 0.737 cosine similarity; every hard-negative category averaged
        between 0.81 and 0.97. &ldquo;Does the sponsor pay the participant?&rdquo; and &ldquo;Does the participant pay
        the sponsor?&rdquo; scored 0.993.
      </p>
      <p>
        That turns the threshold into a trap. Raising it removes good hits before it removes bad ones. The lowest
        threshold that blocked every hard negative was above 0.99 in all three embedding configurations, and at that
        point the cache reused 0% of paraphrases. This is not a calibration problem; it is a property of what embeddings
        capture. They are good at topic and weak at the small details that change an answer.
      </p>

      <h2>Experiment 2: adding an LLM judge</h2>
      <p>
        The natural next step is to let the threshold propose a candidate and ask a small local model whether one answer
        fits both questions. At a permissive threshold of 0.60, <code>qwen2.5:7b</code> kept every paraphrase and
        rejected all 30 hard negatives with a guided prompt (29 of 30 with a plain one).
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
        safety would have called it perfect, so savings and errors always have to be reported together. Second, 0 errors
        in 30 hard negatives still allows a true error rate of about 10% at 95% confidence. A clean result on a small set
        is a signal, not a guarantee.
      </p>

      <h2>Track A: real questions against a whole cache</h2>
      <p>
        My pairs were written by changing one word, which is exactly the kind of difference an LLM spots easily. So I
        reran the idea on real patient questions from the Medical Question Pairs dataset (McCreery et al., KDD 2020):
        1,524 questions, each with a doctor-written rewrite that keeps the intent and a related question with similar
        keywords and a different answer. All 1,524 originals went into the cache, and 150 rewrites plus 150 related
        questions searched the entire cache, as they would in production.
      </p>
      <p>Three things changed:</p>
      <ul className="article-list">
        <li>
          <strong>Real questions separate better, but not enough.</strong> At a threshold of 0.75, the cache still served a wrong answer to 42% of related questions. Getting that below 1% took a threshold of
          0.907, which reused only 29.5% of rewrites.
        </li>
        <li>
          <strong>A whole cache adds errors of its own.</strong> Even with no tricky traffic, 3.3% of rewrites matched a
          different cached question at thresholds up to 0.70. Testing isolated pairs hides this entirely.
        </li>
        <li>
          <strong>The judge was much weaker.</strong> <code>qwen2.5:3b</code> let through 7.3% of related questions
          (versus 0 of 30 in Experiment 2) and rejected a third of valid rewrites. A larger judge,{" "}
          <code>qwen2.5:7b</code>, was more lenient rather than more accurate.
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
              <th>0% related</th>
              <th>10% related</th>
              <th>25% related</th>
              <th>50% related</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>threshold 0.80</td>
              <td>13 / 773</td>
              <td>28 / 696</td>
              <td>50 / 580</td>
              <td>87 / 387</td>
            </tr>
            <tr>
              <td>threshold 0.85</td>
              <td>0 / 540</td>
              <td>5 / 486</td>
              <td>13 / 405</td>
              <td>27 / 270</td>
            </tr>
            <tr>
              <td>0.60 + qwen2.5:3b judge</td>
              <td>0 / 640</td>
              <td>7 / 576</td>
              <td>18 / 480</td>
              <td>37 / 320</td>
            </tr>
            <tr>
              <td>0.60 + qwen2.5:7b judge</td>
              <td>13 / 860</td>
              <td>28 / 774</td>
              <td>50 / 645</td>
              <td>87 / 430</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        The 3B judge saves more than a 0.85 threshold but also serves more wrong answers, and it adds about 2.2 seconds
        per query on CPU. It moves along the same trade-off curve instead of escaping it. The honest conclusion is that
        Experiment 2 overstated the judge: hand-written, one-word hard negatives are easy; real near-misses are not.
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
          policy changes with how often related-but-different questions arrive. Only production traffic can answer that.
        </li>
        <li>
          <strong>Treat a judge as a trade-off, not a fix.</strong> It costs latency on most hits and, with small models,
          does not clearly beat a stricter threshold. Whether it pays off depends on how expensive the answer it saves is.
        </li>
      </ul>

      <h2>Limitations</h2>
      <p>
        One domain, one language, short questions, and small samples: 5 pairs per hard-negative category in Experiments 1
        and 2, and 150 + 150 queries in Track A. Labels are human judgment, and each pair was judged in one order only.
        Judges ran on free CPU runners, so latency on a GPU would be much lower and was not measured. Frontier models may
        judge better, at a much higher price per check.
      </p>
      <p>
        Code, data and raw results are on <a href={REPO}>GitHub</a>, and every number above comes from runs committed
        there by GitHub Actions.
      </p>
    </ArticleShell>
  );
}
