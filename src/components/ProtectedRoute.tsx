export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  console.log("🟡 ProtectedRoute:: loading:", loading);
  console.log("🟡 ProtectedRoute:: isAuthenticated:", isAuthenticated);
  console.log("🟡 ProtectedRoute:: user:", user);
  console.log("🟡 ProtectedRoute:: allowedRoles:", allowedRoles);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-blue-600">Carregando autenticação...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log("🔴 Usuário não autenticado");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    console.log("🔴 Usuário autenticado, mas com role inválida:", user.role);
    return user.role === "ADMINISTRADOR" ? (
      <Navigate to="/dashboard-admin" replace />
    ) : (
      <Navigate to="/dashboard-professor" replace />
    );
  }

  console.log("🟢 Autorizado, renderizando children.");
  return <>{children}</>;
};
