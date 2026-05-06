import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardHeader } from "../components/ui/card";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Mock authentication
    if (email === "aluno@senac.br" && password === "aluno123") {
      navigate("/aluno/dashboard");
    } else if (email === "professor@senac.br" && password === "prof123") {
      navigate("/professor/dashboard");
    } else if (email === "admin@senac.br" && password === "admin123") {
      navigate("/admin/dashboard");
    } else {
      setError("Credenciais inválidas");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-4 text-center pt-8 pb-6">
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white text-2xl font-bold">S</span>
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold text-primary">Senac</h1>
              <p className="text-sm text-muted-foreground">Observatório de Projetos</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-8">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu.email@senac.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-input-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-input-background"
              />
            </div>
            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                {error}
              </div>
            )}
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
            >
              Entrar
            </Button>

            {/* Cadastro Link */}
            <div className="text-center text-sm text-muted-foreground">
              Não possui uma conta?{" "}
              <button
                type="button"
                onClick={() => navigate("/cadastro")}
                className="text-primary hover:underline"
              >
                Criar conta
              </button>
            </div>
          </form>

          <div className="mt-6 p-4 bg-muted/50 rounded-md">
            <p className="text-xs text-muted-foreground mb-2 font-semibold">Credenciais de teste:</p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>Aluno: aluno@senac.br / aluno123</p>
              <p>Professor: professor@senac.br / prof123</p>
              <p>Admin: admin@senac.br / admin123</p>
            </div>
          </div>
        </CardContent>
        <div className="py-4 text-center border-t">
          <p className="text-xs text-muted-foreground">Senac Fecomércio © 2026</p>
        </div>
      </Card>
    </div>
  );
}