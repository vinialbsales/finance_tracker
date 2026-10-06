// Instância do Axios configurada: baseURL apontando para o backend em /api e headers padrão.
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
})
