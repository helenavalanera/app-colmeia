import { Shell } from "../../components/Shell";
import { useAppState } from "../../state/AppState";

export function MediadorHome() {
  const { mediadorProfile, alunoProfile } = useAppState();
  const primeiroNome = mediadorProfile.nome.split(" ")[0] || "Colmeia";

  return (
    <Shell>
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-3">
          {mediadorProfile.fotoUrl && (
            <img
              src={mediadorProfile.fotoUrl}
              alt=""
              className="w-11 h-11 rounded-full object-cover"
            />
          )}
          <div>
            <h1 className="font-display font-extrabold text-xl">Olá, {primeiroNome}!</h1>
            <p className="text-sm text-sand-700">Que bom ter você por aqui</p>
          </div>
        </div>

        <div>
          <p className="text-xs font-bold text-sand-700 uppercase tracking-wide mb-2">
            Sua turma hoje
          </p>
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-xl bg-honey-100 p-3 text-center">
              <p className="font-display font-extrabold text-lg text-honey-800">2</p>
              <p className="text-[10px] text-honey-800/80">missões em andamento</p>
            </div>
            <div className="rounded-xl bg-leaf-100 p-3 text-center">
              <p className="font-display font-extrabold text-lg text-leaf-800">{alunoProfile.missionsCompleted ?? 0}</p>
              <p className="text-[10px] text-leaf-800/80">missões concluídas</p>
            </div>
            <div className="rounded-xl bg-sand-100 p-3 text-center">
              <p className="font-display font-extrabold text-lg text-sand-800">{alunoProfile.favosSaldo ?? 0}</p>
              <p className="text-[10px] text-sand-700">favos em carteira</p>
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs font-bold text-sand-700 uppercase tracking-wide mb-2">
            Próximas entregas
          </p>
          <div className="rounded-xl border border-sand-200 p-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">Água que a escola usa</p>
              <p className="text-xs text-sand-600">8º ano B</p>
            </div>
            <p className="text-xs font-bold text-honey-700">24 SET</p>
          </div>
        </div>
      </div>
    </Shell>
  );
}
