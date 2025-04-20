
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ProfessorLayout from "@/components/layout/ProfessorLayout";
import { PageTitle } from "@/components/ui/page-title";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import ProjectService from "@/services/project.service";
import { useAuth } from "@/hooks/useAuth";
import { AlertCircle, CalendarIcon, Check } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import type { ProjectPayload } from "@/services/project.service";

const projectSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  objetivo: z.string().min(1, "Objetivo é obrigatório"),
  dataInicio: z.date({ required_error: "Data de início é obrigatória" }),
  escopo: z.string().min(1, "Escopo é obrigatório"),
  publicoAlvo: z.string().min(1, "Público-alvo é obrigatório"),
});

type ProjectFormData = z.infer<typeof projectSchema>;

const SolicitarProjeto: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingName, setIsCheckingName] = useState(false);

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      nome: "",
      objetivo: "",
      escopo: "",
      publicoAlvo: "",
    },
  });

  const onSubmit = async (data: ProjectFormData) => {
    if (!user?.id) {
      setError("Usuário não autenticado");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      setIsCheckingName(true);
      const exists = await ProjectService.checkProjectNameExists(data.nome);
      setIsCheckingName(false);

      if (exists) {
        setError("Já existe um projeto com este nome. Por favor, escolha outro nome.");
        setIsLoading(false);
        return;
      }

      // Modificando a estrutura do payload para enviar professor como objeto
      const payload: ProjectPayload = {
        name: data.nome,
        objetivo: data.objetivo,
        data: data.dataInicio.toISOString(),
        escopo: data.escopo,
        "publico-alvo": data.publicoAlvo,
        status: "AGUARDANDO_ANALISE_PRELIMINAR",
      };

      await ProjectService.createProject(payload);

      setSuccess("Projeto solicitado com sucesso! Aguarde a análise preliminar.");
      toast({
        title: "Projeto solicitado",
        description: "Seu projeto foi enviado para análise.",
      });

      form.reset();
      setTimeout(() => navigate("/meus-projetos"), 2000);
    } catch (err) {
      console.error("Error submitting project:", err);
      setError("Erro ao solicitar projeto. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProfessorLayout>
      <PageTitle
        title="Solicitar Novo Projeto"
        description="Preencha o formulário com os detalhes do projeto que deseja solicitar"
      />

      <Card>
        <CardContent className="pt-6">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-6 border-green-500 text-green-700 bg-green-50">
              <Check className="h-4 w-4" />
              <AlertTitle>Sucesso</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Nome */}
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Projeto</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o nome do projeto" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormDescription>O nome deve ser único para identificar o projeto</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Objetivo */}
              <FormField
                control={form.control}
                name="objetivo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Objetivo</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Descreva o objetivo do projeto" className="min-h-20" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Data de Início */}
              <FormField
                control={form.control}
                name="dataInicio"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data de Início</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                            disabled={isLoading}
                          >
                            {field.value ? format(field.value, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : <span>Selecione uma data</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={date => date < new Date(new Date().setHours(0, 0, 0, 0))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Escopo */}
              <FormField
                control={form.control}
                name="escopo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Escopo</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Descreva o escopo do projeto" className="min-h-20" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Público-alvo */}
              <FormField
                control={form.control}
                name="publicoAlvo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Público-alvo</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Defina o público-alvo do projeto" className="min-h-20" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Botão */}
              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading || isCheckingName}>
                  {isLoading
                    ? "Enviando solicitação..."
                    : isCheckingName
                    ? "Verificando nome..."
                    : "Solicitar Projeto"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </ProfessorLayout>
  );
};

export default SolicitarProjeto;
