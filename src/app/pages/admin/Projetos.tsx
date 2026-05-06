import { useState } from "react";
import { useNavigate } from "react-router";
import { MainLayout } from "../../components/layout/MainLayout";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Filter, Eye, Pencil, Trash2 } from "lucide-react";

const mockProjects = [
  {
    id: 1,
    grupo: "Grupo A - João, Maria, Pedro",
    titulo: "Sistema de Gestão Escolar",
    turma: "ADS 4º Semestre",
    status: "avaliado",
    nota: 9.2,
    dataSubmissao: "15/03/2026",
    professor: "Prof. Carlos Silva",
  },
  {
    id: 2,
    grupo: "Grupo B - Ana, Carlos, Lucas",
    titulo: "App de Delivery Sustentável",
    turma: "ADS 4º Semestre",
    status: "pendente",
    nota: null,
    dataSubmissao: "10/04/2026",
    professor: "-",
  },
  {
    id: 3,
    grupo: "Grupo C - Fernanda, Rafael",
    titulo: "Plataforma de E-learning",
    turma: "ADS 3º Semestre",
    status: "avaliado",
    nota: 8.5,
    dataSubmissao: "05/04/2026",
    professor: "Prof. Ana Costa",
  },
  {
    id: 4,
    grupo: "Grupo D - Bruno, Camila, Diego",
    titulo: "Sistema de Controle de Estoque",
    turma: "ADS 3º Semestre",
    status: "pendente",
    nota: null,
    dataSubmissao: "14/04/2026",
    professor: "-",
  },
  {
    id: 5,
    grupo: "Grupo E - Larissa, Thiago",
    titulo: "App de Finanças Pessoais",
    turma: "ADS 2º Semestre",
    status: "avaliado",
    nota: 7.8,
    dataSubmissao: "20/03/2026",
    professor: "Prof. Carlos Silva",
  },
];

const statusConfig = {
  "avaliado": { label: "Avaliado", color: "bg-[#2E7D32] text-white" },
  "pendente": { label: "Pendente", color: "bg-[#F9A825] text-white" },
};

export default function AdminProjetos() {
  const navigate = useNavigate();
  const [selectedTurma, setSelectedTurma] = useState("todas");
  const [selectedStatus, setSelectedStatus] = useState("todos");
  const [projects] = useState(mockProjects);

  const filteredProjects = projects.filter((p) => {
    const turmaMatch = selectedTurma === "todas" || p.turma === selectedTurma;
    const statusMatch = selectedStatus === "todos" || p.status === selectedStatus;
    return turmaMatch && statusMatch;
  });

  return (
    <MainLayout 
      userType="admin" 
      userName="Ana Coordenadora" 
      userTypeLabel="Coordenadora"
      notifications={5}
    >
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Gestão de Projetos</h1>
          <p className="text-muted-foreground mt-1">Visualize e gerencie todos os projetos do sistema</p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-4 flex-wrap">
              <Filter className="w-5 h-5 text-muted-foreground" />
              
              <div className="flex items-center gap-2">
                <Label htmlFor="turma-filter" className="text-sm whitespace-nowrap">Turma:</Label>
                <Select value={selectedTurma} onValueChange={setSelectedTurma}>
                  <SelectTrigger id="turma-filter" className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas as Turmas</SelectItem>
                    <SelectItem value="ADS 4º Semestre">ADS 4º Semestre</SelectItem>
                    <SelectItem value="ADS 3º Semestre">ADS 3º Semestre</SelectItem>
                    <SelectItem value="ADS 2º Semestre">ADS 2º Semestre</SelectItem>
                    <SelectItem value="ADS 1º Semestre">ADS 1º Semestre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Label htmlFor="status-filter" className="text-sm whitespace-nowrap">Status:</Label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger id="status-filter" className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os Status</SelectItem>
                    <SelectItem value="pendente">Pendentes</SelectItem>
                    <SelectItem value="avaliado">Avaliados</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="ml-auto text-sm text-muted-foreground">
                {filteredProjects.length} projeto(s) encontrado(s)
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Projects Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Grupo</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Turma</TableHead>
                  <TableHead>Professor</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Nota</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.length > 0 ? (
                  filteredProjects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">{project.grupo}</TableCell>
                      <TableCell>{project.titulo}</TableCell>
                      <TableCell>{project.turma}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{project.professor}</TableCell>
                      <TableCell className="text-sm">{project.dataSubmissao}</TableCell>
                      <TableCell>
                        <Badge className={statusConfig[project.status as keyof typeof statusConfig].color}>
                          {statusConfig[project.status as keyof typeof statusConfig].label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {project.nota ? (
                          <span className="font-semibold text-[#2E7D32]">{project.nota}</span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" title="Visualizar">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" title="Editar">
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive" title="Excluir">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
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
