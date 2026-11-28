/** The `</>` mark shown next to the name in every page header. Sized and coloured by `.brand svg`. */
export function Logo() {
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
