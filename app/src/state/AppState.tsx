import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Profile, Role, FeedPost, Mission } from "../types";
import { missoesIniciais, feedInicial } from "../data/mockData";

const STORAGE_KEY = "colmeia-demo-state-v1";

interface StoredState {
  role: Role | null;
  alunoProfile: Profile;
  mediadorProfile: Profile;
  posts: FeedPost[];
  missoes: Mission[];
}

const perfilVazio: Profile = {
  nome: "",
  cor: "#F86A10",
  interesses: [],
  humor: null,
  fotoUrl: null,
};

function loadInitial(): StoredState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as StoredState;
  } catch {
    // localStorage indisponível ou dado corrompido — segue com o padrão
  }
  return {
    role: null,
    alunoProfile: { ...perfilVazio },
    mediadorProfile: { ...perfilVazio, disciplina: "" },
    posts: feedInicial,
    missoes: missoesIniciais,
  };
}

interface AppStateContextValue extends StoredState {
  setRole: (role: Role) => void;
  updateAlunoProfile: (p: Partial<Profile>) => void;
  updateMediadorProfile: (p: Partial<Profile>) => void;
  addPost: (post: Omit<FeedPost, "id" | "criadoEm">) => void;
  toggleFavo: (missaoId: string, favoId: string) => void;
  resetDemo: () => void;
}

const AppStateContext = createContext<AppStateContextValue | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoredState>(loadInitial);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // silencioso — é uma demo, perda de persistência não deve travar o app
    }
  }, [state]);

  const value: AppStateContextValue = {
    ...state,
    setRole: (role) => setState((s) => ({ ...s, role })),
    updateAlunoProfile: (p) =>
      setState((s) => ({ ...s, alunoProfile: { ...s.alunoProfile, ...p } })),
    updateMediadorProfile: (p) =>
      setState((s) => ({ ...s, mediadorProfile: { ...s.mediadorProfile, ...p } })),
    addPost: (post) =>
      setState((s) => ({
        ...s,
        posts: [
          { ...post, id: `post-${Date.now()}`, criadoEm: new Date().toISOString() },
          ...s.posts,
        ],
      })),
    toggleFavo: (missaoId, favoId) =>
      setState((s) => ({
        ...s,
        missoes: s.missoes.map((m) =>
          m.id !== missaoId
            ? m
            : {
                ...m,
                favos: m.favos.map((f) =>
                  f.id === favoId ? { ...f, encontrado: !f.encontrado } : f
                ),
              }
        ),
      })),
    resetDemo: () => {
      localStorage.removeItem(STORAGE_KEY);
      setState(loadInitial());
    },
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState precisa estar dentro de <AppStateProvider>");
  return ctx;
}
