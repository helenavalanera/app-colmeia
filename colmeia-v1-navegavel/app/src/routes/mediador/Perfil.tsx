import { useNavigate } from "react-router-dom";
import { Shell } from "../../components/Shell";
import { PhotoUpload } from "../../components/PhotoUpload";
import { useAppState } from "../../state/AppState";

export function MediadorPerfil() {
  const { mediadorProfile, updateMediadorProfile } = useAppState();
  const navigate = useNavigate();
  const podeSalvar = mediadorProfile.nome.trim().length > 0;

  return (
    <Shell hideNav>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-display font-extrabold text-xl">Perfil / Configurações</h1>
          <p className="text-sm text-sand-700">Gerencie sua escola, turmas e preferências</p>
        </div>

        <div className="flex justify-center">
          <PhotoUpload
            value={mediadorProfile.fotoUrl}
            onChange={(fotoUrl) => updateMediadorProfile({ fotoUrl })}
          />
        </div>

        <div>
          <label className="text-xs font-bold text-sand-700 uppercase tracking-wide">
            Nome
          </label>
          <input
            value={mediadorProfile.nome}
            onChange={(e) => updateMediadorProfile({ nome: e.target.value })}
            placeholder="Seu nome"
            className="mt-1 w-full rounded-xl border border-sand-300 px-3 py-2.5 text-sm focus:border-honey-500 outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-sand-700 uppercase tracking-wide">
            Disciplina / área
          </label>
          <input
            value={mediadorProfile.disciplina ?? ""}
            onChange={(e) => updateMediadorProfile({ disciplina: e.target.value })}
            placeholder="Ex.: Ciências"
            className="mt-1 w-full rounded-xl border border-sand-300 px-3 py-2.5 text-sm focus:border-honey-500 outline-none"
          />
        </div>

        <button
          disabled={!podeSalvar}
          onClick={() => navigate("/mediador/home")}
          className="w-full py-3.5 rounded-2xl bg-honey-500 disabled:bg-sand-300 disabled:cursor-not-allowed text-white font-bold text-sm"
        >
          Salvar perfil
        </button>
      </div>
    </Shell>
  );
}
