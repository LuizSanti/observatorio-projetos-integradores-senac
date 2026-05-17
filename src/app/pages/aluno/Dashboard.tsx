import { useState, useEffect } from "react";
import { MainLayout } from "../../components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { FileText, CheckCircle, Clock, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router";
import { api } from "../../../services/api";

const statusConfig: Record<string, { label: string; color: string }> = {
  rascunho:     { label: "Rascunho",     color: "bg-[#6B6B6B] text-white" },
  submetido:    { label: "Submetido",    color: "bg-[#1565C0] text-white" },
  em_avaliacao: { label: "Em Avaliação", color: "bg-[#F9A825] text-white" },
  aprovado:     { label: "Aprovado",     color: "bg-[#2E7D32] text-white" },
};

interface Projeto {
  id: number;
  titulo: string;
  turma: string;
  status: string;
  criado_em: string;
  avaliacao: { nota_final: number } | null;
}

export default function AlunoDashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Projeto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      const response = await api.get("/api/projetos/");
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
      setLoading(false);
    };
    fetchProjects();
  }, []);

  const total = projects.length;
  const aprovados = projects.filter(p => p.status === "aprovado").length;
  const emAvaliacao = projects.filter(p => p.status === "em_avaliacao").length;
  const pendentes = projects.filter(p => p.status === "rascunho" || p.status === "submetido").length;

  const statsData = [
    { label: "Total de Projetos",   value: total,       icon: FileText,   color: "bg-[#1A3A6C]", trend: "projetos enviados" },
    { label: "Projetos Aprovados",  value: aprovados,   icon: CheckCircle,color: "bg-[#2E7D32]", trend: total > 0 ? `${Math.round((aprovados/total)*100)}% aprovação` : "0% aprovação" },
    { label: "Em Avaliação",        value: emAvaliacao, icon: Clock,       color: "bg-[#F9A825]", trend: "Aguardando" },
    { label: "Pendentes",           value: pendentes,   icon: TrendingUp,  color: "bg-[#6B6B6B]", trend: "Revisar" },
  ];

  const recentProjects = projects.slice(0, 3);

  return (
    <MainLayout
      userType="aluno"
      userName="João Silva"
      userTypeLabel="Aluno"
      notifications={2}
    >
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Bem-vindo de volta!</p>
        </div>

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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Projetos Recentes</CardTitle>
            <Button variant="outline" size="sm" onClick={() => navigate("/aluno/projetos")}>
              Ver Todos
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-muted-foreground text-sm">Carregando...</p>
            ) : recentProjects.length > 0 ? (
              <div className="space-y-4">
                {recentProjects.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/aluno/projetos/${project.id}`)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold">{project.titulo}</h4>
                        <Badge className={statusConfig[project.status]?.color}>
                          {statusConfig[project.status]?.label}
                        </Badge>
                      </div>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>{project.turma}</span>
                        <span>•</span>
                        <span>Submetido em {new Date(project.criado_em).toLocaleDateString("pt-BR")}</span>
                        {project.avaliacao?.nota_final && (
                          <>
                            <span>•</span>
                            <span className="text-[#2E7D32] font-semibold">
                              Nota: {project.avaliacao.nota_final}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Ver Detalhes</Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">Nenhum projeto enviado ainda.</p>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card
            className="bg-gradient-to-br from-primary to-primary/80 text-white cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate("/aluno/submeter")}
          >
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-2">Submeter Novo Projeto</h3>
              <p className="text-white/90 mb-4">Envie seu projeto integrador para avaliação</p>
              <Button variant="secondary" className="bg-white text-primary hover:bg-white/90">
                Começar Agora
              </Button>
            </CardContent>
          </Card>

          <Card
            className="bg-gradient-to-br from-secondary to-secondary/80 text-white cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate("/aluno/projetos")}
          >
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-2">Meus Projetos</h3>
              <p className="text-white/90 mb-4">Acompanhe o status de todos os seus projetos</p>
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