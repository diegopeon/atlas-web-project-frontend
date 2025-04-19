
import api from "./api";
import { Project } from "@/types";

const ProjectService = {
  // Get all projects
  async getAllProjects(): Promise<Project[]> {
    const response = await api.get<Project[]>("/project");
    return response.data;
  },

  // Get project by ID
  async getProjectById(id: string): Promise<Project> {
    const response = await api.get<Project>(`/project/${id}`);
    return response.data;
  },

  // Create new project
  async createProject(project: Omit<Project, "id">): Promise<Project> {
    const response = await api.post<Project>("/project", project);
    return response.data;
  },

  // Update project
  async updateProject(id: string, project: Partial<Project>): Promise<Project> {
    const response = await api.put<Project>(`/project/${id}`, project);
    return response.data;
  },

  // Delete project
  async deleteProject(id: string): Promise<void> {
    await api.delete(`/project/${id}`);
  },

  // Check if project with this name already exists
  async checkProjectNameExists(nome: string): Promise<boolean> {
    const projects = await this.getAllProjects();
    return projects.some(project => project.nome.toLowerCase() === nome.toLowerCase());
  }
};

export default ProjectService;
