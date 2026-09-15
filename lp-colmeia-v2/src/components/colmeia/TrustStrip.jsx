import React from "react";

const SEALS = [
{ emoji: "🛡️", text: "Sem rastrear navegação, câmera ou localização" },
{ emoji: "🤝", text: "Grupos que aproximam colegas diferentes" },
{ emoji: "🌐", text: "Sem instalar aplicativo" }];


export default function TrustStrip() {
  return (
    <div className="cm-surface cm-font flex flex-wrap justify-center gap-3.5" style={{ maxWidth: 1230, margin: "0 auto", padding: "0 28px 32px" }}>
      {SEALS.map((s) =>
      <div
        key={s.text}
        className="flex items-center gap-2"
        style={{
          background: "var(--cm-white)",
          border: "1px solid var(--cm-line)",
          borderRadius: 100,
          padding: "10px 16px",
          fontSize: 12,
          fontWeight: 700,
          color: "var(--cm-ink)",
          boxShadow: "0 2px 8px rgba(38,59,50,0.05)"
        }}>
        
          
          {s.text}
        </div>
      )}
    </div>);

}