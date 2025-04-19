
// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from "react";
import { User } from "@/types";
import AuthService from "@/services/auth.service";
import { tokenUtils } from "@/utils/tokenUtils";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (login: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Função para carregar o usuário a partir do token
  const loadUser = () => {
    const token = tokenUtils.getToken();
    console.log("Token armazenado:", token ? "Token existe" : "Token não existe");
    
    if (token && tokenUtils.isTokenValid()) {
      const decoded = tokenUtils.decodeToken(token);
      console.log("Token decodificado:", decoded);
      
      if (decoded) {
        const userData = {
          id: decoded.sub,
          login: decoded.login,
          role: decoded.role,
        };
        console.log("Dados do usuário extraídos:", userData);
        setUser(userData);
        return true;
      }
    } else {
      console.log("Token inválido ou não existente, removendo...");
      tokenUtils.removeToken();
      setUser(null);
    }
    return false;
  };

  useEffect(() => {
    console.log("AuthProvider: Verificando autenticação inicial");
    const authenticated = loadUser();
    console.log("Autenticação inicial:", authenticated ? "Autenticado" : "Não autenticado");
    setLoading(false);
  }, []);

  const login = async (login: string, password: string) => {
    console.log("Iniciando login para:", login);
    setLoading(true);
    try {
      const response = await AuthService.login({ login, password });
      console.log("Login bem-sucedido, token recebido");
      tokenUtils.setToken(response.token);
      
      // Carregar usuário após login bem-sucedido
      const success = loadUser();
      console.log("Carregamento do usuário após login:", success ? "Sucesso" : "Falha");
      
      if (!success) {
        throw new Error("Falha ao carregar dados do usuário após login");
      }
    } catch (error) {
      console.error("Erro no login:", error);
      tokenUtils.removeToken();
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    console.log("Realizando logout");
    tokenUtils.removeToken();
    setUser(null);
  };

  console.log("Estado atual do Auth Context:", { 
    isAuthenticated: !!user, 
    userRole: user?.role || "sem role",
    loading 
  });

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
