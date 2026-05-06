import { ReactNode, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { 
  LayoutDashboard, 
  FolderKanban, 
  Upload, 
  ClipboardCheck, 
  Settings, 
  User, 
  LogOut,
  Menu
} from "lucide-react";
import { LogoutConfirm } from "../shared/LogoutConfirm";

interface SidebarProps {
  userType: "aluno" | "professor" | "admin";
}

interface MenuItem {
  icon: ReactNode;
  label: string;
  path: string;
  show: boolean;
}

export function Sidebar({ userType }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogout = () => {
    setShowLogoutDialog(true);
  };

  const getMenuItems = (): MenuItem[] => {
    const baseItems: MenuItem[] = [
      {
        icon: <LayoutDashboard className="w-5 h-5" />,
        label: "Dashboard",
        path: `/${userType}/dashboard`,
        show: true,
      },
    ];

    if (userType === "aluno") {
      return [
        ...baseItems,
        {
          icon: <FolderKanban className="w-5 h-5" />,
          label: "Meus Projetos",
          path: "/aluno/projetos",
          show: true,
        },
        {
          icon: <Upload className="w-5 h-5" />,
          label: "Submeter Projeto",
          path: "/aluno/submeter",
          show: true,
        },
        {
          icon: <User className="w-5 h-5" />,
          label: "Meu Perfil",
          path: "/aluno/perfil",
          show: true,
        },
      ];
    }

    if (userType === "professor") {
      return [
        ...baseItems,
        {
          icon: <FolderKanban className="w-5 h-5" />,
          label: "Projetos",
          path: "/professor/projetos",
          show: true,
        },
        {
          icon: <ClipboardCheck className="w-5 h-5" />,
          label: "Avaliações",
          path: "/professor/avaliacoes",
          show: true,
        },
        {
          icon: <User className="w-5 h-5" />,
          label: "Meu Perfil",
          path: "/professor/perfil",
          show: true,
        },
      ];
    }

    if (userType === "admin") {
      return [
        ...baseItems,
        {
          icon: <FolderKanban className="w-5 h-5" />,
          label: "Projetos",
          path: "/admin/projetos",
          show: true,
        },
        {
          icon: <Settings className="w-5 h-5" />,
          label: "Administração",
          path: "/admin/usuarios",
          show: true,
        },
        {
          icon: <User className="w-5 h-5" />,
          label: "Meu Perfil",
          path: "/admin/perfil",
          show: true,
        },
      ];
    }

    return baseItems;
  };

  const menuItems = getMenuItems();

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white text-xl font-bold">S</span>
          </div>
          <div>
            <h2 className="font-bold text-primary">Senac</h2>
            <p className="text-xs text-muted-foreground">Observatório</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          item.show && (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                location.pathname === item.path
                  ? "bg-primary text-white"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          )
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sair</span>
        </Button>
      </div>

      {/* Logout Confirmation Dialog */}
      <LogoutConfirm
        open={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
        onConfirm={() => navigate("/")}
      />
    </aside>
  );
}