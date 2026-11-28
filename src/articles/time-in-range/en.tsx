import { formatter } from "@/lib/format";
import { BASIS, FORECAST, HOURLY, LAST_120_DAYS, MODEL, NARROW_EXCESS, REPO, REPORT, SURROGATES, VOLATILITY } from "./data";

const { n, pct } = formatter("en");
/** "1.15 (1.09–1.23)": a median with its 10th to 90th percentile. */
const band = ([median, low, high]: readonly [number, number, number]) => (
  <>
    {n(median, 2)} ({n(low, 2)}&ndash;{n(high, 2)})
  </>
);
const [narrow, , , wide] = HOURLY.rows;

export function TimeInRangeEn() {
  return (
    <>
      <p className="article-lead">
        In a concentrated-liquidity pool, you choose a price range. While the price stays inside it, the position earns
        fees; when the price leaves, it stops earning until you move the range, and moving it costs money. How long a
        range lasts is therefore one of the main numbers that decide whether a narrow range pays, next to the fee rate
        while it is in range. I tested the textbook formula for it against two years of public prices. It was wrong in
        a way that depended on the range&rsquo;s width, and a large part of the error I first saw came from how I was
        measuring.
      </p>

      <h2>The formula</h2>
      <p>
        If the log of the price moves like a random walk with volatility &sigma; and no drift, a position opened at the
        centre of a range of log half-width h is expected to stay in range for E[T] = h&sup2; / &sigma;&sup2;. Halve the
        width and the expected time in range drops to a quarter. The cost of re-centring per day is roughly the cost of
        one exit divided by E[T], so, to a first approximation, an error in E[T] is an error of the same size in the
        cost of running a range.
      </p>
      <p>
        The same model also gives the whole distribution of T, not only its mean. Measured in units of E[T], it is the
        same for every width and every &sigma;: the median is {n(MODEL.median, 3)}, about{" "}
        {pct(MODEL.exitedByQuarterPct)} of positions should be out by a quarter of E[T], and about{" "}
        {pct(MODEL.exitedByTwicePct)} by twice E[T]. That is what makes the model testable. Ranges of different widths,
        opened in different volatility regimes, should all line up on one curve.
      </p>

      <h2>The test</h2>
      <p>I tested it where anyone can rerun it: public prices and synthetic positions.</p>
      <ul className="article-list">
        <li>
          <strong>Prices:</strong> Coinbase public candles for BTC-USD and SOL-USD, divided to give SOL per BTC, from
          November 2024 to November 2026. Hourly closes for the full two years; minute closes for the last 120 days.
        </li>
        <li>
          <strong>Positions:</strong> once a day, a new position centred on the price, at &plusmn;1%, &plusmn;2%,
          &plusmn;4% and &plusmn;8%, followed until the first close at or beyond a bound.
        </li>
        <li>
          <strong>Volatility:</strong> known at the time of opening, from the daily closes of the previous 30 days, or
          from the samples of the previous 7 days.
        </li>
        <li>
          <strong>Censoring:</strong> at each horizon, only positions watched at least that long are counted, whether
          or not they exited.
        </li>
      </ul>

      <h2>First result: much of the error was the clock, not the market</h2>
      <p>
        On hourly closes, narrow ranges lasted far longer than predicted: at &plusmn;1% the median was{" "}
        {n(narrow.raw, 2)} times E[T], against {n(MODEL.median, 3)}. That looked like a finding about the market. A
        large part of it was a finding about the data. A price checked once an hour can leave the range and come back
        between two checks, and the exit is only seen when a close lands outside. The size of the error depends on how
        far the price typically moves between checks compared with the width of the range, so it is largest for narrow
        ranges.
      </p>
      <p>
        This is a known problem in pricing barrier options, with a known correction: a price checked every &Delta;t
        behaves like one checked continuously against a barrier about {n(MODEL.barrierShift, 2)} &middot; &sigma;{" "}
        &middot; &radic;&Delta;t further away (Broadie, Glasserman and Kou, 1997). Applying it moves the &plusmn;1%
        median from {n(narrow.raw, 2)} to {n(narrow.corrected, 2)}. The correction assumes the price moves little
        between checks compared with the width of the range, which is barely true for &plusmn;1% on hourly data, so the
        better evidence there is minute data. Over the last 120 days, with volatility from the previous 30 days, the
        &plusmn;1% median on minute closes was {n(LAST_120_DAYS.sigma30.minute, 2)}, against{" "}
        {n(LAST_120_DAYS.sigma30.hourly, 2)} on hourly closes of the same days. With volatility from the previous 7
        days the order reverses ({n(LAST_120_DAYS.sigma7.minute, 2)} on minute closes,{" "}
        {n(LAST_120_DAYS.sigma7.hourly, 2)} on hourly), probably because that estimator is built from minute returns in
        one case and hourly returns in the other; I have not tested that. It is one more reason not to lean on any
        single number here.
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
            {HOURLY.rows.map((row) => (
              <tr key={row.widthPct}>
                <td>&plusmn;{pct(row.widthPct)}</td>
                <td>{n(row.raw, 2)}</td>
                <td>{n(row.corrected, 2)}</td>
                <td>{n(MODEL.median, 3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        Median time in range as a multiple of E[T], two years of hourly closes, volatility from the 30 days before
        opening, {n(HOURLY.positionsPerWidth)} positions per width.
      </p>

      <h2>What is left after the correction</h2>
      <p>
        <strong>The error depends on width.</strong> Even with the measurement fixed, a &plusmn;1% range lasts{" "}
        {n(NARROW_EXCESS[0], 1)} to {n(NARROW_EXCESS[1], 1)} times longer than the model says at the median, with
        volatility from the previous 30 days. At &plusmn;8% the median came out on time or early, but as the next
        section shows, that difference is within the noise of the method itself.
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
              <td>{n(SURROGATES.real.narrow, 2)}</td>
              <td>{n(SURROGATES.real.wide, 2)}</td>
            </tr>
            <tr>
              <td>Signs randomised</td>
              <td>{band(SURROGATES.signs.narrow)}</td>
              <td>{band(SURROGATES.signs.wide)}</td>
            </tr>
            <tr>
              <td>Moves shuffled</td>
              <td>{band(SURROGATES.shuffled.narrow)}</td>
              <td>{band(SURROGATES.shuffled.wide)}</td>
            </tr>
            <tr>
              <td>Gaussian walk</td>
              <td>{band(SURROGATES.gaussian.narrow)}</td>
              <td>{band(SURROGATES.gaussian.wide)}</td>
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
        sizes of moves come close: shuffled, they give {n(SURROGATES.shuffled.narrow[0], 2)}; with random signs,{" "}
        {n(SURROGATES.signs.narrow[0], 2)} (or {n(SURROGATES.signsWithRealVolatility, 2)} when the altered paths use
        the volatility the real prices had on each date). Shuffling keeps how large the moves are; randomising signs
        also keeps when the large ones come. Which of the two does more, and whether the direction of moves adds
        anything, these runs do not separate: the ranges overlap, and at &plusmn;2% or on minute data the answer
        depends on how volatility is estimated on the altered paths. My reading, which I have not tested directly: most
        hours are calmer than the average volatility implies, so a narrow range opened in a calm hour lasts much longer
        than the formula says.
      </p>
      <p>
        At &plusmn;8%, the Gaussian walk&rsquo;s own median ranges from {n(SURROGATES.gaussian.wide[1], 2)} to{" "}
        {n(SURROGATES.gaussian.wide[2], 2)} between seeds, which holds both the model&rsquo;s {n(MODEL.median, 3)} and
        the {n(SURROGATES.real.wide, 2)} on real prices. So the median at that width is not evidence against the model.
        The tails are: on real prices, {pct(SURROGATES.wideTails.realEarlyPct)} of &plusmn;8% ranges were out within a
        quarter of E[T] and {pct(SURROGATES.wideTails.realLatePct)} were still in at twice E[T], against about{" "}
        {pct(SURROGATES.wideTails.gaussianPct)} for each on the Gaussian walk. The slow ones are consistent with bursts
        of volatility, though shuffled paths, which have none, come close too; what produces the extra early exits I
        have not identified.
      </p>
      <p>
        These ranges measure the noise of the method on the same two years of prices, not uncertainty about how the
        market will behave next.
      </p>

      <h2>Third result: both volatility windows are wrong, in opposite situations</h2>
      <p>
        I had expected a 30-day window to lag behind the market and a 7-day window to do better. On the same opening
        dates, over the two years of hourly data, the two gave the same medians to within{" "}
        {n(VOLATILITY.mediansWithin, 2)}. As forecasts of the volatility of the following week, both miss by a factor
        of about {n(VOLATILITY.missFactor, 1)} either way (root mean square, here with both windows measured from
        hourly moves), which is roughly a factor of two in E[T]. After volatility rises, the 7-day window overshoots
        the next week by about {pct(VOLATILITY.shortWindowOvershootPct)}, while the 30-day window is nearly right; part
        of that is probably a noisy estimate falling back after a jump, which I have not tested. After volatility
        falls, the 30-day window overshoots by about {pct(VOLATILITY.longWindowOvershootPct)}. Averaging the two on a
        log scale had a slightly smaller error overall, but these forward weeks overlap and I attach no uncertainty to
        differences that small.
      </p>

      <h2>Fourth result: measured quantiles forecast better than the model&rsquo;s</h2>
      <p>
        If the formula&rsquo;s distribution cannot be trusted, what can be used instead? I split the two years in time,
        measured on one side how long ranges lasted as a multiple of E[T], and used those quantiles to forecast the
        other side, in both directions. The model&rsquo;s own quantiles were miscalibrated out of sample: at &plusmn;1%,
        only {n(FORECAST.exitedByModelMedianPct[0])} to {pct(FORECAST.exitedByModelMedianPct[1])} of positions had
        exited by the model&rsquo;s median, and {n(FORECAST.exitedByModelP90Pct[0])} to{" "}
        {pct(FORECAST.exitedByModelP90Pct[1])} by its 90th percentile. Quantiles measured on the other side of the
        split came within five percentage points of the 10%, 50% and 90% targets at &plusmn;1% to &plusmn;4%. At
        &plusmn;8% the 90th percentile missed in both directions.
      </p>
      <p>
        The practical version: keep E[T] as the unit, and read the multiple off past data instead of off the
        model&rsquo;s distribution. That is one pair over two years, split in two, for positions opened at the centre
        of their range, and it says nothing about fees.
      </p>

      <h2>What I would not conclude from this</h2>
      <ul className="article-list">
        <li>
          Positions opened on consecutive days overlap in time, so they are not independent. I report no confidence
          intervals, and differences of a few hundredths mean nothing.
        </li>
        <li>
          This is one pair, on one exchange. A pool&rsquo;s own price can differ from an exchange&rsquo;s, most of all
          over minutes. The project now compares the two on its own hourly snapshots of the public pools. At the first
          reading, the deepest pool was {n(BASIS.deepestPoolBp, 1)} basis points above the exchange price, part of that
          from the lag of up to a minute between the two, while thin pools of the same pair sat up to{" "}
          {n(BASIS.thinPoolsUpToBp)} basis points away. One reading says nothing about how that difference moves
          between observations, which is what would change exit times; that takes weeks of snapshots.
        </li>
        <li>
          Results depend on the period: at &plusmn;8% the corrected median was {n(wide.corrected, 2)} over two years
          and {n(LAST_120_DAYS.wideCorrected, 2)} over the last 120 days. On the 120 days of minute data, the Gaussian
          walk&rsquo;s own &plusmn;1% median varied from {n(LAST_120_DAYS.gaussianNarrow[0], 2)} to{" "}
          {n(LAST_120_DAYS.gaussianNarrow[1], 2)} between seeds (10th to 90th percentile), so I draw no conclusions
          from the shorter window alone.
        </li>
        <li>
          Fees are not part of this. Whether fees in range scale with &sigma; / h, which is what would make the width
          cancel out of the economics, is still unvalidated. I first assumed that checking it needed liquidity by price
          level over time. It does not: the fees of a position centred in its range follow from the pool&rsquo;s
          cumulative fee growth alone. The project has taken hourly snapshots of the public pools since 27 November
          2026, and that study waits for enough data.
        </li>
      </ul>

      <h2>How it is built</h2>
      <p>
        The study is part of a TypeScript project for analysing concentrated-liquidity positions. The exit-time
        distribution and the correction are tested against values computed independently in Python and against seeded
        Monte Carlo simulations; a separate Python script, outside the repository, reproduced the medians to two
        decimals. Raw prices are cached locally and never committed, and everything in the repository is synthetic or
        public, so the whole result can be rerun from the repository.
      </p>
      <p>
        The practical lesson is older than this project: when a model and the data disagree, check the measurement
        before blaming the model. Here the measurement accounted for a large part of the gap, and what remained was
        more interesting than what I started with.
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
    </>
  );
}
