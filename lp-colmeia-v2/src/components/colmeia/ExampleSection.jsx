import React from "react";

export default function ExampleSection() {
  return (
    <section className="cm-surface cm-font" style={{ maxWidth: 1230, margin: "0 auto", padding: "20px 28px 60px" }}>
      <span className="cm-eyebrow">Exemplo</span>
      <div
        className="cm-card"
        style={{
          marginTop: 12,
          background: "var(--cm-orange-light)",
          borderColor: "#ecd680",
          padding: 28,
          display: "grid",
          gap: 16,
          gridTemplateColumns: "1fr auto",
          alignItems: "center",
        }}
      >
        <div>
          <h3 style={{ fontSize: 19, marginBottom: 10, color: "var(--cm-ink)" }}>Colmeia de Checagem de Fatos</h3>
          <p style={{ fontSize: 14, color: "var(--cm-muted)", maxWidth: 520, lineHeight: 1.6, marginBottom: 12 }}>
            Em Língua Portuguesa, cada estudante recebe um fragmento de uma notícia: fonte, data, imagem ou contra-argumento. O grupo só decide se a informação é confiável quando reúne as partes presencialmente.
          </p>
          <span
            style={{
              display: "inline-block",
              background: "var(--cm-white)",
              borderRadius: 100,
              padding: "6px 12px",
              fontSize: 12,
              fontWeight: 700,
              color: "var(--cm-green)",
            }}
          >
            Leitura crítica · Argumentação · Cooperação
          </span>
        </div>
        <div style={{ fontSize: 56, lineHeight: 1 }}>🐝</div>
      </div>
    </section>
  );
}