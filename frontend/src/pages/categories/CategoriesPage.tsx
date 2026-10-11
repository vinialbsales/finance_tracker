// Tela de listagem de categorias.

import type { ReactNode } from "react";
import { useCategories } from "../../hooks/useCategories";
import { CategoryForm } from "./CategoryForm";
import { PageHeader } from "../../components/ui/PageHeader";
import { Panel } from "../../components/ui/Panel";
import { CategoryDot } from "../../components/ui/CategoryDot";
import { EmptyState, ErrorState, LoadingState } from "../../components/ui/States";
import { formatDate } from "../../lib/format";

export function CategoriesPage() {
  const { data: categories, isLoading, error } = useCategories();

  if (isLoading) return <CategoriesLayout><LoadingState label="Carregando categorias…" /></CategoriesLayout>
  if (error) return <CategoriesLayout><ErrorState message={error.message} /></CategoriesLayout>

  return (
    <CategoriesLayout count={categories?.length}>
      {categories?.length === 0 ? (
        <EmptyState
          title="Nenhuma categoria ainda"
          description="Crie a primeira categoria ao lado para começar a organizar suas transações."
        />
      ) : (
        <ul className="divide-y divide-zinc-100">
          {categories?.map((category) => (
            <li key={category.id} className="flex items-center gap-3 px-5 py-3.5">
              <CategoryDot color={category.color} size="md" />
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-zinc-900">{category.name}</span>
              <span className={`hidden text-xs text-zinc-400 sm:inline ${category.color ? "font-mono uppercase" : ""}`}>
                {category.color ?? "Sem cor"}
              </span>
              <span className="w-28 shrink-0 text-right text-xs text-zinc-500">{formatDate(category.createdAt)}</span>
            </li>
          ))}
        </ul>
      )}
    </CategoriesLayout>
  )
}

// Same element in every branch above, so CategoryForm keeps its state while the list reloads.
function CategoriesLayout({ count, children }: { count?: number; children: ReactNode }) {
  return (
    <div className="space-y-8">
      <PageHeader title="Categorias" description="Agrupe suas transações e defina a cor usada nas listas e nos gráficos." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        <Panel
          title="Todas as categorias"
          action={count !== undefined && <span className="text-xs tabular-nums text-zinc-400">{count}</span>}
        >
          {children}
        </Panel>

        <Panel title="Nova categoria" className="lg:sticky lg:top-10">
          <CategoryForm />
        </Panel>
      </div>
    </div>
  )
}
