
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
    if (token && tokenUtils.isTokenValid()) {
      const decoded = tokenUtils.decodeToken(token);
      if (decoded) {
        setUser({
          id: decoded.sub,
          login: decoded.login,
          role: decoded.role,
        });
        return true;
      }
    } else {
      tokenUtils.removeToken();
      setUser(null);
    }
    return false;
  };

  useEffect(() => {
    loadUser();
    setLoading(false);
  }, []);

  const login = async (login: string, password: string) => {
    setLoading(true);
    try {
      const response = await AuthService.login({ login, password });
      tokenUtils.setToken(response.token);
      // Carregar usuário após login bem-sucedido
      loadUser();
    } catch (error) {
      tokenUtils.removeToken();
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    tokenUtils.removeToken();
    setUser(null);
  };

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
