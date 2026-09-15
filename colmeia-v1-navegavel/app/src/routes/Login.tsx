import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BeeMark } from "../components/BeeMark";
import { useAppState } from "../state/AppState";
import type { Role } from "../types";

export function Login() {
  const { setRole, alunoProfile, mediadorProfile } = useAppState();
  const navigate = useNavigate();
  const [selecionado, setSelecionado] = useState<Role>("aluno");

  function entrar() {
    setRole(selecionado);
    const jaTemPerfil =
      selecionado === "aluno" ? !!alunoProfile.nome : !!mediadorProfile.nome;
    if (jaTemPerfil) {
      navigate(selecionado === "aluno" ? "/aluno/home" : "/mediador/home");
    } else {
      navigate(selecionado === "aluno" ? "/aluno/perfil" : "/mediador/perfil");
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-(--color-bg) px-6 gap-8">
      <div className="flex flex-col items-center gap-3 text-center">
        <BeeMark size={64} />
        <h1 className="font-display font-extrabold text-2xl text-honey-700">Colmeia</h1>
        <p className="text-sand-700 text-sm">Pequenas missões. Grandes conexões.</p>
      </div>

      <div className="w-full max-w-xs flex flex-col gap-4">
        <p className="text-sm font-semibold text-center">Escolha como acessar o Colmeia</p>
        <div className="flex gap-2">
          <button
            onClick={() => setSelecionado("aluno")}
            className={`flex-1 py-3 rounded-2xl font-bold text-sm border-2 transition-colors ${
              selecionado === "aluno"
                ? "bg-honey-500 border-honey-500 text-white"
                : "border-sand-300 text-sand-700"
            }`}
          >
            Aluno
          </button>
          <button
            onClick={() => setSelecionado("mediador")}
            className={`flex-1 py-3 rounded-2xl font-bold text-sm border-2 transition-colors ${
              selecionado === "mediador"
                ? "bg-honey-500 border-honey-500 text-white"
                : "border-sand-300 text-sand-700"
            }`}
          >
            Mediador
          </button>
        </div>

        <button
          onClick={entrar}
          className="w-full py-3.5 rounded-2xl bg-honey-500 hover:bg-honey-600 text-white font-bold text-sm transition-colors"
        >
          Entrar
        </button>
      </div>
    </div>
  );
}
