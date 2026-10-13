// Função que chama /api/categories (getAll), tipada com os tipos de types/category.ts.
// As categorias são fixas (seed do Flyway), então a API é somente leitura.
// Usa a instância de api/axiosClient.ts.
import { api } from "./axiosClient";
import type { CategoryResponse } from "../types/category";

export async function listAllCategories(): Promise<CategoryResponse[]> {
  const response = await api.get<CategoryResponse[]>("/categories");
  return response.data;
}
