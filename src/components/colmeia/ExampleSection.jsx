import React from "react";
import { ArrowRight, Clock3, Hexagon, Radio, School, Users, Wrench } from "lucide-react";

const FLOW = [
  { Icon: School, label: "Em sala de aula", title: "A turma é o ponto de partida", text: "O mediador propõe uma missão curta, define a intenção psicossocial e a IA distribui favos complementares." },
  { Icon: Users, label: "Expandindo horizontes", title: "As afinidades atravessam turmas", text: "As respostas revelam interesses, lugares e saberes. Estudantes do 6º ao 9º ano percebem com quem podem continuar criando." },
  { Icon: Hexagon, label: "Escola como comunidade", title: "Os encontros viram clubes", text: "Embaixadores mobilizam colegas e mantêm clubes de música, tecnologia, leitura, movimento e outros interesses." },
];

const EXAMPLES = [
  {
    context: "Sala de aula · 10h",
    title: "Como acolher alguém que acabou de chegar?",
    description: "A missão começa na turma e leva o grupo a observar situações reais de chegada, pertencimento e participação.",
    intention: "Escuta, empatia e cooperação",
    icon: School,
    favos: [
      ["Uma situação de chegada", "Onde alguém pode se sentir deslocado"],
      ["Uma barreira à participação", "O que impede alguém de entrar na conversa"],
      ["Um gesto de acolhimento", "Que atitude abre espaço sem pressionar"],
      ["Uma possibilidade de apoio", "Quem ou o que pode sustentar o acolhimento"],
    ],
  },
  {
    context: "Clube · Frequência 440",
    title: "Como a banda marcial pode convidar mais vozes?",
    description: "Estudantes interessados em música conectam ritmo, convivência e ocupação dos espaços para criar um ensaio aberto.",
    intention: "Expressão, pertencimento e responsabilidade",
    icon: Radio,
    favos: [
      ["Um ritmo que reúne", "Que batida permite a entrada de iniciantes"],
      ["Um espaço que pode ganhar som", "Onde um ensaio aberto aproxima a comunidade"],
      ["Uma função além de tocar", "Como produção, dança e comunicação também participam"],
      ["Um convite para quem nunca participou", "Que linguagem reduz o medo de começar"],
    ],
  },
  {
    context: "Clube · Circuito Alpha",
    title: "Que problema da escola pode virar protótipo?",
    description: "O clube de robótica parte de uma necessidade observada e combina perspectivas antes de construir qualquer solução.",
    intention: "Criatividade, colaboração e autonomia",
    icon: Wrench,
    favos: [
      ["Um problema observado", "Que situação cotidiana merece atenção"],
      ["A voz de quem usa o espaço", "O que estudantes e funcionários realmente precisam"],
      ["Um recurso disponível", "Que materiais e saberes a escola já possui"],
      ["Uma forma simples de testar", "Como validar a ideia antes de construir tudo"],
    ],
  },
];

export default function ExampleSection() {
  return (
    <section className="cm-surface cm-font cm-practice-section">
      <span className="cm-eyebrow">Uma experiência que continua</span>
      <h2>Da sala de aula aos clubes: como a Colmeia entra no dia real da escola.</h2>
      <p className="cm-practice-intro">Uma missão de turma abre o primeiro encontro. As afinidades que aparecem nas respostas expandem os horizontes e ajudam os estudantes a criar clubes, transformando a escola em uma comunidade viva.</p>

      <div className="cm-practice-flow" aria-label="Da sala de aula à comunidade escolar">
        {FLOW.map(({ Icon, label, title, text }, index) => <React.Fragment key={label}>
          <article><Icon aria-hidden="true" /><span>{label}</span><h3>{title}</h3><p>{text}</p></article>
          {index < FLOW.length - 1 && <ArrowRight className="cm-practice-arrow" aria-hidden="true" />}
        </React.Fragment>)}
      </div>

      <div className="cm-practice-context"><Clock3 aria-hidden="true" /><p><strong>Na prática:</strong> o celular orienta por poucos minutos; a investigação, a conversa e a construção acontecem nos espaços da escola.</p></div>

      <div className="cm-mission-examples">
        {EXAMPLES.map(({ context, title, description, intention, icon: Icon, favos }) => <article className="cm-mission-example" key={title}>
          <div className="cm-mission-example-head"><Icon aria-hidden="true" /><span>{context}</span></div>
          <h3>{title}</h3>
          <p>{description}</p>
          <div className="cm-example-favo-labels"><h4>Favo</h4><h4>O que descobrir</h4></div>
          <div className="cm-example-favos">{favos.map(([fragment, discovery]) => <div key={fragment}><span><Hexagon size={15} aria-hidden="true" />{fragment}</span><strong>{discovery}</strong></div>)}</div>
          <footer><strong>Intenção psicossocial</strong><span>{intention}</span></footer>
        </article>)}
      </div>
    </section>
  );
}
