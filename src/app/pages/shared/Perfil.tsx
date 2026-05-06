import { useState } from "react";
import { MainLayout } from "../../components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { CheckCircle, User, Mail, Lock } from "lucide-react";

interface PerfilProps {
  userType: "aluno" | "professor" | "admin";
}

export default function Perfil({ userType }: PerfilProps) {
  const [showSuccess, setShowSuccess] = useState(false);
  
  const userConfig = {
    aluno: { 
      name: "João Silva", 
      email: "joao@senac.br", 
      label: "Aluno",
      extra: "ADS 4º Semestre"
    },
    professor: { 
      name: "Carlos Silva", 
      email: "carlos.prof@senac.br", 
      label: "Professor",
      extra: "Disciplinas: 6"
    },
    admin: { 
      name: "Ana Coordenadora", 
      email: "ana@senac.br", 
      label: "Coordenadora",
      extra: "Todos os acessos"
    },
  };

  const config = userConfig[userType];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <MainLayout 
      userType={userType} 
      userName={config.name} 
      userTypeLabel={config.label}
      notifications={2}
    >
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Meu Perfil</h1>
          <p className="text-muted-foreground mt-1">Gerencie suas informações pessoais</p>
        </div>

        <div className="max-w-3xl">
          {/* Profile Picture */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarFallback className="bg-primary text-white text-2xl">
                    {getInitials(config.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{config.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{config.label}</p>
                  <Button variant="outline" size="sm">
                    Alterar Foto
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome Completo</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        id="nome" 
                        defaultValue={config.name}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        id="email" 
                        type="email" 
                        defaultValue={config.email}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                {userType === "aluno" && (
                  <div className="space-y-2">
                    <Label htmlFor="turma">Turma</Label>
                    <Input 
                      id="turma" 
                      defaultValue={config.extra}
                      disabled
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input 
                    id="telefone" 
                    placeholder="(11) 98765-4321"
                  />
                </div>

                {showSuccess && (
                  <Alert className="bg-[#2E7D32]/10 border-[#2E7D32]">
                    <CheckCircle className="h-4 w-4 text-[#2E7D32]" />
                    <AlertDescription className="text-[#2E7D32]">
                      Informações atualizadas com sucesso!
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex justify-end pt-4">
                  <Button type="submit" className="bg-primary hover:bg-primary/90">
                    Salvar Alterações
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card>
            <CardHeader>
              <CardTitle>Alterar Senha</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="senha-atual">Senha Atual</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      id="senha-atual" 
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="senha-nova">Nova Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      id="senha-nova" 
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="senha-confirma">Confirmar Nova Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      id="senha-confirma" 
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button type="submit" variant="outline">
                    Alterar Senha
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
