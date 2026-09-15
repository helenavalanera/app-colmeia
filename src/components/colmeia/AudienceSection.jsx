import React from "react";
import { Check, UserRound, Star, HandHeart } from "lucide-react";

const COLS = [
  {
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
    eyebrow: "Organiza o clube",
    title: "Embaixador estudantil",
    Icon: Star,
    items: [
      "Convida colegas de outras turmas e apresenta o clube",
      "Combina encontros e cuida dos acordos do grupo",
      "Coordena a preparação das missões",
      "Acessa ferramentas na própria visão do aluno",
    ],
  },
  {
    eyebrow: "Disponível quando chamado",
    title: "Mediador de apoio",
    Icon: HandHeart,
    items: [
      "Orienta dificuldades, inclusão e conflitos",
      "Ajuda a organizar recursos da escola",
      "Prioriza pedidos de apoio e contexto coletivo",
      "Não dirige cada encontro nem autoriza publicações",
    ],
  },
];

export default function AudienceSection() {
  return (
    <section className="cm-surface cm-font" style={{ maxWidth: 1230, margin: "0 auto", padding: "20px 28px 60px" }}>
      <h2 style={{ fontSize: 28, textAlign: "center", letterSpacing: "-0.5px", marginBottom: 36, color: "var(--cm-ink)" }}>
        Quem dá vida à Colmeia
      </h2>
      <p style={{ maxWidth: 720, textAlign: "center", margin: "-24px auto 32px", color: "var(--cm-muted)", lineHeight: 1.6 }}>Três papéis, um mesmo favo. O aluno protagoniza, o embaixador organiza e o mediador permanece disponível como apoio.</p>
      <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
        {COLS.map((col) => (
          <div key={col.title} className="cm-card" style={{ padding: 24 }}>
            <div style={{ width: 46, height: 46, borderRadius: 14, display: "grid", placeItems: "center", background: "var(--cm-yellow)", marginBottom: 14 }}><col.Icon size={24} aria-hidden="true" /></div>
            <span className="cm-eyebrow">{col.eyebrow}</span>
            <h3 style={{ fontSize: 17, marginBottom: 16, color: "var(--cm-ink)" }}>{col.title}</h3>
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
    </section>
  );
}
