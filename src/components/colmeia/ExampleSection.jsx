import React from "react";
import { Hexagon, HeartHandshake } from "lucide-react";

const FRAGMENTS = ["Uma situação de chegada", "Uma experiência de acolhimento", "Uma barreira à participação", "Uma possibilidade de apoio"];

export default function ExampleSection() {
  return (
    <section className="cm-surface cm-font" style={{ maxWidth: 1230, margin: "0 auto", padding: "20px 28px 60px" }}>
      <span className="cm-eyebrow">Uma missão de verdade</span>
      <div
        className="cm-card cm-example-card"
        style={{
          marginTop: 12,
          background: "var(--cm-orange-light)",
          borderColor: "#ecd680",
          padding: 28,
          display: "grid",
          gap: 16,
          gridTemplateColumns: "minmax(0, 1.35fr) minmax(240px, .65fr)",
          alignItems: "stretch",
        }}
      >
        <div>
          <h3 style={{ fontSize: 24, marginBottom: 10, color: "var(--cm-ink)" }}>Como receber alguém que acabou de chegar à escola?</h3>
          <p style={{ fontSize: 12, fontWeight: 800, color: "var(--cm-green-deep)" }}>Comunidade · Escola inteira<br />Clube · Chega junto</p>
          <p style={{ fontSize: 14, color: "var(--cm-muted)", maxWidth: 520, lineHeight: 1.6, marginBottom: 12 }}>
            O clube Chega junto reúne estudantes de diferentes turmas para construir um roteiro de acolhimento com ações concretas. Cada participante recebe um favo: uma parte da resposta que ninguém constrói sozinho.
          </p>
          <h4 style={{ fontSize: 13, margin: "18px 0 8px" }}>Favos complementares</h4>
          <div style={{ display: "grid", gap: 8 }}>{FRAGMENTS.map((fragment) => <div key={fragment} style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 12 }}><Hexagon size={15} color="var(--cm-orange)" aria-hidden="true" />{fragment}</div>)}</div>
        </div>
        <div style={{ background: "var(--cm-yellow)", borderRadius: 18, padding: 22, color: "var(--cm-ink)" }}><HeartHandshake size={34} aria-hidden="true" /><h4 style={{ fontSize: 15, margin: "14px 0 8px" }}>Intenção psicossocial</h4><p style={{ fontSize: 13, lineHeight: 1.55, margin: 0 }}>Escuta, empatia, cooperação e responsabilidade. O mediador ajuda quando o grupo pede orientação ou encontra uma dificuldade.</p></div>
      </div>
    </section>
  );
}
