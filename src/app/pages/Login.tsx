import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { auth } from "../../services/auth";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await auth.login(username, password);

    if (result.success) {
      const perfil = auth.getPerfil();
      if (perfil === 'admin') {
        navigate("/admin/dashboard");
      } else if (perfil === 'professor') {
        navigate("/professor/dashboard");
      } else {
        navigate("/aluno/dashboard");
      }
    } else {
      setError("Usuário ou senha inválidos.");
    }

    setLoading(false);
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
              <Label htmlFor="username">Usuário</Label>
              <Input
                id="username"
                type="text"
                placeholder="seu.usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
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
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </CardContent>
        <div className="py-4 text-center border-t">
          <p className="text-xs text-muted-foreground">Senac Fecomércio © 2026</p>
        </div>
      </Card>
    </div>
  );
}