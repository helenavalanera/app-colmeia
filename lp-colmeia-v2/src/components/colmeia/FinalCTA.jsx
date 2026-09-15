import React from "react";
import { Link } from "react-router-dom";

export default function FinalCTA() {
  return (
    <section className="cm-font" style={{ maxWidth: 1230, margin: "0 auto", padding: "48px 28px 70px", textAlign: "center", background: "var(--cm-yellow)", borderRadius: 28, marginTop: 10 }}>
      <h2 style={{ fontSize: 30, letterSpacing: "-0.5px", maxWidth: 600, margin: "0 auto 14px", color: "var(--cm-ink)" }}>
        Sua escola tem saberes que merecem se encontrar.
      </h2>
      <p style={{ maxWidth: 520, margin: "0 auto 24px", color: "var(--cm-muted)", fontSize: 15, lineHeight: 1.6 }}>
        A Colmeia usa o celular por poucos minutos para criar algo que nenhuma tela consegue substituir: estudantes aprendendo, colaborando e saindo da própria bolha.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link to="/app" className="cm-btn cm-btn-orange">Explorar a demonstração</Link>
        <Link to="/app" className="cm-btn cm-btn-ghost">Conhecer os clubes</Link>
      </div>
    </section>
  );
}