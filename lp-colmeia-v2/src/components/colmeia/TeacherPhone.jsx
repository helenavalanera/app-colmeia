import React, { useState } from "react";
import { useDemoState, BNCC_OPTIONS, bnccToSkills } from "@/state/DemoState";

const MISSIONS = [
  { id: "water", title: "Por onde a água passa?", scope: "class", context: "7º B", status: "active", groups: 3, members: 9, confirmed: 4, bncc: ["9 · Empatia e cooperação", "10 · Responsabilidade e cidadania"] },
  { id: "book", title: "Um final, muitas vozes", scope: "community", context: "Plot Twist & Páginas", status: "active", groups: 2, members: 6, confirmed: 2, bncc: ["4 · Comunicação", "7 · Argumentação"] },
  { id: "fact", title: "Colmeia de Checagem de Fatos", scope: "class", context: "8º B", status: "active", groups: 4, members: 12, confirmed: 7, bncc: ["4 · Comunicação", "7 · Argumentação"] },
  { id: "patio", title: "Cinco olhares para o pátio", scope: "class", context: "7º A", status: "scheduled", groups: 2, members: 10, confirmed: 0, bncc: ["9 · Empatia e cooperação"] },
];


const EMPTY_DRAFT = { title: "", scope: "class", context: "7º B", description: "", groups: 3, minutes: 15, mixGroups: false, bncc: [] };

const COMMUNITIES = [
  { id: "plot", name: "Plot Twist & Páginas", ageRange: "11 a 14 anos", theme: "Leitura e escrita" },
];

const ROLES = ["Professor(a)", "Bibliotecário(a)", "Coordenador(a) pedagógico(a)", "Outro educador"];

