import React, { useEffect, useRef, useState } from "react";
import { Home, Users, Hexagon, UserRound, ArrowLeft, Sun, Moon, Bell, Pencil, Plus, MessageCircle, Heart, Camera, Sparkles, BadgeCheck, School, MapPin, RotateCcw, WandSparkles, Route, PhoneOff, TimerReset, CalendarDays, Compass, ChevronLeft, ChevronRight } from "lucide-react";
import { CRITERIOS, TURMAS, useCommunity, timeAgo } from "@/state/CommunityState";
import BeeMascot from "@/components/colmeia/BeeMascot";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { LOGO_COLMEIA } from "@/components/colmeia/SiteHeader";
import IPhoneMockup from "@/components/colmeia/IPhoneMockup";
import AvatarStudio from "@/components/colmeia/AvatarStudio";
import "./community.css";

const NAV = [{ id: "inicio", label: "Início", Icon: Home }, { id: "clubes", label: "Clubes", Icon: Users }, { id: "missoes", label: "Missões", Icon: Hexagon }, { id: "agenda", label: "Agenda", Icon: CalendarDays }, { id: "perfil", label: "Perfil", Icon: UserRound }];

export default function CommunityShell() {
  const { dark, toggleDark, resetDemo, storageError, avisos, pedidos } = useCommunity();
  const [params, setParams] = useSearchParams();
  const role = params.get("visao") === "mediador" ? "mediador" : "aluno";
  const reducedMotion = useReducedMotion();
  const pointer = useRef(null);
  function setRole(next) { setParams((prev) => { const result = new URLSearchParams(prev); result.set("visao", next); return result; }, { replace: true }); }
  function movePointer(e) {
    if (e.pointerType === "touch" || !pointer.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    pointer.current.style.transform = `translate(${e.clientX - rect.left}px, ${e.clientY - rect.top}px)`;
    pointer.current.style.opacity = "1";
  }
  const [tab, setTab] = useState("inicio");
  const [detail, setDetail] = useState(null);
  const [notifications, setNotifications] = useState(false);
  const scroll = useRef(null);
  const start = useRef(null);
  const [dismissed, setDismissed] = useState(null);
  const notice = avisos[0];
  useEffect(() => { scroll.current?.scrollTo(0, 0); }, [tab, detail, role]);
  function navigate(next) { setTab(next); setDetail(null); setNotifications(false); }
  function openClub(id, communityId = null) { setTab("clubes"); setDetail({ type: "club", id, communityId }); }
  function openMission(id, clubId = null, communityId = null) { setTab("missoes"); setDetail({ type: "mission", id, clubId, communityId }); }
  return <div className="co-stage cm-font">
    <div className="co-demo-heading"><span className="co-eyebrow">Uma escola. Diferentes perspectivas.</span><h1>Entre na Colmeia.</h1><p>Explore a jornada de quem participa e de quem apoia.</p></div>
    <div className="co-view-switch" role="group" aria-label="Escolher visão da demonstração"><span className={`co-view-indicator ${role === "mediador" ? "is-mediator" : ""}`} />{["aluno", "mediador"].map((r) => <button key={r} aria-pressed={role === r} onClick={() => { setRole(r); setTab("inicio"); setDetail(null); setNotifications(false); }}>{r === "aluno" ? <UserRound size={17} /> : <Users size={17} />}Visão do {r}</button>)}</div>
    <IPhoneMockup className={dark ? "cm-dark" : ""}>
    <div className={`co-phone${dark ? " cm-dark" : ""}`} onPointerMove={movePointer} onPointerLeave={() => { if (pointer.current) pointer.current.style.opacity = "0"; }} onPointerDown={() => pointer.current?.classList.add("is-pressed")} onPointerUp={() => pointer.current?.classList.remove("is-pressed")}>
      <span ref={pointer} className="co-touch-pointer" aria-hidden="true"><span /></span>
      <header className="co-header">
        <div className="co-row"><img className="co-app-logo" src={LOGO_COLMEIA} alt="Colmeia" /><button className="co-reset-button" aria-label="Reiniciar demonstração e apagar alterações locais" onClick={() => { resetDemo(); setTab("inicio"); setDetail(null); setNotifications(false); setDismissed(null); }}><RotateCcw size={14} /> Reiniciar</button><button className="co-icon" aria-label="Alternar modo claro e noturno" onClick={toggleDark}>{dark ? <Sun size={18} /> : <Moon size={18} />}</button><button className="co-icon" aria-label="Notificações" onClick={() => setNotifications(!notifications)}><Bell size={18} />{(role === "aluno" ? avisos.length : pedidos.filter((p) => !p.atendido).length) > 0 && <span className="co-dot" />}</button></div>
        <p className="co-role-label">{role === "aluno" ? "Sua comunidade, seu jeito" : "Apoio à comunidade escolar"}</p>
      </header>
      <AnimatePresence mode="wait" initial={false}><motion.main key={role} initial={{ x: reducedMotion ? 0 : role === "mediador" ? 70 : -70, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: reducedMotion ? 0 : role === "mediador" ? 70 : -70, opacity: 0 }} transition={{ duration: reducedMotion ? 0 : .22 }} ref={scroll} className="co-scroll" onTouchStart={(e) => { start.current = e.target.closest("button,input,textarea,select,a") ? null : { x: e.touches[0].clientX, y: e.touches[0].clientY }; }} onTouchEnd={(e) => { if (!start.current) return; const dx = e.changedTouches[0].clientX - start.current.x; const dy = e.changedTouches[0].clientY - start.current.y; if (Math.abs(dx) > 90 && Math.abs(dx) > Math.abs(dy) * 2) { setRole(dx < 0 ? "mediador" : "aluno"); setTab("inicio"); setDetail(null); } start.current = null; }}>
        {storageError && <p role="alert" className="co-note">Não foi possível salvar no navegador. As mudanças ficam disponíveis enquanto esta página estiver aberta.</p>}
        {notifications ? <><Title eyebrow="Sua Colmeia" title="Notificações" />{role === "mediador" ? <Support /> : avisos.length ? avisos.map((a) => <Card key={a.id}>{a.texto}</Card>) : <Card>As respostas do mediador e as conclusões de missões aparecem aqui.</Card>}</> : role === "mediador" ? <Mediator tab={tab} /> : detail?.type === "club" ? <Club key={detail.id} id={detail.id} back={() => { setTab("clubes"); setDetail(null); }} openMission={(id) => openMission(id, detail.id, detail.communityId)} /> : detail?.type === "mission" ? <Mission key={detail.id} id={detail.id} back={() => detail.clubId && detail.fromClub ? openClub(detail.clubId, detail.communityId) : setDetail(null)} /> : <>
          {tab === "inicio" && <Feed openClub={openClub} />}
          {tab === "clubes" && <Clubs openClub={openClub} />}
          {tab === "missoes" && <Missions openMission={openMission} />}
          {tab === "agenda" && <Agenda />}
          {tab === "perfil" && <Profile />}
        </>}
      </motion.main></AnimatePresence>
      {role === "aluno" && notice && dismissed !== notice.id && <div role="status" className="co-toast"><span>{notice.texto}</span><button className="co-icon" aria-label="Fechar aviso" onClick={() => setDismissed(notice.id)}>×</button></div>}
      <nav className="co-nav" aria-label="Navegação principal">{NAV.map(({ id, label, Icon }) => <button key={id} aria-current={tab === id ? "page" : undefined} onClick={() => navigate(id)}><Icon size={21} /><span>{label}</span></button>)}</nav>
    </div>
    </IPhoneMockup>
  </div>;
}
function Title({ eyebrow, title, children }) { return <div className="co-title"><p className="co-eyebrow">{eyebrow}</p><h2>{title}</h2>{children && <p className="co-muted">{children}</p>}</div>; }
function Card({ children, className = "" }) { return <section className={`co-card ${className}`}>{children}</section>; }
function Button({ children, onClick, disabled, secondary = false, type = "button" }) { return <button type={type} disabled={disabled} onClick={onClick} className={`co-button${secondary ? " co-secondary" : ""}`}>{children}</button>; }
function Back({ onClick }) { return <button className="co-back" onClick={onClick}><ArrowLeft size={16} /> Voltar</button>; }
function Field({ label, value, onChange, multiline = false, required = false }) { const Tag = multiline ? "textarea" : "input"; return <label className="co-field">{label}<Tag value={value} onChange={(e) => onChange(e.target.value)} required={required} maxLength={multiline ? 1500 : 100} rows={multiline ? 3 : undefined} /></label>; }
function ClubLabel({ clubeId }) { const { clubes } = useCommunity(); const c = clubes.find((item) => item.id === clubeId); return <span className="co-muted co-small">Clube · {c?.nome}</span>; }

function Feed({ openClub }) {
  const { profile, posts, clubes } = useCommunity();
  const [filter, setFilter] = useState("interesses");
  const normalize = (value) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const interests = normalize(profile.interesses || "").split(/[^a-z0-9]+/).filter((word) => word.length > 3);
  const score = (post) => {
    const club = clubes.find((c) => c.id === post.clubeId);
    const content = normalize(`${club?.nome || ""} ${club?.descricao || ""} ${post.texto}`);
    return interests.filter((word) => content.includes(word)).length;
  };
  const visible = [...posts].sort((a, b) => (filter === "interesses" ? score(b) - score(a) : 0) || b.criadoEm - a.criadoEm);
  const mine = clubes.filter((c) => c.membros.includes("me"));
  return <><Title eyebrow="Saberes que circulam" title={`Oi, ${profile.nome}!`}>O que a escola está criando hoje?</Title>
    <div className="co-feed-tabs"><LayerTabs label="Escolher feed" value={filter} onChange={setFilter} items={[["interesses", "Para você"], ["escola", "Toda a escola"]]} /></div>
    <p className="co-feed-explainer">{filter === "interesses" ? "Seus interesses primeiro. Você pode mudá-los no Perfil." : "As descobertas da escola, das mais recentes às mais antigas."}</p>
    <div className="co-club-strip" aria-label="Meus clubes">{mine.map((c, i) => <button key={c.id} onClick={() => openClub(c.id, c.comunidadeId)}><span className={`co-club-orb orb-${i % 3}`}>{c.nome.slice(0, 1)}</span><span>{c.nome}<small>{c.turmas.length} turmas</small></span></button>)}</div>
    <Composer />
    {visible.length ? visible.map((p) => <Post key={p.id} post={p} openClub={openClub} interestMatch={filter === "interesses" && score(p) > 0} />) : <Card>Seu feed está começando. Entre em um clube e compartilhe a primeira descoberta.</Card>}
  </>;
}
function Composer({ clubeId }) {
  const { clubes, profile, createPost } = useCommunity();
  const mine = clubes.filter((c) => c.membros.includes("me"));
  const [selected, setSelected] = useState(clubeId || mine[0]?.id || "");
  const [text, setText] = useState("");
  const [sent, setSent] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [photoError, setPhotoError] = useState("");
  const [expanded, setExpanded] = useState(false);
  if (!mine.length) return null;
  return <Card><button className="co-compose-toggle" aria-expanded={expanded} onClick={() => setExpanded(!expanded)}><span className="co-avatar"><Sparkles size={19} /></span><span>Compartilhe uma descoberta…</span><Plus size={16} /></button>{sent && !expanded && <p role="status">Descoberta compartilhada!</p>}{expanded && <form onSubmit={(e) => { e.preventDefault(); createPost(clubeId || selected, text, photo); setPhoto(null); setText(""); setSent(true); setExpanded(false); }}>
    <strong>{profile.nome} · {profile.turma}</strong>
    {!clubeId && <label className="co-field">Compartilhar no clube<select value={selected} onChange={(e) => setSelected(e.target.value)}>{mine.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}</select></label>}
    <Field label="Sua descoberta" value={text} onChange={(t) => { setText(t); setSent(false); }} multiline />
    <label className="co-photo-upload"><Camera size={18} /> Adicionar foto do encontro<input aria-label="Foto da publicação" type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => {
      const file = e.target.files[0]; setPhoto(null); setPhotoError(""); if (!file) return;
      if (!/^image\/(jpeg|png|webp)$/.test(file.type) || file.size > 1000000) { setPhotoError("Use uma foto JPG, PNG ou WebP de até 1 MB."); e.target.value = ""; return; }
      const reader = new FileReader(); reader.onload = () => setPhoto(reader.result); reader.onerror = () => setPhotoError("Não foi possível ler a foto."); reader.readAsDataURL(file);
    }} /></label>{photo && <><img src={photo} alt="Prévia da publicação" className="co-evidence" /><Button secondary onClick={() => setPhoto(null)}>Remover foto</Button></>}{photoError && <p role="alert">{photoError}</p>}
    <p className="co-small co-muted">Visível no clube e no feed da comunidade escolar.</p><Button type="submit" disabled={!text.trim() && !photo}>Compartilhar saber</Button>{sent && <p role="status">Descoberta compartilhada!</p>}
  </form>}</Card>;
}
function Post({ post, openClub, interestMatch = false }) {
  const { comment, toggleLike, clubes } = useCommunity();
  const [reply, setReply] = useState("");
  const [expanded, setExpanded] = useState(false);
  const club = clubes.find((item) => item.id === post.clubeId);
  return <Card className="co-social-post"><div className="co-row"><span className="co-avatar">{post.autor.slice(0, 1)}</span><div><strong>{post.autor}</strong><div className="co-small co-muted">{timeAgo(post.criadoEm)}</div></div></div>
    <button className="co-link" onClick={() => openClub?.(post.clubeId)} disabled={!openClub}><ClubLabel clubeId={post.clubeId} /></button>
    <div className="co-post-context"><span className={`co-audience-tag ${post.audience === "turma" ? "is-class" : "is-club"}`}>{post.audience === "turma" ? "Minha turma" : "Clube"}</span><span>{club?.turmas.join(" · ")}</span></div>
    {interestMatch && <span className="co-interest-label"><Sparkles size={11} /> Pelos seus interesses</span>}
    {post.foto ? <div className="co-post-media" onDoubleClick={() => toggleLike(post.id)}><img className="co-post-photo" src={post.foto} alt="Registro compartilhado pelo clube" /><span className="co-double-tap">Clique duas vezes para curtir</span></div> : <div className="co-post-note" onDoubleClick={() => toggleLike(post.id)}><span className="co-note-sticker">ideias que viram encontros</span><p>{post.texto}</p><Sparkles className="co-note-corner" size={92} aria-hidden="true" /></div>}
    <div className="co-social-actions"><button aria-pressed={(post.curtidas || []).includes("me")} aria-label={(post.curtidas || []).includes("me") ? "Descurtir publicação" : "Curtir publicação"} onClick={() => toggleLike(post.id)}><Heart size={23} fill={(post.curtidas || []).includes("me") ? "currentColor" : "none"} /><span>{(post.curtidas || []).length}</span></button><button aria-label="Abrir comentários" aria-expanded={expanded} onClick={() => setExpanded(!expanded)}><MessageCircle size={23} /><span>{post.comentarios.length}</span></button></div>
    {post.foto && post.texto && <p className="co-body"><strong>{post.autor}</strong> {post.texto}</p>}
    <button className="co-back" onClick={() => setExpanded(!expanded)}><MessageCircle size={16} /> {post.comentarios.length} comentários · Abrir conversa</button>
    {expanded && <><div className="co-replies">{post.comentarios.map((c, i) => <p key={i}><strong>{c.autor}</strong><br />{c.texto}</p>)}</div><form onSubmit={(e) => { e.preventDefault(); comment(post.id, reply); setReply(""); }}><Field label="Seu comentário" value={reply} onChange={setReply} required /><Button type="submit" disabled={!reply.trim()}>Responder</Button></form></>}
  </Card>;
}
function Clubs({ openClub }) {
  const { clubes, createClub } = useCommunity();
  const [filter, setFilter] = useState("minhas");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const shown = clubes.filter((club) => filter === "descobrir" || club.membros.includes("me"));
  return <><Title eyebrow="A escola é a comunidade" title="Clubes">Encontre interesses em comum e construa com estudantes de outras turmas.</Title><div className="co-tabs">{[["minhas", "Meus clubes"], ["descobrir", "Descobrir"]].map(([id, label]) => <button key={id} aria-pressed={filter === id} onClick={() => setFilter(id)}>{label}</button>)}</div>
    {filter === "descobrir" && <div className="co-ecosystem"><span className="co-sticker">uma escola, muitos clubes</span><p>Os clubes são conduzidos por estudantes. Embaixadores acolhem, convidam e organizam; o mediador entra quando o grupo pede apoio.</p></div>}
    {shown.map((c) => <ClubCard key={c.id} club={c} openClub={openClub} />)}
    <Button secondary onClick={() => setCreating(!creating)}><Plus size={16} /> Propor um clube</Button>{creating && <Card><form onSubmit={(e) => { e.preventDefault(); createClub("convivencia", name, description); setName(""); setDescription(""); setCreating(false); }}><Field label="Nome do clube" value={name} onChange={setName} required /><Field label="O que vocês querem construir juntos?" value={description} onChange={setDescription} multiline required /><p className="co-small">Você começa como embaixador e pode convidar colegas de outras turmas.</p><Button type="submit" disabled={!name.trim() || !description.trim()}>Criar clube</Button></form></Card>}
  </>;
}
function ClubCard({ club, openClub }) { return <Card><h3>{club.nome}</h3><p className="co-muted">{club.descricao}</p><p className="co-small">{club.membros.length} participantes · {club.turmas.join(" · ")}</p><span className={club.embaixador === "me" ? "co-ambassador-tag" : "co-tag"}>{club.embaixador === "me" ? "Você é embaixador" : club.membros.includes("me") ? "Você participa" : "Inscrições abertas"}</span><Button secondary onClick={() => openClub(club.id)}>Abrir clube</Button></Card>; }
function Club({ id, back, openMission }) {
  const { clubes, profile, missoes, posts, joinClub, requestSupport, pedidos } = useCommunity();
  const [manage, setManage] = useState(false);
  const [layer, setLayer] = useState("missoes");
  const c = clubes.find((item) => item.id === id);
  if (!c) return <Back onClick={back} />;
  const member = c.membros.includes("me");
  const ambassador = c.embaixador === "me";
  return <><Back onClick={back} /><ClubLabel clubeId={id} /><Title eyebrow="Clube conduzido por estudantes" title={c.nome}>{c.descricao}</Title><Card><span className={ambassador ? "co-ambassador-tag" : "co-tag"}>{ambassador ? `${profile.nome}, você é embaixador` : "Organizado por estudantes"}</span><p>{c.membros.length} participantes · {c.turmas.join(" · ")}</p><p className="co-muted">Próximo encontro · {c.encontro}</p>{!member && <Button onClick={() => joinClub(id)}>Entrar no clube</Button>}{ambassador && <Button secondary onClick={() => setManage(!manage)}><Pencil size={15} /> Organizar clube</Button>}</Card>
    {manage && ambassador && <ManageClub club={c} />}
    <LayerTabs label="Camadas do clube" value={layer} onChange={setLayer} items={[["missoes", "Missões"], ["feed", "Feed"], ["sobre", "Sobre"]]} />
    {layer === "sobre" && <><Card><h3>Quem organiza</h3><p>{ambassador ? `${profile.nome}, embaixador deste clube` : "Embaixador estudantil do clube"}</p><p className="co-muted">Convida colegas, combina encontros e ajuda o grupo a organizar suas iniciativas.</p><h3>Combinados do grupo</h3><p>{c.combinados}</p><h3>Apoio disponível</h3><p className="co-muted">O mediador ajuda com escuta, inclusão e recursos quando vocês precisam.</p></Card>{member && <SupportRequest clubeId={id} />}</>}
    {member && layer === "missoes" && <><div className="co-row"><h3>Missões do clube</h3></div><p className="co-small co-muted">O mediador publica as missões. O embaixador divulga a atividade e organiza a participação do clube.</p>
      {missoes.filter((m) => m.clubeId === id).map((m) => <MissionCard key={m.id} mission={m} openMission={openMission} />)}
      {!missoes.some((m) => m.clubeId === id) && <Card>O clube ainda não tem missões. Combinem uma pergunta que queiram explorar juntos.</Card>}
      <Button secondary disabled={pedidos.some((p) => p.clubeId === id && !p.missaoId && !p.atendido)} onClick={() => requestSupport(id, "Preciso de pólen")}>Preciso de pólen · apoio do mediador</Button>
      {pedidos.some((p) => p.clubeId === id && !p.missaoId && !p.atendido) && <p role="status">Pedido enviado ao mediador.</p>}
    </>}
    {!member && layer === "missoes" && <Card>Entre no clube para participar das missões e receber seu próprio fragmento.</Card>}
    {layer === "feed" && <><h3 className="co-section-title">Feed do clube</h3>{member && <Composer clubeId={id} />}{posts.filter((p) => p.clubeId === id).map((p) => <Post key={p.id} post={p} />)}{!posts.some((p) => p.clubeId === id) && <Card>Ainda não há descobertas compartilhadas neste clube.</Card>}</>}
  </>;
}
function ManageClub({ club }) {
  const { updateClub } = useCommunity();
  const [name, setName] = useState(club.nome);
  const [meeting, setMeeting] = useState(club.encontro);
  const [invite, setInvite] = useState("");
  const [agreements, setAgreements] = useState(club.combinados || "");
  const [saved, setSaved] = useState(false);
  return <Card><h3>Organizar com o grupo</h3><form onSubmit={(e) => { e.preventDefault(); updateClub(club.id, { nome: name.trim(), encontro: meeting.trim(), combinados: agreements.trim() }); setSaved(true); }}><Field label="Nome do clube" value={name} onChange={setName} required /><Field label="Próximo encontro · sem divulgar o local da missão" value={meeting} onChange={setMeeting} required /><Field label="Combinados do grupo" value={agreements} onChange={setAgreements} multiline /><Button type="submit" disabled={!name.trim() || !meeting.trim()}>Salvar combinados</Button>{saved && <p role="status">Combinados atualizados.</p>}</form>
    <form onSubmit={(e) => { e.preventDefault(); if (!invite.trim()) return; updateClub(club.id, { convites: [...club.convites, invite.trim()] }); setInvite(""); }}><Field label="Convidar colega · nome e turma" value={invite} onChange={setInvite} required /><Button type="submit" secondary disabled={!invite.trim()}>Registrar convite na demo</Button></form><p className="co-small co-muted">O convite fica registrado neste navegador para combinar pessoalmente. Nenhuma mensagem externa é enviada.</p>{club.convites.map((c, i) => <p key={i} className="co-tag">{c} · convite registrado</p>)}
  </Card>;
}
function Missions({ openMission }) {
  const { missoes, clubes, profile } = useCommunity();
  const mine = missoes.filter((m) => m.escopo === "turma" ? m.turma === profile.turma : clubes.some((c) => c.id === m.clubeId && c.membros.includes("me"))).sort((a, b) => Number(a.status === "concluida") - Number(b.status === "concluida") || a.prazo - b.prazo);
  return <><Title eyebrow="Cada parte importa" title="Missões">A missão da sua turma abre o caminho. Nos clubes, novos favos mantêm a rede viva.</Title>{mine.length ? mine.map((m) => <MissionCard key={m.id} mission={m} openMission={openMission} />) : <Card>Quando uma missão for lançada para sua turma ou para um de seus clubes, ela aparecerá aqui.</Card>}</>;
}
function Agenda({ mediator = false }) {
  const { rituais = [], clubes, profile, saveRitual } = useCommunity();
  const mine = clubes.filter((club) => club.membros.includes("me"));
  const visible = rituais.filter((item) => mediator || item.escopo === "turma" ? mediator || item.turma === profile.turma : mine.some((club) => club.id === item.clubeId)).sort((a, b) => `${a.data}${a.hora}`.localeCompare(`${b.data}${b.hora}`));
  const first = visible[0];
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(first || blankRitual(clubes, profile));
  const [month, setMonth] = useState(() => ritualDate(first?.data || "2026-10-01"));
  function beginNew() { setDraft(blankRitual(clubes, profile)); setEditing(true); }
  return <><Title eyebrow="Rituais da comunidade" title="Agenda">Encontros que voltam a acontecer e ajudam turmas e clubes a criar identidade, memória e participação.</Title><AgendaCalendar month={month} setMonth={setMonth} rituais={visible} />{mediator && <Button secondary onClick={beginNew}><Plus size={15} /> Novo ritual</Button>}{mediator && editing && <Card><h3>{draft.id ? "Editar ritual" : "Criar ritual"}</h3><form onSubmit={(event) => { event.preventDefault(); saveRitual(draft); setMonth(ritualDate(draft.data)); setEditing(false); }}><label className="co-field">Publicar para<select value={draft.escopo} onChange={(event) => setDraft({ ...draft, escopo: event.target.value })}><option value="turma">Uma turma</option><option value="clube">Um clube</option></select></label>{draft.escopo === "turma" ? <label className="co-field">Turma<select value={draft.turma || profile.turma} onChange={(event) => setDraft({ ...draft, turma: event.target.value })}>{TURMAS.map((turma) => <option key={turma}>{turma}</option>)}</select></label> : <label className="co-field">Clube<select value={draft.clubeId || clubes[0]?.id || ""} onChange={(event) => setDraft({ ...draft, clubeId: event.target.value })}>{clubes.map((item) => <option key={item.id} value={item.id}>{item.nome}</option>)}</select></label>}<Field label="Nome do ritual" value={draft.nome} onChange={(nome) => setDraft({ ...draft, nome })} required /><Field label="Recorrência" value={draft.recorrencia} onChange={(recorrencia) => setDraft({ ...draft, recorrencia })} required /><div className="co-group-settings"><label className="co-field">Data no calendário<input type="date" value={draft.data} onChange={(event) => setDraft({ ...draft, data: event.target.value })} required /></label><label className="co-field">Horário<input type="time" value={draft.hora} onChange={(event) => setDraft({ ...draft, hora: event.target.value })} required /></label></div><Field label="Local" value={draft.local} onChange={(local) => setDraft({ ...draft, local })} required /><Field label="O que vai acontecer" value={draft.descricao} onChange={(descricao) => setDraft({ ...draft, descricao })} multiline required /><Button type="submit" disabled={!draft.nome.trim() || !draft.recorrencia.trim() || !draft.data || !draft.hora || !draft.local.trim()}>Publicar na agenda dos alunos</Button></form></Card>}<h3 className="co-section-title">Próximos rituais</h3>{visible.map((ritual) => <RitualCard key={ritual.id} ritual={ritual} clubes={clubes} mediator={mediator} edit={() => { setDraft(ritual); setEditing(true); }} />)}{!visible.length && <Card>Nenhum ritual publicado para sua turma ou seus clubes.</Card>}<Card><h3>O que é um ritual?</h3><p className="co-muted">É um encontro recorrente criado pela comunidade. Diferente de uma missão, ele volta à agenda e pode receber novos temas, convidados e participantes.</p></Card></>;
}
function blankRitual(clubes, profile) { return { escopo: "turma", turma: profile.turma, clubeId: clubes[0]?.id || "", nome: "", recorrencia: "", descricao: "", data: new Date().toISOString().slice(0, 10), hora: "10:00", local: "" }; }
function ritualDate(value) { const parsed = new Date(`${value}T12:00:00`); return Number.isNaN(parsed.getTime()) ? new Date() : parsed; }
function formatRitualDate(ritual) { return `${ritualDate(ritual.data).toLocaleDateString("pt-BR", { day: "2-digit", month: "long" })} · ${ritual.hora}`; }
function RitualCard({ ritual, clubes, mediator, edit }) {
  const club = clubes.find((item) => item.id === ritual.clubeId);
  return <Card className={`co-ritual-card is-${ritual.escopo}`}><div className="co-row"><span className="co-card-icon"><Compass size={19} /></span><span className={`co-calendar-legend is-${ritual.escopo}`}>{ritual.escopo === "turma" ? `Turma · ${ritual.turma}` : `Clube · ${club?.nome}`}</span></div><h3>{ritual.nome}</h3><p>{ritual.descricao}</p><div className="co-ritual-details"><span><CalendarDays size={15} /><strong>{ritual.recorrencia}</strong></span><span><MapPin size={15} /><strong>{ritual.local}</strong></span></div><p className="co-note">Próximo encontro · {formatRitualDate(ritual)}</p>{mediator && <Button secondary onClick={edit}><Pencil size={15} /> Editar ritual</Button>}</Card>;
}
function AgendaCalendar({ month, setMonth, rituais }) {
  const year = month.getFullYear(); const monthIndex = month.getMonth();
  const days = new Date(year, monthIndex + 1, 0).getDate(); const offset = new Date(year, monthIndex, 1).getDay();
  const cells = Array.from({ length: 42 }, (_, index) => { const day = index - offset + 1; return day > 0 && day <= days ? day : null; });
  const eventsFor = (day) => rituais.filter((ritual) => { const date = ritualDate(ritual.data); return date.getFullYear() === year && date.getMonth() === monthIndex && date.getDate() === day; });
  return <Card className="co-calendar-card"><div className="co-calendar-head"><button aria-label="Mês anterior" onClick={() => setMonth(new Date(year, monthIndex - 1, 1))}><ChevronLeft size={17} /></button><strong>{month.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}</strong><button aria-label="Próximo mês" onClick={() => setMonth(new Date(year, monthIndex + 1, 1))}><ChevronRight size={17} /></button></div><div className="co-calendar-legend-row"><span className="co-calendar-legend is-turma">Turma</span><span className="co-calendar-legend is-clube">Clube</span></div><div className="co-calendar-weekdays">{["D", "S", "T", "Q", "Q", "S", "S"].map((label, index) => <span key={`${label}-${index}`}>{label}</span>)}</div><div className="co-calendar-grid">{cells.map((day, index) => { const events = day ? eventsFor(day) : []; const types = [...new Set(events.map((ritual) => ritual.escopo))]; return <div className={[!day ? "is-empty" : "", ...types.map((type) => `has-${type}`)].join(" ")} key={index}>{day && <><span>{day}</span>{events.map((ritual) => <i key={ritual.id} className={`is-${ritual.escopo}`} title={ritual.nome} />)}</>}</div>; })}</div></Card>;
}
function Timer({ deadline }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const timer = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(timer); }, []);
  const seconds = Math.max(0, Math.ceil((deadline - now) / 1000));
  return <span className="co-small">{seconds ? `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")} restantes` : "Prazo encerrado · peça mais tempo se precisar"}</span>;
}
function MissionCard({ mission, openMission }) { return <Card className={mission.status === "concluida" ? "co-completed" : ""}>{mission.escopo === "turma" ? <span className="co-muted co-small"><School size={13} /> Missão da turma · {mission.turma}</span> : <ClubLabel clubeId={mission.clubeId} />}<h3>{mission.titulo}</h3><p className="co-muted">{mission.descricao}</p>{mission.status === "concluida" ? <span className="co-tag co-success"><BadgeCheck size={13} /> Concluída</span> : <Timer deadline={mission.prazo} />}<Button secondary onClick={() => openMission(mission.id)}>{mission.status === "concluida" ? "Ver relatório final" : "Ver missão"}</Button></Card>; }
function Mission({ id, back }) {
  const { missoes, confirmFavo, completeMission, shareMission, requestSupport, pedidos } = useCommunity();
  const [text, setText] = useState("");
  const [photo, setPhoto] = useState(null);
  const [favoOpen, setFavoOpen] = useState(false);
  const [visitedPlace, setVisitedPlace] = useState("");
  const [error, setError] = useState("");
  const m = missoes.find((item) => item.id === id);
  if (!m) return <Back onClick={back} />;
  async function loadPhoto(e) {
    const file = e.target.files[0]; setError(""); setPhoto(null);
    if (!file) return;
    if (!/^image\/(jpeg|png|webp)$/.test(file.type) || file.size > 1000000) { setError("Escolha uma foto JPG, PNG ou WebP de até 1 MB."); e.target.value = ""; return; }
    const reader = new FileReader(); reader.onload = () => setPhoto(reader.result); reader.onerror = () => setError("Não foi possível ler a foto. Tente novamente."); reader.readAsDataURL(file);
  }
  return <><Back onClick={back} />{m.escopo === "turma" ? <span className="co-muted co-small"><School size={13} /> Missão da turma · {m.turma}</span> : <ClubLabel clubeId={m.clubeId} />}<Title eyebrow={m.status === "concluida" ? "Relatório final" : m.escopo === "turma" ? "Missão da turma" : "Missão do clube"} title={m.titulo}>{m.descricao}</Title><MissionSteps mission={m} favoOpen={favoOpen} />
    {m.status === "concluida" ? <><Card><span className="co-tag co-success"><BadgeCheck size={13} /> Resposta coletiva concluída</span><p>{m.resposta}</p>{m.foto && <img src={m.foto} alt="Evidência da resposta coletiva" className="co-evidence" />}<h3>Espaços ativados pelo grupo</h3><div className="co-space-route">{(m.locaisContribuicoes || []).map((item, index) => <div key={`${item.participante}-${index}`}><MapPin size={15} /><span><strong>{item.local}</strong><small>{item.participante} · {item.turma}</small></span></div>)}</div><h3>O que exercitamos</h3>{m.criterios.map((c) => <p key={c} className="co-criterion"><BadgeCheck size={15} /> {c}</p>)}<p className="co-muted co-small">Reconhecimento da experiência do grupo, sem nota individual.</p><Button disabled={m.compartilhada} onClick={() => shareMission(id)}>{m.compartilhada ? "Compartilhada no feed" : "Compartilhar resposta no feed"}</Button><p className="co-small co-muted">O registro aparecerá no clube e no feed da escola.</p></Card></> : <>
      <Card><Timer deadline={m.prazo} /><h3>O que vamos exercitar</h3><div className="co-space-tags">{m.criterios.map((c) => <span className="co-tag" key={c}>{c}</span>)}</div><p className="co-small co-muted">Uma pergunta coletiva, contribuições diferentes. O encontro presencial conecta as partes.</p></Card>
      <Card><div className="co-favo"><Hexagon size={70} strokeWidth={1.7} /></div><h3>Meu favo · um fragmento da resposta</h3>{!favoOpen ? <><p>Seu fragmento abre uma perspectiva para a conversa. Os favos dos colegas continuam com eles.</p><Button onClick={() => setFavoOpen(true)}>Abrir meu favo</Button></> : <><p className="co-eyebrow">Só você vê este fragmento</p><p>{m.favo}</p><div className="co-location-clue"><MapPin size={18} aria-hidden="true" /><div><strong>Pista do local</strong><p>{m.pistaLocal}</p></div></div><p className="co-note">Converse com colegas e interpretem juntos o caminho. O local faz parte da descoberta e não aparece no clube.</p></>}</Card>
      <Card><strong>{m.confirmados} de {m.total} favos reunidos</strong><progress value={m.confirmados} max={m.total} /><p className="co-small co-muted">Antes do check-in, conte para onde a pista do seu favo levou você. O grupo verá os lugares juntos apenas ao construir a resposta.</p>{!m.meuConfirmado && <Field label="Aonde seu favo levou você?" value={visitedPlace} onChange={setVisitedPlace} required />}<Button disabled={m.meuConfirmado || !favoOpen || !visitedPlace.trim()} onClick={() => confirmFavo(id, visitedPlace)}>{m.meuConfirmado ? `Contribuição confirmada · ${m.meuLocalVisitado}` : "Conversei e contribuí com meu favo"}</Button></Card>
      {m.registrador === "me" && <Card><h3>Conectem os lugares e as perspectivas</h3><p>Você confirmou o último favo. Agora o grupo enxerga o percurso completo antes de escrever a síntese.</p><div className="co-space-route">{(m.locaisContribuicoes || []).map((item, index) => <div key={`${item.participante}-${index}`}><MapPin size={15} /><span><strong>{item.local}</strong><small>{item.participante} · {item.turma}</small></span></div>)}</div><Field label="Resposta coletiva" value={text} onChange={setText} multiline /><label className="co-field">Foto da descoberta · opcional<input type="file" accept="image/jpeg,image/png,image/webp" onChange={loadPhoto} /></label>{photo && <><img className="co-evidence" src={photo} alt="Prévia da foto selecionada" /><Button secondary onClick={() => setPhoto(null)}>Remover foto</Button></>}{error && <p role="alert">{error}</p>}<Button disabled={!text.trim() && !photo} onClick={() => completeMission(id, text, photo)}>Concluir resposta coletiva</Button></Card>}
      <SupportRequest clubeId={m.clubeId} missaoId={id} />
      <Card><span className="co-card-icon"><TimerReset size={18} /></span><h3>Precisa de mais tempo?</h3><p className="co-small co-muted">Peça uma extensão quando o grupo precisar concluir a conversa com calma.</p><Button secondary disabled={pedidos.some((p) => p.missaoId === id && p.tipo === "Mais 5 minutos" && !p.atendido)} onClick={() => requestSupport(m.clubeId, "Mais 5 minutos", id)}>{pedidos.some((p) => p.missaoId === id && p.tipo === "Mais 5 minutos" && !p.atendido) ? "Mais 5 minutos · solicitado" : "Pedir mais 5 minutos"}</Button></Card>
      <Card className="co-wildcard"><span className="co-card-icon"><PhoneOff size={19} /></span><p className="co-eyebrow">Recurso de inclusão</p><h3>Favo coringa</h3><p><strong>Use somente se alguém do grupo estiver sem telefone.</strong></p><p className="co-small co-muted">O mediador libera um favo coringa e o grupo combina qual colega com aparelho registrará a contribuição da pessoa.</p><Button secondary disabled={pedidos.some((p) => p.missaoId === id && p.tipo === "Favo coringa" && !p.atendido)} onClick={() => requestSupport(m.clubeId, "Favo coringa", id)}>{pedidos.some((p) => p.missaoId === id && p.tipo === "Favo coringa" && !p.atendido) ? "Favo coringa · solicitado" : "Solicitar favo coringa"}</Button></Card>
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
    {avatar && <Card><h3>Minha Abelha · {profile.nome}</h3><p className="co-muted">Escolha seu personagem, toque para interagir e monte um visual com a sua cara.</p><AvatarStudio profile={profile} onChange={saveProfile} /></Card>}
    <Card><h3>Minha participação</h3><p>{clubes.filter((c) => c.membros.includes("me")).length} clubes · {completed.length} respostas coletivas</p>{clubes.filter((c) => c.embaixador === "me").map((c) => <p key={c.id} className="co-tag">Embaixador · {c.nome}</p>)}{completed.length > 0 && <><h3>Competências exercitadas</h3>{[...new Set(completed.flatMap((m) => m.criterios))].map((c) => <p key={c} className="co-criterion"><BadgeCheck size={15} /> {c}</p>)}</>}</Card>
  </>;
}
function Support() {
  const { pedidos } = useCommunity();
  return pedidos.length ? pedidos.map((p) => <SupportCard key={p.id} pedido={p} />) : <Card>Nenhum pedido agora. Os alunos conduzem os clubes e podem chamar você quando precisarem.</Card>;
}
function SupportCard({ pedido }) {
  const { resolveSupport, clubes, missoes } = useCommunity();
  const [context, setContext] = useState(false);
  const [answer, setAnswer] = useState("");
  const club = clubes.find((c) => c.id === pedido.clubeId);
  const mission = missoes.find((m) => m.id === pedido.missaoId);
  return <Card><span className="co-tag">{pedido.atendido ? "Apoio acolhido" : "Aguardando apoio"}</span><h3>{pedido.tipo}</h3><ClubLabel clubeId={pedido.clubeId} />
    {pedido.mensagem && <p className="co-request-quote">{pedido.mensagem}</p>}
    <button className="co-back" aria-expanded={context} onClick={() => setContext(!context)}>{context ? "Fechar contexto" : "Ver contexto do grupo"}</button>
    {context && <div className="co-context"><p>{club?.membros.length} participantes · {club?.turmas.join(" · ")}</p><p>Próximo encontro · {club?.encontro}</p>{mission && <><strong>{mission.titulo}</strong><p>{mission.confirmados} de {mission.total} fragmentos conectados</p><p>{mission.criterios.join(" · ")}</p></>}<p className="co-small co-muted">Contexto coletivo para apoiar a conversa. O local e os fragmentos individuais ficam nos favos dos alunos.</p></div>}
    {pedido.atendido ? <p role="status">{pedido.resposta || "Pedido acolhido."}</p> : <><Field label="Orientação para o grupo" value={answer} onChange={setAnswer} multiline /><Button disabled={pedido.tipo !== "Mais 5 minutos" && !answer.trim()} onClick={() => resolveSupport(pedido.id, answer)}>{pedido.tipo === "Mais 5 minutos" ? "Conceder mais 5 minutos" : "Enviar orientação"}</Button></>}
  </Card>;
}
function SupportRequest({ clubeId, missaoId }) {
  const { requestSupport, pedidos } = useCommunity();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const pending = pedidos.some((p) => p.clubeId === clubeId && p.missaoId === missaoId && p.tipo === "Preciso de pólen" && !p.atendido);
  return <Card><h3>Apoio quando vocês precisarem</h3><Button secondary disabled={pending} onClick={() => setOpen(!open)}>{pending ? "Pólen solicitado · aguardando apoio" : "Preciso de pólen"}</Button>{open && !pending && <form onSubmit={(e) => { e.preventDefault(); requestSupport(clubeId, "Preciso de pólen", missaoId, message); setOpen(false); setMessage(""); }}><Field label="Em que o grupo precisa de ajuda?" value={message} onChange={setMessage} multiline required /><p className="co-small co-muted">Conte o que travou na conversa para o mediador apoiar vocês.</p><Button type="submit" disabled={!message.trim()}>Pedir apoio ao mediador</Button></form>}</Card>;
}
function LayerTabs({ label, items, value, onChange }) {
  return <div className="co-tabs" role="group" aria-label={label}>{items.map(([id, title]) => <button key={id} aria-pressed={value === id} onClick={() => onChange(id)}>{title}</button>)}</div>;
}
function MissionSteps({ mission, favoOpen }) {
  const step = mission.status === "concluida" ? 3 : mission.meuConfirmado ? 2 : favoOpen ? 1 : 0;
  return <ol className="co-steps" aria-label="Etapas da missão">{["Meu favo", "Encontro", "Resposta", "Saberes"].map((label, i) => <li key={label} aria-current={i === step ? "step" : undefined} className={i < step ? "is-done" : ""}><span>{i < step ? <BadgeCheck size={14} /> : i + 1}</span>{label}</li>)}</ol>;
}

function Mediator({ tab }) {
  const { clubes, missoes, posts } = useCommunity();
  const section = { inicio: "apoio", missoes: "panorama", clubes: "clubes", agenda: "agenda", perfil: "perfil" }[tab];
  const [creating, setCreating] = useState(false);
  const activatedSpaces = [...new Set(missoes.flatMap((m) => (m.locaisContribuicoes || []).map((item) => item.local.trim())).filter(Boolean))];
  return <><Title eyebrow="Presença que apoia" title="Apoiar a Colmeia">Os alunos conduzem os clubes. Você ajuda com escuta, inclusão e os recursos da escola.</Title><div className="co-stats co-stats-three"><Card><strong>{clubes.length}</strong><br />clubes</Card><Card><strong>{missoes.filter((m) => m.status === "ativa").length}</strong><br />missões ativas</Card><Card><strong>{activatedSpaces.length}</strong><br />espaços ativados</Card></div>
    {section === "perfil" && <MediatorProfile />}
    {section === "agenda" && <Agenda mediator />}
    {section === "apoio" && <><h3>Pedidos de apoio</h3><Support /><h3 className="co-section-title">Feed da comunidade escolar</h3>{posts.slice(0, 3).map((p) => <Card key={p.id}><ClubLabel clubeId={p.clubeId} /><p><strong>{p.autor}</strong></p><p>{p.texto}</p></Card>)}</>}
    {section === "panorama" && <><Button secondary onClick={() => setCreating(!creating)}><WandSparkles size={16} /> Criar missão</Button>{creating && <MediatorMissionComposer done={() => setCreating(false)} />}<Card><h3>Ecossistema ativado</h3><p>{posts.length} postagens · {missoes.filter((m) => m.status === "concluida").length} respostas concluídas</p><div className="co-space-tags">{activatedSpaces.map((space) => <span className="co-space-tag" key={space}><MapPin size={12} /> {space}</span>)}</div><p className="co-small co-muted">Os lugares aparecem quando os estudantes registram aonde cada favo os levou. Sem ranking individual.</p></Card>{missoes.map((m) => <Card key={m.id}>{m.escopo === "turma" ? <span className="co-small co-muted"><School size={13} /> Turma · {m.turma}</span> : <ClubLabel clubeId={m.clubeId} />}<h3>{m.titulo}</h3>{m.origemIA && <span className="co-ai-label"><WandSparkles size={12} /> Favos sugeridos</span>}<p>{m.status === "ativa" ? "Em andamento" : "Resposta coletiva concluída"}</p>{m.planoTurma?.length > 0 && <p className="co-small">{m.presentes} presentes · {m.planoTurma.length} subgrupos de até {m.tamanhoGrupo}</p>}<p className="co-small"><Route size={13} /> {(m.locaisContribuicoes || []).length} trajetos registrados · {[...new Set((m.locaisContribuicoes || []).map((item) => item.local))].length} espaços ativados</p>{m.criterios.map((c) => <p key={c} className="co-small">{c}</p>)}{m.resposta && <p>{m.resposta}</p>}{m.foto && <img src={m.foto} alt="Evidência enviada pelo grupo" className="co-evidence" />}</Card>)}</>}
    {section === "clubes" && <><Card><h3>A escola é a comunidade</h3><p>Os clubes são a forma de organizar interesses, encontros e missões entre turmas.</p><p className="co-small co-muted">O mediador acompanha sem assumir a liderança dos grupos.</p></Card>{clubes.map((c) => <Card key={c.id}><span className="co-tag">{c.embaixador === "me" ? "Embaixadora: Bia" : "Embaixador estudantil"}</span><h3>{c.nome}</h3><p>{c.descricao}</p><p className="co-small">{c.membros.length} participantes · {c.turmas.join(" · ")}</p></Card>)}</>}
  </>;
}
const DEMO_STUDENTS = [
  { participante: "Bia", turma: "7º B", interesse: "acolhimento" },
  { participante: "Lia", turma: "6º A", interesse: "expressão" },
  { participante: "Noa", turma: "8º A", interesse: "escuta" },
  { participante: "Ravi", turma: "9º A", interesse: "organização" },
  { participante: "Maya", turma: "6º B", interesse: "natureza" },
  { participante: "Caio", turma: "8º B", interesse: "tecnologia" },
  { participante: "Sol", turma: "9º A", interesse: "arte" },
  { participante: "Ian", turma: "7º A", interesse: "movimento" },
];
const THEMES = {
  agua: { words: ["água", "agua", "desperdício", "desperdicio", "bebedouro"], aspects: ["mapear onde a água se perde", "entender os hábitos de uso", "ouvir quem cuida dos espaços", "criar um acordo de economia"], spaces: ["Bebedouro", "Banheiros", "Refeitório", "Horta"], prompts: ["O que mostra que há desperdício aqui?", "Que hábito simples faria diferença neste lugar?", "O que quem trabalha aqui já percebeu?", "Como a turma pode cuidar da água todos os dias?"] },
  acolhimento: { words: ["acolher", "acolhimento", "chegou", "pertencimento"], aspects: ["perceber barreiras de chegada", "ouvir experiências de acolhimento", "identificar redes de apoio", "criar um convite possível"], spaces: ["Portão", "Pátio coberto", "Biblioteca", "Corredor das salas"], prompts: ["O que pode deixar alguém de fora?", "Que gesto fez você se sentir parte?", "Quem pode ajudar alguém que acabou de chegar?", "Que convite acolhe sem pressionar?"] },
  cultura: { words: ["livro", "história", "historia", "música", "musica", "cultura", "banda"], aspects: ["reunir repertórios do grupo", "escutar memórias diferentes", "descobrir talentos da escola", "preparar uma experiência aberta"], spaces: ["Biblioteca", "Sala de leitura", "Pátio coberto", "Quadra"], prompts: ["Que referência você quer compartilhar?", "Que memória esta ideia desperta?", "Com quem você conversou e que talento descobriu?", "Como outras pessoas podem participar?"] },
  geral: { words: [], aspects: ["observar o desafio", "escutar quem vive a situação", "mapear recursos da escola", "propor um primeiro teste"], spaces: ["Pátio coberto", "Biblioteca", "Corredor das salas", "Quadra"], prompts: ["O que você percebeu que costuma passar despercebido?", "O que alguém que vive isso contou para você?", "Que pessoa, lugar ou recurso pode ajudar?", "Qual pequena ação o grupo pode testar primeiro?"] },
};
function themeFor(text) {
  const normalized = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  return Object.values(THEMES).find((theme) => theme.words.some((word) => normalized.includes(word.normalize("NFD").replace(/[\u0300-\u036f]/g, "")))) || THEMES.geral;
}
function createMissionPlan({ scope, title, objective, context, presentCount, groupSize }) {
  const theme = themeFor(`${title} ${objective} ${context}`);
  const size = scope === "turma" ? Number(groupSize) : 4;
  const count = scope === "turma" ? Math.max(1, Math.ceil(Number(presentCount) / size)) : 1;
  const groups = Array.from({ length: count }, (_, groupIndex) => {
    const objectiveText = theme.aspects[groupIndex % theme.aspects.length];
    const baseSize = scope === "turma" ? Math.floor(Number(presentCount) / count) : size;
    const remainder = scope === "turma" ? Number(presentCount) % count : 0;
    const currentSize = baseSize + (groupIndex < remainder ? 1 : 0);
    const startIndex = groupIndex * baseSize + Math.min(groupIndex, remainder);
    const favos = Array.from({ length: currentSize }, (_, index) => {
      const student = DEMO_STUDENTS[(startIndex + index) % DEMO_STUDENTS.length];
      const local = theme.spaces[(groupIndex + index) % theme.spaces.length];
      return { ...student, titulo: ["Observar", "Escutar", "Conectar", "Propor"][index % 4], local, pista: `Procure pistas em ${local.toLowerCase()}, sem revelar o destino aos outros grupos.`, pergunta: `${theme.prompts[index % theme.prompts.length]} Relacione sua resposta ao contexto: ${context}` };
    });
    return { id: groupIndex + 1, objetivo: `Grupo ${groupIndex + 1} · ${objectiveText}`, favos };
  });
  return { groups, context, size };
}

function MediatorMissionComposer({ done }) {
  const { clubes, createMission } = useCommunity();
  const [scope, setScope] = useState("turma");
  const [target, setTarget] = useState("7º B");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [objective, setObjective] = useState("");
  const [criteria, setCriteria] = useState([CRITERIOS[8], CRITERIOS[9]]);
  const [presentCount, setPresentCount] = useState(24);
  const [groupSize, setGroupSize] = useState(4);
  const [plan, setPlan] = useState(null);
  const fallbackClub = clubes.find((c) => c.membros.includes("me")) || clubes[0];
  function invalidatePlan(update) { update(); setPlan(null); }
  function toggleCriterion(item) { setCriteria((current) => current.includes(item) ? current.filter((value) => value !== item) : [...current, item]); setPlan(null); }
  const buildPlan = () => setPlan(createMissionPlan({ scope, title: title.trim(), objective: objective.trim(), context: description.trim(), presentCount, groupSize }));
  return <Card><span className="co-ai-label"><WandSparkles size={13} /> Assistente de missão</span><h3>Lançar uma missão</h3><p className="co-small co-muted">Descreva a experiência e o objetivo. A Colmeia sugere grupos, favos complementares e pistas; você revisa tudo antes de publicar.</p><form onSubmit={(e) => { e.preventDefault(); if (!plan) return; const clubeId = scope === "clube" ? target : fallbackClub?.id; const distribution = plan.groups[0].favos; createMission({ escopo: scope, turma: scope === "turma" ? target : undefined, clubeId, titulo: title.trim(), objetivo: objective.trim(), descricao: description.trim(), favo: distribution[0].pergunta, pistaLocal: distribution[0].pista, criterios: criteria, distribuicao: distribution, planoTurma: plan.groups, presentes: scope === "turma" ? Number(presentCount) : distribution.length, tamanhoGrupo: plan.size, origemIA: true }); done(); }}><label className="co-field">Enviar para<select value={scope} onChange={(e) => { const next = e.target.value; setScope(next); setTarget(next === "turma" ? "7º B" : clubes[0]?.id || ""); setPlan(null); }}><option value="turma">Uma turma</option><option value="clube">Um clube</option></select></label><label className="co-field">{scope === "turma" ? "Turma" : "Clube"}<select value={target} onChange={(e) => invalidatePlan(() => setTarget(e.target.value))}>{scope === "turma" ? TURMAS.map((t) => <option key={t}>{t}</option>) : clubes.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}</select></label>{scope === "turma" && <div className="co-group-settings"><label className="co-field">Alunos presentes<input type="number" min="2" max="40" value={presentCount} onChange={(e) => invalidatePlan(() => setPresentCount(Number(e.target.value)))} /></label><label className="co-field">Divisão dos grupos<select value={groupSize} onChange={(e) => invalidatePlan(() => setGroupSize(Number(e.target.value)))}><option value="2">Duplas</option><option value="3">Trios</option><option value="4">Quartetos</option></select></label></div>}<Field label="Missão que você quer propor" value={title} onChange={(value) => invalidatePlan(() => setTitle(value))} required /><Field label="Objetivo da missão" value={objective} onChange={(value) => invalidatePlan(() => setObjective(value))} multiline required /><Field label="Contexto da escola e da turma" value={description} onChange={(value) => invalidatePlan(() => setDescription(value))} multiline required /><fieldset className="co-criteria"><legend>Competências gerais da BNCC</legend>{CRITERIOS.map((item) => <label key={item}><input type="checkbox" checked={criteria.includes(item)} onChange={() => toggleCriterion(item)} /> <span>{item}</span></label>)}</fieldset><Button secondary disabled={!title.trim() || !objective.trim() || !description.trim() || !criteria.length || presentCount < 2} onClick={buildPlan}><WandSparkles size={16} /> {plan ? "Atualizar distribuição" : "Sugerir distribuição"}</Button>{plan && <div className="co-ai-plan" role="status"><div className="co-row"><div><span className="co-eyebrow">Plano para revisão</span><h3>{scope === "turma" ? `${plan.groups.length} subgrupos de até ${plan.size}` : "Grupo do clube"}</h3></div><BadgeCheck size={24} /></div><p className="co-small">Uma missão para todos. Cada subgrupo recebe um objetivo próprio, e cada favo compõe a resposta daquele subgrupo.</p>{plan.groups.map((group) => <div className="co-subgroup" key={group.id}><strong>{group.objetivo}</strong><small>{group.favos.map((item) => item.titulo).join(" · ")}</small><p>{group.favos[0].pergunta}</p><em><MapPin size={12} /> {group.favos.map((item) => item.local).join(" · ")}</em></div>)}</div>}<p className="co-note">O apoio de IA cruza o contexto digitado com perfis autorizados para sugerir a distribuição. O mediador revisa e publica; cada aluno vê apenas o próprio favo.</p><Button type="submit" disabled={!target || !plan}>Publicar missão</Button></form></Card>;
}

function MediatorProfile() {
  const { mediatorProfile, saveMediatorProfile } = useCommunity();
  const [draft, setDraft] = useState(mediatorProfile || { nome: "Alex", cargo: "Orientação escolar" });
  const [saved, setSaved] = useState(false);
  return <Card><h3>Perfil do mediador</h3><form onSubmit={(e) => { e.preventDefault(); saveMediatorProfile(draft); setSaved(true); }}><Field label="Nome" value={draft.nome} onChange={(nome) => setDraft({ ...draft, nome })} required /><Field label="Papel ou cargo na escola" value={draft.cargo} onChange={(cargo) => setDraft({ ...draft, cargo })} required /><Button type="submit" disabled={!draft.nome.trim() || !draft.cargo.trim()}>Salvar papel de apoio</Button>{saved && <p role="status">Perfil de apoio salvo.</p>}</form></Card>;
}
