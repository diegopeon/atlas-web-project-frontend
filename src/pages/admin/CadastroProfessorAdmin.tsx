
import React, { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { PageTitle } from "@/components/ui/page-title";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import AuthService from "@/services/auth.service";
import { AlertCircle, Check } from "lucide-react";

const professorSchema = z.object({
  login: z.string().min(1, "Login é obrigatório").email("Formato de email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string().min(1, "Confirme sua senha"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type ProfessorFormData = z.infer<typeof professorSchema>;

const CadastroProfessorAdmin: React.FC = () => {
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProfessorFormData>({
    resolver: zodResolver(professorSchema),
    defaultValues: {
      login: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ProfessorFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);
      
      await AuthService.registerProfessor({
        login: data.login,
        password: data.password,
        role: "PROFESSOR",
      });
      
      setSuccess("Professor cadastrado com sucesso!");
      toast({
        title: "Professor cadastrado",
        description: "O professor foi registrado com sucesso no sistema.",
      });
      
      // Reset form
      form.reset();
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(
        err.response?.data?.message || 
        "Erro ao cadastrar professor. Tente novamente."
      );
      toast({
        title: "Erro",
        description: "Não foi possível cadastrar o professor",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <PageTitle
        title="Cadastrar Professor"
        description="Registre um novo professor no sistema"
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
              <FormField
                control={form.control}
                name="login"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Digite o email"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      O email será usado para acessar o sistema
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Digite a senha"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      A senha deve ter pelo menos 6 caracteres
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar Senha</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Confirme a senha"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Cadastrando..." : "Cadastrar Professor"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default CadastroProfessorAdmin;
