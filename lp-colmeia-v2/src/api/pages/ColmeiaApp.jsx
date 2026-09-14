import React, { useState } from "react";
import { Link } from "react-router-dom";
import StudentPhone from "@/components/colmeia/StudentPhone";
import TeacherPhone from "@/components/colmeia/TeacherPhone";
import { DemoProvider } from "@/state/DemoState";

export default function ColmeiaApp() {
  const [view, setView] = useState("both");

  return (
    <DemoProvider>
    <div className="cm-surface cm-font min-h-screen">
      <div style={{ maxWidth: 1230, margin: "0 auto", padding: "20px 28px" }}>
        <div className="flex items-center justify-between flex-wrap gap-3" style={{ marginBottom: 24 }}>
          <Link to="/" className="cm-btn cm-btn-ghost" style={{ fontSize: 12 }}>← Voltar à landing</Link>
          <span style={{ fontSize: 11, color: "var(--cm-muted)" }}>Dois olhares, a mesma Colmeia · navegue dentro de cada celular</span>
        </div>

        <div className="flex justify-center gap-3" style={{ marginBottom: 28, flexWrap: "wrap" }}>
          {[
            ["both", "Ver os dois"],
            ["student", "Visão do aluno"],
            ["teacher", "Visão do educador"],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setView(id)}
              className="cm-btn"
              style={view === id ? { background: "var(--cm-green)", color: "#fff", borderColor: "var(--cm-green)" } : {}}
            >
              {label}
            </button>
          ))}
        </div>

        <div
          className="flex justify-center"
          style={{ gap: 54, flexWrap: "wrap", alignItems: "flex-start" }}
        >
          {(view === "both" || view === "student") && (
            <div style={{ width: "100%", maxWidth: 410 }}>
              <div style={{ fontSize: 10, letterSpacing: 1.2, fontWeight: 750, color: "var(--cm-muted)", margin: "0 4px 13px", display: "flex", justifyContent: "space-between" }}>
                <span>01 / VISÃO ALUNO</span>
                <span>SEU PRÓXIMO ENCONTRO</span>
              </div>
              <StudentPhone />
            </div>
          )}
          {(view === "both" || view === "teacher") && (
            <div style={{ width: "100%", maxWidth: 410 }}>
              <div style={{ fontSize: 10, letterSpacing: 1.2, fontWeight: 750, color: "var(--cm-muted)", margin: "0 4px 13px", display: "flex", justifyContent: "space-between" }}>
                <span>02 / VISÃO MEDIADOR</span>
                <span>CUIDAR DAS CONEXÕES</span>
              </div>
              <TeacherPhone />
            </div>
          )}
        </div>
      </div>
    </div>
    </DemoProvider>
  );
}