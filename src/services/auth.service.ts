
import api from "./api";
import { AuthResponse, LoginCredentials, RegisterProfessorData, RegisterAdminData } from "@/types";

const AuthService = {
  // Login for both professors and admins
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/login", credentials);
    return response.data;
  },

  // Register a new professor
  async registerProfessor(data: RegisterProfessorData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/register/professor", data);
    return response.data;
  },

  // Register a new admin (only admin can do this)
  async registerAdmin(data: RegisterAdminData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/register/adm", data);
    return response.data;
  },

  // Logout (client-side only)
  logout() {
    localStorage.removeItem("token");
  }
};

export default AuthService;
