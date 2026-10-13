// Hook customizado usando React Query, consumindo as funções de api/categories.ts.
import { listAllCategories, getCategory, patchCategory } from "../api/categories";
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
