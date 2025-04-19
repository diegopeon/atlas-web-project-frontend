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

interface JwtPayload {
  sub: string;
  role: "ADMINISTRADOR" | "PROFESSOR";
  exp: number;
  login: string;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: () => {},
  isAuthenticated: false,
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verifica o token ao iniciar
    const token = tokenUtils.getToken();
    if (token && tokenUtils.isTokenValid()) {
      const decoded = tokenUtils.decodeToken(token);
      if (decoded) {
        setUser({
          id: decoded.sub,
          login: decoded.login,
          role: decoded.role,
        });
      }
    } else {
      tokenUtils.removeToken(); // Remove token se inválido
    }
    setLoading(false);
  }, []);

  const login = async (login: string, password: string) => {
    try {
      setLoading(true);
      const response = await AuthService.login({ login, password });
      
      // Armazena o token
      tokenUtils.setToken(response.token);
      
      // Decodifica e configura o usuário
      const decoded = tokenUtils.decodeToken(response.token);
      if (decoded) {
        setUser({
          id: decoded.sub,
          login: decoded.login,
          role: decoded.role,
        });
      }
      
      return Promise.resolve();
    } catch (error) {
      console.error("Login error:", error);
      return Promise.reject(error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    tokenUtils.removeToken();
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
