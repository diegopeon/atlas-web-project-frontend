
import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { PageTitle } from "@/components/ui/page-title";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import { useToast } from "@/hooks/use-toast";
import { Project, ProjectStatus } from "@/types";
import ProjectService from "@/services/project.service";
import UserService from "@/services/user.service";
import { format } from "date-fns";
import { ChevronDown, ChevronUp, MoreVertical, Trash, Edit, Search, Filter } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Projetos: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [professors, setProfessors] = useState<Record<string, string>>({});
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Project;
    direction: "asc" | "desc";
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "ALL">("ALL");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [changeStatusDialogOpen, setChangeStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<ProjectStatus | "">("");
  
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch projects and professors in parallel
      const [projectsData, professorsData] = await Promise.all([
        ProjectService.getAllProjects(),
        UserService.getAllProfessors(),
      ]);
      
      setProjects(projectsData);
      setFilteredProjects(projectsData);
      
      // Create a map of professor IDs to names
      const professorMap: Record<string, string> = {};
      professorsData.forEach((professor) => {
        professorMap[professor.id] = professor.nome || professor.login;
      });
      setProfessors(professorMap);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Apply filters whenever search term or status filter changes
    let result = [...projects];
    
    // Apply search filter
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(
        (project) =>
          project.nome.toLowerCase().includes(lowerSearch) ||
          project.objetivo.toLowerCase().includes(lowerSearch) ||
          professors[project.professorId]?.toLowerCase().includes(lowerSearch)
      );
    }
    
    // Apply status filter
    if (statusFilter !== "ALL") {
      result = result.filter((project) => project.status === statusFilter);
    }
    
    // Apply sorting
    if (sortConfig) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    
    setFilteredProjects(result);
  }, [searchTerm, statusFilter, projects, sortConfig, professors]);

  const handleSort = (key: keyof Project) => {
    let direction: "asc" | "desc" = "asc";
    
    if (sortConfig && sortConfig.key === key) {
      direction = sortConfig.direction === "asc" ? "desc" : "asc";
    }
    
    setSortConfig({ key, direction });
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProject) return;
    
    try {
      // Only finalized projects cannot be deleted
      if (selectedProject.status === "FINALIZADO") {
        toast({
          title: "Operação não permitida",
          description: "Projetos finalizados não podem ser excluídos.",
          variant: "destructive",
        });
        return;
      }
      
      await ProjectService.deleteProject(selectedProject.id);
      
      toast({
        title: "Projeto excluído",
        description: "O projeto foi removido com sucesso.",
      });
      
      // Refresh projects
      fetchData();
    } catch (error) {
      console.error("Error deleting project:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o projeto",
        variant: "destructive",
      });
    } finally {
      setConfirmDeleteDialogOpen(false);
      setSelectedProject(null);
    }
  };

  const handleStatusChange = async () => {
    if (!selectedProject || !newStatus) return;
    
    try {
      await ProjectService.updateProject(selectedProject.id, {
        status: newStatus,
      });
      
      toast({
        title: "Status atualizado",
        description: "O status do projeto foi atualizado com sucesso.",
      });
      
      // Refresh projects
      fetchData();
    } catch (error) {
      console.error("Error updating project status:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status do projeto",
        variant: "destructive",
      });
    } finally {
      setChangeStatusDialogOpen(false);
      setSelectedProject(null);
      setNewStatus("");
    }
  };

  const openDeleteDialog = (project: Project) => {
    setSelectedProject(project);
    setConfirmDeleteDialogOpen(true);
  };

  const openChangeStatusDialog = (project: Project) => {
    setSelectedProject(project);
    setNewStatus(project.status);
    setChangeStatusDialogOpen(true);
  };

  const getSortIcon = (key: keyof Project) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="h-4 w-4 ml-1" />
    ) : (
      <ChevronDown className="h-4 w-4 ml-1" />
    );
  };

  const statusOptions: { value: ProjectStatus; label: string }[] = [
    { value: "AGUARDANDO_ANALISE_PRELIMINAR", label: "Aguardando Análise" },
    { value: "EM_ANALISE", label: "Em Análise" },
    { value: "PROJETO_RECUSADO", label: "Recusado" },
    { value: "EM_ANDAMENTO", label: "Em Andamento" },
    { value: "FINALIZADO", label: "Finalizado" },
  ];

  return (
    <AdminLayout>
      <PageTitle
        title="Gerenciar Projetos"
        description="Visualize, edite e exclua projetos do sistema"
      />

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar projetos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="flex-shrink-0 flex gap-2">
              <div className="w-44">
                <Select
                  value={statusFilter}
                  onValueChange={(value) => setStatusFilter(value as ProjectStatus | "ALL")}
                >
                  <SelectTrigger>
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="ALL">Todos os status</SelectItem>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("ALL");
                }}
              >
                Limpar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("nome")}
                >
                  <div className="flex items-center">
                    Nome {getSortIcon("nome")}
                  </div>
                </TableHead>
                <TableHead>Professor</TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("dataInicio")}
                >
                  <div className="flex items-center">
                    Data de Início {getSortIcon("dataInicio")}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center">
                    Status {getSortIcon("status")}
                  </div>
                </TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    </div>
                    <div className="mt-2">Carregando projetos...</div>
                  </TableCell>
                </TableRow>
              ) : filteredProjects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6">
                    Nenhum projeto encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                filteredProjects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">
                      {project.nome}
                    </TableCell>
                    <TableCell>
                      {professors[project.professorId] || project.professorId}
                    </TableCell>
                    <TableCell>
                      {format(new Date(project.dataInicio), "dd/MM/yyyy")}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={project.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0"
                          >
                            <span className="sr-only">Abrir menu</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => openChangeStatusDialog(project)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Alterar Status
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openDeleteDialog(project)}
                            disabled={project.status === "FINALIZADO"}
                            className={
                              project.status === "FINALIZADO"
                                ? "text-muted-foreground"
                                : "text-red-500"
                            }
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Excluir Projeto
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmDeleteDialogOpen} onOpenChange={setConfirmDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Você tem certeza que deseja excluir o projeto{" "}
              <strong>{selectedProject?.nome}</strong>? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Status Dialog */}
      <Dialog open={changeStatusDialogOpen} onOpenChange={setChangeStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar Status do Projeto</DialogTitle>
            <DialogDescription>
              Altere o status do projeto <strong>{selectedProject?.nome}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select
              value={newStatus}
              onValueChange={(value) => setNewStatus(value as ProjectStatus)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o novo status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setChangeStatusDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleStatusChange}
              disabled={!newStatus || newStatus === selectedProject?.status}
            >
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default Projetos;
