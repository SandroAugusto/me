import { formatter } from "@/lib/format";
import {
  CROSS_ENCODER,
  JUDGE_ON_PAIRS,
  OTHER_EMBEDDING_MODELS,
  PAIRS,
  PER_THOUSAND,
  REPO,
  THRESHOLD_ONLY,
  TRACK_A,
  WRONG_SHARE_AT_25,
} from "./data";

const { n, pct } = formatter("pt");

export function SemanticCachePt() {
  return (
    <>
      <p className="article-lead">
        Um cache semântico reaproveita uma resposta anterior de um LLM quando uma pergunta nova está &ldquo;perto o
        bastante&rdquo; de outra que ele já viu. Medi com que frequência &ldquo;perto o bastante&rdquo; devolve a
        resposta de uma pergunta diferente. A versão curta: nas configurações que testei, ajustar o limiar de
        similaridade não tornou o cache seguro sem abrir mão da maior parte da economia, e a segunda correção, um juiz
        LLM, pareceu perfeita no meu próprio conjunto de teste e bem mais fraca em perguntas reais.
      </p>

      <h2>Por que isso importa</h2>
      <p>
        Cache semântico é um dos padrões usuais em um gateway de LLM, ao lado de roteamento de modelos e limiares de
        confiança. O atrativo é óbvio: um acerto de cache não custa nenhuma chamada ao modelo. O modo de falha é menos
        óbvio. Um erro de cache custa dinheiro; um falso acerto devolve uma resposta segura e bem escrita para uma
        pergunta que ninguém fez. Em um domínio como ensaios clínicos, &ldquo;quais são os critérios de
        inclusão?&rdquo; e &ldquo;quais são os critérios de exclusão?&rdquo; nunca deveriam compartilhar uma resposta.
      </p>
      <p>
        Minha hipótese era que perguntas sobre o mesmo assunto com significado diferente ficam tão próximas no espaço
        de embeddings quanto paráfrases verdadeiras. Se isso vale, nenhum limiar consegue separá-las.
      </p>

      <h2>Experimento 1: só o limiar</h2>
      <p>
        Escrevi {n(PAIRS.total)} pares de perguntas sobre ensaios clínicos: {n(PAIRS.paraphrases)} paráfrases que
        deveriam compartilhar uma resposta, {n(PAIRS.hardNegatives)} &ldquo;negativos difíceis&rdquo; que mudam uma
        coisa só (um antônimo, uma negação, uma entidade, um número, o escopo ou quem age sobre quem) e{" "}
        {n(PAIRS.unrelated)} pares sem relação. Gerei os embeddings com <code>nomic-embed-text</code> e variei o limiar
        de {n(THRESHOLD_ONLY.sweep[0], 2)} a {n(THRESHOLD_ONLY.sweep[1], 2)}.
      </p>
      <p>
        A hipótese era otimista demais. Os negativos difíceis não estavam tão próximos quanto as paráfrases; estavam{" "}
        <strong>mais próximos</strong>. As paráfrases tiveram similaridade de cosseno média de{" "}
        {n(THRESHOLD_ONLY.paraphraseMean, 3)}; todas as categorias de negativos difíceis tiveram média entre{" "}
        {n(THRESHOLD_ONLY.hardNegativeCategoryMeans[0], 2)} e {n(THRESHOLD_ONLY.hardNegativeCategoryMeans[1], 2)}.
        &ldquo;O patrocinador paga o participante?&rdquo; e &ldquo;O participante paga o patrocinador?&rdquo; (as
        perguntas do conjunto são em inglês) marcaram {n(THRESHOLD_ONLY.roleSwapSimilarity, 3)}.
      </p>
      <p>
        Isso transforma o limiar em uma armadilha. Subir o limiar remove acertos bons antes de remover os ruins. O
        menor limiar que bloqueou todos os negativos difíceis ficou acima de {n(THRESHOLD_ONLY.safeThresholdAbove, 2)}{" "}
        nas três configurações de embedding, e nesse ponto o cache reaproveitava{" "}
        {pct(THRESHOLD_ONLY.paraphrasesReusedAtSafePct)} das paráfrases. Não é um problema de calibração; é uma
        propriedade do que os embeddings capturam. Eles são bons em assunto e fracos nos pequenos detalhes que mudam
        uma resposta.
      </p>
      <p>
        Também não é uma propriedade de um modelo só. Repeti a varredura com o <code>mxbai-embed-large</code> e com o{" "}
        <code>bge-m3</code>, multilíngue. Nos dois, todas as categorias de negativos difíceis tiveram média maior do que
        a das paráfrases (
        {OTHER_EMBEDDING_MODELS.map((m, i) => (
          <span key={m.model}>
            {i > 0 ? "; " : ""}
            {n(m.hardNegativeCategoryMeans[0], 3)} a {n(m.hardNegativeCategoryMeans[1], 3)} contra{" "}
            {n(m.paraphraseMean, 3)}
          </span>
        ))}
        ), e o limiar que bloqueou todos os negativos difíceis não reaproveitou nenhuma paráfrase.
      </p>

      <h2>Experimento 2: acrescentando um juiz LLM</h2>
      <p>
        O passo natural seguinte é deixar o limiar propor um candidato e perguntar a um modelo local pequeno se uma
        única resposta serve para as duas perguntas. Com um limiar permissivo de {n(JUDGE_ON_PAIRS.threshold, 2)}, o{" "}
        <code>qwen2.5:7b</code> manteve todas as paráfrases e rejeitou os {n(JUDGE_ON_PAIRS.rejectedGuided)} negativos
        difíceis com um prompt guiado ({n(JUDGE_ON_PAIRS.rejectedPlain)} de {n(PAIRS.hardNegatives)} com um prompt
        simples).
      </p>
      <figure className="article-figure">
        <img
          src="/writing/semantic-cache-tradeoff.svg"
          alt="Gráfico de paráfrases reaproveitadas contra negativos difíceis aceitos. A linha só com limiar nunca chega ao canto seguro; limiar mais um juiz LLM chega."
          width={760}
          height={500}
        />
        <figcaption>
          Paráfrases reaproveitadas contra negativos difíceis aceitos, só com limiar e com limiar mais um juiz (rótulos
          do gráfico em inglês).
        </figcaption>
      </figure>
      <p>
        Dois resultados dessa rodada moldaram a forma como avalio tudo o que veio depois. Primeiro, o{" "}
        <code>llama3.2:3b</code> respondeu &ldquo;diferente&rdquo; para todos os pares: zero respostas erradas e zero
        economia. Qualquer avaliação que reportasse só a segurança o chamaria de perfeito; por isso economia e erros
        têm de ser reportados sempre juntos. Segundo, 0 erros em {n(PAIRS.hardNegatives)} negativos difíceis ainda é
        compatível com uma taxa de erro verdadeira de cerca de {pct(JUDGE_ON_PAIRS.ruleOfThreePct)}, com 95% de
        confiança. Um resultado limpo em um conjunto pequeno é um sinal, não uma garantia.
      </p>
      <p>
        Também perguntei duas vezes a cada juiz, com as duas perguntas trocadas de lugar. Um juiz que decide pelo
        significado não deveria se importar com a ordem. O juiz 3B mudou de resposta em{" "}
        {n(JUDGE_ON_PAIRS.flippedByOrder.small)} dos {n(PAIRS.total)} pares, todos paráfrases. O juiz 7B mudou em{" "}
        {n(JUDGE_ON_PAIRS.flippedByOrder.large)}, e esse par era o seu único erro: exigir que as duas ordens concordem
        eliminou o erro, ao custo do dobro de chamadas. O custo fica fácil de expressar como ponto de equilíbrio. Com
        esse limiar, o juiz 7B só economizou tempo quando a resposta que ele substituía levava mais de cerca de{" "}
        {n(JUDGE_ON_PAIRS.breakEvenSeconds.oneOrder[0], 1)} a {n(JUDGE_ON_PAIRS.breakEvenSeconds.oneOrder[1], 1)}{" "}
        segundos para ser gerada, ou {n(JUDGE_ON_PAIRS.breakEvenSeconds.bothOrders, 1)} segundos quando perguntado nas
        duas ordens.
      </p>

      <h2>Track A: perguntas reais contra um cache inteiro</h2>
      <p>
        Meus pares foram escritos trocando uma palavra, exatamente o tipo de diferença que um LLM percebe com
        facilidade. Então refiz a ideia com perguntas reais de pacientes, do conjunto Medical Question Pairs (McCreery
        et al., KDD 2020): {n(TRACK_A.questions)} perguntas, cada uma com uma reescrita feita por um médico que mantém
        a intenção e uma pergunta relacionada, com palavras-chave parecidas e resposta diferente. As{" "}
        {n(TRACK_A.questions)} originais foram para o cache, e {n(TRACK_A.sampledPerKind)} reescritas mais{" "}
        {n(TRACK_A.sampledPerKind)} perguntas relacionadas buscaram no cache inteiro, como fariam em produção.
      </p>
      <p>Três coisas mudaram:</p>
      <ul className="article-list">
        <li>
          <strong>Perguntas reais se separam melhor, mas não o suficiente.</strong> Com limiar de{" "}
          {n(TRACK_A.wrongAtThreshold.threshold, 2)}, o cache ainda serviu uma resposta errada para{" "}
          {pct(TRACK_A.wrongAtThreshold.relatedServedPct)} das perguntas relacionadas. Para ficar abaixo de 1% foi
          preciso um limiar de {n(TRACK_A.onePercent.threshold, 3)}, que reaproveitou só{" "}
          {pct(TRACK_A.onePercent.rewritesReusedPct, 1)} das reescritas.
        </li>
        <li>
          <strong>Um cache inteiro acrescenta erros próprios.</strong> Mesmo sem tráfego capcioso,{" "}
          {pct(TRACK_A.otherOriginal.pct, 1)} das reescritas casaram com uma pergunta diferente do cache em limiares de
          até {n(TRACK_A.otherOriginal.upTo, 2)}. Testar pares isolados esconde isso por completo.
        </li>
        <li>
          <strong>O juiz foi bem mais fraco.</strong> O <code>qwen2.5:3b</code> deixou passar{" "}
          {pct(TRACK_A.smallJudge.relatedAcceptedPct, 1)} das perguntas relacionadas (contra 0 de{" "}
          {n(PAIRS.hardNegatives)} no Experimento 2) e rejeitou um terço das reescritas válidas. Um juiz maior, o{" "}
          <code>qwen2.5:7b</code>, foi mais leniente em vez de mais preciso, a{" "}
          {n(TRACK_A.largeJudge.secondsPerQuery, 1)} segundos por consulta em CPU (p95 de{" "}
          {n(TRACK_A.largeJudge.p95Seconds, 1)} segundos).
        </li>
      </ul>
      <p>
        A forma útil de comparar políticas acabou sendo respostas erradas e respostas economizadas a cada {n(1000)}{" "}
        consultas que têm uma pergunta próxima no cache, para diferentes proporções de perguntas relacionadas no
        tráfego:
      </p>
      <div className="article-table">
        <table>
          <thead>
            <tr>
              <th>Política</th>
              {PER_THOUSAND.relatedSharesPct.map((share) => (
                <th key={share}>{pct(share)} relacionadas</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PER_THOUSAND.policies.map((policy) => (
              <tr key={policy.id}>
                <td>
                  {policy.judge === null
                    ? `limiar ${n(policy.threshold, 2)}`
                    : `${n(policy.threshold, 2)} + juiz ${policy.judge}`}
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
        O juiz 3B economiza mais do que um limiar de {n(0.85, 2)}, mas também serve mais respostas erradas, e
        acrescenta cerca de {n(TRACK_A.smallJudge.secondsPerQuery, 1)} segundos por consulta em CPU. Ele se desloca ao
        longo da mesma curva de compromisso em vez de escapar dela. A conclusão honesta é que o Experimento 2
        superestimou o juiz: negativos difíceis escritos à mão, de uma palavra só, são fáceis; quase-acertos reais não
        são.
      </p>
      <p>
        A mesma tabela se lê de outro jeito quando vista como a proporção dos acertos servidos que estão errados, que é
        o que o usuário de fato experimenta. Com 25% de tráfego relacionado, são{" "}
        {pct(WRONG_SHARE_AT_25.threshold085, 1)} para o limiar de {n(0.85, 2)}, {pct(WRONG_SHARE_AT_25.judge3b, 1)}{" "}
        para o juiz 3B, e {pct(WRONG_SHARE_AT_25.threshold080, 1)} e {pct(WRONG_SHARE_AT_25.judge7b, 1)} para o limiar
        de {n(0.8, 2)} e o juiz 7B. Com 50% de tráfego relacionado, todas as políticas servem uma resposta errada em
        cerca de um a cada dez acertos, ou mais.
      </p>
      <p>
        Uma ressalva vale para todos os números do Track A. O conjunto de dados rotula cada pergunta apenas em relação
        à sua própria original, então um acerto em uma pergunta <em>diferente</em> do cache é contado como errado sem
        que haja um rótulo dizendo isso. Os números de respostas erradas são, portanto, um limite superior, e os de
        respostas economizadas, um limite inferior. Esses acertos agora são exportados para rotulagem manual, e este
        artigo será atualizado com os números corrigidos.
      </p>

      <h2>Um modelo treinado para a tarefa não ajudou</h2>
      <p>
        A objeção óbvia a um juiz LLM é que um modelo treinado para decidir se duas perguntas são equivalentes deveria
        fazer isso melhor e por muito menos. Testei um: um cross-encoder treinado com perguntas duplicadas (
        <code>{CROSS_ENCODER.model}</code>). Nos meus pares escritos à mão ele foi pior do que qualquer juiz que
        funcionou: com limiar de pontuação de {n(CROSS_ENCODER.onPairs.threshold, 2)}, reaproveitou{" "}
        {pct(CROSS_ENCODER.onPairs.paraphrasesReusedPct)} das paráfrases e ainda aceitou{" "}
        {pct(CROSS_ENCODER.onPairs.hardNegativesAcceptedPct)} dos negativos difíceis. Nas perguntas reais, comparado
        par a par com o limiar de similaridade simples, na mesma proporção de perguntas relacionadas aceitas, ele
        reaproveitou menos reescritas:
      </p>
      <div className="article-table">
        <table>
          <thead>
            <tr>
              <th>Política</th>
              <th>Relacionadas aceitas</th>
              <th>Reescritas reaproveitadas</th>
            </tr>
          </thead>
          <tbody>
            {CROSS_ENCODER.matched.map((row) => (
              <tr key={row.id}>
                <td>
                  {row.cosine ? "limiar de similaridade" : "cross-encoder"} {n(row.threshold, 2)}
                </td>
                <td>{pct(row.relatedAcceptedPct, 1)}</td>
                <td>{pct(row.rewritesReusedPct, 1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        Ele é barato, cerca de {n(CROSS_ENCODER.millisecondsPerPair)} milissegundos por par em CPU, mas fica abaixo do
        limiar que deveria melhorar. É um modelo só, treinado com perguntas gerais e usado em perguntas médicas, então
        isso não mostra que nenhum modelo desse tipo funcionaria. Mostra que &ldquo;use um modelo treinado para
        equivalência&rdquo; não é uma correção automática, e que ele precisa ser medido nas suas próprias perguntas,
        como todo o resto aqui.
      </p>

      <h2>O que eu faria ao projetar um cache semântico</h2>
      <ul className="article-list">
        <li>
          <strong>Comece por um orçamento de respostas erradas, não por um limiar.</strong> Decida quantas respostas
          erradas a cada {n(1000)} consultas o produto tolera e então escolha a política que mais economiza dentro
          desse orçamento. Um padrão como {n(0.75, 2)} não diz nada sobre nenhum dos dois números.
        </li>
        <li>
          <strong>Avalie contra o cache inteiro, com quase-acertos reais.</strong> Testes com pares não veem colisões
          entre vizinhos, e negativos escritos à mão favorecem qualquer juiz.
        </li>
        <li>
          <strong>Reporte economia e erros lado a lado,</strong> em função da composição do tráfego, porque a política
          certa muda conforme a frequência com que chegam perguntas relacionadas, mas diferentes. Só o tráfego de
          produção responde isso.
        </li>
        <li>
          <strong>Falhe fechado.</strong> Use embeddings para recuperar candidatos, não para decidir que duas perguntas
          são equivalentes, e quando a decisão não for clara, chame o modelo.
        </li>
        <li>
          <strong>Perguntas equivalentes não bastam.</strong> Uma resposta em cache pode estar desatualizada ou
          pertencer a um usuário com outras permissões, a outra versão do documento ou a outra conversa. Nada disso é
          visível para um embedding; tem de fazer parte da chave do cache ou da decisão de reaproveitar. Este
          experimento não testa isso.
        </li>
        <li>
          <strong>Trate um juiz como um compromisso, não como uma correção.</strong> Ele custa latência na maioria dos
          acertos e, com modelos pequenos, não supera claramente um limiar mais rígido. Se compensa depende de quão
          cara é a resposta que ele economiza.
        </li>
      </ul>

      <h2>Limitações</h2>
      <p>
        Um domínio, um idioma, perguntas curtas e amostras pequenas: 5 pares por categoria de negativo difícil nos
        Experimentos 1 e 2, e {n(TRACK_A.sampledPerKind)} + {n(TRACK_A.sampledPerKind)} consultas no Track A. Os
        rótulos são julgamento humano. As duas ordens foram julgadas só nos pares escritos à mão; o Track A ainda julga
        uma. Modelos de fronteira talvez julguem melhor, a um preço muito maior por verificação.
      </p>
      <p>
        Os juízes rodaram em runners gratuitos de CPU, e a latência ali não é estável: o mesmo juiz 3B levou{" "}
        {n(JUDGE_ON_PAIRS.latencyBetweenRuns[0], 1)} segundo por chamada em uma execução e{" "}
        {n(JUDGE_ON_PAIRS.latencyBetweenRuns[1], 1)} na seguinte. Leia as latências e os pontos de equilíbrio como
        ordens de grandeza. A latência em GPU seria muito menor e não foi medida. Um veredito desse juiz também mudou
        entre essas duas execuções, com temperatura 0, o que lembra que um resultado em um conjunto pequeno pode variar
        em um par.
      </p>
      <p>
        O cross-encoder foi testado par a par, não contra o cache inteiro, e só um foi testado. Um cross-encoder
        treinado com perguntas do mesmo domínio e uma verificação de implicação bidirecional continuam sem teste.
      </p>
      <p>
        Código, dados e resultados brutos estão no <a href={REPO}>GitHub</a> (em inglês), e todos os números acima vêm
        de execuções commitadas lá pelo GitHub Actions.
      </p>
    </>
  );
}
