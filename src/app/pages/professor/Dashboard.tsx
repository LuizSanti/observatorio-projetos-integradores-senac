import { useState, useEffect } from "react";
import { MainLayout } from "../../components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { FileText, CheckCircle, Clock, BarChart2, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router";
import { api } from "../../../services/api";

const statusConfig: Record<string, { label: string; color: string }> = {
  rascunho:     { label: "Rascunho",     color: "bg-[#6B6B6B] text-white" },
  submetido:    { label: "Submetido",    color: "bg-[#1565C0] text-white" },
  em_avaliacao: { label: "Em Avaliação", color: "bg-[#F9A825] text-white" },
  aprovado:     { label: "Aprovado",     color: "bg-[#2E7D32] text-white" },
};

interface Avaliacao {
  nota_final: number;
}

interface Projeto {
  id: number;
  titulo: string;
  turma: string;
  status: string;
  criado_em: string;
  autor_nome: string;  // vem de autor.get_full_name no serializer
  avaliacao: Avaliacao | null;
}

export default function ProfessorDashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Projeto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);  // ← NOVO

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get("/api/projetos/");
        if (response.ok) {
          const data = await response.json();
          setProjects(data);
        } else if (response.status === 401) {
          // Token expirado — redireciona para login
          navigate("/");
        } else {
          setError("Não foi possível carregar os projetos.");
        }
      } catch {
        // Erro de rede (API fora do ar, sem internet)
        setError("Erro de conexão. Verifique sua internet.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [navigate]);

  // ── Estatísticas ────────────────────────────────────────────────
  const total = projects.length;

  const avaliados = projects.filter(p => p.avaliacao !== null).length;

  // Pendentes = submetidos ou em_avaliacao que ainda não têm avaliação
  // Rascunhos são ignorados — o aluno ainda não enviou para avaliação
  const pendentes = projects.filter(
    p => p.avaliacao === null &&
         (p.status === "submetido" || p.status === "em_avaliacao")
  ).length;

  const notasFinais = projects
    .filter(p => p.avaliacao?.nota_final != null)
    .map(p => Number(p.avaliacao!.nota_final));

  const media = notasFinais.length > 0
    ? (notasFinais.reduce((a, b) => a + b, 0) / notasFinais.length).toFixed(1)
    : "—";

  const statsData = [
    {
      label: "Total de Projetos",
      value: total,
      icon: FileText,
      color: "bg-[#1A3A6C]",
      trend: "recebidos",
    },
    {
      label: "Projetos Avaliados",
      value: avaliados,
      icon: CheckCircle,
      color: "bg-[#2E7D32]",
      trend: total > 0 ? `${Math.round((avaliados / total) * 100)}% completo` : "0% completo",
    },
    {
      label: "Pendentes",
      value: pendentes,
      icon: Clock,
      color: "bg-[#F9A825]",
      trend: "aguardando avaliação",
    },
    {
      label: "Média Geral",
      value: media,
      icon: BarChart2,
      color: "bg-[#F47920]",
      trend: "dos projetos avaliados",
    },
  ];

  // Os 3 projetos mais recentes para o card de preview
  const recentProjects = projects.slice(0, 3);

  // ── Helpers ─────────────────────────────────────────────────────
  // get_full_name retorna "" se first_name e last_name não estiverem preenchidos
  const displayName = (nome: string) => nome?.trim() || "Aluno sem nome";

  // ── Render ──────────────────────────────────────────────────────
  return (
    <MainLayout
      userType="professor"
      userName={localStorage.getItem("username") || "Professor"}
      userTypeLabel="Professor"
      notifications={pendentes}
    >
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Bem-vindo de volta!</p>
        </div>

        {/* Erro de carregamento */}
        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Cards de estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsData.map((stat, index) => (
            <Card key={index} className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-foreground">
                    {loading ? "..." : stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">{stat.trend}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Projetos recentes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Projetos Recentes</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/professor/projetos")}
            >
              Ver Todos
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-muted-foreground text-sm">Carregando...</p>
            ) : error ? null : recentProjects.length > 0 ? (
              <div className="space-y-4">
                {recentProjects.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/professor/avaliacoes/${project.id}`)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold">{project.titulo}</h4>
                        <Badge className={statusConfig[project.status]?.color}>
                          {statusConfig[project.status]?.label}
                        </Badge>
                      </div>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>{displayName(project.autor_nome)}</span>
                        <span>•</span>
                        <span>{project.turma}</span>
                        {project.avaliacao?.nota_final != null && (
                          <>
                            <span>•</span>
                            <span className="text-[#2E7D32] font-semibold">
                              Nota: {project.avaliacao.nota_final}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      {project.avaliacao ? "Ver Avaliação" : "Avaliar"}
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">Nenhum projeto encontrado.</p>
            )}
          </CardContent>
        </Card>

        {/* Atalhos */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card
            className="bg-gradient-to-br from-primary to-primary/80 text-white cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate("/professor/avaliacoes")}
          >
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-2">Avaliar Projetos</h3>
              <p className="text-white/90 mb-4">
                {pendentes > 0
                  ? `${pendentes} projeto${pendentes > 1 ? "s" : ""} aguardando avaliação`
                  : "Nenhum projeto pendente"}
              </p>
              <Button
                variant="secondary"
                className="bg-white text-primary hover:bg-white/90"
                disabled={pendentes === 0}
              >
                Começar Avaliações
              </Button>
            </CardContent>
          </Card>

          <Card
            className="bg-gradient-to-br from-secondary to-secondary/80 text-white cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate("/professor/projetos")}
          >
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-2">Todos os Projetos</h3>
              <p className="text-white/90 mb-4">Visualize todos os projetos submetidos</p>
              <Button variant="secondary" className="bg-white text-secondary hover:bg-white/90">
                Ver Projetos
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}