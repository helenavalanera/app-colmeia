import React from "react";

export default function SiteFooter() {
  return (
    <footer
      className="cm-surface cm-font"
      style={{ maxWidth: 1174, margin: "15px auto 0", padding: "25px 28px 35px", borderTop: "1px solid var(--cm-line)" }}
    >
      <div className="flex flex-wrap justify-between gap-5 items-center" style={{ marginBottom: 20 }}>
        <div>
          <strong style={{ fontSize: 13 }}>Uma ideia da equipe Entre Pretas.</strong>
          <p style={{ fontSize: 11, color: "var(--cm-muted)", margin: "4px 0 0" }}>
            Helena Valanera · Maria Eduarda Pacheco · Gabriela Mullet
          </p>
          <p style={{ fontSize: 11, color: "var(--cm-muted)", margin: "4px 0 0" }}>
            Colmeia · Protótipo educacional para o HACKTUDO 2026.
          </p>
        </div>
        <div style={{ fontWeight: 900, letterSpacing: "-1px", fontSize: 23 }}>
          HACKTUDO <span style={{ color: "var(--cm-orange)" }}>2026</span>
        </div>
      </div>
    </footer>
  );
}