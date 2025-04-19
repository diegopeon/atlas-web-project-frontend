
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  sub: string;
  role: "ADMINISTRADOR" | "PROFESSOR";
  exp: number;
  login: string;
}

const TOKEN_KEY = 'atlas_token';

export const tokenUtils = {
  // Armazena o token no sessionStorage
  setToken(token: string) {
    sessionStorage.setItem(TOKEN_KEY, token);
  },

  // Recupera o token do sessionStorage
  getToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY);
  },

  // Remove o token do sessionStorage
  removeToken() {
    sessionStorage.removeItem(TOKEN_KEY);
  },

  // Verifica se o token é válido (não expirado)
  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const currentTime = Date.now() / 1000;
      
      // Verifica se o token possui a informação de 'role' no formato esperado
      if (!decoded.role) {
        console.error("Token não possui informação de 'role'");
        return false;
      }
      
      return decoded.exp > currentTime;
    } catch (error) {
      console.error("Erro ao validar token:", error);
      return false;
    }
  },

  // Decodifica o token e retorna o payload
  decodeToken(token: string): JwtPayload | null {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      
      // Se a role vier com prefixo ROLE_, removemos
      if (decoded.role && typeof decoded.role === 'string' && decoded.role.startsWith('ROLE_')) {
        decoded.role = decoded.role.replace('ROLE_', '') as "ADMINISTRADOR" | "PROFESSOR";
      }
      
      return decoded;
    } catch (error) {
      console.error("Erro ao decodificar token:", error);
      return null;
    }
  }
};
