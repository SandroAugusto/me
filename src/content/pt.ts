import { SITE } from "@/lib/site";
import type { Content } from "./types";

export const pt: Content = {
  meta: {
    title: "Sandro Augusto | Tech Lead e Engenheiro Full Stack Sênior",
    description:
      "Tech lead e engenheiro full stack com mais de 10 anos construindo plataformas web para empresas como Pinterest, XP Inc. e TIM. TypeScript, React, Next.js, Node.js e Python.",
  },
  nav: { experience: "Experiência", skills: "Competências", projects: "Projetos", contact: "Contato" },
  hero: {
    eyebrow: "Tech Lead · Engenheiro Full Stack Sênior",
    title: "Lidero times de engenharia e construo plataformas web que operam em escala.",
    intro:
      "Mais de dez anos entregando produtos para empresas como Pinterest, XP Inc. e TIM: de uma plataforma de investimentos de alta disponibilidade aos sites públicos de uma marca global de consumo. Hoje lidero o time responsável pelos subsites do Pinterest.",
    location: "São Paulo, Brasil · UTC−3",
    primaryCta: "Falar comigo no LinkedIn",
    secondaryCta: "Ver experiência",
  },
  stats: [
    { value: "10+", label: "anos em engenharia de software" },
    { value: "20M+", label: "usuários na plataforma de investimentos em que atuei na XP Inc." },
    { value: "5", label: "anos trabalhando remotamente com times dos Estados Unidos" },
  ],
  experience: {
    heading: "Experiência",
    roles: [
      {
        company: "Pinterest",
        title: "Tech Lead, Subsites",
        period: "2026 — atual",
        context: "via BairesDev",
        summary:
          "Lidero os engenheiros e analistas de QA responsáveis pelos subsites públicos do Pinterest, e respondo pela arquitetura, pelas entregas e pelas contratações do time.",
        highlights: [
          "Lidero a migração dos subsites de uma stack Next.js independente para a plataforma web interna do Pinterest, incluindo conteúdo gerenciado por CMS, autenticação e localização.",
          "Conduzi funcionalidades por ciclos completos de revisão de segurança e privacidade antes do lançamento.",
          "Construí uma automação que liga atualizações de dependências, CI e gestão de tarefas, para que upgrades de rotina cheguem ao time prontos para revisão.",
        ],
        stack: ["TypeScript", "React", "Next.js", "GraphQL / Relay", "Python"],
      },
      {
        company: "Ask Media Group",
        context: "via BairesDev",
        summary: "Desenvolvimento full stack para uma empresa americana de mídia digital.",
      },
      {
        company: "Vouched",
        summary: "Desenvolvimento full stack em um produto de verificação de identidade.",
      },
      {
        company: "imaware",
        summary: "Integrações de e-commerce e logística com Shopify e EasyPost.",
      },
      {
        company: "XP Inc.",
        summary: "Engenharia em uma plataforma de investimentos de alta disponibilidade, com mais de 20 milhões de usuários.",
      },
      {
        company: "TIM S.A.",
        summary: "Desenvolvimento de software em uma das maiores operadoras de telecomunicações do Brasil.",
      },
    ],
  },
  skills: {
    heading: "Competências",
    groups: [
      { title: "Front-end", items: ["TypeScript", "React", "Next.js", "GraphQL / Relay", "Acessibilidade", "Performance web"] },
      { title: "Back-end", items: ["Node.js", "Python", "PostgreSQL", "APIs REST e GraphQL", "Integrações com terceiros"] },
      { title: "Plataforma", items: ["CI/CD", "GitHub Actions", "CMS headless", "SSO e autenticação sem senha", "Revisões de segurança"] },
      { title: "Liderança", items: ["Direção técnica", "Decisões de arquitetura", "Code review", "Contratação", "Mentoria"] },
    ],
    certificationLabel: "Certificação",
    certification: "Claude Certified Architect – Foundations (CCA-F)",
  },
  projects: {
    heading: "Projetos paralelos",
    items: [
      {
        name: "vanessachihara.com.br",
        description: "Site e cartão de contato digital para um consultório médico: estático, rápido e pensado para busca local.",
        href: "https://vanessachihara.com.br",
        linkLabel: "Visitar o site",
      },
      {
        name: "Este site",
        description: "Next.js com TypeScript, exportado como estático, com conteúdo bilíngue tipado e sitemap gerado.",
        href: SITE.repo,
        linkLabel: "Ver o código",
      },
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
