import { useRef, useState } from "react";
import { Camera, X } from "lucide-react";

interface PhotoUploadProps {
  value: string | null;
  onChange: (dataUrl: string | null) => void;
  shape?: "circle" | "square";
  size?: number;
  label?: string;
}

export function PhotoUpload({
  value,
  onChange,
  shape = "circle",
  size = 96,
  label = "Adicionar foto",
}: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [erro, setErro] = useState<string | null>(null);

  function handleFile(file: File | undefined) {
    setErro(null);
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErro("Escolha um arquivo de imagem.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErro("Imagem muito grande (máx. 5MB).");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  }

  const radius = shape === "circle" ? "9999px" : "var(--radius, 20px)";

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        style={{ width: size, height: size, borderRadius: radius }}
        className="relative flex items-center justify-center overflow-hidden bg-sand-100 border-2 border-dashed border-sand-300 hover:border-honey-500 transition-colors"
        aria-label={label}
      >
        {value ? (
          <img src={value} alt="" className="w-full h-full object-cover" />
        ) : (
          <Camera className="text-sand-600" size={size * 0.35} />
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="user"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="text-xs font-semibold text-honey-700"
        >
          {value ? "Trocar foto" : label}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-xs text-sand-600 flex items-center gap-0.5"
          >
            <X size={12} /> remover
          </button>
        )}
      </div>
      {erro && <p className="text-xs text-red-600">{erro}</p>}
    </div>
  );
}
