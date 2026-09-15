import React from "react";
import { School, UsersRound, Target, Hexagon, Handshake, ChevronRight } from "lucide-react";

const LEVELS = [
  { level: "Nível 1", title: "Comunidade", Icon: School, text: "A escola é a comunidade: um ecossistema que abriga clubes, espaços e conexões." },
  { level: "Nível 2", title: "Clube", Icon: UsersRound, text: "Grupo que vive dentro da escola e pode reunir estudantes de diferentes turmas." },
  { level: "Nível 3", title: "Missão", Icon: Target, text: "Experiência lançada para uma turma ou clube, sempre com intenção psicossocial." },
  { level: "Nível 4", title: "Favo", Icon: Hexagon, text: "Fragmento complementar e privado que só cada participante consegue abrir." },
  { level: "Nível 5", title: "Resposta coletiva", Icon: Handshake, text: "Síntese que relaciona os fragmentos e registra o que o grupo construiu." },
];

export default function ProductHierarchy() {
  return (
    <section className="cm-surface cm-font cm-hierarchy" aria-labelledby="hierarchy-title">
      <span className="cm-eyebrow">A hierarquia do produto</span>
      <h2 id="hierarchy-title">Da escola à resposta coletiva, uma única teia.</h2>
      <p className="cm-hierarchy-intro">
        A escola é uma comunidade: um ecossistema. Dentro dela vivem os clubes; clubes e turmas recebem missões; as missões distribuem favos; e os favos se conectam numa resposta que ninguém constrói sozinho.
      </p>
      <div className="cm-hierarchy-flow">
        {LEVELS.map(({ level, title, Icon, text }, index) => (
          <React.Fragment key={title}>
            <article className="cm-hierarchy-card">
              <div className="cm-hierarchy-icon"><Icon size={25} strokeWidth={2.1} aria-hidden="true" /></div>
              <span>{level}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
            {index < LEVELS.length - 1 && <ChevronRight className="cm-hierarchy-arrow" size={22} aria-hidden="true" />}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}
