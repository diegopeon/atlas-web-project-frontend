
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const AuthRedirectPage = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        navigate("/login");
      } else if (user?.role === "ADMINISTRADOR") {
        navigate("/dashboard-admin");
      } else if (user?.role === "PROFESSOR") {
        navigate("/dashboard-professor");
      } else if (user) {
        // Usuário autenticado mas com role inválida
        toast({
          variant: "destructive",
          title: "Erro de acesso",
          description: "Seu perfil de usuário não tem permissão para acessar o sistema.",
        });
        navigate("/login");
      }
    }
  }, [isAuthenticated, user, loading, navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
};

export default AuthRedirectPage;
