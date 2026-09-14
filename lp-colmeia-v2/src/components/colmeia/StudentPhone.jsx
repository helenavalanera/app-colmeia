import React, { useState } from "react";
import BeeMascot from "./BeeMascot";
import { useDemoState, formatMinutes } from "@/state/DemoState";

const MISSION = {
  id: "water",
  title: "Por onde a água passa?",
  context: "Turma 7º B",
  description: "Investiguem o uso da água na escola e proponham uma mudança possível. Cada olhar revela uma parte da história.",
  clue: "Visite o bebedouro. Observe o uso da água e pergunte a alguém: o que poderíamos melhorar neste espaço?",
  members: [
    { id: "me", name: "Você", code: "COL-101", confirmed: false },
    { id: "p2", name: "Colega 2", code: "COL-204", confirmed: false },
    { id: "p3", name: "Colega 3", code: "COL-307", confirmed: false },
  ],
};

export default function StudentPhone({ onMissionUpdate }) {
  const demo = useDemoState();
  const [tab, setTab] = useState("home");
  const [screen, setScreen] = useState("login");
  const [roomCode, setRoomCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [studentName, setStudentName] = useState("");
  const [mission, setMission] = useState(MISSION);
  const [encounterCode, setEncounterCode] = useState("");
  const [encError, setEncError] = useState("");
  const [collectiveText, setCollectiveText] = useState("");
  const [myPollenRequestId, setMyPollenRequestId] = useState(null);
  const [myCoringaRequestId, setMyCoringaRequestId] = useState(null);
  const [favosBalance, setFavosBalance] = useState(6);
  const [ownedItems, setOwnedItems] = useState([]);
  const [equipped, setEquipped] = useState({ chapeu: null, roupa: null, saia: null });
  const [showMinhaAbelha, setShowMinhaAbelha] = useState(false);

  const confirmedCount = mission.members.filter((m) => m.confirmed).length;
  const gathered = mission.members.every((m) => m.confirmed);
  const myPollenRequest = demo.requests.find((r) => r.id === myPollenRequestId);
  const myCoringaRequest = demo.requests.find((r) => r.id === myCoringaRequestId);
  const visibleAlerts = demo.studentAlerts.filter(
    (a) => a.id === myPollenRequestId || a.id === myCoringaRequestId || a.kind === "tempo"
  );

  function handleLogin(e) {
    e.preventDefault();
    const code = roomCode.trim().toUpperCase();
    if (!code) { setCodeError("Digite o código da sala."); return; }
    if (!code.startsWith("COL")) { setCodeError("Código inválido. Peça o código ao seu educador."); return; }
    if (!studentName.trim()) { setCodeError("Como você quer ser chamado?"); return; }
    setCodeError("");
    setScreen("favos");
  }

  function confirmMember(memberId) {
    setMission((prev) => {
      const next = { ...prev, members: prev.members.map((m) => m.id === memberId ? { ...m, confirmed: true } : m) };
      const allGathered = next.members.every((m) => m.confirmed);
      if (allGathered && onMissionUpdate) onMissionUpdate({ title: next.title, gathered: true });
      return next;
    });
  }

  function handleEncounter(e) {
    e.preventDefault();
    const code = encounterCode.trim().toUpperCase();
    const mate = mission.members.find((m) => m.code === code && m.id !== "me");
    if (!mate) { setEncError("Código não reconhecido como o de um colega do seu grupo."); return; }
    if (mate.confirmed) { setEncError("Esse encontro já foi confirmado."); return; }
    setEncError("");
    confirmMember(mate.id);
    setEncounterCode("");
    setScreen("favos");
  }

  function submitCollective() {
    setMission((prev) => ({ ...prev, submission: { text: collectiveText, at: Date.now() } }));
    setFavosBalance((b) => b + mission.members.length); // saldo de favos = nº de pessoas do grupo
    setScreen("done");
    if (onMissionUpdate) onMissionUpdate({ title: mission.title, completed: true });
  }

  function buyItem(item) {
    if (ownedItems.includes(item.id) || favosBalance < item.cost) return;
    setFavosBalance((b) => b - item.cost);
    setOwnedItems((o) => [...o, item.id]);
    setEquipped((eq) => ({ ...eq, [item.type]: item.id }));
  }

  function toggleEquip(item) {
    setEquipped((eq) => ({ ...eq, [item.type]: eq[item.type] === item.id ? null : item.id }));
  }

  return (
    <div className="cm-device cm-font" style={{ width: "100%", maxWidth: 410, height: 760, display: "flex", flexDirection: "column" }}>
      <PhoneStatusBar />
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 18px", background: "var(--cm-paper)" }}>
        {tab === "home" && screen !== "login" && visibleAlerts.length > 0 && (
          <AlertStack alerts={visibleAlerts} onDismiss={demo.dismissAlert} />
        )}
        {screen === "login" && (
          <LoginScreen
            roomCode={roomCode} setRoomCode={setRoomCode}
            studentName={studentName} setStudentName={setStudentName}
            error={codeError} onSubmit={handleLogin}
          />
        )}
        {screen !== "login" && tab === "comm" && <ComunidadesScreen />}
        {screen !== "login" && tab === "cal" && <CalendarioScreen />}
        {screen !== "login" && tab === "prof" && !showMinhaAbelha && (
          <PerfilScreen
            studentName={studentName || "Você"}
            favosBalance={favosBalance}
            equipped={equipped}
            onOpenAbelha={() => setShowMinhaAbelha(true)}
          />
        )}
        {screen !== "login" && tab === "prof" && showMinhaAbelha && (
          <MinhaAbelhaScreen
            favosBalance={favosBalance}
            ownedItems={ownedItems}
            equipped={equipped}
            onBuy={buyItem}
            onToggleEquip={toggleEquip}
            onBack={() => setShowMinhaAbelha(false)}
          />
        )}
        {screen !== "login" && tab === "home" && screen === "favos" && (
          <FavosScreen
            mission={mission} confirmedCount={confirmedCount} gathered={gathered}
            timeRemainingSec={demo.mission.timeRemainingSec}
            onOpenFavo={() => setScreen("favo-open")}
            onConfirmSelf={() => confirmMember("me")}
            onEncounter={() => setScreen("encounter")}
            onSubmit={() => setScreen("submit")}
            onPollen={() => setScreen("pollen")}
            onCoringa={() => setScreen("coringa")}
          />
        )}
        {tab === "home" && screen === "favo-open" && (
          <FavoOpenScreen mission={mission} onBack={() => setScreen("favos")} onEncounter={() => setScreen("encounter")} />
        )}
        {tab === "home" && screen === "encounter" && (
          <EncounterScreen
            code={encounterCode} setCode={setEncounterCode}
            error={encError} onSubmit={handleEncounter}
            onBack={() => setScreen("favos")}
            mission={mission}
          />
        )}
        {tab === "home" && screen === "pollen" && (
          <PollenScreen
            request={myPollenRequest}
            onBack={() => setScreen("favos")}
            onRequestTime={() => setMyPollenRequestId(demo.requestTime())}
            onRequestHelp={(note) => setMyPollenRequestId(demo.requestPollen(note))}
          />
        )}
        {tab === "home" && screen === "coringa" && (
          <CoringaScreen
            request={myCoringaRequest}
            onBack={() => setScreen("favos")}
            onRequest={(note) => setMyCoringaRequestId(demo.requestCoringa(note))}
          />
        )}
        {tab === "home" && screen === "submit" && (
          <SubmitScreen
            text={collectiveText} setText={setCollectiveText}
            onSubmit={submitCollective} onBack={() => setScreen("favos")}
          />
        )}
        {tab === "home" && screen === "done" && <DoneScreen mission={mission} onBack={() => setScreen("favos")} />}
      </div>
      <PhoneNav
        active={tab}
        loggedIn={screen !== "login"}
        onNavigate={(id) => { setTab(id); if (id !== "prof") setShowMinhaAbelha(false); }}
      />
    </div>
  );
}

function PhoneStatusBar() {
  return (
    <div style={{ background: "var(--cm-white)", padding: "15px 22px 8px", fontSize: 10, fontWeight: 700, display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--cm-line)" }}>
      <span>colmeia<span style={{ color: "var(--cm-orange)" }}>.</span></span>
      <span>86% 🔋</span>
    </div>
  );
}

function PhoneNav({ active, loggedIn, onNavigate }) {
  const items = [["home", "🏠", "Início"], ["comm", "👥", "Comunidades"], ["cal", "📅", "Calendário"], ["prof", "👤", "Perfil"]];
  return (
    <div style={{ background: "var(--cm-white)", borderTop: "1px solid var(--cm-line)", padding: "10px 8px 14px", display: "flex", justifyContent: "space-around" }}>
      {items.map(([id, icon, label]) => (
        <button
          key={id}
          disabled={!loggedIn}
          onClick={() => onNavigate?.(id)}
          style={{
            border: 0, background: active === id ? "var(--cm-lime)" : "transparent",
            color: active === id ? "var(--cm-green)" : "var(--cm-muted)",
            fontWeight: active === id ? 800 : 600, fontSize: 9, borderRadius: 11,
            padding: "8px 5px", minWidth: 52, display: "grid", justifyItems: "center", gap: 4,
            cursor: loggedIn ? "pointer" : "default", opacity: loggedIn ? 1 : 0.5,
          }}
        >
          <span style={{ fontSize: 16 }}>{icon}</span>
          {label}
        </button>
      ))}
    </div>
  );
}

function LoginScreen({ roomCode, setRoomCode, studentName, setStudentName, error, onSubmit }) {
  return (
    <div>
      <div className="flex justify-center mb-4"><BeeMascot size={90} /></div>
      <p className="cm-eyebrow">Seu primeiro encontro</p>
      <h2 style={{ fontSize: 24, marginTop: 6, color: "var(--cm-ink)" }}>Tem lugar para você aqui.</h2>
      <p style={{ fontSize: 12, color: "var(--cm-muted)", marginTop: 8, marginBottom: 18 }}>
        Entre com o código da sala que seu educador compartilhou.
      </p>
      <form onSubmit={onSubmit}>
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 6 }}>Como você quer ser chamado?</label>
          <input
            value={studentName} onChange={(e) => setStudentName(e.target.value)}
            placeholder="Seu nome" maxLength={45}
            style={{ width: "100%", border: "1px solid #d9ddcf", borderRadius: 12, padding: 12, background: "#fffefb", fontSize: 14 }}
          />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 6 }}>Código da sala</label>
          <input
            value={roomCode} onChange={(e) => setRoomCode(e.target.value)}
            placeholder="COLMEIA-7B" autoComplete="off"
            style={{ width: "100%", border: "1px solid #d9ddcf", borderRadius: 12, padding: 12, background: "#fffefb", fontSize: 14, letterSpacing: 1 }}
          />
        </div>
        {error && <div style={{ color: "#a33625", background: "#fff0e9", padding: 10, borderRadius: 10, fontSize: 13, marginBottom: 12 }}>{error}</div>}
        <button type="submit" className="cm-btn cm-btn-primary" style={{ width: "100%" }}>Entrar na Colmeia</button>
        <p style={{ fontSize: 11, color: "var(--cm-muted)", marginTop: 12, textAlign: "center" }}>
          Cadastro salvo neste navegador, sem senha.
        </p>
      </form>
    </div>
  );
}

