import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProfessorLayout from "@/components/layout/ProfessorLayout";
import { PageTitle } from "@/components/ui/page-title";
import { StatusBadge } from "@/components/ui/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Project } from "@/types";
import ProjectService from "@/services/project.service";
import { FilePlus, FileText } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const DashboardProfessor: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    console.log("Dashboard Mount - User:", user);
    console.log("Is Authenticated:", isAuthenticated);

    const fetchProjects = async () => {
      try {
        setLoading(true);
        if (!user || !user.id) {
          console.error("No user or user ID available");
          setError("Usuário não identificado");
          return;
        }

        const allProjects = await ProjectService.getAllProjects();
        console.log("All Projects Fetched:", allProjects);
        
        const userProjects = allProjects.filter(
          (project) => project.professorId === user.id
        );
        
        console.log("User Projects:", userProjects);
        
        setProjects(userProjects);
      } catch (err) {
        console.error("Erro ao buscar projetos:", err);
        setError("Não foi possível carregar os projetos");
        toast({
          title: "Erro",
          description: "Não foi possível carregar os projetos",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchProjects();
    } else {
      console.log("Not authenticated, cannot fetch projects");
    }
  }, [user?.id, isAuthenticated, toast]);

  // Count projects by status
  const statusCounts = projects.reduce((acc, project) => {
    acc[project.status] = (acc[project.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.dataInicio).getTime() - new Date(a.dataInicio).getTime())
    .slice(0, 5);

  if (error) {
    return (
      <ProfessorLayout>
        <div className="text-center text-red-500 p-6">
          {error}
          <Button onClick={() => window.location.reload()} className="ml-4">
            Recarregar
          </Button>
        </div>
      </ProfessorLayout>
    );
  }

  if (loading) {
    return (
      <ProfessorLayout>
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </ProfessorLayout>
    );
  }

  return (
    <ProfessorLayout>
      <PageTitle
        title="Dashboard do Professor"
        description="Acompanhe seus projetos e requisições"
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Projetos
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Aguardando Análise
            </CardTitle>
            <div className="h-4 w-4 rounded-full bg-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statusCounts.AGUARDANDO_ANALISE_PRELIMINAR || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
            <div className="h-4 w-4 rounded-full bg-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statusCounts.EM_ANDAMENTO || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Finalizados</CardTitle>
            <div className="h-4 w-4 rounded-full bg-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statusCounts.FINALIZADO || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Projetos Recentes</h2>
        <div className="space-x-2">
          <Button asChild variant="outline" size="sm">
            <Link to="/meus-projetos">
              <FileText className="mr-2 h-4 w-4" />
              Ver Todos
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/solicitar-projeto">
              <FilePlus className="mr-2 h-4 w-4" />
              Solicitar Projeto
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Data de Início</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4">
                    Carregando projetos...
                  </TableCell>
                </TableRow>
              ) : projects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4">
                    Nenhum projeto encontrado. Clique em "Solicitar Projeto" para criar seu primeiro projeto.
                  </TableCell>
                </TableRow>
              ) : (
                recentProjects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">
                      {project.nome}
                    </TableCell>
                    <TableCell>
                      {format(new Date(project.dataInicio), "dd/MM/yyyy")}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={project.status} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </ProfessorLayout>
  );
};

export default DashboardProfessor;
