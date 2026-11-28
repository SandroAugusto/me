"use client";

import { useRef } from "react";

/**
 * The section links on narrow screens, where the header has no room for them.
 * A native <details> disclosure, so it opens without JavaScript; the script
 * only closes it again after a link is followed or Escape is pressed.
 * Hidden from 760px up, where the links sit in the header itself.
 */
export function MobileMenu({ label, links }: { label: string; links: { href: string; label: string }[] }) {
  const details = useRef<HTMLDetailsElement>(null);
  const close = () => {
    if (details.current) details.current.open = false;
  };
  return (
    <details
      className="menu"
      ref={details}
      onKeyDown={(event) => {
        if (event.key === "Escape") close();
      }}
    >
      <summary aria-label={label}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </summary>
      <nav className="menu-panel" aria-label={label}>
        {links.map((link) => (
          <a key={link.href} href={link.href} onClick={close}>
            {link.label}
          </a>
        ))}
      </nav>
    </details>
  );
}
