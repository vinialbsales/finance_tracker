// Tela de listagem de transações.

import { useState } from "react";
import type { ReactNode } from "react";
import { ArrowLeftRight } from "lucide-react";
import type { CategoryResponse } from "../../types/category";
import type { TransactionResponse } from "../../types/transaction";
import { useTransactions } from "../../hooks/useTransactions";
import { useCategories } from "../../hooks/useCategories";
import { TransactionForm } from "./TransactionForm";
import { TransactionActions } from "./TransactionActions";
import { PageHeader } from "../../components/ui/PageHeader";
import { Panel } from "../../components/ui/Panel";
import { TransactionRow } from "../../components/ui/TransactionRow";
import { EmptyState, ErrorState, Skeleton, SkeletonStatus } from "../../components/ui/States";
import { subtleButtonClass } from "../../lib/ui";

const SKELETON_ROWS = 6;

// Row-shaped placeholders in the list panel while the history loads.
function TransactionListSkeleton() {
  return (
    <SkeletonStatus label="Carregando transações…">
      <div className="divide-y divide-zinc-100">
        {Array.from({ length: SKELETON_ROWS }, (_, row) => (
          <div key={row} className="flex items-center justify-between gap-4 px-5 py-3.5">
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-36" />
              <Skeleton className="h-3 w-24" />
            </div>
            <div className="flex flex-col items-end space-y-2">
              <Skeleton className="h-3.5 w-20" />
              <Skeleton className="h-3 w-12" />
            </div>
          </div>
        ))}
      </div>
    </SkeletonStatus>
  );
}

export function TransactionsPage() {
  const { data: transactions, isLoading, error, refetch } = useTransactions();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const [editingId, setEditingId] = useState<number | null>(null);

  if (isLoading || categoriesLoading) return <TransactionsLayout><TransactionListSkeleton /></TransactionsLayout>
  if (error) return <TransactionsLayout><ErrorState message={error.message} onRetry={() => refetch()} /></TransactionsLayout>

  const categoriesById = new Map(categories?.map((category) => [category.id, category]));
  // Newest first; transactions without a date fall back to when they were created.
  // Derived from the list, so a transaction deleted while being edited closes the form.
  const editing = transactions?.find((transaction) => transaction.id === editingId);
  const editingProps = {
    editing,
    editingCategory: editing?.categoryId != null ? categoriesById.get(editing.categoryId) : undefined,
    onStopEditing: () => setEditingId(null),
  };

  const sorted = [...(transactions ?? [])].sort((a, b) =>
    (b.date ?? b.createdAt).localeCompare(a.date ?? a.createdAt) || b.id - a.id
  );

  return (
    <TransactionsLayout count={sorted.length} {...editingProps}>
      {sorted.length === 0 ? (
        <EmptyState
          icon={ArrowLeftRight}
          title="Nenhuma transação ainda"
          description="Registre sua primeira receita ou despesa no formulário de nova transação."
        />
      ) : (
        <ul className="divide-y divide-zinc-100">
          {sorted.map((transaction) => (
            <TransactionRow
              key={transaction.id}
              transaction={transaction}
              category={transaction.categoryId != null ? categoriesById.get(transaction.categoryId) : undefined}
              highlighted={transaction.id === editingId}
              actions={
                <TransactionActions
                  transactionId={transaction.id}
                  transactionName={transaction.name}
                  isEditing={transaction.id === editingId}
                  onEdit={() => setEditingId(transaction.id)}
                />
              }
            />
          ))}
        </ul>
      )}
    </TransactionsLayout>
  )
}

// Same element in every branch above, so TransactionForm keeps its state while the list reloads.
type TransactionsLayoutProps = {
  count?: number;
  children: ReactNode;
  editing?: TransactionResponse;
  editingCategory?: CategoryResponse;
  onStopEditing?: () => void;
};

function TransactionsLayout({ count, children, editing, editingCategory, onStopEditing }: TransactionsLayoutProps) {
  return (
    <div className="space-y-8">
      <PageHeader title="Transações" description="Todas as receitas e despesas registradas, da mais recente para a mais antiga." />

      {/* The form comes first in the DOM so phones show it above the (long) history;
          from lg up the grid places it in the right column, next to the list. */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        {editing ? (
          <Panel
            title="Editar transação"
            description={editing.name}
            className="lg:sticky lg:top-10 lg:col-start-2 lg:row-start-1"
            action={
              <button type="button" onClick={onStopEditing} className={subtleButtonClass}>
                Cancelar
              </button>
            }
          >
            {/* Keyed by id so switching to another transaction re-seeds the form state. */}
            <TransactionForm key={editing.id} transaction={editing} category={editingCategory} onDone={onStopEditing} />
          </Panel>
        ) : (
          <Panel title="Nova transação" className="lg:sticky lg:top-10 lg:col-start-2 lg:row-start-1">
            <TransactionForm />
          </Panel>
        )}

        <Panel
          title="Histórico"
          className="lg:col-start-1 lg:row-start-1"
          action={
            count !== undefined && (
              <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium tabular-nums text-zinc-600">
                {count}
                <span className="sr-only"> {count === 1 ? "transação" : "transações"}</span>
              </span>
            )
          }
        >
          {children}
        </Panel>
      </div>
    </div>
  )
}