function FavosScreen({ mission, confirmedCount, gathered, timeRemainingSec, onOpenFavo, onConfirmSelf, onEncounter, onSubmit, onPollen, onCoringa }) {
  const meConfirmed = mission.members[0].confirmed;
  return (
    <div>
      <p className="cm-eyebrow">Bom ter você aqui</p>
      <h2 style={{ fontSize: 22, marginTop: 4, color: "var(--cm-ink)" }}>Oi! Qual descoberta a gente faz hoje?</h2>

      <div style={{ background: "var(--cm-lime)", border: "1px solid var(--cm-lime-deep)", borderRadius: 23, padding: 18, marginTop: 16, position: "relative", overflow: "hidden" }}>
        <span className="cm-pill" style={{ background: "#f5f7df" }}>Seu celular é só o começo</span>
        <h3 style={{ fontSize: 19, marginTop: 10, maxWidth: 230, color: "var(--cm-ink)" }}>Leve uma pista. Encontre outras ideias.</h3>
        <p style={{ fontSize: 12, marginTop: 8, maxWidth: 245 }}>Tem uma parte da descoberta que só acontece quando vocês conversam.</p>
        <button onClick={onOpenFavo} className="cm-btn cm-btn-primary" style={{ marginTop: 14 }}>Bora encontrar? →</button>
        <span style={{ position: "absolute", right: -8, bottom: -20, fontSize: 80, color: "#c2cc85", transform: "rotate(20deg)" }}>✳</span>
      </div>

      <div style={{ marginTop: 20 }}>
        <span className="cm-pill cm-pill-warm">{mission.context}</span>
        <span className="cm-pill" style={{ marginLeft: 6, background: "var(--cm-yellow)" }}>{formatMinutes(timeRemainingSec)} restantes</span>
        <h3 style={{ fontSize: 17, marginTop: 10, color: "var(--cm-ink)" }}>{mission.title}</h3>
        <p style={{ fontSize: 12, color: "var(--cm-muted)", marginTop: 6 }}>{mission.description}</p>
      </div>

      <div className="cm-card" style={{ marginTop: 16 }}>
        <div className="flex items-center justify-between" style={{ marginBottom: 10 }}>
          <h4 style={{ fontSize: 14, fontWeight: 700 }}>Uma pista é sua. A descoberta é de todos.</h4>
          <span style={{ fontSize: 18 }}>⬡</span>
        </div>
        <div className="flex justify-center flex-wrap gap-2.5" style={{ padding: "12px 0" }}>
          {mission.members.map((m, i) => (
            <FavoHex key={m.id} mine={i === 0} confirmed={m.confirmed} onClick={i === 0 ? onOpenFavo : undefined} />
          ))}
        </div>
        <p style={{ fontSize: 11, color: "var(--cm-muted)", textAlign: "center" }}>
          Só o seu favo pode ser aberto. Pergunte a diferentes colegas, sem uma lista de alvos.
        </p>
        <div style={{ height: 7, background: "#e7eadc", borderRadius: 20, overflow: "hidden", margin: "14px 0 7px" }}>
          <div style={{ height: "100%", background: "#729050", width: `${(confirmedCount / mission.members.length) * 100}%`, borderRadius: 20 }} />
        </div>
        <div className="flex justify-between" style={{ fontSize: 11, color: "var(--cm-muted)" }}>
          <span>{confirmedCount} de {mission.members.length} encontros confirmados</span>
          <span>{gathered ? "Grupo reunido ✳" : "Vamos nos encontrar"}</span>
        </div>
      </div>

      {!meConfirmed && (
        <button onClick={onConfirmSelf} className="cm-btn" style={{ width: "100%", marginTop: 12 }}>
          ✓ Já conversei com meu grupo
        </button>
      )}
      <button onClick={onEncounter} className="cm-btn cm-btn-ghost" style={{ width: "100%", marginTop: 8 }}>
        Confirmar encontro de um colega
      </button>
      {gathered && (
        <button onClick={onSubmit} className="cm-btn cm-btn-primary" style={{ width: "100%", marginTop: 8 }}>
          Registrar resposta coletiva →
        </button>
      )}
      <button onClick={onPollen} className="cm-btn cm-btn-orange" style={{ width: "100%", marginTop: 14 }}>
        🌼 Preciso de pólen (ajuda)
      </button>
      <button onClick={onCoringa} className="cm-btn cm-btn-ghost" style={{ width: "100%", marginTop: 8, fontSize: 12 }}>
        Alguém do grupo está sem celular?
      </button>
    </div>
  );
}

