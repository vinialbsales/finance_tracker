// Funções que chamam /api/categories (getAll, getById, create, update via PATCH, remove),
// tipadas com os tipos de types/category.ts. Usa a instância de api/axiosClient.ts.
import { api } from "./axiosClient";
import type { CategoryRequest } from "../types/category";
import type { CategoryResponse } from "../types/category";

export async function createCategory(request: CategoryRequest): Promise<CategoryResponse> {
  const response = await api.post<CategoryResponse>("/categories", request);
  return response.data;
}

export async function listAllCategories(): Promise<CategoryResponse[]> {
  const response = await api.get<CategoryResponse[]>("/categories");
  return response.data;
}

export async function getCategory(id: number): Promise<CategoryResponse> {
  const response = await api.get<CategoryResponse>(`/categories/${id}`);
  return response.data;
}

export async function patchCategory(id: number, request: Partial<CategoryRequest>): Promise<CategoryResponse> {
  const response = await api.patch<CategoryResponse>(`/categories/${id}`, request);
  return response.data;
}

export async function deleteCategory(id: number): Promise<void> {
  await api.delete<void>(`/categories/${id}`);
}
