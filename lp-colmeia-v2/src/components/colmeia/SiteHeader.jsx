import React from "react";
import { Link } from "react-router-dom";

export const LOGO_COLMEIA = "https://media.base44.com/images/public/6aa81abfa22008a3216ae411/5131c50ac_ProcessoCriativo-Hackathon20261.png";
export const LOGO_ENTRE_PRETAS = "https://media.base44.com/images/public/6aa81abfa22008a3216ae411/40d4d44cb_ProcessoCriativo-Hackathon2026.png";

export default function SiteHeader() {
  return (
    <header
      className="cm-surface cm-font flex items-center justify-between"
      style={{ maxWidth: 1230, margin: "0 auto", padding: "18px 28px", borderBottom: "1px solid var(--cm-line)" }}>
      
      <div className="co-brand-pair">
        <img src={LOGO_ENTRE_PRETAS} alt="Entre Pretas" className="co-entre-pretas" />
        <span className="co-brand-divider" aria-hidden="true" />
        <Link to="/" aria-label="Colmeia · início"><img src={LOGO_COLMEIA} alt="Colmeia · Ecossistema de Comunidades" className="co-colmeia-logo" /></Link>
      </div>
      <span className="co-event-label">HACKTUDO 2026<br /><span>feito pela Entre Pretas</span></span>
    </header>);

}