import { useState } from "react";
import { useNavigate } from "react-router";
import { MainLayout } from "../../components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { CheckCircle, AlertCircle, Loader2, Upload } from "lucide-react";
import { api } from "../../../services/api";

type FormStatus = "idle" | "loading" | "success" | "error";

export default function SubmeterProjeto() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    turma: "",
    arquivo: null as File | null,
    link: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    if (!formData.arquivo) {
      setErrorMsg("Selecione um arquivo PDF.");
      setStatus("error");
      return;
    }

    const data = new FormData();
    data.append("titulo", formData.titulo);
    data.append("descricao", formData.descricao);
    data.append("turma", formData.turma);
    data.append("arquivo", formData.arquivo);
    if (formData.link) data.append("link", formData.link);

    const response = await api.post("/api/projetos/", data, true);

    if (response.ok) {
      setStatus("success");
      setTimeout(() => navigate("/aluno/projetos"), 2000);
    } else {
      const err = await response.json();
      setErrorMsg(JSON.stringify(err));
      setStatus("error");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, arquivo: e.target.files[0] });
    }
  };

  return (
    <MainLayout
      userType="aluno"
      userName="João Silva"
      userTypeLabel="Aluno"
      notifications={2}
    >
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Submeter Projeto</h1>
          <p className="text-muted-foreground mt-1">Envie seu projeto integrador para avaliação</p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Projeto</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="titulo">
                    Título do Projeto <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="titulo"
                    placeholder="Digite o título do seu projeto"
                    value={formData.titulo}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                    required
                    disabled={status === "loading" || status === "success"}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descricao">
                    Descrição <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="descricao"
                    placeholder="Descreva brevemente seu projeto"
                    rows={5}
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    required
                    disabled={status === "loading" || status === "success"}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="turma">
                    Turma <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.turma}
                    onValueChange={(value) => setFormData({ ...formData, turma: value })}
                    disabled={status === "loading" || status === "success"}
                  >
                    <SelectTrigger id="turma">
                      <SelectValue placeholder="Selecione sua turma" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ADS 1º Semestre">ADS 1º Semestre</SelectItem>
                      <SelectItem value="ADS 2º Semestre">ADS 2º Semestre</SelectItem>
                      <SelectItem value="ADS 3º Semestre">ADS 3º Semestre</SelectItem>
                      <SelectItem value="ADS 4º Semestre">ADS 4º Semestre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="arquivo">
                    Arquivo do Projeto (PDF) <span className="text-destructive">*</span>
                  </Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:bg-muted/50 transition-colors">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <Input
                      id="arquivo"
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      required
                      disabled={status === "loading" || status === "success"}
                      className="hidden"
                    />
                    <label htmlFor="arquivo" className="cursor-pointer">
                      <span className="text-sm text-primary font-medium">Clique para selecionar</span>
                      <span className="text-sm text-muted-foreground"> ou arraste o arquivo aqui</span>
                    </label>
                    {formData.arquivo && (
                      <p className="text-sm text-foreground mt-2">✓ {formData.arquivo.name}</p>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">Formato: PDF | Tamanho máximo: 10MB</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="link">Link Opcional (GitHub, Drive, etc.)</Label>
                  <Input
                    id="link"
                    type="url"
                    placeholder="https://github.com/seu-usuario/seu-projeto"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    disabled={status === "loading" || status === "success"}
                  />
                </div>

                {status === "success" && (
                  <Alert className="bg-[#2E7D32]/10 border-[#2E7D32]">
                    <CheckCircle className="h-4 w-4 text-[#2E7D32]" />
                    <AlertDescription className="text-[#2E7D32]">
                      Projeto enviado com sucesso! Redirecionando...
                    </AlertDescription>
                  </Alert>
                )}

                {status === "error" && (
                  <Alert className="bg-destructive/10 border-destructive">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    <AlertDescription className="text-destructive">
                      {errorMsg || "Erro ao enviar projeto. Tente novamente."}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/aluno/projetos")}
                    disabled={status === "loading" || status === "success"}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary/90 flex-1"
                    disabled={status === "loading" || status === "success"}
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      "Enviar Projeto"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}