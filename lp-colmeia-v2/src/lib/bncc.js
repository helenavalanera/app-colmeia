import bnccHabilidades from "@/data/bncc.json";

/**
 * Base real de habilidades da BNCC (Ensino Fundamental, 6º ao 9º ano), extraída
 * do dataset aberto bncc.dev (CC BY 4.0, mantido pela Profy:
 * https://github.com/bncc-dev/bncc-dados).
 *
 * A Colmeia vincula BNCC somente por critério psicossocial — habilidades que
 * tocam cooperação, empatia, convivência, cidadania, diversidade, escuta,
 * autonomia, resolução de conflito etc., independente do componente curricular.
 * Isso é o que sustenta o caráter interdisciplinar das missões: uma habilidade
 * psicossocial de Ciências e uma de Língua Portuguesa podem servir à mesma
 * missão, porque o critério nunca é o conteúdo da matéria.
 * `psicossocial` foi calculado por palavra-chave sobre o texto oficial da
 * habilidade — curadoria de demonstração, não uma classificação pedagógica
 * oficial do MEC.
 */
export const BNCC_HABILIDADES = bnccHabilidades;
export const BNCC_PSICOSSOCIAL = bnccHabilidades.filter((h) => h.psicossocial);

const BNCC_BY_CODIGO = Object.fromEntries(BNCC_HABILIDADES.map((h) => [h.codigo, h]));

export function bnccLookup(codigo) {
  return BNCC_BY_CODIGO[codigo] || null;
}

export function bnccToSkills(bncc) {
  if (!bncc || bncc.length === 0) return [];
  return bncc.map((codigo) => {
    const h = bnccLookup(codigo);
    return h ? { codigo, label: `${h.componente} · ${h.codigo}`, texto: h.texto } : { codigo, label: codigo, texto: "" };
  });
}
