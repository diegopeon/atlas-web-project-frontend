
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { AlertCircle } from "lucide-react";

const loginSchema = z.object({
  login: z.string().min(1, "Login é obrigatório"),
  password: z.string().min(1, "Senha é obrigatória"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const { login, user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      login: "",
      password: "",
    },
  });

  // Este effect é responsável pelo redirecionamento após login bem-sucedido
  useEffect(() => {
    console.log("Login useEffect - Auth state:", { isAuthenticated, user, loading, loginSuccess });
    
    // Só tentamos redirecionar se o login foi bem-sucedido e não estamos mais carregando
    if (loginSuccess && !loading) {
      if (isAuthenticated) {
        console.log("Redirecionando usuário autenticado:", user?.role);
        
        if (user?.role === "ADMINISTRADOR") {
          navigate("/dashboard-admin");
        } else if (user?.role === "PROFESSOR") {
          navigate("/dashboard-professor");
        } else {
          console.log("Role não reconhecida, redirecionando para '/'");
          navigate("/");
        }
      } else {
        console.log("Login bem-sucedido mas usuário não está autenticado");
        setError("Erro de autenticação. Por favor, tente novamente.");
        setLoginSuccess(false);
      }
    }
  }, [isAuthenticated, user, loading, loginSuccess, navigate]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      console.log("Tentando login com:", data.login);
      setIsLoading(true);
      setError(null);
      setLoginSuccess(false);

      await login(data.login, data.password);
      console.log("Login bem-sucedido no componente Login");

      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo ao sistema Atlas!",
      });
      
      // Marcamos que o login foi bem-sucedido para acionar o useEffect de redirecionamento
      setLoginSuccess(true);
    } catch (err) {
      console.error("Login error:", err);
      setError("Credenciais inválidas. Por favor, tente novamente.");
      setLoginSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Atlas</CardTitle>
            <CardDescription className="text-center">
              Entre com suas credenciais para acessar o sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="login"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Login</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Digite seu login"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
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
                          placeholder="Digite sua senha"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Entrando..." : "Entrar"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Não possui uma conta?{" "}
              <Link
                to="/cadastro-professor"
                className="text-blue-600 hover:underline"
              >
                Cadastre-se como professor
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
