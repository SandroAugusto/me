export interface Stat {
  value: string;
  label: string;
}

export interface Role {
  company: string;
  /** Job title. Left out where it has not been confirmed yet. */
  title?: string;
  /** Free-form period, e.g. "2026 — present". Left out where it has not been confirmed yet. */
  period?: string;
  /** Short context line, e.g. the consultancy the engagement ran through. */
  context?: string;
  summary: string;
  highlights?: string[];
  stack?: string[];
}

export interface SkillGroup {
  title: string;
  items: string[];
}

export interface Project {
  name: string;
  description: string;
  href: string;
  linkLabel: string;
}

export interface Content {
  meta: { title: string; description: string };
  nav: { experience: string; skills: string; projects: string; contact: string };
  hero: { eyebrow: string; title: string; intro: string; location: string; primaryCta: string; secondaryCta: string };
  stats: Stat[];
  experience: { heading: string; roles: Role[] };
  skills: { heading: string; groups: SkillGroup[]; certificationLabel: string; certification: string };
  projects: { heading: string; items: Project[] };
  contact: { heading: string; text: string; linkedin: string; github: string };
  footer: { source: string };
  languageSwitch: { label: string };
}
