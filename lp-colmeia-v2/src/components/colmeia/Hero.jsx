import React from "react";
import { Link } from "react-router-dom";
import BeeMascot from "./BeeMascot";

export default function Hero() {
  return (
    <section className="cm-surface cm-font" style={{ padding: "40px 28px 32px", maxWidth: 1230, margin: "0 auto" }}>
      <div className="grid gap-12 items-end" style={{ gridTemplateColumns: "1.4fr 1fr" }}>
        <div>
          <span className="cm-eyebrow" style={{ background: "var(--cm-yellow)", padding: "6px 12px", borderRadius: 8, color: "var(--cm-ink)" }}>Para turmas do 6º ao 9º ano</span>
          <h1 style={{ fontSize: "clamp(34px, 4.5vw, 58px)", lineHeight: 1.06, letterSpacing: "-2px", fontWeight: 800, marginTop: 14, color: "var(--cm-green)" }}>
            O celular não precisa <em style={{ fontStyle: "normal", color: "var(--cm-orange)" }} className="text-[hsl(var(--chart-5))]">afastar</em> a turma.
          </h1>
          <p style={{ maxWidth: 400, color: "var(--cm-muted)", fontSize: 14, lineHeight: 1.6, marginTop: 18 }}>
            A Colmeia transforma poucos minutos de tela em missões presenciais que conectam estudantes, fortalecem a autonomia e levam a aprendizagem para fora da própria bolha social.
          </p>
          <div className="flex flex-wrap gap-3" style={{ marginTop: 22 }}>
            <Link to="/app" className="cm-btn cm-btn-primary">Ver uma Colmeia em ação</Link>
            <Link to="/app" className="cm-btn cm-btn-ghost">Conhecer a jornada do educador</Link>
          </div>
          <p style={{ fontSize: 12, color: "var(--cm-muted)", marginTop: 18, maxWidth: 420 }}>
            Funciona direto no navegador, em celulares que a escola já tem.
          </p>
        </div>
        <div className="flex justify-center">
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", inset: "-20px -10px", background: "radial-gradient(ellipse at center, #faf1bc 0%, #f0edcf 50%, transparent 72%)", borderRadius: 30 }} />
            <BeeMascot size={170} style={{ position: "relative", filter: "drop-shadow(0 9px 6px rgba(92,88,59,0.12))" }} />
          </div>
        </div>
      </div>
    </section>);

}