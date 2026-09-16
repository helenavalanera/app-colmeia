import React, { createContext, useContext, useEffect, useState } from "react";

// Dados locais da demonstração. Turma é a origem do aluno; o clube organiza a participação.
const CommunityContext = createContext(null);
const STORAGE_KEY = "colmeia.communities.student-led.v5";
export const TURMAS = ["6º ano", "7º ano", "8º ano", "9º ano"];
export const TURNOS = ["Manhã", "Tarde", "Integral"];
export const INTERESSES = ["Música", "Artes", "Cinema", "Teatro", "Jogos", "Leitura", "Dança", "Esportes", "Tecnologia", "Robótica", "Natureza", "Fotografia", "Escrita", "Acolhimento"];
export const CRITERIOS = [
  "Autoconhecimento", "Autocuidado", "Empatia", "Cooperação", "Comunicação",
  "Escuta ativa", "Responsabilidade", "Autonomia", "Criatividade", "Resolução de conflitos",
];
export const profileLabel = (profile) => `${profile.ano || String(profile.turma || "7º ano").replace(/([6-9]º).*/, "$1 ano")} | ${profile.turno || "Manhã"}`;
const normalizeClassLabel = (value) => `${String(value || "7º ano").replace(/([6-9]º).*/, "$1 ano")} | Manhã`;
const BLOCKED_TERMS = ["ódio", "racista", "nazista", "matar", "ameaça", "ameaçar"];
function moderationMessage(text) {
  const normalized = String(text || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const blocked = BLOCKED_TERMS.find((term) => normalized.includes(term.normalize("NFD").replace(/[\u0300-\u036f]/g, "")));
  return blocked ? "A moderação assistida identificou linguagem que pode ferir alguém. Reescreva a publicação com respeito antes de enviar." : "";
}
const uid = () => globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`;
function initialState() {
  return {
    profile: { nome: "Bia", ano: "7º ano", turno: "Manhã", interesses: ["Leitura", "Acolhimento", "Artes"], equipped: {} },
    dark: false,
    mediatorProfile: { nome: "Alex", cargo: "Orientação escolar" },
    comunidades: [
      { id: "convivencia", nome: "Nossa escola acolhe", descricao: "Escuta, pertencimento e cuidado nos espaços que compartilhamos." },
      { id: "leitura", nome: "Histórias que conectam", descricao: "Histórias como ponto de partida para conhecer outras perspectivas." },
      { id: "cuidado", nome: "Cuidar do que é nosso", descricao: "Cooperação e responsabilidade pelo ecossistema da escola." },
    ],
    clubes: [
      { id: "chega", icon: "handshake", comunidadeId: "convivencia", nome: "Chega junto", descricao: "Criamos jeitos de acolher quem chega e de participar do recreio.", embaixador: "me", membros: ["me", "s2", "s3"], turmas: ["6º ano | Manhã", "7º ano | Manhã", "9º ano | Tarde"], encontro: "Quarta, no intervalo", convites: [] },
      { id: "desbravadores", icon: "compass", comunidadeId: "convivencia", nome: "Clube dos Desbravadores", descricao: "Conhecemos culturas, pessoas e histórias que já atravessam a nossa escola.", embaixador: "s8", membros: ["me", "s8", "s9", "s10"], turmas: ["6º ano | Manhã", "7º ano | Manhã", "8º ano | Tarde", "9º ano | Integral"], encontro: "Primeiro dia útil do mês", convites: [] },
      { id: "plot", icon: "book", comunidadeId: "leitura", nome: "Plot Twist & Páginas", descricao: "Trocamos histórias e escutamos o que elas despertam em cada pessoa.", embaixador: "s4", membros: ["s4", "s5"], turmas: ["8º ano | Tarde", "9º ano | Integral"], encontro: "Sexta, no intervalo", convites: [] },
      { id: "patio", icon: "leaf", comunidadeId: "cuidado", nome: "Pátio vivo", descricao: "Pensamos juntos em como cuidar dos lugares e de quem os frequenta.", embaixador: "s6", membros: ["s6", "s7"], turmas: ["6º ano | Manhã", "8º ano | Tarde"], encontro: "Terça, no intervalo", convites: [] },
    ],
    missoes: [
      { id: "acolher", escopo: "turma", turma: "7º ano", clubeId: "chega", titulo: "Como acolher quem acabou de chegar?", objetivo: "Transformar escuta e empatia em ações concretas de acolhimento.", descricao: "Conversem presencialmente, interpretem as pistas e construam uma proposta de acolhimento a partir das diferentes experiências do grupo.", favo: "Pense em uma situação em que você quis participar de algo, mas não sabia como chegar. Que convite teria ajudado?", pistaLocal: "Procure um espaço de passagem onde encontros inesperados costumam acontecer.", criterios: [CRITERIOS[7], CRITERIOS[8], CRITERIOS[9]], total: 3, confirmados: 2, meuConfirmado: false, status: "ativa", prazo: Date.now() + 30 * 60000, origemIA: true, locaisContribuicoes: [{ participante: "Lia", turma: "6º ano | Manhã", local: "Pátio coberto" }, { participante: "Ravi", turma: "9º ano | Tarde", local: "Biblioteca" }] },
      { id: "historias", escopo: "clube", clubeId: "plot", titulo: "Uma história, outros olhares", objetivo: "Criar acordos de escuta a partir de experiências diferentes.", descricao: "Compartilhem o que faz cada pessoa se sentir ouvida e componham um acordo de escuta para o clube.", favo: "Recorde uma história em que alguém foi ouvido de verdade. O que tornou essa escuta especial?", pistaLocal: "Siga até o lugar onde muitas histórias esperam para ser abertas.", criterios: [CRITERIOS[3], CRITERIOS[8]], total: 3, confirmados: 2, meuConfirmado: false, status: "ativa", prazo: Date.now() + 60 * 60000, origemIA: true, locaisContribuicoes: [{ participante: "Noa", turma: "8º ano | Tarde", local: "Biblioteca" }, { participante: "Iara", turma: "9º ano | Integral", local: "Sala de leitura" }] },
    ],
    posts: [
      { id: "p1", clubeId: "chega", audience: "turma", autor: "Lia · 6º ano | Manhã", texto: "Nosso clube quer criar um convite para quem passa o recreio sozinho. Que jeito de convidar faz você se sentir à vontade?", criadoEm: Date.now() - 3600000, comentarios: [{ autor: "Ravi · 9º ano | Tarde", texto: "Perguntar o que a pessoa gosta de fazer, sem pressionar." }] },
      { id: "p2", clubeId: "plot", audience: "clube", autor: "Clube Plot Twist & Páginas", texto: "Descobrimos que a mesma história desperta lembranças bem diferentes. Nosso combinado: ouvir até o fim antes de responder.", criadoEm: Date.now() - 7200000, comentarios: [] },
    ],
    rituais: [
      { id: "passaporte", escopo: "clube", clubeId: "desbravadores", nome: "Passaporte aberto", recorrencia: "Todo primeiro dia útil do mês", descricao: "Um convidado ou integrante da comunidade apresenta um país, sua cultura, costumes e comida. Assim, viajamos juntos sem sair da escola.", data: "2026-10-01", hora: "12:30", local: "Pátio coberto", publicado: true },
      { id: "circulo-7b", escopo: "turma", turma: "7º ano", nome: "Círculo de descobertas", recorrencia: "Toda primeira terça-feira do mês", descricao: "A turma compartilha uma descoberta da escola e escolhe uma pergunta para a próxima missão.", data: "2026-10-06", hora: "10:00", local: "Sala 7º B", publicado: true },
    ],
    pedidos: [], avisos: [], alertasMediador: [],
  };
}
// Enriquecimento aditivo: preserva perfis, respostas e clubes já salvos na demo.
function withClubContext(state) {
  const seed = initialState();
  const clubesSalvos = Array.isArray(state.clubes) ? state.clubes : [];
  const clubes = [...clubesSalvos, ...seed.clubes.filter((club) => !clubesSalvos.some((saved) => saved.id === club.id))];
  const oldInterests = Array.isArray(state.profile?.interesses) ? state.profile.interesses : String(state.profile?.interesses || "").split(",").map((item) => item.trim()).filter(Boolean);
  const profile = { ...state.profile, ano: state.profile?.ano || String(state.profile?.turma || "7º ano").replace(/([6-9]º).*/, "$1 ano"), turno: state.profile?.turno || "Manhã", interesses: oldInterests.length ? oldInterests : ["Leitura"] };
  delete profile.turma;
  return { ...state, profile, alertasMediador: Array.isArray(state.alertasMediador) ? state.alertasMediador : [], clubes: clubes.map((club) => {
    const cleanClub = { ...club };
    delete cleanClub.espacos;
    return { combinados: "Ouvir até o fim, respeitar o tempo de cada pessoa e decidir juntos.", icon: seed.clubes.find((item) => item.id === cleanClub.id)?.icon || "sparkles", ...cleanClub, turmas: (cleanClub.turmas || []).map((turma) => turma.includes("|") ? turma : normalizeClassLabel(turma)), encontro: cleanClub.encontro?.split(" · ")[0] || "Encontro a combinar" };
  }), missoes: state.missoes.map((mission) => ({ escopo: mission.id === "acolher" ? "turma" : "clube", turma: mission.id === "acolher" ? "7º ano" : undefined, pistaLocal: mission.id === "acolher" ? "Procure um espaço de passagem onde encontros inesperados costumam acontecer." : mission.id === "historias" ? "Siga até o lugar onde muitas histórias esperam para ser abertas." : "Interprete com o grupo a pista do lugar presente neste favo.", objetivo: mission.descricao || "Construir uma resposta coletiva a partir de perspectivas diferentes.", locaisContribuicoes: [], origemIA: false, ...mission, turma: mission.turma ? String(mission.turma).replace(/([6-9]º).*/, "$1 ano") : undefined })), rituais: [...(Array.isArray(state.rituais) ? state.rituais : []), ...seed.rituais.filter((ritual) => !(state.rituais || []).some((saved) => saved.id === ritual.id))].map((ritual) => ({ escopo: ritual.clubeId ? "clube" : "turma", data: ritual.id === "passaporte" ? "2026-10-01" : "2026-10-06", hora: ritual.id === "passaporte" ? "12:30" : "10:00", ...ritual, turma: ritual.turma ? String(ritual.turma).replace(/([6-9]º).*/, "$1 ano") : undefined })), posts: state.posts.map((post, index) => ({ audience: index === 0 ? "turma" : "clube", ...post })) };
}
function readState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved?.profile && ["comunidades", "clubes", "missoes", "posts", "pedidos", "avisos"].every((key) => Array.isArray(saved[key]))) return withClubContext(saved);
  } catch { /* Um armazenamento indisponível não impede a demonstração. */ }
  return withClubContext(initialState());
}

export function CommunityProvider({ children }) {
  const [state, setState] = useState(readState);
  const [storageError, setStorageError] = useState(false);
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); setStorageError(false); }
    catch { setStorageError(true); }
  }, [state]);
  function updateClub(id, changes) {
    setState((s) => ({ ...s, clubes: s.clubes.map((c) => c.id === id && c.embaixador === "me" ? { ...c, ...changes } : c) }));
  }
  function joinClub(id) {
    setState((s) => ({ ...s, clubes: s.clubes.map((c) => c.id !== id || c.membros.includes("me") ? c : { ...c, membros: [...c.membros, "me"], turmas: [...new Set([...c.turmas, profileLabel(s.profile)])] }) }));
  }
  function createPost(clubeId, texto, foto) {
    const moderation = moderationMessage(texto);
    if (moderation) return { ok: false, message: moderation };
    const allowed = state.clubes.some((c) => c.id === clubeId && c.membros.includes("me")) && (texto.trim() || foto);
    if (!allowed) return { ok: false, message: "Entre no clube e escreva uma descoberta ou adicione uma foto." };
    setState((s) => {
      const clube = s.clubes.find((c) => c.id === clubeId);
      const mission = s.missoes.find((item) => item.clubeId === clubeId && item.status === "ativa");
      const alertasMediador = foto ? [{ id: uid(), tipo: "foto", texto: `Nova foto de ${s.profile.nome} em ${clube?.nome}.`, detalhe: mission ? `Missão: ${mission.titulo}` : "Publicação do clube", criadoEm: Date.now() }, ...(s.alertasMediador || [])] : (s.alertasMediador || []);
      return { ...s, alertasMediador, posts: [{ id: uid(), clubeId, audience: "clube", autor: `${s.profile.nome} · ${profileLabel(s.profile)}`, texto: texto.trim(), foto, criadoEm: Date.now(), comentarios: [] }, ...s.posts] };
    });
    return { ok: true };
  }
  function toggleLike(id) {
    setState((s) => ({ ...s, posts: s.posts.map((p) => {
      if (p.id !== id) return p;
      const curtidas = p.curtidas || [];
      return { ...p, curtidas: curtidas.includes("me") ? curtidas.filter((who) => who !== "me") : [...curtidas, "me"] };
    }) }));
  }
  function comment(id, texto) {
    if (!texto.trim()) return;
    setState((s) => ({ ...s, posts: s.posts.map((p) => p.id === id ? { ...p, comentarios: [...p.comentarios, { autor: `${s.profile.nome} · ${profileLabel(s.profile)}`, texto: texto.trim() }] } : p) }));
  }
  function requestSupport(clubeId, tipo, missaoId, mensagem = "") {
    setState((s) => s.pedidos.some((p) => p.clubeId === clubeId && p.tipo === tipo && p.missaoId === missaoId && !p.atendido) ? s : ({ ...s, pedidos: [{ id: uid(), clubeId, missaoId, tipo, mensagem: mensagem.trim(), autor: s.profile.nome, atendido: false }, ...s.pedidos] }));
  }
  function resolveSupport(id, resposta = "") {
    setState((s) => {
      const pedido = s.pedidos.find((p) => p.id === id);
      if (!pedido || pedido.atendido) return s;
      const extra = pedido.tipo === "Mais 5 minutos";
      return { ...s, pedidos: s.pedidos.map((p) => p.id === id ? { ...p, atendido: true, resposta: resposta.trim() } : p),
        missoes: s.missoes.map((m) => extra && m.id === pedido.missaoId && m.status === "ativa" ? { ...m, prazo: Math.max(m.prazo, Date.now()) + 5 * 60000 } : m),
        avisos: [{ id: uid(), texto: extra ? "Mais 5 minutos! O tempo da missão foi atualizado." : `Apoio em ${s.clubes.find((c) => c.id === pedido.clubeId)?.nome}: ${resposta.trim() || "Seu pedido foi acolhido. Combine o próximo passo com o mediador."}` }, ...s.avisos] };
    });
  }
  function confirmFavo(id, localVisitado) {
    const local = String(localVisitado || "").trim();
    if (!local) return;
    setState((s) => ({ ...s, missoes: s.missoes.map((m) => m.id === id && m.status === "ativa" && !m.meuConfirmado && s.clubes.some((c) => c.id === m.clubeId && c.membros.includes("me")) ? { ...m, meuConfirmado: true, meuLocalVisitado: local, locaisContribuicoes: [...(m.locaisContribuicoes || []), { participante: s.profile.nome, turma: profileLabel(s.profile), local }], confirmados: Math.min(m.total, m.confirmados + 1), registrador: m.confirmados + 1 >= m.total ? "me" : null } : m) }));
  }
  function completeMission(id, texto, foto) {
    setState((s) => {
      const m = s.missoes.find((item) => item.id === id);
      if (!m || m.status !== "ativa" || m.registrador !== "me" || (!texto.trim() && !foto)) return s;
      return { ...s, missoes: s.missoes.map((item) => item.id === id ? { ...item, status: "concluida", resposta: texto.trim(), foto } : item), avisos: [{ id: uid(), texto: "Resposta coletiva registrada! Veja as competências exercitadas no relatório." }, ...s.avisos] };
    });
  }
  function shareMission(id) {
    setState((s) => {
      const m = s.missoes.find((item) => item.id === id);
      if (!m || m.status !== "concluida" || m.compartilhada) return s;
      const clube = s.clubes.find((c) => c.id === m.clubeId);
      const alertasMediador = m.foto ? [{ id: uid(), tipo: "foto", texto: `Nova evidência fotográfica em ${clube.nome}.`, detalhe: `Missão: ${m.titulo}`, criadoEm: Date.now() }, ...(s.alertasMediador || [])] : (s.alertasMediador || []);
      return { ...s, alertasMediador, missoes: s.missoes.map((item) => item.id === id ? { ...item, compartilhada: true } : item), posts: [{ id: uid(), clubeId: m.clubeId, audience: m.escopo === "turma" ? "turma" : "clube", autor: `Resposta coletiva · ${clube.nome}`, texto: m.resposta, foto: m.foto, criadoEm: Date.now(), comentarios: [] }, ...s.posts] };
    });
  }
  function createMission(data) {
    setState((s) => {
      const distribuicao = data.distribuicao || [];
      const total = Math.max(2, distribuicao.length || 0);
      const locaisContribuicoes = distribuicao.slice(1).map((favo) => ({ participante: favo.participante, turma: favo.turma, local: favo.local }));
      return { ...s, missoes: [...s.missoes, { escopo: "clube", ...data, id: uid(), status: "ativa", total, confirmados: total - 1, meuConfirmado: false, locaisContribuicoes, prazo: Date.now() + 30 * 60000 }] };
    });
  }
  function saveRitual(data) {
    if (!data.nome?.trim() || !data.data || (data.escopo === "clube" ? !data.clubeId : !data.turma)) return;
    setState((s) => {
      const ritual = { ...data, nome: data.nome.trim(), publicado: true, id: data.id || uid() };
      const exists = (s.rituais || []).some((item) => item.id === ritual.id);
      return { ...s, rituais: exists ? s.rituais.map((item) => item.id === ritual.id ? ritual : item) : [...(s.rituais || []), ritual], avisos: [{ id: uid(), texto: `${ritual.nome} entrou na sua agenda.` }, ...s.avisos] };
    });
  }
  function createCommunity(nome, descricao) {
    if (!nome.trim()) return;
    setState((s) => ({ ...s, comunidades: [...s.comunidades, { id: uid(), nome: nome.trim(), descricao }] }));
  }
  function createClub(comunidadeId, nome, descricao, icon = "sparkles") {
    if (!nome.trim()) return;
    setState((s) => ({ ...s, clubes: [...s.clubes, { id: uid(), comunidadeId, nome: nome.trim(), descricao, icon, embaixador: "me", membros: ["me"], turmas: [profileLabel(s.profile)], encontro: "Encontro a combinar", combinados: "Vamos construir nossos combinados juntos.", convites: [] }] }));
  }
  function resetDemo() {
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* O estado em memória ainda pode ser reiniciado. */ }
    setState(withClubContext(initialState()));
  }
  return <CommunityContext.Provider value={{ ...state, storageError, updateClub, joinClub, createPost, comment, toggleLike, requestSupport, resolveSupport, confirmFavo, completeMission, shareMission, createMission, saveRitual, createCommunity, createClub, resetDemo,
    saveMediatorProfile: (mediatorProfile) => setState((s) => ({ ...s, mediatorProfile })),
    saveProfile: (profile) => setState((s) => ({ ...s, profile })),
    toggleDark: () => setState((s) => ({ ...s, dark: !s.dark })),
  }}>{children}</CommunityContext.Provider>;
}
export function useCommunity() {
  const ctx = useContext(CommunityContext);
  if (!ctx) throw new Error("useCommunity precisa estar dentro de CommunityProvider");
  return ctx;
}
export function timeAgo(ts) {
  const minutes = Math.max(1, Math.round((Date.now() - ts) / 60000));
  return minutes < 60 ? `${minutes} min` : minutes < 1440 ? `${Math.floor(minutes / 60)} h` : `${Math.floor(minutes / 1440)} d`;
}
