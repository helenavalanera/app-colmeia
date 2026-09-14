import React from "react";

const COLS = [
  {
    title: "Para estudantes",
    items: [
      "Participam de missões curtas e concretas",
      "Exercitam autonomia, diálogo e protagonismo",
      "Assumem papéis rotativos: Investigador e Polinizador",
      "Fazem novas conexões, sem ranking público",
    ],
  },
  {
    title: "Para educadores",
    items: [
      "Criam ou adaptam atividades em poucos passos",
      "Formam grupos sem organizar tudo manualmente",
      "Acompanham a turma de forma agregada",
      "Identificam oportunidades de mediação sem vigilância",
    ],
  },
];

export default function AudienceSection() {
  return (
    <section className="cm-surface cm-font" style={{ maxWidth: 1230, margin: "0 auto", padding: "20px 28px 60px" }}>
      <h2 style={{ fontSize: 28, textAlign: "center", letterSpacing: "-0.5px", marginBottom: 36, color: "var(--cm-ink)" }}>
        O celular abre a missão. A turma constrói a aprendizagem.
      </h2>
      <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
        {COLS.map((col) => (
          <div key={col.title} className="cm-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 17, marginBottom: 16, color: "var(--cm-green)" }}>{col.title}</h3>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 11 }}>
              {col.items.map((it) => (
                <li key={it} style={{ fontSize: 14, lineHeight: 1.5, display: "flex", gap: 8, color: "var(--cm-ink)" }}>
                  <span style={{ color: "var(--cm-orange)", fontWeight: 800, flexShrink: 0 }}>✓</span>
                  {it}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}