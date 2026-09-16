import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

/*
 * NetworkStory — Scrollytelling refinado:
 * 1. Quatro salas (6º, 7º, 8º, 9º ano), cada uma com 1 professor e 20 alunos
 *    dispostos em fileiras simétricas — como carteiras reais de sala de aula.
 * 2. Dentro de cada turma, as fileiras se reorganizam em quatro pequenos
 *    grupos, cada um cercado pelo contorno de um favo.
 * 3. Depois surgem ícones de interesse e linhas pontilhadas conectando quem
 *    compartilha afinidades em turmas diferentes.
 * 4. Na fase final, os alunos deixam esses primeiros grupos e se reagrupam em
 *    clubes de afinidade — favos de tamanhos diferentes, sempre
 *    misturando estudantes de turmas distintas.
 */

const COLORS = {
  orange: "#F86700", // --cm-orange
  yellow: "#FFAC00", // --cm-yellow
  orangeSoft: "#f59e00",
  greenDeep: "#994000",
  limeDeep: "#f4d28d",
  ink: "#18181B",
  muted: "#62626b",
  cardBg: "rgba(255, 255, 255, 0.85)",
  cardBorder: "rgba(248, 103, 0, 0.25)",
};

// Posições base dos 4 quadrados das turmas (fração do canvas)
const ROOMS = [
  { id: "6o", label: "6º Ano", x: 0.22, y: 0.28, color: COLORS.orange },
  { id: "7o", label: "7º Ano", x: 0.78, y: 0.28, color: COLORS.yellow },
  { id: "8o", label: "8º Ano", x: 0.22, y: 0.72, color: COLORS.orangeSoft },
  { id: "9o", label: "9º Ano", x: 0.78, y: 0.72, color: COLORS.greenDeep },
];

const INTERESTS = ["leitura", "tecnologia", "musica", "cuidado"];
const INTEREST_LABELS = ["Leitura", "Tecnologia", "Música", "Cuidado"];

// Quatro clubes finais em uma grade equilibrada, sem sobreposição entre favos.
const COMMUNITIES = [
  { cx: 0.28, cy: 0.34 },
  { cx: 0.72, cy: 0.34 },
  { cx: 0.28, cy: 0.7 },
  { cx: 0.72, cy: 0.7 },
];

const STEPS = [
  "1. O ecossistema escolar: turmas de 6º ao 9º ano reunidas.",
  "2. Dentro de cada turma, pequenos grupos formam os primeiros favos.",
  "3. Os encontros revelam interesses e afinidades em comum.",
  "4. As conexões começam a atravessar as salas de aula.",
  "5. Clubes maiores reúnem estudantes de diferentes turmas.",
  "6. A resposta coletiva: a escola inteira em rede.",
];

// Layout simétrico de carteiras dentro da sala (fração da caixa da sala)
const SEAT_COLS = [0.14, 0.38, 0.62, 0.86];
const SEAT_ROWS = [0.48, 0.595, 0.71, 0.825, 0.94];
const TEACHER_SEAT = { x: 0.5, y: 0.34 };
const ROOM_GROUPS = [
  { x: 0.24, y: 0.57 },
  { x: 0.76, y: 0.57 },
  { x: 0.24, y: 0.84 },
  { x: 0.76, y: 0.84 },
];
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5)); // ~137.5°, espalhamento tipo phyllotaxis

