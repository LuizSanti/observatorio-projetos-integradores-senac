import { Bell, User, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useState } from "react";
import { useNavigate } from "react-router";
import { LogoutConfirm } from "../shared/LogoutConfirm";

interface HeaderProps {
  userName: string;
  userType: string;
  notifications?: number;
}

export function Header({ userName, userType, notifications = 0 }: HeaderProps) {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = () => {
    setShowLogoutDialog(true);
  };

  const mockNotifications = [
    { id: 1, message: "Novo projeto submetido para avaliação", time: "5 min atrás", unread: true },
    { id: 2, message: "Projeto 'Sistema de Gestão' foi avaliado", time: "1 hora atrás", unread: true },
    { id: 3, message: "Atualização no sistema", time: "2 horas atrás", unread: false },
  ];

  return (
    <header className="h-16 bg-card border-b border-border px-6 flex items-center justify-end gap-4">
      {/* Notifications */}
      <DropdownMenu open={showNotifications} onOpenChange={setShowNotifications}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            {notifications > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-destructive text-white text-xs">
                {notifications}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <div className="px-4 py-3 border-b">
            <h3 className="font-semibold">Notificações</h3>
          </div>
          {mockNotifications.map((notif) => (
            <DropdownMenuItem key={notif.id} className="px-4 py-3 cursor-pointer">
              <div className="flex gap-3 w-full">
                <div className={`w-2 h-2 rounded-full mt-2 ${notif.unread ? 'bg-secondary' : 'bg-transparent'}`} />
                <div className="flex-1">
                  <p className="text-sm">{notif.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
                </div>
              </div>
            </DropdownMenuItem>
          ))}
          <div className="px-4 py-3 border-t text-center">
            <Button variant="link" className="text-sm text-primary">
              Ver todas as notificações
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* User Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-3 cursor-pointer hover:bg-muted/50 rounded-lg px-3 py-2 transition-colors border-0 bg-transparent">
            <div className="text-right hidden sm:block">
              <p className="font-medium text-sm">{userName}</p>
              <p className="text-xs text-muted-foreground">{userType}</p>
            </div>
            <Avatar className="cursor-pointer">
              <AvatarFallback className="bg-primary text-white">
                {getInitials(userName)}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-3 py-2">
            <p className="font-medium">{userName}</p>
            <p className="text-xs text-muted-foreground">{userType}</p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer gap-2">
            <User className="w-4 h-4" />
            <span>Meu Perfil</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className="cursor-pointer gap-2 text-destructive focus:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
            <span>Sair</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Logout Confirmation Dialog */}
      <LogoutConfirm
        open={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
        onConfirm={() => navigate("/")}
      />
    </header>
  );
}