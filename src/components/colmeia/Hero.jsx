import React from "react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="cm-hero cm-surface cm-font">
      <div className="cm-hero-content">
          <span className="cm-eyebrow cm-hero-eyebrow">Para turmas do 6º ao 9º ano</span>
          <h1>
            Uma escola de <em style={{ fontStyle: "normal", color: "var(--cm-orange)" }}>conexões</em>, construída pelos alunos.
          </h1>
          <p className="cm-hero-lead">
            A primeira missão nasce na turma. Depois, clubes conectam estudantes do 6º ao 9º ano, embaixadores mobilizam os grupos e cada favo completa uma resposta coletiva.
          </p>
          <div className="flex flex-wrap gap-3 cm-hero-actions">
            <Link to="/app?visao=aluno" className="cm-btn cm-btn-primary">Explorar como aluno</Link>
            <Link to="/app?visao=mediador" className="cm-btn cm-btn-ghost">Explorar como mediador</Link>
          </div>
          <p className="cm-hero-note">
            Funciona direto no navegador, em celulares que a escola já tem.
          </p>
      </div>
    </section>);

}
