import React, { useEffect, useRef, useState } from "react";
import { Home, Users, Hexagon, UserRound, ArrowLeft, Sun, Moon, Bell, Pencil, Plus, MessageCircle } from "lucide-react";
import { CRITERIOS, TURMAS, useCommunity, timeAgo } from "@/state/CommunityState";
import BeeMascot from "@/components/colmeia/BeeMascot";
import "./community.css";

const NAV = [{ id: "inicio", label: "Início", Icon: Home }, { id: "comunidades", label: "Comunidades", Icon: Users }, { id: "missoes", label: "Missões", Icon: Hexagon }, { id: "perfil", label: "Perfil", Icon: UserRound }];

export default function CommunityShell() {
  const { dark, toggleDark, storageError, avisos, pedidos } = useCommunity();
  const [role, setRole] = useState("aluno");
  const [tab, setTab] = useState("inicio");
  const [detail, setDetail] = useState(null);
  const [notifications, setNotifications] = useState(false);
  const scroll = useRef(null);
  const start = useRef(null);
  const [dismissed, setDismissed] = useState(null);
  const notice = avisos[0];
  useEffect(() => { scroll.current?.scrollTo(0, 0); }, [tab, detail, role]);
  function navigate(next) { setTab(next); setDetail(null); setNotifications(false); }
  function openClub(id) { setTab("comunidades"); setDetail({ type: "club", id }); }
  function openMission(id) { setTab("missoes"); setDetail({ type: "mission", id }); }
  return <div className="co-stage cm-font">
    <div className={`cm-device co-phone${dark ? " cm-dark" : ""}`}>
      <header className="co-header">
        <div className="co-row"><strong>colmeia<span className="co-accent">.</span></strong><span className="co-muted co-small" title="Indicador ilustrativo da demonstração">Demo · 85% ▰</span><button className="co-icon" aria-label="Alternar modo claro e noturno" onClick={toggleDark}>{dark ? <Sun size={18} /> : <Moon size={18} />}</button><button className="co-icon" aria-label="Notificações" onClick={() => setNotifications(!notifications)}><Bell size={18} />{(role === "aluno" ? avisos.length : pedidos.filter((p) => !p.atendido).length) > 0 && <span className="co-dot" />}</button></div>
        <div className="co-switch" aria-label="Visão da demonstração">{["aluno", "mediador"].map((r) => <button key={r} aria-pressed={role === r} onClick={() => { setRole(r); setTab("inicio"); setDetail(null); setNotifications(false); }}>Visão do {r}</button>)}</div>
      </header>
      <main ref={scroll} className="co-scroll" onTouchStart={(e) => { start.current = e.target.closest("button,input,textarea,select,a") ? null : { x: e.touches[0].clientX, y: e.touches[0].clientY }; }} onTouchEnd={(e) => { if (!start.current) return; const dx = e.changedTouches[0].clientX - start.current.x; const dy = e.changedTouches[0].clientY - start.current.y; if (Math.abs(dx) > 90 && Math.abs(dx) > Math.abs(dy) * 2) { setRole(dx < 0 ? "mediador" : "aluno"); setTab("inicio"); setDetail(null); } start.current = null; }}>
        {storageError && <p role="alert" className="co-note">Não foi possível salvar no navegador. As mudanças ficam disponíveis enquanto esta página estiver aberta.</p>}
        {notifications ? <><Title eyebrow="Sua Colmeia" title="Notificações" />{role === "mediador" ? <Support /> : avisos.length ? avisos.map((a) => <Card key={a.id}>{a.texto}</Card>) : <Card>As respostas do mediador e as conclusões de missões aparecem aqui.</Card>}</> : role === "mediador" ? <Mediator tab={tab} /> : detail?.type === "club" ? <Club id={detail.id} back={() => setDetail(null)} openMission={openMission} /> : detail?.type === "mission" ? <Mission id={detail.id} back={() => setDetail(null)} /> : <>
          {tab === "inicio" && <Feed openClub={openClub} />}
          {tab === "comunidades" && <Communities openClub={openClub} />}
          {tab === "missoes" && <Missions openMission={openMission} />}
          {tab === "perfil" && <Profile />}
        </>}
      </main>
      {role === "aluno" && notice && dismissed !== notice.id && <div role="status" className="co-toast"><span>{notice.texto}</span><button className="co-icon" aria-label="Fechar aviso" onClick={() => setDismissed(notice.id)}>×</button></div>}
      <nav className="co-nav" aria-label="Navegação principal">{NAV.map(({ id, label, Icon }) => <button key={id} aria-current={tab === id ? "page" : undefined} onClick={() => navigate(id)}><Icon size={21} /><span>{label}</span></button>)}</nav>
    </div>
  </div>;
}
function Title({ eyebrow, title, children }) { return <div className="co-title"><p className="co-eyebrow">{eyebrow}</p><h2>{title}</h2>{children && <p className="co-muted">{children}</p>}</div>; }
function Card({ children, className = "" }) { return <section className={`co-card ${className}`}>{children}</section>; }
function Button({ children, onClick, disabled, secondary = false, type = "button" }) { return <button type={type} disabled={disabled} onClick={onClick} className={`co-button${secondary ? " co-secondary" : ""}`}>{children}</button>; }
function Back({ onClick }) { return <button className="co-back" onClick={onClick}><ArrowLeft size={16} /> Voltar</button>; }
function Field({ label, value, onChange, multiline = false, required = false }) { const Tag = multiline ? "textarea" : "input"; return <label className="co-field">{label}<Tag value={value} onChange={(e) => onChange(e.target.value)} required={required} maxLength={multiline ? 1500 : 100} rows={multiline ? 3 : undefined} /></label>; }
function ClubLabel({ clubeId }) { const { clubes, comunidades } = useCommunity(); const c = clubes.find((item) => item.id === clubeId); const space = comunidades.find((item) => item.id === c?.comunidadeId); return <span className="co-muted co-small">{space?.nome} · {c?.nome}</span>; }

