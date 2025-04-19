
import api from "./api";
import { Project } from "@/types";

// Payload que o backend espera
export type ProjectPayload = {
  name: string;
  objetivo: string;
  data: string;
  escopo: string;
  "publico-alvo": string;
  status: string;
  professor: { id: number }; // Alterado de professorId para professor com objeto contendo id
};

const ProjectService = {
  async getAllProjects(): Promise<Project[]> {
    const response = await api.get<Project[]>("/project");
    return response.data;
  },

  async getProjectById(id: string): Promise<Project> {
    const response = await api.get<Project>(`/project/${id}`);
    return response.data;
  },

  async createProject(project: ProjectPayload): Promise<Project> {
    const response = await api.post<Project>("/project", project);
    return response.data;
  },

  async updateProject(id: string, project: Partial<Project>): Promise<Project> {
    // Adaptar o projeto para o formato esperado pelo backend se necessário
    const adaptedProject = { ...project };
    
    // Se professorId estiver presente, converta para o formato professor: { id: number }
    if (project.professorId) {
      (adaptedProject as any).professor = { id: Number(project.professorId) };
      delete (adaptedProject as any).professorId;
    }
    
    const response = await api.put<Project>(`/project/${id}`, adaptedProject);
    return response.data;
  },

  async deleteProject(id: string): Promise<void> {
    await api.delete(`/project/${id}`);
  },

  async checkProjectNameExists(nome: string): Promise<boolean> {
    const projects = await this.getAllProjects();
    return projects.some(
      project =>
        typeof (project as any).nome === "string" &&
        (project as any).nome.toLowerCase() === nome.toLowerCase()
    );
  },
};

export default ProjectService;