function FavoHex({ mine, confirmed, onClick }) {
  const bg = mine ? "var(--cm-yellow)" : confirmed ? "var(--cm-lime)" : "#e7e9dd";
  return (
    <button
      onClick={onClick}
      disabled={!mine}
      className="cm-hex"
      style={{
        width: 64, height: 70, border: 0, background: bg,
        display: "grid", placeItems: "center", fontSize: 22, cursor: mine ? "pointer" : "default",
        color: mine ? "#6b5e38" : confirmed ? "var(--cm-green)" : "var(--cm-muted)",
      }}
    >
      {mine ? "🔓" : confirmed ? "✓" : "🔒"}
    </button>
  );
}

function FavoOpenScreen({ mission, onBack, onEncounter }) {
  return (
    <div>
      <button onClick={onBack} className="cm-btn cm-btn-ghost" style={{ marginBottom: 14 }}>← Voltar à missão</button>
      <span className="cm-pill cm-pill-warm">Meu favo · pista individual</span>
      <h2 style={{ fontSize: 22, marginTop: 10, color: "var(--cm-ink)" }}>O seu olhar faz falta.</h2>
      <div style={{ background: "var(--cm-lime)", border: "1px solid var(--cm-lime-deep)", borderRadius: 23, padding: 18, marginTop: 14 }}>
        <p className="cm-eyebrow" style={{ marginBottom: 8 }}>Sua exploração</p>
        <h3 style={{ fontSize: 16, lineHeight: 1.4, color: "var(--cm-ink)" }}>{mission.clue}</h3>
        <p style={{ fontSize: 12, marginTop: 10 }}>Converse, observe e escute. Não é uma corrida para encontrar todo mundo.</p>
      </div>
      <div className="cm-card" style={{ marginTop: 16 }}>
        <h4 style={{ fontSize: 14, marginBottom: 8 }}>Encontrou uma conexão?</h4>
        <p style={{ fontSize: 12, color: "var(--cm-muted)", marginBottom: 12 }}>
          Depois de conversar, peça o código de encontro do colega. Não mostramos quem tem cada peça.
        </p>
        <p style={{ fontSize: 12, color: "var(--cm-muted)" }}>Seu código: <strong>COL-101</strong>. Compartilhe só depois de conversar.</p>
      </div>
      <button onClick={onEncounter} className="cm-btn cm-btn-primary" style={{ width: "100%", marginTop: 12 }}>
        Confirmar encontro de um colega →
      </button>
    </div>
  );
}

