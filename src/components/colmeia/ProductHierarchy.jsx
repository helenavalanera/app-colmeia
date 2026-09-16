import React from "react";
import { School, UsersRound, GraduationCap, Target, Hexagon, Handshake, ChevronRight } from "lucide-react";

const LEVELS = [
  { level: "Nível 1", title: "Comunidade", Icon: School, text: "A escola é a comunidade: um ecossistema que abriga clubes, espaços e conexões." },
  { level: "Nível 2", branches: [
    { title: "Turmas", Icon: GraduationCap, text: "Ponto de partida para a primeira missão e para descobrir interesses que já existem na escola." },
    { title: "Clubes", Icon: UsersRound, text: "Grupos por afinidade que conectam estudantes de diferentes turmas e mantêm os encontros vivos." },
  ] },
  { level: "Nível 3", title: "Missão", Icon: Target, text: "Experiência que mobiliza soft skills como escuta, empatia, cooperação, autonomia e responsabilidade." },
  { level: "Nível 4", title: "Favo", Icon: Hexagon, text: "Fragmento complementar e privado que só cada participante consegue abrir." },
  { level: "Nível 5", title: "Resposta coletiva", Icon: Handshake, text: "Síntese que relaciona os fragmentos e registra o que o grupo construiu." },
];

export default function ProductHierarchy() {
  return (
    <section className="cm-surface cm-font cm-hierarchy" aria-labelledby="hierarchy-title">
      <span className="cm-eyebrow">A hierarquia do produto</span>
      <h2 id="hierarchy-title">Da escola à resposta coletiva, uma única teia.</h2>
      <p className="cm-hierarchy-intro">
        A escola é uma comunidade: um ecossistema. Os estudantes começam pelas turmas e ampliam suas conexões nos clubes; ambos podem receber missões, distribuir favos e construir respostas coletivas.
      </p>
      <div className="cm-hierarchy-flow">
        {LEVELS.map(({ level, title, Icon, text, branches }, index) => (
          <React.Fragment key={level}>
            <article className={`cm-hierarchy-card${branches ? " cm-hierarchy-branches" : ""}`}>
              <span>{level}</span>
              {branches ? <div className="cm-hierarchy-branch-stack">{branches.map(({ title: branchTitle, Icon: BranchIcon, text: branchText }) => <div key={branchTitle}><div className="cm-hierarchy-icon"><BranchIcon size={22} strokeWidth={2.1} aria-hidden="true" /></div><section><h3>{branchTitle}</h3><p>{branchText}</p></section></div>)}</div> : <><div className="cm-hierarchy-icon"><Icon size={25} strokeWidth={2.1} aria-hidden="true" /></div><h3>{title}</h3><p>{text}</p></>}
            </article>
            {index < LEVELS.length - 1 && <ChevronRight className="cm-hierarchy-arrow" size={22} aria-hidden="true" />}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}
