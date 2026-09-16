import React from "react";

const STEPS = [
  { n: 1, title: "Explora o que a escola oferece", text: "No app, o aluno conhece clubes, espaços, missões e rituais que antes poderiam passar despercebidos." },
  { n: 2, title: "Parte da turma ou de um clube", text: "A turma abre a primeira experiência; os clubes permitem continuar explorando interesses com estudantes de outros anos." },
  { n: 3, title: "Recebe uma missão e seu favo", text: "A Colmeia distribui perspectivas complementares. Cada participante abre apenas o próprio fragmento." },
  { n: 4, title: "Segue uma pista pela escola", text: "O celular orienta o próximo passo e volta para o bolso. A descoberta acontece em espaços, conversas e situações reais." },
  { n: 5, title: "Conecta outras perspectivas", text: "Os estudantes se encontram presencialmente e descobrem como lugares, saberes e fragmentos se relacionam." },
  { n: 6, title: "Pedem pólen se precisarem", text: "O grupo chama o mediador para apoiar uma dificuldade, incluir alguém sem celular ou conceder mais tempo." },
  { n: 7, title: "Constroem a resposta coletiva", text: "O último check-in libera o registro em texto e/ou foto. O grupo decide se também compartilha a síntese no feed da escola." },
];

export default function HowItWorks() {
  return (
    <section className="cm-surface cm-font" style={{ maxWidth: 1230, margin: "0 auto", padding: "20px 28px 60px" }}>
      <div style={{ textAlign: "center", marginBottom: 8 }}><span className="cm-eyebrow">A jornada central</span></div>
      <h2 style={{ fontSize: 28, letterSpacing: "-0.5px", textAlign: "center", marginBottom: 36, color: "var(--cm-ink)" }}>
        O app abre a porta. A escola inteira vira experiência.
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
            <h3 style={{ fontSize: 17, lineHeight: 1.3, marginBottom: 7, color: "var(--cm-ink)" }}>{s.title}</h3>
            <p style={{ fontSize: 14, color: "var(--cm-muted)", lineHeight: 1.6, margin: 0, marginTop: "auto" }}>
              {s.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
