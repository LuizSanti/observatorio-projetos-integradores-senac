import { useParams, useNavigate } from "react-router";
import { MainLayout } from "../../components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { ArrowLeft, Download, ExternalLink, Calendar, User, FileText } from "lucide-react";
import { Separator } from "../../components/ui/separator";

// Mock data - na vida real viria de uma API
const projectDetails: { [key: string]: any } = {
  "1": {
    id: 1,
    title: "Sistema de Gestão Escolar",
    turma: "ADS 4º Semestre",
    status: "aprovado",
    dataSubmissao: "15/03/2026",
    nota: 9.2,
    descricao: "Sistema completo de gestão escolar desenvolvido com tecnologias modernas. O projeto inclui módulos de matrícula, controle de notas, frequência de alunos, e gestão de professores e turmas. Foi utilizado React no frontend e Node.js com Express no backend.",
    grupo: ["João Silva", "Maria Santos", "Pedro Oliveira"],
    linkGithub: "https://github.com/exemplo/projeto",
    arquivo: "sistema-gestao-escolar.pdf",
    avaliacao: {
      criterios: [
        { nome: "Qualidade do Código", nota: 9.0 },
        { nome: "Documentação", nota: 9.5 },
        { nome: "Funcionalidades", nota: 9.0 },
        { nome: "Interface do Usuário", nota: 9.2 },
        { nome: "Inovação", nota: 9.3 },
      ],
      feedback: "Excelente trabalho! O projeto demonstra domínio das tecnologias utilizadas e apresenta uma solução completa e bem estruturada. A documentação está muito bem feita. Parabéns!",
      professor: "Prof. Carlos Silva",
      dataAvaliacao: "22/03/2026",
    },
  },
  "2": {
    id: 2,
    title: "App de Delivery Sustentável",
    turma: "ADS 4º Semestre",
    status: "em-avaliacao",
    dataSubmissao: "10/04/2026",
    descricao: "Aplicativo mobile para delivery com foco em sustentabilidade. O app conecta usuários a restaurantes que utilizam embalagens sustentáveis e práticas ecológicas.",
    grupo: ["João Silva", "Ana Costa"],
    linkGithub: "https://github.com/exemplo/delivery-app",
    arquivo: "app-delivery-sustentavel.pdf",
  },
};

const statusConfig = {
  "aprovado": { label: "Aprovado", color: "bg-[#2E7D32] text-white" },
  "em-avaliacao": { label: "Em Avaliação", color: "bg-[#F9A825] text-white" },
  "pendente": { label: "Pendente", color: "bg-[#6B6B6B] text-white" },
};

export default function ProjetoDetalhes() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const project = id ? projectDetails[id] : null;

  if (!project) {
    return (
      <MainLayout userType="aluno" userName="João Silva" userTypeLabel="Aluno" notifications={2}>
        <div className="p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Projeto não encontrado</h2>
            <Button onClick={() => navigate("/aluno/projetos")}>Voltar para Projetos</Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout 
      userType="aluno" 
      userName="João Silva" 
      userTypeLabel="Aluno"
      notifications={2}
    >
      <div className="p-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="mb-6 gap-2"
          onClick={() => navigate("/aluno/projetos")}
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Projetos
        </Button>

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-foreground">{project.title}</h1>
              <Badge className={statusConfig[project.status as keyof typeof statusConfig].color}>
                {statusConfig[project.status as keyof typeof statusConfig].label}
              </Badge>
            </div>
            <p className="text-muted-foreground">{project.turma}</p>
          </div>
          {project.nota && (
            <Card className="bg-[#2E7D32] text-white">
              <CardContent className="p-4 text-center">
                <p className="text-sm opacity-90 mb-1">Nota Final</p>
                <p className="text-3xl font-bold">{project.nota}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Descrição */}
            <Card>
              <CardHeader>
                <CardTitle>Descrição do Projeto</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed">{project.descricao}</p>
              </CardContent>
            </Card>

            {/* Avaliação */}
            {project.avaliacao && (
              <Card>
                <CardHeader>
                  <CardTitle>Avaliação</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Critérios */}
                  <div>
                    <h4 className="font-semibold mb-4">Critérios de Avaliação</h4>
                    <div className="space-y-3">
                      {project.avaliacao.criterios.map((criterio: any, index: number) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm">{criterio.nome}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-[#2E7D32]"
                                style={{ width: `${(criterio.nota / 10) * 100}%` }}
                              />
                            </div>
                            <span className="font-semibold text-sm w-8 text-right">{criterio.nota}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Feedback */}
                  <div>
                    <h4 className="font-semibold mb-3">Feedback do Professor</h4>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm leading-relaxed">{project.avaliacao.feedback}</p>
                    </div>
                    <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                      <span>{project.avaliacao.professor}</span>
                      <span>•</span>
                      <span>Avaliado em {project.avaliacao.dataAvaliacao}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Informações */}
            <Card>
              <CardHeader>
                <CardTitle>Informações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Data de Submissão</p>
                    <p className="text-sm text-muted-foreground">{project.dataSubmissao}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium mb-2">Grupo</p>
                    <div className="space-y-1">
                      {project.grupo.map((membro: string, index: number) => (
                        <p key={index} className="text-sm text-muted-foreground">{membro}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Arquivos */}
            <Card>
              <CardHeader>
                <CardTitle>Arquivos e Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start gap-3">
                  <FileText className="w-4 h-4" />
                  <span className="flex-1 text-left truncate">{project.arquivo}</span>
                  <Download className="w-4 h-4" />
                </Button>

                {project.linkGithub && (
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-3"
                    onClick={() => window.open(project.linkGithub, "_blank")}
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span className="flex-1 text-left">GitHub</span>
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
