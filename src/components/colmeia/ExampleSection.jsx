import React from "react";
import { ArrowRight, Clock3, Hexagon, MapPin, MessageCircle, Radio, School, Users, Wrench } from "lucide-react";

const FLOW = [
  { Icon: School, label: "Em sala de aula", title: "A turma é o ponto de partida", text: "O mediador propõe uma missão curta. Com apoio de IA, a Colmeia organiza grupos e favos complementares para o contexto informado." },
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
      ["Uma situação de chegada", "Percebi que quem chega no meio do recreio pode não saber onde ficar.", "Pátio coberto", "Conversei com uma aluna do 6º A"],
      ["Uma barreira à participação", "Entendi que grupos fechados e piadas internas deixam difícil entrar na conversa.", "Corredor das salas", "Conversei com um inspetor"],
      ["Um gesto de acolhimento", "Descobri que perguntar do que a pessoa gosta funciona melhor do que puxá-la pelo braço.", "Biblioteca", "Conversei com uma estudante do 9º A"],
      ["Uma possibilidade de apoio", "A representante de turma pode apresentar a escola e combinar companhia no primeiro intervalo.", "Sala de orientação", "Conversei com a orientadora"],
    ],
  },
  {
    context: "Clube · Frequência 440",
    title: "Como a banda marcial pode convidar mais vozes?",
    description: "Estudantes interessados em música conectam ritmo, convivência e ocupação dos espaços para criar um ensaio aberto.",
    intention: "Expressão, pertencimento e responsabilidade",
    icon: Radio,
    favos: [
      ["Um ritmo que reúne", "A marcação mais simples deixou quem nunca tocou acompanhar com palmas.", "Sala de música", "Conversei com quem toca caixa"],
      ["Um espaço que pode ganhar som", "O pátio permite que outras turmas vejam o ensaio sem interromper as aulas.", "Pátio coberto", "Conversei com a coordenação"],
      ["Uma função além de tocar", "Dá para participar criando cartaz, coreografia e registro do ensaio.", "Sala de artes", "Conversei com o grêmio"],
      ["Um convite para quem nunca participou", "A frase “vem experimentar um instrumento” pareceu mais leve do que “faça inscrição”.", "Quadra", "Conversei com dois alunos do 7º B"],
    ],
  },
  {
    context: "Clube · Circuito Alpha",
    title: "Que problema da escola pode virar protótipo?",
    description: "O clube de robótica parte de uma necessidade observada e combina perspectivas antes de construir qualquer solução.",
    intention: "Criatividade, colaboração e autonomia",
    icon: Wrench,
    favos: [
      ["Um problema observado", "Notei que as plantas ficam dias sem água quando a rotina muda.", "Horta", "Conversei com a turma do 6º B"],
      ["A voz de quem usa o espaço", "A equipe de limpeza precisa de um aviso simples, sem mais uma tarefa complicada.", "Pátio lateral", "Conversei com uma funcionária"],
      ["Um recurso disponível", "Encontramos sensor, garrafa reutilizada e peças do laboratório que já podem virar protótipo.", "Laboratório", "Conversei com o responsável pelo espaço"],
      ["Uma forma simples de testar", "Primeiro vamos acender uma luz quando a terra estiver seca e observar por uma semana.", "Horta", "Conversei com o Clube Pátio Vivo"],
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
          <div className="cm-example-favo-labels"><h4>Favo</h4><h4>O que eu descobri</h4><h4>Meu percurso</h4></div>
          <div className="cm-example-favos">{favos.map(([fragment, discovery, place, person]) => <div key={fragment}><span><Hexagon size={15} aria-hidden="true" />{fragment}</span><strong>{discovery}</strong><span className="cm-example-route"><span><MapPin size={13} aria-hidden="true" />{place}</span><span><MessageCircle size={13} aria-hidden="true" />{person}</span></span></div>)}</div>
          <footer><strong>Soft skills</strong><span>{intention}</span></footer>
        </article>)}
      </div>
    </section>
  );
}
