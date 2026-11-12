import { SITE } from "@/lib/site";
import type { Content } from "./types";

export const en: Content = {
  meta: {
    title: "Sandro Augusto | Tech Lead and Senior Full-Stack Engineer",
    description:
      "Tech lead and full-stack engineer with 10+ years building web platforms for companies such as Pinterest, XP Inc. and TIM. TypeScript, React, Next.js, Node.js and Python.",
  },
  nav: { experience: "Experience", skills: "Skills", projects: "Projects", contact: "Contact" },
  hero: {
    eyebrow: "Tech Lead · Senior Full-Stack Engineer",
    title: "I lead engineering teams and build web platforms that run at scale.",
    intro:
      "More than ten years shipping products for companies such as Pinterest, XP Inc. and TIM: from a high-availability investment platform to the public-facing sites of a global consumer brand. Today I lead the team behind Pinterest's subsites.",
    location: "Based in São Paulo, Brazil · UTC−3",
    primaryCta: "Contact me on LinkedIn",
    secondaryCta: "See experience",
  },
  stats: [
    { value: "10+", label: "years in software engineering" },
    { value: "20M+", label: "users on the investment platform I worked on at XP Inc." },
    { value: "5", label: "years working remotely with US-based teams" },
  ],
  experience: {
    heading: "Experience",
    roles: [
      {
        company: "Pinterest",
        title: "Tech Lead, Subsites",
        period: "2026 — present",
        context: "via BairesDev",
        summary:
          "I lead the engineers and QA analysts who own Pinterest's public-facing subsites, and I am accountable for the team's architecture, delivery and hiring.",
        highlights: [
          "Leading the migration of the subsites from a standalone Next.js stack to Pinterest's internal web platform, including CMS-driven content, authentication and localization.",
          "Took features through complete security and privacy review cycles before launch.",
          "Built automation that connects dependency updates, CI and issue tracking, so routine upgrades reach the team as ready-to-review work.",
        ],
        stack: ["TypeScript", "React", "Next.js", "GraphQL / Relay", "Python"],
      },
      {
        company: "Ask Media Group",
        context: "via BairesDev",
        summary: "Full-stack development for a US digital media company.",
      },
      {
        company: "Vouched",
        summary: "Full-stack development on an identity verification product.",
      },
      {
        company: "imaware",
        summary: "E-commerce and shipping integrations built on Shopify and EasyPost.",
      },
      {
        company: "XP Inc.",
        summary: "Engineering on a high-availability investment platform serving more than 20 million users.",
      },
      {
        company: "TIM S.A.",
        summary: "Software development at one of Brazil's largest telecom operators.",
      },
    ],
  },
  skills: {
    heading: "Skills",
    groups: [
      { title: "Front end", items: ["TypeScript", "React", "Next.js", "GraphQL / Relay", "Accessibility", "Web performance"] },
      { title: "Back end", items: ["Node.js", "Python", "PostgreSQL", "REST and GraphQL APIs", "Third-party integrations"] },
      { title: "Platform", items: ["CI/CD", "GitHub Actions", "Headless CMS", "SSO and passwordless auth", "Security reviews"] },
      { title: "Leadership", items: ["Technical direction", "Architecture decisions", "Code review", "Hiring", "Mentoring"] },
    ],
    certificationLabel: "Certification",
    certification: "Claude Certified Architect – Foundations (CCA-F)",
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
