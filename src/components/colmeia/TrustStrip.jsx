import React from "react";
import { ShieldCheck, UsersRound } from "lucide-react";

const SEALS = [
{ Icon: ShieldCheck, text: "Sem rastrear navegação, câmera ou localização" },
{ Icon: UsersRound, text: "Turmas diferentes compartilhando saberes" }];


export default function TrustStrip() {
  return (
    <div className="cm-surface cm-font cm-trust-strip flex flex-wrap justify-center gap-3.5" style={{ maxWidth: 1230, margin: "0 auto", padding: "0 28px 32px" }}>
      {SEALS.map((s) =>
      <div
        key={s.text}
        className="flex items-center gap-2"
        style={{
          background: "var(--cm-white)",
          border: "1px solid var(--cm-line)",
          borderRadius: 100,
          padding: "10px 16px",
          fontSize: 13,
          fontWeight: 700,
          color: "var(--cm-ink)",
          boxShadow: "0 2px 8px rgba(38,59,50,0.05)"
        }}>
        
          
          <s.Icon size={17} aria-hidden="true" />{s.text}
        </div>
      )}
    </div>);

}
