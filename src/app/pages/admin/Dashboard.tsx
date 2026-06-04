import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { MainLayout } from "../../components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import { FileText, Users, CheckCircle, GraduationCap, Download, AlertTriangle } from "lucide-react";
import { api } from "../../../services/api";

// ── Tipos ────────────────────────────────────────────────────────
interface Avaliacao {
  nota_final: number;
}

interface Projeto {
  id: number;
  titulo: string;
  turma: string;
  status: string;
  avaliacao: Avaliacao | null;
}

interface Usuario {
  id: number;
  perfil: string;   // aluno | professor | empresa | admin
  is_active: boolean;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [projetos, setProjetos]   = useState<Projeto[]>([]);
  const [usuarios, setUsuarios]   = useState<Usuario[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        // Busca projetos e usuários em paralelo — mais rápido que sequencial
        const [resProjetos, resUsuarios] = await Promise.all([
          api.get("/api/projetos/"),
          api.get("/api/users/"),
        ]);

        if (resProjetos.status === 401 || resUsuarios.status === 401) {
          navigate("/");
          return;
        }

        if (resProjetos.ok) setProjetos(await resProjetos.json());
        if (resUsuarios.ok) setUsuarios(await resUsuarios.json());

        if (!resProjetos.ok || !resUsuarios.ok) {
          setError("Alguns dados não puderam ser carregados.");
        }
      } catch {
        setError("Erro de conexão. Verifique sua internet.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [navigate]);

  // ── Métricas calculadas no frontend ─────────────────────────────
  const totalProjetos  = projetos.length;
  const avaliados      = projetos.filter((p) => p.avaliacao !== null).length;
  const alunos         = usuarios.filter((u) => u.perfil === "aluno").length;
  const professores    = usuarios.filter((u) => u.perfil === "professor").length;

  const notasFinais = projetos
    .filter((p) => p.avaliacao?.nota_final != null)
    .map((p) => Number(p.avaliacao!.nota_final));

  const mediaGeral = notasFinais.length > 0
    ? (notasFinais.reduce((a, b) => a + b, 0) / notasFinais.length).toFixed(1)
    : "—";

  const taxaAprovacao = notasFinais.length > 0
    ? Math.round((notasFinais.filter((n) => n >= 6).length / notasFinais.length) * 100)
    : 0;

  // Projetos por turma — agrega dinamicamente
  const porTurma = Object.entries(
    projetos.reduce<Record<string, number>>((acc, p) => {
      acc[p.turma] = (acc[p.turma] || 0) + 1;
      return acc;
    }, {})
  )
    .map(([turma, total]) => ({ turma, projetos: total }))
    .sort((a, b) => a.turma.localeCompare(b.turma));

  // Status para o gráfico de pizza — usa os 4 status reais
  const statusCores: Record<string, string> = {
    rascunho:     "#6B6B6B",
    submetido:    "#1565C0",
    em_avaliacao: "#F9A825",
    aprovado:     "#2E7D32",
  };

  const statusLabels: Record<string, string> = {
    rascunho:     "Rascunho",
    submetido:    "Submetido",
    em_avaliacao: "Em Avaliação",
    aprovado:     "Aprovado",
  };

  const porStatus = Object.entries(
    projetos.reduce<Record<string, number>>((acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    }, {})
  ).map(([status, value]) => ({
    name:  statusLabels[status] ?? status,
    value,
    color: statusCores[status]  ?? "#999",
  }));

  // ── Export CSV simples ───────────────────────────────────────────
  const handleExportReport = () => {
    const header = "ID,Título,Turma,Status,Nota Final\n";
    const rows = projetos
      .map((p) =>
        [
          p.id,
          `"${p.titulo}"`,
          `"${p.turma}"`,
          p.status,
          p.avaliacao?.nota_final ?? "",
        ].join(",")
      )
      .join("\n");

    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href     = url;
    link.download = `relatorio-projetos-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const statsData = [
    {
      label: "Total de Projetos",
      value: totalProjetos,
      icon:  FileText,
      color: "bg-[#1A3A6C]",
      trend: `${avaliados} avaliados`,
    },
    {
      label: "Projetos Avaliados",
      value: avaliados,
      icon:  CheckCircle,
      color: "bg-[#2E7D32]",
      trend: totalProjetos > 0
        ? `${Math.round((avaliados / totalProjetos) * 100)}% completo`
        : "0% completo",
    },
    {
      label: "Alunos Cadastrados",
      value: alunos,
      icon:  GraduationCap,
      color: "bg-[#F47920]",
      trend: "usuários ativos",
    },
    {
      label: "Professores",
      value: professores,
      icon:  Users,
      color: "bg-[#F9A825]",
      trend: "no sistema",
    },
  ];

  return (
    <MainLayout
      userType="admin"
      userName={localStorage.getItem("username") || "Admin"}
      userTypeLabel="Coordenadora"
      notifications={projetos.filter(
        (p) => p.avaliacao === null &&
               (p.status === "submetido" || p.status === "em_avaliacao")
      ).length}
    >
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard Administrativo</h1>
            <p className="text-muted-foreground mt-1">Visão geral do Observatório de Projetos</p>
          </div>
          <Button
            onClick={handleExportReport}
            disabled={loading || projetos.length === 0}
            className="bg-secondary hover:bg-secondary/90 gap-2"
          >
            <Download className="w-5 h-5" />
            Gerar Relatório
          </Button>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Cards de métricas */}
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
                  <p className="text-3xl font-bold text-foreground">
                    {loading ? "..." : stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">{stat.trend}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Projetos por Turma</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground text-sm">
                  Carregando...
                </div>
              ) : porTurma.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={porTurma}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="turma" stroke="#6B6B6B" />
                    <YAxis stroke="#6B6B6B" allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#FFFFFF",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="projetos" fill="#1A3A6C" name="Projetos" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground text-sm">
                  Nenhum dado disponível
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status dos Projetos</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground text-sm">
                  Carregando...
                </div>
              ) : porStatus.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={porStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={100}
                      dataKey="value"
                    >
                      {porStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground text-sm">
                  Nenhum dado disponível
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Média Geral de Notas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-primary">
                {loading ? "..." : mediaGeral}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Dos projetos avaliados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Taxa de Aprovação</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-[#2E7D32]">
                {loading ? "..." : `${taxaAprovacao}%`}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Projetos com nota ≥ 6.0
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Total de Usuários</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-[#F47920]">
                {loading ? "..." : usuarios.length}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {alunos} alunos · {professores} professores
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}