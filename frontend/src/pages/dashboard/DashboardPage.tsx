// Visão geral: totais e gastos por categoria, calculados no próprio frontend.

import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowDownRight, ArrowRight, ArrowUpRight, Scale } from "lucide-react";
import { useTransactions } from "../../hooks/useTransactions";
import { useCategories } from "../../hooks/useCategories";
import { summarizeTransactions } from "../../lib/summary";
import { formatCurrency, formatPercent } from "../../lib/format";
import { PageHeader } from "../../components/ui/PageHeader";
import { Panel } from "../../components/ui/Panel";
import { StatTile } from "../../components/ui/StatTile";
import { CategoryDot } from "../../components/ui/CategoryDot";
import { TransactionRow } from "../../components/ui/TransactionRow";
import { EmptyState, ErrorState, LoadingState } from "../../components/ui/States";
import { ExpensesByCategoryChart } from "../../components/charts/ExpensesByCategoryChart";

const RECENT_COUNT = 5;

function pluralize(count: number, singular: string, plural: string) {
  return `${count} ${count === 1 ? singular : plural}`;
}

export function DashboardPage() {
  const { data: transactions, isLoading, error } = useTransactions();
  const { data: categories, isLoading: categoriesLoading, error: categoriesError } = useCategories();

  const summary = useMemo(
    () => summarizeTransactions(transactions ?? [], categories ?? []),
    [transactions, categories],
  );

  const recent = useMemo(
    () =>
      [...(transactions ?? [])]
        .sort((a, b) => (b.date ?? b.createdAt).localeCompare(a.date ?? a.createdAt) || b.id - a.id)
        .slice(0, RECENT_COUNT),
    [transactions],
  );

  const header = <PageHeader title="Dashboard" description="Resumo calculado a partir de todas as transações registradas." />;

  if (isLoading || categoriesLoading) {
    return (
      <div className="space-y-8">
        {header}
        <Panel><LoadingState label="Calculando resumo…" /></Panel>
      </div>
    );
  }

  const loadError = error ?? categoriesError;
  if (loadError) {
    return (
      <div className="space-y-8">
        {header}
        <Panel><ErrorState message={loadError.message} /></Panel>
      </div>
    );
  }

  const categoriesById = new Map(categories?.map((category) => [category.id, category]));
  const hasTransactions = (transactions?.length ?? 0) > 0;
  const balanceSign = summary.balance < 0 ? "−" : "";

  return (
    <div className="space-y-8">
      {header}

      <Panel>
        <div className="grid divide-y divide-zinc-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <StatTile
            label="Receitas"
            value={formatCurrency(summary.income)}
            hint={pluralize(summary.incomeCount, "lançamento", "lançamentos")}
            marker={<ArrowUpRight className="h-3.5 w-3.5 text-accent" aria-hidden="true" />}
          />
          <StatTile
            label="Despesas"
            value={formatCurrency(summary.expense)}
            hint={pluralize(summary.expenseCount, "lançamento", "lançamentos")}
            marker={<ArrowDownRight className="h-3.5 w-3.5 text-zinc-400" aria-hidden="true" />}
          />
          <StatTile
            label="Saldo"
            value={`${balanceSign}${formatCurrency(Math.abs(summary.balance))}`}
            hint="Receitas menos despesas"
            marker={<Scale className="h-3.5 w-3.5 text-zinc-400" aria-hidden="true" />}
          />
        </div>
      </Panel>

      {!hasTransactions ? (
        <Panel>
          <EmptyState
            title="Nenhuma transação registrada"
            description="Os totais e o gráfico de gastos aparecem aqui assim que você adicionar suas primeiras transações."
            action={
              <Link
                to="/transactions"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-900 underline-offset-4 hover:underline"
              >
                Adicionar transação <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            }
          />
        </Panel>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
          <Panel title="Despesas por categoria" description="Total gasto em cada categoria, do maior para o menor.">
            {summary.expensesByCategory.length === 0 ? (
              <EmptyState title="Nenhuma despesa registrada" description="Apenas receitas foram lançadas até agora." />
            ) : (
              <>
                <div className="px-3 pt-4 pb-2">
                  <ExpensesByCategoryChart data={summary.expensesByCategory} />
                </div>
                <table className="w-full border-t border-zinc-200 text-sm">
                  <caption className="sr-only">Despesas por categoria</caption>
                  <thead>
                    <tr className="text-left text-xs text-zinc-500">
                      <th scope="col" className="px-5 py-2.5 font-medium">Categoria</th>
                      <th scope="col" className="px-5 py-2.5 text-right font-medium">Total</th>
                      <th scope="col" className="px-5 py-2.5 text-right font-medium">%</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 border-t border-zinc-100">
                    {summary.expensesByCategory.map((row) => (
                      <tr key={row.categoryId}>
                        <td className="px-5 py-2.5">
                          <span className="flex items-center gap-2 text-zinc-900">
                            <CategoryDot color={row.color} />
                            {row.name}
                          </span>
                        </td>
                        <td className="px-5 py-2.5 text-right tabular-nums text-zinc-900">{formatCurrency(row.total)}</td>
                        <td className="px-5 py-2.5 text-right tabular-nums text-zinc-500">{formatPercent(row.share)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </Panel>

          <Panel
            title="Transações recentes"
            action={
              <Link to="/transactions" className="text-xs font-medium text-zinc-500 hover:text-zinc-900">
                Ver todas
              </Link>
            }
          >
            <ul className="divide-y divide-zinc-100">
              {recent.map((transaction) => (
                <TransactionRow
                  key={transaction.id}
                  transaction={transaction}
                  category={transaction.categoryId != null ? categoriesById.get(transaction.categoryId) : undefined}
                />
              ))}
            </ul>
          </Panel>
        </div>
      )}
    </div>
  );
}
