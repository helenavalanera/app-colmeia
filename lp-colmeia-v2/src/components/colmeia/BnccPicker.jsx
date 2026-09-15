import React, { useMemo, useState } from "react";
import { BNCC_PSICOSSOCIAL, bnccLookup } from "@/lib/bncc";

function normalize(s) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

const COMPONENTES = [...new Set(BNCC_PSICOSSOCIAL.map((h) => h.componente))].sort();

/**
 * Busca e seleção de habilidades da BNCC por critério psicossocial (Ensino
 * Fundamental, 6º ao 9º ano) — cooperação, empatia, convivência, cidadania,
 * diversidade, escuta, resolução de conflito etc. A Colmeia nunca vincula BNCC
 * pelo conteúdo da matéria: isso é o que permite uma mesma missão interdisciplinar
 * reunir Ciências, Português e Educação Física em torno do mesmo objetivo
 * pedagógico. Dataset: bncc.dev (CC BY 4.0, mantido pela Profy).
 */
export default function BnccPicker({ selected, onChange }) {
  const [query, setQuery] = useState("");
  const [componente, setComponente] = useState("");

  const results = useMemo(() => {
    const q = normalize(query.trim());
    let list = BNCC_PSICOSSOCIAL;
    if (componente) list = list.filter((h) => h.componente === componente);
    if (q) {
      list = list.filter(
        (h) => normalize(h.codigo).includes(q) || normalize(h.texto).includes(q) || normalize(h.componente).includes(q)
      );
    }
    return list.slice(0, 30);
  }, [query, componente]);

  function toggle(codigo) {
    onChange(selected.includes(codigo) ? selected.filter((c) => c !== codigo) : [...selected, codigo]);
  }

  return (
    <div>
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2" style={{ marginBottom: 10 }}>
          {selected.map((codigo) => {
            const h = bnccLookup(codigo);
            return (
              <span
                key={codigo} title={h?.texto || ""}
                className="cm-pill cm-pill-lavender" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
              >
                {h ? `${h.componente} · ${h.codigo}` : codigo}
                <button onClick={() => toggle(codigo)} style={{ border: 0, background: "transparent", cursor: "pointer", fontSize: 11, lineHeight: 1 }}>✕</button>
              </span>
            );
          })}
        </div>
      )}

      <input
        value={query} onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar por código, tema ou palavra-chave"
        style={{ width: "100%", border: "1px solid #d9ddcf", borderRadius: 12, padding: 10, background: "#fffefb", fontSize: 13, marginBottom: 8 }}
      />

      <div className="flex gap-1.5" style={{ marginBottom: 10, flexWrap: "wrap" }}>
        <button
          onClick={() => setComponente("")}
          className="cm-pill" style={{ fontSize: 10, cursor: "pointer", border: 0, background: componente === "" ? "var(--cm-yellow)" : "#edf0e3" }}
        >
          Todos
        </button>
        {COMPONENTES.map((c) => (
          <button
            key={c} onClick={() => setComponente(c)}
            className="cm-pill" style={{ fontSize: 10, cursor: "pointer", border: 0, background: componente === c ? "var(--cm-yellow)" : "#edf0e3" }}
          >
            {c}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gap: 6, maxHeight: 260, overflowY: "auto" }}>
        {results.length === 0 && (
          <p style={{ fontSize: 12, color: "var(--cm-muted)", padding: "8px 0" }}>Nenhuma habilidade encontrada.</p>
        )}
        {results.map((h) => {
          const checked = selected.includes(h.codigo);
          return (
            <label
              key={h.codigo}
              className="flex items-start gap-2"
              style={{ fontSize: 12, cursor: "pointer", padding: 8, borderRadius: 10, background: checked ? "var(--cm-lime)" : "#f7f8f2" }}
            >
              <input type="checkbox" checked={checked} onChange={() => toggle(h.codigo)} style={{ marginTop: 2 }} />
              <span>
                <strong>{h.componente} · {h.codigo}</strong> <span style={{ color: "var(--cm-muted)" }}>· {h.anos.length > 1 ? `${h.anos[0]}º–${h.anos[h.anos.length - 1]}º anos` : `${h.anos[0]}º ano`}</span>
                <br />
                {h.texto}
              </span>
            </label>
          );
        })}
      </div>
      <p style={{ fontSize: 10, color: "var(--cm-muted)", marginTop: 10 }}>
        {BNCC_PSICOSSOCIAL.length} habilidades psicossociais da BNCC (6º ao 9º ano, todos os componentes) · dados abertos bncc.dev
      </p>
    </div>
  );
}
