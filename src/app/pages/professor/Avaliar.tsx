import { useState, useEffect } from "react";
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
import {
  ArrowLeft, Download, ExternalLink, FileText,
  CheckCircle, Loader2, AlertTriangle,
} from "lucide-react";
import { api } from "../../../services/api";

// Critérios reais do model Avaliacao do Django
const criterios = [
  { id: "nota_apresentacao", nome: "Apresentação"  },
  { id: "nota_documentacao", nome: "Documentação"  },
  { id: "nota_inovacao",     nome: "Inovação"      },
  { id: "nota_tecnica",      nome: "Técnica"        },
] as const;

type CriterioId = typeof criterios[number]["id"];

const statusConfig: Record<string, { label: string; color: string }> = {
  rascunho:     { label: "Rascunho",     color: "bg-[#6B6B6B] text-white" },
  submetido:    { label: "Submetido",    color: "bg-[#1565C0] text-white" },
  em_avaliacao: { label: "Em Avaliação", color: "bg-[#F9A825] text-white" },
  aprovado:     { label: "Aprovado",     color: "bg-[#2E7D32] text-white" },
};

interface Avaliacao {
  id: number;
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
  autor_nome: string;
  arquivo: string | null;
  link: string | null;
  criado_em: string;
  avaliacao: Avaliacao | null;
}

