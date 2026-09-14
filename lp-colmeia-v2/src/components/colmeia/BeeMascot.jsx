import React from "react";

export default function BeeMascot({ size = 120, className = "" }) {
  return (
    <svg
      className={className}
      width={size}
      height={size * 1.3}
      viewBox="0 0 200 260"
      role="img"
      aria-label="Abelha mascote da Colmeia"
    >
      <ellipse cx="102" cy="247" rx="48" ry="7" fill="#6f764e" opacity=".13" />
      <ellipse cx="58" cy="139" rx="26" ry="39" fill="#f8ffff" stroke="#b8d4d0" strokeWidth="2" transform="rotate(-30 58 139)" />
      <ellipse cx="144" cy="139" rx="26" ry="39" fill="#f8ffff" stroke="#b8d4d0" strokeWidth="2" transform="rotate(30 144 139)" />
      <path d="M82 203v27M119 203v27" stroke="#755038" strokeWidth="13" strokeLinecap="round" />
      <ellipse cx="76" cy="237" rx="18" ry="9" fill="#3e4f3c" />
      <ellipse cx="125" cy="237" rx="18" ry="9" fill="#3e4f3c" />
      <path d="m65 158-14 27m85-27 14 27" stroke="#e3ad3e" strokeWidth="13" strokeLinecap="round" />
      <rect x="65" y="129" width="70" height="86" rx="32" fill="#eab63f" />
      <path d="M66 161h68v15H66ZM68 191h64v13H68Z" fill="#63513b" />
      <path d="M82 62 71 38M117 62l12-24" stroke="#69513a" strokeWidth="5" strokeLinecap="round" />
      <circle cx="70" cy="35" r="7" fill="#70563a" />
      <circle cx="131" cy="35" r="7" fill="#70563a" />
      <ellipse cx="100" cy="98" rx="48" ry="43" fill="#f7cd62" />
      <ellipse cx="85" cy="78" rx="23" ry="10" fill="#ffe49a" opacity=".7" />
      <ellipse cx="72" cy="112" rx="9" ry="5" fill="#e79870" opacity=".7" />
      <ellipse cx="127" cy="112" rx="9" ry="5" fill="#e79870" opacity=".7" />
      <ellipse cx="83" cy="99" rx="4" ry="6" fill="#423e31" />
      <ellipse cx="117" cy="99" rx="4" ry="6" fill="#423e31" />
      <path d="M91 116q9 8 18 0" stroke="#705039" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}