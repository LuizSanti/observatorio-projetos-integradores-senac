import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { MainLayout } from "../../components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { ArrowLeft, ExternalLink, Calendar, FileText } from "lucide-react";
import { Separator } from "../../components/ui/separator";
import { api } from "../../../services/api";

const statusConfig: Record<string, { label: string; color: string }> = {
  rascunho:     { label: "Rascunho",     color: "bg-[#6B6B6B] text-white" },
  submetido:    { label: "Submetido",    color: "bg-[#1565C0] text-white" },
  em_avaliacao: { label: "Em Avaliação", color: "bg-[#F9A825] text-white" },
  aprovado:     { label: "Aprovado",     color: "bg-[#2E7D32] text-white" },
};

interface Avaliacao {
  nota_apresentacao: number;
  nota_documentacao: number;
  nota_inovacao: number;
  nota_tecnica: number;
  nota_final: number;
  feedback: string;
  professor_nome: string;
  avaliado_em: string;
}

interface Projeto {
  id: number;
  titulo: string;
  descricao: string;
  turma: string;
  status: string;
  arquivo: string;
  link: string | null;
  criado_em: string;
  atualizado_em: string;
  avaliacao: Avaliacao | null;
}

export default function ProjetoDetalhes() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Projeto | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      const response = await api.get(`/api/projetos/${id}/`);
      if (response.ok) {
        const data = await response.json();
        setProject(data);
      } else {
        setNotFound(true);
      }
      setLoading(false);
    };
    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <MainLayout userType="aluno" userName="João Silva" userTypeLabel="Aluno" notifications={2}>
        <div className="p-8">
          <p className="text-muted-foreground">Carregando projeto...</p>
        </div>
      </MainLayout>
    );
  }

  if (notFound || !project) {
    return (
      <MainLayout userType="aluno" userName="João Silva" userTypeLabel="Aluno" notifications={2}>
        <div className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Projeto não encontrado</h2>
          <Button onClick={() => navigate("/aluno/projetos")}>Voltar para Projetos</Button>
        </div>
      </MainLayout>
    );
  }

  const criterios = project.avaliacao ? [
    { nome: "Apresentação",  nota: project.avaliacao.nota_apresentacao },
    { nome: "Documentação",  nota: project.avaliacao.nota_documentacao },
    { nome: "Inovação",      nota: project.avaliacao.nota_inovacao },
    { nome: "Técnica",       nota: project.avaliacao.nota_tecnica },
  ] : [];

  return (
    <MainLayout userType="aluno" userName="João Silva" userTypeLabel="Aluno" notifications={2}>
      <div className="p-8">
        <Button variant="ghost" className="mb-6 gap-2" onClick={() => navigate("/aluno/projetos")}>
          <ArrowLeft className="w-4 h-4" />
          Voltar para Projetos
        </Button>

        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-foreground">{project.titulo}</h1>
              <Badge className={statusConfig[project.status]?.color}>
                {statusConfig[project.status]?.label}
              </Badge>
            </div>
            <p className="text-muted-foreground">{project.turma}</p>
          </div>
          {project.avaliacao?.nota_final && (
            <Card className="bg-[#2E7D32] text-white">
              <CardContent className="p-4 text-center">
                <p className="text-sm opacity-90 mb-1">Nota Final</p>
                <p className="text-3xl font-bold">{project.avaliacao.nota_final}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Descrição do Projeto</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed">{project.descricao}</p>
              </CardContent>
            </Card>

            {project.avaliacao && (
              <Card>
                <CardHeader>
                  <CardTitle>Avaliação</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-4">Critérios de Avaliação</h4>
                    <div className="space-y-3">
                      {criterios.map((criterio, index) => (
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

                  <div>
                    <h4 className="font-semibold mb-3">Feedback do Professor</h4>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm leading-relaxed">{project.avaliacao.feedback}</p>
                    </div>
                    <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                      <span>{project.avaliacao.professor_nome || "Professor"}</span>
                      <span>•</span>
                      <span>Avaliado em {new Date(project.avaliacao.avaliado_em).toLocaleDateString("pt-BR")}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Submetido em</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(project.criado_em).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Última atualização</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(project.atualizado_em).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Arquivos e Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {project.arquivo && (
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3"
                    onClick={() => window.open(`http://127.0.0.1:8000${project.arquivo}`, "_blank")}
                  >
                    <FileText className="w-4 h-4" />
                    <span className="flex-1 text-left">Arquivo PDF</span>
                  </Button>
                )}
                {project.link && (
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3"
                    onClick={() => window.open(project.link!, "_blank")}
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span className="flex-1 text-left">Link do Projeto</span>
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