import { MainLayout } from "../../components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { FileText, Users, CheckCircle, GraduationCap, Download } from "lucide-react";

const statsData = [
  { 
    label: "Total de Projetos", 
    value: "48", 
    icon: FileText, 
    color: "bg-[#1A3A6C]",
    trend: "+12 este mês"
  },
  { 
    label: "Projetos Avaliados", 
    value: "32", 
    icon: CheckCircle, 
    color: "bg-[#2E7D32]",
    trend: "67% completo"
  },
  { 
    label: "Alunos Cadastrados", 
    value: "156", 
    icon: GraduationCap, 
    color: "bg-[#F47920]",
    trend: "+8 este semestre"
  },
  { 
    label: "Professores", 
    value: "12", 
    icon: Users, 
    color: "bg-[#F9A825]",
    trend: "3 turmas/prof"
  },
];

const chartDataPorTurma = [
  { id: 1, turma: "ADS 1º", projetos: 8 },
  { id: 2, turma: "ADS 2º", projetos: 10 },
  { id: 3, turma: "ADS 3º", projetos: 12 },
  { id: 4, turma: "ADS 4º", projetos: 18 },
];

const chartDataPorStatus = [
  { id: 1, name: "Avaliados", value: 32, color: "#2E7D32" },
  { id: 2, name: "Pendentes", value: 16, color: "#F9A825" },
];

export default function AdminDashboard() {
  const handleExportReport = () => {
    alert("Relatório exportado com sucesso! (simulação)");
  };

  return (
    <MainLayout 
      userType="admin" 
      userName="Ana Coordenadora" 
      userTypeLabel="Coordenadora"
      notifications={5}
    >
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard Administrativo</h1>
            <p className="text-muted-foreground mt-1">Visão geral do Observatório de Projetos</p>
          </div>
          <Button 
            onClick={handleExportReport}
            className="bg-secondary hover:bg-secondary/90 gap-2"
          >
            <Download className="w-5 h-5" />
            Gerar Relatório
          </Button>
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

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Bar Chart - Projetos por Turma */}
          <Card>
            <CardHeader>
              <CardTitle>Projetos por Turma</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartDataPorTurma}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="turma" stroke="#6B6B6B" />
                  <YAxis stroke="#6B6B6B" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#FFFFFF', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="projetos" fill="#1A3A6C" name="Projetos" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Pie Chart - Status dos Projetos */}
          <Card>
            <CardHeader>
              <CardTitle>Status dos Projetos</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartDataPorStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartDataPorStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
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
              <p className="text-4xl font-bold text-primary">8.7</p>
              <p className="text-sm text-muted-foreground mt-2">Dos projetos avaliados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Taxa de Aprovação</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-[#2E7D32]">94%</p>
              <p className="text-sm text-muted-foreground mt-2">Projetos com nota ≥ 6.0</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Projetos no Prazo</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-[#F47920]">89%</p>
              <p className="text-sm text-muted-foreground mt-2">Submetidos dentro do prazo</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}