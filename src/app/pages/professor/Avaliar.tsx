import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { MainLayout } from "../../components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Separator } from "../../components/ui/separator";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { ArrowLeft, Download, ExternalLink, FileText, CheckCircle, Loader2 } from "lucide-react";

const projectDetails: { [key: string]: any } = {
  "1": {
    id: 1,
    title: "Sistema de Gestão Escolar",
    turma: "ADS 4º Semestre",
    grupo: ["João Silva", "Maria Santos", "Pedro Oliveira"],
    dataSubmissao: "15/03/2026",
    descricao: "Sistema completo de gestão escolar desenvolvido com tecnologias modernas. O projeto inclui módulos de matrícula, controle de notas, frequência de alunos, e gestão de professores e turmas.",
    linkGithub: "https://github.com/exemplo/projeto",
    arquivo: "sistema-gestao-escolar.pdf",
    status: "avaliado",
    nota: 9.2,
  },
  "2": {
    id: 2,
    title: "App de Delivery Sustentável",
    turma: "ADS 4º Semestre",
    grupo: ["Ana Costa", "Carlos Lima"],
    dataSubmissao: "10/04/2026",
    descricao: "Aplicativo mobile para delivery com foco em sustentabilidade. O app conecta usuários a restaurantes que utilizam embalagens sustentáveis e práticas ecológicas.",
    linkGithub: "https://github.com/exemplo/delivery-app",
    arquivo: "app-delivery-sustentavel.pdf",
    status: "pendente",
  },
};

const criterios = [
  { id: 1, nome: "Qualidade do Código", peso: 1 },
  { id: 2, nome: "Documentação", peso: 1 },
  { id: 3, nome: "Funcionalidades", peso: 1 },
  { id: 4, nome: "Interface do Usuário", peso: 1 },
  { id: 5, nome: "Inovação", peso: 1 },
];

export default function AvaliarProjeto() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [notas, setNotas] = useState<{ [key: number]: number }>({});
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const project = id ? projectDetails[id] : null;

  if (!project) {
    return (
      <MainLayout userType="professor" userName="Carlos Silva" userTypeLabel="Professor" notifications={3}>
        <div className="p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Projeto não encontrado</h2>
            <Button onClick={() => navigate("/professor/projetos")}>Voltar para Projetos</Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const handleNotaChange = (criterioId: number, value: string) => {
    const nota = parseFloat(value);
    if (!isNaN(nota) && nota >= 0 && nota <= 10) {
      setNotas({ ...notas, [criterioId]: nota });
    } else if (value === "") {
      const newNotas = { ...notas };
      delete newNotas[criterioId];
      setNotas(newNotas);
    }
  };

  const calcularMedia = () => {
    const valores = Object.values(notas);
    if (valores.length === 0) return 0;
    const soma = valores.reduce((acc, val) => acc + val, 0);
    return (soma / valores.length).toFixed(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setShowSuccess(true);

    // Redirect after success
    setTimeout(() => {
      navigate("/professor/projetos");
    }, 2000);
  };

  const isFormValid = Object.keys(notas).length === criterios.length && feedback.trim().length > 0;

  return (
    <MainLayout 
      userType="professor" 
      userName="Carlos Silva" 
      userTypeLabel="Professor"
      notifications={3}
    >
      <div className="p-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="mb-6 gap-2"
          onClick={() => navigate("/professor/projetos")}
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Projetos
        </Button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-foreground">{project.title}</h1>
            <Badge className={project.status === "avaliado" ? "bg-[#2E7D32] text-white" : "bg-[#F9A825] text-white"}>
              {project.status === "avaliado" ? "Avaliado" : "Pendente"}
            </Badge>
          </div>
          <p className="text-muted-foreground">{project.turma}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar - Project Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Projeto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Grupo</p>
                  <div className="space-y-1">
                    {project.grupo.map((membro: string, index: number) => (
                      <p key={index} className="text-sm text-muted-foreground">{membro}</p>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-medium mb-1">Data de Submissão</p>
                  <p className="text-sm text-muted-foreground">{project.dataSubmissao}</p>
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-medium mb-3">Arquivos e Links</p>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start gap-3" size="sm">
                      <FileText className="w-4 h-4" />
                      <span className="flex-1 text-left truncate">{project.arquivo}</span>
                      <Download className="w-4 h-4" />
                    </Button>

                    {project.linkGithub && (
                      <Button 
                        variant="outline" 
                        className="w-full justify-start gap-3"
                        size="sm"
                        onClick={() => window.open(project.linkGithub, "_blank")}
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span className="flex-1 text-left">GitHub</span>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Descrição</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground leading-relaxed">{project.descricao}</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Evaluation Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Avaliação do Projeto</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Critérios */}
                  <div>
                    <h3 className="font-semibold mb-4">Critérios de Avaliação (0-10)</h3>
                    <div className="space-y-4">
                      {criterios.map((criterio) => (
                        <div key={criterio.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor={`criterio-${criterio.id}`} className="text-sm">
                              {criterio.nome}
                            </Label>
                            {notas[criterio.id] !== undefined && (
                              <span className="text-sm font-semibold text-primary">
                                {notas[criterio.id].toFixed(1)}
                              </span>
                            )}
                          </div>
                          <Input
                            id={`criterio-${criterio.id}`}
                            type="number"
                            min="0"
                            max="10"
                            step="0.1"
                            placeholder="0.0"
                            value={notas[criterio.id] || ""}
                            onChange={(e) => handleNotaChange(criterio.id, e.target.value)}
                            disabled={isSubmitting || showSuccess}
                            required
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Média */}
                  <div className="bg-primary/5 p-6 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-lg">Média Final:</span>
                      <span className="text-4xl font-bold text-primary">{calcularMedia()}</span>
                    </div>
                    {parseFloat(calcularMedia()) >= 6 && Object.keys(notas).length === criterios.length && (
                      <p className="text-sm text-[#2E7D32] mt-2">✓ Projeto aprovado</p>
                    )}
                  </div>

                  <Separator />

                  {/* Feedback */}
                  <div className="space-y-2">
                    <Label htmlFor="feedback">
                      Feedback para o Grupo <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="feedback"
                      rows={6}
                      placeholder="Escreva um feedback detalhado sobre o projeto, destacando pontos fortes e áreas de melhoria..."
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      disabled={isSubmitting || showSuccess}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Este feedback será compartilhado com os alunos
                    </p>
                  </div>

                  {/* Success Message */}
                  {showSuccess && (
                    <Alert className="bg-[#2E7D32]/10 border-[#2E7D32]">
                      <CheckCircle className="h-4 w-4 text-[#2E7D32]" />
                      <AlertDescription className="text-[#2E7D32]">
                        Avaliação salva com sucesso! Redirecionando...
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Submit Button */}
                  <div className="flex justify-end gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate("/professor/projetos")}
                      disabled={isSubmitting || showSuccess}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      className="bg-primary hover:bg-primary/90"
                      disabled={!isFormValid || isSubmitting || showSuccess}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Salvando...
                        </>
                      ) : (
                        "Salvar Avaliação"
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
