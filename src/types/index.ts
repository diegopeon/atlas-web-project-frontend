
// User types
export interface User {
  id: string;
  login: string;
  role: "ADMINISTRADOR" | "PROFESSOR";
  escola?: string;
  nome?: string;
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
  escola: string;
  nome: string;
  role: "PROFESSOR";
}

export interface RegisterAdminData {
  login: string;
  password: string;
  nome: string;
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
  professorId: string;
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
