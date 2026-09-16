import React, { createContext, useContext, useEffect, useState } from "react";

// Dados locais da demonstração. Turma é a origem do aluno; o clube organiza a participação.
const CommunityContext = createContext(null);
const STORAGE_KEY = "colmeia.communities.student-led.v4";
export const TURMAS = ["6º A", "6º B", "7º A", "7º B", "8º A", "8º B", "9º A"];
export const CRITERIOS = [
  "Conhecimento · CG1",
  "Pensamento científico, crítico e criativo · CG2",
  "Repertório cultural · CG3",
  "Comunicação · CG4",
  "Cultura digital · CG5",
  "Trabalho e projeto de vida · CG6",
  "Argumentação · CG7",
  "Autoconhecimento e autocuidado · CG8",
  "Empatia e cooperação · CG9",
  "Responsabilidade e cidadania · CG10",
];
const uid = () => globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`;
function initialState() {
  return {
    profile: { nome: "Bia", turma: "7º B", interesses: "Leitura, acolhimento e novas ideias", equipped: {} },
    dark: false,
    mediatorProfile: { nome: "Alex", cargo: "Orientação escolar" },
    comunidades: [
      { id: "convivencia", nome: "Nossa escola acolhe", descricao: "Escuta, pertencimento e cuidado nos espaços que compartilhamos." },
      { id: "leitura", nome: "Histórias que conectam", descricao: "Histórias como ponto de partida para conhecer outras perspectivas." },
      { id: "cuidado", nome: "Cuidar do que é nosso", descricao: "Cooperação e responsabilidade pelo ecossistema da escola." },
    ],
    clubes: [
      { id: "chega", comunidadeId: "convivencia", nome: "Chega junto", descricao: "Criamos jeitos de acolher quem chega e de participar do recreio.", embaixador: "me", membros: ["me", "s2", "s3"], turmas: ["6º A", "7º B", "9º A"], encontro: "Quarta, no intervalo", convites: [] },
      { id: "desbravadores", comunidadeId: "convivencia", nome: "Clube dos Desbravadores", descricao: "Conhecemos culturas, pessoas e histórias que já atravessam a nossa escola.", embaixador: "s8", membros: ["me", "s8", "s9", "s10"], turmas: ["6º B", "7º B", "8º A", "9º A"], encontro: "Primeiro dia útil do mês", convites: [] },
      { id: "plot", comunidadeId: "leitura", nome: "Plot Twist & Páginas", descricao: "Trocamos histórias e escutamos o que elas despertam em cada pessoa.", embaixador: "s4", membros: ["s4", "s5"], turmas: ["8º A", "9º A"], encontro: "Sexta, no intervalo", convites: [] },
      { id: "patio", comunidadeId: "cuidado", nome: "Pátio vivo", descricao: "Pensamos juntos em como cuidar dos lugares e de quem os frequenta.", embaixador: "s6", membros: ["s6", "s7"], turmas: ["6º B", "8º B"], encontro: "Terça, no intervalo", convites: [] },
    ],
    missoes: [
      { id: "acolher", escopo: "turma", turma: "7º B", clubeId: "chega", titulo: "Como acolher quem acabou de chegar?", objetivo: "Transformar escuta e empatia em ações concretas de acolhimento.", descricao: "Conversem presencialmente, interpretem as pistas e construam uma proposta de acolhimento a partir das diferentes experiências do grupo.", favo: "Pense em uma situação em que você quis participar de algo, mas não sabia como chegar. Que convite teria ajudado?", pistaLocal: "Procure um espaço de passagem onde encontros inesperados costumam acontecer.", criterios: [CRITERIOS[7], CRITERIOS[8], CRITERIOS[9]], total: 3, confirmados: 2, meuConfirmado: false, status: "ativa", prazo: Date.now() + 30 * 60000, origemIA: true, locaisContribuicoes: [{ participante: "Lia", turma: "6º A", local: "Pátio coberto" }, { participante: "Ravi", turma: "9º A", local: "Biblioteca" }] },
      { id: "historias", escopo: "clube", clubeId: "plot", titulo: "Uma história, outros olhares", objetivo: "Criar acordos de escuta a partir de experiências diferentes.", descricao: "Compartilhem o que faz cada pessoa se sentir ouvida e componham um acordo de escuta para o clube.", favo: "Recorde uma história em que alguém foi ouvido de verdade. O que tornou essa escuta especial?", pistaLocal: "Siga até o lugar onde muitas histórias esperam para ser abertas.", criterios: [CRITERIOS[3], CRITERIOS[8]], total: 3, confirmados: 2, meuConfirmado: false, status: "ativa", prazo: Date.now() + 60 * 60000, origemIA: true, locaisContribuicoes: [{ participante: "Noa", turma: "8º A", local: "Biblioteca" }, { participante: "Iara", turma: "9º A", local: "Sala de leitura" }] },
    ],
    posts: [
      { id: "p1", clubeId: "chega", audience: "turma", autor: "Lia · 6º A", texto: "Nosso clube quer criar um convite para quem passa o recreio sozinho. Que jeito de convidar faz você se sentir à vontade?", criadoEm: Date.now() - 3600000, comentarios: [{ autor: "Ravi · 9º A", texto: "Perguntar o que a pessoa gosta de fazer, sem pressionar." }] },
      { id: "p2", clubeId: "plot", audience: "clube", autor: "Clube Plot Twist & Páginas", texto: "Descobrimos que a mesma história desperta lembranças bem diferentes. Nosso combinado: ouvir até o fim antes de responder.", criadoEm: Date.now() - 7200000, comentarios: [] },
    ],
    rituais: [{ id: "passaporte", clubeId: "desbravadores", nome: "Passaporte aberto", recorrencia: "Todo primeiro dia útil do mês", descricao: "Um convidado ou integrante da comunidade apresenta um país, sua cultura, costumes e comida. Assim, viajamos juntos sem sair da escola.", proximo: "1º de outubro · 12h30", local: "Pátio coberto", publicado: true }],
    pedidos: [], avisos: [],
  };
}
// Enriquecimento aditivo: preserva perfis, respostas e clubes já salvos na demo.
function withClubContext(state) {
  const seed = initialState();
  const clubesSalvos = Array.isArray(state.clubes) ? state.clubes : [];
  const clubes = [...clubesSalvos, ...seed.clubes.filter((club) => !clubesSalvos.some((saved) => saved.id === club.id))];
  return { ...state, clubes: clubes.map((club) => {
    const cleanClub = { ...club };
    delete cleanClub.espacos;
    return { combinados: "Ouvir até o fim, respeitar o tempo de cada pessoa e decidir juntos.", ...cleanClub, encontro: cleanClub.encontro?.split(" · ")[0] || "Encontro a combinar" };
  }), missoes: state.missoes.map((mission) => ({ escopo: mission.id === "acolher" ? "turma" : "clube", turma: mission.id === "acolher" ? "7º B" : undefined, pistaLocal: mission.id === "acolher" ? "Procure um espaço de passagem onde encontros inesperados costumam acontecer." : mission.id === "historias" ? "Siga até o lugar onde muitas histórias esperam para ser abertas." : "Interprete com o grupo a pista do lugar presente neste favo.", objetivo: mission.descricao || "Construir uma resposta coletiva a partir de perspectivas diferentes.", locaisContribuicoes: [], origemIA: false, ...mission })), rituais: Array.isArray(state.rituais) && state.rituais.length ? state.rituais : seed.rituais, posts: state.posts.map((post, index) => ({ audience: index === 0 ? "turma" : "clube", ...post })) };
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
      return { ...s, posts: [{ id: uid(), clubeId, audience: "clube", autor: `${s.profile.nome} · ${s.profile.turma}`, texto: texto.trim(), foto, criadoEm: Date.now(), comentarios: [] }, ...s.posts] };
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
  function confirmFavo(id, localVisitado) {
    const local = String(localVisitado || "").trim();
    if (!local) return;
    setState((s) => ({ ...s, missoes: s.missoes.map((m) => m.id === id && m.status === "ativa" && !m.meuConfirmado && s.clubes.some((c) => c.id === m.clubeId && c.membros.includes("me")) ? { ...m, meuConfirmado: true, meuLocalVisitado: local, locaisContribuicoes: [...(m.locaisContribuicoes || []), { participante: s.profile.nome, turma: s.profile.turma, local }], confirmados: Math.min(m.total, m.confirmados + 1), registrador: m.confirmados + 1 >= m.total ? "me" : null } : m) }));
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
      return { ...s, missoes: s.missoes.map((item) => item.id === id ? { ...item, compartilhada: true } : item), posts: [{ id: uid(), clubeId: m.clubeId, audience: m.escopo === "turma" ? "turma" : "clube", autor: `Resposta coletiva · ${clube.nome}`, texto: m.resposta, foto: m.foto, criadoEm: Date.now(), comentarios: [] }, ...s.posts] };
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
    if (!data.nome?.trim() || !data.clubeId) return;
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
  function createClub(comunidadeId, nome, descricao) {
    if (!nome.trim()) return;
    setState((s) => ({ ...s, clubes: [...s.clubes, { id: uid(), comunidadeId, nome: nome.trim(), descricao, embaixador: "me", membros: ["me"], turmas: [s.profile.turma], encontro: "Encontro a combinar", combinados: "Vamos construir nossos combinados juntos.", convites: [] }] }));
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