function EncounterScreen({ code, setCode, error, onSubmit, onBack, mission }) {
  return (
    <div>
      <button onClick={onBack} className="cm-btn cm-btn-ghost" style={{ marginBottom: 14 }}>← Voltar</button>
      <span className="cm-pill cm-pill-warm">Encontro presencial</span>
      <h2 style={{ fontSize: 22, marginTop: 10, color: "var(--cm-ink)" }}>Confirmar conversa</h2>
      <p style={{ fontSize: 12, color: "var(--cm-muted)", marginTop: 8 }}>
        Digite o código que um colega compartilhou presencialmente. Códigos de ensaio: COL-204 e COL-307.
      </p>
      <form onSubmit={onSubmit} style={{ marginTop: 16 }}>
        <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 6 }}>Código compartilhado</label>
        <input
          value={code} onChange={(e) => setCode(e.target.value)}
          placeholder="COL-000" autoComplete="off"
          style={{ width: "100%", border: "1px solid #d9ddcf", borderRadius: 12, padding: 12, background: "#fffefb", fontSize: 14, letterSpacing: 1 }}
        />
        {error && <div style={{ color: "#a33625", background: "#fff0e9", padding: 10, borderRadius: 10, fontSize: 13, marginTop: 10 }}>{error}</div>}
        <button type="submit" className="cm-btn cm-btn-primary" style={{ width: "100%", marginTop: 14 }}>Confirmar encontro</button>
      </form>
    </div>
  );
}

