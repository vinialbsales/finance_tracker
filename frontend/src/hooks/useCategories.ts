// Hook customizado usando React Query, consumindo as funções de api/categories.ts.
import { createCategory, listAllCategories, getCategory, patchCategory, deleteCategory } from "../api/categories";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import type { CategoryRequest } from "../types/category";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: listAllCategories
  });
}

export function useCategoryById(id: number) {
  return useQuery({
    queryKey: ["categories", id],
    queryFn: () => getCategory(id),
  })
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
    },
    onError: (err) => {
      console.error("Failed to create the Category", err)
    }
  })
}

export function usePatchCategory(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: Partial<CategoryRequest>) => patchCategory(id, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
    },
    onError: (err) => {
      console.error("Failed to update the Category", err)
    }
  })
}

export function useDeleteCategory(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
    },
    onError: (err) => {
      console.error("Failed to delete the Category", err)
    }
  })
}
