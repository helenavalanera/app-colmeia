import { useNavigate } from "react-router-dom";
import { Shell } from "../../components/Shell";
import { PhotoUpload } from "../../components/PhotoUpload";
import { useAppState } from "../../state/AppState";
import { INTERESSES, CORES_PERFIL } from "../../data/mockData";
import type { Mood } from "../../types";

const HUMORES: { id: Mood; label: string }[] = [
  { id: "muito-bem", label: "Muito bem" },
  { id: "bem", label: "Bem" },
  { id: "mais-ou-menos", label: "Mais ou menos" },
  { id: "cansado", label: "Cansado" },
  { id: "precisa-de-apoio", label: "Precisa de apoio" },
];

export function AlunoPerfil() {
  const { alunoProfile, updateAlunoProfile } = useAppState();
  const navigate = useNavigate();

  function toggleInteresse(i: string) {
    const tem = alunoProfile.interesses.includes(i);
    updateAlunoProfile({
      interesses: tem
        ? alunoProfile.interesses.filter((x) => x !== i)
        : [...alunoProfile.interesses, i],
    });
  }

  const podeSalvar = alunoProfile.nome.trim().length > 0;

  return (
    <Shell hideNav>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-display font-extrabold text-xl">Perfil do aluno</h1>
          <p className="text-sm text-sand-700">
            Customize seu perfil e compartilhe seus interesses
          </p>
        </div>

        <div className="flex justify-center">
          <PhotoUpload
            value={alunoProfile.fotoUrl}
            onChange={(fotoUrl) => updateAlunoProfile({ fotoUrl })}
            label="Adicionar foto"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-sand-700 uppercase tracking-wide">
            Como você quer ser chamado?
          </label>
          <input
            value={alunoProfile.nome}
            onChange={(e) => updateAlunoProfile({ nome: e.target.value })}
            placeholder="Seu nome"
            className="mt-1 w-full rounded-xl border border-sand-300 px-3 py-2.5 text-sm focus:border-honey-500 outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-sand-700 uppercase tracking-wide">
            Escolha sua cor favorita
          </label>
          <div className="mt-2 flex gap-2">
            {CORES_PERFIL.map((c) => (
              <button
                key={c}
                onClick={() => updateAlunoProfile({ cor: c })}
                style={{ backgroundColor: c }}
                className={`w-8 h-8 rounded-full transition-transform ${
                  alunoProfile.cor === c ? "scale-110 ring-2 ring-offset-2 ring-honey-600" : ""
                }`}
                aria-label={`Cor ${c}`}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-sand-700 uppercase tracking-wide">
            Do que você gosta?
          </label>
          <div className="mt-2 flex flex-wrap gap-2">
            {INTERESSES.map((i) => {
              const ativo = alunoProfile.interesses.includes(i);
              return (
                <button
                  key={i}
                  onClick={() => toggleInteresse(i)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                    ativo
                      ? "bg-honey-500 border-honey-500 text-white"
                      : "border-sand-300 text-sand-700"
                  }`}
                >
                  {i}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-sand-700 uppercase tracking-wide">
            Como você está hoje?
          </label>
          <div className="mt-2 flex flex-wrap gap-2">
            {HUMORES.map((h) => (
              <button
                key={h.id}
                onClick={() => updateAlunoProfile({ humor: h.id })}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                  alunoProfile.humor === h.id
                    ? "bg-leaf-500 border-leaf-500 text-white"
                    : "border-sand-300 text-sand-700"
                }`}
              >
                {h.label}
              </button>
            ))}
          </div>
        </div>

        <button
          disabled={!podeSalvar}
          onClick={() => navigate("/aluno/home")}
          className="w-full py-3.5 rounded-2xl bg-honey-500 disabled:bg-sand-300 disabled:cursor-not-allowed text-white font-bold text-sm"
        >
          Salvar perfil
        </button>
      </div>
    </Shell>
  );
}
