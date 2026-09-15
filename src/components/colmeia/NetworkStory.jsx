import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

/*
 * NetworkStory — seção "scrollytelling" da landing.
 *
 * Um <canvas> é desenhado a partir do progresso de rolagem (framer-motion
 * useScroll) sobre um container alto com um visual "sticky". A narrativa em 5
 * passos: quatro turmas (6º, 7º, 8º, 9º) aparecem -> interesses em comum surgem
 * -> conexões cruzam as turmas -> comunidades de afinidade se formam (hexágonos)
 * -> a escola inteira vira uma rede única. O título faz cross-fade entre
 * "A turma é o começo." e "A comunidade é a escola inteira." por volta de 0.5.
 *
 * Paleta: tokens do projeto (src/index.css). Valores hexadecimais fixados aqui
 * (com o token de referência ao lado) para não depender da resolução de
 * var(--...) aninhadas via getComputedStyle.
 */

// Cores derivadas dos tokens do projeto (src/index.css)
const COLORS = {
  orange: "#F86700", // --cm-orange
  yellow: "#FFAC00", // --cm-yellow
  orangeSoft: "#f59e00", // --cm-green-soft
  greenDeep: "#994000", // --cm-green-deep
  limeDeep: "#f4d28d", // --cm-lime-deep
  ink: "#18181B", // --cm-ink
  muted: "#62626b", // --cm-muted
};

// Cada turma vira um cluster num quadrante, com uma cor quente da paleta.
const CLUSTERS = [
  { label: "6º ano", cx: 0.27, cy: 0.33, color: COLORS.orange },
  { label: "7º ano", cx: 0.73, cy: 0.33, color: COLORS.yellow },
  { label: "8º ano", cx: 0.27, cy: 0.71, color: COLORS.orangeSoft },
  { label: "9º ano", cx: 0.73, cy: 0.71, color: COLORS.greenDeep },
];

const INTEREST_COUNT = 4;
const PER_CLUSTER = 6;

const STEPS = [
  "Quatro turmas — 6º, 7º, 8º e 9º ano — cada uma no seu grupo.",
  "Interesses em comum começam a aparecer entre os estudantes.",
  "As conexões cruzam as fronteiras das turmas.",
  "Comunidades de afinidade se formam além da sala de aula.",
  "A escola inteira vira uma só rede conectada.",
];

// PRNG determinístico (mulberry32) — mesmo layout a cada carregamento.
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
// suavização cúbica (smoothstep)
const smooth = (v) => {
  const t = clamp01(v);
  return t * t * (3 - 2 * t);
};

// Constrói nós, conexões cruzadas e comunidades uma única vez (layout fixo).
function buildGraph() {
  const rnd = mulberry32(20240917);
  const nodes = [];

  CLUSTERS.forEach((cl, ci) => {
    for (let k = 0; k < PER_CLUSTER; k++) {
      const ang = rnd() * Math.PI * 2;
      const rad = 0.055 + rnd() * 0.07;
      nodes.push({
        cluster: ci,
        nx: cl.cx + Math.cos(ang) * rad,
        ny: cl.cy + Math.sin(ang) * rad * 1.05,
        interest: Math.floor(rnd() * INTEREST_COUNT),
        r: 5 + rnd() * 3,
        // janela de surgimento dentro de ~[0, 0.16]
        appear: Math.min(0.15, ci * 0.03 + rnd() * 0.05),
      });
    }
  });

  // Conexões: para cada interesse, uma cadeia com um representante por turma,
  // sempre ligando turmas diferentes (conexões que cruzam a sala de aula).
  const connections = [];
  for (let it = 0; it < INTEREST_COUNT; it++) {
    const reps = [];
    for (let ci = 0; ci < CLUSTERS.length; ci++) {
      const idx = nodes.findIndex((n) => n.interest === it && n.cluster === ci);
      if (idx >= 0) reps.push(idx);
    }
    for (let i = 0; i < reps.length - 1; i++) {
      connections.push({
        a: reps[i],
        b: reps[i + 1],
        interest: it,
        delay: ((connections.length % 6) * 0.05),
      });
    }
  }

  const markerSet = new Set();
  connections.forEach((c) => {
    markerSet.add(c.a);
    markerSet.add(c.b);
  });

  // Comunidades: envolvem os nós representantes de cada interesse (grupos de
  // afinidade que atravessam as turmas). Alguma sobreposição translúcida é
  // intencional — reforça "a escola inteira vira uma rede".
  const communities = [];
  for (let it = 0; it < INTEREST_COUNT; it++) {
    const members = [];
    connections
      .filter((c) => c.interest === it)
      .forEach((c) => {
        if (!members.includes(c.a)) members.push(c.a);
        if (!members.includes(c.b)) members.push(c.b);
      });
    if (members.length < 2) continue;
    let sx = 0;
    let sy = 0;
    members.forEach((idx) => {
      sx += nodes[idx].nx;
      sy += nodes[idx].ny;
    });
    const cx = sx / members.length;
    const cy = sy / members.length;
    let maxd = 0;
    members.forEach((idx) => {
      const dx = nodes[idx].nx - cx;
      const dy = nodes[idx].ny - cy;
      maxd = Math.max(maxd, Math.hypot(dx, dy));
    });
    communities.push({ nx: cx, ny: cy, r: maxd + 0.05, interest: it, delay: it * 0.06 });
  }

  return { nodes, connections, communities, markerSet };
}

