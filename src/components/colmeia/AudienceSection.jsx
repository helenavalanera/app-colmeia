import React from "react";
import { Check } from "lucide-react";

const COLS = [
  {
    title: "Para estudantes",
    items: [
      "Conduzem clubes e participam de missões presenciais",
      "Exercitam autonomia, diálogo e protagonismo",
      "Podem ser embaixadores e organizar seus clubes",
      "Fazem novas conexões, sem ranking público",
    ],
  },
  {
    title: "Para mediadores",
    items: [
      "Apoiam os clubes quando os alunos precisam",
      "Ajudam com inclusão, escuta e recursos da escola",
      "Acompanham as respostas coletivas dos clubes",
      "Identificam oportunidades de mediação sem vigilância",
    ],
  },
];

export default function AudienceSection() {
  return (
    <section className="cm-surface cm-font" style={{ maxWidth: 1230, margin: "0 auto", padding: "20px 28px 60px" }}>
      <h2 style={{ fontSize: 28, textAlign: "center", letterSpacing: "-0.5px", marginBottom: 36, color: "var(--cm-ink)" }}>
        Os alunos conduzem. A escola cresce junto.
      </h2>
      <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
        {COLS.map((col) => (
          <div key={col.title} className="cm-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 17, marginBottom: 16, color: "var(--cm-ink)" }}>{col.title}</h3>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 11 }}>
              {col.items.map((it) => (
                <li key={it} style={{ fontSize: 14, lineHeight: 1.5, display: "flex", gap: 8, color: "var(--cm-ink)" }}>
                  <Check size={16} aria-hidden="true" style={{ color: "var(--cm-orange)", flexShrink: 0, marginTop: 2 }} />
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
