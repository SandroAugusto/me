import type { Content } from "./types";

export const pt: Content = {
  meta: {
    title: "Sandro Augusto | Tech Lead e Engenheiro de Software Sênior",
    description:
      "Tech lead e engenheiro de software sênior com mais de 10 anos em TypeScript, Node.js, React e sistemas de autenticação, atuando com empresas como Pinterest, Ask Media Group e XP Inc.",
  },
  nav: { experience: "Experiência", skills: "Competências", education: "Formação", contact: "Contato" },
  hero: {
    eyebrow: "Tech Lead · Engenheiro de Software Sênior",
    title: "Lidero times de engenharia e construo plataformas web que operam em escala.",
    intro:
      "Mais de dez anos construindo produtos em TypeScript, Node.js e React: back-ends orientados a eventos para mais de 20 milhões de usuários, sistemas de autenticação e os sites públicos de uma marca global de consumo. Hoje lidero o time de engenharia responsável pelos subsites do Pinterest.",
    location: "São Paulo, Brasil · UTC−3",
    primaryCta: "Falar comigo no LinkedIn",
    secondaryCta: "Ver experiência",
  },
  stats: [
    { value: "10+", label: "anos em engenharia de software" },
    { value: "20M+", label: "usuários atendidos pelo back-end que arquitetei na Ask Media Group" },
    { value: "5", label: "anos trabalhando remotamente com times dos Estados Unidos" },
  ],
  experience: {
    heading: "Experiência",
    roles: [
      {
        company: "Pinterest",
        title: "Lead Software Engineer, Subsites Platform",
        period: "abr 2026 — atual",
        context: "via BairesDev",
        summary:
          "Engenheiro líder da Subsites Platform do Pinterest, a infraestrutura de conteúdo por trás dos sites públicos da empresa.",
        highlights: [
          "Lidero um time multidisciplinar de sete pessoas (cinco engenheiros e dois analistas de QA) e respondo pelas decisões de arquitetura, code reviews e contratações.",
          "Projetei e implementei autenticação sem senha com Auth0 (códigos de uso único por e-mail), com foco em entregabilidade e confiabilidade.",
          "Projetei uma estratégia de cache de tokens máquina a máquina para autenticação entre servidores, que reduziu a latência de autenticação entre serviços internos.",
          "Construí server actions e gestão de sessão no App Router do Next.js com escopo restrito por rota, para que o contexto de autenticação não vaze entre rotas.",
        ],
        stack: ["TypeScript", "React", "Next.js", "GraphQL / Relay", "Auth0", "Python"],
      },
      {
        company: "Ask Media Group",
        title: "Lead Software Engineer",
        period: "ago 2022 — abr 2026",
        context: "via BairesDev",
        summary: "Empresa de mídia digital e publicidade com mais de 20 milhões de usuários em suas plataformas de conteúdo e anúncios.",
        highlights: [
          "Arquitetei um back-end de alta concorrência, orientado a eventos, para mais de 20 milhões de usuários, que sustentou picos de 2x no tráfego e reduziu a latência das APIs em 40%.",
          "Construí filas de processamento distribuídas com Redis e BullMQ que tratam mais de 3 milhões de registros de anúncios por dia, sem perda de dados.",
          "Automatizei 95% da moderação de conteúdo de anúncios com fluxos de LLM na API do Gemini, levando o tempo de aprovação de horas para segundos.",
        ],
        stack: ["TypeScript", "Node.js", "React", "Redis", "BullMQ", "Gemini API"],
      },
      {
        company: "Vouched",
        title: "Senior Software Engineer",
        period: "fev 2022 — ago 2022",
        context: "via BairesDev",
        summary: "Startup de verificação de identidade com checagens de KYC/AML em tempo real e detecção de fraude por biometria.",
        highlights: [
          "Construí um motor de verificação de identidade full stack em Python e React, para detecção de fraude e onboarding com KYC/AML.",
          "Mantive a latência das APIs abaixo de um segundo em picos de 15% no tráfego, com índices compostos no PostgreSQL e ajustes pontuais na AWS.",
        ],
        stack: ["Python", "React", "PostgreSQL", "AWS"],
      },
      {
        company: "imaware",
        title: "Senior Software Engineer",
        period: "set 2021 — fev 2022",
        context: "via BairesDev",
        summary: "Plataforma de diagnósticos de saúde direta ao consumidor, com testes de biomarcadores feitos em casa.",
        highlights: [
          "Construí APIs e pipelines de dados para mais de 200 biomarcadores, com integrações no padrão FHIR com Quest e LabCorp.",
          "Automatizei de ponta a ponta o envio e a logística dos kits com as APIs da Shopify e da EasyPost.",
        ],
        stack: ["TypeScript", "Node.js", "FHIR", "Shopify", "EasyPost"],
      },
      {
        company: "XP Inc.",
        title: "Senior Software Engineer",
        period: "abr 2020 — set 2021",
        summary: "Uma das maiores plataformas de investimentos do Brasil.",
        highlights: [
          "Modernizei uma arquitetura de dados híbrida com PostgreSQL e MongoDB para transações financeiras de alta frequência, com consultas abaixo de um segundo e conformidade ACID completa.",
          "Liderei times de engenharia na entrega de software financeiro sob requisitos rígidos de confiabilidade, segurança e regulação.",
        ],
        stack: ["Node.js", "PostgreSQL", "MongoDB"],
      },
      {
        company: "TIM S.A.",
        title: "Software Engineer",
        period: "jun 2013 — abr 2020",
        context: "via Accenture",
        summary: "Uma das maiores operadoras de telecomunicações do Brasil.",
        highlights: [
          "Construí e mantive sistemas de back-end e integrações corporativas ao longo de sete anos, em times multidisciplinares de entrega.",
        ],
      },
    ],
  },
  skills: {
    heading: "Competências",
    groups: [
      { title: "Front-end", items: ["TypeScript", "React", "Next.js (App Router)", "GraphQL / Relay", "Redux", "Tailwind CSS"] },
      { title: "Back-end", items: ["Node.js", "Python", "APIs REST e GraphQL", "Sistemas orientados a eventos", "Fluxos com LLM"] },
      { title: "Autenticação e identidade", items: ["Auth0", "OAuth 2.0 / OIDC", "WebAuthn / Passkeys", "MFA / OTP", "SAML", "JWT e sessões"] },
      { title: "Dados e mensageria", items: ["PostgreSQL", "MongoDB", "Redis", "BullMQ", "Kafka", "Snowflake"] },
      { title: "Nuvem e observabilidade", items: ["AWS", "Docker", "Kubernetes", "CI/CD", "New Relic", "Grafana"] },
      { title: "Liderança", items: ["Direção técnica", "Decisões de arquitetura", "Code review", "Contratação", "Mentoria"] },
    ],
  },
  education: {
    heading: "Formação",
    degrees: [
      { title: "Pós-graduação em Engenharia de Software com IA Aplicada", school: "PUC, Brasil", period: "2026 — 2027 (em curso)" },
      { title: "Pós-graduação em Desenvolvimento Web Full Stack", school: "PUC, Brasil", period: "2023 — 2024" },
      { title: "Bacharelado em Ciência da Computação", school: "UEZO, Brasil", period: "2012 — 2017" },
    ],
  },
  contact: {
    heading: "Contato",
    text: "O melhor caminho para falar comigo é o LinkedIn. Converso com prazer sobre liderança de engenharia, arquitetura ou um projeto que você tenha em mente.",
    linkedin: "LinkedIn",
    github: "GitHub",
  },
  footer: { source: "Código-fonte" },
  languageSwitch: { label: "Idioma" },
};