function AlertStack({ alerts, onDismiss }) {
  return (
    <div style={{ display: "grid", gap: 8, marginBottom: 14 }}>
      {alerts.map((a) => (
        <div
          key={a.id}
          style={{ background: "var(--cm-lime)", border: "1px solid var(--cm-lime-deep)", borderRadius: 14, padding: 12, fontSize: 12, display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start" }}
        >
          <span>
            {a.kind === "tempo" && <>⏱ O mediador concedeu <strong>+{a.minutes} minutos</strong> para o seu grupo.</>}
            {a.kind === "polen" && <>🌼 Resposta do mediador: “{a.message}”</>}
            {a.kind === "coringa" && <>🧩 Participação com apoio confirmada. Parceiro de registro: <strong>{a.partner}</strong>.</>}
          </span>
          <button onClick={() => onDismiss(a.id)} style={{ border: 0, background: "transparent", cursor: "pointer", fontSize: 13, color: "var(--cm-muted)" }}>✕</button>
        </div>
      ))}
    </div>
  );
}

function PollenScreen({ request, onBack, onRequestTime, onRequestHelp }) {
  const [note, setNote] = useState("");
  const pending = request?.status === "pending";
  const resolved = request?.status === "resolved";

  return (
    <div>
      <button onClick={onBack} className="cm-btn cm-btn-ghost" style={{ marginBottom: 14 }}>← Voltar</button>
      <span className="cm-pill cm-pill-warm">Pólen · ajuda pedagógica</span>
      <h2 style={{ fontSize: 22, marginTop: 10, color: "var(--cm-ink)" }}>Precisa de uma mãozinha?</h2>
      <p style={{ fontSize: 12, color: "var(--cm-muted)", marginTop: 8 }}>
        Pedir pólen é gratuito e não tem relação com o saldo de favos. O mediador recebe e responde.
      </p>

      {!request && (
        <div style={{ display: "grid", gap: 10, marginTop: 18 }}>
          <button onClick={onRequestTime} className="cm-btn cm-btn-primary" style={{ width: "100%" }}>
            ⏱ Pedir mais tempo (+5 min)
          </button>
          <div className="cm-card">
            <h4 style={{ fontSize: 13, marginBottom: 8 }}>Pedir orientação</h4>
            <textarea
              value={note} onChange={(e) => setNote(e.target.value)} rows={3} maxLength={300}
              placeholder="Qual é a dúvida do grupo?"
              style={{ width: "100%", border: "1px solid #d9ddcf", borderRadius: 12, padding: 10, background: "#fffefb", fontSize: 13, resize: "vertical" }}
            />
            <button
              onClick={() => onRequestHelp(note)} disabled={!note.trim()}
              className="cm-btn" style={{ width: "100%", marginTop: 10 }}
            >
              Enviar pedido de orientação
            </button>
          </div>
        </div>
      )}

      {pending && (
        <div className="cm-card" style={{ marginTop: 16 }}>
          <span className="cm-pill">Pedido enviado</span>
          <p style={{ fontSize: 13, marginTop: 10 }}>
            {request.type === "tempo" ? "Você pediu mais tempo." : `Você perguntou: “${request.note}”`}
          </p>
          <p style={{ fontSize: 12, color: "var(--cm-muted)", marginTop: 6 }}>Aguardando o mediador responder…</p>
        </div>
      )}

      {resolved && (
        <div className="cm-card" style={{ marginTop: 16 }}>
          <span className="cm-pill cm-pill-green">✓ Respondido</span>
          <p style={{ fontSize: 13, marginTop: 10 }}>
            {request.type === "tempo"
              ? `O mediador concedeu +${request.minutesGranted} minutos.`
              : `Resposta do mediador: “${request.response}”`}
          </p>
        </div>
      )}
    </div>
  );
}

function CoringaScreen({ request, onBack, onRequest }) {
  const [note, setNote] = useState("");
  const pending = request?.status === "pending";
  const resolved = request?.status === "resolved";

  return (
    <div>
      <button onClick={onBack} className="cm-btn cm-btn-ghost" style={{ marginBottom: 14 }}>← Voltar</button>
      <span className="cm-pill cm-pill-warm">Favo coringa</span>
      <h2 style={{ fontSize: 22, marginTop: 10, color: "var(--cm-ink)" }}>Alguém do grupo está sem celular?</h2>
      <p style={{ fontSize: 12, color: "var(--cm-muted)", marginTop: 8 }}>
        Isso não impede a participação. Avise o mediador: ele organiza a pista em papel e confirma um
        parceiro de registro para essa pessoa.
      </p>

      {!request && (
        <div className="cm-card" style={{ marginTop: 16 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 6 }}>Quem precisa de apoio?</label>
          <textarea
            value={note} onChange={(e) => setNote(e.target.value)} rows={3} maxLength={200}
            placeholder="Nome do colega e contexto (opcional)"
            style={{ width: "100%", border: "1px solid #d9ddcf", borderRadius: 12, padding: 10, background: "#fffefb", fontSize: 13, resize: "vertical" }}
          />
          <button onClick={() => onRequest(note)} className="cm-btn cm-btn-primary" style={{ width: "100%", marginTop: 10 }}>
            Avisar o mediador
          </button>
        </div>
      )}

      {pending && (
        <div className="cm-card" style={{ marginTop: 16 }}>
          <span className="cm-pill">Aviso enviado</span>
          <p style={{ fontSize: 13, marginTop: 10 }}>O mediador está organizando a pista em papel.</p>
        </div>
      )}

      {resolved && (
        <div className="cm-card" style={{ marginTop: 16 }}>
          <span className="cm-pill cm-pill-green">✓ Apoio confirmado</span>
          <p style={{ fontSize: 13, marginTop: 10 }}>Parceiro de registro: <strong>{request.partner}</strong>.</p>
        </div>
      )}
    </div>
  );
}

function SubmitScreen({ text, setText, onSubmit, onBack }) {
  return (
    <div>
      <button onClick={onBack} className="cm-btn cm-btn-ghost" style={{ marginBottom: 14 }}>← Voltar</button>
      <span className="cm-pill cm-pill-green">Grupo reunido</span>
      <h2 style={{ fontSize: 22, marginTop: 10, color: "var(--cm-ink)" }}>O que vocês descobriram juntos?</h2>
      <p style={{ fontSize: 12, color: "var(--cm-muted)", marginTop: 8 }}>
        Combine a resposta com o grupo e registre aqui. Uma entrega coletiva, sem notas individuais.
      </p>
      <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginTop: 16, marginBottom: 6 }}>Nossa resposta coletiva</label>
      <textarea
        value={text} onChange={(e) => setText(e.target.value)} rows={5} maxLength={2000}
        placeholder="Observamos que… Juntos, propomos…"
        style={{ width: "100%", border: "1px solid #d9ddcf", borderRadius: 12, padding: 12, background: "#fffefb", fontSize: 14, resize: "vertical" }}
      />
      <button onClick={onSubmit} className="cm-btn cm-btn-primary" style={{ width: "100%", marginTop: 14 }} disabled={!text.trim()}>
        Enviar descoberta e concluir
      </button>
    </div>
  );
}

