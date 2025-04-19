
import axios from "axios";
import { tokenUtils } from "@/utils/tokenUtils";

const api = axios.create({
  baseURL: "http://localhost:8080/atlas",
});

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use((config) => {
  const token = tokenUtils.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratamento de erros globais
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Se receber 401, remove o token e redireciona para login
    if (error.response?.status === 401) {
      tokenUtils.removeToken();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
