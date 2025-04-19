
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        navigate("/login");
      } else if (user?.role === "ADMINISTRADOR") {
        navigate("/dashboard-admin");
      } else if (user?.role === "PROFESSOR") {
        navigate("/dashboard-professor");
      }
    }
  }, [isAuthenticated, user, loading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
};

export default Index;
