import { Navigate } from "react-router";
import { auth } from "../../services/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  // Perfis permitidos para esta rota. Ex: ["professor"] ou ["admin"]
  // Se não passar, só verifica se está autenticado
  allowedPerfis?: string[];
}

export function ProtectedRoute({ children, allowedPerfis }: ProtectedRouteProps) {
  // Verificação 1: está logado?
  if (!auth.isAuthenticated()) {
    // Redireciona para login sem histórico — evita voltar com o botão "voltar"
    return <Navigate to="/" replace />;
  }

  // Verificação 2: tem o perfil certo para esta rota?
  if (allowedPerfis && allowedPerfis.length > 0) {
    const perfil = auth.getPerfil();
    if (!perfil || !allowedPerfis.includes(perfil)) {
      // Está logado mas no lugar errado — redireciona para o login
      // O login vai redirecionar para o dashboard correto do perfil real
      return <Navigate to="/" replace />;
    }
  }

  // Passou nas duas verificações — renderiza a página
  return <>{children}</>;
}