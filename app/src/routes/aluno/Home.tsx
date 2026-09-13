import { Shell } from "../../components/Shell";
import { useAppState } from "../../state/AppState";

export function AlunoHome() {
  const { alunoProfile } = useAppState();
  const primeiroNome = alunoProfile.nome.split(" ")[0] || "Colmeia";

  return (
    <Shell>
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-3">
          {alunoProfile.fotoUrl && (
            <img
              src={alunoProfile.fotoUrl}
              alt=""
              className="w-11 h-11 rounded-full object-cover"
            />
          )}
          <div>
            <h1 className="font-display font-extrabold text-xl">Olá, {primeiroNome}!</h1>
            <p className="text-sm text-sand-700">Vamos construir essa Colmeia juntos?</p>
          </div>
        </div>

        <div className="rounded-2xl bg-honey-100 p-4">
          <p className="font-display font-extrabold text-honey-800">
            Nossa escola está mais viva com você
          </p>
          <p className="text-sm text-honey-800/80 mt-1">
            5 pessoas · 6 missões · em colaboração agora
          </p>
        </div>

        <div>
          <p className="text-xs font-bold text-sand-700 uppercase tracking-wide mb-2">
            Atualizações
          </p>
          <div className="flex flex-col gap-2">
            <div className="rounded-xl border border-sand-200 p-3">
              <p className="text-sm font-semibold">Nova missão disponível</p>
              <p className="text-xs text-sand-600">18h atrás</p>
            </div>
            <div className="rounded-xl border border-sand-200 p-3">
              <p className="text-sm font-semibold">O livro novo da biblioteca</p>
              <p className="text-xs text-sand-600">
                Como apresentar um livro novo pra quem mais se interessar?
              </p>
            </div>
            <div className="rounded-xl border border-sand-200 p-3">
              <p className="text-sm font-semibold">Seu grupo precisa de você</p>
              <p className="text-xs text-sand-600">Horta na Escola</p>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
