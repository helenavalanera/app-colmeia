import React from "react";

const STEPS = [
  { n: 1, title: "Alunos se encontram em comunidades e clubes", text: "Interesses e propósitos conectam estudantes de diferentes turmas. Embaixadores convidam e organizam o grupo." },
  { n: 2, title: "Uma missão, diferentes favos", text: "Cada estudante acessa seu próprio fragmento. A resposta coletiva depende das contribuições de todos." },
  { n: 3, title: "A conversa acontece na escola", text: "O clube troca experiências presencialmente, exercitando escuta, empatia e cooperação. O mediador oferece apoio." },
  { n: 4, title: "A descoberta volta para a comunidade", text: "O grupo registra sua resposta e compartilha saberes que outros clubes podem conhecer e continuar." },
];

export default function HowItWorks() {
  return (
    <section className="cm-surface cm-font" style={{ maxWidth: 1230, margin: "0 auto", padding: "20px 28px 60px" }}>
      <h2 style={{ fontSize: 28, letterSpacing: "-0.5px", textAlign: "center", marginBottom: 36, color: "var(--cm-ink)" }}>
        Uma missão. Partes diferentes. Uma solução em comum.
      </h2>
      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        {STEPS.map((s) => (
          <div
            key={s.n}
            style={{
              background: "var(--cm-lime)",
              border: "1px solid var(--cm-lime-deep)",
              borderRadius: "var(--cm-radius)",
              padding: 20,
              display: "flex",          // <-- 1. Transforma o card em flexbox
              flexDirection: "column",   // <-- 2. Empilha os elementos em coluna
            }}
          >
            <div
              style={{
                width: 30, height: 30, borderRadius: "50%",
                background: "var(--cm-yellow)", color: "var(--cm-ink)",
                display: "grid", placeItems: "center",
                fontWeight: 800, fontSize: 13, marginBottom: 12,
              }}
            >
              {s.n}
            </div>
            <h3 style={{ fontSize: 15, marginBottom: 6, color: "var(--cm-ink)" }}>{s.title}</h3>
            {/* <-- 3. margin-top: auto empurra o parágrafo para a base alinhada */}
            <p style={{ fontSize: 13, color: "var(--cm-muted)", lineHeight: 1.5, margin: 0, marginTop: "auto" }}>
              {s.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}