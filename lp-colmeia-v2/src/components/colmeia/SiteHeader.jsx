import React from "react";
import { Link } from "react-router-dom";

const LOGO_COLMEIA = "https://media.base44.com/images/public/6aa81abfa22008a3216ae411/5131c50ac_ProcessoCriativo-Hackathon20261.png";
const LOGO_ENTRE_PRETAS = "https://media.base44.com/images/public/6aa81abfa22008a3216ae411/40d4d44cb_ProcessoCriativo-Hackathon2026.png";

export default function SiteHeader() {
  return (
    <header
      className="cm-surface cm-font flex items-center justify-between"
      style={{ maxWidth: 1230, margin: "0 auto", padding: "18px 28px", borderBottom: "1px solid var(--cm-line)" }}>
      
      <Link to="/" className="flex items-center gap-3 no-underline">
        <img
          src={LOGO_COLMEIA}
          alt="Colmeia · Ecossistema de Comunidades"
          style={{ height: 42, width: "auto", objectFit: "contain", display: "block" }} className="rounded-md" />
        
      </Link>
      <div className="flex items-center gap-3">
        <span style={{ fontSize: 11, color: "var(--cm-muted)", textAlign: "right", lineHeight: 1.4 }}>
          <strong style={{ color: "var(--cm-green)", display: "block", letterSpacing: 1, marginBottom: 4 }}>
            HACKTUDO 2026
          </strong>
          Time Entre Pretas
        </span>
        <div>
          <img
            src={LOGO_ENTRE_PRETAS}
            alt="Entre Pretas"
            style={{ height: 38, width: "auto", objectFit: "contain", display: "block" }} />
          
        </div>
      </div>
    </header>);

}