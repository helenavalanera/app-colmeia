import React from "react";
import { CommunityProvider } from "@/state/CommunityState";
import SiteHeader from "@/components/colmeia/SiteHeader";
import CommunityShell from "@/components/comunidade/CommunityShell";

export default function ColmeiaApp() {
  return (
    <CommunityProvider>
      <div className="cm-surface" style={{ minHeight: "100vh" }}>
        <SiteHeader />
        <div className="co-page-back-wrap">
          <a href={import.meta.env.BASE_URL} className="cm-btn cm-btn-ghost cm-font co-page-back">← Voltar à página inicial</a>
        </div>
        <CommunityShell />
      </div>
    </CommunityProvider>
  );
}