function hexPath(ctx, cx, cy, r) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 180) * (60 * i - 90); // topo pontudo
    const x = cx + r * Math.cos(a);
    const y = cy + r * Math.sin(a);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

export default function NetworkStory() {
  const scrollRef = useRef(null);
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const dimsRef = useRef({ w: 0, h: 0 });
  const progressRef = useRef(0);
  const prefersReduced = useReducedMotion();

  const graph = useMemo(() => buildGraph(), []);
  const [activeStep, setActiveStep] = useState(0);

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"],
  });

  const firstOpacity = useTransform(scrollYProgress, [0.42, 0.52], [1, 0]);
  const secondOpacity = useTransform(scrollYProgress, [0.48, 0.58], [0, 1]);

  const drawScene = useCallback(
    (progress) => {
      const ctx = ctxRef.current;
      const { w: W, h: H } = dimsRef.current;
      if (!ctx || !W || !H) return;

      const { nodes, connections, communities, markerSet } = graph;
      const min = Math.min(W, H);

      // Progresso por fase
      const p1 = clamp01((progress - 0.0) / 0.2); // clusters surgem
      const p2 = clamp01((progress - 0.2) / 0.2); // marcadores de interesse
      const p3 = clamp01((progress - 0.4) / 0.2); // linhas cruzadas
      const p4 = clamp01((progress - 0.6) / 0.2); // hexágonos/comunidades
      const p5 = clamp01((progress - 0.8) / 0.2); // rede única + zoom-out

      const px = (n) => n.nx * W;
      const py = (n) => n.ny * H;

      ctx.clearRect(0, 0, W, H);
      ctx.save();

      // Zoom-out suave na fase final, centrado no meio do canvas.
      const zoom = 1 - 0.14 * smooth(p5);
      ctx.translate(W / 2, H / 2);
      ctx.scale(zoom, zoom);
      ctx.translate(-W / 2, -H / 2);

      // 1) Hexágonos das comunidades (fundo)
      if (p4 > 0) {
        for (let i = 0; i < communities.length; i++) {
          const cm = communities[i];
          const t = smooth(clamp01((p4 - cm.delay) / (1 - cm.delay)));
          if (t <= 0) continue;
          const r = cm.r * min * (0.85 + 0.15 * t);
          hexPath(ctx, cm.nx * W, cm.ny * H, r);
          ctx.globalAlpha = 0.1 * t;
          ctx.fillStyle = COLORS.limeDeep;
          ctx.fill();
          ctx.globalAlpha = (0.55 + 0.25 * p5) * t;
          ctx.lineWidth = 1.5;
          ctx.strokeStyle = COLORS.limeDeep;
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      }

      // 2) Linhas cruzadas (mesmo interesse, turmas diferentes)
      if (p3 > 0) {
        ctx.save();
        ctx.setLineDash([4, 5]);
        ctx.lineWidth = 1.6;
        ctx.strokeStyle = COLORS.orange;
        for (let i = 0; i < connections.length; i++) {
          const c = connections[i];
          const frac = smooth(clamp01((p3 - c.delay) / (1 - c.delay)));
          if (frac <= 0) continue;
          const na = nodes[c.a];
          const nb = nodes[c.b];
          const ax = px(na);
          const ay = py(na);
          const ex = ax + (px(nb) - ax) * frac;
          const ey = ay + (py(nb) - ay) * frac;
          ctx.globalAlpha = 0.4 + 0.35 * frac;
          ctx.beginPath();
          ctx.moveTo(ax, ay);
          ctx.lineTo(ex, ey);
          ctx.stroke();
        }
        ctx.restore();
      }

      // 3) Rede única: liga os centros das comunidades num anel
      if (p5 > 0 && communities.length > 1) {
        ctx.save();
        ctx.lineWidth = 2;
        ctx.strokeStyle = COLORS.orange;
        ctx.globalAlpha = 0.5 * smooth(p5);
        ctx.beginPath();
        for (let i = 0; i < communities.length; i++) {
          const cm = communities[i];
          const x = cm.nx * W;
          const y = cm.ny * H;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
      }

      // 4) Nós
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const alpha = progress >= 0.2 ? 1 : clamp01((p1 * 0.2 - n.appear) / 0.06);
        if (alpha <= 0) continue;
        const scale = 0.6 + 0.4 * alpha;
        const x = px(n);
        const y = py(n);
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(x, y, n.r * scale, 0, Math.PI * 2);
        ctx.fillStyle = CLUSTERS[n.cluster].color;
        ctx.fill();

        // 5) Marcador de interesse (anel amarelo) num subconjunto de nós
        if (p2 > 0 && markerSet.has(i)) {
          ctx.globalAlpha = alpha * smooth(p2);
          ctx.beginPath();
          ctx.arc(x, y, n.r * scale + 4, 0, Math.PI * 2);
          ctx.lineWidth = 2;
          ctx.strokeStyle = COLORS.yellow;
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;

      // 6) Rótulos das turmas
      ctx.font = "700 13px 'Open Sauce Sans', system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = COLORS.ink;
      for (let i = 0; i < CLUSTERS.length; i++) {
        const cl = CLUSTERS[i];
        ctx.globalAlpha = smooth(p1) * (1 - 0.35 * smooth(p5));
        ctx.fillText(cl.label, cl.cx * W, cl.cy * H - min * 0.14);
      }
      ctx.globalAlpha = 1;

      ctx.restore();
    },
    [graph]
  );

  // Setup do canvas: high-DPI + ResizeObserver.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined; // guarda contra getContext null
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

  // Redesenha a cada mudança de progresso; atualiza o passo ativo (texto).
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progressRef.current = v;
    if (!prefersReduced) drawScene(v);
    const step = Math.min(STEPS.length - 1, Math.max(0, Math.floor(v * STEPS.length)));
    setActiveStep((prev) => (prev === step ? prev : step));
  });

  return (
    <section
      className="cm-surface cm-font"
      aria-label="A turma é o começo; a comunidade é a escola inteira"
      style={{ position: "relative" }}
    >
      <div
        ref={scrollRef}
        style={{ position: "relative", height: prefersReduced ? "auto" : "320vh" }}
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
          {/* Título com cross-fade */}
          <div
            style={{
              position: "relative",
              maxWidth: 1230,
              width: "100%",
              margin: "0 auto",
              padding: "36px 28px 0",
              textAlign: "center",
              pointerEvents: "none",
              zIndex: 2,
            }}
          >
            <span className="cm-eyebrow">Uma escola de conexões</span>
            <div style={{ position: "relative", height: "clamp(74px, 12vw, 120px)", marginTop: 10 }}>
              {prefersReduced ? (
                <h2
                  style={{
                    position: "absolute",
                    inset: 0,
                    fontSize: "clamp(26px, 4vw, 46px)",
                    letterSpacing: "-1px",
                    lineHeight: 1.08,
                    color: "var(--cm-ink)",
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

          {/* Canvas da rede */}
          <div style={{ position: "relative", flex: 1, minHeight: 320 }}>
            <canvas
              ref={canvasRef}
              aria-hidden="true"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
            />
          </div>

          {/* Fallback textual + legenda do passo atual (não depende do canvas) */}
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
            <p
              aria-hidden="true"
              style={{
                fontSize: 14,
                lineHeight: 1.5,
                color: "var(--cm-muted)",
                margin: 0,
                minHeight: 42,
                transition: "opacity .2s ease",
              }}
            >
              {prefersReduced ? STEPS[STEPS.length - 1] : STEPS[activeStep]}
            </p>
            <div
              aria-hidden="true"
              style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 14 }}
            >
              {STEPS.map((_, i) => (
                <span
                  key={i}
                  style={{
                    width: (prefersReduced ? i === STEPS.length - 1 : i === activeStep) ? 22 : 8,
                    height: 8,
                    borderRadius: 100,
                    background:
                      (prefersReduced ? i === STEPS.length - 1 : i === activeStep)
                        ? "var(--cm-orange)"
                        : "var(--cm-line)",
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
