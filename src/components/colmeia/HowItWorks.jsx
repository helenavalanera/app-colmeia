import React from "react";

const STEPS = [
  { n: 1, title: "Entra no ecossistema da escola", text: "A primeira missão pode nascer na turma. A partir dela, o aluno conhece a comunidade escolar e os clubes que vivem dentro dela." },
  { n: 2, title: "Entra em um clube", text: "Por interesse ou convite de um embaixador. O clube reúne estudantes de diferentes turmas e anos." },
  { n: 3, title: "O clube recebe uma missão", text: "O mediador lança a experiência e o embaixador ajuda o grupo a se organizar. A intenção é convivência e troca de saberes." },
  { n: 4, title: "Cada um recebe seu favo", text: "O app mostra apenas o fragmento daquele participante e nunca aponta quem tem a parte complementar." },
  { n: 5, title: "Se encontram e conectam", text: "Os estudantes conversam presencialmente, compartilham perspectivas e descobrem como os fragmentos se relacionam." },
  { n: 6, title: "Pedem pólen se precisarem", text: "O grupo chama o mediador para apoiar uma dificuldade, incluir alguém sem celular ou conceder mais tempo." },
  { n: 7, title: "Constroem a resposta coletiva", text: "O último check-in libera o registro em texto e/ou foto. O grupo decide se também compartilha a síntese no feed da escola." },
];

export default function HowItWorks() {
  return (
    <section className="cm-surface cm-font" style={{ maxWidth: 1230, margin: "0 auto", padding: "20px 28px 60px" }}>
      <div style={{ textAlign: "center", marginBottom: 8 }}><span className="cm-eyebrow">A jornada central</span></div>
      <h2 style={{ fontSize: 28, letterSpacing: "-0.5px", textAlign: "center", marginBottom: 36, color: "var(--cm-ink)" }}>
        Uma missão. Partes diferentes. Uma síntese em comum.
      </h2>
      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(235px, 1fr))" }}>
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
