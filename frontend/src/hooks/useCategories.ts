// Hook customizado usando React Query, consumindo as funções de api/categories.ts.
import { listAllCategories } from "../api/categories";
import { useQuery } from "@tanstack/react-query";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: listAllCategories
  });
}
