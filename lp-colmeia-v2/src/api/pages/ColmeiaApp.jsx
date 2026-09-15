import React from "react";
import { Link } from "react-router-dom";
import { CommunityProvider } from "@/state/CommunityState";
import CommunityShell from "@/components/comunidade/CommunityShell";

export default function ColmeiaApp() {
  return (
    <CommunityProvider>
      <div className="cm-surface" style={{ minHeight: "100vh" }}>
        <div style={{ maxWidth: 460, margin: "0 auto", padding: "16px 24px 0" }}>
          <Link to="/" className="cm-btn cm-btn-ghost cm-font" style={{ fontSize: 12 }}>← Voltar à landing</Link>
        </div>
        <CommunityShell />
      </div>
    </CommunityProvider>
  );
}
