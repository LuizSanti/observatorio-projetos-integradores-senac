import { MainLayout } from "../../components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { FileText, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router";

const statsData = [
  { 
    label: "Total de Projetos", 
    value: "24", 
    icon: FileText, 
    color: "bg-[#1A3A6C]",
    trend: "para avaliar"
  },
  { 
    label: "Projetos Avaliados", 
    value: "18", 
    icon: CheckCircle, 
    color: "bg-[#2E7D32]",
    trend: "75% completo"
  },
  { 
    label: "Pendentes", 
    value: "6", 
    icon: Clock, 
    color: "bg-[#F9A825]",
    trend: "aguardando"
  },
  { 
    label: "Média Geral", 
    value: "8.5", 
    icon: AlertCircle, 
    color: "bg-[#F47920]",
    trend: "dos aprovados"
  },
];

const recentProjects = [
  {
    id: 4,
    grupo: "Grupo D - Bruno, Camila, Diego",
    titulo: "Sistema de Controle de Estoque",
    turma: "ADS 3º Semestre",
    status: "pendente",
    dataSubmissao: "14/04/2026",
  },
  {
    id: 2,
    grupo: "Grupo B - Ana, Carlos, Lucas",
    titulo: "App de Delivery Sustentável",
    turma: "ADS 4º Semestre",
    status: "pendente",
    dataSubmissao: "10/04/2026",
  },
  {
    id: 1,
    grupo: "Grupo A - João, Maria, Pedro",
    titulo: "Sistema de Gestão Escolar",
    turma: "ADS 4º Semestre",
    status: "avaliado",
    dataSubmissao: "15/03/2026",
    nota: 9.2,
  },
];

const statusConfig = {
  "avaliado": { label: "Avaliado", color: "bg-[#2E7D32] text-white" },
  "pendente": { label: "Pendente", color: "bg-[#F9A825] text-white" },
};

export default function ProfessorDashboard() {
  const navigate = useNavigate();

  return (
    <MainLayout 
      userType="professor" 
      userName="Carlos Silva" 
      userTypeLabel="Professor"
      notifications={3}
    >
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Bem-vindo de volta, Prof. Silva!</p>
        </div>

        {/* Stats Cards */}
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
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-2">{stat.trend}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Projetos Pendentes */}
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
                      <Badge className={statusConfig[project.status as keyof typeof statusConfig].color}>
                        {statusConfig[project.status as keyof typeof statusConfig].label}
                      </Badge>
                    </div>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>{project.grupo}</span>
                      <span>•</span>
                      <span>{project.turma}</span>
                      {project.nota && (
                        <>
                          <span>•</span>
                          <span className="text-[#2E7D32] font-semibold">Nota: {project.nota}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    {project.status === "pendente" ? "Avaliar" : "Ver Avaliação"}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-primary to-primary/80 text-white cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/professor/avaliacoes")}>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-2">Avaliar Projetos</h3>
              <p className="text-white/90 mb-4">6 projetos aguardando sua avaliação</p>
              <Button variant="secondary" className="bg-white text-primary hover:bg-white/90">
                Começar Avaliações
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-secondary to-secondary/80 text-white cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/professor/projetos")}>
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
