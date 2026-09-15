interface BeeMarkProps {
  size?: number;
  className?: string;
}

/** Marca da Colmeia: usa o PNG anexado como identificador visual principal. */
export function BeeMark({ size = 40, className = "" }: BeeMarkProps) {
  return (
    <img
      src="/colmeia-logo.png"
      alt=""
      width={size}
      height={size}
      className={className}
      style={{ objectFit: "contain", display: "block" }}
      aria-hidden="true"
    />
  );
}
