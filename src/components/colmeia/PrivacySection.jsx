import React from "react";
import { EyeOff, Trophy, HandHeart } from "lucide-react";

const ITEMS = [
  { Icon: EyeOff, text: "Não acessa aplicativos, mensagens ou histórico de navegação." },
  { Icon: Trophy, text: "Não cria ranking público nem expõe quem teve dificuldade." },
  { Icon: HandHeart, text: "O mediador acolhe pedidos e acompanha as experiências compartilhadas pelos clubes." },
];

export default function PrivacySection() {
  return (
    <section className="cm-surface cm-font" style={{ maxWidth: 1230, margin: "0 auto", padding: "20px 28px 60px" }}>
      <div
        style={{
          background: "var(--cm-green)",
          color: "var(--cm-ink)",
          borderRadius: "var(--cm-radius)",
          padding: "36px 32px",
          display: "grid",
          gap: 18,
        }}
      >
        <h2 style={{ fontSize: 26, letterSpacing: "-0.5px", marginBottom: 4 }}>
          Mediação pedagógica, não vigilância.
        </h2>
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
          {ITEMS.map((it) => (
            <div key={it.text} style={{ fontSize: 14, lineHeight: 1.6, display: "flex", gap: 10, alignItems: "flex-start" }}>
              <it.Icon size={21} aria-hidden="true" style={{ flexShrink: 0 }} />
              <span>{it.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
