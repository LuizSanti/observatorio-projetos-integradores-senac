import { createBrowserRouter } from "react-router";
import { ProtectedRoute } from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";

// Aluno pages
import AlunoDashboard   from "./pages/aluno/Dashboard";
import AlunoProjetos    from "./pages/aluno/Projetos";
import AlunoSubmeter    from "./pages/aluno/Submeter";
import ProjetoDetalhes  from "./pages/aluno/ProjetoDetalhes";
import EditarProjeto    from "./pages/aluno/EditarProjeto.tsx";

// Professor pages
import ProfessorDashboard from "./pages/professor/Dashboard";
import ProfessorProjetos  from "./pages/professor/Projetos";
import AvaliarProjeto     from "./pages/professor/Avaliar";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsuarios  from "./pages/admin/Usuarios";
import AdminProjetos  from "./pages/admin/Projetos";

// Shared pages
import Perfil from "./pages/shared/Perfil";

export const router = createBrowserRouter([

  // ── Rotas públicas ────────────────────────────────────────────
  // Acessíveis sem login — não envolver com ProtectedRoute
  {
    path: "/",
    Component: Login,
  },
  {
    path: "/cadastro",
    Component: Cadastro,
  },

  // ── Rotas do Aluno ────────────────────────────────────────────
  {
    path: "/aluno/dashboard",
    element: (
      <ProtectedRoute allowedPerfis={["aluno"]}>
        <AlunoDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/aluno/projetos",
    element: (
      <ProtectedRoute allowedPerfis={["aluno"]}>
        <AlunoProjetos />
      </ProtectedRoute>
    ),
  },
  {
    path: "/aluno/projetos/:id",
    element: (
      <ProtectedRoute allowedPerfis={["aluno"]}>
        <ProjetoDetalhes />
      </ProtectedRoute>
    ),
  },
  {
    path: "/aluno/projetos/:id/editar",
    element: (
      <ProtectedRoute allowedPerfis={["aluno"]}>
        <EditarProjeto />
      </ProtectedRoute>
    ),
  },
  {
    path: "/aluno/submeter",
    element: (
      <ProtectedRoute allowedPerfis={["aluno"]}>
        <AlunoSubmeter />
      </ProtectedRoute>
    ),
  },
  {
    path: "/aluno/perfil",
    element: (
      <ProtectedRoute allowedPerfis={["aluno"]}>
        <Perfil userType="aluno" />
      </ProtectedRoute>
    ),
  },

  // ── Rotas do Professor ────────────────────────────────────────
  {
    path: "/professor/dashboard",
    element: (
      <ProtectedRoute allowedPerfis={["professor"]}>
        <ProfessorDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/professor/projetos",
    element: (
      <ProtectedRoute allowedPerfis={["professor"]}>
        <ProfessorProjetos />
      </ProtectedRoute>
    ),
  },
  {
    // /professor/avaliacoes sem ID → lista de projetos para avaliar
    // Reutiliza ProfessorProjetos propositalmente (mesmo comportamento)
    path: "/professor/avaliacoes",
    element: (
      <ProtectedRoute allowedPerfis={["professor"]}>
        <ProfessorProjetos />
      </ProtectedRoute>
    ),
  },
  {
    path: "/professor/avaliacoes/:id",
    element: (
      <ProtectedRoute allowedPerfis={["professor"]}>
        <AvaliarProjeto />
      </ProtectedRoute>
    ),
  },
  {
    path: "/professor/perfil",
    element: (
      <ProtectedRoute allowedPerfis={["professor"]}>
        <Perfil userType="professor" />
      </ProtectedRoute>
    ),
  },

  // ── Rotas do Admin ────────────────────────────────────────────
  {
    path: "/admin/dashboard",
    element: (
      <ProtectedRoute allowedPerfis={["admin"]}>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/projetos",
    element: (
      <ProtectedRoute allowedPerfis={["admin"]}>
        <AdminProjetos />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/usuarios",
    element: (
      <ProtectedRoute allowedPerfis={["admin"]}>
        <AdminUsuarios />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/perfil",
    element: (
      <ProtectedRoute allowedPerfis={["admin"]}>
        <Perfil userType="admin" />
      </ProtectedRoute>
    ),
  },

  // ── 404 ───────────────────────────────────────────────────────
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