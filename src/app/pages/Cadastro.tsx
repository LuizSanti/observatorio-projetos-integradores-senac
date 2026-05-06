import { useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Alert, AlertDescription } from "../components/ui/alert";
import { CheckCircle, AlertCircle, ArrowLeft, Mail, Lock, User, GraduationCap } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";

type UserType = "aluno" | "professor" | "admin" | null;

export default function Cadastro() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    turma: "",
  });
  const [userType, setUserType] = useState<UserType>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Detecta o tipo de usuário baseado no email
  const detectUserType = (email: string): UserType => {
    if (email.endsWith("@admin.senac.br")) {
      return "admin";
    } else if (email.endsWith("@prof.senac.br")) {
      return "professor";
    } else if (email.endsWith("@senac.br")) {
      return "aluno";
    }
    return null;
  };

  const handleEmailChange = (email: string) => {
    setFormData({ ...formData, email });
    const type = detectUserType(email);
    setUserType(type);
    setError("");
  };

  const validateForm = (): boolean => {
    if (!formData.nome || !formData.email || !formData.senha || !formData.confirmarSenha) {
      setError("Preencha todos os campos obrigatórios");
      return false;
    }

    if (!userType) {
      setError("Email institucional inválido. Use: @senac.br (aluno), @prof.senac.br (professor) ou @admin.senac.br (administrador)");
      return false;
    }

    if (formData.senha.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres");
      return false;
    }

    if (formData.senha !== formData.confirmarSenha) {
      setError("As senhas não coincidem");
      return false;
    }

    if (userType === "aluno" && !formData.turma) {
      setError("Selecione sua turma");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    // Simula cadastro
    setSuccess(true);

    // Redireciona para login após sucesso
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  const getUserTypeLabel = (): string => {
    switch (userType) {
      case "aluno":
        return "Aluno";
      case "professor":
        return "Professor";
      case "admin":
        return "Administrador";
      default:
        return "";
    }
  };

  const getUserTypeColor = (): string => {
    switch (userType) {
      case "aluno":
        return "bg-[#1A3A6C]";
      case "professor":
        return "bg-[#F47920]";
      case "admin":
        return "bg-[#2E7D32]";
      default:
        return "bg-muted";
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Login */}
        <Button
          variant="ghost"
          className="mb-4 gap-2"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Login
        </Button>

        <Card>
          <CardHeader className="space-y-3">
            {/* Logo */}
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white text-3xl font-bold">S</span>
              </div>
            </div>
            <CardTitle className="text-2xl text-center">Criar Conta</CardTitle>
            <CardDescription className="text-center">
              Observatório de Projetos Integradores - Senac
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nome Completo */}
              <div className="space-y-2">
                <Label htmlFor="nome">
                  Nome Completo <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="nome"
                    type="text"
                    placeholder="Digite seu nome completo"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    className="pl-10"
                    disabled={success}
                  />
                </div>
              </div>

              {/* Email Institucional */}
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email Institucional <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu.email@senac.br"
                    value={formData.email}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    className="pl-10"
                    disabled={success}
                  />
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• Aluno: @senac.br</p>
                  <p>• Professor: @prof.senac.br</p>
                  <p>• Administrador: @admin.senac.br</p>
                </div>
              </div>

              {/* Tipo de Usuário Detectado */}
              {userType && (
                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                  <div className={`w-8 h-8 ${getUserTypeColor()} rounded-full flex items-center justify-center`}>
                    <GraduationCap className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Tipo de Conta</p>
                    <p className="text-xs text-muted-foreground">{getUserTypeLabel()}</p>
                  </div>
                </div>
              )}

              {/* Turma (apenas para alunos) */}
              {userType === "aluno" && (
                <div className="space-y-2">
                  <Label htmlFor="turma">
                    Turma <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.turma}
                    onValueChange={(value) => setFormData({ ...formData, turma: value })}
                    disabled={success}
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
              )}

              {/* Senha */}
              <div className="space-y-2">
                <Label htmlFor="senha">
                  Senha <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="senha"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={formData.senha}
                    onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                    className="pl-10"
                    disabled={success}
                  />
                </div>
              </div>

              {/* Confirmar Senha */}
              <div className="space-y-2">
                <Label htmlFor="confirmarSenha">
                  Confirmar Senha <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="confirmarSenha"
                    type="password"
                    placeholder="Digite a senha novamente"
                    value={formData.confirmarSenha}
                    onChange={(e) => setFormData({ ...formData, confirmarSenha: e.target.value })}
                    className="pl-10"
                    disabled={success}
                  />
                </div>
              </div>

              {/* Error Alert */}
              {error && (
                <Alert className="bg-destructive/10 border-destructive">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  <AlertDescription className="text-destructive">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {/* Success Alert */}
              {success && (
                <Alert className="bg-[#2E7D32]/10 border-[#2E7D32]">
                  <CheckCircle className="h-4 w-4 text-[#2E7D32]" />
                  <AlertDescription className="text-[#2E7D32]">
                    Conta criada com sucesso! Redirecionando...
                  </AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90"
                disabled={success}
              >
                Criar Conta
              </Button>

              {/* Login Link */}
              <div className="text-center text-sm text-muted-foreground">
                Já possui uma conta?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="text-primary hover:underline"
                  disabled={success}
                >
                  Fazer login
                </button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Info Footer */}
        <div className="mt-6 text-center text-xs text-muted-foreground">
          <p>Sistema exclusivo para a comunidade acadêmica do Senac</p>
          <p className="mt-1">Utilize apenas seu email institucional oficial</p>
        </div>
      </div>
    </div>
  );
}
