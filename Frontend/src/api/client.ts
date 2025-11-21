import axios from "axios";

// Istanza Axios condivisa con baseURL e timeout, con interceptor JWT
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
  timeout: 8000,
});

// Gestione token da localStorage
function getToken(): string | null {
  try {
    return localStorage.getItem("hextech.jwt") || null;
  } catch {
    return null;
  }
}

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers || {};
    (config.headers as any)["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default api;