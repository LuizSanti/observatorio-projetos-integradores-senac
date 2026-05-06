import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

interface MainLayoutProps {
  children: ReactNode;
  userType: "aluno" | "professor" | "admin";
  userName: string;
  userTypeLabel: string;
  notifications?: number;
}

export function MainLayout({ 
  children, 
  userType, 
  userName, 
  userTypeLabel,
  notifications = 0 
}: MainLayoutProps) {
  return (
    <div className="min-h-screen flex">
      <Sidebar userType={userType} />
      <div className="flex-1 flex flex-col">
        <Header 
          userName={userName} 
          userType={userTypeLabel} 
          notifications={notifications}
        />
        <main className="flex-1 overflow-auto bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
