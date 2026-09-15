import React, { createContext, useContext, useEffect, useState } from "react";

// Dados locais da demonstração. Turma é a origem do aluno; o clube organiza a participação.
const CommunityContext = createContext(null);
const STORAGE_KEY = "colmeia.communities.student-led.v4";
export const TURMAS = ["6º A", "6º B", "7º A", "7º B", "8º A", "8º B", "9º A"];
export const CRITERIOS = ["Escuta e empatia · CG9", "Cooperação · CG9", "Autoconhecimento e cuidado · CG8", "Responsabilidade e autonomia · CG10"];
const uid = () => globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`;
function initialState() {
  return {
    profile: { nome: "Bia", turma: "7º B", interesses: "Leitura, acolhimento e novas ideias", equipped: {} },
    dark: false,
    mediatorProfile: { nome: "Alex", cargo: "Orientação escolar" },
    comunidades: [
      { id: "convivencia", nome: "Nossa escola acolhe", descricao: "Escuta, pertencimento e cuidado nos espaços que compartilhamos.", emoji: "☀️" },
      { id: "leitura", nome: "Histórias que conectam", descricao: "Histórias como ponto de partida para conhecer outras perspectivas.", emoji: "📚" },
      { id: "cuidado", nome: "Cuidar do que é nosso", descricao: "Cooperação e responsabilidade pelo ecossistema da escola.", emoji: "🌱" },
    ],
    clubes: [
      { id: "chega", comunidadeId: "convivencia", nome: "Chega junto", descricao: "Criamos jeitos de acolher quem chega e de participar do recreio.", embaixador: "me", membros: ["me", "s2", "s3"], turmas: ["6º A", "7º B", "9º A"], encontro: "Quarta, no intervalo · pátio", convites: [] },
      { id: "plot", comunidadeId: "leitura", nome: "Plot Twist & Páginas", descricao: "Trocamos histórias e escutamos o que elas despertam em cada pessoa.", embaixador: "s4", membros: ["s4", "s5"], turmas: ["8º A", "9º A"], encontro: "Sexta, no intervalo · biblioteca", convites: [] },
      { id: "patio", comunidadeId: "cuidado", nome: "Pátio vivo", descricao: "Pensamos juntos em como cuidar dos lugares e de quem os frequenta.", embaixador: "s6", membros: ["s6", "s7"], turmas: ["6º B", "8º B"], encontro: "Terça, no intervalo · jardim", convites: [] },
    ],
    missoes: [
      { id: "acolher", clubeId: "chega", titulo: "Como acolher quem acabou de chegar?", descricao: "Conversem presencialmente e construam uma proposta de acolhimento a partir das diferentes experiências do grupo.", favo: "Pense em uma situação em que você quis participar de algo, mas não sabia como chegar. Que convite teria ajudado? Leve essa perspectiva para a conversa.", criterios: CRITERIOS.slice(0, 2), total: 3, confirmados: 2, meuConfirmado: false, status: "ativa", prazo: Date.now() + 30 * 60000 },
      { id: "historias", clubeId: "plot", titulo: "Uma história, outros olhares", descricao: "Compartilhem o que faz cada pessoa se sentir ouvida e componham um acordo de escuta para o clube.", favo: "Recorde uma história em que alguém foi ouvido de verdade. O que tornou essa escuta especial?", criterios: [CRITERIOS[0]], total: 3, confirmados: 2, meuConfirmado: false, status: "ativa", prazo: Date.now() + 60 * 60000 },
    ],
    posts: [
      { id: "p1", clubeId: "chega", autor: "Lia · 6º A", texto: "Nosso clube quer criar um convite para quem passa o recreio sozinho. Que jeito de convidar faz você se sentir à vontade?", criadoEm: Date.now() - 3600000, comentarios: [{ autor: "Ravi · 9º A", texto: "Perguntar o que a pessoa gosta de fazer, sem pressionar." }] },
      { id: "p2", clubeId: "plot", autor: "Clube Plot Twist & Páginas", texto: "Descobrimos que a mesma história desperta lembranças bem diferentes. Nosso combinado: ouvir até o fim antes de responder.", criadoEm: Date.now() - 7200000, comentarios: [] },
    ],
    pedidos: [], avisos: [],
  };
}
// Enriquecimento aditivo: preserva perfis, respostas e clubes já salvos na demo.
function withClubContext(state) {
  const places = { chega: ["Pátio", "Biblioteca"], plot: ["Biblioteca"], patio: ["Jardim", "Pátio"] };
  return { ...state, clubes: state.clubes.map((club) => ({
    espacos: places[club.id] || [],
    combinados: "Ouvir até o fim, respeitar o tempo de cada pessoa e decidir juntos.",
    ...club,
  })) };
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
    setState((s) => ({ ...s, clubes: s.clubes.map((c) => c.id !== id || c.membros.includes("me") ? c : { ...c, membros: [...c.membros, "me"], turmas: [...new Set([...c.turmas, s.profile.turma])] }) }));
  }
  function createPost(clubeId, texto, foto) {
    setState((s) => {
      if (!s.clubes.some((c) => c.id === clubeId && c.membros.includes("me")) || (!texto.trim() && !foto)) return s;
      return { ...s, posts: [{ id: uid(), clubeId, autor: `${s.profile.nome} · ${s.profile.turma}`, texto: texto.trim(), foto, criadoEm: Date.now(), comentarios: [] }, ...s.posts] };
    });
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
    setState((s) => ({ ...s, posts: s.posts.map((p) => p.id === id ? { ...p, comentarios: [...p.comentarios, { autor: `${s.profile.nome} · ${s.profile.turma}`, texto: texto.trim() }] } : p) }));
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
  function confirmFavo(id) {
    setState((s) => ({ ...s, missoes: s.missoes.map((m) => m.id === id && m.status === "ativa" && !m.meuConfirmado && s.clubes.some((c) => c.id === m.clubeId && c.membros.includes("me")) ? { ...m, meuConfirmado: true, confirmados: Math.min(m.total, m.confirmados + 1), registrador: m.confirmados + 1 >= m.total ? "me" : null } : m) }));
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
      return { ...s, missoes: s.missoes.map((item) => item.id === id ? { ...item, compartilhada: true } : item), posts: [{ id: uid(), clubeId: m.clubeId, autor: `Resposta coletiva · ${clube.nome}`, texto: m.resposta, foto: m.foto, criadoEm: Date.now(), comentarios: [] }, ...s.posts] };
    });
  }
  function createMission(data) {
    setState((s) => ({ ...s, missoes: [...s.missoes, { ...data, id: uid(), status: "ativa", total: 3, confirmados: 2, meuConfirmado: false, prazo: Date.now() + 30 * 60000 }] }));
  }
  function createCommunity(nome, descricao) {
    if (!nome.trim()) return;
    setState((s) => ({ ...s, comunidades: [...s.comunidades, { id: uid(), nome: nome.trim(), descricao, emoji: "✦" }] }));
  }
  function createClub(comunidadeId, nome, descricao) {
    if (!nome.trim()) return;
    setState((s) => ({ ...s, clubes: [...s.clubes, { id: uid(), comunidadeId, nome: nome.trim(), descricao, embaixador: "me", membros: ["me"], turmas: [s.profile.turma], encontro: "Encontro a combinar", espacos: [], combinados: "Vamos construir nossos combinados juntos.", convites: [] }] }));
  }
  return <CommunityContext.Provider value={{ ...state, storageError, updateClub, joinClub, createPost, comment, toggleLike, requestSupport, resolveSupport, confirmFavo, completeMission, shareMission, createMission, createCommunity, createClub,
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
