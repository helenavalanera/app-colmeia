import React from "react";

const HAT_LABELS = {
  chapeu_flor: "🌸",
  chapeu_grao: "🎓",
};

const OUTFIT_COLORS = {
  camisa_lima: "#c7d98a",
  camisa_roxa: "#cbb9e8",
};

const SKIRT_COLORS = {
  saia_laranja: "#f2b25c",
  saia_lima: "#dce97e",
};

export default function BeeMascot({ size = 120, className = "", style, equipped = {} }) {
  const { chapeu, roupa, saia } = equipped;
  return (
    <svg
      className={className}
      style={style}
      width={size}
      height={size * 1.3}
      viewBox="0 0 200 260"
      role="img"
      aria-label="Abelha mascote da Colmeia"
    >
      {/* Sombra no chão */}
      <ellipse cx="102" cy="247" rx="48" ry="7" fill="#3d3525" opacity=".2" />

      {/* Asas */}
      <ellipse
        cx="58"
        cy="139"
        rx="26"
        ry="39"
        fill="#ffffff"
        stroke="#8a795d"
        strokeWidth="3"
        transform="rotate(-30 58 139)"
      />
      <ellipse
        cx="144"
        cy="139"
        rx="26"
        ry="39"
        fill="#ffffff"
        stroke="#8a795d"
        strokeWidth="3"
        transform="rotate(30 144 139)"
      />

      {/* Pernas */}
      <path
        d="M82 203v27M119 203v27"
        stroke="#3d3525"
        strokeWidth="11"
        strokeLinecap="round"
      />
      <ellipse cx="76" cy="237" rx="18" ry="9" fill="#3d3525" />
      <ellipse cx="125" cy="237" rx="18" ry="9" fill="#3d3525" />

      {/* Braços */}
      <path
        d="m65 158-14 27m85-27 14 27"
        stroke="#c69532"
        strokeWidth="11"
        strokeLinecap="round"
      />

      {/* Saia (acessório equipável) */}
      {saia && (
        <path d="M65 178 L135 178 L145 215 Q100 230 55 215 Z" fill={SKIRT_COLORS[saia] || "#f2b25c"} stroke="#3d3525" strokeWidth="3" />
      )}

      {/* Corpo (Abdômen) */}
      <rect
        x="65"
        y="129"
        width="70"
        height="86"
        rx="32"
        fill="#e5b035"
        stroke="#3d3525"
        strokeWidth="4"
      />
      {!roupa && <path d="M67 161h66v13H67ZM69 191h62v11H69Z" fill="#3d3525" />}
      {roupa && (
        <rect x="65" y="152" width="70" height="30" rx="10" fill={OUTFIT_COLORS[roupa] || "#c7d98a"} stroke="#3d3525" strokeWidth="3" />
      )}

      {/* Antenas */}
      <path
        d="M82 62 71 38M117 62l12-24"
        stroke="#3d3525"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <circle cx="70" cy="35" r="7" fill="#3d3525" />
      <circle cx="131" cy="35" r="7" fill="#3d3525" />

      {/* Cabeça */}
      <ellipse
        cx="100"
        cy="98"
        rx="48"
        ry="43"
        fill="#f4cf54"
        stroke="#3d3525"
        strokeWidth="4"
      />

      {/* Bochechas */}
      <ellipse cx="72" cy="112" rx="9" ry="6" fill="#e79870" opacity=".85" />
      <ellipse cx="127" cy="112" rx="9" ry="6" fill="#e79870" opacity=".85" />

      {/* Olhos */}
      <ellipse cx="83" cy="99" rx="5" ry="7" fill="#3d3525" />
      <ellipse cx="117" cy="99" rx="5" ry="7" fill="#3d3525" />

      {/* Sorriso */}
      <path
        d="M91 116q9 8 18 0"
        stroke="#3d3525"
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* Chapéu (acessório equipável) */}
      {chapeu && (
        <text x="100" y="55" fontSize="34" textAnchor="middle">{HAT_LABELS[chapeu] || "🎩"}</text>
      )}
    </svg>
  );
}
