
// src/components/ProtectedRoute.tsx
import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Array<"ADMINISTRADOR" | "PROFESSOR">;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    console.log("ProtectedRoute - Verificando acesso:", {
      path: location.pathname,
      isAuthenticated,
      userRole: user?.role || "sem role",
      allowedRoles,
      loading,
      hasAccess: allowedRoles ? (user ? allowedRoles.includes(user.role) : false) : true
    });
  }, [location.pathname, isAuthenticated, user, allowedRoles, loading]);

  if (loading) {
    console.log("ProtectedRoute - Loading...");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log("ProtectedRoute - Não autenticado, redirecionando para /login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && (!user || !allowedRoles.includes(user.role))) {
    console.log("ProtectedRoute - Sem permissão, role:", user?.role, "permitidos:", allowedRoles);
    return <Navigate to="/" replace />;
  }

  console.log("ProtectedRoute - Acesso permitido para:", location.pathname);
  return <>{children}</>;
};
