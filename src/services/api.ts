
import axios from "axios";
import { tokenUtils } from "@/utils/tokenUtils";

// Create axios instance with base URL
const api = axios.create({
  baseURL: "http://localhost:8080/atlas",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to add token to requests
api.interceptors.request.use(
  (config) => {
    const token = tokenUtils.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      tokenUtils.removeToken();
      
      // Avoid redirect loop if already on login page
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
