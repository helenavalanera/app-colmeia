import React from "react";
import { Hexagon } from "lucide-react";

export default function ExampleSection() {
  return (
    <section className="cm-surface cm-font" style={{ maxWidth: 1230, margin: "0 auto", padding: "20px 28px 60px" }}>
      <span className="cm-eyebrow">Exemplo</span>
      <div
        className="cm-card"
        style={{
          marginTop: 12,
          background: "var(--cm-orange-light)",
          borderColor: "#ecd680",
          padding: 28,
          display: "grid",
          gap: 16,
          gridTemplateColumns: "1fr auto",
          alignItems: "center",
        }}
      >
        <div>
          <h3 style={{ fontSize: 19, marginBottom: 10, color: "var(--cm-ink)" }}>Clube Chega junto: como acolher quem chega?</h3>
          <p style={{ fontSize: 14, color: "var(--cm-muted)", maxWidth: 520, lineHeight: 1.6, marginBottom: 12 }}>
            A missão começa no 7º B e leva a turma a investigar como alguém se sente incluído. Cada favo traz uma perspectiva; depois, a resposta alimenta o clube Chega junto e o feed de toda a escola.
          </p>
          <span
            style={{
              display: "inline-block",
              background: "var(--cm-white)",
              borderRadius: 100,
              padding: "6px 12px",
              fontSize: 12,
              fontWeight: 700,
              color: "var(--cm-ink)",
            }}
          >
            Escuta · Empatia · Cooperação
          </span>
        </div>
        <div aria-hidden="true" style={{ width: 76, height: 76, borderRadius: 24, background: "var(--cm-yellow)", display: "grid", placeItems: "center", boxShadow: "0 6px 0 var(--cm-ink)" }}><Hexagon size={42} strokeWidth={2.4} /></div>
      </div>
    </section>
  );
}
