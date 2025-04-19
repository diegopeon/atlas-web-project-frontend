import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Public Pages
import Login from "@/pages/Login";
import CadastroProfessor from "@/pages/CadastroProfessor";
import NotFound from "@/pages/NotFound";
import AuthRedirectPage from "@/pages/AuthRedirectPage";

// Professor Pages
import DashboardProfessor from "@/pages/professor/DashboardProfessor";
import SolicitarProjeto from "@/pages/professor/SolicitarProjeto";
import MeusProjetos from "@/pages/professor/MeusProjetos";

// Admin Pages
import DashboardAdmin from "@/pages/admin/DashboardAdmin";
import Projetos from "@/pages/admin/Projetos";
import CadastroProfessorAdmin from "@/pages/admin/CadastroProfessorAdmin";
import Professores from "@/pages/admin/Professores";
import Grupos from "@/pages/admin/Grupos";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Rotas públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro-professor" element={<CadastroProfessor />} />

            {/* Redirecionamento com base no role */}
            <Route path="/" element={<AuthRedirectPage />} />

            {/* Rotas do professor */}
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

            {/* Rotas do admin */}
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

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
