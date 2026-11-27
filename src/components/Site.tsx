import { content } from "@/content";
import type { Role } from "@/content/types";
import { SITE, type Locale } from "@/lib/site";
import { ARTICLE_LIST } from "@/content/writing";
import { LanguageSwitch } from "./LanguageSwitch";

function Logo() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path
        d="M22 22l-11 10 11 10M42 22l11 10-11 10M36 14l-8 36"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RoleItem({ role }: { role: Role }) {
  return (
    <li className="role">
      <div className="role-head">
        <h3>
          {role.company}
          {role.context ? <span className="role-context"> · {role.context}</span> : null}
        </h3>
        <span className="role-period mono">{role.period}</span>
      </div>
      <p className="role-title">{role.title}</p>
      <p className="role-summary">{role.summary}</p>
      {role.highlights.length > 0 ? (
        <ul className="role-highlights">
          {role.highlights.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
      {role.stack ? (
        <ul className="tags mono">
          {role.stack.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export function Site({ locale }: { locale: Locale }) {
  const c = content[locale];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE.person,
    url: SITE.url,
    jobTitle: "Tech Lead",
    worksFor: { "@type": "Organization", name: SITE.legalName, alternateName: SITE.brand },
    sameAs: [SITE.linkedin, SITE.github],
    knowsAbout: ["TypeScript", "React", "Next.js", "Node.js", "Python", "Software architecture"],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="site-header">
        <div className="wrap bar">
          <a className="brand" href="#top" aria-label={SITE.person}>
            <Logo />
            {SITE.person}
          </a>
          <div className="bar-right">
            <nav>
              <a href="#experience">{c.nav.experience}</a>
              <a href="#writing">{c.nav.writing}</a>
              <a href="#skills">{c.nav.skills}</a>
              <a href="#education">{c.nav.education}</a>
              <a href="#contact">{c.nav.contact}</a>
            </nav>
            <LanguageSwitch current={locale} label={c.languageSwitch.label} />
          </div>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="wrap">
            <p className="eyebrow mono">{c.hero.eyebrow}</p>
            <p className="name">{SITE.person}</p>
            <h1>{c.hero.title}</h1>
            <p className="lead">{c.hero.intro}</p>
            <div className="actions">
              <a className="btn" href={SITE.linkedin} target="_blank" rel="noopener noreferrer">
                {c.hero.primaryCta}
              </a>
              <a className="btn btn-ghost" href="#experience">
                {c.hero.secondaryCta}
              </a>
            </div>
            <p className="location mono">{c.hero.location}</p>
          </div>
        </section>

        <section className="stats" aria-label={c.nav.experience}>
          <div className="wrap stats-grid">
            {c.stats.map((stat) => (
              <div key={stat.label} className="stat">
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="experience" className="block">
          <div className="wrap">
            <h2>{c.experience.heading}</h2>
            <ol className="roles">
              {c.experience.roles.map((role) => (
                <RoleItem key={`${role.company}-${role.period}`} role={role} />
              ))}
            </ol>
          </div>
        </section>

        <section id="writing" className="block">
          <div className="wrap">
            <h2>{c.writing.heading}</h2>
            {c.writing.note ? <p className="writing-meta">{c.writing.note}</p> : null}
            <ul className="writing-list">
              {ARTICLE_LIST.map((article) => (
                <li key={article.slug} className="writing-item card">
                  <a href={article.path}>
                    <p className="writing-meta mono">{article.meta}</p>
                    <h3>{article.title}</h3>
                    <p>{article.summary}</p>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="skills" className="block">
          <div className="wrap">
            <h2>{c.skills.heading}</h2>
            <div className="skills-grid">
              {c.skills.groups.map((group) => (
                <div key={group.title} className="card">
                  <h3>{group.title}</h3>
                  <ul>
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="education" className="block">
          <div className="wrap">
            <h2>{c.education.heading}</h2>
            <ul className="degrees">
              {c.education.degrees.map((degree) => (
                <li key={degree.title} className="degree">
                  <div>
                    <h3>{degree.title}</h3>
                    <p>{degree.school}</p>
                  </div>
                  <span className="role-period mono">{degree.period}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="contact" className="block">
          <div className="wrap">
            <h2>{c.contact.heading}</h2>
            <p className="contact-text">{c.contact.text}</p>
            <div className="actions">
              <a className="btn" href={SITE.linkedin} target="_blank" rel="noopener noreferrer">
                {c.contact.linkedin}
              </a>
              <a className="btn btn-ghost" href={SITE.github} target="_blank" rel="noopener noreferrer">
                {c.contact.github}
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="wrap footer-row">
          <span>
            © {new Date().getFullYear()} {SITE.person} · {SITE.legalName}
          </span>
          <a href={SITE.repo} target="_blank" rel="noopener noreferrer">
            {c.footer.source}
          </a>
        </div>
      </footer>
    </>
  );
}
