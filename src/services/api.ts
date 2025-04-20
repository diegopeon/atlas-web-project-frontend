import axios from "axios";
import { tokenUtils } from "@/utils/tokenUtils";

// Cria instância do axios com URL base
const api = axios.create({
  baseURL: "http://localhost:8080/atlas",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor de requisição: insere token automaticamente
api.interceptors.request.use(
  (config) => {
    const token = tokenUtils.getToken();

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de resposta: trata 401 (token expirado)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      tokenUtils.removeToken();

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
