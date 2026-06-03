import { createBrowserRouter } from "react-router";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";

// Aluno pages
import AlunoDashboard from "./pages/aluno/Dashboard";
import AlunoProjetos from "./pages/aluno/Projetos";
import AlunoSubmeter from "./pages/aluno/Submeter";
import ProjetoDetalhes from "./pages/aluno/ProjetoDetalhes";
import EditarProjeto from "./pages/aluno/EditarProjeto.tsx";

// Professor pages
import ProfessorDashboard from "./pages/professor/Dashboard";
import ProfessorProjetos from "./pages/professor/Projetos";
import AvaliarProjeto from "./pages/professor/Avaliar";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsuarios from "./pages/admin/Usuarios";
import AdminProjetos from "./pages/admin/Projetos";

// Shared pages
import Perfil from "./pages/shared/Perfil";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Login,
  },
  {
    path: "/cadastro",
    Component: Cadastro,
  },
  // Aluno routes
  {
    path: "/aluno/dashboard",
    Component: AlunoDashboard,
  },
  {
    path: "/aluno/projetos",
    Component: AlunoProjetos,
  },
  {
    path: "/aluno/projetos/:id",
    Component: ProjetoDetalhes,
  },
  {
    path: "/aluno/submeter",
    Component: AlunoSubmeter,
  },
  {
    path: "/aluno/projetos/:id/editar",
    Component: EditarProjeto,
  },
  {
    path: "/aluno/perfil",
    Component: () => <Perfil userType="aluno" />,
  },
  // Professor routes
  {
    path: "/professor/dashboard",
    Component: ProfessorDashboard,
  },
  {
    path: "/professor/projetos",
    Component: ProfessorProjetos,
  },
  {
    path: "/professor/avaliacoes",
    Component: ProfessorProjetos, // Temporary - same as projetos
  },
  {
    path: "/professor/avaliacoes/:id",
    Component: AvaliarProjeto, // Temporary - will create specific evaluation page
  },
  {
    path: "/professor/perfil",
    Component: () => <Perfil userType="professor" />,
  },
  // Admin routes
  {
    path: "/admin/dashboard",
    Component: AdminDashboard,
  },
  {
    path: "/admin/projetos",
    Component: AdminProjetos, // Reusing professor projects view
  },
  {
    path: "/admin/usuarios",
    Component: AdminUsuarios,
  },
  {
    path: "/admin/perfil",
    Component: () => <Perfil userType="admin" />,
  },
  // 404
  {
    path: "*",
    Component: () => (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">404</h1>
          <p className="text-muted-foreground mb-6">Página não encontrada</p>
          <a href="/" className="text-primary hover:underline">
            Voltar para o login
          </a>
        </div>
      </div>
    ),
  },
]);