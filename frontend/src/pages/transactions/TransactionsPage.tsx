// Tela de listagem de transações.

import type { ReactNode } from "react";
import { useTransactions } from "../../hooks/useTransactions";
import { useCategories } from "../../hooks/useCategories";
import { TransactionForm } from "./TransactionForm";
import { PageHeader } from "../../components/ui/PageHeader";
import { Panel } from "../../components/ui/Panel";
import { TransactionRow } from "../../components/ui/TransactionRow";
import { EmptyState, ErrorState, LoadingState } from "../../components/ui/States";

export function TransactionsPage() {
  const { data: transactions, isLoading, error } = useTransactions();
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  if (isLoading || categoriesLoading) return <TransactionsLayout><LoadingState label="Carregando transações…" /></TransactionsLayout>
  if (error) return <TransactionsLayout><ErrorState message={error.message} /></TransactionsLayout>

  const categoriesById = new Map(categories?.map((category) => [category.id, category]));
  // Newest first; transactions without a date fall back to when they were created.
  const sorted = [...(transactions ?? [])].sort((a, b) =>
    (b.date ?? b.createdAt).localeCompare(a.date ?? a.createdAt) || b.id - a.id
  );

  return (
    <TransactionsLayout count={sorted.length}>
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
            />
          ))}
        </ul>
      )}
    </TransactionsLayout>
  )
}

// Same element in every branch above, so TransactionForm keeps its state while the list reloads.
function TransactionsLayout({ count, children }: { count?: number; children: ReactNode }) {
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

        <Panel title="Nova transação" className="lg:sticky lg:top-10">
          <TransactionForm />
        </Panel>
      </div>
    </div>
  )
}
