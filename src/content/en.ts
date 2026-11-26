import type { Content } from "./types";

export const en: Content = {
  meta: {
    title: "Sandro Augusto | Tech Lead and Senior Software Engineer",
    description:
      "Tech lead and senior software engineer with 10+ years in TypeScript, Node.js, React and authentication systems, working with companies such as Pinterest, Ask Media Group and XP Inc.",
  },
  nav: { experience: "Experience", writing: "Writing", skills: "Skills", education: "Education", contact: "Contact" },
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
          "Lead a cross-functional team of seven (five engineers and two QA analysts) and own its architecture decisions and code reviews.",
          "Lead the migration of 15 public subsites from Vercel to Pinterest's internal web platform, consolidating per-site code into shared handlers for Sanity CMS queries, authentication and content preview, with full feature parity as a hard requirement.",
          "Run hiring for the team: I interview candidates and make the final hiring decision, then run 1:1s, performance reviews and career plans.",
          "Designed the authentication layer: Auth0 over OAuth 2.0 / OIDC for partners (passwordless email one-time codes, MFA, WebAuthn passkeys) and Okta OIDC and SAML SSO for employees.",
          "Drove the security reviews for Sanity visual editing and content preview, including on sites behind login.",
          "Use Claude and Codex agents for architecture exploration and code audits, such as reviewing the Smartling translation integration before rolling it out to more sites.",
          "Designed a machine-to-machine token caching strategy for server-to-server authentication, which cut auth latency between internal services.",
          "Built server actions and session management in the Next.js App Router with strict route-level scoping, so auth context cannot leak between routes.",
        ],
        stack: ["TypeScript", "React", "Next.js", "Python", "Sanity", "Auth0", "Okta", "Smartling"],
      },
      {
        company: "Ask Media Group",
        title: "Lead Software Engineer",
        period: "Aug 2022 — Apr 2026",
        context: "via BairesDev",
        summary: "Digital media and advertising company with more than 20 million users across its content and ad platforms.",
        highlights: [
          "Architected a high-concurrency, Kafka-based event-driven back end for 20M+ users that sustained 2x traffic peaks while reducing API latency by 40%.",
          "Built distributed job queues on Redis and BullMQ, running on Docker and Kubernetes in AWS, that load more than 3 million ad records a day into Snowflake with zero data loss.",
          "Automated 95% of ad content moderation with LLM workflows on the Gemini API; the remaining cases reached reviewers with a model-suggested decision, cutting manual review effort by 99% and approval time from hours to seconds.",
          "Led the team that built a push notification platform generating more than $180K a month in AdSense revenue.",
          "Built MFA, SAML SSO and WebAuthn passkey flows for the company's platforms.",
          "Cut platform costs by $20K a month, mostly on AWS, guided by New Relic and Grafana observability.",
        ],
        stack: ["TypeScript", "Node.js", "React", "Kafka", "Redis", "BullMQ", "AWS", "Kubernetes", "Snowflake", "Gemini API"],
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
          "Modernized a hybrid PostgreSQL and MongoDB data architecture for high-frequency financial transactions, reaching sub-second queries while preserving transactional consistency.",
          "Led engineering teams delivering financial software under strict reliability, security and regulatory requirements.",
        ],
        stack: ["Node.js", "PostgreSQL", "MongoDB"],
      },
      {
        company: "TIM S.A.",
        title: "Software Engineer",
        period: "Jan 2019 — Apr 2020",
        summary: "One of Brazil's largest telecom operators. Internal systems, mostly for HR.",
        highlights: [
          "Built the labor litigation management system, which saved the company R$20 million.",
          "Designed an office relocation feasibility tool that calculated car, public transit and traffic-adjusted commutes for every employee at one of TIM's headquarters, and measured how much each person's commute would improve or worsen.",
          "Built an internal platform for registering and managing company events.",
        ],
        stack: ["Node.js", "React"],
      },
      {
        company: "Accenture",
        title: "Software Engineer",
        period: "Jan 2018 — Jan 2019",
        summary: "Customer data and retention analysis for Oi, one of Brazil's largest telecom operators.",
        highlights: [],
        stack: ["PL/SQL", "Tableau"],
      },
      {
        company: "TIM S.A.",
        title: "Software Engineer",
        period: "Jun 2013 — Sep 2017",
        summary: "One of Brazil's largest telecom operators.",
        highlights: [
          "Built and maintained back-end systems and enterprise integrations within cross-functional delivery teams.",
        ],
      },
    ],
  },
  skills: {
    heading: "Skills",
    groups: [
      { title: "Front end", items: ["TypeScript", "React", "Next.js (App Router)", "Redux", "Tailwind CSS", "Sanity (headless CMS)"] },
      { title: "Back end", items: ["Node.js", "Python", "REST and GraphQL APIs", "Event-driven systems", "LLM workflows", "AI-assisted engineering (Claude, Codex)"] },
      { title: "Auth and identity", items: ["Auth0", "Okta", "OAuth 2.0 / OIDC", "WebAuthn / Passkeys", "MFA / OTP", "SAML", "JWT and sessions"] },
      { title: "Data and messaging", items: ["PostgreSQL", "MongoDB", "Redis", "BullMQ", "Kafka", "Snowflake"] },
      { title: "Cloud and observability", items: ["AWS", "Docker", "Kubernetes", "CI/CD", "New Relic", "Grafana"] },
      { title: "Leadership", items: ["Technical direction", "Architecture decisions", "Code review", "Hiring", "Mentoring"] },
    ],
  },
  writing: { heading: "Selected writing" },
  education: {
    heading: "Education",
    degrees: [
      { title: "Postgraduate Certificate, Software Engineering in Applied AI", school: "UniPDS (degree issued by Faculdade Anhanguera), Brazil", period: "2026 — 2027 (expected)" },
      { title: "Postgraduate Certificate, Full Stack Web Development", school: "PUC, Brazil", period: "2023 — 2024" },
      { title: "BSc, Computer Science", school: "UEZO, Brazil", period: "2012 — 2017" },
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
