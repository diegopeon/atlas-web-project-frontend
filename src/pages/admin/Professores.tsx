
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/types";
import UserService from "@/services/user.service";
import { Link } from "react-router-dom";
import { MoreVertical, Trash, Edit, Search, UserPlus } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const professorEditSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  escola: z.string().min(1, "Escola é obrigatória"),
  login: z.string().min(1, "Login é obrigatório"),
});

type ProfessorEditFormData = z.infer<typeof professorEditSchema>;

const Professores: React.FC = () => {
  const [professors, setProfessors] = useState<User[]>([]);
  const [filteredProfessors, setFilteredProfessors] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProfessor, setSelectedProfessor] = useState<User | null>(null);
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  
  const { toast } = useToast();

  const form = useForm<ProfessorEditFormData>({
    resolver: zodResolver(professorEditSchema),
    defaultValues: {
      nome: "",
      escola: "",
      login: "",
    },
  });

  const fetchProfessors = async () => {
    try {
      setLoading(true);
      const data = await UserService.getAllProfessors();
      setProfessors(data);
      setFilteredProfessors(data);
    } catch (error) {
      console.error("Error fetching professors:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar a lista de professores",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfessors();
  }, []);

  useEffect(() => {
    // Apply search filter
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      const filtered = professors.filter(
        (professor) =>
          professor.nome?.toLowerCase().includes(lowerSearch) ||
          professor.login?.toLowerCase().includes(lowerSearch) ||
          professor.escola?.toLowerCase().includes(lowerSearch)
      );
      setFilteredProfessors(filtered);
    } else {
      setFilteredProfessors(professors);
    }
  }, [searchTerm, professors]);

  const handleDeleteConfirm = async () => {
    if (!selectedProfessor) return;
    
    try {
      await UserService.deleteProfessor(selectedProfessor.id);
      
      toast({
        title: "Professor excluído",
        description: "O professor foi removido com sucesso.",
      });
      
      // Refresh professors
      fetchProfessors();
    } catch (error) {
      console.error("Error deleting professor:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o professor",
        variant: "destructive",
      });
    } finally {
      setConfirmDeleteDialogOpen(false);
      setSelectedProfessor(null);
    }
  };

  const openDeleteDialog = (professor: User) => {
    setSelectedProfessor(professor);
    setConfirmDeleteDialogOpen(true);
  };

  const openEditDialog = (professor: User) => {
    setSelectedProfessor(professor);
    form.reset({
      nome: professor.nome || "",
      escola: professor.escola || "",
      login: professor.login,
    });
    setEditDialogOpen(true);
  };

  const handleEditSubmit = async (data: ProfessorEditFormData) => {
    if (!selectedProfessor) return;
    
    try {
      setEditLoading(true);
      
      await UserService.updateProfessor(selectedProfessor.id, {
        nome: data.nome,
        escola: data.escola,
        login: data.login,
      });
      
      toast({
        title: "Professor atualizado",
        description: "As informações do professor foram atualizadas com sucesso.",
      });
      
      // Refresh professors
      fetchProfessors();
      setEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating professor:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o professor",
        variant: "destructive",
      });
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <AdminLayout>
      <PageTitle
        title="Gerenciar Professores"
        description="Visualize, edite e exclua professores do sistema"
      />

      <div className="flex justify-between items-center mb-6">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar professores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button asChild>
          <Link to="/cadastro-professor-admin">
            <UserPlus className="mr-2 h-4 w-4" />
            Novo Professor
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Login</TableHead>
                <TableHead>Escola</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    </div>
                    <div className="mt-2">Carregando professores...</div>
                  </TableCell>
                </TableRow>
              ) : filteredProfessors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6">
                    {searchTerm ? "Nenhum professor encontrado com este termo." : "Nenhum professor cadastrado."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredProfessors.map((professor) => (
                  <TableRow key={professor.id}>
                    <TableCell className="font-medium">
                      {professor.nome || "—"}
                    </TableCell>
                    <TableCell>{professor.login}</TableCell>
                    <TableCell>{professor.escola || "—"}</TableCell>
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
                            onClick={() => openEditDialog(professor)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openDeleteDialog(professor)}
                            className="text-red-500"
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Excluir
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
              Você tem certeza que deseja excluir o professor{" "}
              <strong>{selectedProfessor?.nome || selectedProfessor?.login}</strong>? Esta ação não pode ser desfeita.
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

      {/* Edit Professor Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Professor</DialogTitle>
            <DialogDescription>
              Edite as informações do professor.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEditSubmit)} className="space-y-4 py-2">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Digite o nome completo"
                        {...field}
                        disabled={editLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="login"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Login</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Digite o login"
                        {...field}
                        disabled={editLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="escola"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Escola</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Digite a escola"
                        {...field}
                        disabled={editLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setEditDialogOpen(false)}
                  disabled={editLoading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={editLoading}
                >
                  {editLoading ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default Professores;
