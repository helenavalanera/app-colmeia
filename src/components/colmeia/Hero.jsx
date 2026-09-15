import React from "react";
import { Link } from "react-router-dom";
import Bee3D from "./Bee3D";

export default function Hero() {
  return (
    <section className="cm-surface cm-font" style={{ padding: "40px 28px 32px", maxWidth: 1230, margin: "0 auto" }}>
      <div className="co-hero-grid">
        <div>
          <span className="cm-eyebrow" style={{ background: "var(--cm-yellow)", padding: "6px 12px", borderRadius: 8, color: "var(--cm-ink)" }}>Para turmas do 6º ao 9º ano</span>
          <h1 style={{ fontSize: "clamp(34px, 4.5vw, 58px)", lineHeight: 1.06, letterSpacing: "-2px", fontWeight: 800, marginTop: 14, color: "var(--cm-ink)" }}>
            Uma escola de <em style={{ fontStyle: "normal", color: "var(--cm-orange)" }}>conexões</em>, construída pelos alunos.
          </h1>
          <p style={{ maxWidth: 400, color: "var(--cm-muted)", fontSize: 14, lineHeight: 1.6, marginTop: 18 }}>
            Comunidades e clubes conectam estudantes do 6º ao 9º ano. Embaixadores mobilizam os grupos, favos compõem respostas coletivas e o mediador apoia quando necessário.
          </p>
          <div className="flex flex-wrap gap-3" style={{ marginTop: 22 }}>
            <Link to="/app?visao=aluno" className="cm-btn cm-btn-primary">Explorar como aluno</Link>
            <Link to="/app?visao=mediador" className="cm-btn cm-btn-ghost">Explorar como mediador</Link>
          </div>
          <p style={{ fontSize: 12, color: "var(--cm-muted)", marginTop: 18, maxWidth: 420 }}>
            Funciona direto no navegador, em celulares que a escola já tem.
          </p>
        </div>
        <div className="flex justify-center">
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", inset: "-20px -10px", background: "radial-gradient(ellipse at center, #FFAC00 0%, #ffe4bc 50%, transparent 72%)", borderRadius: 30 }} />
            <Bee3D size={290} />
          </div>
        </div>
      </div>
    </section>);

}