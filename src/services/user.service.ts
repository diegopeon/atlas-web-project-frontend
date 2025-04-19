
import api from "./api";
import { User } from "@/types";

const UserService = {
  // Get all professors
  async getAllProfessors(): Promise<User[]> {
    const response = await api.get<User[]>("/professor");
    return response.data;
  },

  // Get professor by ID
  async getProfessorById(id: string): Promise<User> {
    const response = await api.get<User>(`/professor/${id}`);
    return response.data;
  },

  // Update professor
  async updateProfessor(id: string, data: Partial<User>): Promise<User> {
    const response = await api.put<User>(`/professor/${id}`, data);
    return response.data;
  },

  // Delete professor
  async deleteProfessor(id: string): Promise<void> {
    await api.delete(`/professor/${id}`);
  },

  // Get all admins
  async getAllAdmins(): Promise<User[]> {
    const response = await api.get<User[]>("/adm");
    return response.data;
  },

  // Get admin by ID
  async getAdminById(id: string): Promise<User> {
    const response = await api.get<User>(`/adm/${id}`);
    return response.data;
  },

  // Update admin
  async updateAdmin(id: string, data: Partial<User>): Promise<User> {
    const response = await api.put<User>(`/adm/${id}`, data);
    return response.data;
  },

  // Delete admin
  async deleteAdmin(id: string): Promise<void> {
    await api.delete(`/adm/${id}`);
  }
};

export default UserService;
