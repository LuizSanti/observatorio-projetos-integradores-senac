import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { MainLayout } from "../../components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { EmptyState } from "../../components/shared/EmptyState";
import { FolderOpen, Eye, Trash2, Pencil } from "lucide-react";
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
  descricao: string;
  turma: string;
  status: string;
  criado_em: string;
}

export default function AlunoProjects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Projeto[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    const response = await api.get("/api/projetos/");
    if (response.ok) {
      const data = await response.json();
      setProjects(data);
    }
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este projeto?")) return;
    const response = await api.delete(`/api/projetos/${id}/`);
    if (response.ok) {
      setProjects(projects.filter((p) => p.id !== id));
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <MainLayout
      userType="aluno"
      userName="João Silva"
      userTypeLabel="Aluno"
      notifications={2}
    >
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Meus Projetos</h1>
            <p className="text-muted-foreground mt-1">Gerencie e acompanhe seus projetos integradores</p>
          </div>
          <Button
            onClick={() => navigate("/aluno/submeter")}
            className="bg-secondary hover:bg-secondary/90"
          >
            Submeter Novo Projeto
          </Button>
        </div>

        {loading ? (
          <p className="text-muted-foreground">Carregando projetos...</p>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-lg">{project.titulo}</CardTitle>
                    <Badge className={statusConfig[project.status]?.color}>
                      {statusConfig[project.status]?.label}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{project.descricao}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Turma:</span>
                      <span className="font-medium">{project.turma}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Submetido em:</span>
                      <span className="font-medium">
                        {new Date(project.criado_em).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
  <Button
    variant="outline"
    className="flex-1 gap-2"
    onClick={() => navigate(`/aluno/projetos/${project.id}`)}
  >
    <Eye className="w-4 h-4" />
    Ver
  </Button>
  {(project.status === "rascunho" || project.status === "submetido") && (
  <Button
    variant="outline"
    className="gap-2 text-primary hover:text-primary"
    onClick={() => navigate(`/aluno/projetos/${project.id}/editar`)}
    >
    <Pencil className="w-4 h-4" />
    </Button>
    )}
    <Button
    variant="outline"
    className="gap-2 text-destructive hover:text-destructive"
    onClick={() => handleDelete(project.id)}
  >
    <Trash2 className="w-4 h-4" />
  </Button>
</div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8">
              <EmptyState
                icon={<FolderOpen className="w-8 h-8" />}
                title="Nenhum projeto enviado ainda"
                description="Você ainda não submeteu nenhum projeto."
                actionLabel="Submeter Projeto"
                onAction={() => navigate("/aluno/submeter")}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}