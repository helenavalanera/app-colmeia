import React, { useState } from "react";

const MISSIONS = [
  { id: "water", title: "Por onde a água passa?", scope: "class", context: "7º B", status: "active", groups: 3, members: 9, confirmed: 4, bncc: ["9 · Empatia e cooperação", "10 · Responsabilidade e cidadania"] },
  { id: "book", title: "Um final, muitas vozes", scope: "community", context: "Plot Twist & Páginas", status: "active", groups: 2, members: 6, confirmed: 2, bncc: ["4 · Comunicação", "7 · Argumentação"] },
  { id: "fact", title: "Colmeia de Checagem de Fatos", scope: "class", context: "8º B", status: "active", groups: 4, members: 12, confirmed: 7, bncc: ["4 · Comunicação", "7 · Argumentação"] },
  { id: "patio", title: "Cinco olhares para o pátio", scope: "class", context: "7º A", status: "scheduled", groups: 2, members: 10, confirmed: 0, bncc: ["9 · Empatia e cooperação"] },
];

export default function TeacherPhone() {
  const [missions] = useState(MISSIONS);
  const [context, setContext] = useState("all");

  const filtered = missions.filter((m) => context === "all" || `${m.scope}:${m.context}` === context);
  const active = filtered.filter((m) => m.status === "active");
  const uniqueStudents = new Set(filtered.filter((m) => m.status === "active").flatMap((m) => [`${m.context}-g${m.groups}`])).size;
  const classes = new Set(filtered.filter((m) => m.scope === "class").map((m) => m.context)).size;
  const clubs = new Set(filtered.filter((m) => m.scope === "community").map((m) => m.context)).size;
  const bncc = [...new Set(filtered.flatMap((m) => m.bncc))];

  return (
    <div className="cm-device cm-font" style={{ width: "100%", maxWidth: 410, height: 760, display: "flex", flexDirection: "column" }}>
      <div style={{ background: "var(--cm-white)", padding: "15px 22px 8px", fontSize: 10, fontWeight: 700, display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--cm-line)" }}>
        <span>colmeia<span style={{ color: "var(--cm-orange)" }}>.</span> · mediador</span>
        <span>86% 🔋</span>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 18px", background: "var(--cm-paper)" }}>
        <p className="cm-eyebrow">Conexões que você cultiva</p>
        <h2 style={{ fontSize: 22, marginTop: 4, color: "var(--cm-ink)" }}>Olá, Helena.</h2>
        <p style={{ fontSize: 12, color: "var(--cm-muted)", marginTop: 4 }}>Um olhar para o coletivo.</p>

        <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginTop: 16, marginBottom: 6 }}>Acompanhar contexto</label>
        <select
          value={context} onChange={(e) => setContext(e.target.value)}
          style={{ width: "100%", border: "1px solid #d9ddcf", borderRadius: 12, padding: 12, background: "#fffefb", fontSize: 13 }}
        >
          <option value="all">Todas as turmas e clubes</option>
          <option value="class:7º B">Turma 7º B</option>
          <option value="class:7º A">Turma 7º A</option>
          <option value="class:8º B">Turma 8º B</option>
          <option value="community:Plot Twist & Páginas">Clube Plot Twist & Páginas</option>
        </select>

        <div className="grid gap-3" style={{ gridTemplateColumns: "1fr 1fr", marginTop: 16 }}>
          <Stat value={active.length} label="Missões em andamento" />
          <Stat value={active.reduce((s, m) => s + m.members, 0)} label="Estudantes nas missões ativas" />
          <Stat value={classes} label="Turmas com missões" />
          <Stat value={clubs} label="Clubes com missões" />
        </div>

        <div style={{ background: "var(--cm-orange-light)", borderRadius: 15, padding: 14, marginTop: 14, fontSize: 12, lineHeight: 1.6 }}>
          <strong>Visão coletiva, nunca individual.</strong>
          <p style={{ color: "#984422", marginTop: 4 }}>
            Os números mostram a participação da turma. Nenhum dado pessoal de cada estudante é exposto.
          </p>
        </div>

        <h3 style={{ fontSize: 15, fontWeight: 750, marginTop: 22, marginBottom: 12, display: "flex", justifyContent: "space-between" }}>
          <span>Missões em movimento</span>
          <span style={{ fontSize: 11, color: "var(--cm-muted)", fontWeight: 600 }}>{active.length} ativas</span>
        </h3>
        <div style={{ display: "grid", gap: 12 }}>
          {active.map((m) => (
            <MissionCard key={m.id} mission={m} />
          ))}
        </div>

        <div className="cm-card" style={{ marginTop: 16 }}>
          <span className="cm-pill cm-pill-lavender">BNCC · Competências gerais</span>
          <h3 style={{ fontSize: 14, marginTop: 10, color: "var(--cm-ink)" }}>Intencionalidade em cada encontro</h3>
          <div className="flex flex-wrap gap-2" style={{ marginTop: 10 }}>
            {bncc.map((b) => (
              <span key={b} className="cm-pill">{b}</span>
            ))}
          </div>
          <p style={{ fontSize: 11, color: "var(--cm-muted)", marginTop: 10 }}>
            Objetivos vinculados às propostas. Participação é um registro da atividade, não uma avaliação individual.
          </p>
        </div>
      </div>
      <div style={{ background: "var(--cm-white)", borderTop: "1px solid var(--cm-line)", padding: "10px 8px 14px", display: "flex", justifyContent: "space-around" }}>
        {[["📊", "Início"], ["⬡", "Missões"], ["👥", "Comunidades"], ["👤", "Perfil"]].map(([icon, label], i) => (
          <button key={label} style={{
            border: 0, background: i === 0 ? "var(--cm-lime)" : "transparent",
            color: i === 0 ? "var(--cm-green)" : "var(--cm-muted)",
            fontWeight: i === 0 ? 800 : 600, fontSize: 9, borderRadius: 11,
            padding: "8px 5px", minWidth: 52, display: "grid", justifyItems: "center", gap: 4, cursor: "pointer",
          }}>
            <span style={{ fontSize: 16 }}>{icon}</span>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div style={{ background: "#f0f2e7", borderRadius: 15, padding: 16 }}>
      <b style={{ fontSize: 26, display: "block", letterSpacing: "-1px", marginBottom: 4, color: "var(--cm-ink)" }}>{value}</b>
      <span style={{ fontSize: 11, color: "var(--cm-muted)" }}>{label}</span>
    </div>
  );
}

function MissionCard({ mission }) {
  const pct = Math.round((mission.confirmed / mission.members) * 100);
  return (
    <div className="cm-card" style={{ padding: 16 }}>
      <div className="flex justify-between items-start" style={{ marginBottom: 8 }}>
        <span className="cm-pill cm-pill-warm">{mission.scope === "community" ? "Clube" : "Turma"} {mission.context}</span>
        <span className="cm-pill">{mission.groups} grupos</span>
      </div>
      <h3 style={{ fontSize: 15, color: "var(--cm-ink)" }}>{mission.title}</h3>
      <div style={{ height: 7, background: "#e7eadc", borderRadius: 20, overflow: "hidden", margin: "12px 0 6px" }}>
        <div style={{ height: "100%", background: "#729050", width: `${pct}%`, borderRadius: 20 }} />
      </div>
      <div className="flex justify-between" style={{ fontSize: 11, color: "var(--cm-muted)" }}>
        <span>{mission.confirmed} de {mission.members} confirmações (agregado)</span>
        <span>{pct}%</span>
      </div>
    </div>
  );
}