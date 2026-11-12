import { SITE } from "@/lib/site";
import type { Content } from "./types";

export const en: Content = {
  meta: {
    title: "Sandro Augusto | Tech Lead and Senior Software Engineer",
    description:
      "Tech lead and senior software engineer with 10+ years in TypeScript, Node.js, React and authentication systems, working with companies such as Pinterest, Ask Media Group and XP Inc.",
  },
  nav: { experience: "Experience", skills: "Skills", projects: "Projects", contact: "Contact" },
  hero: {
    eyebrow: "Tech Lead · Senior Software Engineer",
    title: "I lead engineering teams and build web platforms that run at scale.",
    intro:
      "More than ten years building products in TypeScript, Node.js and React: event-driven back ends serving over 20 million users, authentication systems, and the public-facing sites of a global consumer brand. Today I lead the engineering team behind Pinterest's subsites.",
    location: "Based in São Paulo, Brazil · UTC−3",
    primaryCta: "Contact me on LinkedIn",
    secondaryCta: "See experience",
  },
  stats: [
    { value: "10+", label: "years in software engineering" },
    { value: "20M+", label: "users served by the back end I architected at Ask Media Group" },
    { value: "5", label: "years working remotely with US-based teams" },
  ],
  experience: {
    heading: "Experience",
    roles: [
      {
        company: "Pinterest",
        title: "Lead Software Engineer, Subsites Platform",
        period: "Apr 2026 — present",
        context: "via BairesDev",
        summary:
          "Lead engineer for Pinterest's Subsites Platform, the content infrastructure behind the company's public-facing sites.",
        highlights: [
          "Lead a cross-functional team of seven (five engineers and two QA analysts), and own its architecture decisions, code reviews and hiring.",
          "Designed and implemented passwordless authentication with Auth0 (email one-time codes), with a focus on deliverability and reliability.",
          "Designed a machine-to-machine token caching strategy for server-to-server authentication, which cut auth latency between internal services.",
          "Built server actions and session management in the Next.js App Router with strict route-level scoping, so auth context cannot leak between routes.",
        ],
        stack: ["TypeScript", "React", "Next.js", "GraphQL / Relay", "Auth0", "Python"],
      },
      {
        company: "Ask Media Group",
        title: "Lead Software Engineer",
        period: "Aug 2022 — Apr 2026",
        context: "via BairesDev",
        summary: "Digital media and advertising company with more than 20 million users across its content and ad platforms.",
        highlights: [
          "Architected a high-concurrency, event-driven back end for 20M+ users that sustained 2x traffic peaks while reducing API latency by 40%.",
          "Built distributed job queues on Redis and BullMQ that process more than 3 million ad records a day with zero data loss.",
          "Automated 95% of ad content moderation with LLM workflows on the Gemini API, taking approval time from hours to seconds.",
        ],
        stack: ["TypeScript", "Node.js", "React", "Redis", "BullMQ", "Gemini API"],
      },
      {
        company: "Vouched",
        title: "Senior Software Engineer",
        period: "Feb 2022 — Aug 2022",
        context: "via BairesDev",
        summary: "Identity verification startup providing real-time KYC/AML checks and biometric fraud detection.",
        highlights: [
          "Built a full-stack identity verification engine in Python and React for fraud detection and KYC/AML onboarding.",
          "Kept API latency under a second through 15% traffic surges with PostgreSQL composite indexes and targeted AWS tuning.",
        ],
        stack: ["Python", "React", "PostgreSQL", "AWS"],
      },
      {
        company: "imaware",
        title: "Senior Software Engineer",
        period: "Sep 2021 — Feb 2022",
        context: "via BairesDev",
        summary: "Direct-to-consumer health diagnostics platform for at-home biomarker testing.",
        highlights: [
          "Built APIs and data pipelines for 200+ biomarkers, with FHIR-compliant integrations with Quest and LabCorp.",
          "Automated kit fulfilment and logistics end to end through the Shopify and EasyPost APIs.",
        ],
        stack: ["TypeScript", "Node.js", "FHIR", "Shopify", "EasyPost"],
      },
      {
        company: "XP Inc.",
        title: "Senior Software Engineer",
        period: "Apr 2020 — Sep 2021",
        summary: "One of Brazil's largest investment platforms.",
        highlights: [
          "Modernized a hybrid PostgreSQL and MongoDB data architecture for high-frequency financial transactions, reaching sub-second queries with full ACID compliance.",
          "Led engineering teams delivering financial software under strict reliability, security and regulatory requirements.",
        ],
        stack: ["Node.js", "PostgreSQL", "MongoDB"],
      },
      {
        company: "TIM S.A.",
        title: "Software Engineer",
        period: "Jun 2013 — Apr 2020",
        context: "via Accenture",
        summary: "One of Brazil's largest telecom operators.",
        highlights: [
          "Built and maintained back-end systems and enterprise integrations over a seven-year engagement, within cross-functional delivery teams.",
        ],
      },
    ],
  },
  skills: {
    heading: "Skills",
    groups: [
      { title: "Front end", items: ["TypeScript", "React", "Next.js (App Router)", "GraphQL / Relay", "Redux", "Tailwind CSS"] },
      { title: "Back end", items: ["Node.js", "Python", "REST and GraphQL APIs", "Event-driven systems", "LLM workflows"] },
      { title: "Auth and identity", items: ["Auth0", "OAuth 2.0 / OIDC", "WebAuthn / Passkeys", "MFA / OTP", "SAML", "JWT and sessions"] },
      { title: "Data and messaging", items: ["PostgreSQL", "MongoDB", "Redis", "BullMQ", "Kafka", "Snowflake"] },
      { title: "Cloud and observability", items: ["AWS", "Docker", "Kubernetes", "CI/CD", "New Relic", "Grafana"] },
      { title: "Leadership", items: ["Technical direction", "Architecture decisions", "Code review", "Hiring", "Mentoring"] },
    ],
    certificationLabel: "Certification",
    certification: "Claude Certified Architect – Foundations (CCA-F)",
  },
  education: {
    heading: "Education",
    degrees: [
      { title: "Postgraduate Certificate, Software Engineering in Applied AI", school: "PUC, Brazil", period: "2026 — 2027 (expected)" },
      { title: "Postgraduate Certificate, Full Stack Web Development", school: "PUC, Brazil", period: "2023 — 2024" },
      { title: "BSc, Computer Science", school: "UEZO, Brazil", period: "2012 — 2017" },
    ],
  },
  projects: {
    heading: "Side projects",
    items: [
      {
        name: "vanessachihara.com.br",
        description: "Website and digital contact card for a medical practice: static, fast and built for local search.",
        href: "https://vanessachihara.com.br",
        linkLabel: "Visit site",
      },
      {
        name: "This site",
        description: "Next.js with TypeScript, statically exported, with typed bilingual content and a generated sitemap.",
        href: SITE.repo,
        linkLabel: "View source",
      },
    ],
  },
  contact: {
    heading: "Contact",
    text: "The best way to reach me is LinkedIn. I am glad to talk about engineering leadership, architecture or a project you have in mind.",
    linkedin: "LinkedIn",
    github: "GitHub",
  },
  footer: { source: "Source code" },
  languageSwitch: { label: "Language" },
};
