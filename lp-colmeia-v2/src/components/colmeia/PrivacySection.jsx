import React from "react";

const ITEMS = [
  { icon: "🚫", text: "Não acessa aplicativos, mensagens ou histórico de navegação." },
  { icon: "📷", text: "Não usa câmera, microfone ou localização." },
  { icon: "🏆", text: "Não cria ranking público nem expõe quem teve dificuldade." },
  { icon: "👩‍🏫", text: "O professor recebe uma visão coletiva da participação da turma." },
];

export default function PrivacySection() {
  return (
    <section className="cm-surface cm-font" style={{ maxWidth: 1230, margin: "0 auto", padding: "20px 28px 60px" }}>
      <div
        style={{
          background: "var(--cm-green)",
          color: "#fff",
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
              <span style={{ fontSize: 20, flexShrink: 0 }}>{it.icon}</span>
              <span>{it.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}