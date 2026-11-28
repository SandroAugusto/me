import { formatter } from "@/lib/format";
import { BASIS, FORECAST, HOURLY, LAST_120_DAYS, MODEL, NARROW_EXCESS, REPO, REPORT, SURROGATES, VOLATILITY } from "./data";

const { n, pct } = formatter("pt");
/** "1,15 (1,09–1,23)": mediana com o intervalo do 10º ao 90º percentil. */
const band = ([median, low, high]: readonly [number, number, number]) => (
  <>
    {n(median, 2)} ({n(low, 2)}&ndash;{n(high, 2)})
  </>
);
const [narrow, , , wide] = HOURLY.rows;

export function TimeInRangePt() {
  return (
    <>
      <p className="article-lead">
        Em uma pool de liquidez concentrada, você escolhe uma faixa de preço. Enquanto o preço fica dentro dela, a
        posição rende taxas; quando o preço sai, ela para de render até você mover a faixa, e mover custa dinheiro.
        Quanto tempo uma faixa dura é, portanto, um dos principais números que decidem se uma faixa estreita compensa,
        ao lado da taxa recebida enquanto ela está ativa. Testei a fórmula de livro-texto para esse tempo contra dois
        anos de preços públicos. Ela errou de um jeito que dependia da largura da faixa, e boa parte do erro que vi de
        início vinha de como eu estava medindo.
      </p>

      <h2>A fórmula</h2>
      <p>
        Se o logaritmo do preço se move como um passeio aleatório com volatilidade &sigma; e sem tendência, espera-se
        que uma posição aberta no centro de uma faixa de meia-largura logarítmica h fique dentro da faixa por E[T] =
        h&sup2; / &sigma;&sup2;. Reduza a largura à metade e o tempo esperado cai para um quarto. O custo diário de
        recentralizar é aproximadamente o custo de uma saída dividido por E[T]; assim, em primeira aproximação, um
        erro em E[T] é um erro do mesmo tamanho no custo de manter uma faixa.
      </p>
      <p>
        O mesmo modelo dá a distribuição inteira de T, não só a média. Medida em unidades de E[T], ela é a mesma para
        qualquer largura e qualquer &sigma;: a mediana é {n(MODEL.median, 3)}, cerca de{" "}
        {pct(MODEL.exitedByQuarterPct)} das posições devem ter saído até um quarto de E[T] e cerca de{" "}
        {pct(MODEL.exitedByTwicePct)} até duas vezes E[T]. É isso que torna o modelo testável. Faixas de larguras
        diferentes, abertas em regimes de volatilidade diferentes, deveriam cair todas sobre a mesma curva.
      </p>

      <h2>O teste</h2>
      <p>Testei onde qualquer pessoa consegue repetir: preços públicos e posições sintéticas.</p>
      <ul className="article-list">
        <li>
          <strong>Preços:</strong> candles públicos da Coinbase para BTC-USD e SOL-USD, divididos para dar SOL por BTC,
          de novembro de 2024 a novembro de 2026. Fechamentos horários nos dois anos; fechamentos por minuto nos
          últimos 120 dias.
        </li>
        <li>
          <strong>Posições:</strong> uma vez por dia, uma posição nova centrada no preço, com &plusmn;1%, &plusmn;2%,
          &plusmn;4% e &plusmn;8%, acompanhada até o primeiro fechamento em um dos limites ou além dele.
        </li>
        <li>
          <strong>Volatilidade:</strong> conhecida no momento da abertura, a partir dos fechamentos diários dos 30 dias
          anteriores ou das amostras dos 7 dias anteriores.
        </li>
        <li>
          <strong>Censura:</strong> em cada horizonte, só entram as posições observadas por pelo menos esse tempo,
          tenham saído ou não.
        </li>
      </ul>

      <h2>Primeiro resultado: boa parte do erro era o relógio, não o mercado</h2>
      <p>
        Em fechamentos horários, as faixas estreitas duraram muito mais do que o previsto: com &plusmn;1% a mediana foi{" "}
        {n(narrow.raw, 2)} vezes E[T], contra {n(MODEL.median, 3)}. Parecia uma descoberta sobre o mercado. Boa parte
        era uma descoberta sobre os dados. Um preço conferido uma vez por hora pode sair da faixa e voltar entre duas
        conferências, e a saída só é vista quando um fechamento cai fora. O tamanho do erro depende de quanto o preço
        costuma se mover entre conferências em comparação com a largura da faixa, e por isso é maior nas faixas
        estreitas.
      </p>
      <p>
        É um problema conhecido na precificação de opções com barreira, com uma correção conhecida: um preço conferido
        a cada &Delta;t se comporta como um preço monitorado continuamente contra uma barreira cerca de{" "}
        {n(MODEL.barrierShift, 2)} &middot; &sigma; &middot; &radic;&Delta;t mais distante (Broadie, Glasserman e Kou,
        1997). Aplicada, ela leva a mediana de &plusmn;1% de {n(narrow.raw, 2)} para {n(narrow.corrected, 2)}. A
        correção supõe que o preço se move pouco entre conferências em relação à largura da faixa, o que mal vale para
        &plusmn;1% em dados horários; ali a melhor evidência são os dados por minuto. Nos últimos 120 dias, com a
        volatilidade dos 30 dias anteriores, a mediana de &plusmn;1% em fechamentos por minuto foi{" "}
        {n(LAST_120_DAYS.sigma30.minute, 2)}, contra {n(LAST_120_DAYS.sigma30.hourly, 2)} em fechamentos horários dos
        mesmos dias. Com a volatilidade dos 7 dias anteriores a ordem se inverte ({n(LAST_120_DAYS.sigma7.minute, 2)}{" "}
        por minuto, {n(LAST_120_DAYS.sigma7.hourly, 2)} por hora), provavelmente porque esse estimador é construído com
        retornos por minuto em um caso e horários no outro; não testei isso. É mais um motivo para não se apoiar em
        nenhum número isolado aqui.
      </p>
      <div className="article-table">
        <table>
          <thead>
            <tr>
              <th>Faixa</th>
              <th>Horário, bruto</th>
              <th>Horário, corrigido</th>
              <th>Modelo</th>
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
        Mediana do tempo dentro da faixa como múltiplo de E[T], dois anos de fechamentos horários, volatilidade dos 30
        dias anteriores à abertura, {n(HOURLY.positionsPerWidth)} posições por largura.
      </p>

      <h2>O que sobra depois da correção</h2>
      <p>
        <strong>O erro depende da largura.</strong> Mesmo com a medição corrigida, uma faixa de &plusmn;1% dura de{" "}
        {n(NARROW_EXCESS[0], 1)} a {n(NARROW_EXCESS[1], 1)} vezes mais do que o modelo diz na mediana, com a
        volatilidade dos 30 dias anteriores. Com &plusmn;8% a mediana saiu no tempo previsto ou antes, mas, como a
        próxima seção mostra, essa diferença está dentro do ruído do próprio método.
      </p>

      <h2>Segundo resultado: o mundo do próprio modelo não reproduz isso</h2>
      <p>
        Para descobrir por que as faixas estreitas duram demais, reconstruí os dois anos de preços de três maneiras
        alteradas e rodei o estudo de novo em cada uma, quarenta vezes com sementes aleatórias diferentes:
      </p>
      <ul className="article-list">
        <li>
          <strong>Sinais aleatorizados:</strong> cada movimento horário mantém o tamanho e o lugar no tempo, mas sobe ou
          desce ao acaso. Os movimentos grandes continuam vindo em rajadas; qualquer tendência a reverter ou a seguir
          desaparece.
        </li>
        <li>
          <strong>Movimentos embaralhados:</strong> os mesmos movimentos horários em ordem aleatória. Os tamanhos são
          mantidos, as rajadas não.
        </li>
        <li>
          <strong>Um passeio aleatório gaussiano</strong> com a mesma volatilidade média: o mundo do próprio modelo.
        </li>
      </ul>
      <div className="article-table">
        <table>
          <thead>
            <tr>
              <th>Trajetória</th>
              <th>&plusmn;1%</th>
              <th>&plusmn;8%</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Preços reais</td>
              <td>{n(SURROGATES.real.narrow, 2)}</td>
              <td>{n(SURROGATES.real.wide, 2)}</td>
            </tr>
            <tr>
              <td>Sinais aleatorizados</td>
              <td>{band(SURROGATES.signs.narrow)}</td>
              <td>{band(SURROGATES.signs.wide)}</td>
            </tr>
            <tr>
              <td>Movimentos embaralhados</td>
              <td>{band(SURROGATES.shuffled.narrow)}</td>
              <td>{band(SURROGATES.shuffled.wide)}</td>
            </tr>
            <tr>
              <td>Passeio gaussiano</td>
              <td>{band(SURROGATES.gaussian.narrow)}</td>
              <td>{band(SURROGATES.gaussian.wide)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Mediana do tempo dentro da faixa como múltiplo de E[T], corrigida para conferências horárias, com a
        volatilidade reestimada em cada trajetória da mesma forma. Para as trajetórias alteradas: a mediana de quarenta
        execuções, com o intervalo do 10º ao 90º percentil entre parênteses.
      </p>
      <p>
        Com &plusmn;1%, o passeio gaussiano cai perto do modelo e os preços reais não. As trajetórias que mantêm os
        tamanhos reais dos movimentos chegam perto: embaralhadas, dão {n(SURROGATES.shuffled.narrow[0], 2)}; com sinais
        aleatórios, {n(SURROGATES.signs.narrow[0], 2)} (ou {n(SURROGATES.signsWithRealVolatility, 2)} quando as
        trajetórias alteradas usam a volatilidade que os preços reais tinham em cada data). Embaralhar mantém o tamanho
        dos movimentos; aleatorizar os sinais mantém também o momento em que os grandes acontecem. Qual dos dois pesa
        mais, e se a direção dos movimentos acrescenta algo, essas execuções não separam: os intervalos se sobrepõem, e
        com &plusmn;2% ou em dados por minuto a resposta depende de como a volatilidade é estimada nas trajetórias
        alteradas. Minha leitura, que não testei diretamente: a maioria das horas é mais calma do que a volatilidade
        média sugere, então uma faixa estreita aberta em uma hora calma dura muito mais do que a fórmula diz.
      </p>
      <p>
        Com &plusmn;8%, a mediana do próprio passeio gaussiano vai de {n(SURROGATES.gaussian.wide[1], 2)} a{" "}
        {n(SURROGATES.gaussian.wide[2], 2)} entre sementes, intervalo que contém tanto o {n(MODEL.median, 3)} do modelo
        quanto o {n(SURROGATES.real.wide, 2)} dos preços reais. Logo, a mediana nessa largura não é evidência contra o
        modelo. As caudas são: nos preços reais, {pct(SURROGATES.wideTails.realEarlyPct)} das faixas de &plusmn;8%
        tinham saído em até um quarto de E[T] e {pct(SURROGATES.wideTails.realLatePct)} ainda estavam dentro em duas
        vezes E[T], contra cerca de {pct(SURROGATES.wideTails.gaussianPct)} em cada caso no passeio gaussiano. As
        lentas são compatíveis com rajadas de volatilidade, embora as trajetórias embaralhadas, que não têm rajadas,
        também cheguem perto; o que produz as saídas precoces a mais eu não identifiquei.
      </p>
      <p>
        Esses intervalos medem o ruído do método sobre os mesmos dois anos de preços, não a incerteza sobre como o
        mercado vai se comportar daqui para a frente.
      </p>

      <h2>Terceiro resultado: as duas janelas de volatilidade erram, em situações opostas</h2>
      <p>
        Eu esperava que uma janela de 30 dias ficasse atrás do mercado e que uma de 7 dias se saísse melhor. Nas mesmas
        datas de abertura, ao longo dos dois anos de dados horários, as duas deram as mesmas medianas com diferença de
        até {n(VOLATILITY.mediansWithin, 2)}. Como previsões da volatilidade da semana seguinte, ambas erram por um
        fator de cerca de {n(VOLATILITY.missFactor, 1)} para cima ou para baixo (raiz do erro quadrático médio, aqui
        com as duas janelas medidas a partir de movimentos horários), o que dá aproximadamente um fator de dois em
        E[T]. Depois que a volatilidade sobe, a janela de 7 dias superestima a semana seguinte em cerca de{" "}
        {pct(VOLATILITY.shortWindowOvershootPct)}, enquanto a de 30 dias fica quase certa; parte disso é provavelmente
        uma estimativa ruidosa recuando depois de um salto, o que não testei. Depois que a volatilidade cai, a janela
        de 30 dias superestima em cerca de {pct(VOLATILITY.longWindowOvershootPct)}. A média das duas em escala
        logarítmica teve um erro geral um pouco menor, mas essas semanas futuras se sobrepõem e não atribuo incerteza a
        diferenças tão pequenas.
      </p>

      <h2>Quarto resultado: quantis medidos preveem melhor do que os do modelo</h2>
      <p>
        Se a distribuição da fórmula não é confiável, o que usar no lugar? Dividi os dois anos no tempo, medi de um
        lado quanto as faixas duraram como múltiplo de E[T] e usei esses quantis para prever o outro lado, nos dois
        sentidos. Os quantis do próprio modelo ficaram descalibrados fora da amostra: com &plusmn;1%, só{" "}
        {n(FORECAST.exitedByModelMedianPct[0])} a {pct(FORECAST.exitedByModelMedianPct[1])} das posições tinham saído
        até a mediana do modelo, e {n(FORECAST.exitedByModelP90Pct[0])} a {pct(FORECAST.exitedByModelP90Pct[1])} até o
        seu 90º percentil. Os quantis medidos do outro lado da divisão ficaram a até cinco pontos percentuais dos alvos
        de 10%, 50% e 90% de &plusmn;1% a &plusmn;4%. Com &plusmn;8%, o 90º percentil errou nos dois sentidos.
      </p>
      <p>
        A versão prática: mantenha E[T] como unidade e leia o múltiplo em dados passados, não na distribuição do
        modelo. Isso vale para um par em dois anos, divididos em dois, para posições abertas no centro da faixa, e não
        diz nada sobre taxas.
      </p>

      <h2>O que eu não concluiria a partir disso</h2>
      <ul className="article-list">
        <li>
          Posições abertas em dias consecutivos se sobrepõem no tempo, então não são independentes. Não reporto
          intervalos de confiança, e diferenças de poucos centésimos não significam nada.
        </li>
        <li>
          É um par, em uma exchange. O preço de uma pool pode diferir do preço de uma exchange, sobretudo na escala de
          minutos. O projeto agora compara os dois nos seus próprios snapshots horários das pools públicas. Na primeira
          leitura, a pool mais profunda estava {n(BASIS.deepestPoolBp, 1)} pontos-base acima do preço da exchange,
          parte disso pela defasagem de até um minuto entre os dois, enquanto pools rasas do mesmo par ficavam a até{" "}
          {n(BASIS.thinPoolsUpToBp)} pontos-base de distância. Uma leitura não diz nada sobre como essa diferença se
          move entre observações, que é o que mudaria os tempos de saída; isso exige semanas de snapshots.
        </li>
        <li>
          Os resultados dependem do período: com &plusmn;8% a mediana corrigida foi {n(wide.corrected, 2)} em dois anos
          e {n(LAST_120_DAYS.wideCorrected, 2)} nos últimos 120 dias. Nos 120 dias de dados por minuto, a mediana de
          &plusmn;1% do próprio passeio gaussiano variou de {n(LAST_120_DAYS.gaussianNarrow[0], 2)} a{" "}
          {n(LAST_120_DAYS.gaussianNarrow[1], 2)} entre sementes (10º ao 90º percentil), então não tiro conclusões só
          da janela mais curta.
        </li>
        <li>
          Taxas não fazem parte disto. Se as taxas dentro da faixa escalam com &sigma; / h, que é o que faria a largura
          se cancelar na conta econômica, continua sem validação. De início supus que verificar isso exigia a liquidez
          por nível de preço ao longo do tempo. Não exige: as taxas de uma posição centrada na faixa decorrem apenas do
          crescimento acumulado de taxas da pool. O projeto coleta snapshots horários das pools públicas desde 27 de
          novembro de 2026, e esse estudo aguarda dados suficientes.
        </li>
      </ul>

      <h2>Como foi construído</h2>
      <p>
        O estudo faz parte de um projeto em TypeScript para analisar posições de liquidez concentrada. A distribuição
        do tempo de saída e a correção são testadas contra valores calculados de forma independente em Python e contra
        simulações de Monte Carlo com semente fixa; um script Python separado, fora do repositório, reproduziu as
        medianas com duas casas decimais. Os preços brutos ficam em cache local e nunca são commitados, e tudo no
        repositório é sintético ou público, de modo que o resultado inteiro pode ser refeito a partir do repositório.
      </p>
      <p>
        A lição prática é mais antiga do que este projeto: quando um modelo e os dados discordam, confira a medição
        antes de culpar o modelo. Aqui a medição respondia por boa parte da diferença, e o que sobrou era mais
        interessante do que aquilo com que comecei.
      </p>
      <p>
        Código, testes e as tabelas completas estão no{" "}
        <a href={REPO} target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        , com o método e todas as tabelas no{" "}
        <a href={REPORT} target="_blank" rel="noopener noreferrer">
          relatório de pesquisa
        </a>{" "}
        (em inglês).
      </p>
    </>
  );
}
