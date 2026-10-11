// Tela de listagem de transações.

import { useState } from "react";
import type { ReactNode } from "react";
import type { CategoryResponse } from "../../types/category";
import type { TransactionResponse } from "../../types/transaction";
import { useTransactions } from "../../hooks/useTransactions";
import { useCategories } from "../../hooks/useCategories";
import { TransactionForm } from "./TransactionForm";
import { TransactionActions } from "./TransactionActions";
import { PageHeader } from "../../components/ui/PageHeader";
import { Panel } from "../../components/ui/Panel";
import { TransactionRow } from "../../components/ui/TransactionRow";
import { EmptyState, ErrorState, LoadingState } from "../../components/ui/States";

export function TransactionsPage() {
  const { data: transactions, isLoading, error } = useTransactions();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const [editingId, setEditingId] = useState<number | null>(null);

  if (isLoading || categoriesLoading) return <TransactionsLayout><LoadingState label="Carregando transações…" /></TransactionsLayout>
  if (error) return <TransactionsLayout><ErrorState message={error.message} /></TransactionsLayout>

  const categoriesById = new Map(categories?.map((category) => [category.id, category]));
  // Newest first; transactions without a date fall back to when they were created.
  // Derived from the list, so a transaction deleted while being edited closes the form.
  const editing = transactions?.find((transaction) => transaction.id === editingId);
  const editingProps = {
    editing,
    editingCategory: editing && categoriesById.get(editing.categoryId),
    onStopEditing: () => setEditingId(null),
  };

  const sorted = [...(transactions ?? [])].sort((a, b) =>
    (b.date ?? b.createdAt).localeCompare(a.date ?? a.createdAt) || b.id - a.id
  );

  return (
    <TransactionsLayout count={sorted.length} {...editingProps}>
      {sorted.length === 0 ? (
        <EmptyState
          title="Nenhuma transação ainda"
          description="Registre sua primeira receita ou despesa no formulário ao lado."
        />
      ) : (
        <ul className="divide-y divide-zinc-100">
          {sorted.map((transaction) => (
            <TransactionRow
              key={transaction.id}
              transaction={transaction}
              category={categoriesById.get(transaction.categoryId)}
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        <Panel
          title="Histórico"
          action={count !== undefined && <span className="text-xs tabular-nums text-zinc-400">{count}</span>}
        >
          {children}
        </Panel>

        {editing ? (
          <Panel
            title="Editar transação"
            className="lg:sticky lg:top-10"
            action={
              <button type="button" onClick={onStopEditing} className="text-xs font-medium text-zinc-500 hover:text-zinc-900">
                Cancelar
              </button>
            }
          >
            {/* Keyed by id so switching to another transaction re-seeds the form state. */}
            <TransactionForm key={editing.id} transaction={editing} category={editingCategory} onDone={onStopEditing} />
          </Panel>
        ) : (
          <Panel title="Nova transação" className="lg:sticky lg:top-10">
            <TransactionForm />
          </Panel>
        )}
      </div>
    </div>
  )
}