export default function AvaliarProjeto() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [projeto, setProjeto]       = useState<Projeto | null>(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess]   = useState(false);

  // Notas como strings para controlar o input sem perder "0"
  const [notas, setNotas] = useState<Record<CriterioId, string>>({
    nota_apresentacao: "",
    nota_documentacao: "",
    nota_inovacao:     "",
    nota_tecnica:      "",
  });
  const [feedback, setFeedback] = useState("");

  // Busca o projeto da API ao montar o componente
  useEffect(() => {
    if (!id) return;

    const fetchProjeto = async () => {
      try {
        const response = await api.get(`/api/projetos/${id}/`);
        if (response.ok) {
          const data: Projeto = await response.json();
          setProjeto(data);

          // Se já existe avaliação, pré-carrega as notas (modo edição)
          if (data.avaliacao) {
            setNotas({
              nota_apresentacao: String(data.avaliacao.nota_apresentacao),
              nota_documentacao: String(data.avaliacao.nota_documentacao),
              nota_inovacao:     String(data.avaliacao.nota_inovacao),
              nota_tecnica:      String(data.avaliacao.nota_tecnica),
            });
            setFeedback(data.avaliacao.feedback);
          }
        } else if (response.status === 401) {
          navigate("/");
        } else if (response.status === 404) {
          setError("Projeto não encontrado.");
        } else {
          setError("Erro ao carregar o projeto.");
        }
      } catch {
        setError("Erro de conexão. Verifique sua internet.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjeto();
  }, [id, navigate]);

  const handleNotaChange = (criterioId: CriterioId, value: string) => {
    // Permite apenas números entre 0 e 10 com até 1 casa decimal
    if (value === "" || (/^\d+(\.\d?)?$/.test(value) && parseFloat(value) <= 10)) {
      setNotas((prev) => ({ ...prev, [criterioId]: value }));
    }
  };

  // Calcula média das 4 notas (igual ao model Django)
  const calcularMedia = (): string => {
    const valores = criterios
      .map((c) => parseFloat(notas[c.id]))
      .filter((v) => !isNaN(v));

    if (valores.length !== criterios.length) return "—";
    return (valores.reduce((a, b) => a + b, 0) / valores.length).toFixed(1);
  };

  const isFormValid =
    criterios.every((c) => notas[c.id] !== "" && !isNaN(parseFloat(notas[c.id]))) &&
    feedback.trim().length > 0;

  const handleSubmit = async () => {
    if (!isFormValid || !projeto) return;
    setIsSubmitting(true);

    const payload = {
      projeto: projeto.id,          // necessário para o POST
      nota_apresentacao: parseFloat(notas.nota_apresentacao),
      nota_documentacao: parseFloat(notas.nota_documentacao),
      nota_inovacao:     parseFloat(notas.nota_inovacao),
      nota_tecnica:      parseFloat(notas.nota_tecnica),
      feedback,
    };

    try {
      let response;

      if (projeto.avaliacao) {
        // Já existe avaliação → edita com PATCH
        response = await api.patch(
          `/api/avaliacoes/${projeto.avaliacao.id}/`,
          payload
        );
      } else {
        // Sem avaliação → cria com POST
        response = await api.post("/api/avaliacoes/", payload);
      }

      if (response.ok) {
        setShowSuccess(true);
        setTimeout(() => navigate("/professor/projetos"), 2000);
      } else {
        const err = await response.json();
        setError(err.detail || "Erro ao salvar avaliação.");
      }
    } catch {
      setError("Erro de conexão ao salvar.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Estados de carregamento / erro ──────────────────────────────
  if (loading) {
    return (
      <MainLayout userType="professor" userName={localStorage.getItem("username") || "Professor"} userTypeLabel="Professor" notifications={0}>
        <div className="p-8 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </MainLayout>
    );
  }

  if (error && !projeto) {
    return (
      <MainLayout userType="professor" userName={localStorage.getItem("username") || "Professor"} userTypeLabel="Professor" notifications={0}>
        <div className="p-8 text-center space-y-4">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-2xl font-bold">{error}</h2>
          <Button onClick={() => navigate("/professor/projetos")}>
            Voltar para Projetos
          </Button>
        </div>
      </MainLayout>
    );
  }

  // ── Render principal ─────────────────────────────────────────────
  return (
    <MainLayout
      userType="professor"
      userName={localStorage.getItem("username") || "Professor"}
      userTypeLabel="Professor"
      notifications={0}
    >
      <div className="p-8">
        <Button
          variant="ghost"
          className="mb-6 gap-2"
          onClick={() => navigate("/professor/projetos")}
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Projetos
        </Button>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-foreground">{projeto!.titulo}</h1>
            <Badge className={statusConfig[projeto!.status]?.color}>
              {statusConfig[projeto!.status]?.label}
            </Badge>
          </div>
          <p className="text-muted-foreground">{projeto!.turma}</p>
        </div>

        {/* Erro não-fatal (falha ao salvar, por exemplo) */}
        {error && projeto && (
          <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Projeto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-1">Autor</p>
                  <p className="text-sm text-muted-foreground">
                    {projeto!.autor_nome?.trim() || "Aluno sem nome"}
                  </p>
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-medium mb-1">Data de Submissão</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(projeto!.criado_em).toLocaleDateString("pt-BR")}
                  </p>
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-medium mb-3">Arquivos e Links</p>
                  <div className="space-y-2">
                    {projeto!.arquivo ? (
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-3"
                        size="sm"
                        onClick={() => window.open(projeto!.arquivo!, "_blank")}
                      >
                        <FileText className="w-4 h-4" />
                        <span className="flex-1 text-left truncate">
                          Documentação PDF
                        </span>
                        <Download className="w-4 h-4" />
                      </Button>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Nenhum arquivo enviado
                      </p>
                    )}

                    {projeto!.link && (
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-3"
                        size="sm"
                        onClick={() => window.open(projeto!.link!, "_blank")}
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span className="flex-1 text-left">Link do Projeto</span>
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
                <p className="text-sm text-foreground leading-relaxed">
                  {projeto!.descricao || "Sem descrição informada."}
                </p>
              </CardContent>
            </Card>

            {/* Se já foi avaliado, mostra quem avaliou */}
            {projeto!.avaliacao && (
              <Card className="border-[#2E7D32]">
                <CardContent className="p-4">
                  <p className="text-sm font-medium text-[#2E7D32]">
                    ✓ Avaliado por {projeto!.avaliacao.professor_nome || "Professor"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(projeto!.avaliacao.avaliado_em).toLocaleDateString("pt-BR")}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Formulário de Avaliação */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  {projeto!.avaliacao ? "Editar Avaliação" : "Avaliar Projeto"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Critérios */}
                  <div>
                    <h3 className="font-semibold mb-4">
                      Critérios de Avaliação (0–10)
                    </h3>
                    <div className="space-y-4">
                      {criterios.map((criterio) => (
                        <div key={criterio.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor={criterio.id} className="text-sm">
                              {criterio.nome}
                            </Label>
                            {notas[criterio.id] !== "" && (
                              <span className="text-sm font-semibold text-primary">
                                {parseFloat(notas[criterio.id]).toFixed(1)}
                              </span>
                            )}
                          </div>
                          <Input
                            id={criterio.id}
                            type="number"
                            min="0"
                            max="10"
                            step="0.1"
                            placeholder="0.0"
                            value={notas[criterio.id]}
                            onChange={(e) =>
                              handleNotaChange(criterio.id, e.target.value)
                            }
                            disabled={isSubmitting || showSuccess}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Média calculada */}
                  <div className="bg-primary/5 p-6 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-lg">Nota Final:</span>
                      <span className="text-4xl font-bold text-primary">
                        {calcularMedia()}
                      </span>
                    </div>
                    {calcularMedia() !== "—" && parseFloat(calcularMedia()) >= 6 && (
                      <p className="text-sm text-[#2E7D32] mt-2">✓ Projeto aprovado</p>
                    )}
                    {calcularMedia() !== "—" && parseFloat(calcularMedia()) < 6 && (
                      <p className="text-sm text-red-600 mt-2">✗ Abaixo da média</p>
                    )}
                  </div>

                  <Separator />

                  {/* Feedback */}
                  <div className="space-y-2">
                    <Label htmlFor="feedback">
                      Feedback para o Aluno{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="feedback"
                      rows={6}
                      placeholder="Escreva um feedback detalhado sobre o projeto..."
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      disabled={isSubmitting || showSuccess}
                    />
                  </div>

                  {/* Sucesso */}
                  {showSuccess && (
                    <Alert className="bg-[#2E7D32]/10 border-[#2E7D32]">
                      <CheckCircle className="h-4 w-4 text-[#2E7D32]" />
                      <AlertDescription className="text-[#2E7D32]">
                        Avaliação salva com sucesso! Redirecionando...
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Ações */}
                  <div className="flex justify-end gap-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => navigate("/professor/projetos")}
                      disabled={isSubmitting || showSuccess}
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      className="bg-primary hover:bg-primary/90"
                      disabled={!isFormValid || isSubmitting || showSuccess}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Salvando...
                        </>
                      ) : projeto!.avaliacao ? (
                        "Atualizar Avaliação"
                      ) : (
                        "Salvar Avaliação"
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}