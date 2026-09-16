import React from "react";
import { Check, UserRound, Star, HandHeart } from "lucide-react";

const COLS = [
  {
    role: "mediador",
    eyebrow: "Cria as missões",
    title: "Mediador de apoio",
    Icon: HandHeart,
    items: [
      "Lança missões para turmas ou clubes",
      "Orienta dificuldades, inclusão e conflitos",
      "Ajuda a organizar recursos da escola",
      "Prioriza pedidos de apoio e contexto coletivo",
    ],
  },
  {
    role: "estudante",
    eyebrow: "O protagonista",
    title: "Estudante participante",
    Icon: UserRound,
    items: [
      "Descobre clubes e entra por interesse",
      "Recebe seu favo e contribui com o grupo",
      "Participa da resposta coletiva e compartilha descobertas",
      "Mantém perfil próprio com sua abelha",
    ],
  },
  {
    role: "embaixador",
    eyebrow: "Organiza o clube",
    title: "Embaixador estudantil",
    Icon: Star,
    items: [
      "Convida colegas de outras turmas e apresenta o clube",
      "Divulga atividades e mobiliza participantes",
      "Combina encontros e cuida dos acordos do grupo",
      "Organiza a participação; as missões são criadas pelo mediador",
    ],
  },
];

export default function AudienceSection() {
  const assets = import.meta.env.BASE_URL;
  return (
    <section className="cm-surface cm-font cm-audience" style={{ maxWidth: 1230, margin: "0 auto", padding: "20px 28px 60px" }}>
      <h2 style={{ fontSize: 28, textAlign: "center", letterSpacing: "-0.5px", marginBottom: 36, color: "var(--cm-ink)" }}>
        Quem dá vida à Colmeia
      </h2>
      <p style={{ maxWidth: 720, textAlign: "center", margin: "-24px auto 32px", color: "var(--cm-muted)", lineHeight: 1.6 }}>Três papéis, um mesmo favo. O aluno protagoniza, o embaixador organiza e o mediador permanece disponível como apoio.</p>
      <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
        {COLS.map((col) => (
          <div key={col.title} className={`cm-card cm-role-card cm-role-${col.role}`} style={{ padding: 24 }}>
            <div style={{ width: 46, height: 46, borderRadius: 14, display: "grid", placeItems: "center", background: "var(--cm-yellow)", marginBottom: 14 }}><col.Icon size={24} aria-hidden="true" /></div>
            <span className="cm-eyebrow">{col.eyebrow}</span>
            <h3 style={{ fontSize: 18, marginBottom: 16, color: "var(--cm-ink)" }}>{col.title}</h3>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 11 }}>
              {col.items.map((it) => (
                <li key={it} style={{ fontSize: 14, lineHeight: 1.5, display: "flex", gap: 8, color: "var(--cm-ink)" }}>
                  <Check size={16} aria-hidden="true" style={{ color: "var(--cm-orange)", flexShrink: 0, marginTop: 2 }} />
                  {it}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <img className="cm-role-sticker cm-sticker-flor" src={`${assets}hero/sticker-flor.png`} alt="Abelha Flor fazendo um coração com as mãos" />
      <img className="cm-role-sticker cm-sticker-hatch" src={`${assets}hero/sticker-hatch.png`} alt="Hatch usando óculos escuros" />
      <img className="cm-role-sticker cm-sticker-star" src={`${assets}hero/sticker-star.png`} alt="Estrela abelha acenando" />
    </section>
  );
}
