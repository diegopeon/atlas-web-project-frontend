import api from "./api";
import { Project } from "@/types";

// Payload que o backend espera (sem o campo professor)
export type ProjectPayload = {
  name: string;
  objetivo: string;
  data: string;
  escopo: string;
  "publico-alvo": string;
  status?: string; // o backend define automaticamente, mas pode ser útil manter opcional
};

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
};

const ProjectService = {
  async getAllProjects(): Promise<Project[]> {
    const response = await api.get<Project[]>("/project", {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  async getProjectById(id: string): Promise<Project> {
    const response = await api.get<Project>(`/project/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  async createProject(project: ProjectPayload): Promise<Project> {
    const response = await api.post<Project>("/project", project, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  async updateProject(id: string, project: Partial<Project>): Promise<Project> {
    const response = await api.put<Project>(`/project/${id}`, project, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  async deleteProject(id: string): Promise<void> {
    await api.delete(`/project/${id}`, {
      headers: getAuthHeaders(),
    });
  },

  async checkProjectNameExists(nome: string): Promise<boolean> {
    const projects = await this.getAllProjects();
    return projects.some(
      project =>
        typeof project.name === "string" &&
        project.name.toLowerCase() === nome.toLowerCase()
    );
  }
};

export default ProjectService;
