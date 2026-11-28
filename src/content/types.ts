export interface Stat {
  value: string;
  label: string;
}

export interface Role {
  company: string;
  title: string;
  /** Free-form period, e.g. "Apr 2026 — present". */
  period: string;
  /** Short context line, e.g. the consultancy the engagement ran through. */
  context?: string;
  summary: string;
  highlights: string[];
  stack?: string[];
}

export interface SkillGroup {
  title: string;
  items: string[];
}

export interface Degree {
  title: string;
  school: string;
  period: string;
}

export interface Content {
  meta: { title: string; description: string };
  nav: { experience: string; writing: string; skills: string; education: string; contact: string };
  hero: { eyebrow: string; title: string; intro: string; location: string; primaryCta: string; secondaryCta: string };
  stats: Stat[];
  experience: { heading: string; roles: Role[] };
  skills: { heading: string; groups: SkillGroup[] };
  writing: { heading: string };
  education: { heading: string; degrees: Degree[] };
  contact: { heading: string; text: string; linkedin: string; github: string };
  footer: { source: string };
  languageSwitch: { label: string };
}
