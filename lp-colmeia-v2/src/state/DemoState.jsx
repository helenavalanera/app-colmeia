import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

/**
 * Estado compartilhado da demo (PDF "Mapa de experiência", pág. 07):
 * os dois celulares (aluno e mediador) leem e escrevem no mesmo estado local,
 * simulando a troca de mensagens entre as duas jornadas.
 *
 * Fluxos cobertos aqui:
 *  01 / Pedido de mais tempo   — aluno pede, mediador concede, contador do aluno atualiza.
 *  02 / Pólen (ajuda)          — aluno pede orientação, mediador responde.
 *  03 / Participação sem celular (favo coringa) — aluno sinaliza, mediador confirma apoio.
 *
 * Regra do PDF: "pedido pendente não altera o tempo" e "clique repetido não duplica
 * concessão" — por isso toda ação de resolver um pedido primeiro confere o status atual.
 */

const DemoContext = createContext(null);

// Fonte única dos objetivos BNCC disponíveis para vincular a uma missão (M04),
// e do rótulo de competência que aparece no relatório do mediador (M08) e na
// conclusão do aluno (A08) — as duas telas leem daqui, então nunca divergem.
export const BNCC_OPTIONS = [
  "4 · Comunicação",
  "7 · Argumentação",
  "9 · Empatia e cooperação",
  "10 · Responsabilidade e cidadania",
];

export const BNCC_SKILL_MAP = {
  "4 · Comunicação": "Comunicação",
  "7 · Argumentação": "Argumentação",
  "9 · Empatia e cooperação": "Empatia e cooperação",
  "10 · Responsabilidade e cidadania": "Responsabilidade e cidadania",
};

export function bnccToSkills(bncc) {
  if (!bncc || bncc.length === 0) return [];
  return bncc.map((b) => BNCC_SKILL_MAP[b] || b);
}

const INITIAL_MISSION = {
  id: "water",
  title: "Por onde a água passa?",
  context: "Turma 7º B",
  timeRemainingSec: 12 * 60,
  // Vinculado pelo mediador na criação da missão (M04) — o aluno lê este
  // mesmo campo na tela de conclusão (A08), nunca uma lista estática.
  bncc: ["9 · Empatia e cooperação", "10 · Responsabilidade e cidadania"],
};

let nextRequestId = 1;

export function DemoProvider({ children }) {
  const [mission, setMission] = useState(INITIAL_MISSION);
  const [requests, setRequests] = useState([]);
  const [studentAlerts, setStudentAlerts] = useState([]);

  const addRequest = useCallback((type, extra = {}) => {
    const id = `req-${nextRequestId++}`;
    setRequests((prev) => [
      ...prev,
      {
        id,
        type, // "tempo" | "polen" | "coringa"
        status: "pending",
        createdAt: Date.now(),
        groupContext: mission.context,
        missionTitle: mission.title,
        ...extra,
      },
    ]);
    return id;
  }, [mission.context, mission.title]);

  const requestTime = useCallback(() => addRequest("tempo"), [addRequest]);
  const requestPollen = useCallback((note) => addRequest("polen", { note }), [addRequest]);
  const requestCoringa = useCallback((note) => addRequest("coringa", { note }), [addRequest]);

  const grantTime = useCallback((requestId, minutes = 5) => {
    setRequests((prev) => {
      const target = prev.find((r) => r.id === requestId);
      if (!target || target.status !== "pending") return prev; // já resolvido: não duplica
      setMission((m) => ({ ...m, timeRemainingSec: m.timeRemainingSec + minutes * 60 }));
      setStudentAlerts((a) => [...a, { id: requestId, kind: "tempo", minutes, at: Date.now() }]);
      return prev.map((r) => (r.id === requestId ? { ...r, status: "resolved", minutesGranted: minutes } : r));
    });
  }, []);

  const respondPollen = useCallback((requestId, message) => {
    setRequests((prev) => {
      const target = prev.find((r) => r.id === requestId);
      if (!target || target.status !== "pending") return prev;
      setStudentAlerts((a) => [...a, { id: requestId, kind: "polen", message, at: Date.now() }]);
      return prev.map((r) => (r.id === requestId ? { ...r, status: "resolved", response: message } : r));
    });
  }, []);

  const confirmCoringa = useCallback((requestId, partner) => {
    setRequests((prev) => {
      const target = prev.find((r) => r.id === requestId);
      if (!target || target.status !== "pending") return prev;
      setStudentAlerts((a) => [...a, { id: requestId, kind: "coringa", partner, at: Date.now() }]);
      return prev.map((r) => (r.id === requestId ? { ...r, status: "resolved", partner } : r));
    });
  }, []);

  const dismissAlert = useCallback((alertId) => {
    setStudentAlerts((a) => a.filter((al) => al.id !== alertId));
  }, []);

  const setMissionBncc = useCallback((bncc) => {
    setMission((m) => ({ ...m, bncc }));
  }, []);

  const pendingRequests = useMemo(() => requests.filter((r) => r.status === "pending"), [requests]);

  const value = useMemo(() => ({
    mission,
    requests,
    pendingRequests,
    studentAlerts,
    requestTime,
    requestPollen,
    requestCoringa,
    grantTime,
    respondPollen,
    confirmCoringa,
    dismissAlert,
    setMissionBncc,
  }), [mission, requests, pendingRequests, studentAlerts, requestTime, requestPollen, requestCoringa, grantTime, respondPollen, confirmCoringa, dismissAlert, setMissionBncc]);

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemoState() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemoState precisa estar dentro de <DemoProvider>");
  return ctx;
}

export function formatMinutes(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}
