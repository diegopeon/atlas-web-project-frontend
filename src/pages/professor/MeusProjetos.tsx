
import React, { useEffect, useState } from "react";
import ProfessorLayout from "@/components/layout/ProfessorLayout";
import { PageTitle } from "@/components/ui/page-title";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Project } from "@/types";
import ProjectService from "@/services/project.service";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import { Check, ExternalLink, ThumbsDown } from "lucide-react";

const MeusProjetos: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const allProjects = await ProjectService.getAllProjects();
      
      // Filter projects for current professor
      if (user?.id) {
        const userProjects = allProjects.filter(
          (project) => project.professorId === user.id
        );
        setProjects(userProjects);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os projetos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [user?.id]);

  const handleConfirmProject = async () => {
    if (!selectedProject) return;
    
    try {
      // Update project status
      await ProjectService.updateProject(selectedProject.id, {
        status: "FINALIZADO",
      });
      
      toast({
        title: "Projeto confirmado",
        description: "Você confirmou o recebimento do projeto finalizado.",
      });
      
      // Refresh projects
      fetchProjects();
    } catch (error) {
      console.error("Error confirming project:", error);
      toast({
        title: "Erro",
        description: "Não foi possível confirmar o projeto",
        variant: "destructive",
      });
    } finally {
      setConfirmDialogOpen(false);
      setSelectedProject(null);
    }
  };

  const openConfirmDialog = (project: Project) => {
    setSelectedProject(project);
    setConfirmDialogOpen(true);
  };

  return (
    <ProfessorLayout>
      <PageTitle
        title="Meus Projetos"
        description="Acompanhe todos os seus projetos solicitados"
      />

      {loading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : projects.length === 0 ? (
        <Card className="text-center p-8">
          <CardTitle className="mb-2">Nenhum projeto encontrado</CardTitle>
          <CardDescription>
            Você ainda não solicitou nenhum projeto.
          </CardDescription>
          <Button className="mt-4" onClick={() => window.location.href = "/solicitar-projeto"}>
            Solicitar Projeto
          </Button>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.id} className="flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{project.nome}</CardTitle>
                  <StatusBadge status={project.status} />
                </div>
                <CardDescription>
                  Início:  {project.dataInicio ? format(new Date(project.dataInicio), "dd/MM/yyyy") : "Sem data"}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-y-2">
                  <div>
                    <h4 className="font-medium text-sm">Objetivo</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {project.objetivo}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Público-alvo</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {project.publicoAlvo}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                {project.status === "FINALIZADO" ? (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => openConfirmDialog(project)}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Confirmar Recebimento
                  </Button>
                ) : project.status === "PROJETO_RECUSADO" ? (
                  <div className="flex items-center text-red-600 w-full justify-center">
                    <ThumbsDown className="mr-2 h-4 w-4" />
                    <span>Projeto Recusado</span>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full"
                    asChild
                  >
                    <a href={`/projeto/${project.id}`}>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Detalhes
                    </a>
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Recebimento</DialogTitle>
            <DialogDescription>
              Você está confirmando o recebimento do projeto finalizado{" "}
              <strong>{selectedProject?.nome}</strong>. Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleConfirmProject}>
              Confirmar Recebimento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ProfessorLayout>
  );
};

export default MeusProjetos;
