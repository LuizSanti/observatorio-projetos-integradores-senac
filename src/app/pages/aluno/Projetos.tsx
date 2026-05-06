import { useState } from "react";
import { useNavigate } from "react-router";
import { MainLayout } from "../../components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { EmptyState } from "../../components/shared/EmptyState";
import { FolderOpen, Eye } from "lucide-react";

const mockProjects = [
  {
    id: 1,
    title: "Sistema de Gestão Escolar",
    turma: "ADS 4º Semestre",
    status: "aprovado",
    dataSubmissao: "15/03/2026",
    nota: 9.2,
    descricao: "Sistema completo de gestão escolar com módulos de matrícula, notas e frequência",
  },
  {
    id: 2,
    title: "App de Delivery Sustentável",
    turma: "ADS 4º Semestre",
    status: "em-avaliacao",
    dataSubmissao: "10/04/2026",
    descricao: "Aplicativo mobile para delivery com foco em sustentabilidade",
  },
  {
    id: 3,
    title: "Plataforma de E-learning",
    turma: "ADS 3º Semestre",
    status: "pendente",
    dataSubmissao: "05/04/2026",
    descricao: "Plataforma web para cursos online com videoaulas e exercícios",
  },
];

const statusConfig = {
  "aprovado": { label: "Aprovado", color: "bg-[#2E7D32] text-white" },
  "em-avaliacao": { label: "Em Avaliação", color: "bg-[#F9A825] text-white" },
  "pendente": { label: "Pendente", color: "bg-[#6B6B6B] text-white" },
};

export default function AlunoProjects() {
  const navigate = useNavigate();
  const [projects] = useState(mockProjects);

  return (
    <MainLayout 
      userType="aluno" 
      userName="João Silva" 
      userTypeLabel="Aluno"
      notifications={2}
    >
      <div className="p-8">
        {/* Header */}
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

        {/* Projects Grid */}
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                    <Badge className={statusConfig[project.status as keyof typeof statusConfig].color}>
                      {statusConfig[project.status as keyof typeof statusConfig].label}
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
                      <span className="font-medium">{project.dataSubmissao}</span>
                    </div>
                    {project.nota && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Nota:</span>
                        <span className="font-semibold text-[#2E7D32]">{project.nota}</span>
                      </div>
                    )}
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full gap-2"
                    onClick={() => navigate(`/aluno/projetos/${project.id}`)}
                  >
                    <Eye className="w-4 h-4" />
                    Ver Detalhes
                  </Button>
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
                description="Você ainda não submeteu nenhum projeto. Clique no botão abaixo para enviar seu primeiro projeto integrador."
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
