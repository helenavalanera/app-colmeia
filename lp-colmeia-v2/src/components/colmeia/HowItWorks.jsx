import React from "react";

const STEPS = [
  { n: 1, title: "O educador cria uma Colmeia", text: "Define uma missão curta, o tempo da atividade, e aprova com poucos toques." },
  { n: 2, title: "Cada estudante recebe um favo", text: "Nenhum celular entrega a missão inteira — só uma parte dela." },
  { n: 3, title: "A turma se encontra para resolver", text: "Duplas e trios precisam conversar e trocar informações presencialmente." },
  { n: 4, title: "A turma avança junta", text: "O resultado é coletivo, sem ranking individual — o professor vê só o agregado." },
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
            <p style={{ fontSize: 13, color: "var(--cm-muted)", lineHeight: 1.5, margin: 0 }}>{s.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}