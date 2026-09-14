import React from "react";

const CARDS = [
  { icon: "🫧", title: "Bolhas sociais", text: "Os mesmos grupos se repetem sempre, e alguns estudantes ficam à margem da turma." },
  { icon: "📵", title: "Distração sem propósito", text: "O celular entra na aula, mas sem uma dinâmica pedagógica clara por trás dele." },
  { icon: "⏳", title: "Sobrecarga docente", text: "Organizar grupos e acompanhar a colaboração da turma exige um tempo que a escola não tem." },
];

export default function ProblemSection() {
  return (
    <section className="cm-surface cm-font" style={{ maxWidth: 1230, margin: "0 auto", padding: "50px 28px" }}>
      <span className="cm-eyebrow">O problema</span>
      <h2 style={{ fontSize: 30, lineHeight: 1.2, letterSpacing: "-0.5px", maxWidth: 640, marginTop: 12, color: "var(--cm-ink)" }}>
        Estão na mesma sala, mas nem sempre estão juntos.
      </h2>
      <p style={{ maxWidth: 640, color: "var(--cm-muted)", fontSize: 14, lineHeight: 1.6, marginTop: 14, marginBottom: 28 }}>
        O celular pode intensificar distrações e manter estudantes sempre nos mesmos grupos. Professores precisam promover participação, colaboração e pertencimento — sem virar fiscais da vida digital de cada aluno.
      </p>
      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
        {CARDS.map((c) => (
          <div key={c.title} className="cm-card">
            <span style={{ fontSize: 24, display: "block", marginBottom: 10 }}>{c.icon}</span>
            <h3 style={{ fontSize: 16, marginBottom: 8, color: "var(--cm-ink)" }}>{c.title}</h3>
            <p style={{ fontSize: 13, color: "var(--cm-muted)", lineHeight: 1.5, margin: 0 }}>{c.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}