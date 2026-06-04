import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { MainLayout } from "../../components/layout/MainLayout";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "../../components/ui/select";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from "../../components/ui/table";
import { Filter, AlertTriangle } from "lucide-react";
import { api } from "../../../services/api";

// Status reais do Django
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
  autor_nome: string;
  criado_em: string;        // ISO 8601 ex: "2026-03-15T10:30:00Z"
  avaliacao: Avaliacao | null;
}

// Formata "2026-03-15T10:30:00Z" → "15/03/2026"
function formatarData(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString("pt-BR");
}

// Extrai turmas únicas dos projetos para popular o filtro dinamicamente
function turmasUnicas(projects: Projeto[]): string[] {
  return Array.from(new Set(projects.map((p) => p.turma))).sort();
}

export default function ProfessorProjetos() {
  const navigate = useNavigate();
  const [projects, setProjects]       = useState<Projeto[]>([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);
  const [selectedTurma, setSelectedTurma]   = useState("todas");
  const [selectedStatus, setSelectedStatus] = useState("todos");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get("/api/projetos/");
        if (response.ok) {
          const data = await response.json();
          setProjects(data);
        } else if (response.status === 401) {
          navigate("/");
        } else {
          setError("Não foi possível carregar os projetos.");
        }
      } catch {
        setError("Erro de conexão. Verifique sua internet.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [navigate]);

  const filteredProjects = projects.filter((p) => {
    const turmaMatch  = selectedTurma  === "todas" || p.turma   === selectedTurma;
    const statusMatch = selectedStatus === "todos"  || p.status  === selectedStatus;
    return turmaMatch && statusMatch;
  });

  const turmas = turmasUnicas(projects);

  return (
    <MainLayout
      userType="professor"
      userName={localStorage.getItem("username") || "Professor"}
      userTypeLabel="Professor"
      notifications={projects.filter(
        (p) => p.avaliacao === null &&
               (p.status === "submetido" || p.status === "em_avaliacao")
      ).length}
    >
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Projetos</h1>
          <p className="text-muted-foreground mt-1">
            Visualize e gerencie todos os projetos
          </p>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Filtros */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-4 flex-wrap">
              <Filter className="w-5 h-5 text-muted-foreground" />

              <div className="flex items-center gap-2">
                <Label htmlFor="turma-filter" className="text-sm whitespace-nowrap">
                  Turma:
                </Label>
                <Select value={selectedTurma} onValueChange={setSelectedTurma}>
                  <SelectTrigger id="turma-filter" className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas as Turmas</SelectItem>
                    {/* Turmas vêm dos dados reais — sem hardcode */}
                    {turmas.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Label htmlFor="status-filter" className="text-sm whitespace-nowrap">
                  Status:
                </Label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger id="status-filter" className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os Status</SelectItem>
                    <SelectItem value="rascunho">Rascunho</SelectItem>
                    <SelectItem value="submetido">Submetido</SelectItem>
                    <SelectItem value="em_avaliacao">Em Avaliação</SelectItem>
                    <SelectItem value="aprovado">Aprovado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="ml-auto text-sm text-muted-foreground">
                {loading ? "Carregando..." : `${filteredProjects.length} projeto(s) encontrado(s)`}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabela */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Autor</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Turma</TableHead>
                  <TableHead>Data de Submissão</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Nota Final</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Carregando projetos...
                    </TableCell>
                  </TableRow>
                ) : filteredProjects.length > 0 ? (
                  filteredProjects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">
                        {project.autor_nome?.trim() || "Aluno sem nome"}
                      </TableCell>
                      <TableCell>{project.titulo}</TableCell>
                      <TableCell>{project.turma}</TableCell>
                      <TableCell>{formatarData(project.criado_em)}</TableCell>
                      <TableCell>
                        <Badge className={statusConfig[project.status]?.color ?? "bg-gray-400 text-white"}>
                          {statusConfig[project.status]?.label ?? project.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {project.avaliacao?.nota_final != null ? (
                          <span className="font-semibold text-[#2E7D32]">
                            {Number(project.avaliacao.nota_final).toFixed(1)}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          onClick={() => navigate(`/professor/avaliacoes/${project.id}`)}
                          className="bg-primary hover:bg-primary/90"
                        >
                          {project.avaliacao ? "Ver Avaliação" : "Avaliar"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Nenhum projeto encontrado com os filtros selecionados
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}