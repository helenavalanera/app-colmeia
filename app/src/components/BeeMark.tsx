interface BeeMarkProps {
  size?: number;
  className?: string;
}

/** Marca da Colmeia: hexágono de colmeia + abelha estilizada, desenho original em SVG. */
export function BeeMark({ size = 40, className = "" }: BeeMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <polygon
        points="20,2 35,11 35,29 20,38 5,29 5,11"
        fill="var(--color-honey-500)"
      />
      <ellipse cx="20" cy="22" rx="7.5" ry="6" fill="var(--color-sand-50)" />
      <path
        d="M13 22c0-1.2 1-2 2-2h10c1 0 2 .8 2 2"
        stroke="var(--color-honey-700)"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M17 16c0-3 6-3 6 0" stroke="var(--color-honey-700)" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <circle cx="16.5" cy="13" r="1.4" fill="var(--color-honey-700)" />
      <circle cx="23.5" cy="13" r="1.4" fill="var(--color-honey-700)" />
      <path
        d="M20 20c1.5-3 5-4 7-2"
        stroke="var(--color-leaf-500)"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
        opacity="0.85"
      />
    </svg>
  );
}
