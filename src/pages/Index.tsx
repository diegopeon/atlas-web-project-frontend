
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Esperamos um pouco para garantir que o estado de autenticação seja carregado
    const timer = setTimeout(() => {
      if (!loading) {
        console.log("Index - Auth state:", { isAuthenticated, user });
        
        if (!isAuthenticated) {
          console.log("Index - Não autenticado, redirecionando para /login");
          navigate("/login");
        } else if (user?.role === "ADMINISTRADOR") {
          console.log("Index - Administrador, redirecionando para /dashboard-admin");
          navigate("/dashboard-admin");
        } else if (user?.role === "PROFESSOR") {
          console.log("Index - Professor, redirecionando para /dashboard-professor");
          navigate("/dashboard-professor");
        } else if (user) {
          // Usuário autenticado mas com role inválida
          console.log("Index - Role inválida:", user.role);
          toast({
            variant: "destructive",
            title: "Erro de acesso",
            description: "Seu perfil de usuário não tem permissão para acessar o sistema.",
          });
          navigate("/login");
        }
      }
    }, 500); // Pequeno delay para garantir que o estado esteja atualizado
    
    return () => clearTimeout(timer);
  }, [isAuthenticated, user, loading, navigate, toast]);

  // Enquanto carrega, exibe um spinner
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
};

export default Index;
