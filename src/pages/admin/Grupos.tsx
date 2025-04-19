
import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { PageTitle } from "@/components/ui/page-title";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Group } from "@/types";
import UserService from "@/services/user.service";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@/types";
import { PlusCircle, UserPlus, Users, X } from "lucide-react";

// Mock data for groups since we don't have a real API for this
const mockGroups: Group[] = [
  {
    id: "1",
    nome: "Grupo A",
    professorCoordenador: "Prof. João Silva",
    alunos: ["Ana Maria", "Pedro Santos", "Carla Oliveira"],
    disponivel: true,
  },
  {
    id: "2",
    nome: "Grupo B",
    professorCoordenador: "Prof. Maria Souza",
    alunos: ["Lucas Ferreira", "Julia Martins"],
    disponivel: true,
    projetoId: "projeto-123",
  },
  {
    id: "3",
    nome: "Grupo C",
    professorCoordenador: "Prof. Carlos Mendes",
    alunos: ["Marcos Lima", "Fernanda Costa", "Bruno Dias", "Patrícia Almeida"],
    disponivel: false,
  },
];

const groupSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  professorCoordenador: z.string().min(1, "Coordenador é obrigatório"),
  disponivel: z.boolean().default(true),
});

type GroupFormData = z.infer<typeof groupSchema>;

const alunoSchema = z.object({
  nome: z.string().min(1, "Nome do aluno é obrigatório"),
});

type AlunoFormData = z.infer<typeof alunoSchema>;

const Grupos: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>(mockGroups);
  const [professors, setProfessors] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [addAlunoDialogOpen, setAddAlunoDialogOpen] = useState(false);
  const [currentGroupId, setCurrentGroupId] = useState<string | null>(null);
  
  const { toast } = useToast();

  const form = useForm<GroupFormData>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      nome: "",
      professorCoordenador: "",
      disponivel: true,
    },
  });

  const alunoForm = useForm<AlunoFormData>({
    resolver: zodResolver(alunoSchema),
    defaultValues: {
      nome: "",
    },
  });

  useEffect(() => {
    const fetchProfessors = async () => {
      try {
        setLoading(true);
        const data = await UserService.getAllProfessors();
        setProfessors(data);
      } catch (error) {
        console.error("Error fetching professors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfessors();
  }, []);

  const handleCreateGroup = (data: GroupFormData) => {
    const newGroup: Group = {
      id: `group-${Date.now()}`,
      nome: data.nome,
      professorCoordenador: data.professorCoordenador,
      alunos: [],
      disponivel: data.disponivel,
    };

    setGroups([...groups, newGroup]);
    setCreateDialogOpen(false);
    form.reset();

    toast({
      title: "Grupo criado",
      description: "O grupo foi criado com sucesso",
    });
  };

  const handleToggleAvailability = (id: string) => {
    setGroups(
      groups.map((group) =>
        group.id === id
          ? { ...group, disponivel: !group.disponivel }
          : group
      )
    );

    toast({
      title: "Status atualizado",
      description: "Disponibilidade do grupo alterada com sucesso",
    });
  };

  const handleAddAluno = (data: AlunoFormData) => {
    if (!currentGroupId) return;

    setGroups(
      groups.map((group) =>
        group.id === currentGroupId
          ? { ...group, alunos: [...group.alunos, data.nome] }
          : group
      )
    );

    setAddAlunoDialogOpen(false);
    alunoForm.reset();

    toast({
      title: "Aluno adicionado",
      description: "O aluno foi adicionado ao grupo com sucesso",
    });
  };

  const handleRemoveAluno = (groupId: string, alunoIndex: number) => {
    setGroups(
      groups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              alunos: group.alunos.filter((_, index) => index !== alunoIndex),
            }
          : group
      )
    );

    toast({
      title: "Aluno removido",
      description: "O aluno foi removido do grupo",
    });
  };

  const openAddAlunoDialog = (groupId: string) => {
    setCurrentGroupId(groupId);
    setAddAlunoDialogOpen(true);
  };

  return (
    <AdminLayout>
      <PageTitle
        title="Gerenciar Grupos"
        description="Visualize e gerencie os grupos de trabalho"
      />

      <div className="flex justify-end mb-6">
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Users className="mr-2 h-4 w-4" />
              Novo Grupo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Grupo</DialogTitle>
              <DialogDescription>
                Preencha as informações do novo grupo de trabalho.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCreateGroup)} className="space-y-4 py-2">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Grupo</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o nome do grupo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="professorCoordenador"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Professor Coordenador</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nome do professor coordenador"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="disponivel"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Disponível para Projetos</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
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
                    onClick={() => setCreateDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">Criar Grupo</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <Card key={group.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{group.nome}</CardTitle>
                <Badge
                  variant={group.disponivel ? "outline" : "secondary"}
                  className={
                    group.disponivel
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-gray-100 text-gray-700"
                  }
                >
                  {group.disponivel ? "Disponível" : "Indisponível"}
                </Badge>
              </div>
              <CardDescription>
                Coordenador: {group.professorCoordenador}
              </CardDescription>
              {group.projetoId && (
                <CardDescription className="mt-1">
                  Projeto associado
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <h4 className="font-medium text-sm mb-2">Alunos</h4>
                  {group.alunos.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Nenhum aluno neste grupo
                    </p>
                  ) : (
                    <div className="space-y-1">
                      {group.alunos.map((aluno, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-muted px-3 py-1 rounded-md"
                        >
                          <span className="text-sm">{aluno}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleRemoveAluno(group.id, index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-between">
              <Button
                variant="outline"
                onClick={() => openAddAlunoDialog(group.id)}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Adicionar Aluno
              </Button>
              <Button
                variant={group.disponivel ? "secondary" : "default"}
                onClick={() => handleToggleAvailability(group.id)}
              >
                {group.disponivel ? "Marcar Indisponível" : "Marcar Disponível"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Add Aluno Dialog */}
      <Dialog open={addAlunoDialogOpen} onOpenChange={setAddAlunoDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Aluno</DialogTitle>
            <DialogDescription>
              Adicione um novo aluno ao grupo.
            </DialogDescription>
          </DialogHeader>
          <Form {...alunoForm}>
            <form onSubmit={alunoForm.handleSubmit(handleAddAluno)} className="space-y-4 py-2">
              <FormField
                control={alunoForm.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Aluno</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o nome do aluno" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setAddAlunoDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">Adicionar</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default Grupos;