export default function TeacherPhone() {
  const demo = useDemoState();
  const [tab, setTab] = useState("dashboard");
  const [missions, setMissions] = useState(MISSIONS);
  const [context, setContext] = useState("all");
  const [wizardStep, setWizardStep] = useState(null); // null | 1 | 2 | 3 | "review"
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [reportMission, setReportMission] = useState(null);
  const [communities, setCommunities] = useState(COMMUNITIES);
  const [feedCommunity, setFeedCommunity] = useState(null);
  const [profile, setProfile] = useState({ name: "Helena", role: ROLES[0] });

  function startWizard() {
    setDraft(EMPTY_DRAFT);
    setWizardStep(1);
  }

  function publishMission(status) {
    setMissions((prev) => [
      ...prev,
      {
        id: `m-${prev.length + 1}`,
        title: draft.title || "Missão sem título",
        scope: draft.scope,
        context: draft.context,
        status, // "active" | "scheduled" | "draft"
        groups: draft.groups,
        members: draft.groups * 3,
        confirmed: 0,
        bncc: draft.bncc.length ? draft.bncc : ["Sem objetivo BNCC vinculado"],
      },
    ]);
    setWizardStep(null);
    setTab("dashboard");
  }

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
        {wizardStep && (
          <CriarMissaoWizard
            step={wizardStep} setStep={setWizardStep}
            draft={draft} setDraft={setDraft}
            onCancel={() => setWizardStep(null)}
            onPublish={publishMission}
          />
        )}
        {reportMission && !wizardStep && (
          <RelatorioScreen mission={reportMission} onBack={() => setReportMission(null)} />
        )}
        {!wizardStep && !reportMission && tab === "dashboard" && (
          <>
            <p className="cm-eyebrow">Conexões que você cultiva</p>
            <h2 style={{ fontSize: 22, marginTop: 4, color: "var(--cm-ink)" }}>Olá, {profile.name}.</h2>
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

            <button onClick={startWizard} className="cm-btn cm-btn-primary" style={{ width: "100%", marginTop: 14 }}>
              + Criar missão
            </button>

            {demo.pendingRequests.length > 0 && (
              <button
                onClick={() => setTab("pedidos")}
                className="cm-btn cm-btn-orange"
                style={{ width: "100%", marginTop: 14, justifyContent: "space-between" }}
              >
                <span>🔔 {demo.pendingRequests.length} pedido{demo.pendingRequests.length > 1 ? "s" : ""} do grupo</span>
                <span>→</span>
              </button>
            )}

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
                <MissionCard
                  key={m.id}
                  mission={m.id === demo.mission.id ? { ...m, bncc: demo.mission.bncc } : m}
                  onOpenReport={() => setReportMission(m.id === demo.mission.id ? { ...m, bncc: demo.mission.bncc } : m)}
                  onEditBncc={m.id === demo.mission.id ? demo.setMissionBncc : undefined}
                />
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
          </>
        )}

        {tab === "pedidos" && <PedidosScreen demo={demo} onBack={() => setTab("dashboard")} />}

        {tab === "comunidades" && !feedCommunity && (
          <ComunidadesMediadorScreen
            communities={communities}
            onCreate={(c) => setCommunities((prev) => [...prev, { id: `c-${prev.length + 1}`, ...c }])}
            onOpenFeed={setFeedCommunity}
          />
        )}
        {tab === "comunidades" && feedCommunity && (
          <FeedComunidadeScreen community={feedCommunity} onBack={() => setFeedCommunity(null)} />
        )}

        {tab === "perfil" && <PerfilMediadorScreen profile={profile} onSave={setProfile} />}
      </div>
      <div style={{ background: "var(--cm-white)", borderTop: "1px solid var(--cm-line)", padding: "10px 8px 14px", display: "flex", justifyContent: "space-around" }}>
        {[["dashboard", "📊", "Início"], ["pedidos", "⬡", "Missões"], ["comunidades", "👥", "Comunidades"], ["perfil", "👤", "Perfil"]].map(([id, icon, label]) => (
          <button
            key={id}
            onClick={() => { setTab(id); if (id !== "comunidades") setFeedCommunity(null); }}
            style={{
              border: 0, background: tab === id ? "var(--cm-lime)" : "transparent",
              color: tab === id ? "var(--cm-green)" : "var(--cm-muted)",
              fontWeight: tab === id ? 800 : 600, fontSize: 9, borderRadius: 11,
              padding: "8px 5px", minWidth: 52, display: "grid", justifyItems: "center", gap: 4, cursor: "pointer",
              position: "relative",
            }}
          >
            <span style={{ fontSize: 16 }}>{icon}</span>
            {label}
            {id === "pedidos" && demo.pendingRequests.length > 0 && (
              <span style={{ position: "absolute", top: 2, right: 6, width: 8, height: 8, borderRadius: "50%", background: "var(--cm-orange)" }} />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function PedidosScreen({ demo, onBack }) {
  const { pendingRequests, requests, grantTime, respondPollen, confirmCoringa } = demo;
  const resolved = requests.filter((r) => r.status === "resolved").slice(-5).reverse();

  return (
    <div>
      <p className="cm-eyebrow">Central de apoio</p>
      <h2 style={{ fontSize: 22, marginTop: 4, color: "var(--cm-ink)" }}>Pedidos do grupo</h2>
      <p style={{ fontSize: 12, color: "var(--cm-muted)", marginTop: 4, marginBottom: 16 }}>
        Ajuda, tempo, coringa e conclusões chegam aqui.
      </p>

      {pendingRequests.length === 0 && (
        <div className="cm-card">
          <p style={{ fontSize: 13, color: "var(--cm-muted)" }}>Nenhum pedido pendente no momento.</p>
        </div>
      )}

      <div style={{ display: "grid", gap: 12 }}>
        {pendingRequests.map((r) => (
          <RequestCard key={r.id} request={r} onGrantTime={grantTime} onRespondPollen={respondPollen} onConfirmCoringa={confirmCoringa} />
        ))}
      </div>

      {resolved.length > 0 && (
        <>
          <h3 style={{ fontSize: 13, fontWeight: 750, marginTop: 22, marginBottom: 10 }}>Resolvidos recentemente</h3>
          <div style={{ display: "grid", gap: 8 }}>
            {resolved.map((r) => (
              <div key={r.id} className="cm-card" style={{ padding: 12, opacity: 0.75 }}>
                <span className="cm-pill cm-pill-green" style={{ marginBottom: 6 }}>✓ Resolvido</span>
                <p style={{ fontSize: 12 }}>
                  {r.type === "tempo" && `Concedidos +${r.minutesGranted} minutos · ${r.groupContext}`}
                  {r.type === "polen" && `Orientação enviada · ${r.groupContext}`}
                  {r.type === "coringa" && `Apoio confirmado com ${r.partner} · ${r.groupContext}`}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function RequestCard({ request, onGrantTime, onRespondPollen, onConfirmCoringa }) {
  const [reply, setReply] = useState("");
  const [partner, setPartner] = useState("");

  const kindLabel = { tempo: "Precisamos de mais tempo", polen: "Pedido de orientação", coringa: "Favo coringa" }[request.type];

  return (
    <div className="cm-card">
      <span className="cm-pill cm-pill-warm">NOVO PEDIDO</span>
      <h3 style={{ fontSize: 15, marginTop: 10, color: "var(--cm-ink)" }}>{kindLabel}</h3>
      <p style={{ fontSize: 12, color: "var(--cm-muted)", marginTop: 4 }}>{request.missionTitle} · {request.groupContext}</p>
      {request.note && <p style={{ fontSize: 12, marginTop: 8, fontStyle: "italic" }}>“{request.note}”</p>}

      {request.type === "tempo" && (
        <button onClick={() => onGrantTime(request.id, 5)} className="cm-btn cm-btn-primary" style={{ width: "100%", marginTop: 12 }}>
          Conceder +5 minutos
        </button>
      )}

      {request.type === "polen" && (
        <div style={{ marginTop: 12 }}>
          <textarea
            value={reply} onChange={(e) => setReply(e.target.value)} rows={2} maxLength={240}
            placeholder="Escreva uma orientação para o grupo"
            style={{ width: "100%", border: "1px solid #d9ddcf", borderRadius: 12, padding: 10, background: "#fffefb", fontSize: 13, resize: "vertical" }}
          />
          <button
            onClick={() => onRespondPollen(request.id, reply)} disabled={!reply.trim()}
            className="cm-btn cm-btn-primary" style={{ width: "100%", marginTop: 8 }}
          >
            Enviar orientação
          </button>
        </div>
      )}

      {request.type === "coringa" && (
        <div style={{ marginTop: 12 }}>
          <input
            value={partner} onChange={(e) => setPartner(e.target.value)}
            placeholder="Nome do parceiro de registro"
            style={{ width: "100%", border: "1px solid #d9ddcf", borderRadius: 12, padding: 10, background: "#fffefb", fontSize: 13 }}
          />
          <button
            onClick={() => onConfirmCoringa(request.id, partner)} disabled={!partner.trim()}
            className="cm-btn cm-btn-primary" style={{ width: "100%", marginTop: 8 }}
          >
            Confirmar participação com apoio
          </button>
        </div>
      )}
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

function MissionCard({ mission, onOpenReport }) {
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
      {onOpenReport && (
        <button onClick={onOpenReport} className="cm-btn cm-btn-ghost" style={{ width: "100%", marginTop: 10, fontSize: 12 }}>
          Ver relatório
        </button>
      )}
    </div>
  );
}

function WizardHeader({ step, onCancel }) {
  const steps = ["Proposta", "Pistas e grupos", "Objetivos BNCC", "Revisar"];
  return (
    <div style={{ marginBottom: 16 }}>
      <button onClick={onCancel} className="cm-btn cm-btn-ghost" style={{ marginBottom: 12 }}>✕ Cancelar</button>
      <div className="flex gap-1.5" style={{ marginBottom: 10 }}>
        {steps.map((_, i) => (
          <div key={i} style={{ height: 4, flex: 1, borderRadius: 4, background: i < step ? "var(--cm-green)" : "#e7eadc" }} />
        ))}
      </div>
      <span className="cm-pill cm-pill-warm">Criar missão · {steps[step - 1]}</span>
    </div>
  );
}

function CriarMissaoWizard({ step, setStep, draft, setDraft, onCancel, onPublish }) {
  if (step === "review") {
    return (
      <div>
        <WizardHeader step={4} onCancel={onCancel} />
        <h2 style={{ fontSize: 20, color: "var(--cm-ink)" }}>{draft.title || "Missão sem título"}</h2>
        <p style={{ fontSize: 12, color: "var(--cm-muted)", marginTop: 4 }}>
          {draft.scope === "community" ? "Clube" : "Turma"} {draft.context} · {draft.groups} grupos · {draft.minutes} min
        </p>
        {draft.description && <p style={{ fontSize: 13, marginTop: 12 }}>{draft.description}</p>}
        {draft.mixGroups && <span className="cm-pill" style={{ marginTop: 10 }}>Mistura de grupos ativada</span>}
        <div className="flex flex-wrap gap-2" style={{ marginTop: 12 }}>
          {draft.bncc.length === 0 && <span style={{ fontSize: 12, color: "var(--cm-muted)" }}>Nenhum objetivo BNCC vinculado.</span>}
          {draft.bncc.map((b) => <span key={b} className="cm-pill cm-pill-lavender">{b}</span>)}
        </div>
        <div style={{ display: "grid", gap: 10, marginTop: 22 }}>
          <button onClick={() => onPublish("active")} className="cm-btn cm-btn-primary" style={{ width: "100%" }}>Publicar agora</button>
          <button onClick={() => onPublish("scheduled")} className="cm-btn" style={{ width: "100%" }}>Agendar</button>
          <button onClick={() => onPublish("draft")} className="cm-btn cm-btn-ghost" style={{ width: "100%" }}>Salvar rascunho</button>
        </div>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div>
        <WizardHeader step={1} onCancel={onCancel} />
        <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 6 }}>Título da missão</label>
        <input
          value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          placeholder="Ex: Cinco olhares para o pátio" maxLength={80}
          style={{ width: "100%", border: "1px solid #d9ddcf", borderRadius: 12, padding: 12, background: "#fffefb", fontSize: 14, marginBottom: 14 }}
        />
        <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 6 }}>Escopo</label>
        <div className="flex gap-2" style={{ marginBottom: 14 }}>
          {[["class", "Turma"], ["community", "Comunidade / clube"]].map(([v, l]) => (
            <button
              key={v} onClick={() => setDraft({ ...draft, scope: v })}
              className={draft.scope === v ? "cm-btn cm-btn-primary" : "cm-btn"} style={{ flex: 1, fontSize: 12 }}
            >
              {l}
            </button>
          ))}
        </div>
        <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 6 }}>Contexto</label>
        <input
          value={draft.context} onChange={(e) => setDraft({ ...draft, context: e.target.value })}
          placeholder="Ex: 7º B" maxLength={40}
          style={{ width: "100%", border: "1px solid #d9ddcf", borderRadius: 12, padding: 12, background: "#fffefb", fontSize: 14, marginBottom: 14 }}
        />
        <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 6 }}>Proposta</label>
        <textarea
          value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} rows={3} maxLength={300}
          placeholder="O que o grupo vai investigar ou construir?"
          style={{ width: "100%", border: "1px solid #d9ddcf", borderRadius: 12, padding: 12, background: "#fffefb", fontSize: 14, resize: "vertical" }}
        />
        <button onClick={() => setStep(2)} disabled={!draft.title.trim()} className="cm-btn cm-btn-primary" style={{ width: "100%", marginTop: 16 }}>
          Continuar →
        </button>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div>
        <WizardHeader step={2} onCancel={onCancel} />
        <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 6 }}>Quantos grupos? (até 6)</label>
        <input
          type="number" min={1} max={6} value={draft.groups}
          onChange={(e) => setDraft({ ...draft, groups: Math.min(6, Math.max(1, Number(e.target.value) || 1)) })}
          style={{ width: "100%", border: "1px solid #d9ddcf", borderRadius: 12, padding: 12, background: "#fffefb", fontSize: 14, marginBottom: 6 }}
        />
        <p style={{ fontSize: 11, color: "var(--cm-muted)", marginBottom: 14 }}>
          Cada grupo recebe seus próprios favos — a quantidade de pessoas em cada um pode variar.
        </p>
        <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 6 }}>Duração (minutos)</label>
        <input
          type="number" min={5} max={90} value={draft.minutes}
          onChange={(e) => setDraft({ ...draft, minutes: Math.min(90, Math.max(5, Number(e.target.value) || 5)) })}
          style={{ width: "100%", border: "1px solid #d9ddcf", borderRadius: 12, padding: 12, background: "#fffefb", fontSize: 14, marginBottom: 14 }}
        />
        <label className="flex items-center gap-2" style={{ fontSize: 13, cursor: "pointer" }}>
          <input type="checkbox" checked={draft.mixGroups} onChange={(e) => setDraft({ ...draft, mixGroups: e.target.checked })} />
          Ativar mistura de grupos para ampliar conexões
        </label>
        <button onClick={() => setStep(3)} className="cm-btn cm-btn-primary" style={{ width: "100%", marginTop: 16 }}>
          Continuar →
        </button>
      </div>
    );
  }

  // step 3 — objetivos BNCC
  const toggleBncc = (b) => {
    setDraft({ ...draft, bncc: draft.bncc.includes(b) ? draft.bncc.filter((x) => x !== b) : [...draft.bncc, b] });
  };
  return (
    <div>
      <WizardHeader step={3} onCancel={onCancel} />
      <p style={{ fontSize: 12, color: "var(--cm-muted)", marginBottom: 12 }}>
        Vincule objetivos da BNCC como referência pedagógica de demonstração.
      </p>
      <div style={{ display: "grid", gap: 8 }}>
        {BNCC_OPTIONS.map((b) => (
          <button
            key={b} onClick={() => toggleBncc(b)}
            className="cm-card" style={{ textAlign: "left", padding: 12, border: draft.bncc.includes(b) ? "2px solid var(--cm-green)" : "1px solid var(--cm-line)", cursor: "pointer" }}
          >
            <span style={{ fontSize: 13 }}>{draft.bncc.includes(b) ? "✓ " : ""}{b}</span>
          </button>
        ))}
      </div>
      <button onClick={() => setStep("review")} className="cm-btn cm-btn-primary" style={{ width: "100%", marginTop: 16 }}>
        Revisar missão →
      </button>
    </div>
  );
}

function RelatorioScreen({ mission, onBack }) {
  const skills = bnccToSkills(mission.bncc);
  return (
    <div>
      <button onClick={onBack} className="cm-btn cm-btn-ghost" style={{ marginBottom: 14 }}>← Voltar</button>
      <span className="cm-pill cm-pill-warm">Relatório · {mission.scope === "community" ? "Clube" : "Turma"} {mission.context}</span>
      <h2 style={{ fontSize: 20, marginTop: 10, color: "var(--cm-ink)" }}>{mission.title}</h2>
      <p style={{ fontSize: 12, color: "var(--cm-muted)", marginTop: 6 }}>
        Entregas e evidências do grupo, sem ranking individual ou diagnóstico de saúde mental.
      </p>

      <div className="grid gap-3" style={{ gridTemplateColumns: "1fr 1fr", marginTop: 16 }}>
        <Stat value={mission.groups} label="Grupos participantes" />
        <Stat value={`${Math.round((mission.confirmed / mission.members) * 100)}%`} label="Participação agregada" />
      </div>

      <div className="cm-card" style={{ marginTop: 14 }}>
        <h4 style={{ fontSize: 13, marginBottom: 8 }}>Evidências entregues</h4>
        <div style={{ display: "grid", gap: 8 }}>
          <div style={{ background: "#f4f6ec", borderRadius: 12, padding: 10, fontSize: 12 }}>
            Grupo 1 · resposta coletiva registrada com foto opcional.
          </div>
          <div style={{ background: "#f4f6ec", borderRadius: 12, padding: 10, fontSize: 12 }}>
            Grupo 2 · resposta coletiva registrada, sem foto.
          </div>
        </div>
      </div>

      <div className="cm-card" style={{ marginTop: 12 }}>
        <h4 style={{ fontSize: 13, marginBottom: 8 }}>Objetivos e competências praticadas</h4>
        <div className="flex flex-wrap gap-2">
          {skills.map((s) => <span key={s} className="cm-pill cm-pill-lavender">{s}</span>)}
        </div>
      </div>

      <div style={{ background: "var(--cm-orange-light)", borderRadius: 15, padding: 14, marginTop: 14, fontSize: 12, lineHeight: 1.6 }}>
        <strong>Sem ranking, sem comparação individual.</strong>
        <p style={{ color: "#984422", marginTop: 4 }}>Este relatório mostra apenas o resultado coletivo do grupo.</p>
      </div>
    </div>
  );
}

const AGE_RANGES = ["11 a 12 anos", "11 a 14 anos", "12 a 14 anos"];

function ComunidadesMediadorScreen({ communities, onCreate, onOpenFeed }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", ageRange: AGE_RANGES[1], theme: "" });

  function submit() {
    if (!form.name.trim()) return;
    onCreate(form);
    setForm({ name: "", ageRange: AGE_RANGES[1], theme: "" });
    setShowForm(false);
  }

  return (
    <div>
      <div className="flex items-center justify-between" style={{ marginBottom: 4 }}>
        <h2 style={{ fontSize: 22, color: "var(--cm-ink)" }}>Comunidades</h2>
        <button onClick={() => setShowForm((s) => !s)} className="cm-btn" style={{ fontSize: 12 }}>
          {showForm ? "Cancelar" : "+ Criar"}
        </button>
      </div>
      <p style={{ fontSize: 12, color: "var(--cm-muted)", marginBottom: 16 }}>
        Uma comunidade pode reunir estudantes de diferentes turmas.
      </p>

      {showForm && (
        <div className="cm-card" style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 6 }}>Nome da comunidade</label>
          <input
            value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Ex: Mãos na Horta"
            style={{ width: "100%", border: "1px solid #d9ddcf", borderRadius: 12, padding: 10, background: "#fffefb", fontSize: 13, marginBottom: 10 }}
          />
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 6 }}>Faixa etária</label>
          <select
            value={form.ageRange} onChange={(e) => setForm({ ...form, ageRange: e.target.value })}
            style={{ width: "100%", border: "1px solid #d9ddcf", borderRadius: 12, padding: 10, background: "#fffefb", fontSize: 13, marginBottom: 10 }}
          >
            {AGE_RANGES.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 6 }}>Tema</label>
          <input
            value={form.theme} onChange={(e) => setForm({ ...form, theme: e.target.value })}
            placeholder="Ex: Sustentabilidade"
            style={{ width: "100%", border: "1px solid #d9ddcf", borderRadius: 12, padding: 10, background: "#fffefb", fontSize: 13, marginBottom: 12 }}
          />
          <button onClick={submit} disabled={!form.name.trim()} className="cm-btn cm-btn-primary" style={{ width: "100%" }}>
            Criar comunidade
          </button>
        </div>
      )}

      <div style={{ display: "grid", gap: 12 }}>
        {communities.map((c) => (
          <div key={c.id} className="cm-card">
            <h3 style={{ fontSize: 15, color: "var(--cm-ink)" }}>{c.name}</h3>
            <p style={{ fontSize: 12, color: "var(--cm-muted)", marginTop: 4 }}>{c.theme}</p>
            <p style={{ fontSize: 11, color: "var(--cm-muted)", marginTop: 2 }}>{c.ageRange} · interturmas</p>
            <div className="flex gap-2" style={{ marginTop: 10 }}>
              <button className="cm-btn" style={{ flex: 1, fontSize: 12 }}>Organizar clube</button>
              <button onClick={() => onOpenFeed(c)} className="cm-btn cm-btn-ghost" style={{ flex: 1, fontSize: 12 }}>Ver feed</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeedComunidadeScreen({ community, onBack }) {
  return (
    <div>
      <button onClick={onBack} className="cm-btn cm-btn-ghost" style={{ marginBottom: 14 }}>← Voltar</button>
      <span className="cm-pill cm-pill-warm">Feed · {community.name}</span>
      <h2 style={{ fontSize: 20, marginTop: 10, color: "var(--cm-ink)" }}>Descobertas do clube</h2>
      <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
        <div style={{ background: "#f4f6ec", borderRadius: 14, padding: 12 }}>
          <p style={{ fontSize: 12, lineHeight: 1.5 }}>O grupo do 8º A descobriu um final alternativo pra história — todo mundo contribuiu com uma pista.</p>
        </div>
        <div style={{ background: "#f4f6ec", borderRadius: 14, padding: 12 }}>
          <p style={{ fontSize: 12, lineHeight: 1.5 }}>Registro coletivo: 3 finais diferentes, cada um com uma parte da turma.</p>
        </div>
      </div>
    </div>
  );
}

function PerfilMediadorScreen({ profile, onSave }) {
  const [name, setName] = useState(profile.name);
  const [role, setRole] = useState(profile.role);
  const dirty = name !== profile.name || role !== profile.role;

  return (
    <div>
      <span className="cm-pill cm-pill-warm">Perfil e cargo</span>
      <h2 style={{ fontSize: 22, marginTop: 10, color: "var(--cm-ink)" }}>Seus dados</h2>
      <p style={{ fontSize: 12, color: "var(--cm-muted)", marginTop: 6, marginBottom: 16 }}>
        O papel pode ser professor, bibliotecária, educador ou outro cargo na escola.
      </p>

      <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 6 }}>Nome</label>
      <input
        value={name} onChange={(e) => setName(e.target.value)}
        style={{ width: "100%", border: "1px solid #d9ddcf", borderRadius: 12, padding: 12, background: "#fffefb", fontSize: 14, marginBottom: 14 }}
      />

      <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 6 }}>Papel na escola</label>
      <select
        value={role} onChange={(e) => setRole(e.target.value)}
        style={{ width: "100%", border: "1px solid #d9ddcf", borderRadius: 12, padding: 12, background: "#fffefb", fontSize: 14, marginBottom: 14 }}
      >
        {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
      </select>

      <button
        onClick={() => onSave({ name, role })} disabled={!dirty || !name.trim()}
        className="cm-btn cm-btn-primary" style={{ width: "100%" }}
      >
        Salvar alterações
      </button>

      <div className="cm-card" style={{ marginTop: 20 }}>
        <h4 style={{ fontSize: 13, marginBottom: 8 }}>Sobre a visão coletiva</h4>
        <p style={{ fontSize: 12, color: "var(--cm-muted)", lineHeight: 1.6 }}>
          A Colmeia não monitora navegação, tempo de tela ou localização dos estudantes, e não cria ranking individual.
        </p>
      </div>
    </div>
  );
}