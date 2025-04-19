
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
            <Route path="/" element={<Index />} />
            
            {/* Professor Routes - Temporarily without protection */}
            <Route path="/dashboard-professor" element={<DashboardProfessor />} />
            <Route path="/solicitar-projeto" element={<SolicitarProjeto />} />
            <Route path="/meus-projetos" element={<MeusProjetos />} />
            
            {/* Admin Routes - Temporarily without protection */}
            <Route path="/dashboard-admin" element={<DashboardAdmin />} />
            <Route path="/projetos" element={<Projetos />} />
            <Route path="/cadastro-professor-admin" element={<CadastroProfessorAdmin />} />
            <Route path="/professores" element={<Professores />} />
            <Route path="/grupos" element={<Grupos />} />
            
            {/* Catch-all route for 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
