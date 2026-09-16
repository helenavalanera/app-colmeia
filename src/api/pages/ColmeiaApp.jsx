import React from "react";
import { Link } from "react-router-dom";
import { CommunityProvider } from "@/state/CommunityState";
import SiteHeader from "@/components/colmeia/SiteHeader";
import CommunityShell from "@/components/comunidade/CommunityShell";

export default function ColmeiaApp() {
  return (
    <CommunityProvider>
      <div className="cm-surface" style={{ minHeight: "100vh" }}>
        <SiteHeader />
        <div className="co-page-back-wrap">
          <Link to="/" className="cm-btn cm-btn-ghost cm-font co-page-back">← Voltar à página inicial</Link>
        </div>
        <CommunityShell />
      </div>
    </CommunityProvider>
  );
}
