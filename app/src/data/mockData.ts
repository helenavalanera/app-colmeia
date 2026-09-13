import type { Mission, Clube, FeedPost } from "../types";

// Conteúdo fictício, portado do protótipo Colmeia (Claude Design) — ver README.
export const missoesIniciais: Mission[] = [
  {
    id: "agua-que-a-escola-usa",
    titulo: "Água que a escola usa",
    disciplinas: ["Ciências", "Matemática", "Geografia"],
    participantes: 6,
    prazo: "24 SET",
    status: "em-andamento",
    precisamColaborar: 4,
    favos: [
      { id: "torneiras", nome: "Torneiras", encontrado: true },
      { id: "banheiros", nome: "Banheiros", encontrado: true },
      { id: "horta", nome: "Horta", encontrado: true },
      { id: "dados", nome: "Dados", encontrado: true },
      { id: "cozinha", nome: "Cozinha", encontrado: false },
      { id: "bebedouro", nome: "Bebedouro", encontrado: false },
    ],
  },
  {
    id: "livro-novo-biblioteca",
    titulo: "O livro novo da biblioteca",
    disciplinas: ["Língua Portuguesa"],
    participantes: 4,
    prazo: "10 OUT",
    status: "concluida",
    precisamColaborar: 0,
    favos: [],
  },
  {
    id: "horta-na-escola",
    titulo: "Horta na Escola",
    disciplinas: ["Ciências"],
    participantes: 5,
    prazo: "—",
    status: "em-andamento",
    precisamColaborar: 2,
    favos: [],
  },
];

export const missoesSugeridas: Mission[] = [
  {
    id: "onde-esta-minha-agua",
    titulo: "Onde está minha água?",
    disciplinas: ["Ciências", "Geografia", "Matemática"],
    participantes: 0,
    prazo: "—",
    status: "sugerida",
    precisamColaborar: 0,
    favos: [],
  },
  {
    id: "detetives-da-desinformacao",
    titulo: "Detetives da desinformação",
    disciplinas: ["Língua Portuguesa", "Cultura Digital"],
    participantes: 0,
    prazo: "—",
    status: "sugerida",
    precisamColaborar: 0,
    favos: [],
  },
];

export const clubes: Clube[] = [
  { id: "ciencias", nome: "Clube de Ciências", participantes: 24, publicacoes: 12 },
  { id: "arte", nome: "Clube de Arte", participantes: 18, publicacoes: 8 },
  { id: "meio-ambiente", nome: "Clube de Meio Ambiente", participantes: 31, publicacoes: 16 },
];

export const feedInicial: FeedPost[] = [
  {
    id: "seed-sofia",
    autor: "Sofia",
    autorFotoUrl: null,
    texto:
      "Na missão Água que a escola usa, descobri que o bebedouro do 2º andar é o que mais é usado no intervalo!",
    fotoUrl: null,
    criadoEm: "2026-09-11T14:00:00-03:00",
  },
];

export const relatorioTurma = {
  turma: "8º ano B",
  naTrilha: 82,
  missoesConcluidas: "6/8",
  colaboracao: 74,
  pedidosDeApoio: 12,
  desenvolvimento: [
    { competencia: "Empatia e cooperação", valor: 80 },
    { competencia: "Comunicação", valor: 70 },
    { competencia: "Pensamento crítico", valor: 60 },
    { competencia: "Responsabilidade", valor: 78 },
  ],
};

export const INTERESSES = [
  "Arte", "Ciência", "Tecnologia", "Esportes", "Música", "Natureza", "Games", "Leitura", "Cultura",
];

export const CORES_PERFIL = ["#F86A10", "#5FAE5A", "#5BA5E4", "#FBB354", "#7A6FF0", "#E85A05"];
