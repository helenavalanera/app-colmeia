import React from "react";

const OUTFIT_COLORS = {
  camisa_lima: "#c7d98a",
  camisa_roxa: "#cbb9e8",
  esportivo: "#f86700",
  inverno: "#294d3a",
  urbano: "#18181b",
  classico: "#3d3525",
};

const SKIRT_COLORS = {
  saia_laranja: "#f2b25c",
  saia_lima: "#dce97e",
};

export default function BeeMascot({ size = 120, className = "", style, equipped = {} }) {
  const { chapeu, roupa, saia, look = "classico", acessorio, expressao = "feliz" } = equipped;
  const isFlor = equipped.personagem !== "hatch";
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
      {(saia || isFlor) && (
        <path d="M65 178 L135 178 L145 215 Q100 230 55 215 Z" fill={SKIRT_COLORS[saia] || OUTFIT_COLORS[look] || "#f2b25c"} stroke="#3d3525" strokeWidth="3" />
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
      <path d="M67 161h66v13H67ZM69 191h62v11H69Z" fill="#3d3525" />
      <rect x="65" y="145" width="70" height="39" rx="12" fill={OUTFIT_COLORS[roupa] || OUTFIT_COLORS[look] || "#3d3525"} stroke="#3d3525" strokeWidth="3" />

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

      {/* Cabelo distingue Flor e Hatch também na miniatura do perfil */}
      {isFlor ? <path d="M58 91q5-48 42-48t43 48q-13-21-25-12-18-24-35 0-12-9-25 12Z" fill="#3d2419" /> : <path d="m61 72 15-25 7 19 16-30 8 28 20-20-2 27 18-8-10 28q-31-26-72 1Z" fill="#3d2419" />}

      {/* Bochechas */}
      <ellipse cx="72" cy="112" rx="9" ry="6" fill="#e79870" opacity=".85" />
      <ellipse cx="127" cy="112" rx="9" ry="6" fill="#e79870" opacity=".85" />

      {/* Olhos */}
      <ellipse cx="83" cy="99" rx="6" ry={expressao === "risonha" ? 3 : 8} fill="#3d3525" />
      <ellipse cx="117" cy="99" rx="6" ry={expressao === "risonha" ? 3 : 8} fill="#3d3525" />

      {/* Sorriso */}
      {expressao === "surpresa" ? <ellipse cx="100" cy="117" rx="6" ry="8" fill="#3d3525" /> : <path d="M91 116q9 8 18 0" stroke="#3d3525" strokeWidth="3.5" fill="none" strokeLinecap="round" />}

      {/* Chapéu (acessório equipável) */}
      {(acessorio === "flor" || chapeu === "chapeu_flor") && <g fill="#f86700" stroke="#3d3525" strokeWidth="1.5"><circle cx="137" cy="67" r="7" /><circle cx="147" cy="67" r="7" /><circle cx="142" cy="58" r="7" /><circle cx="142" cy="76" r="7" /><circle cx="142" cy="67" r="5" fill="#ffac00" /></g>}
      {chapeu === "chapeu_grao" && <path d="M67 59h66v8H67Zm33-25 42 19-42 19-42-19Z" fill="#3d3525" />}
      {acessorio === "oculos" && <g fill="none" stroke="#18181b" strokeWidth="4"><circle cx="82" cy="99" r="14" /><circle cx="118" cy="99" r="14" /><path d="M96 99h8" /></g>}
      {acessorio === "fone" && <g fill="none" stroke="#18181b" strokeWidth="6"><path d="M62 99q0-48 38-48t38 48" /><path d="M61 92v28M139 92v28" /></g>}
    </svg>
  );
}
