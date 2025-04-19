import React, { createContext, useState, useEffect, ReactNode } from "react";
import { User } from "@/types";
import AuthService from "@/services/auth.service";
import { tokenUtils } from "@/utils/tokenUtils";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (login: string, password: string, navigate: any) => Promise<void>;
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
      tokenUtils.removeToken();
      setUser(null);
    }
    setLoading(false);
  }, []);

  const login = async (login: string, password: string, navigate: any) => {
    try {
      setLoading(true);
      const response = await AuthService.login({ login, password });

      tokenUtils.setToken(response.token);
      const decoded = tokenUtils.decodeToken(response.token);
      if (decoded) {
        const newUser = {
          id: decoded.sub,
          login: decoded.login,
          role: decoded.role,
        };
        setUser(newUser);

        // Redirecionar com base na role
        if (newUser.role === "ADMINISTRADOR") {
          navigate("/dashboard-admin");
        } else {
          navigate("/dashboard-professor");
        }
      } else {
        throw new Error("Token inválido ou sem as informações necessárias");
      }

      return Promise.resolve();
    } catch (error) {
      console.error("Login error:", error);
      setUser(null);
      tokenUtils.removeToken();
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
