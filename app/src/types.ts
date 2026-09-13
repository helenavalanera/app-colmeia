export type Role = "aluno" | "mediador";

export type Mood = "muito-bem" | "bem" | "mais-ou-menos" | "cansado" | "precisa-de-apoio";

export interface Profile {
  nome: string;
  cor: string;
  interesses: string[];
  humor: Mood | null;
  fotoUrl: string | null;
  disciplina?: string; // mediador
}

export interface Favo {
  id: string;
  nome: string;
  encontrado: boolean;
}

export interface Mission {
  id: string;
  titulo: string;
  disciplinas: string[];
  participantes: number;
  prazo: string;
  status: "em-andamento" | "concluida" | "sugerida";
  favos: Favo[];
  precisamColaborar: number;
}

export interface FeedPost {
  id: string;
  autor: string;
  autorFotoUrl: string | null;
  texto: string;
  fotoUrl: string | null;
  criadoEm: string;
}

export interface Clube {
  id: string;
  nome: string;
  participantes: number;
  publicacoes: number;
}
