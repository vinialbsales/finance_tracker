// Tela de listagem de categorias.

import { useCategories } from "../../hooks/useCategories";

export function CategoriesPage() {
  const { data: categories, isLoading, error } = useCategories();

  if (isLoading) return <p>Loading..</p>
  if (error) return <p>An error occurred: {error.message}</p>

  return (
    <ul>
      {categories?.map((category) => (
        <li key={category.id} className="flex gap-1.5 items-center">
          {category.name}
          <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: category.color ?? "#808080" }}></span>
        </li>
      ))}
    </ul>
  )
}
