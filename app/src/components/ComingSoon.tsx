import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowLeft } from "lucide-react";

export function ComingSoon({ titulo }: { titulo?: string }) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center text-center gap-3 py-16">
      <div className="w-16 h-16 rounded-full bg-honey-100 flex items-center justify-center">
        <Sparkles className="text-honey-600" size={28} />
      </div>
      <p className="font-display font-extrabold text-lg">{titulo ?? "Disponível em breve"}</p>
      <p className="text-sm text-sand-700 max-w-xs">
        Essa parte ainda não faz parte do MVP da Colmeia.
      </p>
      <button
        onClick={() => navigate(-1)}
        className="mt-2 flex items-center gap-1.5 text-sm font-bold text-honey-700"
      >
        <ArrowLeft size={16} /> Voltar
      </button>
    </div>
  );
}
