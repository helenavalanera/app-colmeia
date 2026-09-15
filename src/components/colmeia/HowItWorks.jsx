import React from "react";

const STEPS = [
  { n: 1, title: "A missão começa na turma", text: "O mediador lança uma pergunta para uma turma. O celular apresenta o ponto de partida e devolve os estudantes para a escola." },
  { n: 2, title: "Uma missão, diferentes favos", text: "Cada estudante acessa apenas seu fragmento. O caminho e a resposta surgem quando as partes se encontram presencialmente." },
  { n: 3, title: "As turmas conectam saberes", text: "Estudantes do 6º ao 9º ano exercitam escuta, empatia, cooperação e liderança em uma resposta coletiva." },
  { n: 4, title: "Os clubes mantêm a rede viva", text: "Interesses levam a clubes conduzidos por embaixadores. As descobertas retornam ao feed da escola e inspiram novos encontros." },
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
              display: "flex",
              flexDirection: "column",
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
            <p style={{ fontSize: 13, color: "var(--cm-muted)", lineHeight: 1.5, margin: 0, marginTop: "auto" }}>
              {s.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