function Feed({ openClub }) {
  const { profile, posts, clubes } = useCommunity();
  const [filter, setFilter] = useState("meus");
  const visible = posts.filter((p) => filter === "escola" || clubes.some((c) => c.id === p.clubeId && c.membros.includes("me")));
  return <><Title eyebrow="Saberes que circulam" title={`Oi, ${profile.nome}!`}>O que vamos construir juntos hoje?</Title>
    <div className="co-banner"><span className="co-sticker">feito em conjunto ✦</span><h3>Sua voz faz parte da escola.</h3><p>Encontre seu clube, troque experiências e leve a conversa para fora da tela.</p></div>
    <div className="co-tabs">{[["meus", "Meus clubes"], ["escola", "Toda a escola"]].map(([id, label]) => <button key={id} aria-pressed={filter === id} onClick={() => setFilter(id)}>{label}</button>)}</div>
    <Composer />
    {visible.length ? visible.map((p) => <Post key={p.id} post={p} openClub={openClub} />) : <Card>Seu feed está começando. Entre em um clube e compartilhe a primeira descoberta.</Card>}
  </>;
}
function Composer({ clubeId }) {
  const { clubes, profile, createPost } = useCommunity();
  const mine = clubes.filter((c) => c.membros.includes("me"));
  const [selected, setSelected] = useState(clubeId || mine[0]?.id || "");
  const [text, setText] = useState("");
  const [sent, setSent] = useState(false);
  const [expanded, setExpanded] = useState(false);
  if (!mine.length) return null;
  return <Card><button className="co-compose-toggle" aria-expanded={expanded} onClick={() => setExpanded(!expanded)}><span className="co-avatar">✦</span><span>Compartilhe uma descoberta…</span><Plus size={16} /></button>{sent && !expanded && <p role="status">Descoberta compartilhada!</p>}{expanded && <form onSubmit={(e) => { e.preventDefault(); createPost(clubeId || selected, text); setText(""); setSent(true); setExpanded(false); }}>
    <strong>{profile.nome} · {profile.turma}</strong>
    {!clubeId && <label className="co-field">Compartilhar no clube<select value={selected} onChange={(e) => setSelected(e.target.value)}>{mine.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}</select></label>}
    <Field label="Sua descoberta" value={text} onChange={(t) => { setText(t); setSent(false); }} multiline required />
    <p className="co-small co-muted">Visível no clube e no feed da comunidade escolar.</p><Button type="submit" disabled={!text.trim()}>Compartilhar saber</Button>{sent && <p role="status">Descoberta compartilhada!</p>}
  </form>}</Card>;
}
function Post({ post, openClub }) {
  const { comment } = useCommunity();
  const [reply, setReply] = useState("");
  const [expanded, setExpanded] = useState(false);
  return <Card><div className="co-row"><span className="co-avatar">✦</span><div><strong>{post.autor}</strong><div className="co-small co-muted">{timeAgo(post.criadoEm)}</div></div></div>
    <button className="co-link" onClick={() => openClub?.(post.clubeId)} disabled={!openClub}><ClubLabel clubeId={post.clubeId} /></button>
    {post.texto && <p className="co-body">{post.texto}</p>}{post.foto && <img className="co-evidence" src={post.foto} alt="Registro da resposta coletiva" />}
    <button className="co-back" onClick={() => setExpanded(!expanded)}><MessageCircle size={16} /> {post.comentarios.length} respostas · Conversar</button>
    {expanded && <><div className="co-replies">{post.comentarios.map((c, i) => <p key={i}><strong>{c.autor}</strong><br />{c.texto}</p>)}</div><form onSubmit={(e) => { e.preventDefault(); comment(post.id, reply); setReply(""); }}><Field label="Sua contribuição à conversa" value={reply} onChange={setReply} required /><Button type="submit" disabled={!reply.trim()}>Responder</Button></form></>}
  </Card>;
}
function Communities({ openClub }) {
  const { comunidades, clubes, createClub } = useCommunity();
  const [filter, setFilter] = useState("minhas");
  const [selected, setSelected] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const shown = comunidades.filter((c) => filter === "descobrir" || clubes.some((club) => club.comunidadeId === c.id && club.membros.includes("me")));
  if (selected) {
    const community = comunidades.find((c) => c.id === selected);
    return <><Back onClick={() => { setSelected(null); setCreating(false); }} /><Title eyebrow="Comunidade" title={community.nome}>{community.descricao}</Title><p className="co-note">Clubes conectam alunos de diferentes turmas. Os embaixadores são estudantes que ajudam a organizar cada grupo.</p>
      {clubes.filter((c) => c.comunidadeId === selected).map((c) => <ClubCard key={c.id} club={c} openClub={openClub} />)}
      <Button secondary onClick={() => setCreating(!creating)}><Plus size={16} /> Propor um clube</Button>{creating && <Card><form onSubmit={(e) => { e.preventDefault(); createClub(selected, name, description); setName(""); setDescription(""); setCreating(false); }}><Field label="Nome do clube" value={name} onChange={setName} required /><Field label="O que vocês querem construir juntos?" value={description} onChange={setDescription} multiline required /><p className="co-small">Você começa como embaixador e pode convidar colegas para construir o clube.</p><Button type="submit" disabled={!name.trim() || !description.trim()}>Criar clube</Button></form></Card>}
    </>;
  }
  return <><Title eyebrow="Encontre sua turma de ideias" title="Comunidades">Clubes de alunos, conexões entre turmas.</Title><div className="co-tabs">{[["minhas", "Minhas comunidades"], ["descobrir", "Descobrir"]].map(([id, label]) => <button key={id} aria-pressed={filter === id} onClick={() => setFilter(id)}>{label}</button>)}</div>
    {shown.map((c) => <button className="co-card co-community" key={c.id} onClick={() => setSelected(c.id)}><span className="co-community-art">{c.emoji}</span><strong>{c.nome}</strong><p>{c.descricao}</p><span className="co-small">{clubes.filter((club) => club.comunidadeId === c.id).length} clubes · Explorar →</span></button>)}
  </>;
}
function ClubCard({ club, openClub }) { return <Card><h3>{club.nome}</h3><p className="co-muted">{club.descricao}</p><p className="co-small">{club.turmas.join(" · ")}</p><span className="co-tag">{club.embaixador === "me" ? "Você é embaixador" : club.membros.includes("me") ? "Você participa" : "Inscrições abertas"}</span><Button secondary onClick={() => openClub(club.id)}>Abrir clube</Button></Card>; }
function Club({ id, back, openMission }) {
  const { clubes, profile, missoes, posts, joinClub, requestSupport, pedidos } = useCommunity();
  const [manage, setManage] = useState(false);
  const [create, setCreate] = useState(false);
  const c = clubes.find((item) => item.id === id);
  if (!c) return <Back onClick={back} />;
  const member = c.membros.includes("me");
  const ambassador = c.embaixador === "me";
  return <><Back onClick={back} /><Title eyebrow="Clube da comunidade" title={c.nome}>{c.descricao}</Title><Card><span className="co-tag">{ambassador ? `${profile.nome}, você é embaixador` : "Organizado por estudantes"}</span><p>{c.membros.length} participantes · {c.turmas.join(" · ")}</p><p className="co-muted">{c.encontro}</p>{!member && <Button onClick={() => joinClub(id)}>Entrar no clube</Button>}{ambassador && <Button secondary onClick={() => setManage(!manage)}><Pencil size={15} /> Organizar clube</Button>}</Card>
    {manage && ambassador && <ManageClub club={c} />}
    {member && <><div className="co-row"><h3>Missões do clube</h3>{ambassador && <button className="co-icon" aria-label="Propor missão" onClick={() => setCreate(!create)}><Plus /></button>}</div>{create && <NewMission clubeId={id} done={() => setCreate(false)} />}
      {missoes.filter((m) => m.clubeId === id).map((m) => <MissionCard key={m.id} mission={m} openMission={openMission} />)}
      <Button secondary disabled={pedidos.some((p) => p.clubeId === id && !p.missaoId && !p.atendido)} onClick={() => requestSupport(id, "Preciso de pólen")}>Preciso de pólen · apoio do mediador</Button>
      {pedidos.some((p) => p.clubeId === id && !p.missaoId && !p.atendido) && <p role="status">Pedido enviado ao mediador.</p>}<h3 className="co-section-title">Feed do clube</h3><Composer clubeId={id} />
    </>}
    {posts.filter((p) => p.clubeId === id).map((p) => <Post key={p.id} post={p} />)}
  </>;
}
function ManageClub({ club }) {
  const { updateClub } = useCommunity();
  const [name, setName] = useState(club.nome);
  const [meeting, setMeeting] = useState(club.encontro);
  const [invite, setInvite] = useState("");
  const [saved, setSaved] = useState(false);
  return <Card><h3>Organizar com o grupo</h3><form onSubmit={(e) => { e.preventDefault(); updateClub(club.id, { nome: name.trim(), encontro: meeting.trim() }); setSaved(true); }}><Field label="Nome do clube" value={name} onChange={setName} required /><Field label="Próximo encontro" value={meeting} onChange={setMeeting} required /><Button type="submit" disabled={!name.trim() || !meeting.trim()}>Salvar combinados</Button>{saved && <p role="status">Combinados atualizados.</p>}</form>
    <form onSubmit={(e) => { e.preventDefault(); if (!invite.trim()) return; updateClub(club.id, { convites: [...club.convites, invite.trim()] }); setInvite(""); }}><Field label="Convidar colega · nome e turma" value={invite} onChange={setInvite} required /><Button type="submit" secondary disabled={!invite.trim()}>Registrar convite na demo</Button></form><p className="co-small co-muted">O convite fica registrado neste navegador para combinar pessoalmente. Nenhuma mensagem externa é enviada.</p>{club.convites.map((c, i) => <p key={i} className="co-tag">{c} · convite registrado</p>)}
  </Card>;
}
function Missions({ openMission }) {
  const { missoes, clubes } = useCommunity();
  const mine = missoes.filter((m) => clubes.some((c) => c.id === m.clubeId && c.membros.includes("me"))).sort((a, b) => Number(a.status === "concluida") - Number(b.status === "concluida") || a.prazo - b.prazo);
  return <><Title eyebrow="Cada parte importa" title="Missões">Seu favo contribui para uma resposta que só existe em conjunto.</Title>{mine.length ? mine.map((m) => <MissionCard key={m.id} mission={m} openMission={openMission} />) : <Card>Entre em um clube para participar das missões.</Card>}</>;
}
function Timer({ deadline }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const timer = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(timer); }, []);
  const seconds = Math.max(0, Math.ceil((deadline - now) / 1000));
  return <span className="co-small">{seconds ? `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")} restantes` : "Prazo encerrado · peça mais tempo se precisar"}</span>;
}
function MissionCard({ mission, openMission }) { return <Card className={mission.status === "concluida" ? "co-completed" : ""}><ClubLabel clubeId={mission.clubeId} /><h3>{mission.titulo}</h3><p className="co-muted">{mission.descricao}</p>{mission.status === "concluida" ? <span className="co-tag co-success">✓ Concluída</span> : <Timer deadline={mission.prazo} />}<Button secondary onClick={() => openMission(mission.id)}>{mission.status === "concluida" ? "Ver relatório final" : "Abrir meu favo"}</Button></Card>; }
function Mission({ id, back }) {
  const { missoes, confirmFavo, completeMission, shareMission, requestSupport, pedidos } = useCommunity();
  const [text, setText] = useState("");
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState("");
  const m = missoes.find((item) => item.id === id);
  if (!m) return <Back onClick={back} />;
  async function loadPhoto(e) {
    const file = e.target.files[0]; setError(""); setPhoto(null);
    if (!file) return;
    if (!/^image\/(jpeg|png|webp)$/.test(file.type) || file.size > 1000000) { setError("Escolha uma foto JPG, PNG ou WebP de até 1 MB."); e.target.value = ""; return; }
    const reader = new FileReader(); reader.onload = () => setPhoto(reader.result); reader.onerror = () => setError("Não foi possível ler a foto. Tente novamente."); reader.readAsDataURL(file);
  }
  return <><Back onClick={back} /><Title eyebrow={m.status === "concluida" ? "Relatório final" : "Missão do clube"} title={m.titulo}>{m.descricao}</Title>
    {m.status === "concluida" ? <><Card><span className="co-tag co-success">✓ Resposta coletiva concluída</span><p>{m.resposta}</p>{m.foto && <img src={m.foto} alt="Evidência da resposta coletiva" className="co-evidence" />}<h3>O que exercitamos</h3>{m.criterios.map((c) => <p key={c}>✦ {c}</p>)}<p className="co-muted co-small">Reconhecimento da experiência do grupo, sem nota individual.</p><Button disabled={m.compartilhada} onClick={() => shareMission(id)}>{m.compartilhada ? "Compartilhada no feed" : "Compartilhar resposta no feed"}</Button><p className="co-small co-muted">O registro aparecerá no clube e na comunidade escolar.</p></Card></> : <>
      <Card><Timer deadline={m.prazo} /><div className="co-favo">⬡</div><h3>Meu favo · um fragmento da resposta</h3><p>{m.favo}</p><p className="co-note">Converse com diferentes colegas do clube. Cada pessoa acessa apenas o próprio fragmento; descubram juntos como as partes se conectam.</p></Card>
      <Card><strong>{m.confirmados} de {m.total} favos reunidos</strong><progress value={m.confirmados} max={m.total} /><p className="co-small co-muted">Cenário de demonstração: as outras duas contribuições já foram confirmadas. Seu check-in fecha este encontro.</p><Button disabled={m.meuConfirmado} onClick={() => confirmFavo(id)}>{m.meuConfirmado ? "Minha conversa está confirmada" : "Conversei e contribuí com meu favo"}</Button></Card>
      {m.registrador === "me" && <Card><h3>Registre a resposta de vocês</h3><p>Você confirmou o último favo e registra o que o grupo decidiu. Combinem a resposta antes de enviar.</p><Field label="Resposta coletiva" value={text} onChange={setText} multiline /><label className="co-field">Foto da descoberta · opcional<input type="file" accept="image/jpeg,image/png,image/webp" onChange={loadPhoto} /></label>{photo && <><img className="co-evidence" src={photo} alt="Prévia da foto selecionada" /><Button secondary onClick={() => setPhoto(null)}>Remover foto</Button></>}{error && <p role="alert">{error}</p>}<Button disabled={!text.trim() && !photo} onClick={() => completeMission(id, text, photo)}>Concluir resposta coletiva</Button></Card>}
      <Card><h3>Apoio quando vocês precisarem</h3>{["Preciso de pólen", "Mais 5 minutos", "Favo coringa"].map((tipo) => <Button secondary key={tipo} disabled={pedidos.some((p) => p.missaoId === id && p.tipo === tipo && !p.atendido)} onClick={() => requestSupport(m.clubeId, tipo, id)}>{pedidos.some((p) => p.missaoId === id && p.tipo === tipo && !p.atendido) ? `${tipo} · solicitado` : tipo}</Button>)}<p className="co-small co-muted">O favo coringa é um pedido ao mediador para incluir alguém sem celular. Combine quem registrará sua contribuição.</p></Card>
    </>}
  </>;
}
function Profile() {
  const { profile, saveProfile, clubes, missoes } = useCommunity();
  const [avatar, setAvatar] = useState(false);
  const [edit, setEdit] = useState(false);
  const [draft, setDraft] = useState(profile);
  const [saved, setSaved] = useState(false);
  const completed = missoes.filter((m) => m.status === "concluida");
  return <><Title eyebrow="Seu lugar na Colmeia" title="Perfil" /><Card><button className="co-profile-bee" aria-label="Abrir Minha Abelha" onClick={() => setAvatar(!avatar)}><BeeMascot size={80} equipped={profile.equipped} /></button><h3>{profile.nome}</h3><p>{profile.turma} · {profile.interesses}</p><Button secondary onClick={() => { setDraft(profile); setEdit(!edit); setSaved(false); }}><Pencil size={15} /> Editar perfil</Button>{saved && <p role="status">Perfil salvo neste navegador.</p>}</Card>
    {edit && <Card><form onSubmit={(e) => { e.preventDefault(); saveProfile({ ...draft, nome: draft.nome.trim() }); setEdit(false); setSaved(true); }}><Field label="Nome" value={draft.nome} onChange={(nome) => setDraft({ ...draft, nome })} required /><label className="co-field">Minha turma<select value={draft.turma} onChange={(e) => setDraft({ ...draft, turma: e.target.value })}>{TURMAS.map((t) => <option key={t}>{t}</option>)}</select></label><Field label="Interesses" value={draft.interesses} onChange={(interesses) => setDraft({ ...draft, interesses })} /><Button type="submit" disabled={!draft.nome.trim()}>Salvar perfil</Button></form></Card>}
    {avatar && <Card><h3>Minha Abelha</h3><div className="co-bee"><BeeMascot size={160} equipped={profile.equipped} /></div><p>Sua abelha, seu jeito de participar.</p><label className="co-field">Personalizar roupa<select value={profile.equipped.roupa || ""} onChange={(e) => saveProfile({ ...profile, equipped: { ...profile.equipped, roupa: e.target.value } })}><option value="">Clássica</option><option value="camisa_lima">Camiseta lima</option><option value="camisa_roxa">Camiseta lilás</option></select></label><label className="co-field">Personalizar chapéu<select value={profile.equipped.chapeu || ""} onChange={(e) => saveProfile({ ...profile, equipped: { ...profile.equipped, chapeu: e.target.value } })}><option value="">Sem chapéu</option><option value="chapeu_flor">Flor</option><option value="chapeu_grao">Formatura</option></select></label></Card>}
    <Card><h3>Minha participação</h3><p>{clubes.filter((c) => c.membros.includes("me")).length} clubes · {completed.length} respostas coletivas</p>{clubes.filter((c) => c.embaixador === "me").map((c) => <p key={c.id} className="co-tag">Embaixador · {c.nome}</p>)}{completed.length > 0 && <><h3>Competências exercitadas</h3>{[...new Set(completed.flatMap((m) => m.criterios))].map((c) => <p key={c}>✦ {c}</p>)}</>}</Card>
  </>;
}
function Support() {
  const { pedidos, resolveSupport, clubes } = useCommunity();
  return pedidos.length ? pedidos.map((p) => <Card key={p.id}><span className="co-tag">{p.atendido ? "Apoio acolhido" : "Aguardando apoio"}</span><h3>{p.tipo}</h3><p>{p.autor} · {clubes.find((c) => c.id === p.clubeId)?.nome}</p><Button disabled={p.atendido} onClick={() => resolveSupport(p.id)}>{p.atendido ? "Atendido" : p.tipo === "Mais 5 minutos" ? "Conceder mais 5 minutos" : "Acolher pedido"}</Button></Card>) : <Card>Nenhum pedido agora. Os alunos conduzem os clubes e podem chamar você quando precisarem.</Card>;
}
function Mediator({ tab }) {
  const { clubes, comunidades, missoes, posts, createCommunity } = useCommunity();
  const section = { inicio: "apoio", missoes: "panorama", comunidades: "comunidades", perfil: "perfil" }[tab];
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  return <><Title eyebrow="Presença que apoia" title="Apoiar a Colmeia">Os alunos conduzem os clubes. Você ajuda com escuta, inclusão e os recursos da escola.</Title><div className="co-stats"><Card><strong>{clubes.length}</strong><br />clubes</Card><Card><strong>{missoes.filter((m) => m.status === "ativa").length}</strong><br />missões ativas</Card></div>
    {section === "perfil" && <MediatorProfile />}
    {section === "apoio" && <><h3>Pedidos de apoio</h3><Support /><h3 className="co-section-title">Feed da comunidade escolar</h3>{posts.slice(0, 3).map((p) => <Card key={p.id}><ClubLabel clubeId={p.clubeId} /><p><strong>{p.autor}</strong></p><p>{p.texto}</p></Card>)}</>}
    {section === "panorama" && <><Card><h3>Experiências compartilhadas</h3><p>{posts.length} postagens · {missoes.filter((m) => m.status === "concluida").length} respostas concluídas</p><p className="co-small co-muted">Registros de participação, sem classificação de alunos.</p></Card>{missoes.map((m) => <Card key={m.id}><ClubLabel clubeId={m.clubeId} /><h3>{m.titulo}</h3><p>{m.status === "ativa" ? "Em andamento" : "Resposta coletiva concluída"}</p>{m.criterios.map((c) => <p key={c} className="co-small">{c}</p>)}{m.resposta && <p>{m.resposta}</p>}{m.foto && <img src={m.foto} alt="Evidência enviada pelo grupo" className="co-evidence" />}</Card>)}</>}
    {section === "comunidades" && <>{comunidades.map((c) => <Card key={c.id}><h3>{c.nome}</h3><p>{c.descricao}</p><p className="co-small">{clubes.filter((club) => club.comunidadeId === c.id).length} clubes conduzidos por alunos</p></Card>)}<Card><h3>Abrir uma comunidade</h3><form onSubmit={(e) => { e.preventDefault(); createCommunity(name, description); setName(""); setDescription(""); }}><Field label="Nome da comunidade" value={name} onChange={setName} required /><Field label="Propósito compartilhado" value={description} onChange={setDescription} multiline required /><Button type="submit" disabled={!name.trim() || !description.trim()}>Criar comunidade</Button></form></Card></>}
  </>;
}
function NewMission({ clubeId, done }) {
  const { createMission } = useCommunity();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [favo, setFavo] = useState("");
  const [criteria, setCriteria] = useState(CRITERIOS[0]);
  return <Card><h3>Propor missão ao clube</h3><p className="co-small co-muted">Demonstração de uma missão de 30 minutos com três fragmentos. Os outros dois check-ins são simulados; aqui você prepara o favo visível neste aparelho.</p><form onSubmit={(e) => { e.preventDefault(); createMission({ clubeId, titulo: title.trim(), descricao: description.trim(), favo: favo.trim(), criterios: [criteria] }); done(); }}><Field label="Pergunta coletiva" value={title} onChange={setTitle} required /><Field label="O que vamos fazer presencialmente?" value={description} onChange={setDescription} multiline required /><Field label="Meu fragmento para a conversa" value={favo} onChange={setFavo} multiline required /><label className="co-field">Critério psicossocial<select value={criteria} onChange={(e) => setCriteria(e.target.value)}>{CRITERIOS.map((c) => <option key={c}>{c}</option>)}</select></label><Button type="submit" disabled={!title.trim() || !description.trim() || !favo.trim()}>Publicar missão de demonstração</Button></form></Card>;
}

function MediatorProfile() {
  const { mediatorProfile, saveMediatorProfile } = useCommunity();
  const [draft, setDraft] = useState(mediatorProfile || { nome: "Alex", cargo: "Orientação escolar" });
  const [saved, setSaved] = useState(false);
  return <Card><h3>Perfil do mediador</h3><form onSubmit={(e) => { e.preventDefault(); saveMediatorProfile(draft); setSaved(true); }}><Field label="Nome" value={draft.nome} onChange={(nome) => setDraft({ ...draft, nome })} required /><Field label="Papel ou cargo na escola" value={draft.cargo} onChange={(cargo) => setDraft({ ...draft, cargo })} required /><Button type="submit" disabled={!draft.nome.trim() || !draft.cargo.trim()}>Salvar papel de apoio</Button>{saved && <p role="status">Perfil de apoio salvo.</p>}</form></Card>;
}
