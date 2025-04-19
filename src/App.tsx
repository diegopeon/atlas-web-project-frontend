
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";

// Public Pages
import Login from "./pages/Login";
import CadastroProfessor from "./pages/CadastroProfessor";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";

// Professor Pages
import DashboardProfessor from "./pages/professor/DashboardProfessor";
import SolicitarProjeto from "./pages/professor/SolicitarProjeto";
import MeusProjetos from "./pages/professor/MeusProjetos";

// Admin Pages
import DashboardAdmin from "./pages/admin/DashboardAdmin";
import Projetos from "./pages/admin/Projetos";
import CadastroProfessorAdmin from "./pages/admin/CadastroProfessorAdmin";
import Professores from "./pages/admin/Professores";
import Grupos from "./pages/admin/Grupos";

const queryClient = new QueryClient();

// Helper component to redirect based on auth status
const AuthRedirect = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role === "ADMINISTRADOR") {
    return <Navigate to="/dashboard-admin" replace />;
  }

  return <Navigate to="/dashboard-professor" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro-professor" element={<CadastroProfessor />} />
            
            {/* Redirect root to appropriate dashboard based on role */}
            <Route path="/" element={<Index />} />
            
            {/* Professor Routes */}
            <Route
              path="/dashboard-professor"
              element={
                <ProtectedRoute allowedRoles={["PROFESSOR"]}>
                  <DashboardProfessor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/solicitar-projeto"
              element={
                <ProtectedRoute allowedRoles={["PROFESSOR"]}>
                  <SolicitarProjeto />
                </ProtectedRoute>
              }
            />
            <Route
              path="/meus-projetos"
              element={
                <ProtectedRoute allowedRoles={["PROFESSOR"]}>
                  <MeusProjetos />
                </ProtectedRoute>
              }
            />
            
            {/* Admin Routes */}
            <Route
              path="/dashboard-admin"
              element={
                <ProtectedRoute allowedRoles={["ADMINISTRADOR"]}>
                  <DashboardAdmin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projetos"
              element={
                <ProtectedRoute allowedRoles={["ADMINISTRADOR"]}>
                  <Projetos />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cadastro-professor-admin"
              element={
                <ProtectedRoute allowedRoles={["ADMINISTRADOR"]}>
                  <CadastroProfessorAdmin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/professores"
              element={
                <ProtectedRoute allowedRoles={["ADMINISTRADOR"]}>
                  <Professores />
                </ProtectedRoute>
              }
            />
            <Route
              path="/grupos"
              element={
                <ProtectedRoute allowedRoles={["ADMINISTRADOR"]}>
                  <Grupos />
                </ProtectedRoute>
              }
            />
            
            {/* Catch-all route for 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
