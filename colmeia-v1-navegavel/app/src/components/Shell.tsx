import { type ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Home, ClipboardList, Users, User, BarChart3 } from "lucide-react";
import { BeeMark } from "./BeeMark";
import { useAppState } from "../state/AppState";

interface ShellProps {
  children: ReactNode;
  hideNav?: boolean;
}

const alunoNav = [
  { to: "/aluno/home", label: "Início", icon: Home },
  { to: "/aluno/missoes", label: "Missões", icon: ClipboardList },
  { to: "/aluno/comunidade", label: "Comunidade", icon: Users },
  { to: "/aluno/perfil", label: "Perfil", icon: User },
];

const mediadorNav = [
  { to: "/mediador/home", label: "Início", icon: Home },
  { to: "/mediador/relatorio", label: "Relatório", icon: BarChart3 },
  { to: "/mediador/missoes", label: "Missões", icon: ClipboardList },
  { to: "/mediador/comunidade", label: "Comunidade", icon: Users },
];

export function Shell({ children, hideNav = false }: ShellProps) {
  const { role, setRole } = useAppState();
  const navigate = useNavigate();
  const items = role === "mediador" ? mediadorNav : alunoNav;

  function trocarPapel(novo: "aluno" | "mediador") {
    setRole(novo);
    navigate(novo === "aluno" ? "/aluno/home" : "/mediador/home");
  }

  return (
    <div className="min-h-screen flex flex-col bg-(--color-bg)">
      <header className="flex items-center justify-between gap-3 px-4 py-3 border-b border-sand-200">
        <div className="flex items-center gap-2">
          <BeeMark size={32} />
          <div className="leading-tight">
            <p className="font-display font-extrabold text-honey-700 text-lg">Colmeia</p>
            <p className="text-[10px] text-sand-700">Ecossistema de Comunidades</p>
          </div>
        </div>
        {role && (
          <div className="flex items-center gap-1 bg-sand-100 rounded-full p-1">
            <button
              onClick={() => trocarPapel("aluno")}
              className={`text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${
                role === "aluno" ? "bg-honey-500 text-white" : "text-sand-700"
              }`}
            >
              Aluno
            </button>
            <button
              onClick={() => trocarPapel("mediador")}
              className={`text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${
                role === "mediador" ? "bg-honey-500 text-white" : "text-sand-700"
              }`}
            >
              Mediador
            </button>
          </div>
        )}
      </header>

      <main className="flex-1 px-4 py-4 pb-24 max-w-md mx-auto w-full">{children}</main>

      {!hideNav && role && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-sand-200 flex items-stretch justify-around max-w-md mx-auto w-full">
          {items.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-2.5 px-2 text-[10px] font-bold flex-1 ${
                  isActive ? "text-honey-600" : "text-sand-600"
                }`
              }
            >
              <Icon size={20} strokeWidth={2.4} />
              {label}
            </NavLink>
          ))}
        </nav>
      )}
    </div>
  );
}
