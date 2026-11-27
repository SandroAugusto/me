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
        <strong>The error depends on width.</strong> Even with the measurement fixed, a &plusmn;1% range lasts 1.5 to
        1.6 times longer than the model says at the median, with volatility from the previous 30 days. At &plusmn;8% the
        median came out on time or early, but as the next section shows, that difference is within the noise of the
        method itself.
      </p>

      <h2>Second result: the model&rsquo;s own world does not reproduce it</h2>
      <p>
        To find out why narrow ranges last too long, I rebuilt the two years of prices in three altered ways and reran
        the study on each, forty times with different random seeds:
      </p>
      <ul className="article-list">
        <li>
          <strong>Signs randomised:</strong> every hourly move keeps its size and its place in time, but goes up or
          down at random. Large moves still come in bursts; any tendency to reverse or to trend is gone.
        </li>
        <li>
          <strong>Moves shuffled:</strong> the same hourly moves in random order. Their sizes are kept, the bursts are
          not.
        </li>
        <li>
          <strong>A Gaussian random walk</strong> with the same average volatility: the model&rsquo;s own world.
        </li>
      </ul>
      <div className="article-table">
        <table>
          <thead>
            <tr>
              <th>Path</th>
              <th>&plusmn;1%</th>
              <th>&plusmn;8%</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Real prices</td>
              <td>1.14</td>
              <td>0.71</td>
            </tr>
            <tr>
              <td>Signs randomised</td>
              <td>1.15 (1.09&ndash;1.23)</td>
              <td>0.83 (0.74&ndash;0.93)</td>
            </tr>
            <tr>
              <td>Moves shuffled</td>
              <td>1.02 (0.94&ndash;1.10)</td>
              <td>0.80 (0.72&ndash;0.85)</td>
            </tr>
            <tr>
              <td>Gaussian walk</td>
              <td>0.77 (0.69&ndash;0.83)</td>
              <td>0.74 (0.67&ndash;0.83)</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Median time in range as a multiple of E[T], corrected for hourly checks, with volatility re-estimated on each
        path the same way. For the altered paths: the median of forty runs, with the 10th to 90th percentile in
        brackets.
      </p>
      <p>
        At &plusmn;1%, the Gaussian walk lands near the model and the real prices do not. Paths that keep the real
        sizes of moves come close: shuffled, they give 1.02; with random signs, 1.15 (or 1.10 when the altered paths
        use the volatility the real prices had on each date). Shuffling keeps how large the moves are; randomising signs also keeps when the large ones come. Which of the two does more, and whether the direction
        of moves adds anything, these runs do not separate: the ranges overlap, and at &plusmn;2% or on minute data the
        answer depends on how volatility is estimated on the altered paths. My reading, which I have not tested
        directly: most hours are calmer than the average volatility implies, so a narrow range opened in a calm hour
        lasts much longer than the formula says.
      </p>
      <p>
        At &plusmn;8%, the Gaussian walk&rsquo;s own median ranges from 0.67 to 0.83 between seeds, which holds both
        the model&rsquo;s 0.757 and the 0.71 on real prices. So the median at that width is not evidence against the
        model. The tails are: on real prices, 16% of &plusmn;8% ranges were out within a quarter of E[T] and 18% were
        still in at twice E[T], against about 11% for each on the Gaussian walk. The slow ones are consistent with bursts of
        volatility, though shuffled paths, which have none, come close too; what produces the extra early exits I have
        not identified.
      </p>
      <p>
        These ranges measure the noise of the method on the same two years of prices, not uncertainty about how the
        market will behave next.
      </p>

      <h2>Third result: both volatility windows are wrong, in opposite situations</h2>
      <p>
        I had expected a 30-day window to lag behind the market and a 7-day window to do better. On the same opening
        dates, over the two years of hourly data, the two gave the same medians to within 0.02. As forecasts of the volatility of the following week, both
        miss by a factor of about 1.4 either way (root mean square, here with both windows measured from hourly
        moves), which is roughly a factor of two in E[T]. After
        volatility rises, the 7-day window overshoots the next week by about 45%, while the 30-day window is nearly right; part of that is probably a noisy
        estimate falling back after a jump, which I have not tested. After volatility falls, the 30-day
        window overshoots by about 30%. Averaging the two on a log scale had a slightly smaller error overall, but these forward weeks overlap and I
        attach no uncertainty to differences that small.
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
          last 120 days. On the 120 days of minute data, the Gaussian walk&rsquo;s own &plusmn;1% median varied from 0.62 to 1.00
          between seeds (10th to 90th percentile), so I draw no conclusions from the shorter window alone.
        </li>
        <li>
          Fees are not part of this. Whether fees in range scale with &sigma; / h, which is what would make the width
          cancel out of the economics, needs pool volume and liquidity by price level over time. I have not yet checked a free,
          reproducible source for that, so that half of the model is still unvalidated.
        </li>
      </ul>

      <h2>How it is built</h2>
      <p>
        The study is part of a TypeScript project for analysing concentrated-liquidity positions. The exit-time
        distribution and the correction are tested against values computed independently in Python and against seeded
        Monte Carlo simulations; a separate Python script, outside the repository, reproduced the medians to two decimals. Raw prices are
        cached locally and never committed, and everything in the repository is synthetic or public, so the whole result can be rerun from the repository.
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