function mulberry32(seed) {
  let s = seed >>> 0;
  return function () {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smooth = (v) => {
  const t = clamp01(v);
  return t * t * (3 - 2 * t);
};

// Gera alunos com assento fixo (simétrico) e destino final na comunidade de afinidade.
// commAngle/commRadiusFactor são adimensionais (calculados uma vez); o raio em
// pixels só é resolvido em drawScene, com base em min(W,H) — isso evita que o
// agrupamento final saia elíptico em telas não quadradas.
function buildSimulationData() {
  const rnd = mulberry32(42);
  const raw = [];

  ROOMS.forEach((room, rIdx) => {
    raw.push({
      id: `prof-${room.id}`,
      roomIdx: rIdx,
      isTeacher: true,
      seatFracX: TEACHER_SEAT.x,
      seatFracY: TEACHER_SEAT.y,
      interest: Math.floor(rnd() * INTERESTS.length),
    });

    for (let i = 0; i < 20; i++) {
      const row = Math.floor(i / 4);
      const col = i % 4;
      raw.push({
        id: `student-${room.id}-${i}`,
        roomIdx: rIdx,
        isTeacher: false,
        seatFracX: SEAT_COLS[col],
        seatFracY: SEAT_ROWS[row],
        interest: Math.floor(rnd() * INTERESTS.length),
        roomGroup: Math.floor(i / 5),
        groupAngle: (i % 5) * GOLDEN_ANGLE,
        groupRadiusFactor: 0.55 + 0.45 * Math.sqrt(((i % 5) + 1) / 5),
      });
    }
  });

  // Agrupa por interesse (comunidade final); tamanhos naturalmente diferentes
  const byInterest = INTERESTS.map(() => []);
  raw.filter((s) => !s.isTeacher).forEach((s) => byInterest[s.interest].push(s));
  const communitySizes = byInterest.map((members) => members.length);

  byInterest.forEach((members, communityIdx) => {
    members.forEach((s, idx) => {
      s.communityIdx = communityIdx;
      s.commAngle = idx * GOLDEN_ANGLE;
      s.commRadiusFactor = 0.34 + 0.66 * Math.sqrt((idx + 0.5) / members.length);
    });
  });

  return { students: raw, communitySizes };
}

function hexPath(ctx, cx, cy, r) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 180) * (60 * i - 30);
    const x = cx + r * Math.cos(a);
    const y = cy + r * Math.sin(a);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

function drawInterestIcon(ctx, type, x, y, size, color = COLORS.ink) {
  const s = size;
  ctx.save();
  ctx.translate(x, y);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = Math.max(1.4, s * 0.12);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  if (type === 0) {
    ctx.moveTo(-s * .48, -s * .34); ctx.quadraticCurveTo(-s * .18, -s * .42, 0, -s * .2); ctx.lineTo(0, s * .42); ctx.quadraticCurveTo(-s * .2, s * .2, -s * .48, s * .28); ctx.closePath();
    ctx.moveTo(s * .48, -s * .34); ctx.quadraticCurveTo(s * .18, -s * .42, 0, -s * .2); ctx.lineTo(0, s * .42); ctx.quadraticCurveTo(s * .2, s * .2, s * .48, s * .28); ctx.closePath();
  } else if (type === 1) {
    ctx.rect(-s * .32, -s * .32, s * .64, s * .64);
    [-.52, .52].forEach((v) => { ctx.moveTo(v * s, -.18 * s); ctx.lineTo(Math.sign(v) * .32 * s, -.18 * s); ctx.moveTo(v * s, .18 * s); ctx.lineTo(Math.sign(v) * .32 * s, .18 * s); });
    ctx.moveTo(-.18 * s, -.52 * s); ctx.lineTo(-.18 * s, -.32 * s); ctx.moveTo(.18 * s, -.52 * s); ctx.lineTo(.18 * s, -.32 * s); ctx.moveTo(-.18 * s, .52 * s); ctx.lineTo(-.18 * s, .32 * s); ctx.moveTo(.18 * s, .52 * s); ctx.lineTo(.18 * s, .32 * s);
  } else if (type === 2) {
    ctx.moveTo(s * .18, -s * .5); ctx.lineTo(s * .18, s * .22); ctx.moveTo(s * .18, -s * .5); ctx.lineTo(s * .48, -s * .35); ctx.stroke();
    ctx.beginPath(); ctx.arc(-s * .02, s * .31, s * .2, 0, Math.PI * 2);
  } else {
    ctx.moveTo(-s * .4, s * .35); ctx.quadraticCurveTo(-s * .48, -s * .35, s * .38, -s * .45); ctx.quadraticCurveTo(s * .48, s * .34, -s * .4, s * .35); ctx.moveTo(-s * .34, s * .3); ctx.lineTo(s * .25, -s * .28);
  }
  ctx.stroke();
  ctx.restore();
}

export default function NetworkStory() {
  const scrollRef = useRef(null);
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const dimsRef = useRef({ w: 0, h: 0 });
  const progressRef = useRef(0);
  const prefersReduced = useReducedMotion();

  const { students, communitySizes } = useMemo(() => buildSimulationData(), []);
  const [activeStep, setActiveStep] = useState(prefersReduced ? STEPS.length - 1 : 0);

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"],
  });
  const firstOpacity = useTransform(scrollYProgress, [0.18, 0.28], [1, 0]);
  const groupOpacity = useTransform(scrollYProgress, [0.2, 0.3, 0.48, 0.58], [0, 1, 1, 0]);
  const secondOpacity = useTransform(scrollYProgress, [0.54, 0.64], [0, 1]);

  const drawScene = useCallback(
    (progress) => {
      const ctx = ctxRef.current;
      const { w: W, h: H } = dimsRef.current;
      if (!ctx || !W || !H) return;

      ctx.clearRect(0, 0, W, H);
      ctx.save();

      const pRooms = clamp01(progress / 0.12); // Fase 1: salas + carteiras
      const pRoomGroups = clamp01((progress - 0.12) / 0.17); // Fase 2: primeiros favos dentro das turmas
      const pIcons = clamp01((progress - 0.27) / 0.15); // Fase 3: interesses
      const pLines = clamp01((progress - 0.4) / 0.17); // Fase 4: linhas cruzadas
      const pFavo = clamp01((progress - 0.56) / 0.25); // Fases 5 e 6: clubes e rede final
      const tRoomGroups = smooth(pRoomGroups);
      const tFavo = smooth(pFavo);
      const minDim = Math.min(W, H);

      const boxWidth = Math.min(W * 0.39, 310);
      const boxHeight = Math.min(H * 0.3, 205);

      // 1) Caixas das salas (desaparecem conforme o favo se forma)
      if (pRooms > 0 && pFavo < 0.72) {
        ROOMS.forEach((room) => {
          const rx = room.x * W - boxWidth / 2;
          const ry = room.y * H - boxHeight / 2;

          ctx.save();
          ctx.globalAlpha = Math.max(0, 1 - pFavo * 1.4) * pRooms;
          ctx.fillStyle = COLORS.cardBg;
          ctx.strokeStyle = COLORS.cardBorder;
          ctx.lineWidth = 2;
          ctx.beginPath();
          if (ctx.roundRect) ctx.roundRect(rx, ry, boxWidth, boxHeight, 16);
          else ctx.rect(rx, ry, boxWidth, boxHeight); // fallback p/ navegadores sem roundRect
          ctx.fill();
          ctx.stroke();

          ctx.font = "700 15px Inter, sans-serif";
          ctx.fillStyle = COLORS.ink;
          ctx.textAlign = "left";
          ctx.fillText(room.label, rx + 16, ry + 26);

          ctx.font = "12px Inter, sans-serif";
          ctx.fillStyle = COLORS.muted;
          ctx.restore();
        });
      }

      // 2) Primeiros favos: pequenos grupos ainda dentro de cada turma.
      if (pRoomGroups > 0 && pFavo < 0.72) {
        ROOMS.forEach((room) => {
          const rx = room.x * W - boxWidth / 2;
          const ry = room.y * H - boxHeight / 2;
          ROOM_GROUPS.forEach((group, index) => {
            const gx = rx + group.x * boxWidth;
            const gy = ry + group.y * boxHeight;
            const radius = Math.min(boxWidth, boxHeight) * 0.105 * tRoomGroups;
            ctx.save();
            ctx.globalAlpha = tRoomGroups * Math.max(0, 1 - pFavo * 1.4);
            hexPath(ctx, gx, gy, radius);
            ctx.fillStyle = index % 2 ? "rgba(255, 172, 0, 0.08)" : "rgba(248, 103, 0, 0.07)";
            ctx.strokeStyle = room.color;
            ctx.lineWidth = 1.4;
            ctx.fill();
            ctx.stroke();
            ctx.restore();
          });
        });
      }

      // 3) Favos dos clubes finais: o centro fica livre para o tema do clube.
      if (pFavo > 0.05) {
        COMMUNITIES.forEach((c, i) => {
          const r = minDim * (0.105 + 0.025 * Math.sqrt(communitySizes[i] / 20)) * tFavo;
          hexPath(ctx, c.cx * W, c.cy * H, r);
          ctx.globalAlpha = 0.12 * tFavo;
          ctx.fillStyle = COLORS.limeDeep;
          ctx.fill();
          ctx.globalAlpha = 0.45 * tFavo;
          ctx.lineWidth = 2;
          ctx.strokeStyle = COLORS.orange;
          ctx.stroke();
          ctx.globalAlpha = 0.92 * tFavo;
          ctx.beginPath();
          ctx.arc(c.cx * W, c.cy * H, Math.min(25, r * .27), 0, Math.PI * 2);
          ctx.fillStyle = COLORS.cardBg;
          ctx.fill();
          drawInterestIcon(ctx, i, c.cx * W, c.cy * H, Math.min(18, r * .2), COLORS.orange);
          ctx.globalAlpha = 0.88 * tFavo;
          ctx.font = "700 11px Inter, sans-serif";
          ctx.fillStyle = COLORS.ink;
          ctx.textAlign = "center";
          ctx.fillText(INTEREST_LABELS[i], c.cx * W, c.cy * H + r + 14);
        });
        ctx.globalAlpha = 1;
      }

      // Posição corrente: carteira -> pequeno favo da turma -> clube entre turmas.
      // O raio da comunidade é resolvido em pixels reais via minDim antes de
      // virar fração — evita distorção elíptica em telas não quadradas.
      const currentFrac = (s) => {
        const roomCx = ROOMS[s.roomIdx].x;
        const roomCy = ROOMS[s.roomIdx].y;
        const boxOriginXFrac = (roomCx * W - boxWidth / 2) / W;
        const boxOriginYFrac = (roomCy * H - boxHeight / 2) / H;
        const seatFracX = boxOriginXFrac + (s.seatFracX * boxWidth) / W;
        const seatFracY = boxOriginYFrac + (s.seatFracY * boxHeight) / H;

        if (s.isTeacher) return { fx: seatFracX, fy: seatFracY };
        const roomGroup = ROOM_GROUPS[s.roomGroup];
        const groupRadiusPx = Math.min(boxWidth, boxHeight) * 0.072 * s.groupRadiusFactor;
        const groupFracX = boxOriginXFrac + (roomGroup.x * boxWidth + Math.cos(s.groupAngle) * groupRadiusPx) / W;
        const groupFracY = boxOriginYFrac + (roomGroup.y * boxHeight + Math.sin(s.groupAngle) * groupRadiusPx) / H;
        const localFracX = seatFracX + (groupFracX - seatFracX) * tRoomGroups;
        const localFracY = seatFracY + (groupFracY - seatFracY) * tRoomGroups;
        const community = COMMUNITIES[s.communityIdx];
        const rPx = minDim * 0.105 * s.commRadiusFactor;
        const targetFracX = community.cx + (Math.cos(s.commAngle) * rPx) / W;
        const targetFracY = community.cy + (Math.sin(s.commAngle) * rPx) / H;

        return {
          fx: localFracX + (targetFracX - localFracX) * tFavo,
          fy: localFracY + (targetFracY - localFracY) * tFavo,
        };
      };

      // 3) Linhas de conexão entre alunos de mesmo interesse, turmas diferentes
      if (pLines > 0 && pFavo < 0.75) {
        ctx.save();
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.strokeStyle = "rgba(248, 103, 0, 0.32)";
        for (let i = 0; i < students.length; i += 3) {
          const s1 = students[i];
          const s2 = students[(i + 7) % students.length];
          if (s1.interest === s2.interest && s1.roomIdx !== s2.roomIdx) {
            const p1 = currentFrac(s1);
            const p2 = currentFrac(s2);
            ctx.globalAlpha = pLines * (1 - pFavo);
            ctx.beginPath();
            ctx.moveTo(p1.fx * W, p1.fy * H);
            ctx.lineTo(p2.fx * W, p2.fy * H);
            ctx.stroke();
          }
        }
        ctx.restore();
      }

      // 4) Alunos e professores (bolinhas) + ícone de interesse
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      students.forEach((s, idx) => {
        const { fx, fy } = currentFrac(s);
        const x = fx * W;
        const y = fy * H;
        const radius = s.isTeacher ? 7 : 4.5;

        ctx.save();
        ctx.globalAlpha = s.isTeacher ? 1 - tFavo : 1 - 0.42 * tFavo;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = ROOMS[s.roomIdx].color;
        ctx.fill();
        if (s.isTeacher) {
          ctx.strokeStyle = "#FFFFFF";
          ctx.lineWidth = 2;
          ctx.stroke();
        }
        ctx.restore();

        // Ícone de interesse — só num subconjunto para não poluir o desenho
        if (!s.isTeacher && pIcons > 0 && idx % 3 === 0) {
          ctx.save();
          ctx.globalAlpha = smooth(pIcons) * (1 - 0.8 * pFavo);
          drawInterestIcon(ctx, s.interest, x, y - radius - 9, 9, COLORS.ink);
          ctx.restore();
        }
      });

      ctx.restore();
    },
    [students, communitySizes]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;
    ctxRef.current = ctx;
    progressRef.current = prefersReduced ? 1 : 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const dpr = window.devicePixelRatio || 1;
      dimsRef.current = { w: rect.width, h: rect.height };
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawScene(progressRef.current);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [drawScene, prefersReduced]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progressRef.current = v;
    if (!prefersReduced) {
      drawScene(v);
      const step = Math.min(STEPS.length - 1, Math.max(0, Math.floor(v * STEPS.length)));
      setActiveStep((prev) => (prev === step ? prev : step));
    }
  });

  return (
    <section
      className="cm-surface cm-font"
      aria-label="A turma é o começo; a comunidade é a escola inteira"
      style={{ position: "relative" }}
    >
      <div
        ref={scrollRef}
        style={{ position: "relative", height: prefersReduced ? "auto" : "380vh" }}
      >
        <div
          style={{
            position: prefersReduced ? "relative" : "sticky",
            top: 0,
            height: prefersReduced ? "auto" : "100vh",
            minHeight: prefersReduced ? "70vh" : undefined,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Títulos com cross-fade */}
          <div
            style={{
              position: "relative",
              maxWidth: 1230,
              width: "100%",
              margin: "0 auto",
              padding: "36px 28px 0",
              textAlign: "center",
              zIndex: 2,
            }}
          >
            <span className="cm-eyebrow">A Jornada da Conexão</span>
            <div style={{ position: "relative", height: "clamp(74px, 12vw, 120px)", marginTop: 10 }}>
              {prefersReduced ? (
                <h2
                  style={{
                    position: "absolute",
                    inset: 0,
                    fontSize: "clamp(26px, 4vw, 46px)",
                    letterSpacing: "-1px",
                    lineHeight: 1.08,
                    color: "var(--cm-orange)",
                    margin: 0,
                  }}
                >
                  A comunidade é a escola inteira.
                </h2>
              ) : (
                <>
                  <motion.h2
                    style={{
                      position: "absolute",
                      inset: 0,
                      fontSize: "clamp(26px, 4vw, 46px)",
                      letterSpacing: "-1px",
                      lineHeight: 1.08,
                      color: "var(--cm-ink)",
                      margin: 0,
                      opacity: firstOpacity,
                    }}
                  >
                    A turma é o começo.
                  </motion.h2>
                  <motion.h2
                    style={{
                      position: "absolute",
                      inset: 0,
                      fontSize: "clamp(26px, 4vw, 46px)",
                      letterSpacing: "-1px",
                      lineHeight: 1.08,
                      color: "var(--cm-ink)",
                      margin: 0,
                      opacity: groupOpacity,
                    }}
                  >
                    Cada turma forma seus primeiros favos.
                  </motion.h2>
                  <motion.h2
                    style={{
                      position: "absolute",
                      inset: 0,
                      fontSize: "clamp(26px, 4vw, 46px)",
                      letterSpacing: "-1px",
                      lineHeight: 1.08,
                      color: "var(--cm-orange)",
                      margin: 0,
                      opacity: secondOpacity,
                    }}
                  >
                    A comunidade é a escola inteira.
                  </motion.h2>
                </>
              )}
            </div>
          </div>

          {/* Canvas interativo */}
          <div style={{ position: "relative", flex: 1, minHeight: 320, width: "100%", maxWidth: 980, margin: "0 auto" }}>
            <canvas
              ref={canvasRef}
              aria-hidden="true"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
            />
          </div>

          {/* Legenda dos passos no rodapé (fallback textual, não depende do canvas) */}
          <div
            style={{
              position: "relative",
              maxWidth: 720,
              width: "100%",
              margin: "0 auto",
              padding: "0 28px 32px",
              textAlign: "center",
              zIndex: 2,
            }}
          >
            <p aria-hidden="true" style={{ fontSize: 14, lineHeight: 1.5, color: "var(--cm-muted)", margin: 0, minHeight: 42 }}>
              {STEPS[activeStep]}
            </p>
            <div aria-hidden="true" style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 14 }}>
              {STEPS.map((_, i) => (
                <span
                  key={i}
                  style={{
                    width: i === activeStep ? 22 : 8,
                    height: 8,
                    borderRadius: 100,
                    background: i === activeStep ? "var(--cm-orange)" : "var(--cm-muted)",
                    transition: "width .25s ease, background .25s ease",
                  }}
                />
              ))}
            </div>

            {/* Lista completa acessível (leitores de tela) */}
            <ol
              style={{
                position: "absolute",
                width: 1,
                height: 1,
                padding: 0,
                margin: -1,
                overflow: "hidden",
                clip: "rect(0 0 0 0)",
                whiteSpace: "nowrap",
                border: 0,
              }}
            >
              {STEPS.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
