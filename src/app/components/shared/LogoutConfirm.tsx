import { useNavigate } from "react-router";
import { auth } from "../../../services/auth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

interface LogoutConfirmProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm?: () => void;
}

export function LogoutConfirm({ open, onOpenChange, onConfirm }: LogoutConfirmProps) {
  const navigate = useNavigate();

  const handleConfirm = () => {
    auth.logout();
    onOpenChange(false);
    if (onConfirm) {
      onConfirm();
    } else {
      navigate("/");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar Saída</AlertDialogTitle>
          <AlertDialogDescription>
            Você tem certeza que deseja sair do sistema? Será necessário fazer login novamente para acessar sua conta.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-destructive hover:bg-destructive/90"
          >
            Sair
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}