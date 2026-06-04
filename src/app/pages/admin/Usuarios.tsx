import { useState, useEffect } from "react";
import { MainLayout } from "../../components/layout/MainLayout";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogTrigger,
} from "../../components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "../../components/ui/alert-dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "../../components/ui/select";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from "../../components/ui/table";
import { Plus, Pencil, Trash2, Search, AlertTriangle } from "lucide-react";
import { api } from "../../../services/api";

// Perfil vem do Django em minúsculo
const perfilConfig: Record<string, { label: string }> = {
  aluno:    { label: "Aluno"    },
  professor:{ label: "Professor"},
  admin:    { label: "Admin"    },
  empresa:  { label: "Empresa"  },
};

interface Usuario {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  perfil: string;
  is_active: boolean;
}

// Formulário de criação/edição
interface UserForm {
  first_name: string;
  last_name:  string;
  email:      string;
  username:   string;
  perfil:     string;
  password:   string;
}

const emptyForm: UserForm = {
  first_name: "",
  last_name:  "",
  email:      "",
  username:   "",
  perfil:     "aluno",
  password:   "",
};

function displayName(u: Usuario): string {
  const nome = `${u.first_name} ${u.last_name}`.trim();
  return nome || u.username || "Sem nome";
}

export default function AdminUsuarios() {
  const [users, setUsers]         = useState<Usuario[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [saving, setSaving]       = useState(false);

  // Filtros
  const [searchTerm, setSearchTerm]     = useState("");
  const [filterPerfil, setFilterPerfil] = useState("todos");
  const [filterStatus, setFilterStatus] = useState("todos");

  // Dialog de criação/edição
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser]   = useState<Usuario | null>(null);
  const [form, setForm]                 = useState<UserForm>(emptyForm);

  // Dialog de exclusão
  const [deleteId, setDeleteId]         = useState<number | null>(null);
  const [deleting, setDeleting]         = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/api/users/");
        if (response.ok) {
          setUsers(await response.json());
        } else {
          setError("Não foi possível carregar os usuários.");
        }
      } catch {
        setError("Erro de conexão.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Abre dialog para editar — pré-preenche o form
  const openEdit = (user: Usuario) => {
    setEditingUser(user);
    setForm({
      first_name: user.first_name,
      last_name:  user.last_name,
      email:      user.email,
      username:   user.username,
      perfil:     user.perfil,
      password:   "",            // nunca pré-preenche senha
    });
    setIsDialogOpen(true);
  };

  // Abre dialog para criar — reseta o form
  const openCreate = () => {
    setEditingUser(null);
    setForm(emptyForm);
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const payload: Partial<UserForm> = { ...form };
      // Não envia senha vazia na edição
      if (!payload.password) delete payload.password;

      let response;
      if (editingUser) {
        response = await api.patch(`/api/users/${editingUser.id}/`, payload);
      } else {
        response = await api.post("/api/users/", payload);
      }

      if (response.ok) {
        const saved: Usuario = await response.json();
        if (editingUser) {
          setUsers((prev) => prev.map((u) => (u.id === saved.id ? saved : u)));
        } else {
          setUsers((prev) => [...prev, saved]);
        }
        setIsDialogOpen(false);
      } else {
        const err = await response.json();
        // Django retorna erros por campo — pega o primeiro
        const firstError = Object.values(err).flat()[0] as string;
        setError(firstError || "Erro ao salvar usuário.");
      }
    } catch {
      setError("Erro de conexão ao salvar.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const response = await api.delete(`/api/users/${deleteId}/`);
      if (response.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== deleteId));
      } else {
        setError("Erro ao excluir usuário.");
      }
    } catch {
      setError("Erro de conexão ao excluir.");
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const nome = displayName(u).toLowerCase();
    const matchSearch  = nome.includes(searchTerm.toLowerCase()) ||
                         u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchPerfil  = filterPerfil === "todos" || u.perfil  === filterPerfil;
    const matchStatus  = filterStatus === "todos" ||
                         (filterStatus === "ativo"   &&  u.is_active) ||
                         (filterStatus === "inativo" && !u.is_active);
    return matchSearch && matchPerfil && matchStatus;
  });

  return (
    <MainLayout
      userType="admin"
      userName={localStorage.getItem("username") || "Admin"}
      userTypeLabel="Coordenadora"
      notifications={0}
    >
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestão de Usuários</h1>
            <p className="text-muted-foreground mt-1">
              Adicione, edite ou desative usuários do sistema
            </p>
          </div>
          <Button onClick={openCreate} className="bg-secondary hover:bg-secondary/90 gap-2">
            <Plus className="w-5 h-5" />
            Adicionar Usuário
          </Button>
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
              <div className="flex-1 min-w-[200px] relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome ou e-mail..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterPerfil} onValueChange={setFilterPerfil}>
                <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Tipos</SelectItem>
                  <SelectItem value="aluno">Alunos</SelectItem>
                  <SelectItem value="professor">Professores</SelectItem>
                  <SelectItem value="admin">Administradores</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Status</SelectItem>
                  <SelectItem value="ativo">Ativos</SelectItem>
                  <SelectItem value="inativo">Inativos</SelectItem>
                </SelectContent>
              </Select>
              <div className="text-sm text-muted-foreground whitespace-nowrap">
                {loading ? "Carregando..." : `${filteredUsers.length} usuário(s)`}
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
                  <TableHead>Nome</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Carregando usuários...
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{displayName(user)}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {user.username}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {perfilConfig[user.perfil]?.label ?? user.perfil}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={user.is_active
                          ? "bg-[#2E7D32] text-white"
                          : "bg-[#6B6B6B] text-white"
                        }>
                          {user.is_active ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEdit(user)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:bg-destructive/10"
                            onClick={() => setDeleteId(user.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Nenhum usuário encontrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Dialog criar / editar */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger className="hidden" />
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingUser ? "Editar Usuário" : "Adicionar Novo Usuário"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome</Label>
                  <Input
                    placeholder="Nome"
                    value={form.first_name}
                    onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Sobrenome</Label>
                  <Input
                    placeholder="Sobrenome"
                    value={form.last_name}
                    onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>E-mail</Label>
                <Input
                  type="email"
                  placeholder="usuario@senac.br"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Nome de usuário (login)</Label>
                <Input
                  placeholder="ex: joao.silva"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Tipo de Usuário</Label>
                <Select
                  value={form.perfil}
                  onValueChange={(v) => setForm({ ...form, perfil: v })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aluno">Aluno</SelectItem>
                    <SelectItem value="professor">Professor</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>
                  {editingUser ? "Nova senha (deixe vazio para manter)" : "Senha"}
                </Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={saving}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-primary hover:bg-primary/90"
                >
                  {saving ? "Salvando..." : editingUser ? "Salvar" : "Adicionar"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Dialog de exclusão */}
        <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir usuário?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação não pode ser desfeita. O usuário e todos os seus projetos
                serão permanentemente removidos.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={deleting}
                className="bg-destructive hover:bg-destructive/90"
              >
                {deleting ? "Excluindo..." : "Excluir"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </MainLayout>
  );
}