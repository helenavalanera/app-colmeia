import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppStateProvider } from "./state/AppState";
import { ComingSoon } from "./components/ComingSoon";
import { Login } from "./routes/Login";
import { AlunoPerfil } from "./routes/aluno/Perfil";
import { AlunoHome } from "./routes/aluno/Home";
import { MediadorPerfil } from "./routes/mediador/Perfil";
import { MediadorHome } from "./routes/mediador/Home";

export default function App() {
  return (
    <AppStateProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Login />} />

          {/* Aluno */}
          <Route path="/aluno/perfil" element={<AlunoPerfil />} />
          <Route path="/aluno/home" element={<AlunoHome />} />
          <Route path="/aluno/missoes" element={<ComingSoon titulo="Missões" />} />
          <Route path="/aluno/comunidade" element={<ComingSoon titulo="Comunidade" />} />

          {/* Mediador */}
          <Route path="/mediador/perfil" element={<MediadorPerfil />} />
          <Route path="/mediador/home" element={<MediadorHome />} />
          <Route path="/mediador/relatorio" element={<ComingSoon titulo="Relatório" />} />
          <Route path="/mediador/missoes" element={<ComingSoon titulo="Missões" />} />
          <Route path="/mediador/comunidade" element={<ComingSoon titulo="Comunidade" />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AppStateProvider>
  );
}
