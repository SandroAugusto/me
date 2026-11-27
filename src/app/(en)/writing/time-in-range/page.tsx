import type { Metadata } from "next";
import { ArticleShell } from "@/components/ArticleShell";
import { SITE } from "@/lib/site";
import { ARTICLES } from "@/content/writing";

const article = ARTICLES["time-in-range"];
const REPO = "https://github.com/SandroAugusto/liquidity-pool-analyzer";
const REPORT = `${REPO}/blob/main/docs/research/exit-time.md`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: `${article.title} | ${SITE.person}`,
  description: article.summary,
  alternates: { canonical: article.path },
  openGraph: {
    type: "article",
    url: article.path,
    siteName: SITE.person,
    title: article.title,
    description: article.summary,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: SITE.person }],
  },
  twitter: { card: "summary_large_image" },
};

export default function TimeInRangeArticle() {
  return (
    <ArticleShell title={article.title} meta={article.meta}>
      <p className="article-lead">
        In a concentrated-liquidity pool, you choose a price range. While the price stays inside it, the position earns
        fees; when the price leaves, it stops earning until you move the range, and moving it costs money. How long a range lasts is therefore one of the main numbers that
        decide whether a narrow range pays, next to the fee rate while it is in range. I tested the textbook formula for
        it against two years of public prices. It was wrong in a way that depended on the
        range&rsquo;s width, and a large part of the error I first saw came from how I was measuring.
      </p>

      <h2>The formula</h2>
      <p>
        If the log of the price moves like a random walk with volatility &sigma; and no drift, a position opened at the
        centre of a range of log half-width h is expected to stay in range for E[T] = h&sup2; / &sigma;&sup2;. Halve the
        width and the expected time in range drops to a quarter. The cost of re-centring per day is roughly the cost of
        one exit divided by E[T], so, to a first approximation, an error in E[T] is an error of the same size in the cost of running a range.
      </p>
      <p>
        The same model also gives the whole distribution of T, not only its mean. Measured in units of E[T], it is the
        same for every width and every &sigma;: the median is 0.757, about 9% of positions should be out by a quarter of
        E[T], and about 89% by twice E[T]. That is what makes the model testable. Ranges of different widths, opened in
        different volatility regimes, should all line up on one curve.
      </p>

      <h2>The test</h2>
      <p>
        I tested it where anyone can rerun it: public prices and synthetic positions.
      </p>
      <ul className="article-list">
        <li>
          <strong>Prices:</strong> Coinbase public candles for BTC-USD and SOL-USD, divided to give SOL per BTC, from
          November 2024 to November 2026. Hourly closes for the full two years; minute closes for the last 120 days.
        </li>
        <li>
          <strong>Positions:</strong> once a day, a new position centred on the price, at &plusmn;1%,
          &plusmn;2%, &plusmn;4% and &plusmn;8%, followed until the first close at or beyond a bound.
        </li>
        <li>
          <strong>Volatility:</strong> known at the time of opening, from the daily closes of the previous 30 days, or from the
          samples of the previous 7 days.
        </li>
        <li>
          <strong>Censoring:</strong> at each horizon, only positions watched at least that long are counted,
          whether or not they exited.
        </li>
      </ul>

      <h2>First result: much of the error was the clock, not the market</h2>
      <p>
        On hourly closes, narrow ranges lasted far longer than predicted: at &plusmn;1% the median was 1.89 times E[T],
        against 0.757. That looked like a finding about the market. A large part of it was a finding about the data. A price
        checked once an hour can leave the range and come back between two checks, and the exit is only seen when a
        close lands outside. The size of the error depends on how far the price typically moves between checks
        compared with the width of the range, so it is largest for narrow ranges.
      </p>
      <p>
        This is a known problem in pricing barrier options, with a known correction: a price checked every &Delta;t
        behaves like one checked continuously against a barrier about 0.58 &middot; &sigma; &middot; &radic;&Delta;t
        further away (Broadie, Glasserman and Kou, 1997). Applying it moves the &plusmn;1% median from 1.89 to 1.14.
        The correction assumes the price moves little between checks compared with the width of the range, which is
        barely true for &plusmn;1% on hourly data, so the better evidence there is minute data. Over the last 120 days, with volatility from the previous 30
        days, the &plusmn;1% median on minute closes was 1.29, against 1.77 on hourly closes of the same days. With
        volatility from the previous 7 days the order reverses (1.60 on minute closes, 1.29 on hourly), probably
        because that estimator is built from minute returns in one case and hourly returns in the other; I have not
        tested that. It is one more reason not to lean on any single number here.
      </p>
      <div className="article-table">
        <table>
          <thead>
            <tr>
              <th>Range</th>
              <th>Hourly, raw</th>
              <th>Hourly, corrected</th>
              <th>Model</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>&plusmn;1%</td>
              <td>1.89</td>
              <td>1.14</td>
              <td>0.757</td>
            </tr>
            <tr>
              <td>&plusmn;2%</td>
              <td>1.34</td>
              <td>1.04</td>
              <td>0.757</td>
            </tr>
            <tr>
              <td>&plusmn;4%</td>
              <td>1.03</td>
              <td>0.89</td>
              <td>0.757</td>
            </tr>
            <tr>
              <td>&plusmn;8%</td>
              <td>0.77</td>
              <td>0.71</td>
              <td>0.757</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Median time in range as a multiple of E[T], two years of hourly closes, volatility from the 30 days before
        opening, 700 positions per width.
      </p>

      <h2>What is left after the correction</h2>
      <p>
        <strong>The error depends on width.</strong> Even with the measurement fixed, a &plusmn;1% range lasts longer
        than the model says at the median: 1.5 to 1.7 times longer with volatility from the previous 30 days, and over
        a wider spread with the 7-day estimator. A &plusmn;8% range ends anywhere from on time to over 20% early. The model has one
        &sigma; for every horizon, and these two widths live on very different horizons: hours for &plusmn;1%, weeks for
        &plusmn;8%. One number does not describe both. I have candidate explanations and have tested none of them: most
        hours are quieter than the daily volatility implies, with moves arriving in bursts; or the price ratio
        mean-reverts over short horizons and trends over longer ones. Drift over the weeks a wide range lives is
        a third. Return variance at 1 hour, 4 hours, 1 day and 7 days, exit times grouped by the volatility each
        position actually saw, and drift over the same windows would start to separate them.
      </p>
      <p>
        <strong>At &plusmn;8%, both tails are wider than the model.</strong> At this width the measurement correction
        barely matters, and over two years 14% of ranges were out within a quarter of E[T] (model: 9%), while 19% were
        still in range at twice E[T] (model: 11%). A rule built on the expected value would be surprised in both
        directions more often than the formula suggests. At narrower widths the tails are mixed up with the
        measurement problem, so I would not generalise this.
      </p>
      <p>
        <strong>The volatility window is still an open question.</strong> I expected a 30-day window to lag behind the
        current regime and do worse than a 7-day one. Over two years of hourly data the medians differed by at most
        0.04. Over the last 120 days they differed more, but there the two estimators started on different days, so
        that comparison is not like for like. Neither result measures lag, which would need exit times grouped by
        changes in regime, so this study does not answer it.
      </p>

      <h2>What I would not conclude from this</h2>
      <ul className="article-list">
        <li>
          Positions opened on consecutive days overlap in time, so they are not independent. I report no confidence
          intervals, and differences of a few hundredths mean nothing.
        </li>
        <li>
          This is one pair, on one exchange. A pool&rsquo;s own price can differ from an exchange&rsquo;s, most of all
          over minutes.
        </li>
        <li>
          Results depend on the period: at &plusmn;8% the corrected median was 0.71 over two years and 0.59 over the
          last 120 days.
        </li>
        <li>
          Fees are not part of this. Whether fees in range scale with &sigma; / h, which is what would make the width
          cancel out of the economics, needs pool volume and liquidity by price level over time. I have not found a
          free, reproducible source for that, so that half of the model is still unvalidated.
        </li>
      </ul>

      <h2>How it is built</h2>
      <p>
        The study is part of a TypeScript project for analysing concentrated-liquidity positions. The exit-time
        distribution and the correction are tested against values computed independently in Python and against seeded
        Monte Carlo simulations; a separate Python script, outside the repository, reproduced the medians to two decimals. Raw prices are
        cached locally and never committed, and the repository holds no real position data: everything is synthetic or
        public, so the whole result can be rerun from the repository.
      </p>
      <p>
        The practical lesson is older than this project: when a model and the data disagree, check the measurement
        before blaming the model. Here the measurement accounted for a large part of the gap, and what remained was more interesting than what
        I started with.
      </p>
      <p>
        Code, tests and the full tables are on{" "}
        <a href={REPO} target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        , with the method and every table in the{" "}
        <a href={REPORT} target="_blank" rel="noopener noreferrer">
          research report
        </a>
        .
      </p>
    </ArticleShell>
  );
}
