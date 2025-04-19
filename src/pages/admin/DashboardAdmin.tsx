
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "@/components/layout/AdminLayout";
import { PageTitle } from "@/components/ui/page-title";
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
import { StatusBadge } from "@/components/ui/status-badge";
import { Project } from "@/types";
import ProjectService from "@/services/project.service";
import UserService from "@/services/user.service";
import { 
  Activity, 
  FileText, 
  Users, 
  UserSquare2, 
  Check, 
  XCircle, 
  Clock,
  Hourglass
} from "lucide-react";
import { format } from "date-fns";

const DashboardAdmin: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [professorCount, setProfessorCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch projects
        const projectsData = await ProjectService.getAllProjects();
        setProjects(projectsData);
        
        // Fetch professors
        const professorsData = await UserService.getAllProfessors();
        setProfessorCount(professorsData.length);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Count projects by status
  const statusCounts = projects.reduce((acc, project) => {
    acc[project.status] = (acc[project.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Get the latest 5 projects
  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.dataInicio).getTime() - new Date(a.dataInicio).getTime())
    .slice(0, 5);

  // Simulated groups data for now
  const activeGroups = 5;

  return (
    <AdminLayout>
      <PageTitle
        title="Dashboard do Administrador"
        description="Visão geral do sistema Atlas"
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
              Professores Cadastrados
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{professorCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Grupos Ativos</CardTitle>
            <UserSquare2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeGroups}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Taxa de Conclusão
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {projects.length
                ? Math.round(
                    ((statusCounts.FINALIZADO || 0) / projects.length) * 100
                  )
                : 0}
              %
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Status dos Projetos</CardTitle>
              <Button asChild variant="outline" size="sm">
                <Link to="/projetos">Ver Todos</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Hourglass className="h-4 w-4 mr-2 text-yellow-500" />
                  <span>Aguardando Análise</span>
                </div>
                <span className="font-medium">
                  {statusCounts.AGUARDANDO_ANALISE_PRELIMINAR || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-blue-500" />
                  <span>Em Análise</span>
                </div>
                <span className="font-medium">{statusCounts.EM_ANALISE || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <XCircle className="h-4 w-4 mr-2 text-red-500" />
                  <span>Recusados</span>
                </div>
                <span className="font-medium">
                  {statusCounts.PROJETO_RECUSADO || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Activity className="h-4 w-4 mr-2 text-purple-500" />
                  <span>Em Andamento</span>
                </div>
                <span className="font-medium">
                  {statusCounts.EM_ANDAMENTO || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  <span>Finalizados</span>
                </div>
                <span className="font-medium">
                  {statusCounts.FINALIZADO || 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Ações Rápidas</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full justify-start" variant="outline">
              <Link to="/cadastro-professor-admin">
                <Users className="mr-2 h-4 w-4" />
                Cadastrar Professor
              </Link>
            </Button>
            <Button asChild className="w-full justify-start" variant="outline">
              <Link to="/professores">
                <Users className="mr-2 h-4 w-4" />
                Gerenciar Professores
              </Link>
            </Button>
            <Button asChild className="w-full justify-start" variant="outline">
              <Link to="/projetos">
                <FileText className="mr-2 h-4 w-4" />
                Gerenciar Projetos
              </Link>
            </Button>
            <Button asChild className="w-full justify-start" variant="outline">
              <Link to="/grupos">
                <UserSquare2 className="mr-2 h-4 w-4" />
                Gerenciar Grupos
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Projetos Recentes</CardTitle>
            <Button asChild variant="outline" size="sm">
              <Link to="/projetos">Ver Todos</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Professor</TableHead>
                <TableHead>Data de Início</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    Carregando dados...
                  </TableCell>
                </TableRow>
              ) : recentProjects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    Nenhum projeto encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                recentProjects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">
                      {project.nome}
                    </TableCell>
                    <TableCell>{project.professorId}</TableCell>
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
    </AdminLayout>
  );
};

export default DashboardAdmin;