function DoneScreen({ mission, onBack }) {
  return (
    <div>
      <div style={{ background: "var(--cm-green)", color: "#fff", borderRadius: 22, padding: 22, textAlign: "center" }}>
        <p className="cm-eyebrow" style={{ color: "#e2e9d7" }}>Uma descoberta, muitas vozes</p>
        <h2 style={{ fontSize: 22, marginTop: 8 }}>Vocês fizeram acontecer.</h2>
        <strong style={{ fontSize: 34, display: "block", margin: "10px 0" }}>+{mission.members.length} favos ⬡</strong>
        <p style={{ fontSize: 12, color: "#e2e9d7" }}>{mission.members.length} pessoas no grupo. Uma contribuição de cada vez.</p>
      </div>
      <div className="cm-card" style={{ marginTop: 16 }}>
        <span className="cm-pill cm-pill-green">✓ Missão concluída</span>
        <h3 style={{ fontSize: 16, marginTop: 10, color: "var(--cm-ink)" }}>{mission.title}</h3>
        {mission.submission?.text && <p style={{ fontSize: 13, marginTop: 10, lineHeight: 1.6 }}>{mission.submission.text}</p>}
        <div style={{ height: 1, background: "var(--cm-line)", margin: "16px 0" }} />
        <h4 style={{ fontSize: 13, marginBottom: 8 }}>O que vocês praticaram</h4>
        <div className="flex flex-wrap gap-2">
          {["Escuta ativa", "Colaboração", "Comunicação"].map((s) => (
            <span key={s} className="cm-pill cm-pill-lavender">{s}</span>
          ))}
        </div>
      </div>
      <button onClick={onBack} className="cm-btn" style={{ width: "100%", marginTop: 12 }}>Voltar ao início</button>
    </div>
  );
}

const COMMUNITIES = [
  { id: "plot", name: "Plot Twist & Páginas", theme: "Leitura e escrita", ageRange: "11 a 14 anos", scope: "interturmas", joined: true },
  { id: "pixel", name: "Pixel & Recreio", theme: "Jogos e lógica", ageRange: "12 a 14 anos", scope: "interturmas", joined: false },
  { id: "horta", name: "Mãos na Horta", theme: "Sustentabilidade", ageRange: "11 a 13 anos", scope: "interturmas", joined: false },
];

