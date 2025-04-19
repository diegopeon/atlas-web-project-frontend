// User types
export interface User {
  id: string;
  login: string;
  role: "ADMINISTRADOR" | "PROFESSOR";
}

export interface AuthResponse {
  token: string;
}

export interface LoginCredentials {
  login: string;
  password: string;
}

export interface RegisterProfessorData {
  login: string;
  password: string;
  role: "PROFESSOR";
}

export interface RegisterAdminData {
  login: string;
  password: string;
  role: "ADMINISTRADOR";
}

// Project types
export interface Project {
  id: string;
  nome: string;
  objetivo: string;
  dataInicio: string; // ISO format
  escopo: string;
  publicoAlvo: string;
  status: ProjectStatus;
  professorId: string; // Mantido para facilitar uso no frontend
  professor?: { id: string; login?: string }; // Adicionado para compatibilidade com backend
}

// Tipo usado apenas para envio ao backend
export interface ProjectPayload {
  name: string;
  objetivo: string;
  data: string; // backend espera campo chamado "data"
  escopo: string;
  "publico-alvo": string;
  status: ProjectStatus;
  professor: { id: number }; // Alterado para objeto professor com id
}

export type ProjectStatus =
  | "AGUARDANDO_ANALISE_PRELIMINAR"
  | "EM_ANALISE"
  | "PROJETO_RECUSADO"
  | "EM_ANDAMENTO"
  | "FINALIZADO";

// Group types (for frontend representation)
export interface Group {
  id: string;
  nome: string;
  professorCoordenador: string;
  alunos: string[];
  disponivel: boolean;
  projetoId?: string;
}
