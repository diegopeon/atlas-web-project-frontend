
import React, { createContext, useState, useEffect, ReactNode } from "react";
import { User } from "@/types";
import AuthService from "@/services/auth.service";
import { jwtDecode } from "jwt-decode";

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
    // Check if we have a token in local storage
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        
        // Check if token is expired
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          // Token expired
          localStorage.removeItem("token");
          setUser(null);
        } else {
          // Valid token, set user
          setUser({
            id: decoded.sub,
            login: decoded.login,
            role: decoded.role,
          });
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  const login = async (login: string, password: string) => {
    try {
      setLoading(true);
      const response = await AuthService.login({ login, password });
      
      // Save token to local storage
      localStorage.setItem("token", response.token);
      
      // Decode token to get user info
      const decoded = jwtDecode<JwtPayload>(response.token);
      
      // Set user state
      setUser({
        id: decoded.sub,
        login: decoded.login,
        role: decoded.role,
      });
      
      return Promise.resolve();
    } catch (error) {
      console.error("Login error:", error);
      return Promise.reject(error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    AuthService.logout();
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