function ComunidadesScreen() {
  const [sub, setSub] = useState("minhas");
  const list = sub === "minhas" ? COMMUNITIES.filter((c) => c.joined) : COMMUNITIES;

  return (
    <div>
      <h2 style={{ fontSize: 22, color: "var(--cm-ink)" }}>Comunidades</h2>
      <div className="flex gap-2" style={{ marginTop: 12, marginBottom: 16, flexWrap: "wrap" }}>
        {[["minhas", "Minhas"], ["descobrir", "Descobrir"], ["embaixadores", "Embaixadores"]].map(([id, label]) => (
          <button
            key={id} onClick={() => setSub(id)} className="cm-pill"
            style={{ background: sub === id ? "var(--cm-yellow)" : "#edf0e3", fontSize: 11, cursor: "pointer", border: 0 }}
          >
            {label}
          </button>
        ))}
      </div>

      {sub === "embaixadores" ? (
        <div className="cm-card">
          <span className="cm-pill cm-pill-lavender">Em breve</span>
          <p style={{ fontSize: 13, marginTop: 10 }}>
            O programa de embaixadores ainda não abriu. Clubes com inscrições abertas continuam acessíveis em "Descobrir".
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {list.length === 0 && (
            <div className="cm-card"><p style={{ fontSize: 13, color: "var(--cm-muted)" }}>Você ainda não faz parte de nenhuma comunidade.</p></div>
          )}
          {list.map((c) => (
            <div key={c.id} className="cm-card">
              <h3 style={{ fontSize: 16, color: "var(--cm-ink)" }}>{c.name}</h3>
              <p style={{ fontSize: 12, color: "var(--cm-muted)", marginTop: 4 }}>{c.theme}</p>
              <p style={{ fontSize: 11, color: "var(--cm-muted)", marginTop: 2 }}>{c.ageRange} · {c.scope}</p>
              <button className="cm-btn cm-btn-primary" style={{ width: "100%", marginTop: 12 }}>
                {c.joined ? "Conhecer o clube" : "Ver clube"}
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="cm-card" style={{ marginTop: 16 }}>
        <h4 style={{ fontSize: 14, marginBottom: 6 }}>Feed da comunidade</h4>
        <p style={{ fontSize: 12, color: "var(--cm-muted)" }}>Descobertas, fotos e respostas coletivas do contexto.</p>
        <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
          <FeedItem author="Plot Twist & Páginas" text="O grupo do 8º A descobriu um final alternativo pra história — todo mundo contribuiu com uma pista." />
          <FeedItem author="Plot Twist & Páginas" text="Registro coletivo: 3 finais diferentes, cada um com uma parte da turma." />
        </div>
      </div>
    </div>
  );
}

function FeedItem({ author, text }) {
  return (
    <div style={{ background: "#f4f6ec", borderRadius: 14, padding: 12 }}>
      <span className="cm-pill cm-pill-warm" style={{ marginBottom: 6 }}>{author}</span>
      <p style={{ fontSize: 12, lineHeight: 1.5 }}>{text}</p>
    </div>
  );
}

const RITUALS = [
  { id: 1, title: "Favo da semana libera", when: "Segunda, 08h" },
  { id: 2, title: "Encontro de turma · Por onde a água passa?", when: "Quarta, prazo às 12h" },
  { id: 3, title: "Feed da comunidade atualiza", when: "Sexta, 16h" },
];

function CalendarioScreen() {
  return (
    <div>
      <h2 style={{ fontSize: 22, color: "var(--cm-ink)" }}>Calendário</h2>
      <p style={{ fontSize: 12, color: "var(--cm-muted)", marginTop: 6, marginBottom: 16 }}>
        Rituais da sua turma e das suas comunidades.
      </p>
      <div style={{ display: "grid", gap: 10 }}>
        {RITUALS.map((r) => (
          <div key={r.id} className="cm-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 14 }}>
            <div>
              <h4 style={{ fontSize: 13, color: "var(--cm-ink)" }}>{r.title}</h4>
              <p style={{ fontSize: 11, color: "var(--cm-muted)", marginTop: 2 }}>{r.when}</p>
            </div>
            <span style={{ fontSize: 18 }}>📅</span>
          </div>
        ))}
      </div>
      <div className="cm-card" style={{ marginTop: 16 }}>
        <h4 style={{ fontSize: 13, marginBottom: 6 }}>Notificações</h4>
        <p style={{ fontSize: 12, color: "var(--cm-muted)" }}>
          Avisos de pólen, tempo e conclusão aparecem aqui e na tela de missões — nunca como ranking ou comparação entre colegas.
        </p>
      </div>
    </div>
  );
}

function PerfilScreen({ studentName, favosBalance, equipped, onOpenAbelha }) {
  return (
    <div>
      <span className="cm-pill cm-pill-warm">Perfil</span>
      <h2 style={{ fontSize: 22, marginTop: 10, color: "var(--cm-ink)" }}>{studentName}</h2>
      <p style={{ fontSize: 12, color: "var(--cm-muted)", marginTop: 4 }}>{favosBalance} favos disponíveis</p>

      <button
        onClick={onOpenAbelha}
        style={{ width: "100%", background: "var(--cm-lime)", border: "1px solid var(--cm-lime-deep)", borderRadius: 18, padding: 18, marginTop: 16, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}
      >
        <BeeMascot size={80} equipped={equipped} />
        <span style={{ fontSize: 12, fontWeight: 700, color: "var(--cm-ink)" }}>Editar minha abelha →</span>
      </button>

      <div className="cm-card" style={{ marginTop: 16 }}>
        <h4 style={{ fontSize: 13, marginBottom: 8 }}>Meus dados</h4>
        <p style={{ fontSize: 12, color: "var(--cm-muted)", lineHeight: 1.6 }}>
          Nome, turma e interesses ficam salvos só neste navegador. Sem senha, sem dados sensíveis.
        </p>
      </div>
      <div className="cm-card" style={{ marginTop: 12 }}>
        <h4 style={{ fontSize: 13, marginBottom: 8 }}>Preferências</h4>
        <p style={{ fontSize: 12, color: "var(--cm-muted)" }}>Compartilhar descobertas no feed — em breve.</p>
      </div>
    </div>
  );
}

const SHOP_ITEMS = [
  { id: "chapeu_flor", type: "chapeu", name: "Chapéu de flor", cost: 3, emoji: "🌸" },
  { id: "chapeu_grao", type: "chapeu", name: "Capelo", cost: 4, emoji: "🎓" },
  { id: "camisa_lima", type: "roupa", name: "Camisa lima", cost: 3, emoji: "🟢" },
  { id: "camisa_roxa", type: "roupa", name: "Camisa roxa", cost: 3, emoji: "🟣" },
  { id: "saia_laranja", type: "saia", name: "Saia laranja", cost: 2, emoji: "🟠" },
  { id: "saia_lima", type: "saia", name: "Saia lima", cost: 2, emoji: "🟡" },
];
const SHOP_GROUPS = [["chapeu", "Chapéus"], ["roupa", "Roupas"], ["saia", "Saia"]];

function MinhaAbelhaScreen({ favosBalance, ownedItems, equipped, onBuy, onToggleEquip, onBack }) {
  return (
    <div>
      <button onClick={onBack} className="cm-btn cm-btn-ghost" style={{ marginBottom: 14 }}>← Voltar ao perfil</button>
      <span className="cm-pill cm-pill-warm">Perfil / Minha abelha</span>
      <h2 style={{ fontSize: 22, marginTop: 10, color: "var(--cm-ink)" }}>Sua abelha, do seu jeito.</h2>
      <p style={{ fontSize: 12, color: "var(--cm-muted)", marginTop: 6 }}>{favosBalance} favos disponíveis</p>

      <div style={{ background: "var(--cm-lime)", border: "1px solid var(--cm-lime-deep)", borderRadius: 20, padding: 18, marginTop: 14, display: "flex", justifyContent: "center" }}>
        <BeeMascot size={110} equipped={equipped} />
      </div>

      {SHOP_GROUPS.map(([type, label]) => (
        <div key={type} style={{ marginTop: 18 }}>
          <h4 style={{ fontSize: 13, marginBottom: 8 }}>{label}</h4>
          <div className="grid gap-2" style={{ gridTemplateColumns: "1fr 1fr" }}>
            {SHOP_ITEMS.filter((it) => it.type === type).map((it) => {
              const owned = ownedItems.includes(it.id);
              const equippedHere = equipped[it.type] === it.id;
              return (
                <div key={it.id} className="cm-card" style={{ padding: 12, textAlign: "center" }}>
                  <div style={{ fontSize: 26 }}>{it.emoji}</div>
                  <p style={{ fontSize: 12, fontWeight: 700, marginTop: 4 }}>{it.name}</p>
                  {!owned ? (
                    <button
                      onClick={() => onBuy(it)} disabled={favosBalance < it.cost}
                      className="cm-btn" style={{ width: "100%", marginTop: 8, fontSize: 11, padding: "8px 6px" }}
                    >
                      Comprar · {it.cost} 🐝
                    </button>
                  ) : (
                    <button
                      onClick={() => onToggleEquip(it)}
                      className={equippedHere ? "cm-btn cm-btn-primary" : "cm-btn"}
                      style={{ width: "100%", marginTop: 8, fontSize: 11, padding: "8px 6px" }}
                    >
                      {equippedHere ? "✓ Equipado" : "Equipar"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}